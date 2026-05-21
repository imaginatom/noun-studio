import type { CSSProperties } from "react"
import { cn } from "@/lib/utils"
import { ExpertiseVideo } from "@/components/home/expertise-video"

/** Background of the content section that follows this transition */
export type SectionTransitionBg = "background" | "muted" | "whyUs" | "dark"

const WHY_US_SECTION_BG =
  "color-mix(in srgb, hsl(var(--muted)) 40%, hsl(var(--background)) 60%)"

type SectionTransitionProps = {
  chapter: string
  label?: string
  quote?: string
  videoSrc?: string
  /** @deprecated Use sectionBg instead */
  tone?: "light" | "dark"
  sectionBg?: SectionTransitionBg
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
        className: "text-foreground",
        style: { backgroundColor: WHY_US_SECTION_BG },
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

export function SectionTransition({
  chapter,
  label,
  quote,
  videoSrc,
  tone,
  sectionBg,
  className,
}: SectionTransitionProps) {
  const resolvedBg: SectionTransitionBg =
    sectionBg ?? (tone === "dark" ? "dark" : "background")
  const surface = sectionSurfaceClasses(resolvedBg)
  const isDark = surface.isDark
  const hasSplitMedia = Boolean(videoSrc && quote)

  return (
    <section
      className={cn(
        "relative w-full overflow-hidden",
        isDark ? "pt-32 lg:pt-40" : "pt-20 lg:pt-28",
        surface.className,
        className,
      )}
      style={surface.style}
    >
      {resolvedBg === "dark" && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-black"
        />
      )}

      {hasSplitMedia ? (
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid items-center gap-10 lg:grid-cols-[2fr_3fr] lg:gap-14 xl:gap-20">
            <div className="animate-on-scroll animate-fade-left flex flex-col text-left">
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

            <div className="animate-on-scroll animate-fade-right w-full">
              <ExpertiseVideo src={videoSrc!} />
            </div>
          </div>
        </div>
      ) : (
        <div
          aria-hidden="true"
          className="animate-on-scroll animate-fade relative mx-auto flex max-w-5xl flex-col items-center px-6 text-center lg:px-10"
        >
          <ChapterHeader chapter={chapter} label={label} isDark={isDark} />

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
    </section>
  )
}
