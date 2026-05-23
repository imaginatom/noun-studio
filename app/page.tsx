import type { Metadata } from "next"
import { HeroSection } from "@/components/home/hero-section"
import { SocialProofBar } from "@/components/home/social-proof-bar"
import { ServicesOverview } from "@/components/home/services-overview"
import { WhyUsSection } from "@/components/home/why-us-section"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { GalleryPreview } from "@/components/home/gallery-preview"
import { LocalSeoSection } from "@/components/home/local-seo-section"
import { ContactCtaSection } from "@/components/home/contact-cta-section"
import { SectionTransition } from "@/components/home/section-transition"
import { ScrollProgress } from "@/components/home/scroll-progress"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { mergeHomePageContent } from "@/lib/content/homepage"
import { mergePortfolioContent } from "@/lib/content/portfolio"

export const metadata: Metadata = {
  title: "Architecte \u00e0 Oran | Noun Studio",
  description:
    "Cabinet d'architecture et studio de design \u00e0 Oran, Alg\u00e9rie. Projets r\u00e9sidentiels et commerciaux.",
}

export default async function HomePage() {
  const supabase = await createSupabaseServerClient()
  const [homeResult, portfolioResult] = await Promise.all([
    supabase.from("site_content").select("section, content").eq("page", "home"),
    supabase.from("site_content").select("section, content").eq("page", "portfolio").eq("section", "gallery"),
  ])
  const content = mergeHomePageContent(homeResult.error ? [] : homeResult.data ?? [])
  const portfolioContent = mergePortfolioContent(
    portfolioResult.error ? [] : portfolioResult.data ?? [],
  )
  const previewImages = portfolioContent.gallery.projects.slice(0, 6).map((project) => ({
    src: project.image.src,
    alt: project.image.alt,
    label: project.category,
  }))

  return (
    <>
      <ScrollProgress />

      <HeroSection content={content.hero} />
      <SocialProofBar content={content.socialProof} />

      <SectionTransition
        chapter="I"
        label="Expertise"
        sectionBg="background"
        quote="Concevoir des lieux qui dialoguent avec leur contexte, leur histoire et celles et ceux qui les habitent."
        videoSrc="/archi-vid.mp4"
      />

      <ServicesOverview content={content.services} />

      <SectionTransition
        chapter="II"
        label="Approche"
        sectionBg="whyUs"
      />

      <WhyUsSection content={content.whyUs} />

      <SectionTransition
        chapter="III"
        label="R\u00e9cits"
        sectionBg="background"
        quote="Le t\u00e9moignage de celles et ceux qui nous ont confi\u00e9 leurs projets."
      />

      <TestimonialsSection content={content.testimonials} />

      <SectionTransition
        chapter="IV"
        label="Portfolio"
        sectionBg="dark"
        quote="Une sélection silencieuse. Six gestes, six lieux, six histoires."
      />

      <GalleryPreview content={content.galleryPreview} images={previewImages} />

      <SectionTransition
        chapter="V"
        label="Ancrage local"
        sectionBg="background"
      />

      <LocalSeoSection content={content.localSeo} />

      <SectionTransition
        chapter="VI"
        label="\u00c9changer"
        sectionBg="dark"
        quote="Chaque projet d\u00e9bute par une conversation. Parlons du v\u00f4tre."
      />

      <ContactCtaSection content={content.contactCta} />
    </>
  )
}
