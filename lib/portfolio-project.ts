import type { GalleryImage, PortfolioPageContent } from "@/lib/content/portfolio"

export type PortfolioProject = PortfolioPageContent["gallery"]["projects"][number] & {
  slug: string
}

const EMPTY_COVER: GalleryImage = { src: "", alt: "" }

/** First gallery image, used as the cover/thumbnail everywhere. */
export function getProjectCover(
  project: PortfolioPageContent["gallery"]["projects"][number],
): GalleryImage {
  return project.gallery[0] ?? EMPTY_COVER
}

/** URL-safe slug from project title (French accents stripped). */
export function slugifyProjectTitle(title: string): string {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/** Stable id for `/realisations/[id]` — disambiguates duplicate titles. */
export function getProjectSlug(
  project: PortfolioPageContent["gallery"]["projects"][number],
  index: number,
  projects: PortfolioPageContent["gallery"]["projects"],
): string {
  const base = slugifyProjectTitle(project.title) || `projet-${index + 1}`
  const sameBase = projects.filter((p) => slugifyProjectTitle(p.title) === base)
  if (sameBase.length <= 1) return base

  const order = projects
    .slice(0, index + 1)
    .filter((p) => slugifyProjectTitle(p.title) === base).length
  return `${base}-${order}`
}

export function withProjectSlugs(
  projects: PortfolioPageContent["gallery"]["projects"],
): PortfolioProject[] {
  return projects.map((project, index) => ({
    ...project,
    slug: getProjectSlug(project, index, projects),
  }))
}

export function findProjectBySlug(
  projects: PortfolioProject[],
  id: string,
): PortfolioProject | undefined {
  return projects.find((p) => p.slug === id)
}

export function getAdjacentProjects(
  projects: PortfolioProject[],
  currentSlug: string,
): { prev: PortfolioProject | null; next: PortfolioProject | null } {
  const index = projects.findIndex((p) => p.slug === currentSlug)
  if (index === -1) return { prev: null, next: null }
  return {
    prev: index > 0 ? projects[index - 1]! : null,
    next: index < projects.length - 1 ? projects[index + 1]! : null,
  }
}
