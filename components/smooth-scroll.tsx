"use client"

import { useEffect } from "react"
import Lenis from "lenis"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

declare global {
  interface Window {
    __lenis?: Lenis
  }
}

/**
 * Premium smooth-scroll bootstrapper.
 *
 * - Initializes Lenis once for the document.
 * - Drives Lenis via `gsap.ticker` so any GSAP/ScrollTrigger animation is
 *   frame-perfectly synced with the smooth scroll.
 * - Forwards Lenis scroll events to `ScrollTrigger.update` so triggers fire
 *   against the eased scroll position, not the native one.
 * - Honors `prefers-reduced-motion`: in that case Lenis is not initialized;
 *   GSAP/ScrollTrigger still work against native scroll.
 * - Smooth-scrolls in-page anchor links via Lenis when active.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return

    gsap.registerPlugin(ScrollTrigger)

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let lenis: Lenis | null = null
    let removeAnchorListener: (() => void) | null = null
    let tickerFn: ((time: number) => void) | null = null

    if (!reducedMotion) {
      lenis = new Lenis({
        // Cinematic but not slow — feels weighted, not draggy.
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.4,
        lerp: 0.1,
      })

      window.__lenis = lenis

      // Sync ScrollTrigger with Lenis: triggers update on the eased scroll
      // position so any GSAP scrub is in lock-step with the visual scroll.
      lenis.on("scroll", ScrollTrigger.update)

      // Drive Lenis from gsap.ticker so all animations + scroll share one RAF.
      tickerFn = (time: number) => {
        // gsap.ticker emits seconds; Lenis expects ms.
        lenis!.raf(time * 1000)
      }
      gsap.ticker.add(tickerFn)
      gsap.ticker.lagSmoothing(0)

      // Smooth in-page anchor scroll.
      const handleAnchorClick = (event: MouseEvent) => {
        if (event.defaultPrevented) return
        if (event.button !== 0) return
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

        const anchor = (event.target as HTMLElement | null)?.closest("a")
        if (!anchor) return
        if (anchor.target && anchor.target !== "_self") return

        const href = anchor.getAttribute("href")
        if (!href || href.length < 2 || !href.startsWith("#")) return

        const id = decodeURIComponent(href.slice(1))
        const target = document.getElementById(id)
        if (!target) return

        event.preventDefault()
        lenis!.scrollTo(target, { offset: -80 })
        if (history.pushState) {
          history.pushState(null, "", `#${id}`)
        }
      }

      document.addEventListener("click", handleAnchorClick)
      removeAnchorListener = () => document.removeEventListener("click", handleAnchorClick)
    }

    // Always refresh ScrollTrigger after layout shifts (font load, image load).
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener("load", refresh)

    return () => {
      window.removeEventListener("load", refresh)
      removeAnchorListener?.()
      if (tickerFn) gsap.ticker.remove(tickerFn)
      if (lenis) {
        if (window.__lenis === lenis) {
          delete window.__lenis
        }
        lenis.destroy()
      }
      // Clean up only triggers tied to torn-down nodes; explicit components
      // own their own gsap.context cleanup below.
    }
  }, [])

  return null
}
