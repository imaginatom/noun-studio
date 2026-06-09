import { architecturePageDefaults, type ArchitecturePageContent } from "@/lib/content/architecture"

type ValuesContent = ArchitecturePageContent["values"]

export function ArchitectureValues({
  content = architecturePageDefaults.values,
}: {
  content?: ValuesContent
}) {
  if (content.items.length === 0) {
    return null
  }

  return (
    <section className="section-padding bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="animate-on-scroll animate-fade-left lg:col-span-5">
            <p className="eyebrow">— Values</p>
            <h2 className="mt-6 font-serif text-4xl font-light leading-[1.05] text-foreground md:text-5xl">
              {content.title}
            </h2>
          </div>

          <div className="animate-on-scroll animate-fade-right lg:col-span-7">
            <ul className="border-t border-border">
              {content.items.map((item, index) => (
                <li
                  key={item}
                  className="grid grid-cols-12 items-baseline gap-4 border-b border-border py-8"
                >
                  <span className="col-span-2 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="col-span-10">
                    <h3 className="font-serif text-xl font-normal text-foreground md:text-2xl">
                      {item}
                    </h3>
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
