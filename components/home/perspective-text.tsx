"use client"

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
} from "react"
import { cn } from "@/lib/utils"
import styles from "./perspective-text.module.css"

export type PerspectiveLine = {
  primary: string
  secondary: string
  /** Horizontal indent for this line, expressed as a percentage of the container width. */
  offset?: number
}

type PerspectiveTextProps = {
  lines: PerspectiveLine[]
  className?: string
  /** Reduces the maximum rotation applied to the plane on mouse-move. */
  maxRotate?: number
  /** Milliseconds the primary face is held before flipping to the secondary. */
  intervalMs?: number
  /** Milliseconds the secondary face is held before flipping back. Defaults to `intervalMs`. */
  revealMs?: number
  /** Delay (in ms) added per line so the flip cascades down the stack. */
  staggerMs?: number
  /** Accessible label spoken in lieu of the decorative reveal text. */
  ariaLabel?: string
}

export function PerspectiveText({
  lines,
  className,
  maxRotate = 22,
  intervalMs = 8000,
  revealMs,
  staggerMs = 220,
  ariaLabel,
}: PerspectiveTextProps) {
  const planeRef = useRef<HTMLDivElement | null>(null)
  const [isFlipped, setIsFlipped] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return

    const holdSecondaryMs = revealMs ?? intervalMs
    let timeoutId = 0
    let flipped = false

    const tick = () => {
      flipped = !flipped
      setIsFlipped(flipped)
      timeoutId = window.setTimeout(
        tick,
        flipped ? holdSecondaryMs : intervalMs,
      )
    }

    timeoutId = window.setTimeout(tick, intervalMs)

    return () => window.clearTimeout(timeoutId)
  }, [intervalMs, revealMs])

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
        {lines.map((line, index) => {
          const lineStyle = {
            "--stagger-delay": `${index * staggerMs}ms`,
            marginLeft: line.offset ? `${line.offset}%` : undefined,
          } as CSSProperties

          return (
            <div
              key={`${line.primary}-${index}`}
              className={cn(styles.textContainer, isFlipped && styles.flipped)}
              style={lineStyle}
              aria-hidden="true"
            >
              <p className={styles.primary}>{line.primary}</p>
              <p className={styles.secondary}>{line.secondary}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
