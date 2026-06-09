import { ContactForm } from "@/components/contact-form"
import { PerspectiveText } from "@/components/home/perspective-text"
import { homePageDefaults, type HomePageContent } from "@/lib/content/homepage"

type ContactCtaContent = HomePageContent["contactCta"]

const PERSPECTIVE_LINES = [
  { primary: "DONNONS", secondary: "RÉVÉLONS", offset: 0 },
  { primary: "VIE", secondary: "L'ÂME", offset: 4 },
  { primary: "À VOTRE", secondary: "DE VOS", offset: 1.5 },
  { primary: "VISION", secondary: "ESPACES", offset: 5.5 },
]

export function ContactCtaSection({
  content = homePageDefaults.contactCta,
}: {
  content?: ContactCtaContent
}) {
  return (
    <section id="contact" data-grid-tier="wide" className="section-padding bg-foreground text-background">
      <div className="section-shell">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="animate-on-scroll animate-fade-left lg:col-span-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-background/50">
              [Contact]
            </p>
            <h2 className="sr-only">{content.title}</h2>
            <PerspectiveText
              className="mt-10"
              ariaLabel={content.title}
              lines={PERSPECTIVE_LINES}
            />
          </div>

          <div className="animate-on-scroll animate-fade-right lg:col-span-6">
            <div className="bg-background p-8 text-foreground md:p-10">
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
