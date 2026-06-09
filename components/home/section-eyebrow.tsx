import { cn } from "@/lib/utils"

type SectionEyebrowProps = {
  children: React.ReactNode
  className?: string
  tone?: "light" | "dark"
}

export function SectionEyebrow({
  children,
  className,
  tone = "light",
}: SectionEyebrowProps) {
  const isDark = tone === "dark"

  return (
    <p
      className={cn(
        isDark
          ? "text-[11px] font-medium uppercase tracking-[0.32em] text-background/65"
          : "eyebrow",
        className,
      )}
    >
      [{children}]
    </p>
  )
}
