package com.ocshimeji.app.overlay

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import kotlin.random.Random

class PetBrainTest {
    private fun brain(seed: Int = 1) = PetBrain(100f, 100f, 2.75f, Random(seed)).apply { bounds(0f, 0f, 1080f, 2200f) }

    private fun run(b: PetBrain, seconds: Float, dt: Float = 1 / 30f) { var t = 0f; while (t < seconds) { b.tick(dt); t += dt } }

    @Test fun fallsToFloorAndLands() {
        val b = brain(); b.place(500f, 100f)
        assertEquals(PetBrain.S.FALL, b.state)
        run(b, 3f)
        assertEquals(b.floorY(), b.y, 0.5f)
        assertTrue("should have left FALL", b.state != PetBrain.S.FALL)
    }

    @Test fun staysInsideScreenForAMinute() {
        for (seed in 1..20) {
            val b = brain(seed); b.place(540f, 2100f); b.climbAllowed = true; b.activity = 1.5f
            run(b, 60f)
            assertTrue("x in bounds seed=$seed x=${b.x}", b.x >= b.left - b.w * .1f - 1 && b.x <= b.right - b.w * .9f + 1)
            assertTrue("y in bounds seed=$seed y=${b.y}", b.y <= b.floorY() + 1 && b.y >= b.top - b.h * .3f - 1)
        }
    }

    @Test fun climbsWallWhenWalkingIntoIt() {
        var climbed = false
        for (seed in 1..40) {
            val b = brain(seed); b.place(20f, 2100f); run(b, .5f)
            b.curiosity = 1f; b.activity = 2f; b.dir = -1; b.go(PetBrain.S.WALK, 10f)
            run(b, 4f)
            if (b.state == PetBrain.S.CLIMB || b.state == PetBrain.S.HANG) { climbed = true; assertEquals(-1, b.wall); break }
        }
        assertTrue("some seed should climb the left wall", climbed)
    }

    @Test fun dragAndThrowFlies() {
        val b = brain(); b.place(500f, 2100f); run(b, 1f)
        b.grab(); b.dragTo(520f, 1500f, .016f); b.dragTo(560f, 1400f, .016f)
        b.release()
        assertEquals(PetBrain.S.FALL, b.state)
        assertTrue(b.vx > 0)
        run(b, 4f)
        assertEquals(b.floorY(), b.y, 0.5f)
    }

    @Test fun pausedDoesNotMove() {
        val b = brain(); b.place(500f, 2100f); run(b, 1f)
        b.go(PetBrain.S.WALK, 10f); b.paused = true
        val x = b.x; run(b, 2f)
        assertEquals(x, b.x, 0.001f)
    }
}
