"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"

gsap.registerPlugin(ScrollTrigger)

export function SocialProofBar() {
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // GRID PARALLAX
      gsap.fromTo(
        gridRef.current,
        {
          y: -40,
        },
        {
          y: 40,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        }
      )

      // ROW 1
      gsap.fromTo(
        ".concept-row",
        {
          xPercent: -18,
        },
        {
          xPercent: 18,
          ease: "sine.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      )

      // ROW 2
      gsap.fromTo(
        ".philosophy-row",
        {
          xPercent: 10,
        },
        {
          xPercent: -10,
          ease: "sine.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        }
      )

      // ROW 3
      gsap.fromTo(
        ".identity-row",
        {
          xPercent: -80,
        },
        {
          xPercent: -50,
          ease: "sine.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.9,
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#F7F5F2] py-14 md:py-20"
    >
      {/* GRID BACKGROUND */}
      <div
        ref={gridRef}
        className="absolute inset-0 opacity-[0.04]"
      >
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

      <div className="relative flex flex-col gap-4 md:gap-6">
        {/* ROW 1 */}
        <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="concept-row w-[140vw] -ml-[20vw] whitespace-nowrap will-change-transform">
            <p className="font-sans text-base font-medium uppercase tracking-[0.22em] text-black/75 md:text-3xl">
              LUMIÈRE · MATIÈRE · PERSPECTIVE · RYTHME · STRUCTURE · ESPACE ·
              SILENCE · VOLUME · TEXTURE · HORIZON · CONTEXTE · FORME · LIGNE ·
              PROFONDEUR · OMBRE · ÉQUILIBRE · LUMIÈRE · MATIÈRE · PERSPECTIVE ·
              RYTHME · STRUCTURE · ESPACE
            </p>
          </div>
        </div>

        {/* ROW 2 */}
        <div className="overflow-hidden pb-2  [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="philosophy-row w-[130vw] -ml-[15vw] whitespace-nowrap will-change-transform">
            <p className="font-serif text-[clamp(3.8rem,8vw,7rem)] font-light leading-[1.05] tracking-tight text-transparent [-webkit-text-stroke:1px_rgba(0,0,0,0.22)] md:[-webkit-text-stroke:1.5px_rgba(0,0,0,0.22)]">
              Révéler l’âme des espaces <span className="mx-10 inline-flex translate-y-[-0.06em] align-middle opacity-40">
    <Image
      src="/favicon.svg"
      alt=""
      width={72}
      height={72}
      className="h-[0.72em] w-auto"
    />
  </span> Révéler l’âme des espaces
            </p>
          </div>
        </div>

        {/* ROW 3 */}
        <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="identity-row w-[140vw] -ml-[20vw] flex justify-end whitespace-nowrap will-change-transform">
            <p className="font-sans text-lg font-semibold tracking-[0.14em] text-black/55 md:text-2xl">
              Architecture · Culture · Identité · Architecture · Culture ·
              Identité
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}