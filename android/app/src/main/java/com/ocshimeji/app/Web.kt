package com.ocshimeji.app

import android.content.Context
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import androidx.webkit.WebViewAssetLoader

/** Shared WebView hardening + asset serving for the game and the overlay pets. */
object Web {
    const val ORIGIN = "https://appassets.androidplatform.net"
    const val GAME_URL = "$ORIGIN/assets/index.html"
    const val PET_URL = "$ORIGIN/assets/overlay.html"

    fun loader(ctx: Context): WebViewAssetLoader = WebViewAssetLoader.Builder()
        .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(ctx))
        .build()

    fun harden(v: WebView) {
        val s = v.settings
        s.javaScriptEnabled = true
        s.domStorageEnabled = true            // localStorage save data
        s.databaseEnabled = true
        s.allowFileAccess = false             // everything is served through the asset loader
        s.allowContentAccess = false
        @Suppress("DEPRECATION") run {
            s.allowFileAccessFromFileURLs = false
            s.allowUniversalAccessFromFileURLs = false
        }
        s.mediaPlaybackRequiresUserGesture = false
        s.mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
        s.setSupportMultipleWindows(false)
        s.javaScriptCanOpenWindowsAutomatically = false
        s.textZoom = 100                      // keep layout stable regardless of system font scale
    }

    fun intercept(loader: WebViewAssetLoader, req: WebResourceRequest): WebResourceResponse? =
        loader.shouldInterceptRequest(req.url)

    /** Only our own bundled pages may ever be shown inside the app's WebViews. */
    fun isOwn(url: String?): Boolean = url != null && url.startsWith("$ORIGIN/assets/")
}
