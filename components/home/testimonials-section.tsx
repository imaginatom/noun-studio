"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { homePageDefaults, type HomePageContent } from "@/lib/content/homepage"

type TestimonialsContent = HomePageContent["testimonials"]

export function TestimonialsSection({
  content = homePageDefaults.testimonials,
}: {
  content?: TestimonialsContent
}) {
  const [current, setCurrent] = useState(0)
  const testimonials = content.items

  useEffect(() => {
    if (testimonials.length > 0 && current >= testimonials.length) {
      setCurrent(0)
    }
  }, [current, testimonials.length])

  if (testimonials.length === 0) {
    return null
  }

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1))
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1))
  const active = testimonials[current]

  return (
    <section className="bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-5xl px-6 lg:px-10">
        <div className="animate-on-scroll mb-16 flex items-baseline justify-between border-b border-border pb-6">
          <p className="eyebrow">— {content.eyebrow}</p>
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            {String(current + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
          </p>
        </div>

        <div className="animate-on-scroll">
          <h2 className="sr-only">{content.title}</h2>

          <blockquote className="font-serif text-3xl font-light italic leading-[1.25] text-foreground md:text-4xl lg:text-5xl">
            <span aria-hidden="true" className="mr-1 text-muted-foreground/70">“</span>
            {active.text}
            <span aria-hidden="true" className="ml-1 text-muted-foreground/70">”</span>
          </blockquote>

          <div className="mt-14 flex items-end justify-between gap-6">
            <div>
              <p className="text-sm font-medium tracking-wide text-foreground">{active.name}</p>
              <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                {active.city}
              </p>
            </div>

            {testimonials.length > 1 && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={prev}
                  className="flex h-10 w-10 items-center justify-center border border-border text-foreground transition-colors hover:bg-foreground hover:text-background"
                  aria-label="Témoignage précédent"
                >
                  <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="flex h-10 w-10 items-center justify-center border border-border text-foreground transition-colors hover:bg-foreground hover:text-background"
                  aria-label="Témoignage suivant"
                >
                  <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
