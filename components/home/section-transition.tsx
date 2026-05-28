import type { CSSProperties } from "react"
import { cn } from "@/lib/utils"
import { ExpertiseVideo } from "@/components/home/expertise-video"

/** Background of the content section that follows this transition */
export type SectionTransitionBg = "background" | "muted" | "whyUs" | "dark"

export type SectionChapterIntroProps = {
  chapter: string
  label?: string
  quote?: string
  videoSrc?: string
  isDark?: boolean
  align?: "center" | "left"
  /** Adds spacing before the section body when nested inside a parent section */
  embedded?: boolean
  /** Show chapter content immediately (no scroll reveal) — use for bottom-of-page embedded intros */
  revealOnMount?: boolean
  className?: string
}

type SectionTransitionProps = {
  chapter: string
  label?: string
  quote?: string
  videoSrc?: string
  /** @deprecated Use sectionBg instead */
  tone?: "light" | "dark"
  sectionBg?: SectionTransitionBg
  isDark?: boolean
  align?: "center" | "left"
  className?: string
}

function sectionSurfaceClasses(sectionBg: SectionTransitionBg): {
  className: string
  style?: CSSProperties
  isDark: boolean
} {
  switch (sectionBg) {
    case "muted":
      return {
        className: "bg-muted/40 text-foreground",
        isDark: false,
      }
    case "whyUs":
      return {
        className: "bg-transparent text-foreground",
        isDark: false,
      }
    case "dark":
      return {
        className: "bg-black text-background",
        isDark: true,
      }
    case "background":
    default:
      return {
        className: "bg-background text-foreground",
        isDark: false,
      }
  }
}

function ChapterHeader({
  chapter,
  label,
  isDark,
  align = "center",
}: {
  chapter: string
  label?: string
  isDark: boolean
  align?: "center" | "left"
}) {
  const centered = align === "center"

  return (
    <>
      <div
        className={cn(
          "flex items-center gap-6",
          centered ? "justify-center" : "justify-start",
        )}
      >
        {centered && (
          <span
            className={cn(
              "h-px w-16 sm:w-24",
              isDark ? "bg-background/30" : "bg-foreground/25",
            )}
          />
        )}
        <span className="font-serif text-2xl font-light italic tracking-wide md:text-3xl">
          {chapter}
        </span>
        {centered && (
          <span
            className={cn(
              "h-px w-16 sm:w-24",
              isDark ? "bg-background/30" : "bg-foreground/25",
            )}
          />
        )}
      </div>

      {label && (
        <span
          className={cn(
            "mt-5 block text-[11px] font-medium uppercase",
            centered && "text-center",
            isDark ? "text-background/55" : "text-muted-foreground",
          )}
          style={{ letterSpacing: "0.32em" }}
        >
          {label}
        </span>
      )}
    </>
  )
}

export function SectionChapterIntro({
  chapter,
  label,
  quote,
  videoSrc,
  isDark = false,
  align,
  embedded = false,
  revealOnMount = false,
  className,
}: SectionChapterIntroProps) {
  const hasSplitMedia = Boolean(videoSrc && quote)
  const resolvedAlign = align ?? (hasSplitMedia ? "left" : "center")

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden",
        isDark ? "pt-32 lg:pt-40" : "pt-20 lg:pt-28",
        embedded && (hasSplitMedia ? "pb-16 lg:pb-20" : "pb-12 lg:pb-16"),
        className,
      )}
    >
      {isDark && !embedded && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-black"
        />
      )}

      {hasSplitMedia ? (
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid items-center gap-10 lg:grid-cols-[2fr_3fr] lg:gap-14 xl:gap-20">
            <div
              className={cn(
                "animate-on-scroll animate-fade-left flex flex-col text-left",
                revealOnMount && "is-visible",
              )}
            >
              <ChapterHeader
                chapter={chapter}
                label={label}
                isDark={isDark}
                align="left"
              />
              <p
                className={cn(
                  "mt-8 font-serif text-xl font-light italic leading-relaxed md:text-2xl lg:text-[1.65rem] lg:leading-relaxed",
                  isDark ? "text-background/85" : "text-foreground/85",
                )}
              >
                {quote}
              </p>
            </div>

            <div
              className={cn(
                "animate-on-scroll animate-fade-right w-full",
                revealOnMount && "is-visible",
              )}
            >
              <ExpertiseVideo src={videoSrc!} />
            </div>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "animate-on-scroll animate-fade relative mx-auto flex max-w-5xl flex-col px-6 lg:px-10",
            revealOnMount && "is-visible",
            resolvedAlign === "center" ? "items-center text-center" : "items-start text-left",
          )}
        >
          <ChapterHeader
            chapter={chapter}
            label={label}
            isDark={isDark}
            align={resolvedAlign}
          />

          {quote && (
            <p
              className={cn(
                "mt-8 max-w-2xl font-serif text-xl font-light italic leading-relaxed md:text-2xl",
                isDark ? "text-background/85" : "text-foreground/85",
              )}
            >
              {quote}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export function SectionTransition({
  chapter,
  label,
  quote,
  videoSrc,
  tone,
  sectionBg,
  className,
  isDark: isDarkProp,
  align,
}: SectionTransitionProps) {
  const resolvedBg: SectionTransitionBg =
    sectionBg ?? (tone === "dark" ? "dark" : "background")
  const surface = sectionSurfaceClasses(resolvedBg)
  const isDark = isDarkProp ?? surface.isDark

  return (
    <section
      className={cn("relative w-full overflow-hidden", surface.className, className)}
      style={surface.style}
    >
      <SectionChapterIntro
        chapter={chapter}
        label={label}
        quote={quote}
        videoSrc={videoSrc}
        isDark={isDark}
        align={align}
      />
    </section>
  )
}
