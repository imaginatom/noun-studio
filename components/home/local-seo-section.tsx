import { homePageDefaults, type HomePageContent } from "@/lib/content/homepage"
import { SectionChapterIntro } from "@/components/home/section-transition"
import { cn } from "@/lib/utils"

type LocalSeoContent = HomePageContent["localSeo"]

export function LocalSeoSection({
  content = homePageDefaults.localSeo,
  chapter,
  chapterLabel,
}: {
  content?: LocalSeoContent
  chapter?: string
  chapterLabel?: string
}) {
  return (
    <section className="bg-background">
      {chapter && (
        <SectionChapterIntro chapter={chapter} label={chapterLabel} embedded />
      )}
      <div
        className={cn(
          "mx-auto max-w-7xl px-6 lg:px-10",
          chapter ? "pt-24 pb-24 lg:pt-32 lg:pb-32" : "py-24 lg:py-32",
        )}
      >
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="animate-on-scroll animate-fade-left lg:col-span-5">
            <p className="eyebrow">— {content.eyebrow}</p>
            <h2 className="mt-6 font-serif text-4xl font-light leading-[1.05] text-foreground md:text-5xl">
              {content.title}
            </h2>
            <p className="mt-8 max-w-md text-sm font-light leading-relaxed text-muted-foreground">
              {content.body}
            </p>
          </div>

          {content.highlights.length > 0 && (
            <div className="animate-on-scroll animate-fade-right lg:col-span-7">
              <ul className="border-t border-border">
                {content.highlights.map((item, index) => (
                  <li
                    key={item.title}
                    className="grid grid-cols-12 items-baseline gap-4 border-b border-border py-8"
                  >
                    <span className="col-span-2 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="col-span-10">
                      <h3 className="font-serif text-xl font-normal text-foreground md:text-2xl">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm font-light leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
