import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { homePageDefaults, type HomePageContent } from "@/lib/content/homepage"
import { SectionChapterIntro } from "@/components/home/section-transition"
import { cn } from "@/lib/utils"

type WhyUsContent = HomePageContent["whyUs"]

const sectionBg = "#F9F8F6"

export function WhyUsSection({
  content = homePageDefaults.whyUs,
  chapter,
  chapterLabel,
}: {
  content?: WhyUsContent
  chapter?: string
  chapterLabel?: string
}) {
  return (
    <section id="approche" data-snap-soft className="approche-band relative">
      {chapter && (
        <SectionChapterIntro
          chapter={chapter}
          label={chapterLabel}
          embedded
          className="bg-transparent"
        />
      )}
      <div className={cn("pb-24 lg:pb-32", !chapter && "pt-24 lg:pt-32")}>
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="animate-on-scroll animate-fade-left relative lg:col-span-6">
            <div
              className="relative aspect-[4/5] overflow-hidden"
              style={{ backgroundColor: sectionBg }}
            >
              <Image
                src={content.image.src}
                alt={content.image.alt}
                fill
                className="object-cover grayscale"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-10"
              >
                <div
                  className="absolute inset-y-0 left-0 w-[22%]"
                  style={{
                    background: `linear-gradient(to right, ${sectionBg}, transparent)`,
                  }}
                />
                <div
                  className="absolute inset-y-0 right-0 w-[22%]"
                  style={{
                    background: `linear-gradient(to left, ${sectionBg}, transparent)`,
                  }}
                />
                <div
                  className="absolute inset-x-0 top-0 h-[18%]"
                  style={{
                    background: `linear-gradient(to bottom, ${sectionBg}, transparent)`,
                  }}
                />
                <div
                  className="absolute inset-x-0 bottom-0 h-[18%]"
                  style={{
                    background: `linear-gradient(to top, ${sectionBg}, transparent)`,
                  }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `radial-gradient(ellipse 80% 75% at 50% 50%, transparent 42%, ${sectionBg} 100%)`,
                  }}
                />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              <span>{content.floatingBadge.value} · {content.floatingBadge.label}</span>
              <span>Atelier · Oran</span>
            </div>
          </div>

          <div className="animate-on-scroll animate-fade-right lg:col-span-6 lg:pt-12">
            <p className="eyebrow">— {content.eyebrow}</p>
            <h2 className="mt-6 font-serif text-4xl font-light leading-[1.05] text-foreground md:text-5xl">
              {content.title}
            </h2>

            {content.benefits.length > 0 && (
              <ul className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2">
                {content.benefits.map((benefit, index) => (
                  <li key={benefit.title} className="flex flex-col gap-3">
                    <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-serif text-xl font-normal text-foreground">
                      {benefit.title}
                    </h3>
                    <p className="text-sm font-light leading-relaxed text-muted-foreground">
                      {benefit.description}
                    </p>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-14">
              <Link
                href="/contact"
                className="group inline-flex items-baseline gap-3 border-b border-foreground/30 pb-2 text-sm font-medium tracking-wide text-foreground transition-colors hover:border-foreground"
              >
                {content.ctaLabel}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  )
}
