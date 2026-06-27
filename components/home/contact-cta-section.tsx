import Image from "next/image"
import { Mail } from "lucide-react"
import { ContactForm } from "@/components/contact-form"
import { homePageDefaults, type HomePageContent } from "@/lib/content/homepage"

type ContactCtaContent = HomePageContent["contactCta"]

export function ContactCtaSection({
  content = homePageDefaults.contactCta,
}: {
  content?: ContactCtaContent
}) {
  return (
    <section
      id="contact"
      data-grid-tier="bleed"
      className="relative isolate overflow-hidden bg-foreground text-background"
    >
      {content.backgroundImage?.src && (
        <Image
          src={content.backgroundImage.src}
          alt={content.backgroundImage.alt}
          fill
          sizes="100vw"
          className="object-cover"
          priority={false}
        />
      )}
      <div
        className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/55 to-foreground/30"
        aria-hidden="true"
      />

      <div className="section-padding relative z-10">
        <div className="section-shell">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="animate-on-scroll animate-fade-left lg:col-span-5">
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-background/60">
                [Contact]
              </p>
              <h2 className="mt-6 font-serif text-4xl font-light leading-[1.05] tracking-tight text-balance text-background md:text-5xl lg:text-6xl">
                {content.title}
              </h2>
              <p className="mt-5 max-w-md text-base font-light leading-relaxed text-background/80">
                {content.subtitle}
              </p>
              {content.emailAddress && (
                <a
                  href={`mailto:${content.emailAddress}`}
                  className="mt-8 inline-flex items-center gap-3 text-sm text-background/80 transition-colors hover:text-background"
                >
                  <Mail className="h-4 w-4" strokeWidth={1.5} />
                  <span>
                    <span className="block text-[10px] uppercase tracking-[0.28em] text-background/50">
                      {content.emailLabel}
                    </span>
                    {content.emailAddress}
                  </span>
                </a>
              )}
            </div>

            <div className="animate-on-scroll animate-fade-right lg:col-span-7 lg:col-start-6">
              <div className="ml-auto w-full max-w-xl rounded-2xl bg-background/95 p-8 text-foreground shadow-2xl backdrop-blur-sm md:p-10">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
