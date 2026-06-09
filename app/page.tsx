import type { Metadata } from "next";
import { HeroSection } from "@/components/home/hero-section";
import { SocialProofBar } from "@/components/home/social-proof-bar";
import { SectionTransition } from "@/components/home/section-transition";
import { ServicesOverview } from "@/components/home/services-overview";
import { WhyUsSection } from "@/components/home/why-us-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { GalleryPreview } from "@/components/home/gallery-preview";
import { LocalSeoSection } from "@/components/home/local-seo-section";
import { ContactCtaSection } from "@/components/home/contact-cta-section";
import { ScrollProgress } from "@/components/home/scroll-progress";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { mergeHomePageContent } from "@/lib/content/homepage";
import { mergePortfolioContent } from "@/lib/content/portfolio";
import { getProjectCover, withProjectSlugs } from "@/lib/portfolio-project";

export const metadata: Metadata = {
  title: "Architecte \u00e0 Oran | Noun Studio",
  description:
    "Cabinet d'architecture et studio de design \u00e0 Oran, Alg\u00e9rie. Projets r\u00e9sidentiels et commerciaux.",
};

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();
  const [homeResult, portfolioResult] = await Promise.all([
    supabase.from("site_content").select("section, content").eq("page", "home"),
    supabase
      .from("site_content")
      .select("section, content")
      .eq("page", "portfolio")
      .eq("section", "gallery"),
  ]);
  const content = mergeHomePageContent(
    homeResult.error ? [] : (homeResult.data ?? []),
  );
  const portfolioContent = mergePortfolioContent(
    portfolioResult.error ? [] : (portfolioResult.data ?? []),
  );
  const previewProjects = withProjectSlugs(
    portfolioContent.gallery.projects,
  ).slice(0, 6);
  const previewImages = previewProjects.map((project) => {
    const cover = getProjectCover(project);
    return {
      src: cover.src,
      alt: cover.alt,
      label: project.category,
      slug: project.slug,
    };
  });

  return (
    <div>
      <ScrollProgress />

      <HeroSection content={content.hero} />
      <SocialProofBar />

      <SectionTransition
        quote="Concevoir des lieux qui dialoguent avec leur contexte, leur histoire et celles et ceux qui les habitent."
        videoSrc="/archi-vid.mp4"
        sectionBg="background"
      />

      <ServicesOverview content={content.services} />

      <WhyUsSection content={content.whyUs} />

      <TestimonialsSection content={content.testimonials} />

      <GalleryPreview
        content={content.galleryPreview}
        images={previewImages}
      />

      <LocalSeoSection content={content.localSeo} />

      <ContactCtaSection content={content.contactCta} />
    </div>
  );
}
