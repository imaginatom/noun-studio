import type { Metadata } from "next"
import { RealisationsGallery } from "@/components/realisations-gallery"
import Link from "next/link"
import { ChevronRight, Mail } from "lucide-react"
import { HoverFillLink } from "@/components/hover-fill-link"
import { getPortfolioProjects } from "@/lib/portfolio-data"

export const metadata: Metadata = {
  title: "Portfolio — Projets d'Architecture",
  description:
    "D'ecouvrez le portfolio de Noun Studio : projets d'architecture résidentielle et commerciale, identités visuelles et design intérieur en Algérie et en France.",
}

export default async function RealisationsPage() {
  const { content, projects } = await getPortfolioProjects()

  return (
    <>
      {/* Hero */}
      <section className="section-padding-header bg-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <nav aria-label="Fil d'Ariane" className="mb-8 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">
              {content.hero.breadcrumbHomeLabel}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">{content.hero.breadcrumbCurrentLabel}</span>
          </nav>
          <div className="mx-auto max-w-4xl">
            <p className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
              <span className="inline-block h-px w-8 bg-foreground/35" aria-hidden="true" />
              {content.hero.eyebrow}
            </p>
            <h1
              className="mt-8 max-w-3xl font-serif text-[clamp(2.4rem,6.6vw,5.5rem)] font-light leading-[0.93] text-foreground text-balance"
              style={{ letterSpacing: "-0.025em" }}
            >
              {content.hero.title}
            </h1>
            <p className="mt-7 max-w-2xl text-sm font-light leading-[1.75] text-muted-foreground lg:text-base">
              {content.hero.subtitle}
            </p>
          </div>
        </div>
      </section>

      <RealisationsGallery categories={content.gallery.categories} projects={projects} />

      {/* CTA — light section, separate from the projects grid */}
      <section className="section-padding border-t border-border bg-background">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-10">
          <h2
            className="font-serif text-[clamp(2rem,5vw,4rem)] font-light leading-[0.95] text-foreground text-balance"
            style={{ letterSpacing: "-0.02em" }}
          >
            {content.cta.title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm font-light leading-[1.75] text-muted-foreground lg:text-base">
            {content.cta.subtitle}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-8">
            <HoverFillLink
              href={content.cta.primaryCtaHref}
              showArrow
              className="tracking-[0.12em]"
            >
              {content.cta.primaryCtaLabel}
            </HoverFillLink>
            <HoverFillLink
              href={`mailto:${content.cta.emailAddress}`}
              className="tracking-[0.12em]"
              contentClassName="text-foreground/85 group-hover:text-background"
            >
              <Mail className="h-4 w-4" />
              {content.cta.emailLabel}
            </HoverFillLink>
          </div>
        </div>
      </section>
    </>
  )
}
