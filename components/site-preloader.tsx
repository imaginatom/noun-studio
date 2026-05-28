"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"

/** Minimum time the preloader stays on screen even when the page loads instantly. */
const MIN_VISIBLE_MS = 1600
/** Outro duration of the *slowest* parallax layer (ms). The plate finishes
 *  sooner; this controls when the preloader unmounts. */
const EXIT_MS = 900

// The two compound paths in the source SVG are split into individual `<path>`
// elements so we can stagger them. Keeping the d strings as constants also
// avoids re-allocating arrays on every render.
const GREY_PATHS = [
  // Vertical "columns"
  "M400 291h110v691H400z",
  "M610 291h110v691H610z",
  "M800 291h110v691H800z",
  "M1010 291h110v691h-110z",
  "M1199 291h110v691h-110z",
  "M1409 291h110v691h-110z",
  // Top caps + bottom connector
  "M510 291h100v50H510z",
  "M1309 291h100v50h-100z",
  "M910 932h100v50H910z",
  // Diamond
  "M918 193.426 960.426 151l42.427 42.426-42.427 42.426z",
] as const

// Straight grid guides — rendered at reduced opacity so the signature
// swirl reads as the focal element.
const STRAIGHT_GUIDE_PATHS = [
  // Vertical guides
  "M399.5 1090V190",
  "M1092.5 1090V190",
  "M1256.5 1090V190",
  "M1519.5 1090V190",
  // Horizontal guides
  "M1580 290.5H340",
  "M1580 717.5H340",
  "M1580 818.5H340",
  "M1580 982.5H340",
  // Asterisk accent (top centre)
  "M947 250l70-70",
  "M905 206l70-70",
  "M972 248l-70-70",
  "M1015 206l-70-70",
] as const

// Signature swirl — the focal element. Drawn on its own track so it can
// start first and finish last, independent of the staggered group above.
const SWIRL_PATH =
  "M400.5 982.5c20.5-380.5 393.5-692 692-692s429.99 223.062 427 427-166 265-263 265-164-101.5-164-164 46.76-105.706 101.5-101 62.5 36.5 62.5 61.5-22.5 39.5-40.5 39.5-22-14-22-22.5"

/** Duration of the swirl draw-in (s). Tuned so it clearly outlasts the stagger. */
const SWIRL_DURATION = 1.7

export function SitePreloader() {
  const containerRef = useRef<HTMLDivElement>(null)
  // Two parallax layers — animated independently on exit so they slide up
  // off-screen at different speeds.
  const plateRef = useRef<HTMLDivElement>(null)
  const artRef = useRef<HTMLDivElement>(null)
  const borderRef = useRef<SVGPathElement>(null)
  const strokesGroupRef = useRef<SVGGElement>(null)
  const columnsGroupRef = useRef<SVGGElement>(null)
  const swirlRef = useRef<SVGPathElement>(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    document.documentElement.classList.add("preloader-active")

    let introTimeline: gsap.core.Timeline | null = null

    const hide = () => {
      document.documentElement.classList.remove("preloader-active")
      setVisible(false)
    }

    // ── Intro ─────────────────────────────────────────────────────────────
    // Drawn inside a rAF so the SVG is laid out before we read path lengths.
    let rafId = 0
    rafId = requestAnimationFrame(() => {
      const border = borderRef.current
      const swirl = swirlRef.current
      const strokesGroup = strokesGroupRef.current
      const columnsGroup = columnsGroupRef.current
      const allInGroup = strokesGroup
        ? Array.from(strokesGroup.querySelectorAll<SVGPathElement>("path"))
        : []
      // Stagger group = everything in the strokes group except the swirl,
      // which is on its own track.
      const staggerStrokes = allInGroup.filter((p) => p !== swirl)
      const columns = columnsGroup
        ? Array.from(columnsGroup.querySelectorAll<SVGPathElement>("path"))
        : []

      if (reducedMotion) {
        // No motion: just present the brand instantly.
        gsap.set([border, strokesGroup, columnsGroup], { opacity: 1 })
        return
      }

      // Prepare stroke draw-in: dasharray = path length, dashoffset = length.
      // getTotalLength is called *once* per path to avoid layout thrash.
      const allStrokes = [border, ...allInGroup].filter(
        (p): p is SVGPathElement => p !== null,
      )
      for (const path of allStrokes) {
        const length = path.getTotalLength()
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
        })
      }
      // The groups were hidden via the JSX `opacity="0"` attribute to avoid a
      // pre-animation flash. Now that strokes are stencilled out, reveal the
      // groups so the timeline can scrub the offset back to 0 smoothly.
      gsap.set([border, strokesGroup], { opacity: 1 })
      gsap.set(columns, { y: 14 })

      introTimeline = gsap.timeline({ defaults: { ease: "power2.out" } })

      // 1 · Signature swirl — *first to start*, *last to finish*. Drawn on
      //     its own slower track to anchor the entire intro.
      if (swirl) {
        introTimeline.to(
          swirl,
          { strokeDashoffset: 0, duration: SWIRL_DURATION, ease: "power2.inOut" },
          0,
        )
      }

      // 2 · Outer frame draws alongside the swirl, finishing early.
      if (border) {
        introTimeline.to(
          border,
          { strokeDashoffset: 0, duration: 0.65, ease: "power2.inOut" },
          0,
        )
      }

      // 3 · Interior straight guides + asterisk accent stagger in between.
      introTimeline.to(
        staggerStrokes,
        {
          strokeDashoffset: 0,
          duration: 0.7,
          stagger: 0.04,
          ease: "power2.out",
        },
        0.25,
      )

      // 4 · Columns fade up in step with the lines.
      introTimeline.to(
        columnsGroup,
        { opacity: 1, duration: 0.45, ease: "power2.out" },
        0.5,
      )
      introTimeline.to(
        columns,
        {
          y: 0,
          duration: 0.55,
          stagger: 0.035,
          ease: "power2.out",
        },
        0.5,
      )
    })

    // ── Exit ──────────────────────────────────────────────────────────────
    // Parallax slide-up: the black plate sweeps off-screen quickly while the
    // art layer trails behind, creating a sense of depth as the curtain
    // clears the brand mark.
    let exitTimeline: gsap.core.Timeline | null = null
    const startExit = () => {
      if (reducedMotion) {
        hide()
        return
      }
      // Block any further pointer interaction the moment the exit starts.
      container.style.pointerEvents = "none"

      exitTimeline = gsap.timeline({ onComplete: hide })
      exitTimeline.to(
        plateRef.current,
        { yPercent: -100, duration: 1.05, ease: "expo.inOut" },
        0,
      )
      exitTimeline.to(
        artRef.current,
        { yPercent: -100, duration: EXIT_MS / 1000, ease: "expo.inOut" },
        0,
      )
    }

    const minDelay = new Promise<void>((resolve) => {
      window.setTimeout(resolve, MIN_VISIBLE_MS)
    })
    const pageReady = new Promise<void>((resolve) => {
      if (document.readyState === "complete") {
        resolve()
        return
      }
      window.addEventListener("load", () => resolve(), { once: true })
    })
    const fontsReady = document.fonts?.ready ?? Promise.resolve()

    void Promise.all([minDelay, pageReady, fontsReady]).then(startExit)

    return () => {
      document.documentElement.classList.remove("preloader-active")
      cancelAnimationFrame(rafId)
      introTimeline?.kill()
      exitTimeline?.kill()
    }
  }, [])

  if (!visible) return null

  return (
    <div
      ref={containerRef}
      role="status"
      aria-live="polite"
      aria-label="Chargement du site"
      className="fixed inset-0 z-[200] overflow-hidden"
    >
      {/*
        Plate layer — the solid black curtain. Sweeps up *faster* on exit so
        the brand mark is briefly revealed before it also leaves.
      */}
      <div
        ref={plateRef}
        className="absolute inset-0 bg-black  will-change-transform"
        aria-hidden="true"
      />

      {/*
        Art layer — the SVG mark. Sits above the plate and slides up *slower*
        on exit, producing the parallax depth.
      */}
      <div
        ref={artRef}
        className="absolute inset-0 flex items-center justify-center will-change-transform"
      >
        <div className="relative w-[min(92vw,calc(82vh*1.5))] aspect-[1920/1280]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1920 1280"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
            // `vector-effect: non-scaling-stroke` on every <path> keeps line
            // weights crisp regardless of how the SVG is scaled to fit.
            className="absolute inset-0 h-full w-full [&_path]:[vector-effect:non-scaling-stroke]"
          >
            <g clipPath="url(#noun-preloader-clip)">
              {/* Solid black plate (instant, never animated). */}
              <path fill="#000" opacity="100" d="M0 0h1920v1280H0z" />
              <path fill="#000" d="M-1-1h1922v1282H-1z" />

              {/* Outer frame — draws first. Hidden until GSAP stencils it. */}
              <path
                ref={borderRef}
                d="M-1-1h1922v1282H-1z"
                opacity="0"
              />

              {/* Grey filled shapes — fade in. */}
              <g
                ref={columnsGroupRef}
                fill="#d9d9d9"
                fillOpacity=".25"
                opacity="0"
                style={{ willChange: "opacity, transform" }}
              >
                {GREY_PATHS.map((d, i) => (
                  <path key={`g-${i}`} d={d} />
                ))}
              </g>

              {/* Thin white guides + signature swirl — draw in.
                  Straight guides + asterisk stagger; swirl runs on its own
                  longer track (first to start, last to finish). */}
              <g
                ref={strokesGroupRef}
                stroke="#fff"
                fill="none"
                opacity="0"
                style={{ willChange: "stroke-dashoffset" }}
              >
                <g opacity="0.4">
                  {STRAIGHT_GUIDE_PATHS.map((d, i) => (
                    <path key={`s-g-${i}`} d={d} />
                  ))}
                </g>
                <path ref={swirlRef} d={SWIRL_PATH} />
              </g>
            </g>

            <defs>
              <clipPath id="noun-preloader-clip">
                <path fill="#fff" d="M0 0h1920v1280H0z" />
              </clipPath>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  )
}
