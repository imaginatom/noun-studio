import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export type ImageCtaContent = {
  phrase: string
  backgroundImage: {
    src: string
    alt: string
  }
  primaryCtaLabel: string
  primaryCtaHref: string
}

export function ImageCtaSection({ content }: { content: ImageCtaContent }) {
  return (
    <section className="relative overflow-hidden py-14 lg:py-20">
      <Image
        src={content.backgroundImage.src}
        alt={content.backgroundImage.alt}
        fill
        className="object-cover"
        sizes="100vw"
        priority={false}
      />
      <div className="absolute inset-0 bg-foreground/35" aria-hidden="true" />
      <div className="relative z-10 mx-auto flex max-w-7xl items-center px-6 lg:px-10">
        <div className="ml-auto flex w-full flex-col items-center gap-6 text-center lg:w-2/3 lg:gap-8">
          <p className="font-serif text-4xl font-light leading-snug text-background md:text-5xl lg:text-6xl lg:leading-tight text-balance">
            {content.phrase}
          </p>
          <Link
            href={content.primaryCtaHref}
            className="inline-flex w-fit items-center gap-2 rounded-none border border-background/35 bg-background/15 px-8 py-3.5 text-sm font-medium text-background shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-md transition-colors hover:border-background/50 hover:bg-background/25"
          >
            {content.primaryCtaLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
