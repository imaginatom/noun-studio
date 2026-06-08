"use client";

import { useEffect, useRef, type RefObject } from "react";
import Link from "next/link";
import { HoverFillLink } from "@/components/hover-fill-link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { homePageDefaults, type HomePageContent } from "@/lib/content/homepage";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    __servicesExitSnap?: boolean;
  }
}

type ServicesContent = HomePageContent["services"];

const serviceHrefs = ["/architecture", "/contact", "/contact"];

/** Viewport heights of scroll per service transition while pinned. */
const TRANSITION_VH = 1.45;
/** Matches `.services-section.is-transitioning` duration in globals.css */
const THEME_FLIP_MS = 700;
// Opacity for non-active items so neighbours remain visible (peeking above/below)
// without competing with the centred row for attention.
const DIM_OPACITY = 0.18;
// Peak opacity for the centred service's background image. Kept low so the
// text stays the focal point and the image reads as atmosphere.
const BG_IMAGE_OPACITY = 0.22;
// Per-service parallax: each image translates upward across the entire pin
// duration by `BASE + STEP * index` px (total range), so every layer drifts
// at a slightly different speed for a sense of depth.
const PARALLAX_BASE_PX = 160;
const PARALLAX_STEP_PX = 80;
// Vertical headroom added to each bg image so translation never reveals
// empty edges. Should be >= max(|y|) used by the parallax tweens.
const PARALLAX_HEADROOM_PX = 220;

// ─── Left intro ────────────────────────────────────────────────────────────────
// Fades in on entry (GSAP-driven). Static once pinned.

function ServicesStickyIntro({
  introRef,
  eyebrow,
  title,
  ctaLabel,
}: {
  introRef: RefObject<HTMLDivElement | null>;
  eyebrow: string;
  title: string;
  ctaLabel: string;
}) {
  return (
    <div className="lg:py-16">
      <div ref={introRef} className="max-w-[28rem]">
        <p className="eyebrow flex items-center gap-3">
          <span
            className="inline-block h-px w-8 bg-foreground/40"
            aria-hidden="true"
          />
          {eyebrow}
        </p>
        <h2
          className="mt-8 font-serif font-light leading-[0.95] text-foreground text-balance text-[clamp(2rem,4.5vw,4.375rem)]"
          style={{ letterSpacing: "-0.025em" }}
        >
          {title}
        </h2>
        <div
          className="mt-10 hidden h-px w-full max-w-[6rem] origin-left bg-foreground/40 lg:block"
          aria-hidden="true"
        />
        <p className="mt-6 hidden max-w-sm text-[13px] font-light leading-relaxed text-muted-foreground lg:block">
          Chaque pratique nourrit l'autre — architecture, design et contenu,
          pensés comme un seul geste.
        </p>
        <HoverFillLink href="/contact" showArrow className="mt-10 lg:mt-12">
          {ctaLabel}
        </HoverFillLink>
      </div>
    </div>
  );
}

// ─── Service row ───────────────────────────────────────────────────────────────

function ServiceRow({
  href,
  index,
  title,
  description,
}: {
  href: string;
  index: number;
  title: string;
  description: string;
}) {
  const numberLabel = String(index + 1).padStart(2, "0");
  return (
    <Link
      href={href}
      className="group grid w-full grid-cols-12 items-start gap-4 py-14 transition-colors hover:bg-muted/20 lg:gap-6 lg:py-20"
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
          <span
            className="h-px w-6 bg-current transition-all duration-500 group-hover:w-10"
            aria-hidden="true"
          />
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
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export function ServicesOverview({
  content = homePageDefaults.services,
}: {
  content?: ServicesContent;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const itemsRef = useRef<(HTMLLIElement | null)[]>([]);
  const bgImagesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const pinContainer = pinContainerRef.current;
    const introEl = introRef.current;
    const list = listRef.current;
    const items = itemsRef.current.filter(Boolean) as HTMLLIElement[];
    const bgImages = bgImagesRef.current.filter(Boolean) as HTMLDivElement[];

    if (!section || !pinContainer || !introEl || !list || items.length < 2)
      return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion || window.innerWidth < 1024) return;

    // Coordinated theme flip: enable the slow transition rules, toggle the
    // inverted state, then drop the transition class so hover effects revert
    // to their natural snappiness once the cross-fade is finished.
    let flipTimer: number | undefined;
    let exitScrollTimer: number | undefined;
    const setInverted = (inverted: boolean) => {
      if (typeof window === "undefined") return;
      window.clearTimeout(flipTimer);
      section.classList.add("is-transitioning");
      section.classList.toggle("is-inverted", inverted);
      flipTimer = window.setTimeout(() => {
        section.classList.remove("is-transitioning");
      }, THEME_FLIP_MS + 80);
    };

    const ctx = gsap.context(() => {
      const n = items.length;
      // The list is flex-centred in its column, so when y=0 the *middle* item
      // sits at the optical centre. Translating up/down by rowHeight brings
      // the next/previous item to centre while keeping neighbours in view.
      const centerIndex = (n - 1) / 2;
      const yFor = (i: number) => (centerIndex - i) * items[0].offsetHeight;

      // ── Initial state ──
      gsap.set(introEl, { opacity: 0, y: 40 });
      gsap.set(list, { y: yFor(0), opacity: 0 });
      items.forEach((item, i) => {
        gsap.set(item, { opacity: i === 0 ? 1 : DIM_OPACITY });
      });
      // First service's background image starts visible at its peak opacity
      // (the wrapper itself is gated by the `.is-inverted` CSS rule so nothing
      // shows until the section locks into the dark surface). Each image is
      // pre-translated *downward* by half its parallax range so the pin
      // timeline can sweep it upward through the whole range.
      bgImages.forEach((img, i) => {
        const range = PARALLAX_BASE_PX + PARALLAX_STEP_PX * i;
        gsap.set(img, {
          opacity: i === 0 ? BG_IMAGE_OPACITY : 0,
          y: range / 2,
        });
      });

      // ── Entry: intro + list fade in as the section scrolls into view ──
      // The same trigger also flips the section to its dark/inverted theme at
      // the exact moment the pin engages (`onLeave`) and reverses it when the
      // user scrolls back up past the pin start (`onEnterBack`).
      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            end: "-10% top",
            scrub: 1,
            invalidateOnRefresh: true,
            onLeave: () => setInverted(true),
            onEnterBack: () => setInverted(false),
          },
        })
        .to(introEl, { opacity: 1, y: 0, ease: "power2.out", duration: 1 }, 0)
        .to(list, { opacity: 1, ease: "power2.out", duration: 1 }, 0.15);

      // ── Pin: scroll the list vertically, one row at a time ──
      const pinDuration = (n - 1) * TRANSITION_VH;
      let exitSnapActive = false;

      const performApprocheScroll = () => {
        const approche = section.nextElementSibling;
        if (!approche || !(approche instanceof HTMLElement)) {
          exitSnapActive = false;
          window.__servicesExitSnap = false;
          return;
        }

        const lenis = window.__lenis;
        const targetY = approche.getBoundingClientRect().top + window.scrollY;
        const currentY = lenis?.scroll ?? window.scrollY;
        const distance = Math.max(0, targetY - currentY);

        const finish = () => {
          exitSnapActive = false;
          window.__servicesExitSnap = false;
          ScrollTrigger.refresh();
        };

        if (distance < 6) {
          finish();
          return;
        }

        const duration = Math.min(
          1.05,
          Math.max(0.7, distance / window.innerHeight + 0.4),
        );
        const easeInOutQuad = (t: number) =>
          t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

        if (lenis) {
          lenis.scrollTo(targetY, {
            duration,
            lock: true,
            force: true,
            programmatic: true,
            easing: easeInOutQuad,
            onComplete: finish,
          });
        } else {
          window.scrollTo({ top: targetY, behavior: "smooth" });
          window.setTimeout(finish, duration * 1000);
        }
      };

      const exitToApproche = () => {
        if (exitSnapActive) return;

        exitSnapActive = true;
        window.__servicesExitSnap = true;

        // Mirror entry: cross-fade back to the light surface, then continue to Approche.
        setInverted(false);
        window.clearTimeout(exitScrollTimer);
        exitScrollTimer = window.setTimeout(
          performApprocheScroll,
          THEME_FLIP_MS,
        );
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: pinContainer,
          start: "top top",
          end: () => `+=${pinDuration * window.innerHeight}`,
          scrub: 1,
          invalidateOnRefresh: true,
          pinSpacing: true,
          onLeave: (self) => {
            if (self.direction !== 1) return;
            exitToApproche();
          },
          onLeaveBack: () => {
            if (exitSnapActive) return;
            window.clearTimeout(exitScrollTimer);
            setInverted(true);
          },
          onEnterBack: () => {
            if (exitSnapActive) return;
            window.clearTimeout(exitScrollTimer);
            setInverted(true);
          },
        },
      });

      // Continuous parallax: every bg image sweeps upward across the whole pin,
      // each at a different range so layers feel like they live at different
      // depths. Runs in parallel to the cross-fade tweens below (different
      // property → no conflict).
      bgImages.forEach((img, i) => {
        const range = PARALLAX_BASE_PX + PARALLAX_STEP_PX * i;
        tl.to(
          img,
          { y: -range / 2, ease: "easeInOut", duration: pinDuration },
          0,
        );
      });

      for (let i = 0; i < n - 1; i++) {
        const at = i * TRANSITION_VH;
        tl.to(
          list,
          {
            y: () => yFor(i + 1),
            ease: "power2.inOut",
            duration: TRANSITION_VH,
          },
          at,
        );
        tl.to(
          items[i],
          {
            opacity: DIM_OPACITY,
            ease: "power2.inOut",
            duration: TRANSITION_VH,
          },
          at,
        );
        tl.to(
          items[i + 1],
          { opacity: 1, ease: "power2.inOut", duration: TRANSITION_VH },
          at,
        );
        // Cross-fade the background images on the same beat as the items.
        if (bgImages[i]) {
          tl.to(
            bgImages[i],
            { opacity: 0, ease: "power2.inOut", duration: TRANSITION_VH },
            at,
          );
        }
        if (bgImages[i + 1]) {
          tl.to(
            bgImages[i + 1],
            {
              opacity: BG_IMAGE_OPACITY,
              ease: "power2.inOut",
              duration: TRANSITION_VH,
            },
            at,
          );
        }
      }
    }, section);

    return () => {
      if (typeof window !== "undefined") {
        window.clearTimeout(flipTimer);
        window.clearTimeout(exitScrollTimer);
      }
      section.classList.remove("is-inverted", "is-transitioning");
      ctx.revert();
    };
  }, [content.items.length]);

  if (content.items.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      data-grid-tier="bleed"
      data-snap-soft
      className="services-section relative"
      aria-label={content.title}
    >
      {/*
        pinContainerRef: the element GSAP pins.
        On desktop: h-screen with flex centering so content sits in the viewport.
        On mobile/tablet: natural height, normal scroll, no animation.
      */}
      <div
        ref={pinContainerRef}
        className="relative py-24 lg:flex lg:min-h-screen lg:h-[105svh] lg:flex-col lg:pt-28 lg:pb-0"
      >
        {/*
          Per-service background image stack — sits at the very back of the pin
          container. The wrapper's visibility is gated by the `.is-inverted`
          rule so the images only appear once the section locks into the dark
          surface; individual child opacities are driven by GSAP so only the
          centred service's image is visible at a time.
        */}
        <div
          aria-hidden="true"
          className="services-bg-stack pointer-events-none absolute inset-0 overflow-hidden"
        >
          {content.items.map((service, index) => (
            <div
              key={`bg-${service.title}-${index}`}
              ref={(el) => {
                bgImagesRef.current[index] = el;
              }}
              className="services-bg-image absolute bg-cover bg-center bg-no-repeat lg:will-change-transform"
              style={{
                // Extend past the wrapper on the Y axis so vertical parallax
                // never exposes an empty band at the top or bottom.
                top: `-${PARALLAX_HEADROOM_PX}px`,
                bottom: `-${PARALLAX_HEADROOM_PX}px`,
                left: 0,
                right: 0,
                backgroundImage: service.image?.src
                  ? `url(${service.image.src})`
                  : undefined,
              }}
            />
          ))}
        </div>
        {/*
          Grid backdrop — sits above the bg images so the gridlines read on
          top of the artwork. Opacity is driven by the `.is-inverted` rule.
        */}
        <div
          aria-hidden="true"
          className="services-grid-backdrop pointer-events-none absolute inset-0"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/15 to-transparent"
        />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:flex lg:flex-1 lg:flex-col lg:px-10">
          <div className="grid gap-8 lg:grid-cols-12 lg:flex-1 lg:items-stretch lg:gap-16">
            {/* Left column — top-aligned relative to the grid */}
            <div className="lg:col-span-5 lg:self-start lg:pt-0">
              <ServicesStickyIntro
                introRef={introRef}
                eyebrow={content.eyebrow}
                title={content.title}
                ctaLabel={content.ctaLabel}
              />
            </div>

            {/*
              Right column — fills the remaining viewport height, vertically
              centres the list, and clips the overflowing neighbours with a
              soft mask so they peek in / out instead of being hard-cut.
            */}
            <div
              className={cn(
                "lg:col-span-7 lg:relative lg:flex lg:flex-col lg:justify-center lg:overflow-hidden",
                "lg:[mask-image:linear-gradient(to_bottom,transparent_0%,black_14%,black_86%,transparent_100%)]",
                "lg:[-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_14%,black_86%,transparent_100%)]",
              )}
            >
              <ul
                ref={listRef}
                className="relative w-full border-t border-border/40 lg:border-t-0 lg:will-change-transform"
              >
                {content.items.map((service, index) => (
                  <li
                    key={service.title}
                    ref={(el) => {
                      itemsRef.current[index] = el;
                    }}
                    className="border-b border-border/40 last:border-b-0 lg:min-h-[38svh] lg:flex lg:items-center"
                  >
                    <ServiceRow
                      href={serviceHrefs[index] ?? "/contact"}
                      index={index}
                      title={service.title}
                      description={service.description}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
