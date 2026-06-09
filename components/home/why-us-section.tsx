import { ProjectImage } from "@/components/project-image";
import { HoverFillLink } from "@/components/hover-fill-link";
import { homePageDefaults, type HomePageContent } from "@/lib/content/homepage";
import { SectionEyebrow } from "@/components/home/section-eyebrow";
import { cn } from "@/lib/utils";

type WhyUsContent = HomePageContent["whyUs"];

const sectionBg = "#F9F8F6";

function WhyUsImage({ content }: { content: WhyUsContent }) {
  return (
    <>
      <div className="animate-on-scroll animate-fade-left relative aspect-[4/5] overflow-hidden">
        <div
          className="relative h-full w-full"
          style={{ backgroundColor: sectionBg }}
        >
          <ProjectImage
            src={content.image.src}
            alt={content.image.alt}
            fill
            className="object-cover grayscale"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
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
      </div>
      <div className="animate-on-scroll animate-fade mt-4 flex items-baseline justify-between text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        <span>
          {content.floatingBadge.value} · {content.floatingBadge.label}
        </span>
        <span>Atelier · Oran</span>
      </div>
    </>
  );
}

function WhyUsHeader({ content }: { content: WhyUsContent }) {
  return (
    <div className="stagger-children">
      <SectionEyebrow className="animate-on-scroll animate-fade">
        {content.eyebrow}
      </SectionEyebrow>
      <h2 className="animate-on-scroll animate-reveal-text mt-6 font-serif text-4xl font-light leading-[1.05] text-foreground md:text-5xl">
        {content.title}
      </h2>
    </div>
  );
}

function WhyUsBenefits({ benefits }: { benefits: WhyUsContent["benefits"] }) {
  if (benefits.length === 0) {
    return null;
  }

  return (
    <ul className="stagger-children mt-6 flex flex-col max-lg:gap-0 lg:mt-12 lg:grid lg:grid-cols-2 lg:gap-x-10 lg:gap-y-10">
      {benefits.map((benefit, index) => {
        const isLeft = index % 2 === 0;

        return (
          <li
            key={benefit.title}
            className={cn(
              "animate-on-scroll flex flex-col gap-3",
              "max-lg:aspect-square max-lg:w-[54vw] max-lg:justify-start max-lg:gap-1 max-lg:border max-lg:border-foreground/10 max-lg:bg-background max-lg:p-[1.125rem]",
              isLeft
                ? "max-lg:mr-auto max-lg:self-start"
                : "max-lg:ml-auto max-lg:self-end max-lg:-mt-[24vw]",
              index === 2 && "max-lg:-mt-[21vw]",
              index === 4 && "max-lg:-mt-[22vw]",
            )}
          >
            <div className="flex items-baseline gap-2">
              <span className="shrink-0 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground lg:text-[10px]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="font-serif text-lg font-normal leading-tight text-foreground lg:text-xl">
                {benefit.title}
              </h3>
            </div>
            <p className="text-sm font-light leading-snug text-muted-foreground lg:text-sm lg:leading-relaxed">
              {benefit.description}
            </p>
          </li>
        );
      })}
    </ul>
  );
}

export function WhyUsSection({
  content = homePageDefaults.whyUs,
}: {
  content?: WhyUsContent;
}) {
  return (
    <section
      id="approche"
      data-grid-tier="wide"
      className="approche-band relative"
    >
      <div className="section-padding">
        <div className="section-shell">
          <div className="flex flex-col gap-6 lg:grid lg:grid-cols-12 lg:items-start lg:gap-16">
            <div className="order-1 lg:hidden">
              <WhyUsHeader content={content} />
            </div>

            <div className="order-2 lg:col-span-6">
              <WhyUsImage content={content} />
            </div>

            <div className="order-3 lg:col-span-6 lg:pt-12">
              <div className="hidden lg:block">
                <WhyUsHeader content={content} />
              </div>

              <WhyUsBenefits benefits={content.benefits} />

              <div className="animate-on-scroll animate-fade mt-14">
                <HoverFillLink href="/contact" showArrow>
                  {content.ctaLabel}
                </HoverFillLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
