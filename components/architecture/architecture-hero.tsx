"use client";

import Link from "next/link";
import { ArrowDown, ChevronRight } from "lucide-react";
import { HoverFillLink } from "@/components/hover-fill-link";
import { useLayoutEffect, useRef } from "react";
import { HeroParallaxImage } from "@/components/home/hero-parallax-image";
import { gsap } from "@/lib/gsap-register";
import { HERO_REVEAL, revealBlock, revealSplit } from "@/lib/hero-reveal";
import {
  architecturePageDefaults,
  type ArchitecturePageContent,
} from "@/lib/content/architecture";

type HeroContent = ArchitecturePageContent["hero"];

export function ArchitectureHero({
  content = architecturePageDefaults.hero,
}: {
  content?: HeroContent;
}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const sideBreadcrumbRef = useRef<HTMLDivElement | null>(null);
  const mobileBreadcrumbRef = useRef<HTMLDivElement | null>(null);
  const eyebrowRef = useRef<HTMLParagraphElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const portfolioCtaRef = useRef<HTMLDivElement | null>(null);
  const contactCtaRef = useRef<HTMLDivElement | null>(null);
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

          revealSplit(titleRef.current, introTl, 0);
          revealSplit(subtitleRef.current, introTl, ">");
          introTl.addLabel("rest", ">");

          revealBlock(sideBreadcrumbRef.current, introTl, "rest");
          revealBlock(mobileBreadcrumbRef.current, introTl, "rest");
          revealSplit(eyebrowRef.current, introTl, "rest");
          revealBlock(portfolioCtaRef.current, introTl, "rest");
          revealBlock(contactCtaRef.current, introTl, "rest");
          revealBlock(metaRef.current, introTl, "rest");
          revealBlock(scrollIndicatorRef.current, introTl, "rest");
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
      data-snap-soft
      className="relative flex min-h-screen flex-col justify-end overflow-hidden bg-foreground text-background"
    >
      <HeroParallaxImage
        src={content.backgroundImage.src}
        alt={content.backgroundImage.alt}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 via-foreground/20 to-foreground/85" />

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent via-foreground to-background"
        aria-hidden="true"
      />

      <div className="absolute left-6 top-32 z-10 hidden flex-col items-start gap-3 overflow-hidden lg:flex lg:left-10">
        <div ref={sideBreadcrumbRef}>
          <nav
            aria-label="Fil d'Ariane"
            className="flex flex-col gap-1 text-[10px] uppercase tracking-[0.32em] text-background/60"
            style={{ writingMode: "vertical-rl" }}
          >
            <Link
              href="/"
              className="rotate-180 transition-colors hover:text-background"
            >
              {content.breadcrumbHomeLabel}
            </Link>
            <span className="rotate-180 text-background/90">
              {content.breadcrumbCurrentLabel}
            </span>
          </nav>
        </div>
        <span className="h-16 w-px bg-background/30" aria-hidden="true" />
      </div>

      <div className="section-padding relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-10">
        <nav
          aria-label="Fil d'Ariane"
          className="mb-8 overflow-hidden text-[10px] uppercase tracking-[0.22em] text-background/60 lg:hidden"
        >
          <div
            ref={mobileBreadcrumbRef}
            className="flex min-w-0 flex-nowrap items-center gap-1.5 whitespace-nowrap"
          >
            <Link href="/" className="transition-colors hover:text-background">
              {content.breadcrumbHomeLabel}
            </Link>
            <ChevronRight className="h-3 w-3 shrink-0" aria-hidden="true" />
            <span className="min-w-0 truncate text-background/90">
              {content.breadcrumbCurrentLabel}
            </span>
          </div>
        </nav>

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-8">
            <div className="mb-8 overflow-hidden">
              <p ref={eyebrowRef} className="eyebrow !text-background/70">
                {content.breadcrumbCurrentLabel}
              </p>
            </div>

            <h1
              ref={titleRef}
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
            <div className="mt-10 flex flex-col gap-2 lg:mt-0">
              <div className="overflow-hidden">
                <div ref={portfolioCtaRef}>
                  <HoverFillLink
                    href="/realisations"
                    variant="dark"
                    fullWidth
                    showArrow
                  >
                    Portfolio
                  </HoverFillLink>
                </div>
              </div>
              <div className="overflow-hidden">
                <div ref={contactCtaRef}>
                  <HoverFillLink href="/contact" variant="dark" fullWidth showArrow>
                    Discutons de votre projet
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
              Architecture & gestion de projet
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
