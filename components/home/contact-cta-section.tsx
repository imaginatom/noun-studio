import Link from "next/link"
import { ArrowUpRight, Mail } from "lucide-react"
import { SectionChapterIntro } from "@/components/home/section-transition"
import { homePageDefaults, type HomePageContent } from "@/lib/content/homepage"

type ContactCtaContent = HomePageContent["contactCta"]

export function ContactCtaSection({
  content = homePageDefaults.contactCta,
  chapter,
  chapterLabel,
  chapterQuote,
}: {
  content?: ContactCtaContent
  chapter?: string
  chapterLabel?: string
  chapterQuote?: string
}) {
  return (
    <section id="contact" data-snap-soft className="border-t border-border bg-background pb-20 lg:pb-28">
      {chapter && (
        <SectionChapterIntro
          chapter={chapter}
          label={chapterLabel}
          quote={chapterQuote}
          embedded
          revealOnMount
          className="!pt-12 lg:!pt-16"
        />
      )}

      <div
        className={
          chapter
            ? "mx-auto max-w-4xl px-6 text-center lg:px-10"
            : "mx-auto max-w-4xl px-6 py-8 text-center lg:px-10"
        }
      >
        <h2
          className="font-serif text-[clamp(2rem,5vw,4rem)] font-light leading-[0.95] text-foreground text-balance"
          style={{ letterSpacing: "-0.02em" }}
        >
          {content.title}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-sm font-light leading-[1.75] text-muted-foreground lg:text-base">
          {content.subtitle}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-8">
          <Link
            href="/contact"
            className="group inline-flex items-baseline gap-3 border-b border-foreground/30 pb-2 text-sm font-medium tracking-[0.12em] text-foreground transition-colors hover:border-foreground"
          >
            Nous contacter
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              strokeWidth={1.5}
            />
          </Link>
          <a
            href={`mailto:${content.emailAddress}`}
            className="group inline-flex items-center gap-3 border-b border-foreground/30 pb-2 text-sm font-medium tracking-[0.12em] text-foreground/85 transition-colors hover:border-foreground hover:text-foreground"
          >
            <Mail className="h-4 w-4" />
            {content.emailLabel}
          </a>
        </div>
      </div>
    </section>
  )
}
