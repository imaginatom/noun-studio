"use client";

import { useEffect, useRef } from "react";
import { ProjectImage } from "@/components/project-image";

type HeroParallaxImageProps = {
  src: string;
  alt: string;
};

export function HeroParallaxImage({ src, alt }: HeroParallaxImageProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const inner = innerRef.current;
    if (!wrapper || !inner) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const update = () => {
      const rect = wrapper.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const offset = Math.max(-rect.top * 0.18, -120);
      inner.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0) scale(1.08)`;
    };

    const onScroll = () => {
      if (frame.current !== null) return;
      frame.current = window.requestAnimationFrame(() => {
        frame.current = null;
        update();
      });
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      if (frame.current !== null) {
        window.cancelAnimationFrame(frame.current);
        frame.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        ref={innerRef}
        className="relative h-[120%] w-full will-change-transform"
        style={{ transform: "translate3d(0, 0, 0) scale(1.08)" }}
      >
        <ProjectImage
          src={src}
          alt={alt}
          fill
          priority
          className="object-cover opacity-70"
          sizes="100vw"
        />
      </div>
    </div>
  );
}
