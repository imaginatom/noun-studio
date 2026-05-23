import type { Metadata } from "next"
import { ArchitectureHero } from "@/components/architecture/architecture-hero"
import { ArchitecturePhilosophy } from "@/components/architecture/architecture-philosophy"
import { ArchitectureServices } from "@/components/architecture/architecture-services"
import { ArchitectureProcess } from "@/components/architecture/architecture-process"
import { ArchitectureFeaturedProject } from "@/components/architecture/architecture-featured-project"
import { ArchitectureValues } from "@/components/architecture/architecture-values"
import { ArchitectureCtaSection } from "@/components/architecture/architecture-cta-section"
import { SectionTransition } from "@/components/home/section-transition"
import { ScrollProgress } from "@/components/home/scroll-progress"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { mergeArchitectureContent } from "@/lib/content/architecture"

export const metadata: Metadata = {
  title: "Architecture & Gestion de Projet",
  description:
    "Services d'architecture par Noun Studio : conception résidentielle et commerciale, rénovation, visualisation 3D et suivi de chantier en Algérie et en France.",
}

export default async function ArchitecturePage() {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("site_content")
    .select("section, content")
    .eq("page", "architecture")
  const content = mergeArchitectureContent(error ? [] : data ?? [])

  const philosophyQuote = content.philosophy.paragraphs[0] ?? ""

  return (
    <>
      <ScrollProgress />

      <ArchitectureHero content={content.hero} />

      <SectionTransition
        chapter="I"
        label={content.philosophy.label}
        sectionBg="background"
        quote={philosophyQuote}
      />

      <ArchitecturePhilosophy content={content.philosophy} />

      <SectionTransition chapter="II" label="Expertise" sectionBg="background" />

      <ArchitectureServices content={content.services} />

      <SectionTransition chapter="III" label="Approche" sectionBg="whyUs" />

      <ArchitectureProcess content={content.process} />

      <SectionTransition
        chapter="IV"
        label="Projet"
        sectionBg="muted"
        quote={content.featuredProject.body}
      />

      <ArchitectureFeaturedProject content={content.featuredProject} />

      <SectionTransition chapter="V" label="Vision" sectionBg="background" />

      <ArchitectureValues content={content.values} />

      <ArchitectureCtaSection content={content.cta} />
    </>
  )
}
