package com.ocshimeji.app

import android.content.Context
import org.json.JSONArray
import org.json.JSONObject
import java.io.File

/**
 * Shared on-device storage between the game (WebView) and the overlay service.
 * The game is the single source of truth for characters / needs / mood: it pushes a
 * snapshot here (pets.json). The overlay only *visualises* that snapshot and records
 * interactions (pet_events.json) which the game applies the next time it is in front,
 * so the two never simulate the same character twice or overwrite each other.
 */
object PetStore {
    private const val PETS = "pets.json"
    private const val SETTINGS = "overlay_settings.json"
    private const val EVENTS = "pet_events.json"
    private const val POS = "pet_positions.json"
    const val MAX_SNAPSHOT_BYTES = 8 * 1024 * 1024
    private const val MAX_EVENTS = 400
    private val lock = Any()

    private fun file(ctx: Context, name: String) = File(ctx.filesDir, name)

    private fun read(ctx: Context, name: String): String? = synchronized(lock) {
        val f = file(ctx, name)
        if (f.exists()) runCatching { f.readText() }.getOrNull() else null
    }

    /** Atomic write: write a temp file then rename, so a crash never leaves half a file. */
    private fun write(ctx: Context, name: String, text: String) = synchronized(lock) {
        val tmp = file(ctx, "$name.tmp")
        tmp.writeText(text)
        if (!tmp.renameTo(file(ctx, name))) { file(ctx, name).writeText(text); tmp.delete() }
    }

    fun savePets(ctx: Context, json: String): Boolean {
        if (json.length > MAX_SNAPSHOT_BYTES) return false
        val obj = runCatching { JSONObject(json) }.getOrNull() ?: return false
        val pets = obj.optJSONArray("pets") ?: return false
        // Basic shape validation: never trust imported data blindly.
        val clean = JSONArray()
        for (i in 0 until minOf(pets.length(), 6)) {
            val p = pets.optJSONObject(i) ?: continue
            val id = p.optString("id")
            if (id.isEmpty() || id.length > 80 || !id.matches(Regex("[A-Za-z0-9_:.\\-]+"))) continue
            clean.put(p)
        }
        obj.put("pets", clean)
        write(ctx, PETS, obj.toString())
        return true
    }

    fun loadPets(ctx: Context): List<JSONObject> {
        val obj = read(ctx, PETS)?.let { runCatching { JSONObject(it) }.getOrNull() } ?: return emptyList()
        val arr = obj.optJSONArray("pets") ?: return emptyList()
        return (0 until arr.length()).mapNotNull { arr.optJSONObject(it) }
    }

    fun saveSettings(ctx: Context, json: String): Boolean {
        val o = runCatching { JSONObject(json) }.getOrNull() ?: return false
        write(ctx, SETTINGS, o.toString()); return true
    }

    fun settings(ctx: Context): OverlaySettings =
        OverlaySettings.from(read(ctx, SETTINGS)?.let { runCatching { JSONObject(it) }.getOrNull() })

    fun addEvent(ctx: Context, ev: JSONObject) = synchronized(lock) {
        val arr = read(ctx, EVENTS)?.let { runCatching { JSONArray(it) }.getOrNull() } ?: JSONArray()
        ev.put("ts", System.currentTimeMillis())
        arr.put(ev)
        val trimmed = if (arr.length() > MAX_EVENTS) JSONArray().also { t ->
            for (i in arr.length() - MAX_EVENTS until arr.length()) t.put(arr.get(i))
        } else arr
        write(ctx, EVENTS, trimmed.toString())
    }

    /** Returns all queued events and clears the queue (game applies them exactly once). */
    fun drainEvents(ctx: Context): String = synchronized(lock) {
        val s = read(ctx, EVENTS) ?: "[]"
        file(ctx, EVENTS).delete()
        s
    }

    fun savePositions(ctx: Context, map: Map<String, Pair<Float, Float>>) {
        val o = JSONObject()
        map.forEach { (k, v) -> o.put(k, JSONArray().put(v.first.toDouble()).put(v.second.toDouble())) }
        write(ctx, POS, o.toString())
    }

    fun positions(ctx: Context): Map<String, Pair<Float, Float>> {
        val o = read(ctx, POS)?.let { runCatching { JSONObject(it) }.getOrNull() } ?: return emptyMap()
        return o.keys().asSequence().mapNotNull { k ->
            val a = o.optJSONArray(k) ?: return@mapNotNull null
            k to (a.optDouble(0, .5).toFloat() to a.optDouble(1, 1.0).toFloat())
        }.toMap()
    }
}

/** Overlay preferences chosen in the game's settings page. */
data class OverlaySettings(
    val scale: Float = 1f,          // pet size multiplier
    val fps: Int = 30,              // movement update rate
    val activity: Float = 1f,       // 0.6 quiet … 1.5 lively
    val bubbles: Boolean = true,
    val chatter: Float = 1f,        // how often idle lines appear
    val climb: Boolean = true,      // allowed to climb screen edges
    val interact: Boolean = true,   // multiple pets greet each other
    val hideInApp: Boolean = true,  // hide while the game itself is open
    val reduceMotion: Boolean = false,
    val opacity: Float = 1f,
    val haptics: Boolean = true,
) {
    companion object {
        fun from(o: JSONObject?): OverlaySettings {
            if (o == null) return OverlaySettings()
            return OverlaySettings(
                scale = o.optDouble("scale", 1.0).toFloat().coerceIn(.5f, 1.8f),
                fps = o.optInt("fps", 30).coerceIn(10, 60),
                activity = o.optDouble("activity", 1.0).toFloat().coerceIn(.3f, 2f),
                bubbles = o.optBoolean("bubbles", true),
                chatter = o.optDouble("chatter", 1.0).toFloat().coerceIn(0f, 3f),
                climb = o.optBoolean("climb", true),
                interact = o.optBoolean("interact", true),
                hideInApp = o.optBoolean("hideInApp", true),
                reduceMotion = o.optBoolean("reduceMotion", false),
                opacity = o.optDouble("opacity", 1.0).toFloat().coerceIn(.3f, 1f),
                haptics = o.optBoolean("haptics", true),
            )
        }
    }
}
