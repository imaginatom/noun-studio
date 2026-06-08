/**
 * This page is a client-side component that displays a single project detail.
 * It is used to display a single project detail page.
 * It is not used to display a list of projects.
 * It is not used to display a list of categories.
 * It is not used to display a list of tags.
 * It is not used to display a list of images.
 * It is not used to display a list of videos.
 * It is not used to display a list of documents.
 */
//app/realisations/[id]/page.tsx

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/realisations/project-detail";
import { portfolioPageDefaults } from "@/lib/content/portfolio";
import { getPortfolioProjects } from "@/lib/portfolio-data";
import {
  findProjectBySlug,
  getAdjacentProjects,
  getProjectCover,
  getProjectSlug,
} from "@/lib/portfolio-project";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const defaults = portfolioPageDefaults.gallery.projects;
  return defaults.map((project, index) => ({
    id: getProjectSlug(project, index, defaults),
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const { projects } = await getPortfolioProjects();
  const project = findProjectBySlug(projects, id);

  if (!project) {
    return { title: "Projet introuvable" };
  }

  const cover = getProjectCover(project);

  return {
    title: `${project.title} — Réalisation`,
    description: project.description,
    openGraph: {
      title: `${project.title} | Noun Studio`,
      description: project.description,
      images: cover.src ? [{ url: cover.src, alt: cover.alt }] : undefined,
    },
  };
}

export default async function RealisationProjectPage({ params }: PageProps) {
  const { id } = await params;
  const { content, projects } = await getPortfolioProjects();
  const project = findProjectBySlug(projects, id);

  if (!project) {
    notFound();
  }

  const { prev, next } = getAdjacentProjects(projects, project.slug);
  const projectIndex =
    projects.findIndex((item) => item.slug === project.slug) + 1;

  return (
    <ProjectDetail
      project={project}
      projectIndex={projectIndex > 0 ? projectIndex : undefined}
      prev={prev}
      next={next}
      contactHref={content.cta.primaryCtaHref}
      contactLabel={content.cta.primaryCtaLabel}
    />
  );
}
