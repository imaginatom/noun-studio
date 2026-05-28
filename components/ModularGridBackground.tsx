"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

type Cell = { x: number; y: number; w: number; h: number }

function buildCells(cols: number, rows: number): Cell[] {
  const grid: boolean[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => false),
  )
  const cells: Cell[] = []
  let seed = 1337
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return seed / 0x7fffffff
  }
  const fits = (x: number, y: number, s: number) => {
    if (x + s > cols || y + s > rows) return false
    for (let j = y; j < y + s; j++)
      for (let i = x; i < x + s; i++) if (grid[j][i]) return false
    return true
  }
  const mark = (x: number, y: number, s: number) => {
    for (let j = y; j < y + s; j++) for (let i = x; i < x + s; i++) grid[j][i] = true
  }
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x]) continue
      const r = rand()
      let size = 1
      if (r < 0.2 && fits(x, y, 2)) size = 2
      mark(x, y, size)
      cells.push({ x, y, w: size, h: size })
    }
  }
  return cells
}

/**
 * Fixed logo slots on a shifted (7×11) lattice — ~5% of cells, different
 * rhythm than the previous hash-based placement.
 */
function cellShowsLogo(x: number, y: number, logoPercent: number) {
  if (logoPercent <= 0) return false
  if (logoPercent >= 100) return true

  const period = Math.max(1, Math.round(100 / logoPercent))
  const phase = 11
  return (x * 7 + y * 11 + phase) % period === 0
}

export function ModularGridOverlay({
  unit = 100,
  lineColor = "rgba(255,255,255,0.08)",
  /** Share of cells that show the logo background (0–1). Default ≈5%. */
  logoRatio = 0.05,
}: {
  unit?: number
  lineColor?: string
  logoRatio?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ cols: 0, rows: 0 })
  const cellH = unit * 0.75
  const logoPercent = Math.min(100, Math.max(0, Math.round(logoRatio * 100)))

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      const cols = Math.ceil(el.offsetWidth / unit) + 1
      const rows = Math.ceil(el.offsetHeight / cellH) + 1
      setDims({ cols, rows })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [unit, cellH])

  const cells = dims.cols && dims.rows ? buildCells(dims.cols, dims.rows) : []

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {cells.map((c, i) => {
        const showLogo = cellShowsLogo(c.x, c.y, logoPercent)

        return (
          <div
            key={i}
            className={cn("absolute", showLogo && "grid-cell-logo")}
            style={{
              left: `${c.x * unit}px`,
              top: `${c.y * cellH}px`,
              width: `${c.w * unit}px`,
              height: `${c.h * cellH}px`,
              border: `1px solid ${lineColor}`,
              ...(showLogo
                ? { ["--sweep-delay" as string]: `${((c.x * 7 + c.y * 11) % 50) / 10}s` }
                : {}),
            }}
          />
        )
      })}
    </div>
  )
}
