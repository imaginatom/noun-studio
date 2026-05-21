import { homePageDefaults, type HomePageContent } from "@/lib/content/homepage"

type SocialProofContent = HomePageContent["socialProof"]

export function SocialProofBar({
  content = homePageDefaults.socialProof,
}: {
  content?: SocialProofContent
}) {
  if (content.stats.length === 0) {
    return null
  }
  const gridColsClass =
    content.stats.length === 1
      ? "grid-cols-1"
      : content.stats.length === 2
        ? "grid-cols-2"
        : content.stats.length === 3
          ? "grid-cols-1 md:grid-cols-3"
          : "grid-cols-2 md:grid-cols-4"

  return (
    <section className="bg-background">
      <div className={`mx-auto grid max-w-7xl gap-y-10 divide-border px-6 py-16 md:divide-x lg:px-10 ${gridColsClass}`}>
        {content.stats.map((stat, index) => (
          <div
            key={`${stat.label}-${index}`}
            className="animate-on-scroll flex flex-col items-start gap-2 px-0 md:px-8 first:md:pl-0 last:md:pr-0"
          >
            <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="font-serif text-4xl font-light leading-none text-foreground md:text-5xl">
              {stat.value}
            </p>
            <p className="text-sm font-light text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
