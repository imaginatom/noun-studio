"use client"

import {
  cloneElement,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { cn } from "@/lib/utils"

type ParallaxProps = {
  children: ReactNode
  /**
   * Vertical translation in viewport-height units, applied across the entire
   * trigger range. Negative = element drifts up faster than scroll.
   * @default -0.08 (very restrained)
   */
  y?: number
  /**
   * Subtle scale ramp from start (1 + scaleFrom) to end (1).
   * @default 0
   */
  scaleFrom?: number
  /**
   * Smoothing factor for ScrollTrigger scrub. Higher = laggier.
   * @default 0.6
   */
  scrub?: number
  /** Render the parallax wrapper as `display: contents` (no DOM box). */
  asChild?: boolean
  className?: string
  style?: CSSProperties
  as?: "div" | "section" | "article" | "figure"
}

/**
 * Subtle, scrubbed parallax driven by ScrollTrigger (which is already
 * synced to Lenis via the SmoothScroll provider). Only `transform` is
 * animated — no layout, no paint thrash.
 *
 * The defaults are intentionally restrained: a hero image with
 * `<Parallax y={-0.08} scaleFrom={0.04}>` should feel "weighted",
 * never gimmicky.
 *
 * Honors `prefers-reduced-motion` (no animation, just renders children).
 */
export function Parallax({
  children,
  y = -0.08,
  scaleFrom = 0,
  scrub = 0.6,
  asChild = false,
  className,
  style,
  as = "div",
}: ParallaxProps) {
  const ref = useRef<HTMLElement | null>(null)
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
      const distance = () => window.innerHeight * y

      gsap.fromTo(
        el,
        scaleFrom !== 0
          ? { y: 0, scale: 1 + scaleFrom }
          : { y: 0 },
        {
          y: distance,
          ...(scaleFrom !== 0 ? { scale: 1 } : {}),
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub,
            invalidateOnRefresh: true,
          },
        },
      )
    }, el)

    return () => ctx.revert()
  }, [y, scaleFrom, scrub, reducedMotion])

  const mergedStyle: CSSProperties = {
    willChange: reducedMotion ? undefined : "transform",
    ...style,
  }

  if (asChild) {
    const child = children as ReactElement<{
      ref?: React.Ref<HTMLElement>
      className?: string
      style?: CSSProperties
    }>
    return cloneElement(child, {
      ref: (node: HTMLElement | null) => {
        ref.current = node
        const childRef = (child as { ref?: React.Ref<HTMLElement> }).ref
        if (typeof childRef === "function") childRef(node)
        else if (childRef && "current" in childRef) {
          ;(childRef as React.MutableRefObject<HTMLElement | null>).current = node
        }
      },
      className: cn(child.props.className, className),
      style: { ...mergedStyle, ...(child.props.style ?? {}) },
    })
  }

  const Tag = as
  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      className={className}
      style={mergedStyle}
    >
      {children}
    </Tag>
  )
}
