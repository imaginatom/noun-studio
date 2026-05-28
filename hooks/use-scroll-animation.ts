"use client"

import { useEffect } from "react"

const ROOT_MARGIN_BOTTOM_PX = 60
const SAFETY_REVEAL_MS = 3000

function revealElement(el: Element) {
  el.classList.add("is-visible")
}

/** Mirror IntersectionObserver rootMargin: 0px 0px -60px 0px */
function isInRevealZone(el: Element) {
  const rect = el.getBoundingClientRect()
  if (rect.height <= 0 || rect.width <= 0) return false

  const vh = window.innerHeight
  const bottomEdge = vh - ROOT_MARGIN_BOTTOM_PX

  return rect.top < bottomEdge && rect.bottom > 0
}

export function useScrollAnimation() {
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (mq.matches) {
      document.querySelectorAll(".animate-on-scroll").forEach(revealElement)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            revealElement(entry.target)
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0, rootMargin: `0px 0px -${ROOT_MARGIN_BOTTOM_PX}px 0px` },
    )

    const observeElement = (el: Element) => {
      if (el.classList.contains("is-visible")) return
      if (isInRevealZone(el)) {
        revealElement(el)
        return
      }
      observer.observe(el)
    }

    const scan = () => {
      document.querySelectorAll(".animate-on-scroll:not(.is-visible)").forEach(observeElement)
    }

    scan()

    const onLoad = () => scan()
    window.addEventListener("load", onLoad)

    const fontsReady = document.fonts?.ready
    void fontsReady?.then(() => scan())

    let cancelled = false
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!cancelled) scan()
      })
    })

    const safetyTimer = window.setTimeout(() => {
      document.querySelectorAll(".animate-on-scroll:not(.is-visible)").forEach(revealElement)
    }, SAFETY_REVEAL_MS)

    const onPreloaderEnd = () => {
      if (!document.documentElement.classList.contains("preloader-active")) {
        scan()
      }
    }
    const preloaderObserver = new MutationObserver(onPreloaderEnd)
    preloaderObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })
    onPreloaderEnd()

    return () => {
      cancelled = true
      observer.disconnect()
      preloaderObserver.disconnect()
      window.removeEventListener("load", onLoad)
      window.clearTimeout(safetyTimer)
    }
  }, [])
}
