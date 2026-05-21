import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { homePageDefaults, type HomePageContent } from "@/lib/content/homepage"

type ServicesContent = HomePageContent["services"]

const serviceHrefs = ["/architecture", "/contact"]

export function ServicesOverview({
  content = homePageDefaults.services,
}: {
  content?: ServicesContent
}) {
  if (content.items.length === 0) {
    return null
  }
  return (
    <section className="bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="animate-on-scroll lg:col-span-4">
            <p className="eyebrow">— {content.eyebrow}</p>
            <h2 className="mt-6 font-serif text-4xl font-light leading-[1.05] text-foreground md:text-5xl">
              {content.title}
            </h2>
          </div>

          <div className="lg:col-span-8">
            <ul className="border-t border-border">
              {content.items.map((service, index) => {
                const href = serviceHrefs[index] ?? "/contact"
                return (
                  <li key={service.title} className="animate-on-scroll group border-b border-border">
                    <Link
                      href={href}
                      className="grid grid-cols-12 items-baseline gap-4 py-8 transition-colors hover:bg-muted/40 lg:py-10"
                    >
                      <span className="col-span-1 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="col-span-10">
                        <h3 className="font-serif text-2xl font-light text-foreground transition-transform duration-300 group-hover:translate-x-1 md:text-3xl">
                          {service.title}
                        </h3>
                        <p className="mt-3 max-w-2xl text-sm font-light leading-relaxed text-muted-foreground">
                          {service.description}
                        </p>
                      </div>
                      <span className="col-span-1 flex justify-end">
                        <ArrowUpRight
                          className="h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                          strokeWidth={1.5}
                        />
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
