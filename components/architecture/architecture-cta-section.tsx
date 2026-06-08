import { ProjectImage } from "@/components/project-image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Parallax } from "@/components/motion";

type ImageCtaContent = {
  phrase: string;
  backgroundImage: {
    src: string;
    alt: string;
  };
  primaryCtaLabel: string;
  primaryCtaHref: string;
};

type ArchitectureCtaSectionProps = {
  content: ImageCtaContent;
  chapter?: string;
  label?: string;
  quote?: string;
};

function ChapterHeader({
  chapter,
  label,
}: {
  chapter: string;
  label?: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex items-center gap-6">
        <span className="h-px w-16 bg-background/30 sm:w-24" />
        <span className="font-serif text-2xl font-light italic tracking-wide text-background md:text-3xl">
          {chapter}
        </span>
        <span className="h-px w-16 bg-background/30 sm:w-24" />
      </div>
      {label && (
        <span
          className="mt-5 block text-[11px] font-medium uppercase text-background/55"
          style={{ letterSpacing: "0.32em" }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

export function ArchitectureCtaSection({
  content,
  chapter = "VI",
  label = "Échanger",
  quote = "Chaque projet débute par une conversation. Parlons du vôtre.",
}: ArchitectureCtaSectionProps) {
  return (
    <section data-snap-soft className="relative overflow-hidden py-20 lg:py-28">
      <Parallax y={-0.12} scaleFrom={0.06} className="absolute inset-0">
        <ProjectImage
          src={content.backgroundImage.src}
          alt={content.backgroundImage.alt}
          fill
          className="object-cover"
          sizes="100vw"
          priority={false}
        />
      </Parallax>
      <div className="absolute inset-0 bg-foreground/35" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <div className="animate-on-scroll mx-auto flex max-w-3xl flex-col items-center gap-10 text-center lg:gap-12">
          <ChapterHeader chapter={chapter} label={label} />

          <p className="font-serif text-xl font-light italic leading-relaxed text-background/90 md:text-2xl lg:text-[1.65rem] lg:leading-relaxed">
            {quote}
          </p>

          {content.phrase ? (
            <p className="font-serif text-3xl font-light leading-snug text-background md:text-4xl lg:text-5xl lg:leading-tight text-balance">
              {content.phrase}
            </p>
          ) : null}

          <Link
            href={content.primaryCtaHref}
            className={cn(
              "inline-flex w-fit items-center gap-2 rounded-none border border-background/35",
              "bg-background/15 px-8 py-3.5 text-sm font-medium text-background",
              "shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-md transition-colors",
              "hover:border-background/50 hover:bg-background/25",
            )}
          >
            {content.primaryCtaLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
