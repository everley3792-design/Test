package com.ocshimeji.app.overlay

import android.annotation.SuppressLint
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.ServiceInfo
import android.content.res.Configuration
import android.graphics.Color
import android.graphics.PixelFormat
import android.graphics.drawable.GradientDrawable
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.os.SystemClock
import android.os.VibrationEffect
import android.os.Vibrator
import android.provider.Settings
import android.util.TypedValue
import android.view.Gravity
import android.view.MotionEvent
import android.view.View
import android.view.WindowInsets
import android.view.WindowManager
import android.widget.LinearLayout
import android.widget.TextView
import com.ocshimeji.app.MainActivity
import com.ocshimeji.app.OverlaySettings
import com.ocshimeji.app.PetStore
import com.ocshimeji.app.R
import org.json.JSONObject
import java.util.Calendar
import kotlin.math.abs
import kotlin.random.Random

/**
 * Foreground service that owns the system-level desktop pets
 * (WindowManager TYPE_APPLICATION_OVERLAY windows). It never simulates needs:
 * it visualises the game's latest snapshot and queues interactions for the game.
 */
class OverlayService : Service(), PetWindow.Host {

    companion object {
        const val ACTION_START = "com.ocshimeji.overlay.START"
        const val ACTION_STOP = "com.ocshimeji.overlay.STOP"
        const val ACTION_RELOAD = "com.ocshimeji.overlay.RELOAD"
        const val ACTION_SETTINGS = "com.ocshimeji.overlay.SETTINGS"
        const val ACTION_TOGGLE_PAUSE = "com.ocshimeji.overlay.PAUSE"
        const val ACTION_TOGGLE_HIDE = "com.ocshimeji.overlay.HIDE"
        const val ACTION_APP_FOREGROUND = "com.ocshimeji.overlay.APP_FG"
        const val ACTION_CALL = "com.ocshimeji.overlay.CALL"
        const val EXTRA_FG = "fg"
        private const val CHANNEL = "desktop_pets"
        private const val NOTIF_ID = 33

        @Volatile var running = false; private set
        @Volatile var paused = false; private set
        @Volatile var hidden = false; private set

        fun send(ctx: Context, action: String, fg: Boolean? = null) {
            val i = Intent(ctx, OverlayService::class.java).setAction(action)
            if (fg != null) i.putExtra(EXTRA_FG, fg)
            if (action == ACTION_START) {
                if (Build.VERSION.SDK_INT >= 26) ctx.startForegroundService(i) else ctx.startService(i)
            } else if (running) ctx.startService(i)
        }
    }

    private lateinit var wm: WindowManager
    private val main = Handler(Looper.getMainLooper())
    private val pets = mutableListOf<PetWindow>()
    private var settings = OverlaySettings()
    private var appInFront = false
    private var screenOn = true
    private var lastFrame = 0L
    private var chatClock = 0f
    private var greetCooldown = 0f
    private var posSaveClock = 0f
    private var menu: View? = null

    private val loop = object : Runnable {
        override fun run() {
            if (!active()) { lastFrame = 0; return }
            val now = SystemClock.uptimeMillis()
            val dt = if (lastFrame == 0L) 0f else (now - lastFrame) / 1000f
            lastFrame = now
            for (p in pets) p.frame(dt)
            ambient(dt)
            main.postDelayed(this, (1000 / settings.fps).toLong())
        }
    }

    private val screenRx = object : BroadcastReceiver() {
        override fun onReceive(c: Context, i: Intent) {
            screenOn = i.action != Intent.ACTION_SCREEN_OFF
            refreshActivity()
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        wm = getSystemService(WINDOW_SERVICE) as WindowManager
        val f = IntentFilter().apply { addAction(Intent.ACTION_SCREEN_OFF); addAction(Intent.ACTION_SCREEN_ON); addAction(Intent.ACTION_USER_PRESENT) }
        if (Build.VERSION.SDK_INT >= 33) registerReceiver(screenRx, f, Context.RECEIVER_NOT_EXPORTED) else registerReceiver(screenRx, f)
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        // Must call startForeground promptly on every start.
        startForegroundCompat()
        if (!Settings.canDrawOverlays(this)) { stopEverything(); return START_NOT_STICKY }
        when (intent?.action) {
            ACTION_STOP -> { stopEverything(); return START_NOT_STICKY }
            ACTION_RELOAD -> reload()
            ACTION_SETTINGS -> { settings = PetStore.settings(this); pets.forEach { it.applySettings(settings) }; refreshActivity() }
            ACTION_TOGGLE_PAUSE -> { paused = !paused; pets.forEach { it.brain.paused = paused }; refreshActivity() }
            ACTION_TOGGLE_HIDE -> { hidden = !hidden; refreshActivity() }
            ACTION_APP_FOREGROUND -> { appInFront = intent.getBooleanExtra(EXTRA_FG, false); refreshActivity() }
            ACTION_CALL -> callAll()
            else -> if (!running || pets.isEmpty()) reload()
        }
        running = true
        updateNotification()
        return START_STICKY
    }

    private fun startForegroundCompat() {
        val nm = getSystemService(NotificationManager::class.java)
        if (nm.getNotificationChannel(CHANNEL) == null) {
            nm.createNotificationChannel(NotificationChannel(CHANNEL, getString(R.string.overlay_channel), NotificationManager.IMPORTANCE_MIN)
                .apply { description = getString(R.string.overlay_channel_desc); setShowBadge(false) })
        }
        val n = buildNotification()
        if (Build.VERSION.SDK_INT >= 34) startForeground(NOTIF_ID, n, ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE)
        else startForeground(NOTIF_ID, n)
    }

    private fun pi(action: String, code: Int): PendingIntent =
        PendingIntent.getService(this, code, Intent(this, OverlayService::class.java).setAction(action), PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT)

    private fun buildNotification(): Notification {
        val open = PendingIntent.getActivity(this, 1, Intent(this, MainActivity::class.java).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP), PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT)
        val text = when {
            hidden -> getString(R.string.overlay_hidden)
            paused -> getString(R.string.overlay_paused)
            else -> getString(R.string.overlay_running, pets.size)
        }
        return Notification.Builder(this, CHANNEL)
            .setSmallIcon(R.drawable.ic_notif)
            .setContentTitle(getString(R.string.app_name))
            .setContentText(text)
            .setOngoing(true)
            .setContentIntent(open)
            .addAction(Notification.Action.Builder(null, getString(if (paused) R.string.act_resume else R.string.act_pause), pi(ACTION_TOGGLE_PAUSE, 2)).build())
            .addAction(Notification.Action.Builder(null, getString(if (hidden) R.string.act_show else R.string.act_hide), pi(ACTION_TOGGLE_HIDE, 3)).build())
            .addAction(Notification.Action.Builder(null, getString(R.string.act_stop), pi(ACTION_STOP, 4)).build())
            .build()
    }

    private fun updateNotification() {
        if (!running) return
        runCatching { getSystemService(NotificationManager::class.java).notify(NOTIF_ID, buildNotification()) }
    }

    // ---------- pets ----------
    private fun reload() {
        settings = PetStore.settings(this)
        savePositions()
        closeMenu()
        pets.forEach { it.detach() }; pets.clear()
        val saved = PetStore.positions(this)
        val (l, t, r, f) = screenBox()
        val list = PetStore.loadPets(this)
        list.forEachIndexed { i, d ->
            val p = PetWindow(this, wm, d, settings, this)
            p.applySettings(settings)
            feedPersonality(p, d)
            val pos = saved[p.id]
            val px = if (pos != null) l + (r - l) * pos.first else l + (r - l) * (.2f + .3f * i)
            val py = if (pos != null) t + (f - t) * pos.second - p.brain.h else t + (f - t) * .3f
            p.brain.bounds(l, t, r, f)
            p.brain.onEvent = { ev -> onBrainEvent(p, ev) }
            if (p.attach(px, py)) pets += p
        }
        if (list.isNotEmpty() && pets.isEmpty()) { stopEverything(); return }   // overlay permission revoked
        if (list.isEmpty()) { stopEverything(); return }
        refreshActivity()
        updateNotification()
    }

    private fun feedPersonality(p: PetWindow, d: JSONObject) {
        val b = p.brain
        val st = d.optJSONObject("status") ?: JSONObject()
        b.energy = st.optDouble("energy", .8).toFloat().coerceIn(0f, 1f)
        b.mood = st.optDouble("mood", .7).toFloat().coerceIn(0f, 1f)
        val per = d.optJSONObject("personality") ?: JSONObject()
        b.curiosity = per.optDouble("curiosity", .5).toFloat()
        b.sociability = per.optDouble("social", .5).toFloat()
        b.sleepiness = per.optDouble("sleepy", .3).toFloat()
        b.activity = settings.activity * per.optDouble("activity", 1.0).toFloat()
        b.climbAllowed = settings.climb
        b.paused = paused
    }

    private fun screenBox(): FloatArray {
        val m = if (Build.VERSION.SDK_INT >= 30) wm.currentWindowMetrics else null
        val w: Int; val h: Int; var bottomInset = 0; var topInset = 0
        if (m != null) {
            w = m.bounds.width(); h = m.bounds.height()
            val ins = m.windowInsets.getInsetsIgnoringVisibility(WindowInsets.Type.navigationBars() or WindowInsets.Type.statusBars())
            bottomInset = ins.bottom; topInset = ins.top
        } else {
            val dm = resources.displayMetrics; w = dm.widthPixels; h = dm.heightPixels
        }
        return floatArrayOf(0f, topInset.toFloat(), w.toFloat(), (h - bottomInset).toFloat())
    }

    override fun onConfigurationChanged(newConfig: Configuration) {
        super.onConfigurationChanged(newConfig)
        // Rotation / fold: keep pets proportionally where they were and let them fall to the new floor.
        val (l, t, r, f) = screenBox()
        pets.forEach { p ->
            val b = p.brain
            val rx = ((b.x - b.left) / (b.right - b.left).coerceAtLeast(1f)).coerceIn(0f, 1f)
            b.bounds(l, t, r, f); b.x = l + (r - l) * rx; b.clamp(); b.go(PetBrain.S.FALL)
        }
        closeMenu()
    }

    private fun active() = running && screenOn && !hidden && !(appInFront && settings.hideInApp) && pets.isNotEmpty()

    private fun refreshActivity() {
        val visible = running && !hidden && !(appInFront && settings.hideInApp)
        pets.forEach { it.setVisible(visible && screenOn) }
        if (!visible) closeMenu()
        main.removeCallbacks(loop)
        if (active()) { lastFrame = 0; main.post(loop) } else savePositions()
        val hour = Calendar.getInstance().get(Calendar.HOUR_OF_DAY)
        val night = when (hour) { in 23..23, in 0..5 -> 1f; 22, 6 -> .5f; else -> 0f }
        pets.forEach { it.brain.nightFactor = night }
        updateNotification()
    }

    private fun ambient(dt: Float) {
        if (pets.isEmpty()) return
        chatClock += dt; greetCooldown -= dt; posSaveClock += dt
        if (posSaveClock > 20f) { posSaveClock = 0f; savePositions() }
        // Occasional idle chatter (frequency from settings).
        if (settings.chatter > 0f && chatClock > 38f / settings.chatter) {
            chatClock = Random.nextFloat() * 10f
            val p = pets.random()
            val kind = when (p.brain.state) { PetBrain.S.SLEEP -> null; PetBrain.S.CLIMB, PetBrain.S.HANG -> "climb"; else -> "idle" }
            if (kind != null) (p.line(kind) ?: p.line("idle"))?.let { p.say(it) }
        }
        // Multi-pet: friends that meet greet each other and face one another.
        if (settings.interact && pets.size > 1 && greetCooldown <= 0f) {
            for (i in pets.indices) for (j in i + 1 until pets.size) {
                val a = pets[i].brain; val b = pets[j].brain
                if (abs(a.x - b.x) < a.w * .9f && abs(a.y - b.y) < a.h * .4f &&
                    a.state in calm && b.state in calm) {
                    a.dir = if (b.x > a.x) 1 else -1; b.dir = -a.dir
                    a.cheer(); b.cheer()
                    pets[i].line("greet")?.let { pets[i].say(it, 2.6f) }
                    main.postDelayed({ pets.getOrNull(j)?.let { q -> q.line("greet")?.let { q.say(it, 2.6f) } } }, 1100)
                    PetStore.addEvent(this, JSONObject().put("type", "meet").put("id", pets[i].id).put("with", pets[j].id))
                    greetCooldown = 60f
                    return
                }
            }
        }
    }

    private val calm = setOf(PetBrain.S.IDLE, PetBrain.S.WALK, PetBrain.S.SIT, PetBrain.S.LOOK)

    private fun onBrainEvent(p: PetWindow, ev: String) {
        if (ev == "land_hard") { p.react("dizzy"); p.line("drop")?.let { p.say(it, 2.4f) } }
    }

    // ---------- PetWindow.Host ----------
    override fun onPetTapped(p: PetWindow) {
        closeMenu()
        buzz(12)
        if (p.brain.state == PetBrain.S.SLEEP) {
            p.brain.wake(); p.react("wake"); p.line("wake")?.let { p.say(it) }
            PetStore.addEvent(this, JSONObject().put("type", "wake").put("id", p.id))
            return
        }
        p.brain.cheer(); p.react("pet")
        p.line("pet")?.let { p.say(it) }
        PetStore.addEvent(this, JSONObject().put("type", "pet").put("id", p.id))
    }

    override fun onPetDragStart(p: PetWindow) { closeMenu(); p.react("held"); buzz(8) }

    override fun onPetDropped(p: PetWindow) {
        PetStore.addEvent(this, JSONObject().put("type", "carry").put("id", p.id))
    }

    override fun onPetLongPress(p: PetWindow) { buzz(20); openMenu(p) }

    private fun buzz(ms: Long) {
        if (!settings.haptics) return
        runCatching {
            val v = getSystemService(Vibrator::class.java)
            v?.vibrate(VibrationEffect.createOneShot(ms, VibrationEffect.DEFAULT_AMPLITUDE))
        }
    }

    private fun callAll() {
        val (l, _, r, _) = screenBox()
        val mid = (l + r) / 2f
        pets.forEachIndexed { i, p -> p.brain.wake(); p.brain.walkTo(mid - p.brain.w / 2 + (i - (pets.size - 1) / 2f) * p.brain.w * .9f) }
    }

    // ---------- long-press menu ----------
    @SuppressLint("ClickableViewAccessibility")
    private fun openMenu(p: PetWindow) {
        closeMenu()
        val d = resources.displayMetrics.density
        val box = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            val pad = (6 * d).toInt(); setPadding(pad, pad, pad, pad)
            background = GradientDrawable().apply { cornerRadius = 18 * d; setColor(Color.parseColor("#FFFEFA")); setStroke((1 * d).toInt(), Color.parseColor("#22395351")) }
            elevation = 8 * d
        }
        fun item(label: String, fn: () -> Unit) {
            box.addView(TextView(this).apply {
                text = label; setTextColor(Color.parseColor("#374C4D")); setTextSize(TypedValue.COMPLEX_UNIT_SP, 14f)
                val px = (14 * d).toInt(); val py = (9 * d).toInt(); setPadding(px, py, px, py)
                minWidth = (150 * d).toInt()
                setOnClickListener { closeMenu(); fn() }
            })
        }
        val st = p.data.optJSONObject("status")
        item("💬 ${p.name} 的狀態") {
            val mood = st?.optString("moodLabel", "") ?: ""
            val act = st?.optString("activity", "") ?: ""
            val hunger = ((st?.optDouble("hunger", .7) ?: .7) * 100).toInt()
            val energy = ((st?.optDouble("energy", .7) ?: .7) * 100).toInt()
            p.say(listOf(if (mood.isNotEmpty()) "心情：$mood" else null, "飽足 $hunger%・精力 $energy%", if (act.isNotEmpty()) act else null).filterNotNull().joinToString("\n"), 5f)
        }
        item("🤚 摸摸") { onPetTapped(p) }
        item(if (p.brain.state == PetBrain.S.SLEEP) "☀️ 叫醒" else "🌙 睡覺") {
            if (p.brain.state == PetBrain.S.SLEEP) { p.brain.wake(); p.react("wake") } else p.brain.sleepNow()
        }
        item("⬆️ 跳一下") { p.brain.hop() }
        if (pets.size > 1) item("📣 呼喚大家集合") { callAll() }
        item(if (paused) "▶️ 繼續活動" else "⏸ 暫停活動") { send(this, ACTION_TOGGLE_PAUSE) }
        item("🙈 先隱藏") { send(this, ACTION_TOGGLE_HIDE) }
        item("🏝 開啟遊戲") {
            startActivity(Intent(this, MainActivity::class.java).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP).putExtra("focusPet", p.id))
        }
        item("✕ 關閉桌面夥伴") { stopEverything() }

        val lp = WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT, WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or WindowManager.LayoutParams.FLAG_WATCH_OUTSIDE_TOUCH or WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL,
            PixelFormat.TRANSLUCENT,
        ).apply { gravity = Gravity.TOP or Gravity.START; title = "OCPetMenu" }
        box.measure(View.MeasureSpec.UNSPECIFIED, View.MeasureSpec.UNSPECIFIED)
        val b = p.brain
        lp.x = (b.x + b.w / 2 - box.measuredWidth / 2).coerceIn(8f, b.right - box.measuredWidth - 8f).toInt()
        lp.y = (b.y - box.measuredHeight - 8 * d).let { if (it < b.top + 8) b.y + b.h + 8 * d else it }.coerceAtMost(b.floor - box.measuredHeight).toInt()
        box.setOnTouchListener { _, e -> if (e.actionMasked == MotionEvent.ACTION_OUTSIDE) { closeMenu(); true } else false }
        if (runCatching { wm.addView(box, lp) }.isSuccess) menu = box
        p.brain.paused = true
        main.postDelayed({ if (menu == null) p.brain.paused = paused }, 100)
        menuPet = p
    }

    private var menuPet: PetWindow? = null

    private fun closeMenu() {
        menu?.let { runCatching { wm.removeViewImmediate(it) } }
        menu = null
        menuPet?.brain?.paused = paused
        menuPet = null
    }

    private fun savePositions() {
        if (pets.isEmpty()) return
        PetStore.savePositions(this, pets.associate { p ->
            val b = p.brain
            p.id to (((b.x - b.left) / (b.right - b.left).coerceAtLeast(1f)) to ((b.y + b.h - b.top) / (b.floor - b.top).coerceAtLeast(1f)))
        })
    }

    private fun stopEverything() {
        savePositions()
        closeMenu()
        main.removeCallbacks(loop)
        pets.forEach { it.detach() }; pets.clear()
        running = false; paused = false; hidden = false
        if (Build.VERSION.SDK_INT >= 24) stopForeground(STOP_FOREGROUND_REMOVE) else @Suppress("DEPRECATION") stopForeground(true)
        stopSelf()
    }

    override fun onDestroy() {
        runCatching { unregisterReceiver(screenRx) }
        main.removeCallbacksAndMessages(null)
        pets.forEach { it.detach() }; pets.clear()
        closeMenu()
        running = false
        super.onDestroy()
    }
}
