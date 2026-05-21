"use client"

import { useEffect, useRef } from "react"

type ExpertiseVideoProps = {
  src: string
}

export function ExpertiseVideo({ src }: ExpertiseVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const hasTriggeredRef = useRef(false)

  useEffect(() => {
    const container = containerRef.current
    const video = videoRef.current
    if (!container || !video) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || hasTriggeredRef.current) return

        hasTriggeredRef.current = true
        void video.play().catch(() => {})
        observer.disconnect()
      },
      { threshold: 0.2 },
    )

    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/10] lg:aspect-[5/4]"
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        muted
        playsInline
        preload="metadata"
        aria-hidden
      >
        <source src={src} type="video/mp4" />
      </video>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
      >
        <div className="absolute inset-y-0 left-0 w-[22%] bg-gradient-to-r from-background via-background/60 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-[22%] bg-gradient-to-l from-background via-background/60 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-[18%] bg-gradient-to-b from-background via-background/50 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[18%] bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_75%_at_50%_50%,transparent_42%,hsl(var(--background))_100%)]" />
      </div>
    </div>
  )
}
