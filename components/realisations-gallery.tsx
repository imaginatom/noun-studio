"use client"

import { useState, useCallback, useEffect } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PortfolioPageContent } from "@/lib/content/portfolio"
import { ModularGridOverlay } from "@/components/ModularGridBackground"

type Project = PortfolioPageContent["gallery"]["projects"][number]

function GalleryImageCard({ project, i, onOpen }: { project: Project; i: number; onOpen: () => void }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative mb-4 block w-full overflow-hidden border border-background/20 break-inside-avoid focus:outline-none focus-visible:ring-2 focus-visible:ring-background"
    >
      <div
        className={`relative ${i % 3 === 0 ? "aspect-[3/4]" : i % 3 === 1 ? "aspect-[4/3]" : "aspect-square"}`}
      >
        {!loaded && <div className="skeleton absolute inset-0 z-10" aria-hidden="true" />}
        <Image
          src={project.image.src}
          alt={project.image.alt}
          fill
          className={cn(
            "object-cover grayscale transition-all duration-700 ease-out group-hover:scale-[1.03] group-hover:grayscale-0",
            loaded ? "opacity-100" : "opacity-0",
          )}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          onLoad={() => setLoaded(true)}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/0 to-foreground/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="absolute inset-x-0 bottom-0 translate-y-4 p-6 text-left opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:p-7">
        <span className="mb-2 inline-block bg-accent px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-accent-foreground md:text-xs">
          {project.category}
        </span>
        <p className="font-serif text-xl font-semibold leading-tight text-background md:text-2xl">
          {project.title}
        </p>
        <p className="mt-1 text-base text-background/75 md:text-lg">{project.location}</p>
      </div>
    </button>
  )
}

type RealisationsGalleryProps = {
  categories: string[]
  projects: Project[]
}

export function RealisationsGallery({ categories, projects }: RealisationsGalleryProps) {
  const allCategoryLabel = categories[0] ?? "Tous"
  const [activeCategory, setActiveCategory] = useState<string>(allCategoryLabel)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const filtered =
    activeCategory === allCategoryLabel
      ? projects
      : projects.filter((project) => project.category === activeCategory)

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index)
    document.body.style.overflow = "hidden"
  }, [])

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null)
    document.body.style.overflow = ""
  }, [])

  const goTo = useCallback(
    (direction: "prev" | "next") => {
      if (lightboxIndex === null) return
      if (direction === "prev") {
        setLightboxIndex(lightboxIndex === 0 ? filtered.length - 1 : lightboxIndex - 1)
      } else {
        setLightboxIndex(lightboxIndex === filtered.length - 1 ? 0 : lightboxIndex + 1)
      }
    },
    [lightboxIndex, filtered.length],
  )

  useEffect(() => {
    if (lightboxIndex === null) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox()
      if (event.key === "ArrowLeft") goTo("prev")
      if (event.key === "ArrowRight") goTo("next")
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  })

  if (projects.length === 0) {
    return null
  }

  return (
    <>
      {/* Filters + projects — one dark surface with modular grid background */}
      <section
        id="realisations-projects"
        aria-label="Réalisations"
        className="relative isolate overflow-hidden bg-black pb-24 text-background lg:pb-32"
      >
        <ModularGridOverlay logoRatio={0.05} />

        <div className="relative z-[1]">
          <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-12">
            <div
              className="flex flex-wrap items-center justify-center gap-2"
              role="tablist"
              aria-label="Filtrer par catégorie"
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === cat}
                  aria-label={`Filtrer par ${cat}`}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ease-out",
                    activeCategory === cat
                      ? "border border-background/50 bg-background text-foreground shadow-sm scale-[1.02]"
                      : "border border-background/25 bg-transparent text-background/85 hover:border-background/60 hover:text-background hover:scale-[1.02] active:scale-[0.98]",
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="mx-auto max-w-7xl px-6 pt-12 lg:px-10 lg:pt-16">
            <div className="columns-1 gap-4 md:columns-2 lg:columns-3">
              {filtered.map((project, i) => (
                <GalleryImageCard
                  key={`${project.title}-${project.location}`}
                  project={project}
                  i={i}
                  onOpen={() => openLightbox(i)}
                />
              ))}
            </div>

            {filtered.length === 0 && (
              <p className="py-20 text-center text-background/60">
                {"Aucune réalisation dans cette catégorie pour le moment."}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && filtered[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/90 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`Photo : ${filtered[lightboxIndex].title}`}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/10 text-background transition-all duration-200 ease-out hover:bg-background/20 hover:scale-110 active:scale-95"
            aria-label="Fermer la lightbox"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => goTo("prev")}
            className="absolute left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/10 text-background transition-all duration-200 ease-out hover:bg-background/20 hover:scale-110 active:scale-95"
            aria-label="Photo précédente"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => goTo("next")}
            className="absolute right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/10 text-background transition-all duration-200 ease-out hover:bg-background/20 hover:scale-110 active:scale-95"
            aria-label="Photo suivante"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="flex max-h-[90vh] max-w-5xl flex-col items-center px-16">
            <div className="relative aspect-[4/3] w-full max-w-4xl overflow-hidden rounded-xl">
              <Image
                src={filtered[lightboxIndex].image.src}
                alt={filtered[lightboxIndex].image.alt}
                fill
                className="object-contain"
                sizes="90vw"
                priority
              />
            </div>
            <div className="mt-4 text-center">
              <span className="mb-1 inline-block rounded-md bg-accent px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                {filtered[lightboxIndex].category}
              </span>
              <p className="mt-1 font-serif text-xl font-semibold text-background">
                {filtered[lightboxIndex].title}
              </p>
              <p className="mt-1 max-w-lg text-sm text-background/70">
                {filtered[lightboxIndex].description}
              </p>
              <p className="mt-1 text-xs text-background/50">{filtered[lightboxIndex].location}</p>
            </div>
          </div>
          <button type="button" onClick={closeLightbox} className="absolute inset-0 -z-10" aria-label="Fermer" />
        </div>
      )}
    </>
  )
}
