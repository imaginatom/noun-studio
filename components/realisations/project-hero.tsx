"use client";

import { useLayoutEffect, useRef } from "react";
import { HoverFillLink } from "@/components/hover-fill-link";
import { ProjectImage } from "@/components/project-image";
import { cn } from "@/lib/utils";
import type { PortfolioProject } from "@/lib/portfolio-project";
import type { GalleryImageAspect } from "@/lib/content/portfolio";
import { gsap, ScrollTrigger } from "@/lib/gsap-register";
import { revealWordsOnScroll } from "@/lib/hero-reveal";

type ProjectHeroProps = {
  project: PortfolioProject;
  contactHref: string;
  contactLabel: string;
  projectIndex?: number;
};

const ASPECT_CLASS: Record<GalleryImageAspect, string> = {
  "3/4": "aspect-[3/4]",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
};

/**
 * Repeating 3-step editorial rhythm for the gallery (desktop):
 *  0 — wide image left, caption hanging in the right margin
 *  1 — smaller image right, caption to its left, pulled up into the
 *      whitespace left by the previous wide image
 *  2 — medium image centred-left, caption underneath
 */
const FIGURE_LAYOUT = [
  {
    figure: "lg:col-[1/9]",
    caption: "lg:col-[10/13] lg:self-start lg:pt-16",
    wrap: "",
  },
  {
    figure: "lg:col-[6/12]",
    caption: "lg:col-[1/5] lg:self-center lg:text-right",
    wrap: "lg:-mt-[10vw]",
  },
  {
    figure: "lg:col-[2/8]",
    caption: "lg:col-[9/13] lg:self-start lg:pt-10",
    wrap: "",
  },
] as const;

function FigureCaption({
  index,
  text,
  className,
}: {
  index: number;
  text?: string | null;
  className?: string;
}) {
  return (
    <div className={cn("mt-4 lg:mt-0", className)}>
      <span className="text-[11px] font-medium tabular-nums tracking-[0.28em] text-foreground/35">
        {String(index + 1).padStart(2, "0")}
      </span>
      {text ? (
        <p
          data-hero-definition
          className="mt-3 max-w-sm font-serif text-xl font-medium leading-[1.55] text-foreground/75 lg:text-2xl"
        >
          {text}
        </p>
      ) : null}
    </div>
  );
}

export function ProjectHero({
  project,
  contactHref,
  contactLabel,
  projectIndex,
}: ProjectHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const galleryImages = project.gallery.filter((image) => image.src);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let cancelled = false;
    let ctx: gsap.Context | null = null;

    const init = async () => {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
      if (cancelled || !section) return;

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reducedMotion) return;

      ctx = gsap.context(() => {
        // Intro: header copy fades up in a gentle cascade on load.
        const headerEls = gsap.utils.toArray<HTMLElement>(
          "[data-hero-intro]",
          section,
        );
        if (headerEls.length) {
          gsap.from(headerEls, {
            opacity: 0,
            y: 36,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.12,
          });
        }

        // Scroll reveal: each figure fades up as it enters the viewport.
        const figures = gsap.utils.toArray<HTMLElement>(
          "[data-hero-figure]",
          section,
        );
        figures.forEach((figure) => {
          gsap.from(figure, {
            opacity: 0,
            y: 60,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: figure,
              start: "top 88%",
              once: true,
            },
          });
        });

        // Large screens: masked word-by-word clip reveal on definition copy.
        const mm = gsap.matchMedia();
        mm.add("(min-width: 1024px)", () => {
          const definitions = gsap.utils.toArray<HTMLElement>(
            "[data-hero-definition]",
            section,
          );
          definitions.forEach((definition) => {
            revealWordsOnScroll(definition, { start: "top 88%" });
          });
        });

        // Slow parallax drift on the images themselves for a bit of depth.
        const parallaxImages = gsap.utils.toArray<HTMLElement>(
          "[data-hero-parallax]",
          section,
        );
        parallaxImages.forEach((el) => {
          gsap.fromTo(
            el,
            { yPercent: -6 },
            {
              yPercent: 6,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        });

        ScrollTrigger.refresh();
      }, section);
    };

    void init();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [project.slug]);

  return (
    <section ref={sectionRef} className="relative w-full">
      <div className="mx-auto max-w-[1440px] px-[clamp(16px,4vw,64px)]">
        {/* ── Header ─────────────────────────────────────────────── */}
        <header>
          <div data-hero-intro className="flex items-center gap-3">
            {projectIndex ? (
              <span className="text-xs font-medium tabular-nums tracking-[0.28em] text-foreground/35">
                {String(projectIndex).padStart(2, "0")}
              </span>
            ) : null}
            <span className="h-px w-10 bg-foreground/20" aria-hidden="true" />
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-foreground/40">
              {project.location}
              {project.year ? (
                <>
                  {", "}
                  <span style={{ fontFeatureSettings: '"onum"' }}>
                    {project.year}
                  </span>
                </>
              ) : null}
            </p>
          </div>

          <h1
            data-hero-intro
            className="mt-6 max-w-[14ch] font-serif text-[clamp(3rem,8vw,7rem)] font-light leading-[1.02] text-[#0a0a0a] text-balance"
            style={{ letterSpacing: "-0.03em" }}
          >
            {project.title}
          </h1>

          <div className="mt-10 lg:mt-14 lg:grid lg:grid-cols-12 lg:gap-x-6">
            <p
              data-hero-intro
              className="font-serif text-xl font-medium leading-[1.55] text-foreground/75 lg:col-[6/12] lg:text-2xl"
            >
              {project.description}
            </p>
            <div data-hero-intro className="mt-8 lg:col-[6/12] lg:mt-10">
              <HoverFillLink href={contactHref} showArrow className="text-base">
                {contactLabel}
              </HoverFillLink>
            </div>
          </div>
        </header>

        {/* ── Gallery — images + captions spread across the grid ──── */}
        <div className="mt-8 flex flex-col gap-16 pb-4 lg:mt-28 lg:gap-0 lg:pb-16">
          {galleryImages.map((image, index) => {
            const layout = FIGURE_LAYOUT[index % FIGURE_LAYOUT.length];
            const aspect = image.aspect ?? "4/3";
            const definition = image.definition?.trim() || null;

            return (
              <div
                key={`${image.src}-${index}`}
                className={cn(
                  "lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-6",
                  index > 0 && "lg:mt-[8vw]",
                  layout.wrap,
                )}
              >
                <figure
                  data-hero-figure
                  className={cn("relative", layout.figure)}
                >
                  <div
                    className={cn(
                      "relative w-full overflow-hidden",
                      ASPECT_CLASS[aspect],
                    )}
                  >
                    <div data-hero-parallax className="absolute -inset-y-[8%] inset-x-0">
                      <ProjectImage
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        className="object-cover"
                        priority={index === 0}
                      />
                    </div>
                  </div>
                </figure>
                <FigureCaption
                  index={index}
                  text={definition}
                  className={layout.caption}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
