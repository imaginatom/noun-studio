"use client"

import { useEffect } from "react"

type MagneticScrollProps = {
  /**
   * CSS selector for opt-in magnet anchor elements. Each matching element
   * is treated as a soft snap target (its top edge).
   * @default '[data-snap-soft]'
   */
  selector?: string
  /**
   * Idle window in ms before a settle is attempted after the user stops
   * interacting. Generous so it never feels jumpy.
   * @default 280
   */
  idleMs?: number
  /**
   * Maximum scroll velocity (px/ms) below which a settle is allowed.
   * Effectively must be near-zero — user must have actually stopped.
   * @default 0.05
   */
  velocityThreshold?: number
  /**
   * Magnet zone, expressed as a fraction of viewport height. Snap is only
   * attempted when the nearest target's top is within ±vh*magnetZone of
   * the viewport top.
   * @default 0.09
   */
  magnetZone?: number
  /**
   * Soft snap easing duration in seconds.
   * @default 1.4
   */
  duration?: number
  /**
   * Disable the provider entirely (e.g., during onboarding flows).
   * @default false
   */
  disabled?: boolean
}

const INPUT_EVENTS: Array<keyof WindowEventMap> = [
  "wheel",
  "touchstart",
  "touchmove",
  "pointerdown",
  "keydown",
]

const KEY_INPUTS = new Set([
  "ArrowUp",
  "ArrowDown",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  " ",
  "Spacebar",
])

/**
 * Optional, opt-in magnetic section settling.
 *
 * Behavior:
 *   - Watches scroll velocity. After the user stops interacting AND scroll
 *     velocity is essentially zero AND has been so for `idleMs`, the nearest
 *     opt-in target within ±`magnetZone * vh` of the viewport top is selected.
 *   - The page eases to that target via Lenis (or `scrollIntoView` fallback).
 *   - Any user input — wheel, touch, keyboard, pointer — cancels and resets
 *     the timer immediately, so the user can stop midway between sections.
 *
 * Designed to feel almost imperceptible: most users will only notice that
 * sections "land" cleanly when they nearly stopped on a boundary.
 *
 * Honors `prefers-reduced-motion` — disabled in that case.
 *
 * Usage:
 *   1. Mount once near the root: `<MagneticScroll />`
 *   2. Tag sections to opt in: `<section data-snap-soft>...</section>`
 */
export function MagneticScroll({
  selector = "[data-snap-soft]",
  idleMs = 280,
  velocityThreshold = 0.05,
  magnetZone = 0.09,
  duration = 1.4,
  disabled = false,
}: MagneticScrollProps = {}) {
  useEffect(() => {
    if (disabled) return
    if (typeof window === "undefined") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let lastY = window.scrollY
    let lastT = performance.now()
    let velocity = 0
    let idleTimer: number | null = null
    let cancelled = true
    let userActiveAt = performance.now()
    let pendingSnap: number | null = null

    const cancelPendingSnap = () => {
      if (pendingSnap !== null) {
        cancelAnimationFrame(pendingSnap)
        pendingSnap = null
      }
    }

    const clearIdleTimer = () => {
      if (idleTimer !== null) {
        clearTimeout(idleTimer)
        idleTimer = null
      }
    }

    const onScroll = () => {
      const now = performance.now()
      const dy = window.scrollY - lastY
      const dt = now - lastT
      if (dt > 0) {
        // Exponential moving average for stability.
        const instantaneous = dy / dt
        velocity = velocity * 0.6 + instantaneous * 0.4
      }
      lastY = window.scrollY
      lastT = now

      // If we got a scroll while marked "cancelled" but not from user input,
      // it's a programmatic Lenis settle ramp — leave it.
      if (cancelled && now - userActiveAt > idleMs) {
        return
      }

      cancelled = false
      clearIdleTimer()
      idleTimer = window.setTimeout(maybeSettle, idleMs)
    }

    const maybeSettle = () => {
      idleTimer = null
      if (cancelled) return
      if (Math.abs(velocity) > velocityThreshold) return

      const targets = Array.from(document.querySelectorAll<HTMLElement>(selector))
      if (targets.length === 0) return

      const vh = window.innerHeight
      const zone = vh * magnetZone

      let nearest: { el: HTMLElement; offset: number } | null = null
      for (const el of targets) {
        const rect = el.getBoundingClientRect()
        // Distance from viewport top to section top.
        const offset = rect.top
        if (Math.abs(offset) > zone) continue
        if (!nearest || Math.abs(offset) < Math.abs(nearest.offset)) {
          nearest = { el, offset }
        }
      }

      if (!nearest) return
      if (Math.abs(nearest.offset) < 2) return // already aligned

      // Mark as cancelled now so the resulting programmatic scroll doesn't
      // re-trigger maybeSettle.
      cancelled = true
      userActiveAt = performance.now()

      const lenis = window.__lenis
      if (lenis) {
        lenis.scrollTo(nearest.el, {
          duration,
          easing: (t: number) => 1 - Math.pow(1 - t, 4),
        })
      } else {
        nearest.el.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }

    const markUserInput = () => {
      cancelled = true
      userActiveAt = performance.now()
      clearIdleTimer()
      cancelPendingSnap()
    }

    const onKey = (event: KeyboardEvent) => {
      if (KEY_INPUTS.has(event.key)) {
        markUserInput()
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    for (const evt of INPUT_EVENTS) {
      if (evt === "keydown") {
        window.addEventListener("keydown", onKey)
      } else {
        window.addEventListener(evt as "wheel", markUserInput as EventListener, {
          passive: true,
        })
      }
    }

    return () => {
      window.removeEventListener("scroll", onScroll)
      for (const evt of INPUT_EVENTS) {
        if (evt === "keydown") {
          window.removeEventListener("keydown", onKey)
        } else {
          window.removeEventListener(evt as "wheel", markUserInput as EventListener)
        }
      }
      clearIdleTimer()
      cancelPendingSnap()
    }
  }, [selector, idleMs, velocityThreshold, magnetZone, duration, disabled])

  return null
}
