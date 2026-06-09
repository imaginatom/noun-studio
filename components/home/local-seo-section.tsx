import { homePageDefaults, type HomePageContent } from "@/lib/content/homepage";
import { SectionEyebrow } from "@/components/home/section-eyebrow";

type LocalSeoContent = HomePageContent["localSeo"];

/** Image in public/ancrage-local-bg.png */
const ANCRAGE_LOCAL_BG = "/ancrage-local-bg.png";

export function LocalSeoSection({
  content = homePageDefaults.localSeo,
}: {
  content?: LocalSeoContent;
}) {
  return (
    <section data-grid-tier="wide" className="bg-background">
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

        <div className="section-shell section-padding relative z-[1]">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="stagger-children lg:col-span-5">
              <SectionEyebrow className="animate-on-scroll animate-fade !text-xs md:!text-[13px]">
                {content.eyebrow}
              </SectionEyebrow>
              <h2 className="animate-on-scroll animate-reveal-text mt-6 font-serif text-[2.75rem] font-light leading-[1.05] text-foreground md:text-6xl">
                {content.title}
              </h2>
              <p className="animate-on-scroll animate-fade mt-8 max-w-md text-base font-light leading-relaxed text-muted-foreground md:text-lg">
                {content.body}
              </p>
            </div>

            {content.highlights.length > 0 && (
              <div className="lg:col-span-7">
                <ul className="stagger-children border-t border-border">
                  {content.highlights.map((item, index) => (
                    <li
                      key={item.title}
                      className="animate-on-scroll animate-fade-right grid grid-cols-12 items-baseline gap-4 border-b border-border py-8"
                      style={{ transitionDelay: `${index * 80}ms` }}
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
  );
}
