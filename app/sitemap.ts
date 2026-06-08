import type { MetadataRoute } from "next"
import { portfolioPageDefaults } from "@/lib/content/portfolio"
import { getProjectSlug } from "@/lib/portfolio-project"

const BASE_URL = "https://nounstudio.dz"

export default function sitemap(): MetadataRoute.Sitemap {
  const projects = portfolioPageDefaults.gallery.projects
  const projectEntries: MetadataRoute.Sitemap = projects.map((project, index) => ({
    url: `${BASE_URL}/realisations/${getProjectSlug(project, index, projects)}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/architecture`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/realisations`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    ...projectEntries,
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ]
}
