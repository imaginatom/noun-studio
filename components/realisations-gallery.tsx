"use client"

import { useState } from "react"
import { ProjectImage } from "@/components/project-image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { PortfolioProject } from "@/lib/portfolio-project"
import { getProjectCover } from "@/lib/portfolio-project"
import { ModularGridOverlay } from "@/components/ModularGridBackground"

function GalleryImageCard({ project, i }: { project: PortfolioProject; i: number }) {
  const [loaded, setLoaded] = useState(false)
  const cover = getProjectCover(project)
  return (
    <Link
      href={`/realisations/${project.slug}`}
      aria-label={`Voir le projet ${project.title}`}
      className="group relative mb-4 block w-full overflow-hidden border border-background/20 break-inside-avoid focus:outline-none focus-visible:ring-2 focus-visible:ring-background"
    >
      <div
        className={`relative ${i % 3 === 0 ? "aspect-[3/4]" : i % 3 === 1 ? "aspect-[4/3]" : "aspect-square"}`}
      >
        {!loaded && <div className="skeleton absolute inset-0 z-10" aria-hidden="true" />}
        <ProjectImage
          src={cover.src}
          alt={cover.alt}
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
        <p className="mt-1 text-base text-background/75 md:text-lg">
          {project.location}
          {project.year ? <span className="text-background/55"> · {project.year}</span> : null}
        </p>
      </div>
    </Link>
  )
}

type RealisationsGalleryProps = {
  categories: string[]
  projects: PortfolioProject[]
}

export function RealisationsGallery({ categories, projects }: RealisationsGalleryProps) {
  const allCategoryLabel = categories[0] ?? "Tous"
  const [activeCategory, setActiveCategory] = useState<string>(allCategoryLabel)

  const filtered =
    activeCategory === allCategoryLabel
      ? projects
      : projects.filter((project) => project.category === activeCategory)

  if (projects.length === 0) {
    return null
  }

  return (
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
                key={project.slug}
                project={project}
                i={i}
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
  )
}
