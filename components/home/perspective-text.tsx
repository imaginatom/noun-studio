"use client"

import { useRef, type MouseEvent as ReactMouseEvent } from "react"
import { cn } from "@/lib/utils"
import styles from "./perspective-text.module.css"

export type PerspectiveLine = {
  primary: string
  secondary: string
}

type PerspectiveTextProps = {
  lines: PerspectiveLine[]
  className?: string
  /** Reduces the maximum rotation applied to the plane on mouse-move. */
  maxRotate?: number
  /** Accessible label spoken in lieu of the decorative reveal text. */
  ariaLabel?: string
}

export function PerspectiveText({
  lines,
  className,
  maxRotate = 22,
  ariaLabel,
}: PerspectiveTextProps) {
  const planeRef = useRef<HTMLDivElement | null>(null)

  const handleMouseMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    const plane = planeRef.current
    if (!plane) return
    if (typeof window === "undefined") return
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return

    const x = event.clientX / window.innerWidth
    const y = event.clientY / window.innerHeight
    const perspective = window.innerWidth * 4
    const rotateX = maxRotate * x - maxRotate / 2
    const rotateY = (maxRotate * y - maxRotate / 2) * -1

    plane.style.transform = `perspective(${perspective}px) rotateX(${rotateY}deg) rotateY(${rotateX}deg)`
  }

  const handleMouseLeave = () => {
    const plane = planeRef.current
    if (!plane) return
    plane.style.transform = ""
  }

  return (
    <div
      className={cn(styles.root, className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
    >
      <div ref={planeRef} className={styles.plane}>
        {lines.map((line, index) => (
          <div
            key={`${line.primary}-${index}`}
            className={styles.textContainer}
            aria-hidden="true"
          >
            <p className={styles.primary}>{line.primary}</p>
            <p className={styles.secondary}>{line.secondary}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
