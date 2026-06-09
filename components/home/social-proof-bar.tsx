"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export function SocialProofBar() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // GRID PARALLAX
      gsap.fromTo(
        gridRef.current,
        {
          y: 20,
        },
        {
          y: -20,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        },
      );

      gsap.fromTo(
        ".philosophy-row",
        {
          xPercent: 10,
        },
        {
          xPercent: -30,
          ease: "sine.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-grid-tier="bleed"
      className="section-padding relative overflow-hidden bg-[#f4f4f4]"
    >
      {/* GRID BACKGROUND */}
      <div ref={gridRef} className="absolute inset-0 opacity-[0.04]">
        <div
          className="h-[120%] w-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, black 1px, transparent 1px),
              linear-gradient(to bottom, black 1px, transparent 1px)
            `,
            backgroundSize: "56px 56px",
          }}
        />
      </div>

      <div className="relative">
        <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="philosophy-row w-[130vw] -ml-[15vw] whitespace-nowrap will-change-transform">
            <p className="font-serif text-[clamp(3.8rem,8vw,7rem)] font-light leading-[1.05] tracking-tight text-transparent [-webkit-text-stroke:1px_rgba(0,0,0,0.22)] md:[-webkit-text-stroke:1.5px_rgba(0,0,0,0.52)]">
              EFFORT MINIMUM{" "}
              <span className="mx-10 inline-flex translate-y-[-0.06em] align-middle opacity-40">
                <Image
                  src="/favicon.svg"
                  alt=""
                  width={72}
                  height={72}
                  className="h-[0.72em] w-auto"
                />
              </span>
              IMPACT MAXIMUM{" "}
              <span className="mx-10 inline-flex translate-y-[-0.06em] align-middle opacity-40">
                <Image
                  src="/favicon.svg"
                  alt=""
                  width={72}
                  height={72}
                  className="h-[0.72em] w-auto"
                />
              </span>
              Révéler l’âme des espaces{" "}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
