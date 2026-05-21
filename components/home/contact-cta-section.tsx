import Image from "next/image"
import { ContactForm } from "@/components/contact-form"
import { PerspectiveText } from "@/components/home/perspective-text"
import { homePageDefaults, type HomePageContent } from "@/lib/content/homepage"

type ContactCtaContent = HomePageContent["contactCta"]

const PERSPECTIVE_LINES = [
  { primary: "DONNONS", secondary: "RÉVÉLONS", offset: 18 },
  { primary: "VIE", secondary: "L'ÂME", offset: 45 },
  { primary: "À VOTRE", secondary: "DE VOS", offset: 25},
  { primary: "VISION", secondary: "ESPACES", offset: 34 },
]

export function ContactCtaSection({
  content = homePageDefaults.contactCta,
}: {
  content?: ContactCtaContent
}) {
  return (
    <section id="contact" className="bg-black ">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid items-stretch lg:grid-cols-2">
          {/* Left — image fills full column height (incl. vertical spacing) */}
          <div
            className="flex min-h-full flex-col bg-black bg-[length:auto_100%] bg-center bg-no-repeat pt-32 pb-12 text-background lg:pt-40 lg:pb-16"
            style={{ backgroundImage: "url('/contact-bg.png')" }}
          >
            <div className="animate-on-scroll animate-fade-left flex h-full flex-col px-6 lg:px-10">
             
              <h2 className="sr-only">{content.title}</h2>
              <div className="mt-10 flex flex-1 flex-col items-center justify-center gap-6">
                <Image
                  src="/favicon.svg"
                  alt=""
                  width={367}
                  height={264}
                  className="h-28 w-auto object-contain opacity-90 drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)] md:h-32"
                  aria-hidden
                />
                <PerspectiveText
                  className="w-full"
                  intervalMs={8000}
                  revealMs={8000}
                  staggerMs={220}
                  ariaLabel={content.title}
                  lines={PERSPECTIVE_LINES}
                />
              </div>
            </div>
          </div>

          {/* Right — black, matched height */}
          <div className="flex min-h-full flex-col overflow-visible bg-black py-24 text-background lg:py-32">
            <div className="animate-on-scroll animate-fade-right flex h-full flex-col justify-center overflow-visible px-6 lg:px-10">
              <div className="relative bg-[#828281] p-8 text-foreground md:p-10">
                {/* Top — inner / outer (2px gap) */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute top-0 left-[-102px] right-[-50px] h-px bg-background"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute top-[-3px] left-[-102px] right-[-50px] h-px bg-background"
                />
                {/* Right */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute top-[-40px] bottom-[-70px] right-0 w-px bg-background"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute top-[-40px] bottom-[-70px] right-[-3px] w-px bg-background"
                />
                {/* Left */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute top-[-60px] bottom-[-50px] left-0 w-px bg-background"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute top-[-60px] bottom-[-50px] left-[-3px] w-px bg-background"
                />
                {/* Bottom */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-0 left-[-72px] right-[-50px] h-px bg-background"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-[-3px] left-[-72px] right-[-50px] h-px bg-background"
                />
                <ContactForm fieldsOnMutedPanel />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
