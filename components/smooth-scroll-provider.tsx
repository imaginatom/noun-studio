"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap-register";
import { scrollState } from "@/lib/scroll-state";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  // Jump to the top on every route change so a new page never opens scrolled
  // to where the previous page was.
  useEffect(() => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
    ScrollTrigger.refresh();
  }, [pathname]);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const updateScrollProgress = (scroll: number, limit: number) => {
      scrollState.progress = limit > 0 ? scroll / limit : 0;
      ScrollTrigger.update();
      window.dispatchEvent(new Event("noun:scroll"));
    };

    let lenis: Lenis | null = null;
    let removeAnchorListener: (() => void) | null = null;
    let onNativeScroll: (() => void) | null = null;

    if (!prefersReduced) {
      lenis = new Lenis({
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        lerp: 0.15,
        wheelMultiplier: 1,
        touchMultiplier: 1.2,
      });
      lenisRef.current = lenis;
      window.__lenis = lenis;

      // Lenis scrolls the real window, so ScrollTrigger uses its default
      // window scroller — just keep it in sync on every Lenis scroll. No
      // scrollerProxy: mixing a transform proxy with window scrolling is what
      // made pinned sections jump.
      lenis.on(
        "scroll",
        ({ scroll, limit }: { scroll: number; limit: number }) => {
          updateScrollProgress(scroll, limit);
        },
      );

      const handleAnchorClick = (event: MouseEvent) => {
        if (event.defaultPrevented) return;
        if (event.button !== 0) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
          return;

        const anchor = (event.target as HTMLElement | null)?.closest("a");
        if (!anchor) return;
        if (anchor.target && anchor.target !== "_self") return;

        const href = anchor.getAttribute("href");
        if (!href || href.length < 2 || !href.startsWith("#")) return;

        const id = decodeURIComponent(href.slice(1));
        const target = document.getElementById(id);
        if (!target) return;

        event.preventDefault();
        lenis!.scrollTo(target, { offset: -80 });
        if (history.pushState) {
          history.pushState(null, "", `#${id}`);
        }
      };

      document.addEventListener("click", handleAnchorClick);
      removeAnchorListener = () =>
        document.removeEventListener("click", handleAnchorClick);
    } else {
      onNativeScroll = () => {
        const limit =
          document.documentElement.scrollHeight - window.innerHeight;
        updateScrollProgress(window.scrollY, limit);
      };
      window.addEventListener("scroll", onNativeScroll, { passive: true });
    }

    const raf = (time: number) => {
      lenis?.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.config({ ignoreMobileResize: true });

    const refresh = () => {
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    };
    refresh();
    if (lenis) {
      window.dispatchEvent(new Event("noun:lenis-ready"));
    }

    const onLoad = () => refresh();
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(() => ScrollTrigger.refresh()).catch(() => {});
    }
    window.addEventListener("load", onLoad);

    return () => {
      if (lenis) {
        lenis.destroy();
        if (window.__lenis === lenis) {
          delete window.__lenis;
        }
      }
      lenisRef.current = null;
      removeAnchorListener?.();
      if (onNativeScroll) {
        window.removeEventListener("scroll", onNativeScroll);
      }
      gsap.ticker.remove(raf);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  return <>{children}</>;
}
