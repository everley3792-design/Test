package com.ocshimeji.app

import android.Manifest
import android.annotation.SuppressLint
import android.app.Activity
import android.content.ActivityNotFoundException
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Color
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.VibrationEffect
import android.os.Vibrator
import android.provider.Settings
import android.view.View
import android.view.WindowInsets
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.webkit.WebViewAssetLoader
import com.ocshimeji.app.overlay.OverlayService
import org.json.JSONObject

class MainActivity : Activity() {
    private lateinit var web: WebView
    private lateinit var loader: WebViewAssetLoader
    private var fileCallback: ValueCallback<Array<Uri>>? = null
    private var pageReady = false

    companion object {
        private const val REQ_FILES = 41
        private const val REQ_OVERLAY = 42
        private const val REQ_NOTIF = 43
    }

    @SuppressLint("SetJavaScriptEnabled", "JavascriptInterface")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.setDecorFitsSystemWindowsCompat()
        loader = Web.loader(this)
        web = WebView(this)
        web.setBackgroundColor(Color.parseColor("#F4F2EC"))
        Web.harden(web)
        web.overScrollMode = View.OVER_SCROLL_NEVER
        web.webViewClient = object : WebViewClient() {
            override fun shouldInterceptRequest(v: WebView, r: WebResourceRequest): WebResourceResponse? = Web.intercept(loader, r)
            override fun shouldOverrideUrlLoading(v: WebView, r: WebResourceRequest): Boolean {
                val u = r.url.toString()
                if (Web.isOwn(u)) return false
                // External links open in the browser, never inside the bridge-enabled WebView.
                if (u.startsWith("https://")) runCatching { startActivity(Intent(Intent.ACTION_VIEW, r.url)) }
                return true
            }
            override fun onPageFinished(v: WebView, url: String) {
                pageReady = Web.isOwn(url)
                pushInsets()
                js("window.OCSNative&&OCSNative.onNativeResume&&OCSNative.onNativeResume()")
            }
        }
        web.webChromeClient = object : WebChromeClient() {
            override fun onShowFileChooser(v: WebView, cb: ValueCallback<Array<Uri>>, p: FileChooserParams): Boolean {
                fileCallback?.onReceiveValue(null)
                fileCallback = cb
                val i = Intent(Intent.ACTION_OPEN_DOCUMENT).addCategory(Intent.CATEGORY_OPENABLE)
                val types = p.acceptTypes.filter { it.isNotBlank() }
                i.type = if (types.size == 1) types[0] else "*/*"
                if (types.size > 1) i.putExtra(Intent.EXTRA_MIME_TYPES, types.toTypedArray())
                if (p.mode == FileChooserParams.MODE_OPEN_MULTIPLE) i.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true)
                return try { startActivityForResult(i, REQ_FILES); true } catch (e: ActivityNotFoundException) { fileCallback = null; false }
            }
        }
        web.addJavascriptInterface(NativeBridge(this), "OCNative")
        web.setOnApplyWindowInsetsListener { v, insets -> lastInsets = insets; pushInsets(); v.onApplyWindowInsets(insets) }
        setContentView(web)
        if (savedInstanceState != null) web.restoreState(savedInstanceState) else web.loadUrl(Web.GAME_URL)
        handleIntent(intent)
    }

    private var lastInsets: WindowInsets? = null

    private fun android.view.Window.setDecorFitsSystemWindowsCompat() {
        if (Build.VERSION.SDK_INT >= 30) setDecorFitsSystemWindows(false)
        else @Suppress("DEPRECATION") { decorView.systemUiVisibility = View.SYSTEM_UI_FLAG_LAYOUT_STABLE or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION }
    }

    /** Safe-area insets in CSS px → OCApp.setInsets (status bar / gesture bar). */
    private fun pushInsets() {
        val ins = lastInsets ?: return
        val d = resources.displayMetrics.density
        val top: Int; val bottom: Int
        if (Build.VERSION.SDK_INT >= 30) {
            val i = ins.getInsets(WindowInsets.Type.systemBars() or WindowInsets.Type.displayCutout())
            top = i.top; bottom = i.bottom
        } else @Suppress("DEPRECATION") { top = ins.systemWindowInsetTop; bottom = ins.systemWindowInsetBottom }
        js("window.OCApp&&OCApp.setInsets({top:${(top / d).toInt()},bottom:${(bottom / d).toInt()}})")
    }

    fun js(code: String) { if (pageReady) web.evaluateJavascript(code, null) }

    override fun onNewIntent(intent: Intent) { super.onNewIntent(intent); setIntent(intent); handleIntent(intent) }

    private fun handleIntent(i: Intent?) {
        val pet = i?.getStringExtra("focusPet") ?: return
        if (pet.matches(Regex("[A-Za-z0-9_:.\\-]{1,80}"))) web.postDelayed({ js("window.OCApp&&OCApp.setActiveCharacter(${JSONObject.quote(pet)})") }, 600)
    }

    override fun onResume() {
        super.onResume()
        web.onResume()
        js("window.OCApp&&OCApp.onResume();window.OCSNative&&OCSNative.onNativeResume&&OCSNative.onNativeResume()")
        OverlayService.send(this, OverlayService.ACTION_APP_FOREGROUND, true)
    }

    override fun onPause() {
        js("window.OCApp&&OCApp.onPause();window.OCSNative&&OCSNative.onNativePause&&OCSNative.onNativePause()")
        OverlayService.send(this, OverlayService.ACTION_APP_FOREGROUND, false)
        web.onPause()
        super.onPause()
    }

    override fun onSaveInstanceState(outState: Bundle) { super.onSaveInstanceState(outState); web.saveState(outState) }

    @Deprecated("Activity API")
    override fun onBackPressed() {
        if (!pageReady) { @Suppress("DEPRECATION") super.onBackPressed(); return }
        web.evaluateJavascript("(window.OCApp&&OCApp.back())?'1':'0'") { r ->
            if (r?.contains("1") != true) moveTaskToBack(true)
        }
    }

    fun openOverlayPermission() {
        Toast.makeText(this, R.string.need_permission, Toast.LENGTH_LONG).show()
        @Suppress("DEPRECATION")
        startActivityForResult(Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:$packageName")), REQ_OVERLAY)
    }

    fun askNotificationPermission() {
        if (Build.VERSION.SDK_INT >= 33 && checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED)
            requestPermissions(arrayOf(Manifest.permission.POST_NOTIFICATIONS), REQ_NOTIF)
    }

    fun vibrate(ms: Long) = runCatching {
        getSystemService(Vibrator::class.java)?.vibrate(VibrationEffect.createOneShot(ms, VibrationEffect.DEFAULT_AMPLITUDE))
    }

    @Deprecated("Activity API")
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        @Suppress("DEPRECATION") super.onActivityResult(requestCode, resultCode, data)
        when (requestCode) {
            REQ_FILES -> {
                val cb = fileCallback; fileCallback = null
                if (resultCode != RESULT_OK || data == null) { cb?.onReceiveValue(null); return }
                val uris = mutableListOf<Uri>()
                data.clipData?.let { c -> for (k in 0 until c.itemCount) uris += c.getItemAt(k).uri }
                if (uris.isEmpty()) data.data?.let { uris += it }
                cb?.onReceiveValue(uris.toTypedArray())
            }
            REQ_OVERLAY -> js("window.OCSNative&&OCSNative.onPermissionResult&&OCSNative.onPermissionResult(${Settings.canDrawOverlays(this)})")
        }
    }

    override fun onDestroy() {
        web.destroy()
        super.onDestroy()
    }
}
