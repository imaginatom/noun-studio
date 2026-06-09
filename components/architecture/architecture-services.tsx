import { architecturePageDefaults, type ArchitecturePageContent } from "@/lib/content/architecture"

type ServicesContent = ArchitecturePageContent["services"]

export function ArchitectureServices({
  content = architecturePageDefaults.services,
}: {
  content?: ServicesContent
}) {
  if (content.items.length === 0) {
    return null
  }

  return (
    <section className="section-padding bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="animate-on-scroll lg:col-span-4">
            <p className="eyebrow">— Services</p>
            <h2 className="mt-6 font-serif text-4xl font-light leading-[1.05] text-foreground md:text-5xl">
              {content.label}
            </h2>
          </div>

          <div className="lg:col-span-8">
            <ul className="border-t border-border">
              {content.items.map((service, index) => (
                <li key={service.title} className="animate-on-scroll group border-b border-border">
                  <div className="grid grid-cols-12 items-baseline gap-4 py-8 transition-colors hover:bg-muted/40 lg:py-10">
                    <span className="col-span-1 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="col-span-11">
                      <h3 className="font-serif text-2xl font-light text-foreground md:text-3xl">
                        {service.title}
                      </h3>
                      <p className="mt-3 max-w-2xl text-sm font-light leading-relaxed text-muted-foreground">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
