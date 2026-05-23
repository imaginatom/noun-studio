"use client"

import { forwardRef, useEffect, useRef, useState, type ReactNode } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { homePageDefaults, type HomePageContent } from "@/lib/content/homepage"
import { cn } from "@/lib/utils"

type ServicesContent = HomePageContent["services"]

type IntroLayerMotion = {
  opacity: number
  translateX: number
  translateY: number
}

type IntroMotion = {
  progress: number
  eyebrow: IntroLayerMotion
  title: IntroLayerMotion
}

type ItemMotion = {
  opacity: number
  translateY: number
  progress: number
}

const serviceHrefs = ["/architecture", "/contact", "/contact"]

const FOCUS_LINE_RATIO = 0.42
const FOCUS_RANGE_RATIO = 0.48
const PARALLAX_OFFSET_PX = 72
const INTRO_PIN_THRESHOLD = 0.88
const REVEAL_RIGHT_THRESHOLD = 0.78

/**
 * Two-speed intro parallax: the eyebrow drifts in slowly from above its position,
 * the title rushes in from well below — initially ~500 px apart on the Y axis,
 * converging to their resting layout when the intro hits the viewport center.
 */
const EYEBROW_OFFSET = { x: -32, y: -220 } as const
const TITLE_OFFSET = { x: 24, y: 280 } as const
const EYEBROW_SPEED = 0.85
const TITLE_SPEED = 1.55

const hiddenItemMotion: ItemMotion = {
  progress: 0,
  opacity: 0,
  translateY: PARALLAX_OFFSET_PX,
}

const settledLayer: IntroLayerMotion = { opacity: 1, translateX: 0, translateY: 0 }

const settledIntroMotion: IntroMotion = {
  progress: 1,
  eyebrow: settledLayer,
  title: settledLayer,
}

const defaultIntroMotion: IntroMotion = {
  progress: 0,
  eyebrow: {
    opacity: 0.18,
    translateX: EYEBROW_OFFSET.x,
    translateY: EYEBROW_OFFSET.y,
  },
  title: {
    opacity: 0.18,
    translateX: TITLE_OFFSET.x,
    translateY: TITLE_OFFSET.y,
  },
}

/** Ease-out quart: starts fast, decelerates into place. */
function easeOutQuart(t: number): number {
  const clamped = Math.max(0, Math.min(1, t))
  return 1 - (1 - clamped) ** 4
}

function layerFromProgress(
  scrollProgress: number,
  offset: { x: number; y: number },
  speed: number,
): IntroLayerMotion {
  const layerProgress = Math.min(1, Math.max(0, scrollProgress) * speed)
  const eased = easeOutQuart(layerProgress)
  const remaining = 1 - eased

  return {
    opacity: 0.18 + eased * 0.82,
    translateX: remaining * offset.x,
    translateY: remaining * offset.y,
  }
}

function computeIntroMotion(sectionRect: DOMRect, vh: number): IntroMotion {
  const sectionTop = sectionRect.top
  // Progress 0 when the section first enters from the bottom of the viewport,
  // progress 1 when the section's top has risen near the viewport top — which
  // visually corresponds to the intro block being centered in the viewport
  // (the intro sits at the top of the section, then becomes sticky).
  const entryStart = vh * 0.95
  const entryEnd = vh * 0.12

  let progress = 1
  if (sectionTop >= entryStart) {
    progress = 0
  } else if (sectionTop > entryEnd) {
    progress = (entryStart - sectionTop) / (entryStart - entryEnd)
  }

  const clamped = Math.max(0, Math.min(1, progress))

  return {
    progress: clamped,
    eyebrow: layerFromProgress(clamped, EYEBROW_OFFSET, EYEBROW_SPEED),
    title: layerFromProgress(clamped, TITLE_OFFSET, TITLE_SPEED),
  }
}

function computeItemMotion(rect: DOMRect, vh: number): ItemMotion {
  const itemCenter = rect.top + rect.height / 2
  const focusLine = vh * FOCUS_LINE_RATIO
  const range = vh * FOCUS_RANGE_RATIO
  const progress = Math.max(0, Math.min(1, 1 - Math.abs(itemCenter - focusLine) / range))

  return {
    progress,
    opacity: 0.28 + progress * 0.72,
    translateY: (1 - progress) * PARALLAX_OFFSET_PX,
  }
}

function ServicesStickyIntro({
  eyebrow,
  title,
  motion,
  isPinned,
}: {
  eyebrow: string
  title: string
  motion: IntroMotion
  isPinned: boolean
}) {
  return (
    <div
      className={cn(
        "py-16 lg:h-full lg:w-full lg:py-0",
        !isPinned && "lg:flex lg:min-h-svh lg:items-center",
        isPinned &&
          "lg:sticky lg:top-28 lg:z-10 lg:flex lg:max-h-[calc(100dvh-7rem)] lg:items-center",
      )}
    >
      <div className={cn("max-w-[28rem]", !isPinned && "lg:pointer-events-none")}>
        <p
          className="eyebrow flex items-center gap-3"
          style={{
            transform: `translate3d(${motion.eyebrow.translateX}px, ${motion.eyebrow.translateY}px, 0)`,
            opacity: motion.eyebrow.opacity,
            willChange: "transform, opacity",
          }}
        >
          <span className="inline-block h-px w-8 bg-foreground/40" aria-hidden="true" />
          {eyebrow}
        </p>
        <h2
          className="mt-8 font-serif font-light leading-[0.95] text-foreground text-balance text-[clamp(2.5rem,5.4vw,5.25rem)]"
          style={{
            transform: `translate3d(${motion.title.translateX}px, ${motion.title.translateY}px, 0)`,
            opacity: motion.title.opacity,
            letterSpacing: "-0.025em",
            willChange: "transform, opacity",
          }}
        >
          {title}
        </h2>
        <div
          className="mt-10 hidden h-px w-full max-w-[6rem] origin-left scale-x-0 bg-foreground/40 transition-transform duration-[900ms] ease-out lg:block"
          style={{
            transform: `scaleX(${Math.min(1, motion.progress * 1.4)})`,
            willChange: "transform",
          }}
          aria-hidden="true"
        />
        <p
          className="mt-6 hidden max-w-sm text-[13px] font-light leading-relaxed text-muted-foreground lg:block"
          style={{
            opacity: motion.title.opacity * 0.85,
            transform: `translate3d(0, ${(1 - motion.progress) * 16}px, 0)`,
            willChange: "transform, opacity",
          }}
        >
          Chaque pratique nourrit l’autre — architecture, design et contenu, pensés
          comme un seul geste.
        </p>
      </div>
    </div>
  )
}

const ServiceParallaxItem = forwardRef<
  HTMLLIElement,
  { children: ReactNode; motion: ItemMotion }
>(function ServiceParallaxItem({ children, motion }, ref) {
  return (
    <li
      ref={ref}
      className="flex min-h-svh items-center border-b border-border/70 last:border-b-0"
      style={{
        opacity: motion.opacity,
        transform: `translate3d(0, ${motion.translateY}px, 0) scale(${0.985 + motion.progress * 0.015})`,
        filter: `blur(${(1 - motion.progress) * 1.2}px)`,
        willChange: "transform, opacity, filter",
        pointerEvents: motion.opacity < 0.15 ? "none" : undefined,
      }}
    >
      {children}
    </li>
  )
})

export function ServicesOverview({
  content = homePageDefaults.services,
}: {
  content?: ServicesContent
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const firstItemRef = useRef<HTMLLIElement>(null)
  const hasPinnedRef = useRef(false)
  const hasRevealedRightRef = useRef(false)
  const [introMotion, setIntroMotion] = useState<IntroMotion>(defaultIntroMotion)
  const [isIntroPinned, setIsIntroPinned] = useState(false)
  const [revealRight, setRevealRight] = useState(false)
  const [firstItemMotion, setFirstItemMotion] = useState<ItemMotion>(hiddenItemMotion)
  const frame = useRef<number | null>(null)

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reducedMotion) {
      setIntroMotion(settledIntroMotion)
      setIsIntroPinned(true)
      setRevealRight(true)
      setFirstItemMotion({ progress: 1, opacity: 1, translateY: 0 })
      hasRevealedRightRef.current = true
      return
    }

    const update = () => {
      if (window.innerWidth < 1024) {
        hasPinnedRef.current = false
        hasRevealedRightRef.current = false
        setIntroMotion(settledIntroMotion)
        setIsIntroPinned(false)
        setRevealRight(false)
        setFirstItemMotion({ progress: 1, opacity: 1, translateY: 0 })
        frame.current = null
        return
      }

      const section = sectionRef.current
      const firstItem = firstItemRef.current
      if (!section) {
        frame.current = null
        return
      }

      const vh = window.innerHeight
      const sectionRect = section.getBoundingClientRect()
      const intro = computeIntroMotion(sectionRect, vh)

      const sectionInView = sectionRect.bottom > 0 && sectionRect.top < vh
      if (!sectionInView) {
        hasPinnedRef.current = false
        hasRevealedRightRef.current = false
      } else if (intro.progress >= INTRO_PIN_THRESHOLD) {
        hasPinnedRef.current = true
      }

      if (intro.progress >= REVEAL_RIGHT_THRESHOLD || hasPinnedRef.current) {
        hasRevealedRightRef.current = true
      }

      const pinned = hasPinnedRef.current
      const shouldRevealRight = hasRevealedRightRef.current

      setIsIntroPinned(pinned)
      setRevealRight(shouldRevealRight)
      setIntroMotion(pinned ? settledIntroMotion : intro)

      if (!shouldRevealRight || !firstItem) {
        setFirstItemMotion(hiddenItemMotion)
      } else {
        setFirstItemMotion(computeItemMotion(firstItem.getBoundingClientRect(), vh))
      }

      frame.current = null
    }

    const onScroll = () => {
      if (frame.current !== null) return
      frame.current = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", update)
    window.__lenis?.on("scroll", onScroll)

    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", update)
      window.__lenis?.off("scroll", onScroll)
      if (frame.current !== null) {
        window.cancelAnimationFrame(frame.current)
      }
    }
  }, [content.items.length])

  if (content.items.length === 0) {
    return null
  }

  const [firstService, ...restServices] = content.items

  return (
    <section
      ref={sectionRef}
      className="relative bg-background"
      aria-label={content.title}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/15 to-transparent"
      />
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-16 lg:items-stretch">
          <div className="lg:col-span-4 lg:self-stretch">
            <ServicesStickyIntro
              eyebrow={content.eyebrow}
              title={content.title}
              motion={introMotion}
              isPinned={isIntroPinned}
            />
          </div>

          <div className="lg:col-span-8">
            <ul className="border-t border-border/70">
              <ServiceParallaxItem ref={firstItemRef} motion={firstItemMotion}>
                <ServiceRow
                  href={serviceHrefs[0] ?? "/contact"}
                  index={0}
                  title={firstService.title}
                  description={firstService.description}
                />
              </ServiceParallaxItem>

              {restServices.map((service, index) => (
                <ServiceParallaxItemWithScroll
                  key={service.title}
                  index={index + 1}
                  revealRight={revealRight}
                >
                  <ServiceRow
                    href={serviceHrefs[index + 1] ?? "/contact"}
                    index={index + 1}
                    title={service.title}
                    description={service.description}
                  />
                </ServiceParallaxItemWithScroll>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

function ServiceParallaxItemWithScroll({
  children,
  index,
  revealRight,
}: {
  children: ReactNode
  index: number
  revealRight: boolean
}) {
  const ref = useRef<HTMLLIElement>(null)
  const [motion, setMotion] = useState<ItemMotion>(hiddenItemMotion)
  const frame = useRef<number | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reducedMotion) {
      setMotion({ progress: 1, opacity: 1, translateY: 0 })
      return
    }

    const update = () => {
      if (window.innerWidth < 1024) {
        setMotion({ progress: 1, opacity: 1, translateY: 0 })
        frame.current = null
        return
      }

      if (!revealRight) {
        setMotion(hiddenItemMotion)
        frame.current = null
        return
      }

      setMotion(computeItemMotion(el.getBoundingClientRect(), window.innerHeight))
      frame.current = null
    }

    const onScroll = () => {
      if (frame.current !== null) return
      frame.current = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", update)
    window.__lenis?.on("scroll", onScroll)

    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", update)
      window.__lenis?.off("scroll", onScroll)
      if (frame.current !== null) {
        window.cancelAnimationFrame(frame.current)
      }
    }
  }, [index, revealRight])

  return (
    <ServiceParallaxItem ref={ref} motion={motion}>
      {children}
    </ServiceParallaxItem>
  )
}

function ServiceRow({
  href,
  index,
  title,
  description,
}: {
  href: string
  index: number
  title: string
  description: string
}) {
  const numberLabel = String(index + 1).padStart(2, "0")
  return (
    <Link
      href={href}
      className="group grid w-full grid-cols-12 items-start gap-4 py-12 transition-colors hover:bg-muted/30 lg:gap-6 lg:py-16"
    >
      <span
        className="col-span-2 font-serif text-3xl font-light italic leading-none text-muted-foreground/80 transition-colors group-hover:text-foreground md:text-4xl lg:col-span-2 lg:text-5xl"
        aria-hidden="true"
      >
        {numberLabel}
      </span>
      <div className="col-span-9 lg:col-span-9">
        <h3
          className={cn(
            "font-serif font-light leading-[0.98] text-foreground transition-transform duration-500",
            "text-3xl md:text-4xl lg:text-[2.75rem]",
            "group-hover:translate-x-2",
          )}
          style={{ letterSpacing: "-0.018em" }}
        >
          {title}
        </h3>
        <p className="mt-5 max-w-xl text-[14px] font-light leading-[1.65] text-muted-foreground lg:mt-6 lg:text-[15px]">
          {description}
        </p>
        <span className="mt-7 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.32em] text-foreground/60 transition-colors group-hover:text-foreground">
          <span className="h-px w-6 bg-current transition-all duration-500 group-hover:w-10" aria-hidden="true" />
          Explorer
        </span>
      </div>
      <span className="col-span-1 flex justify-end pt-2">
        <ArrowUpRight
          className="h-6 w-6 text-muted-foreground transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-foreground"
          strokeWidth={1.25}
        />
      </span>
    </Link>
  )
}
