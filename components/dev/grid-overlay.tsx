"use client"

// GridOverlay — dev-only column / composition overlay.
//
// Reads each section's `data-grid-tier` attribute and renders the appropriate
// grid system for the section currently centred in the viewport:
//
//   read    → single 720px reading lane (no columns)
//   content → 12-column 1200px editorial grid
//   wide    → 12-column 1440px editorial grid
//   bleed   → 12×8 modular cell grid, full viewport (configurable per section
//             via data-bleed-cols / data-bleed-rows on the section element)
//
// Toggled with `g`. Dev-only — returns null in production builds.
// Bleed tier uses mix-blend-mode: difference; editorial tiers use solid fills
// so columns stay visible on light section backgrounds.

import { useCallback, useEffect, useState } from "react"

type Tier = "read" | "content" | "wide" | "bleed"

type ColumnTier = Exclude<Tier, "bleed">

const COLUMN_TIERS: Record<
  ColumnTier,
  { cols: number; fill: string; line: string; labelColor: string; label: string; shellClass: string }
> = {
  read: {
    cols: 1,
    fill: "rgba(99, 102, 241, 0.08)",
    line: "rgba(99, 102, 241, 0.45)",
    labelColor: "rgb(99, 102, 241)",
    label: "READ · 720 · 1 COL",
    shellClass: "grid-overlay-shell--read",
  },
  content: {
    cols: 12,
    fill: "rgba(236, 72, 153, 0.08)",
    line: "rgba(236, 72, 153, 0.45)",
    labelColor: "rgb(236, 72, 153)",
    label: "CONTENT · 1200 · 12 COL",
    shellClass: "grid-overlay-shell--content",
  },
  wide: {
    cols: 12,
    fill: "rgba(99, 102, 241, 0.1)",
    line: "rgba(99, 102, 241, 0.5)",
    labelColor: "rgb(79, 70, 229)",
    label: "WIDE · 1440 · 12 COL",
    shellClass: "grid-overlay-shell--wide",
  },
}

const BLEED_COLOR = "rgba(255, 200, 0, 0.7)"
const BLEED_CELL_OUTLINE = "rgba(255, 200, 0, 0.15)"
const BLEED_SAFE_OUTLINE = "rgba(255, 200, 0, 0.4)"

const DEFAULT_BLEED_COLS = 12
const DEFAULT_BLEED_ROWS = 8

type ActiveSection = {
  tier: Tier
  bleedCols: number
  bleedRows: number
}

function sectionFromElement(el: HTMLElement | null): HTMLElement | null {
  let node: HTMLElement | null = el
  while (node) {
    if (node.dataset.gridTier) return node
    node = node.parentElement
  }
  return null
}

/** Prefer the section under the viewport centre (works with Lenis + GSAP pin). */
function pickSectionByHitTest(): HTMLElement | null {
  const x = window.innerWidth / 2
  const y = window.innerHeight / 2
  const stack = document.elementsFromPoint(x, y)
  for (const el of stack) {
    if (!(el instanceof HTMLElement)) continue
    const section = sectionFromElement(el)
    if (section) return section
  }
  return null
}

/** Fallback when the centre hits only fixed chrome (header, overlay chrome). */
function pickSectionByVisibility(sections: HTMLElement[]): HTMLElement | null {
  const viewportCentre = window.innerHeight / 2
  let bestScore = -Infinity
  let bestSection: HTMLElement | null = null

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect()
    const visibleTop = Math.max(rect.top, 0)
    const visibleBottom = Math.min(rect.bottom, window.innerHeight)
    const visibleHeight = Math.max(0, visibleBottom - visibleTop)
    if (visibleHeight <= 0) return

    const visibleRatio = visibleHeight / Math.max(rect.height, 1)
    const centerDistance = Math.abs(rect.top + rect.height / 2 - viewportCentre)
    const score = visibleRatio * 2000 - centerDistance

    if (score > bestScore) {
      bestScore = score
      bestSection = section
    }
  })

  return bestSection
}

function readSectionMeta(section: HTMLElement): ActiveSection | null {
  const tier = section.dataset.gridTier as Tier | undefined
  if (!tier) return null
  return {
    tier,
    bleedCols: parseInt(section.dataset.bleedCols ?? String(DEFAULT_BLEED_COLS), 10),
    bleedRows: parseInt(section.dataset.bleedRows ?? String(DEFAULT_BLEED_ROWS), 10),
  }
}

export function GridOverlay() {
  const [visible, setVisible] = useState(false)
  const [active, setActive] = useState<ActiveSection | null>(null)

  const pickActive = useCallback(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-grid-tier]"),
    )
    if (sections.length === 0) {
      setActive(null)
      return
    }

    const hit =
      pickSectionByHitTest() ?? pickSectionByVisibility(sections)
    if (!hit) return

    const next = readSectionMeta(hit)
    if (!next) return

    setActive((prev) => {
      if (
        prev &&
        prev.tier === next.tier &&
        prev.bleedCols === next.bleedCols &&
        prev.bleedRows === next.bleedRows
      ) {
        return prev
      }
      return next
    })
  }, [])

  // Toggle visibility with `g`. Ignored while typing in inputs.
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && /input|textarea/i.test(e.target.tagName)) return
      if (e.key === "g" || e.key === "G") setVisible((v) => !v)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    if (!visible) {
      setActive(null)
      return
    }

    pickActive()
    const onScroll = () => pickActive()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    window.addEventListener("noun:scroll", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      window.removeEventListener("noun:scroll", onScroll)
    }
  }, [visible, pickActive])

  if (process.env.NODE_ENV !== "development") return null
  if (!visible || !active) return null

  // BLEED — modular cell grid over the full viewport.
  if (active.tier === "bleed") {
    const totalCells = active.bleedCols * active.bleedRows
    return (
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[9999]"
        style={{ mixBlendMode: "difference" }}
      >
        <div className="absolute inset-0" style={{ padding: "var(--page-pad-x)" }}>
          <div
            className="grid h-full w-full"
            style={{
              gridTemplateColumns: `repeat(${active.bleedCols}, 1fr)`,
              gridTemplateRows: `repeat(${active.bleedRows}, 1fr)`,
              outline: `1px dashed ${BLEED_SAFE_OUTLINE}`,
            }}
          >
            {Array.from({ length: totalCells }).map((_, i) => {
              const col = (i % active.bleedCols) + 1
              const row = Math.floor(i / active.bleedCols) + 1
              return (
                <div
                  key={i}
                  style={{
                    outline: `1px dashed ${BLEED_CELL_OUTLINE}`,
                    position: "relative",
                  }}
                >
                  <span
                    className="mono-label tabular"
                    style={{
                      position: "absolute",
                      left: 3,
                      top: 1,
                      color: BLEED_COLOR,
                      opacity: 0.5,
                      fontSize: 8,
                      lineHeight: 1,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {col},{row}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div
          className="mono-label tabular"
          style={{
            position: "absolute",
            left: 8,
            top: 8,
            color: BLEED_COLOR,
            fontSize: 10,
            letterSpacing: "0.1em",
          }}
        >
          BLEED · {active.bleedCols}×{active.bleedRows} MODULAR
        </div>
      </div>
    )
  }

  // READ / CONTENT / WIDE — editorial column grid inside a centred shell.
  const config = COLUMN_TIERS[active.tier]
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9999]"
    >
      <div
        className={`grid-overlay-shell ${config.shellClass}`}
        style={{ position: "absolute", inset: 0, height: "100%" }}
      >
        <div
          className="grid h-full w-full"
          style={{
            gridTemplateColumns: `repeat(${config.cols}, 1fr)`,
            columnGap: "var(--grid-gap, clamp(16px, 1.5vw, 24px))",
          }}
        >
          {Array.from({ length: config.cols }).map((_, i) => (
            <div
              key={i}
              style={{
                background: config.fill,
                boxShadow:
                  i > 0 ? `inset 1px 0 0 ${config.line}` : undefined,
              }}
            />
          ))}
        </div>
        <div
          className="mono-label tabular"
          style={{
            position: "absolute",
            left: 8,
            top: 8,
            color: config.labelColor,
            fontSize: 10,
            letterSpacing: "0.1em",
            textShadow: "0 0 8px rgba(255,255,255,0.9)",
          }}
        >
          {config.label}
        </div>
      </div>
    </div>
  )
}
