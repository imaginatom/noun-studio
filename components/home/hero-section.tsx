import Link from "next/link"
import { ArrowDown, ArrowUpRight } from "lucide-react"
import { homePageDefaults, type HomePageContent } from "@/lib/content/homepage"
import { HeroParallaxImage } from "@/components/home/hero-parallax-image"

type HeroContent = HomePageContent["hero"]

export function HeroSection({ content = homePageDefaults.hero }: { content?: HeroContent }) {
  return (
    <section className="relative flex min-h-screen flex-col justify-end overflow-hidden bg-foreground text-background">
      <HeroParallaxImage src={content.backgroundImage.src} alt={content.backgroundImage.alt} />

      <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 via-foreground/20 to-foreground/85" />

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent via-foreground to-background"
        aria-hidden="true"
      />

      <div className="absolute left-6 top-32 z-10 hidden flex-col items-start gap-3 lg:flex lg:left-10">
        <span className="rotate-180 text-[10px] uppercase tracking-[0.32em] text-background/60" style={{ writingMode: "vertical-rl" }}>
          {content.badgeText}
        </span>
        <span className="h-16 w-px bg-background/30" aria-hidden="true" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 pt-40 lg:px-10 lg:pb-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-8">
            <p className="eyebrow !text-background/70 mb-8 lg:hidden">
              {content.badgeText}
            </p>

            <h1 className="font-serif text-5xl font-light leading-[1.02] tracking-tight text-balance text-background sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem]">
              {content.title}
            </h1>

            <div className="mt-10 flex items-start gap-5 lg:max-w-xl">
              <span className="mt-3 hidden h-px w-12 shrink-0 bg-background/50 sm:block" aria-hidden="true" />
              <p className="text-base font-light leading-relaxed text-background/80 md:text-lg">
                {content.subtitle}
              </p>
            </div>
          </div>

          <div className="lg:col-span-4 lg:pt-8">
            {content.trustBullets.length > 0 && (
              <ul className="space-y-3 border-l border-background/20 pl-6">
                {content.trustBullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="text-[13px] font-light tracking-wide text-background/80"
                  >
                    {bullet}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-10 flex flex-col gap-2">
              <Link
                href="/realisations"
                aria-label="Voir le portfolio"
                className="group inline-flex items-baseline justify-between gap-4 border-b border-background/30 py-3 text-sm tracking-wide transition-colors hover:border-background"
              >
                <span>{content.secondaryCtaLabel}</span>
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.5} />
              </Link>
              <Link
                href="/contact"
                aria-label="Découvrir nos services"
                className="group inline-flex items-baseline justify-between gap-4 border-b border-background/30 py-3 text-sm tracking-wide transition-colors hover:border-background"
              >
                <span>{content.primaryCtaLabel}</span>
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 flex items-end justify-between text-[10px] uppercase tracking-[0.3em] text-background/50">
          <span>Oran · Algérie</span>
          <span className="hidden md:inline-block">Studio fondé par SAHNOUNE Mohammed</span>
          <span>{new Date().getFullYear()}</span>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-background/60" aria-hidden="true">
        <span className="text-[10px] uppercase tracking-[0.3em]">Défiler</span>
        <ArrowDown className="h-4 w-4 animate-bounce" strokeWidth={1.5} />
      </div>
    </section>
  )
}
