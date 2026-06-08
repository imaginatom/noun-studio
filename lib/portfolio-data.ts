import { createSupabaseServerClient } from "@/lib/supabase/server"
import { mergePortfolioContent, portfolioPageDefaults } from "@/lib/content/portfolio"
import { withProjectSlugs, type PortfolioProject } from "@/lib/portfolio-project"

export async function getPortfolioProjects(): Promise<{
  content: ReturnType<typeof mergePortfolioContent>
  projects: PortfolioProject[]
}> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("site_content")
    .select("section, content")
    .eq("page", "portfolio")

  const content = mergePortfolioContent(error ? [] : data ?? [])
  const projects = withProjectSlugs(
    content.gallery.projects.length > 0
      ? content.gallery.projects
      : portfolioPageDefaults.gallery.projects,
  )

  return { content, projects }
}
