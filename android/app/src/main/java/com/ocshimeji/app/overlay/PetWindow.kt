package com.ocshimeji.app.overlay

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.Color
import android.graphics.PixelFormat
import android.graphics.drawable.GradientDrawable
import android.os.Build
import android.os.SystemClock
import android.util.TypedValue
import android.view.Gravity
import android.view.MotionEvent
import android.view.View
import android.view.ViewConfiguration
import android.view.WindowManager
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.FrameLayout
import android.widget.TextView
import com.ocshimeji.app.OverlaySettings
import com.ocshimeji.app.Web
import org.json.JSONObject
import kotlin.math.abs
import kotlin.math.hypot

/**
 * One floating desktop pet: a small transparent overlay window (tight around the
 * character so the rest of the screen stays fully usable) that hosts a WebView
 * rendering the character with the game's own art + CSS animations, plus a
 * separate non-touchable speech-bubble window.
 */
@SuppressLint("ViewConstructor", "ClickableViewAccessibility")
class PetWindow(
    private val ctx: Context,
    private val wm: WindowManager,
    val data: JSONObject,
    private var settings: OverlaySettings,
    private val host: Host,
) {
    interface Host {
        fun onPetTapped(p: PetWindow)
        fun onPetLongPress(p: PetWindow)
        fun onPetDropped(p: PetWindow)
        fun onPetDragStart(p: PetWindow)
    }

    val id: String = data.optString("id")
    val name: String = data.optString("name", "夥伴")
    private val density = ctx.resources.displayMetrics.density
    private var sizePx = (data.optDouble("size", 96.0).toFloat() * density * settings.scale).toInt()
    val brain = PetBrain(sizePx.toFloat(), sizePx.toFloat(), density)

    private val root = TouchLayer(ctx)
    private val web = WebView(ctx)
    private val lp = WindowManager.LayoutParams(
        sizePx, sizePx,
        WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
        WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
            WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL or
            WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS or
            WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED,
        PixelFormat.TRANSLUCENT,
    ).apply { gravity = Gravity.TOP or Gravity.START; title = "OCPet:$id" }

    private val bubble = TextView(ctx)
    private val bubbleLp = WindowManager.LayoutParams(
        WindowManager.LayoutParams.WRAP_CONTENT, WindowManager.LayoutParams.WRAP_CONTENT,
        WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
        WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
            WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE or
            WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
        PixelFormat.TRANSLUCENT,
    ).apply {
        gravity = Gravity.TOP or Gravity.START
        // Android 12+ only lets touches pass through another app's overlay when its
        // opacity is <= 0.8, so the (non-touchable) bubble stays just under that.
        alpha = .8f
        title = "OCPetBubble:$id"
    }
    private var bubbleShown = false
    private var bubbleUntil = 0L
    private var attached = false
    private var ready = false
    private var lastPose = ""
    private var lastDir = 0
    private var lastX = Int.MIN_VALUE
    private var lastY = Int.MIN_VALUE

    init {
        Web.harden(web)
        val loader = Web.loader(ctx)
        web.setBackgroundColor(Color.TRANSPARENT)
        web.isVerticalScrollBarEnabled = false
        web.isHorizontalScrollBarEnabled = false
        web.overScrollMode = View.OVER_SCROLL_NEVER
        web.webViewClient = object : WebViewClient() {
            override fun shouldInterceptRequest(v: WebView, r: WebResourceRequest): WebResourceResponse? = Web.intercept(loader, r)
            override fun shouldOverrideUrlLoading(v: WebView, r: WebResourceRequest) = true
            override fun onPageFinished(v: WebView, url: String) {
                if (!Web.isOwn(url)) return
                ready = true
                js("OCPet.load(${JSONObject.quote(data.toString())},${JSONObject.quote(settingsJson())})")
                lastPose = ""; syncPose()
            }
        }
        root.addView(web, FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT))
        root.alpha = settings.opacity
        web.loadUrl(Web.PET_URL)

        val pad = (10 * density).toInt()
        bubble.setPadding(pad + 2, pad - 2, pad + 2, pad - 2)
        bubble.setTextColor(Color.parseColor("#374C4D"))
        bubble.setTextSize(TypedValue.COMPLEX_UNIT_SP, 13f)
        bubble.maxWidth = (200 * density).toInt()
        bubble.background = GradientDrawable().apply {
            cornerRadius = 16 * density; setColor(Color.parseColor("#FFFEFA"))
            setStroke((1 * density).toInt(), Color.parseColor("#22395351"))
        }
        if (Build.VERSION.SDK_INT >= 28) bubble.elevation = 0f
    }

    private fun settingsJson() = JSONObject()
        .put("reduceMotion", settings.reduceMotion)
        .put("theme", data.optString("theme", "light")).toString()

    fun attach(px: Float, py: Float): Boolean {
        return try {
            brain.place(px, py)
            lp.x = brain.x.toInt(); lp.y = brain.y.toInt()
            wm.addView(root, lp); attached = true; true
        } catch (e: Exception) { false }   // permission revoked / bad token
    }

    fun detach() {
        hideBubble()
        if (attached) runCatching { wm.removeViewImmediate(root) }
        attached = false
        runCatching { web.stopLoading(); web.destroy() }
    }

    fun setVisible(v: Boolean) {
        root.visibility = if (v) View.VISIBLE else View.GONE
        if (!v) hideBubble()
        if (v) web.onResume() else web.onPause()
    }

    fun applySettings(s: OverlaySettings) {
        settings = s
        root.alpha = s.opacity
        brain.climbAllowed = s.climb
        brain.activity = s.activity * data.optDouble("activity", 1.0).toFloat()
        val ns = (data.optDouble("size", 96.0).toFloat() * density * s.scale).toInt()
        if (ns != sizePx) {
            sizePx = ns; brain.w = ns.toFloat(); brain.h = ns.toFloat()
            lp.width = ns; lp.height = ns
            if (attached) runCatching { wm.updateViewLayout(root, lp) }
            brain.clamp()
        }
        if (ready) js("OCPet.settings(${JSONObject.quote(settingsJson())})")
    }

    /** Called every frame by the service. */
    fun frame(dt: Float) {
        brain.tick(dt)
        val nx = brain.x.toInt(); val ny = brain.y.toInt()
        if (attached && (nx != lastX || ny != lastY)) {
            lp.x = nx; lp.y = ny; lastX = nx; lastY = ny
            runCatching { wm.updateViewLayout(root, lp) }
            if (bubbleShown) placeBubble()
        }
        syncPose()
        if (bubbleShown && SystemClock.uptimeMillis() > bubbleUntil) hideBubble()
    }

    private fun syncPose() {
        if (!ready) return
        val p = brain.pose(); val d = brain.dir
        if (p != lastPose || d != lastDir) {
            lastPose = p; lastDir = d
            js("OCPet.pose('$p',$d,${brain.wall})")
        }
    }

    fun react(kind: String) { if (ready) js("OCPet.react('${kind.filter { it.isLetter() }}')") }

    fun say(text: String, seconds: Float = 3.2f) {
        if (!settings.bubbles || text.isBlank() || !attached || root.visibility != View.VISIBLE) return
        bubble.text = text.take(80)
        bubbleUntil = SystemClock.uptimeMillis() + (seconds * 1000).toLong()
        if (!bubbleShown) {
            bubble.measure(View.MeasureSpec.UNSPECIFIED, View.MeasureSpec.UNSPECIFIED)
            placeBubble(false)
            if (runCatching { wm.addView(bubble, bubbleLp) }.isSuccess) bubbleShown = true
        } else placeBubble()
    }

    private fun placeBubble(update: Boolean = true) {
        bubble.measure(View.MeasureSpec.UNSPECIFIED, View.MeasureSpec.UNSPECIFIED)
        val bw = bubble.measuredWidth; val bh = bubble.measuredHeight
        val sw = brain.right
        bubbleLp.x = (brain.x + sizePx / 2f - bw / 2f).coerceIn(4f, maxOf(4f, sw - bw - 4f)).toInt()
        val above = brain.y - bh + sizePx * .08f
        bubbleLp.y = (if (above < brain.top + 4) brain.y + sizePx * .9f else above).toInt()
        if (update && bubbleShown) runCatching { wm.updateViewLayout(bubble, bubbleLp) }
    }

    fun hideBubble() {
        if (bubbleShown) runCatching { wm.removeViewImmediate(bubble) }
        bubbleShown = false
    }

    fun line(kind: String): String? {
        val lines = data.optJSONObject("lines")?.optJSONArray(kind) ?: return null
        if (lines.length() == 0) return null
        return lines.optString((0 until lines.length()).random())
    }

    private fun js(code: String) = runCatching { web.evaluateJavascript(code, null) }

    /** Intercepts every touch: tap = pet, long-press = menu, drag = pick up & throw. */
    private inner class TouchLayer(c: Context) : FrameLayout(c) {
        private val slop = ViewConfiguration.get(c).scaledTouchSlop
        private val longMs = ViewConfiguration.getLongPressTimeout().toLong()
        private var downX = 0f; private var downY = 0f
        private var offX = 0f; private var offY = 0f
        private var dragging = false
        private var downAt = 0L
        private var lastMove = 0L
        private var longFired = false
        private val longPress = Runnable {
            if (!dragging) { longFired = true; host.onPetLongPress(this@PetWindow) }
        }

        override fun onInterceptTouchEvent(ev: MotionEvent) = true

        override fun onTouchEvent(e: MotionEvent): Boolean {
            when (e.actionMasked) {
                MotionEvent.ACTION_DOWN -> {
                    downX = e.rawX; downY = e.rawY; offX = e.rawX - brain.x; offY = e.rawY - brain.y
                    dragging = false; longFired = false; downAt = SystemClock.uptimeMillis(); lastMove = downAt
                    postDelayed(longPress, longMs)
                }
                MotionEvent.ACTION_MOVE -> {
                    if (!dragging && hypot(e.rawX - downX, e.rawY - downY) > slop * 1.5f && !longFired) {
                        dragging = true; removeCallbacks(longPress)
                        brain.grab(); hideBubble(); host.onPetDragStart(this@PetWindow)
                    }
                    if (dragging) {
                        val now = SystemClock.uptimeMillis()
                        brain.dragTo(e.rawX - offX, e.rawY - offY, (now - lastMove) / 1000f)
                        lastMove = now
                    }
                }
                MotionEvent.ACTION_UP, MotionEvent.ACTION_CANCEL -> {
                    removeCallbacks(longPress)
                    if (dragging) { brain.release(); host.onPetDropped(this@PetWindow) }
                    else if (!longFired && e.actionMasked == MotionEvent.ACTION_UP &&
                        abs(e.rawX - downX) < slop * 2 && SystemClock.uptimeMillis() - downAt < longMs) {
                        host.onPetTapped(this@PetWindow)
                    }
                    dragging = false
                }
            }
            return true
        }
    }
}
