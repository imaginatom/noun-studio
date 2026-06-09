import { ProjectImage } from "@/components/project-image";
import { HoverFillLink } from "@/components/hover-fill-link";
import {
  architecturePageDefaults,
  type ArchitecturePageContent,
} from "@/lib/content/architecture";
import { Parallax, SoftReveal } from "@/components/motion";

type FeaturedProjectContent = ArchitecturePageContent["featuredProject"];

const sectionBg =
  "color-mix(in srgb, hsl(var(--muted)) 40%, hsl(var(--background)) 60%)";

export function ArchitectureFeaturedProject({
  content = architecturePageDefaults.featuredProject,
}: {
  content?: FeaturedProjectContent;
}) {
  return (
    <section data-snap-soft className="section-padding bg-muted/40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SoftReveal
          y={48}
          fromOpacity={0.35}
          exitY={32}
          exitOpacity={0.6}
          scrub={0.9}
        >
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="animate-on-scroll animate-fade-left relative lg:col-span-6">
              <div
                className="relative aspect-[4/5] overflow-hidden"
                style={{ backgroundColor: sectionBg }}
              >
                <Parallax
                  y={-0.06}
                  scaleFrom={0.05}
                  className="absolute inset-0"
                >
                  <ProjectImage
                    src={content.image.src}
                    alt={content.image.alt}
                    fill
                    className="object-cover grayscale"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </Parallax>
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
                <span>{content.title}</span>
                <span>Atelier · Oran</span>
              </div>
            </div>

            <div className="animate-on-scroll animate-fade-right flex flex-col justify-center lg:col-span-6 lg:pt-12">
              <p className="eyebrow">— {content.label}</p>
              <h2 className="mt-6 font-serif text-4xl font-light leading-[1.05] text-foreground md:text-5xl">
                {content.title}
              </h2>
              <p className="mt-8 max-w-md text-sm font-light leading-relaxed text-muted-foreground">
                {content.body}
              </p>
              <div className="mt-14">
                <HoverFillLink href={content.href} showArrow>
                  Voir le portfolio
                </HoverFillLink>
              </div>
            </div>
          </div>
        </SoftReveal>
      </div>
    </section>
  );
}
