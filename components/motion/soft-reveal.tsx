"use client"

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

type SoftRevealProps = {
  children: ReactNode
  /**
   * Translation distance in pixels for the entry phase. Element starts
   * at `+y` and eases to 0 as it enters the viewport.
   * @default 36
   */
  y?: number
  /** Initial opacity at the start of the entry phase. @default 0.4 */
  fromOpacity?: number
  /**
   * Counter-motion as the element exits the top of the viewport
   * (creates the "section overlap" feel — outgoing drifts up + fades a touch).
   * @default 28
   */
  exitY?: number
  /** Final opacity as the element exits the top of the viewport. @default 0.5 */
  exitOpacity?: number
  /** Scrub factor (higher = laggier, more cinematic). @default 0.8 */
  scrub?: number
  className?: string
  style?: CSSProperties
}

/**
 * Subtle entry + exit choreography for a section, scrubbed against scroll.
 * Designed to overlap with neighboring sections without forcing a fullpage
 * feel — a section's exit motion overlaps the next section's entry motion.
 *
 * Uses `transform` + `opacity` only. Honors `prefers-reduced-motion`.
 */
export function SoftReveal({
  children,
  y = 36,
  fromOpacity = 0.4,
  exitY = 28,
  exitOpacity = 0.5,
  scrub = 0.8,
  className,
  style,
}: SoftRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reducedMotion) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // Entry phase: element rises into place as it enters the viewport.
      gsap.fromTo(
        el,
        { y, opacity: fromOpacity },
        {
          y: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "top center",
            scrub,
            invalidateOnRefresh: true,
          },
        },
      )

      // Exit phase: element drifts up + fades a touch as it leaves the top.
      gsap.fromTo(
        el,
        { y: 0, opacity: 1 },
        {
          y: -exitY,
          opacity: exitOpacity,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "bottom center",
            end: "bottom top",
            scrub,
            invalidateOnRefresh: true,
          },
        },
      )
    }, el)

    return () => ctx.revert()
  }, [y, fromOpacity, exitY, exitOpacity, scrub, reducedMotion])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        willChange: reducedMotion ? undefined : "transform, opacity",
        ...style,
      }}
    >
      {children}
    </div>
  )
}
