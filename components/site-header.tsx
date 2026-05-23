"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { SiteLogo } from "@/components/site-logo"

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/architecture", label: "Architecture" },
  { href: "/realisations", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
]

const SCROLL_DELTA = 8

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [headerVisible, setHeaderVisible] = useState(true)
  const [sheetOpen, setSheetOpen] = useState(false)
  const lastScrollY = useRef(0)
  const frame = useRef<number | null>(null)
  const pathname = usePathname()
  const isHome = pathname === "/"

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const update = () => {
      const currentY = window.scrollY
      const delta = currentY - lastScrollY.current

      setScrolled(currentY > 20)

      if (!prefersReducedMotion) {
        if (currentY <= 20) {
          setHeaderVisible(true)
        } else if (Math.abs(delta) >= SCROLL_DELTA) {
          setHeaderVisible(delta < 0)
        }
      }

      lastScrollY.current = currentY
      frame.current = null
    }

    const onScroll = () => {
      if (frame.current !== null) return
      frame.current = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (frame.current !== null) {
        window.cancelAnimationFrame(frame.current)
      }
    }
  }, [])

  const showHeader = sheetOpen || headerVisible
  const isTransparent = isHome && !scrolled && showHeader

  return (
    <header
      role="banner"
      className={cn(
        "fixed top-0 left-0 right-0 z-50",
        "transition-[transform,background-color,padding,border-color] duration-300 ease-in-out",
        !showHeader && "-translate-y-full",
        isTransparent
          ? "bg-transparent py-6"
          : "bg-background/85 backdrop-blur-xl py-4 border-b border-border/60",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10">
        <SiteLogo
          variant={isTransparent ? "light" : "default"}
          size="md"
        />

        <nav aria-label="Navigation principale" className="hidden items-center gap-10 lg:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative text-[13px] font-medium tracking-wide transition-colors",
                  isTransparent
                    ? active
                      ? "text-background"
                      : "text-background/70 hover:text-background"
                    : active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-300",
                    isTransparent ? "bg-background" : "bg-foreground",
                    active && "scale-x-100",
                  )}
                />
              </Link>
            )
          })}
        </nav>

        <div className="hidden items-center gap-6 lg:flex">
          <Link
            href="/contact"
            className={cn(
              "group inline-flex items-center gap-2 text-[13px] font-medium tracking-wide transition-opacity hover:opacity-70",
              isTransparent ? "text-background" : "text-foreground",
            )}
          >
            <span className="rule" aria-hidden="true" />
            Prendre rendez-vous
          </Link>
        </div>

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <button
              className={cn(
                "flex h-10 w-10 items-center justify-center transition-colors lg:hidden",
                isTransparent ? "text-background" : "text-foreground",
              )}
              aria-label="Ouvrir le menu de navigation"
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full bg-foreground p-0 text-background sm:max-w-md">
            <SheetTitle className="sr-only">Menu de navigation</SheetTitle>
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between px-8 py-6">
                <SiteLogo variant="light" size="sm" />
                <button
                  type="button"
                  onClick={() => setSheetOpen(false)}
                  className="flex h-10 w-10 items-center justify-center text-background/80 transition-colors hover:text-background"
                  aria-label="Fermer le menu"
                >
                  <X className="h-5 w-5" strokeWidth={1.5} />
                </button>
              </div>

              <nav aria-label="Navigation mobile" className="flex-1 px-8 py-12">
                <ul className="flex flex-col gap-7">
                  {navLinks.map((link, i) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setSheetOpen(false)}
                        aria-current={pathname === link.href ? "page" : undefined}
                        className="group inline-flex items-baseline gap-4 font-serif text-3xl font-light transition-opacity hover:opacity-70"
                      >
                        <span className="text-[10px] tracking-[0.3em] text-background/40">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="border-t border-background/10 px-8 py-6">
                <a
                  href="mailto:contact@nounstudio.dz"
                  className="block text-sm tracking-wide text-background/70 transition-colors hover:text-background"
                >
                  contact@nounstudio.dz
                </a>
                <p className="mt-2 text-[11px] uppercase tracking-[0.25em] text-background/40">
                  Oran · Algérie
                </p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
