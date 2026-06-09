"use client";

import { useEffect, useRef, useState } from "react";
import { ProjectImage } from "@/components/project-image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { homePageDefaults, type HomePageContent } from "@/lib/content/homepage";
import { SectionEyebrow } from "@/components/home/section-eyebrow";
import { ModularGridOverlay } from "@/components/ModularGridBackground";

type GalleryContent = HomePageContent["galleryPreview"];

type GalleryRow = {
  src: string;
  alt: string;
  label: string;
  slug: string;
};

type RowMotion = {
  progress: number;
  opacity: number;
  translateY: number;
  parallaxY: number;
};

const hiddenRowMotion: RowMotion = {
  progress: 0,
  opacity: 0,
  translateY: 80,
  parallaxY: 60,
};

const settledRowMotion: RowMotion = {
  progress: 1,
  opacity: 1,
  translateY: 0,
  parallaxY: 0,
};

function computeRowMotion(rect: DOMRect, vh: number): RowMotion {
  const center = rect.top + rect.height / 2;
  const focus = vh * 0.55;
  const range = vh * 0.7;
  const linear = Math.max(0, Math.min(1, 1 - Math.abs(center - focus) / range));

  const remaining = 1 - linear;
  return {
    progress: linear,
    opacity: 0.18 + linear * 0.82,
    translateY: remaining * 80,
    parallaxY: (center - focus) * 0.08,
  };
}

function GalleryShowcaseRow({
  index,
  row,
  total,
}: {
  index: number;
  row: GalleryRow;
  total: number;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const [motion, setMotion] = useState<RowMotion>(hiddenRowMotion);
  const [loaded, setLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const frame = useRef<number | null>(null);
  const numberLabel = String(index + 1).padStart(2, "0");
  const totalLabel = String(total).padStart(2, "0");
  const mobileGrayscale = Math.min(1, Math.max(0, 1 - motion.progress * 1.25));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mobileMq = window.matchMedia("(max-width: 1023px)");
    const syncMobile = () => setIsMobile(mobileMq.matches);
    syncMobile();
    mobileMq.addEventListener("change", syncMobile);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMotion(settledRowMotion);
      return () => mobileMq.removeEventListener("change", syncMobile);
    }

    const update = () => {
      const vh = window.innerHeight;
      setMotion(computeRowMotion(el.getBoundingClientRect(), vh));
      frame.current = null;
    };

    const onScroll = () => {
      if (frame.current !== null) return;
      frame.current = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    window.__lenis?.on("scroll", onScroll);

    return () => {
      mobileMq.removeEventListener("change", syncMobile);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      window.__lenis?.off("scroll", onScroll);
      if (frame.current !== null) {
        window.cancelAnimationFrame(frame.current);
      }
    };
  }, []);

  return (
    <li
      ref={ref}
      className="group relative border-b border-background/15"
      style={{
        opacity: motion.opacity,
        transform: `translate3d(0, ${motion.translateY}px, 0)`,
        willChange: "transform, opacity",
      }}
    >
      <Link
        href={`/realisations/${row.slug}`}
        aria-label={`Voir le projet ${row.alt}`}
        className="flex flex-col gap-6 py-10 lg:gap-8 lg:py-14 xl:py-16"
      >
        <div
          className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/10] lg:aspect-[3/2]"
          style={{
            transform: `translate3d(0, ${motion.parallaxY}px, 0)`,
            willChange: "transform",
          }}
        >
          {!loaded ? (
            <div
              className="absolute inset-0 bg-background/[0.06]"
              aria-hidden="true"
            />
          ) : null}
          <ProjectImage
            src={row.src}
            alt={row.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 55vw"
            onLoad={() => setLoaded(true)}
            className={cn(
              "object-cover transition-[transform,filter,opacity] ease-out will-change-transform [transition-duration:1200ms]",
              loaded ? "opacity-100" : "opacity-0",
              "group-hover:scale-[1.04]",
              !isMobile && "grayscale group-hover:grayscale-0",
            )}
            style={{
              transform: `scale(${1 + (1 - motion.progress) * 0.06})`,
              ...(isMobile
                ? { filter: `grayscale(${mobileGrayscale})` }
                : undefined),
            }}
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 transition-opacity duration-500 group-hover:opacity-30"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute right-3 top-3 flex h-9 w-9 items-center justify-center border border-background/40 bg-background/5 backdrop-blur-sm transition-all duration-500 group-hover:border-background group-hover:bg-background group-hover:text-foreground"
            aria-hidden="true"
          >
            <ArrowUpRight className="h-4 w-4" strokeWidth={1.25} />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-baseline gap-4">
            <span
              className="font-serif text-3xl font-light italic leading-none text-background/55 transition-colors duration-500 group-hover:text-background md:text-4xl"
              aria-hidden="true"
            >
              {numberLabel}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.36em] text-background/45">
              {row.label} · {numberLabel}/{totalLabel}
            </span>
          </div>
          <h3
            className={cn(
              "font-serif font-light leading-[0.95] text-background transition-transform duration-700",
              "text-2xl md:text-3xl lg:text-[2.5rem] xl:text-[3rem]",
              "group-hover:translate-y-1",
            )}
            style={{ letterSpacing: "-0.018em" }}
          >
            {row.alt}
          </h3>
          <span className="mt-1 inline-flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.32em] text-background/60 transition-colors group-hover:text-background">
            <span
              className="h-px w-6 bg-current transition-all duration-500 group-hover:w-12"
              aria-hidden="true"
            />
            Voir le projet
          </span>
        </div>
      </Link>
    </li>
  );
}

function GalleryStickyIntro({ content }: { content: GalleryContent }) {
  return (
    <div className="lg:sticky lg:top-28 lg:flex lg:max-h-[calc(100dvh-7rem)] lg:flex-col lg:justify-center">
      <div className="flex flex-col gap-8">
        <SectionEyebrow tone="dark">{content.eyebrow}</SectionEyebrow>
        <h2
          className="font-serif font-light leading-[0.95] text-background text-balance text-[clamp(2.5rem,5.6vw,5.5rem)]"
          style={{ letterSpacing: "-0.025em" }}
        >
          {content.title}
        </h2>
        <p className="max-w-md text-sm font-light leading-[1.7] text-background/65 lg:text-[15px]">
          {content.subtitle}
        </p>
        <Link
          href="/realisations"
          className="group mt-2 inline-flex w-fit items-center gap-3 border border-background/30 bg-background/[0.04] px-6 py-3 text-[11px] font-medium uppercase tracking-[0.32em] text-background backdrop-blur-sm transition-all duration-500 hover:border-background hover:bg-background hover:text-foreground"
        >
          {content.ctaLabel}
          <ArrowUpRight
            className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            strokeWidth={1.5}
          />
        </Link>
      </div>
    </div>
  );
}

export function GalleryPreview({
  content = homePageDefaults.galleryPreview,
  images = [],
}: {
  content?: GalleryContent;
  images?: Array<{ src: string; alt: string; label: string; slug: string }>;
}) {
  if (images.length === 0) {
    return null;
  }

  const rows = images.slice(0, 6);

  return (
    <section
      data-grid-tier="bleed"
      data-snap-soft
      className="gallery-preview-surface relative isolate overflow-hidden text-background"
      aria-label={content.title}
    >
      <ModularGridOverlay logoRatio={0.05} />

      <div className="relative z-[1]">
        <div className="section-padding relative mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <GalleryStickyIntro content={content} />
            </div>

            <div className="lg:col-span-8">
              <ul className="border-t border-background/15">
                {rows.map((row, index) => (
                  <GalleryShowcaseRow
                    key={`${row.src}-${index}`}
                    index={index}
                    row={row}
                    total={rows.length}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
