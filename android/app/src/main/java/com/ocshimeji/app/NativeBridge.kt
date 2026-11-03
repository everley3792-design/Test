package com.ocshimeji.app

import android.content.ContentValues
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Environment
import android.provider.MediaStore
import android.provider.Settings
import android.webkit.JavascriptInterface
import android.widget.Toast
import com.ocshimeji.app.overlay.OverlayService
import org.json.JSONObject
import java.io.File

/**
 * The ONLY native surface exposed to the game page (window.OCNative). Every method is
 * narrow and validates its input; imported characters are plain data and never get
 * access to anything beyond these calls. Navigation to any other origin is blocked
 * in MainActivity, so only our bundled page can reach this object.
 */
class NativeBridge(private val act: MainActivity) {

    @JavascriptInterface
    fun platform(): String = JSONObject()
        .put("android", true)
        .put("sdk", Build.VERSION.SDK_INT)
        .put("app", BuildConfig.VERSION_NAME)
        .put("overlay", true)
        .toString()

    @JavascriptInterface
    fun canDrawOverlays(): Boolean = Settings.canDrawOverlays(act)

    @JavascriptInterface
    fun requestOverlayPermission() = act.runOnUiThread { act.openOverlayPermission() }

    @JavascriptInterface
    fun isOverlayRunning(): Boolean = OverlayService.running

    @JavascriptInterface
    fun overlayState(): String = JSONObject()
        .put("running", OverlayService.running)
        .put("paused", OverlayService.paused)
        .put("hidden", OverlayService.hidden)
        .put("permission", Settings.canDrawOverlays(act))
        .toString()

    /** Legacy name used by the 2.x settings switch. */
    @JavascriptInterface
    fun setOverlayEnabled(on: Boolean): Boolean {
        if (!on) { OverlayService.send(act, OverlayService.ACTION_STOP); return false }
        if (!Settings.canDrawOverlays(act)) { requestOverlayPermission(); return false }
        if (PetStore.loadPets(act).isEmpty()) return false
        act.runOnUiThread {
            act.askNotificationPermission()
            OverlayService.send(act, OverlayService.ACTION_START)
            OverlayService.send(act, OverlayService.ACTION_APP_FOREGROUND, true)
        }
        return true
    }

    /** Snapshot of the characters chosen as desktop pets (art, lines, mood, needs …). */
    @JavascriptInterface
    fun syncPets(json: String): Boolean {
        val ok = PetStore.savePets(act, json)
        if (ok && OverlayService.running) OverlayService.send(act, OverlayService.ACTION_RELOAD)
        return ok
    }

    @JavascriptInterface
    fun setOverlaySettings(json: String): Boolean {
        val ok = PetStore.saveSettings(act, json)
        if (ok && OverlayService.running) OverlayService.send(act, OverlayService.ACTION_SETTINGS)
        return ok
    }

    @JavascriptInterface
    fun overlayCommand(cmd: String) {
        val a = when (cmd) {
            "pause" -> OverlayService.ACTION_TOGGLE_PAUSE
            "hide" -> OverlayService.ACTION_TOGGLE_HIDE
            "call" -> OverlayService.ACTION_CALL
            "stop" -> OverlayService.ACTION_STOP
            else -> return
        }
        OverlayService.send(act, a)
    }

    /** Interactions that happened on the desktop since last time; cleared on read. */
    @JavascriptInterface
    fun drainPetEvents(): String = PetStore.drainEvents(act)

    @JavascriptInterface
    fun vibrate(ms: Int) = act.vibrate(ms.coerceIn(1, 400).toLong())

    /** Backups / character packs → the public Downloads folder. */
    @JavascriptInterface
    fun saveFile(name: String, content: String): Boolean {
        val safe = name.replace(Regex("[^\\w.\\-一-龥]"), "_").take(80).ifEmpty { "oc-shimeji.json" }
        return try {
            if (Build.VERSION.SDK_INT >= 29) {
                val cv = ContentValues().apply {
                    put(MediaStore.Downloads.DISPLAY_NAME, safe)
                    put(MediaStore.Downloads.MIME_TYPE, if (safe.endsWith(".json")) "application/json" else "application/octet-stream")
                    put(MediaStore.Downloads.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS + "/OC Shimeji")
                }
                val uri: Uri = act.contentResolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, cv) ?: return false
                act.contentResolver.openOutputStream(uri)?.use { it.write(content.toByteArray()) }
            } else {
                val dir = act.getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS) ?: return false
                File(dir, safe).writeText(content)
            }
            act.runOnUiThread { Toast.makeText(act, "已儲存到「下載/OC Shimeji」：$safe", Toast.LENGTH_LONG).show() }
            true
        } catch (e: Exception) {
            act.runOnUiThread { Toast.makeText(act, "儲存失敗：${e.message}", Toast.LENGTH_LONG).show() }
            false
        }
    }

    @JavascriptInterface
    fun openAppSettings() = act.runOnUiThread {
        act.startActivity(Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.parse("package:" + act.packageName)))
    }
}
