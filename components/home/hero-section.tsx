"use client";

import { ArrowDown } from "lucide-react";
import { HoverFillLink } from "@/components/hover-fill-link";
import { homePageDefaults, type HomePageContent } from "@/lib/content/homepage";
import { HeroParallaxImage } from "@/components/home/hero-parallax-image";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap-register";
import { HERO_REVEAL, revealBlock, revealSplit } from "@/lib/hero-reveal";

type HeroContent = HomePageContent["hero"];

export function HeroSection({
  content = homePageDefaults.hero,
}: {
  content?: HeroContent;
}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const badgeRef = useRef<HTMLDivElement | null>(null);
  const mobileEyebrowRef = useRef<HTMLParagraphElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const bulletsRef = useRef<HTMLUListElement | null>(null);
  const secondaryCtaRef = useRef<HTMLDivElement | null>(null);
  const primaryCtaRef = useRef<HTMLDivElement | null>(null);
  const metaRef = useRef<HTMLDivElement | null>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    let cancelled = false;
    let ctx: gsap.Context | null = null;

    const init = async () => {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
      if (cancelled || !sectionRef.current) return;

      ctx = gsap.context(() => {
        const reducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;

        if (!reducedMotion) {
          const introTl = gsap.timeline({
            defaults: {
              ease: HERO_REVEAL.ease,
              duration: HERO_REVEAL.duration,
            },
          });

          revealSplit(headlineRef.current, introTl, 0);
          revealSplit(subtitleRef.current, introTl, ">");
          introTl.addLabel("rest", ">");

          revealSplit(mobileEyebrowRef.current, introTl, "rest");
          revealBlock(badgeRef.current, introTl, "rest");

          if (bulletsRef.current) {
            gsap.utils.toArray<HTMLLIElement>("li", bulletsRef.current).forEach(
              (bullet) => {
                revealSplit(bullet, introTl, "rest");
              },
            );
          }

          revealBlock(secondaryCtaRef.current, introTl, "rest");
          revealBlock(primaryCtaRef.current, introTl, "rest");
          revealBlock(metaRef.current, introTl, "rest");
          revealBlock(scrollIndicatorRef.current, introTl, "rest");
        }

        if (badgeRef.current && !reducedMotion) {
          gsap.to(badgeRef.current, {
            y: -80,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        }
      }, sectionRef);
    };

    init();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [content.title, content.subtitle]);

  return (
    <section
      ref={sectionRef}
      data-grid-tier="bleed"
      data-snap-soft
      className="relative flex min-h-screen flex-col justify-end overflow-hidden bg-foreground text-background"
    >
      {content.backgroundImage?.src && (
        <HeroParallaxImage
          src={content.backgroundImage.src}
          alt={content.backgroundImage.alt}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 via-foreground/20 to-foreground/85" />

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent via-foreground to-background"
        aria-hidden="true"
      />

      <div className="absolute left-6 top-72 z-10 hidden flex-col items-start gap-3 overflow-hidden lg:flex lg:left-10">
        <div ref={badgeRef}>
          <span
            className="rotate-180 text-[10px] uppercase tracking-[0.32em] text-background/60"
            style={{ writingMode: "vertical-rl" }}
          >
            {content.badgeText}
          </span>
        </div>
        <span className="h-16 w-px bg-background/30" aria-hidden="true" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 pt-40 lg:px-10 lg:pb-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-8">
            <div className="mb-8 overflow-hidden lg:hidden">
              <p
                ref={mobileEyebrowRef}
                className="eyebrow !text-background/70"
              >
                {content.badgeText}
              </p>
            </div>

            <h1
              ref={headlineRef}
              className="overflow-hidden font-serif text-5xl font-light leading-[1.02] tracking-tight text-balance text-background sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem]"
            >
              {content.title}
            </h1>

            <div className="mt-10 flex items-start gap-5 lg:max-w-xl">
              <span
                className="mt-3 hidden h-px w-12 shrink-0 bg-background/50 sm:block"
                aria-hidden="true"
              />
              <div className="overflow-hidden">
                <p
                  ref={subtitleRef}
                  className="text-base font-light leading-relaxed text-background/80 md:text-lg"
                >
                  {content.subtitle}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 lg:pt-8">
            {content.trustBullets.length > 0 && (
              <ul
                ref={bulletsRef}
                className="space-y-3 border-l border-background/20 pl-6"
              >
                {content.trustBullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="overflow-hidden text-[13px] font-light tracking-wide text-background/80"
                  >
                    {bullet}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-10 flex flex-col gap-2">
              <div className="overflow-hidden">
                <div ref={secondaryCtaRef}>
                  <HoverFillLink
                    href="/realisations"
                    variant="dark"
                    fullWidth
                    showArrow
                    aria-label="Voir le portfolio"
                  >
                    {content.secondaryCtaLabel}
                  </HoverFillLink>
                </div>
              </div>
              <div className="overflow-hidden">
                <div ref={primaryCtaRef}>
                  <HoverFillLink
                    href="/contact"
                    variant="dark"
                    fullWidth
                    showArrow
                    aria-label="Découvrir nos services"
                  >
                    {content.primaryCtaLabel}
                  </HoverFillLink>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 overflow-hidden">
          <div
            ref={metaRef}
            className="flex items-end justify-between text-[10px] uppercase tracking-[0.3em] text-background/50"
          >
            <span>Oran · Algérie</span>
            <span className="hidden md:inline-block">
              Studio fondé par SAHNOUNE Mohammed
            </span>
            <span>{new Date().getFullYear()}</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 overflow-hidden text-background/60">
        <div
          ref={scrollIndicatorRef}
          className="flex flex-col items-center gap-2"
          aria-hidden="true"
        >
          <span className="text-[10px] uppercase tracking-[0.3em]">
            Défiler
          </span>
          <ArrowDown className="h-4 w-4 animate-bounce" strokeWidth={1.5} />
        </div>
      </div>
    </section>
  );
}
