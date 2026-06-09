import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { ExpertiseVideo } from "@/components/home/expertise-video";

/** Background of the content section that follows this transition */
export type SectionTransitionBg = "background" | "muted" | "whyUs" | "dark";

export type SectionChapterIntroProps = {
  chapter?: string;
  label?: string;
  quote?: string;
  videoSrc?: string;
  isDark?: boolean;
  align?: "center" | "left";
  /** Adds spacing before the section body when nested inside a parent section */
  embedded?: boolean;
  /** Show chapter content immediately (no scroll reveal) — use for bottom-of-page embedded intros */
  revealOnMount?: boolean;
  className?: string;
};

type SectionTransitionProps = {
  chapter?: string;
  label?: string;
  quote?: string;
  videoSrc?: string;
  /** @deprecated Use sectionBg instead */
  tone?: "light" | "dark";
  sectionBg?: SectionTransitionBg;
  isDark?: boolean;
  align?: "center" | "left";
  className?: string;
};

function sectionSurfaceClasses(sectionBg: SectionTransitionBg): {
  className: string;
  style?: CSSProperties;
  isDark: boolean;
} {
  switch (sectionBg) {
    case "muted":
      return {
        className: "bg-muted/40 text-foreground",
        isDark: false,
      };
    case "whyUs":
      return {
        className: "bg-transparent text-foreground",
        isDark: false,
      };
    case "dark":
      return {
        className: "bg-black text-background",
        isDark: true,
      };
    case "background":
    default:
      return {
        className: "bg-background text-foreground",
        isDark: false,
      };
  }
}

function ChapterHeader({
  chapter,
  label,
  isDark,
  align = "center",
}: {
  chapter?: string;
  label?: string;
  isDark: boolean;
  align?: "center" | "left";
}) {
  if (!chapter && !label) {
    return null;
  }
  const centered = align === "center";

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
  );
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
  const hasSplitMedia = Boolean(videoSrc && quote);
  const resolvedAlign = align ?? (hasSplitMedia ? "left" : "center");

  return (
    <div
      className={cn("section-padding relative w-full overflow-hidden", className)}
    >
      {isDark && !embedded && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-black"
        />
      )}

      {hasSplitMedia ? (
        <div className="section-shell relative">
          <ExpertiseVideo
            src={videoSrc!}
            eyebrow={label ?? "Intro"}
            intro={quote}
            isDark={isDark}
            introClassName={cn(
              "animate-on-scroll animate-fade-left",
              revealOnMount && "is-visible",
            )}
            videoClassName={cn(
              "animate-on-scroll animate-fade-right",
              revealOnMount && "is-visible",
            )}
          />
        </div>
      ) : (
        <div
          className={cn(
            "section-shell animate-on-scroll animate-fade relative flex flex-col",
            revealOnMount && "is-visible",
            resolvedAlign === "center"
              ? "items-center text-center"
              : "items-start text-left",
          )}
        >
          {(chapter || label) && (
            <ChapterHeader
              chapter={chapter}
              label={label}
              isDark={isDark}
              align={resolvedAlign}
            />
          )}

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
  );
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
    sectionBg ?? (tone === "dark" ? "dark" : "background");
  const surface = sectionSurfaceClasses(resolvedBg);
  const isDark = isDarkProp ?? surface.isDark;

  return (
    <section
      data-grid-tier="wide"
      className={cn(
        "relative w-full overflow-hidden",
        surface.className,
        className,
      )}
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
  );
}
