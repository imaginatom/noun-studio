import { architecturePageDefaults, type ArchitecturePageContent } from "@/lib/content/architecture"

type PhilosophyContent = ArchitecturePageContent["philosophy"]

export function ArchitecturePhilosophy({
  content = architecturePageDefaults.philosophy,
}: {
  content?: PhilosophyContent
}) {
  return (
    <section className="bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="animate-on-scroll animate-fade-left lg:col-span-5">
            <p className="eyebrow">— {content.label}</p>
            <h2 className="mt-6 font-serif text-4xl font-light leading-[1.02] text-foreground md:text-5xl lg:text-6xl">
              {content.titleLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
          </div>
          <div className="animate-on-scroll animate-fade-right flex flex-col justify-center gap-6 lg:col-span-7">
            {content.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="text-sm font-light leading-relaxed text-muted-foreground md:text-base"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
