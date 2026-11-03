package com.ocshimeji.app.overlay

import kotlin.math.abs
import kotlin.math.max
import kotlin.math.min
import kotlin.random.Random

/**
 * Shimeji-style behaviour + physics for one desktop pet. Pure Kotlin (no Android
 * types) so it stays deterministic and testable. Coordinates are the window's
 * top-left corner in screen pixels; [w]/[h] is the window size.
 *
 * Personality inputs (from the game snapshot) bias the choices — they are
 * tendencies, not hard rules: an energetic character walks/climbs more, a sleepy
 * one naps more, everyone sleeps more late at night.
 */
class PetBrain(
    var w: Float, var h: Float,
    private val density: Float,
    private val rnd: Random = Random.Default,
) {
    enum class S { FALL, LAND, IDLE, WALK, RUN, SIT, SLEEP, CLIMB, HANG, JUMP, DRAG, HAPPY, LOOK }

    // Screen box the pet lives in (pixels).
    var left = 0f; var top = 0f; var right = 1080f; var floor = 2000f

    var x = 0f; var y = 0f
    var vx = 0f; var vy = 0f
    var dir = 1                 // 1 = facing right, -1 = facing left
    var state = S.FALL; private set
    var wall = 0                // -1 left wall, 1 right wall while climbing
    private var t = 0f          // time in current state
    private var dur = 1f        // planned duration of current state

    // Personality / status (0..1), refreshed from the game snapshot.
    var energy = .8f
    var mood = .7f
    var curiosity = .5f
    var sociability = .5f
    var sleepiness = .3f
    var activity = 1f
    var climbAllowed = true
    var nightFactor = 0f        // 0 day … 1 deep night
    var paused = false

    /** Something worth reacting to happened (land after drop, wall reached …). */
    var onEvent: ((String) -> Unit)? = null

    private val g get() = 2600f * density / 2.75f          // gravity, scaled by screen density
    private val walkSpeed get() = 34f * density * (0.75f + energy * .5f) * activity
    private val runSpeed get() = walkSpeed * 2.4f
    private val climbSpeed get() = 22f * density

    fun bounds(l: Float, t: Float, r: Float, f: Float) { left = l; top = t; right = r; floor = f; clamp() }

    fun place(px: Float, py: Float) { x = px; y = py; clamp(); go(S.FALL) }

    fun clamp() {
        x = x.coerceIn(left - w * .1f, max(left, right - w * .9f))
        y = y.coerceIn(top - h * .3f, floorY())
    }

    fun floorY() = floor - h
    private fun onFloor() = y >= floorY() - 1f

    fun go(s: S, d: Float = 0f) { state = s; t = 0f; dur = d }

    // ---------- touch-driven transitions ----------
    fun grab() { go(S.DRAG); vx = 0f; vy = 0f }
    fun dragTo(nx: Float, ny: Float, dt: Float) {
        if (dt > 0f) { vx = (vx * .5f + (nx - x) / dt * .5f); vy = (vy * .5f + (ny - y) / dt * .5f) }
        x = nx; y = ny
        if (abs(vx) > 30f) dir = if (vx > 0) 1 else -1
    }
    fun release() {
        vx = vx.coerceIn(-3000f * density / 2.75f, 3000f * density / 2.75f)
        vy = vy.coerceIn(-3000f * density / 2.75f, 2000f * density / 2.75f)
        go(S.FALL)
    }
    fun cheer() { if (state != S.DRAG && state != S.FALL && state != S.CLIMB) { vx = 0f; go(S.HAPPY, 1.6f) } }
    fun hop() { if (onFloor() && state != S.DRAG) { vy = -900f * density / 2.75f; vx = dir * walkSpeed; go(S.JUMP) } }
    fun wake() { if (state == S.SLEEP) go(S.IDLE, 1.2f) }
    fun sleepNow() { if (onFloor()) go(S.SLEEP, 20f + rnd.nextFloat() * 20f) }
    fun walkTo(tx: Float) { if (onFloor() && state != S.DRAG) { dir = if (tx > x) 1 else -1; target = tx; go(S.RUN, 8f) } }
    private var target = Float.NaN

    fun tick(dtIn: Float) {
        if (paused && state != S.DRAG) return
        val dt = min(dtIn, .05f)
        t += dt
        when (state) {
            S.DRAG -> {}
            S.FALL, S.JUMP -> {
                vy += g * dt
                x += vx * dt; y += vy * dt
                vx *= (1f - .25f * dt)
                if (x < left - w * .1f) { x = left - w * .1f; vx = abs(vx) * .45f; dir = 1 }
                if (x > right - w * .9f) { x = right - w * .9f; vx = -abs(vx) * .45f; dir = -1 }
                if (y < top - h * .3f) { y = top - h * .3f; vy = abs(vy) * .3f }
                if (y >= floorY()) {
                    val hard = vy > 1200f * density / 2.75f
                    y = floorY(); vy = 0f; vx = 0f
                    go(S.LAND, if (hard) .55f else .25f)
                    onEvent?.invoke(if (hard) "land_hard" else "land")
                }
            }
            S.LAND -> if (t >= dur) decide()
            S.WALK, S.RUN -> {
                val sp = if (state == S.RUN) runSpeed else walkSpeed
                x += dir * sp * dt
                if (!target.isNaN() && abs(target - x) < sp * dt * 2) { target = Float.NaN; go(S.IDLE, 1.5f); onEvent?.invoke("arrive") }
                val minX = left - w * .1f; val maxX = right - w * .9f
                if (x <= minX || x >= maxX) {
                    x = x.coerceIn(minX, maxX)
                    target = Float.NaN
                    if (climbAllowed && rnd.nextFloat() < .35f * (.5f + curiosity) * activity) {
                        wall = if (x <= minX) -1 else 1; go(S.CLIMB, 2f + rnd.nextFloat() * 5f)
                    } else { dir = -dir; go(S.IDLE, .6f + rnd.nextFloat()) }
                } else if (t >= dur) decide()
                if (!onFloor()) go(S.FALL)
            }
            S.CLIMB -> {
                y -= climbSpeed * dt
                if (y <= top + h * .2f || t >= dur) { go(S.HANG, 1.2f + rnd.nextFloat() * 2.5f) }
            }
            S.HANG -> if (t >= dur) {
                // Push off the wall toward the middle of the screen.
                dir = -wall; vx = -wall * (220f + rnd.nextFloat() * 260f) * density / 2.75f; vy = -260f * density / 2.75f
                wall = 0; go(S.FALL)
            }
            S.IDLE, S.SIT, S.LOOK, S.HAPPY -> if (t >= dur) decide()
            S.SLEEP -> if (t >= dur && rnd.nextFloat() < .02f + (1 - nightFactor) * .05f) go(S.IDLE, 1.5f)
        }
        if (state != S.DRAG && state != S.CLIMB && state != S.HANG && state != S.FALL && state != S.JUMP && !onFloor()) go(S.FALL)
    }

    /** Weighted choice of the next activity. */
    private fun decide() {
        val tired = (1f - energy) * .8f + sleepiness * .4f + nightFactor * .6f
        val a = activity
        val weights = listOf(
            S.IDLE to 2.2f,
            S.WALK to 3.0f * a * (.5f + energy),
            S.RUN to .5f * a * energy * (.4f + mood),
            S.SIT to 1.4f + tired,
            S.SLEEP to max(0f, tired * 1.6f - .2f),
            S.LOOK to .8f + curiosity,
            S.JUMP to .35f * a * mood,
        )
        var r = rnd.nextFloat() * weights.sumOf { it.second.toDouble() }.toFloat()
        var pick = S.IDLE
        for ((s, wt) in weights) { r -= wt; if (r <= 0f) { pick = s; break } }
        when (pick) {
            S.WALK -> { if (rnd.nextFloat() < .4f) dir = -dir; go(S.WALK, 2.5f + rnd.nextFloat() * 6f) }
            S.RUN -> { if (rnd.nextFloat() < .5f) dir = -dir; go(S.RUN, 1.2f + rnd.nextFloat() * 2f) }
            S.SIT -> go(S.SIT, 4f + rnd.nextFloat() * 8f)
            S.SLEEP -> go(S.SLEEP, 15f + rnd.nextFloat() * 40f)
            S.LOOK -> go(S.LOOK, 2f + rnd.nextFloat() * 2f)
            S.JUMP -> hop()
            else -> go(S.IDLE, 1.5f + rnd.nextFloat() * 3.5f)
        }
    }

    /** Pose name understood by overlay.js (maps to the game's existing CSS states). */
    fun pose(): String = when (state) {
        S.FALL -> if (vy < 0) "jump" else "fall"
        S.JUMP -> "jump"
        S.LAND -> "land"
        S.WALK -> "walk"
        S.RUN -> "run"
        S.SIT -> "sit"
        S.SLEEP -> "sleep"
        S.CLIMB -> "climb"
        S.HANG -> "hang"
        S.DRAG -> "held"
        S.HAPPY -> "happy"
        S.LOOK -> "look"
        S.IDLE -> "idle"
    }
}
