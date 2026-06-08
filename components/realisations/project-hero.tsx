"use client";

import { useLayoutEffect, useRef } from "react";
import { HoverFillLink } from "@/components/hover-fill-link";
import { cn } from "@/lib/utils";
import type { PortfolioProject } from "@/lib/portfolio-project";
import { PinnedImageSequence } from "@/components/pinned-image-sequence";
import { gsap, ScrollTrigger } from "@/lib/gsap-register";
import {
  HERO_REVEAL,
  HERO_WORD_SPLIT,
  prepareLineSplit,
  prepareWordSplit,
  revealBlock,
  revealSplit,
  revealTitleSecondLineFill,
  revealWordsOnTimeline,
  setTitleSecondLineFillComplete,
  setupTitleLineFill,
} from "@/lib/hero-reveal";

const TITLE_SPLIT = {
  lineIndent: { 1: "clamp(1.75rem, 6vw, 3rem)" },
} as const;

type ProjectHeroProps = {
  project: PortfolioProject;
  contactHref: string;
  contactLabel: string;
  projectIndex?: number;
};

const PROSE_CLASS =
  "font-serif text-xl font-medium leading-[1.55] text-foreground/75 lg:text-2xl";

export function ProjectHero({
  project,
  contactHref,
  contactLabel,
  projectIndex,
}: ProjectHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const locationRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const galleryImages = project.gallery.filter((image) => image.src);

  const images = galleryImages.map((image) => ({
    src: image.src,
    alt: image.alt,
    aspect: image.aspect,
  }));

  const definitionsByImageIndex = galleryImages.map((image) =>
    image.definition?.trim() ? image.definition.trim() : null,
  );
  const firstDefinitionIndex = definitionsByImageIndex.findIndex(Boolean);

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
        const layers = gsap.utils.toArray<HTMLElement>(
          "[data-sequence-layer]",
          sectionRef.current,
        );

        // WHAT: instantly sets the starting clip of every image layer (no animation).
        // HOW:  first image (i===0) is fully visible (inset 0 on all sides);
        //       every other image is clipped away from the right edge
        //       (`inset(0% 100% 0% 0%)` = 100% cut from the right → hidden).
        // WHEN: on mount, before any timeline runs — establishes the initial state.
        gsap.set(layers, {
          clipPath: (i) =>
            i === 0 ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
        });

        if (!reducedMotion) {
          // WHAT: the one-shot intro timeline (plays once on load, NOT scroll-driven).
          // HOW:  `defaults` apply the shared ease + duration to every tween added
          //       below unless that tween overrides them.
          // WHEN: runs immediately after fonts are ready; sequences title → copy → first image.
          const introTl = gsap.timeline({
            defaults: {
              ease: HERO_REVEAL.ease,
              duration: HERO_REVEAL.duration,
            },
          });

          const titleSplit = prepareLineSplit(titleRef.current, TITLE_SPLIT);
          const titleLineFill = setupTitleLineFill(titleSplit, 1);

          if (titleSplit) {
            // WHAT: animates the title's split lines (the <h1>) into place.
            // HOW:  `from` means animate FROM these values TO the resting CSS:
            //       each line starts pushed down 105% of its height and slides up;
            //       `stagger` offsets each line so they cascade one after another.
            // WHEN: position `0` = the very start of the intro timeline (first thing seen).
            introTl.from(
              titleSplit.lines,
              {
                yPercent: 105,
                duration: HERO_REVEAL.duration,
                stagger: HERO_REVEAL.stagger,
                ease: HERO_REVEAL.ease,
              },
              0,
            );
          }

          // WHAT: reveals the description paragraph (split into lines, see hero-reveal.ts).
          // WHEN: `">"` = starts right after the previous tween (the title) ends.
          revealSplit(descriptionRef.current, introTl, ">", HERO_WORD_SPLIT);
          // A named timeline position so the next two reveals can both anchor here.
          introTl.addLabel("rest", ">");

          // WHAT: reveal the location line and the CTA block.
          // WHEN: both at the "rest" label → they animate together (in parallel).
          revealSplit(locationRef.current, introTl, "rest");
          revealBlock(ctaRef.current, introTl, "rest");

          // Label marking where all the text copy has finished animating.
          introTl.addLabel("copyDone", ">");
          // WHAT: fills in the second title line's accent/highlight effect.
          // WHEN: at "copyDone" → only after the copy is done.
          revealTitleSecondLineFill(introTl, titleLineFill, "copyDone");

          if (layers[0]) {
            // WHAT: reveals the FIRST gallery image.
            // HOW:  `from` the clipped-from-right state (`inset(0% 100% 0% 0%)`)
            //       to its resting fully-visible clip → wipes in from the left.
            // WHEN: `">"` = after the title-fill above, so the image is the last
            //       element of the intro to appear.
            introTl.from(
              layers[0],
              {
                clipPath: "inset(0% 0% 100% 0%)",
                duration: HERO_REVEAL.imageDuration,
              },
              ">",
            );
          }
        } else {
          // REDUCED-MOTION fallback: no animation. Jump straight to the final state.
          const titleSplit = prepareLineSplit(titleRef.current, TITLE_SPLIT);
          setTitleSecondLineFillComplete(setupTitleLineFill(titleSplit, 1));
          if (layers[0]) {
            // WHAT: instantly show the first image fully (no wipe).
            // WHEN: on mount when the user prefers reduced motion.
            gsap.set(layers[0], { clipPath: "inset(0% 0% 0% 0%)" });
          }
        }

        const definitionLayers = gsap.utils.toArray<HTMLElement>(
          "[data-definition-layer]",
          sectionRef.current,
        );

        const definitionByImageIndex = new Map<number, HTMLElement>();
        definitionLayers.forEach((layer) => {
          const index = Number(layer.dataset.imageIndex);
          if (!Number.isNaN(index)) {
            definitionByImageIndex.set(index, layer);
          }
        });

        // WHAT: instantly hide every definition caption (no animation).
        // HOW:  `inset(0% 0% 100% 0%)` = 100% cut from the BOTTOM → clipped away
        //       downward, ready to wipe up into view later.
        // WHEN: on mount, before the scroll timeline runs.
        gsap.set(definitionLayers, { clipPath: "inset(0% 0% 100% 0%)" });

        const definitionSplits = new Map<
          number,
          ReturnType<typeof prepareWordSplit>
        >();
        definitionLayers.forEach((layer) => {
          const index = Number(layer.dataset.imageIndex);
          const textEl = layer.querySelector("p");
          if (!Number.isNaN(index) && textEl) {
            definitionSplits.set(index, prepareWordSplit(textEl));
          }
        });

        const descriptionWrap = sectionRef.current?.querySelector<HTMLElement>(
          "[data-description-wrap]",
        );
        const hasScrollCopy =
          !reducedMotion && (definitionLayers.length > 0 || layers.length > 1);

        // One scroll "beat" = one image-to-image transition. Every element in
        // a beat (outgoing image + its copy, incoming image + its copy) shares
        // the same start position and duration so they exit/enter in lockstep.
        const BEAT_DURATION = 1;

        // Reusable tween VARS (passed to `.to()` below).
        // clipOut: animates an element OUT by clipping it away from the TOP
        //   (`inset(100% 0% 0% 0%)` = 100% cut from top → wipes upward off-screen).
        //   `immediateRender: false` stops GSAP from applying this end-state early,
        //   which matters because these vars are reused across many tweens.
        const clipOut = {
          clipPath: "inset(0% 0% 100% 0%)",
          ease: "power3.in",
          duration: BEAT_DURATION,
          immediateRender: false,
        } as const;

        // clipIn: animates an element IN to fully visible (`inset(0%...)` = no clip).
        const clipIn = {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "power3.out",
          duration: BEAT_DURATION,
        } as const;

        const addSyncedScrollBeat = (
          timeline: gsap.core.Timeline,
          fromIndex: number,
        ) => {
          // A beat has two phases that don't overlap: first the outgoing image
          // (and its copy) fully clip away, THEN the incoming image (and its
          // copy) clip in. Each phase shares one start + duration so the pair
          // moves in lockstep.
          // outAt = current end of the timeline → this beat starts where the last ended.
          const outAt = timeline.duration();

          // WHAT: clip the OUTGOING image away. WHEN: at the start of this beat.
          timeline.to(layers[fromIndex], clipOut, outAt);

          // WHAT: clip away the OUTGOING text that pairs with the outgoing image —
          //       the main description on beat 0, otherwise that image's definition.
          // WHEN: same `outAt` → exits in perfect sync with the outgoing image.
          if (fromIndex === 0 && descriptionWrap) {
            timeline.to(descriptionWrap, clipOut, outAt);
          } else {
            const outgoingDef = definitionByImageIndex.get(fromIndex);
            if (outgoingDef) {
              timeline.to(outgoingDef, clipOut, outAt);
            }
          }

          // Incoming phase starts only once the outgoing phase has finished.
          const inAt = outAt + BEAT_DURATION;

          // WHAT: clip the INCOMING (next) image into view.
          // WHEN: at `inAt` → only after the outgoing one is fully hidden.
          const nextLayer = layers[fromIndex + 1];
          if (nextLayer) {
            timeline.to(nextLayer, clipIn, inAt);
          }

          // WHAT: clip the INCOMING image's definition in, in sync with it.
          // WHEN: same `inAt` → image + its caption appear together.
          const incomingDefIndex = fromIndex + 1;
          const incomingDef = definitionByImageIndex.get(incomingDefIndex);
          if (incomingDef) {
            timeline.to(incomingDef, clipIn, inAt);
            revealWordsOnTimeline(
              definitionSplits.get(incomingDefIndex) ?? null,
              timeline,
              inAt,
              BEAT_DURATION,
            );
          }
        };

        if (hasScrollCopy) {
          // WHAT: forces the pinned wrapper GSAP creates to keep overflow visible
          //       (GSAP's pin-spacer can clip content); `gsap.set` applies it instantly.
          // WHEN: called from the ScrollTrigger callbacks below (enter / enterBack / refresh).
          const keepPinnedOverflowVisible = (self: ScrollTrigger) => {
            if (self.pin) {
              gsap.set(self.pin, { overflow: "visible" });
            }
          };

          // Each transition is now two non-overlapping phases (out, then in),
          // so give every transition a full viewport of scroll for pacing.
          const transitionCount = layers.length > 1 ? layers.length - 1 : 1;
          const scrollSegments = Math.max(transitionCount, 1) * 2;

          // WHAT: the SCROLL-DRIVEN timeline that plays the image/definition beats.
          // HOW (scrollTrigger options):
          //   trigger              – the whole hero <section> drives progress.
          //   start "top top"      – begins when the section's top hits the viewport top.
          //   end "+= segments*vh" – pins for `scrollSegments` full viewport heights of scroll.
          //   pin / pinSpacing     – freezes the section in place while you scroll through it.
          //   anticipatePin: 1     – pre-pins slightly early to avoid a jump at engage.
          //   invalidateOnRefresh  – recompute positions on resize/refresh.
          //   scrub: 1             – ties timeline progress to scroll with ~1s smoothing
          //                          (this is what makes it feel scroll-linked, not auto-play).
          //   onEnter/Back/Refresh – keep the pinned wrapper's overflow visible (see above).
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: () => "+=" + scrollSegments * window.innerHeight,
              pin: true,
              pinSpacing: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              scrub: 1,
              onEnter: keepPinnedOverflowVisible,
              onEnterBack: keepPinnedOverflowVisible,
              onRefresh: keepPinnedOverflowVisible,
            },
          });

          // WHAT: instantly ensure the description starts fully visible before scrolling.
          if (descriptionWrap) {
            gsap.set(descriptionWrap, { clipPath: "inset(0% 0% 0% 0%)" });
          }

          if (layers.length === 1) {
            // SINGLE-IMAGE case: no image swap, just swap description → definition.
            if (descriptionWrap) {
              // WHAT: clip the description OUT. WHEN: at scroll position 0 (start of pin).
              tl.to(descriptionWrap, clipOut, 0);
            }

            const firstDefinition = definitionByImageIndex.get(0);
            if (firstDefinition) {
              const definitionInAt = descriptionWrap ? BEAT_DURATION : 0;
              // WHAT: clip the single definition IN.
              // HOW:  `fromTo` defines both ends explicitly (start hidden-below → visible).
              // WHEN: at `BEAT_DURATION` → only after the description has fully gone.
              tl.fromTo(
                firstDefinition,
                { clipPath: "inset(100% 0% 0% 0%)" },
                clipIn,
                definitionInAt,
              );
              revealWordsOnTimeline(
                definitionSplits.get(0) ?? null,
                tl,
                definitionInAt,
                BEAT_DURATION,
              );
            }
          } else {
            // MULTI-IMAGE case: add one synced out→in beat per image transition.
            layers.forEach((_, index) => {
              if (index === layers.length - 1) return; // last image has nothing to transition to
              addSyncedScrollBeat(tl, index);
            });
          }
        } else if (reducedMotion) {
          // REDUCED-MOTION + no scroll copy: just show the first definition statically.
          definitionByImageIndex
            .get(0)
            ?.style.setProperty("clip-path", "inset(0% 0% 0% 0%)");
          definitionSplits.forEach((split) => {
            if (split) gsap.set(split.words, { yPercent: 0 });
          });
        }
      }, sectionRef);
    };

    init();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [project.slug]);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-visible"
    >
      <div className="mx-auto grid h-full max-w-[1440px] grid-cols-12 items-center gap-x-6 px-[clamp(16px,4vw,64px)]">
        <div className="col-span-6 mx-auto flex max-h-screen max-w-[500px] flex-col justify-center self-center overflow-visible py-10 lg:py-14">
          <header className="text-left">
            <div className="overflow-visible pb-1">
              <h1
                ref={titleRef}
                className="w-full overflow-visible font-serif text-[clamp(3rem,7.5vw,6rem)] font-light leading-[1.08] text-[#0a0a0a] text-balance"
                style={{ letterSpacing: "-0.03em" }}
              >
                {project.title}
              </h1>
            </div>
            <div className="mt-4">
              <div className="flex items-center gap-3">
                {projectIndex ? (
                  <span className="text-xs font-medium tabular-nums tracking-[0.28em] text-foreground/35">
                    {String(projectIndex).padStart(2, "0")}
                  </span>
                ) : null}
                <span
                  className="h-px w-10 bg-foreground/20"
                  aria-hidden="true"
                />
              </div>
              <p
                ref={locationRef}
                className="mt-4 text-sm font-medium uppercase tracking-[0.18em] text-foreground/40"
              >
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
            <div className="relative mt-6">
              <div data-description-wrap className="overflow-hidden">
                <p ref={descriptionRef} className={PROSE_CLASS}>
                  {project.description}
                </p>
              </div>
              {definitionsByImageIndex.some(Boolean) ? (
                <div className="absolute inset-x-0 top-0">
                  {definitionsByImageIndex.map((text, index) =>
                    text ? (
                      <div
                        key={`${galleryImages[index]?.src ?? index}-definition`}
                        data-definition-layer
                        data-image-index={index}
                        className={cn(
                          "overflow-hidden",
                          index === firstDefinitionIndex
                            ? "relative"
                            : "absolute inset-x-0 top-0",
                        )}
                        style={{ zIndex: index + 1 }}
                      >
                        <p className={PROSE_CLASS}>{text}</p>
                      </div>
                    ) : null,
                  )}
                </div>
              ) : null}
            </div>
            <div className="mt-8">
              <div ref={ctaRef}>
                <HoverFillLink
                  href={contactHref}
                  showArrow
                  className="text-base"
                >
                  {contactLabel}
                </HoverFillLink>
              </div>
            </div>
          </header>
        </div>

        <div className="col-span-6 self-center">
          <PinnedImageSequence images={images} />
        </div>
      </div>
    </section>
  );
}
