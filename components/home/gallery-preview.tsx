"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { homePageDefaults, type HomePageContent } from "@/lib/content/homepage"

function GalleryImage({
  img,
}: {
  img: { src: string; alt: string; label: string; span: string }
}) {
  const [loaded, setLoaded] = useState(false)
  const isFeatured = img.span.length > 0
  return (
    <div
      className={cn(
        "group relative overflow-hidden",
        img.span,
        isFeatured ? "aspect-square md:aspect-auto" : "aspect-[4/5]",
      )}
    >
      {!loaded && <div className="skeleton absolute inset-0 z-10" aria-hidden="true" />}
      <Image
        src={img.src}
        alt={img.alt}
        fill
        className={cn(
          "object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-[1.03]",
          loaded ? "opacity-100" : "opacity-0",
        )}
        sizes="(max-width: 768px) 100vw, 50vw"
        onLoad={() => setLoaded(true)}
      />
      <div className="absolute inset-0 bg-foreground/0 transition-colors duration-500 group-hover:bg-foreground/20" />
      <div className="absolute inset-x-0 bottom-0 flex translate-y-2 items-end justify-between p-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
        <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-background">
          {img.label}
        </span>
        <ArrowUpRight className="h-4 w-4 text-background" strokeWidth={1.5} />
      </div>
    </div>
  )
}

type GalleryContent = HomePageContent["galleryPreview"]

export function GalleryPreview({
  content = homePageDefaults.galleryPreview,
  images = [],
}: {
  content?: GalleryContent
  images?: Array<{ src: string; alt: string; label: string }>
}) {
  if (images.length === 0) {
    return null
  }
  const useMosaicLayout = images.length >= 5
  const previewImages = images.map((image, index) => ({
    ...image,
    span: useMosaicLayout && index === 0 ? "md:col-span-2 md:row-span-2" : "",
  }))
  const gridColsClass =
    images.length === 1
      ? "md:grid-cols-1"
      : images.length === 2
        ? "md:grid-cols-2"
        : "md:grid-cols-3"
  return (
    <section className="bg-muted/40 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="animate-on-scroll mb-14 flex flex-col items-start justify-between gap-6 border-b border-border pb-8 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">— {content.eyebrow}</p>
            <h2 className="mt-6 font-serif text-4xl font-light leading-[1.05] text-foreground md:text-5xl">
              {content.title}
            </h2>
            <p className="mt-4 max-w-md text-sm font-light leading-relaxed text-muted-foreground">
              {content.subtitle}
            </p>
          </div>
          <Link
            href="/realisations"
            className="group inline-flex items-baseline gap-3 border-b border-foreground/30 pb-2 text-sm font-medium tracking-wide text-foreground transition-colors hover:border-foreground"
          >
            {content.ctaLabel}
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.5} />
          </Link>
        </div>

        <div
          className={cn(
            "animate-on-scroll grid gap-3",
            gridColsClass,
            useMosaicLayout && "md:grid-rows-3",
          )}
        >
          {previewImages.map((img, i) => (
            <GalleryImage key={`${img.src}-${i}`} img={img} />
          ))}
        </div>
      </div>
    </section>
  )
}
