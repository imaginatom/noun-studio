import { architecturePageDefaults, type ArchitecturePageContent } from "@/lib/content/architecture"

type ProcessContent = ArchitecturePageContent["process"]

const whyUsSectionBg =
  "color-mix(in srgb, hsl(var(--muted)) 40%, hsl(var(--background)) 60%)"

export function ArchitectureProcess({
  content = architecturePageDefaults.process,
}: {
  content?: ProcessContent
}) {
  if (content.steps.length === 0) {
    return null
  }

  return (
    <section className="section-padding" style={{ backgroundColor: whyUsSectionBg }}>
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="animate-on-scroll mb-14 max-w-2xl">
          <p className="eyebrow">— Process</p>
          <h2 className="mt-6 font-serif text-4xl font-light leading-[1.05] text-foreground md:text-5xl">
            {content.title}
          </h2>
        </div>

        <ul className="border-t border-border">
          {content.steps.map((step) => (
            <li
              key={step.step}
              className="animate-on-scroll grid grid-cols-12 items-baseline gap-4 border-b border-border py-8 lg:py-10"
            >
              <span className="col-span-2 font-serif text-2xl font-light italic text-muted-foreground md:text-3xl">
                {step.step}
              </span>
              <div className="col-span-10">
                <h3 className="font-serif text-xl font-normal text-foreground md:text-2xl">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm font-light leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
