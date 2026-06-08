import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { PortfolioProject } from "@/lib/portfolio-project";
import { ProjectHero } from "@/components/realisations/project-hero";

type ProjectDetailProps = {
  project: PortfolioProject;
  projectIndex?: number;
  prev: PortfolioProject | null;
  next: PortfolioProject | null;
  contactHref?: string;
  contactLabel?: string;
};

function ProjectDetailNav({
  prev,
  next,
}: {
  prev: PortfolioProject | null;
  next: PortfolioProject | null;
}) {
  return (
    <nav aria-label="Navigation projet" className="pb-16 pt-12 lg:pt-16">
      <div className="relative mx-auto grid h-full max-w-[1200px] grid-cols-12 items-center gap-x-6 px-[clamp(16px,4vw,64px)]  gap-4 lg:grid-cols-12 lg:gap-x-4">
        <div className="lg:col-span-3 lg:col-start-1">
          {prev ? (
            <Link
              href={`/realisations/${prev.slug}`}
              className="inline-flex max-w-full items-center gap-2 border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/50"
            >
              <ArrowLeft className="h-4 w-4 shrink-0" strokeWidth={1.5} />
              <span className="truncate">{prev.title}</span>
            </Link>
          ) : (
            <span className="inline-flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground/50">
              <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
              Précédent
            </span>
          )}
        </div>

        <Link
          href="/realisations"
          className="justify-self-center text-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground lg:absolute lg:left-1/2 lg:-translate-x-1/2"
        >
          Toutes les réalisations
        </Link>

        <div className="flex lg:col-span-2 lg:col-start-11 lg:justify-end">
          {next ? (
            <Link
              href={`/realisations/${next.slug}`}
              className="inline-flex max-w-full items-center gap-2 border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/50"
            >
              <span className="truncate">{next.title}</span>
              <ArrowRight className="h-4 w-4 shrink-0" strokeWidth={1.5} />
            </Link>
          ) : (
            <span className="inline-flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground/50">
              Suivant
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </span>
          )}
        </div>
      </div>
    </nav>
  );
}

export function ProjectDetail({
  project,
  projectIndex,
  prev,
  next,
  contactHref = "/contact",
  contactLabel = "Discutons de votre projet",
}: ProjectDetailProps) {
  return (
    <article className="project-detail-page pt-4 lg:pt-4">
      <ProjectHero
        project={project}
        projectIndex={projectIndex}
        contactHref={contactHref}
        contactLabel={contactLabel}
      />

      <ProjectDetailNav prev={prev} next={next} />
    </article>
  );
}
