"use client";

import { useEffect, useRef, type RefObject } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { homePageDefaults, type HomePageContent } from "@/lib/content/homepage";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { SectionEyebrow } from "@/components/home/section-eyebrow";

gsap.registerPlugin(ScrollTrigger);

type ServicesContent = HomePageContent["services"];

const serviceHrefs = ["/architecture", "/contact", "/contact"];

/** Viewport heights of scroll per service transition while pinned. */
const TRANSITION_VH = 1.45;
/** Uniform vertical lift for the services list (negative = up). */
const LIST_LIFT_PX = -240;
// Opacity for non-active items so neighbours remain visible (peeking above/below)
// without competing with the centred row for attention.
const DIM_OPACITY = 0.18;
// Peak opacity for the centred service's background image. Kept low so the
// text stays the focal point and the image reads as atmosphere.
const BG_IMAGE_OPACITY = 0.42;
// Per-service parallax: each image translates upward across the entire pin
// duration by `BASE + STEP * index` px (total range), so every layer drifts
// at a slightly different speed for a sense of depth.
const PARALLAX_BASE_PX = 40;
const PARALLAX_STEP_PX = 15;

// ─── Left intro ────────────────────────────────────────────────────────────────
// Fades in on entry (GSAP-driven). Static once pinned.

function ServicesSectionHeader({
  introRef,
  eyebrow,
  title,
}: {
  introRef: RefObject<HTMLDivElement | null>;
  eyebrow: string;
  title: string;
}) {
  return (
    <div ref={introRef} className="text-center">
      <SectionEyebrow>{eyebrow}</SectionEyebrow>
      <h2
        className="mx-auto mt-6 max-w-3xl font-serif font-light leading-[0.95] text-foreground text-balance text-[clamp(2rem,4.5vw,4.375rem)]"
        style={{ letterSpacing: "-0.025em" }}
      >
        {title}
      </h2>
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

// ─── Mobile carousel card ──────────────────────────────────────────────────────
// One swipable slide per service: image on top, copy underneath.

function MobileServiceCard({
  href,
  index,
  title,
  description,
  imageSrc,
}: {
  href: string;
  index: number;
  title: string;
  description: string;
  imageSrc?: string;
}) {
  const numberLabel = String(index + 1).padStart(2, "0");
  return (
    <Link
      href={href}
      className="group flex w-[78vw] max-w-[420px] shrink-0 snap-start flex-col"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
        {imageSrc ? (
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.03]"
            style={{ backgroundImage: `url(${imageSrc})` }}
            role="img"
            aria-label={title}
          />
        ) : null}
        <span
          className="absolute left-4 top-4 font-serif text-2xl font-light italic leading-none text-white mix-blend-difference"
          aria-hidden="true"
        >
          {numberLabel}
        </span>
      </div>
      <div className="mt-5">
        <h3
          className="font-serif text-2xl font-light leading-[1.02] text-foreground"
          style={{ letterSpacing: "-0.018em" }}
        >
          {title}
        </h3>
        <p className="mt-3 text-[13px] font-light leading-[1.65] text-muted-foreground">
          {description}
        </p>
        <span className="mt-5 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.32em] text-foreground/60">
          <span className="h-px w-6 bg-current" aria-hidden="true" />
          Explorer
          <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
        </span>
      </div>
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

    const ctx = gsap.context(() => {
      const n = items.length;
      // The list is flex-centred in its column, so when y=0 the *middle* item
      // sits at the optical centre. Translating up/down by rowHeight brings
      // the next/previous item to centre while keeping neighbours in view.
      const centerIndex = (n - 1) / 2;
      const yFor = (i: number) =>
        (centerIndex - i) * items[0].offsetHeight + LIST_LIFT_PX;

      // ── Initial state ──
      gsap.set(introEl, { opacity: 0, y: 40 });
      gsap.set(list, { y: yFor(0), opacity: 0 });
      items.forEach((item, i) => {
        gsap.set(item, { opacity: i === 0 ? 1 : DIM_OPACITY });
      });
      // First service's background image starts visible at its peak opacity.
      // Each image is pre-translated *downward* by half its parallax range so
      // the pin timeline can sweep it upward through the whole range.
      bgImages.forEach((layer, i) => {
        const range = PARALLAX_BASE_PX + PARALLAX_STEP_PX * i;
        gsap.set(layer, {
          opacity: i === 0 ? BG_IMAGE_OPACITY : 0,
          y: range / 2,
        });
      });

      // ── Entry: intro + list fade in as the section scrolls into view ──
      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            end: "-10% top",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })
        .to(introEl, { opacity: 1, y: 0, ease: "power2.out", duration: 1 }, 0)
        .to(list, { opacity: 1, ease: "power2.out", duration: 1 }, 0.15);

      // ── Pin: scroll the list vertically, one row at a time ──
      const pinDuration = (n - 1) * TRANSITION_VH;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: pinContainer,
          start: "top top",
          end: () => `+=${pinDuration * window.innerHeight}`,
          scrub: 1,
          invalidateOnRefresh: true,
          pinSpacing: true,
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
      ctx.revert();
    };
  }, [content.items.length]);

  if (content.items.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      data-grid-tier="wide"
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
        className="section-padding relative lg:flex lg:min-h-screen lg:h-[105svh] lg:flex-col lg:pb-0"
      >
        {/*
          Per-service background image stack — sits at the very back of the pin
          container. Individual child opacities are driven by GSAP so only the
          centred service's image is visible at a time.
        */}
        <div aria-hidden="true" className="services-bg-shell hidden lg:block">
          <div className="h-full w-full lg:grid lg:grid-cols-12 lg:gap-x-[var(--grid-gap)]">
            <div className="services-bg-stack lg:col-span-7 lg:col-start-6">
              {content.items.map((service, index) => (
                <div
                  key={`bg-${service.title}-${index}`}
                  ref={(el) => {
                    bgImagesRef.current[index] = el;
                  }}
                  className="services-bg-layer absolute inset-0 flex items-center justify-center lg:will-change-transform"
                >
                  <div
                    className="services-bg-image bg-cover bg-center bg-no-repeat"
                    style={{
                      backgroundImage: service.image?.src
                        ? `url(${service.image.src})`
                        : undefined,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/15 to-transparent"
        />

        <div className="section-shell relative z-10 flex flex-1 flex-col">
          <ServicesSectionHeader
            introRef={introRef}
            eyebrow={content.eyebrow}
            title={content.title}
          />

          {/*
            Mobile / tablet (<lg): horizontally swipable carousel of
            image + copy cards. Bleeds to the right edge of the screen,
            with scroll-snap per card.
          */}
          <div className="mt-12 -mr-[var(--page-pad-x)] lg:hidden">
            <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 pr-[var(--page-pad-x)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {content.items.map((service, index) => (
                <MobileServiceCard
                  key={`mobile-${service.title}`}
                  href={serviceHrefs[index] ?? "/contact"}
                  index={index}
                  title={service.title}
                  description={service.description}
                  imageSrc={service.image?.src}
                />
              ))}
            </div>
          </div>

          <div className="hidden lg:mt-14 lg:grid lg:flex-1 lg:grid-cols-12 lg:gap-x-[var(--grid-gap)]">
            {/*
              Service list — left six columns (1/7), vertically centres the
              active row, and clips overflowing neighbours with a soft mask.
            */}
            <div
              className={cn(
                "lg:col-[1/7] lg:flex lg:flex-col lg:pt-[8svh] lg:overflow-hidden",
                "lg:[mask-image:linear-gradient(to_bottom,transparent_0%,black_14%,black_86%,transparent_100%)]",
                "lg:[-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_14%,black_86%,transparent_100%)]",
              )}
            >
              <ul
                ref={listRef}
                className="relative w-full lg:will-change-transform"
              >
                {content.items.map((service, index) => (
                  <li
                    key={service.title}
                    ref={(el) => {
                      itemsRef.current[index] = el;
                    }}
                    className="border-b border-border/40 last:border-b-0 lg:min-h-[28svh] lg:flex lg:items-center"
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
