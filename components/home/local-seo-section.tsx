import { homePageDefaults, type HomePageContent } from "@/lib/content/homepage"
import { SectionChapterIntro } from "@/components/home/section-transition"
import { cn } from "@/lib/utils"

type LocalSeoContent = HomePageContent["localSeo"]

/** Image in public/ancrage-local-bg.png */
const ANCRAGE_LOCAL_BG = "/ancrage-local-bg.png"

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

      <div className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-cover bg-bottom bg-no-repeat opacity-25"
          style={{ backgroundImage: `url('${ANCRAGE_LOCAL_BG}')` }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-background/72"
        />

        <div
          className={cn(
            "relative z-[1] mx-auto max-w-7xl px-6 lg:px-10",
            chapter ? "pt-24 pb-24 lg:pt-32 lg:pb-32" : "py-24 lg:py-32",
          )}
        >
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="animate-on-scroll animate-fade-left lg:col-span-5">
              <p className="eyebrow !text-xs md:!text-[13px]">— {content.eyebrow}</p>
              <h2 className="mt-6 font-serif text-[2.75rem] font-light leading-[1.05] text-foreground md:text-6xl">
                {content.title}
              </h2>
              <p className="mt-8 max-w-md text-base font-light leading-relaxed text-muted-foreground md:text-lg">
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
                      <span className="col-span-2 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground md:text-[13px]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="col-span-10">
                        <h3 className="font-serif text-2xl font-normal text-foreground md:text-3xl">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-base font-light leading-relaxed text-muted-foreground md:text-[17px]">
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
      </div>
    </section>
  )
}
