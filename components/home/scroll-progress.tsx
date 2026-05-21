"use client"

import { useEffect, useRef, useState } from "react"

export function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  const frame = useRef<number | null>(null)

  useEffect(() => {
    const compute = () => {
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      if (max <= 0) {
        setProgress(0)
        return
      }
      const next = Math.min(1, Math.max(0, doc.scrollTop / max))
      setProgress(next)
    }

    const onScroll = () => {
      if (frame.current !== null) return
      frame.current = window.requestAnimationFrame(() => {
        frame.current = null
        compute()
      })
    }

    compute()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", compute)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", compute)
      if (frame.current !== null) {
        window.cancelAnimationFrame(frame.current)
        frame.current = null
      }
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-y-0 left-3 z-40 hidden w-px md:block lg:left-5"
    >
      <div className="relative h-full w-full bg-foreground/10">
        <div
          className="absolute left-0 top-0 w-full origin-top bg-foreground/60 transition-transform duration-150 ease-out"
          style={{ transform: `scaleY(${progress})` }}
        />
      </div>
    </div>
  )
}
