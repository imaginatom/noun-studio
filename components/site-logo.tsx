"use client"

import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

const LOGO_SRC = "/favicon.svg"

type SiteLogoProps = {
  variant?: "default" | "light"
  size?: "sm" | "md" | "lg"
  asLink?: boolean
  className?: string
}

const logoHeightClass = {
  sm: "max-h-9",
  md: "max-h-12",
  lg: "max-h-16",
} as const

function LogoMark({
  variant,
  size,
}: {
  variant: "default" | "light"
  size: "sm" | "md" | "lg"
}) {
  const isLight = variant === "light"

  return (
    <Image
      src={LOGO_SRC}
      alt="Noun Studio"
      width={367}
      height={264}
      className={cn(
        "h-auto w-auto",
        logoHeightClass[size],
        isLight && "brightness-0 invert",
      )}
      priority={size === "md"}
    />
  )
}

export function SiteLogo({
  variant = "default",
  size = "md",
  asLink = true,
  className,
}: SiteLogoProps) {
  const content = <LogoMark variant={variant} size={size} />

  if (!asLink) {
    return <span className={cn("inline-flex items-center", className)}>{content}</span>
  }

  return (
    <Link
      href="/"
      aria-label="Noun Studio — Accueil"
      className={cn("inline-flex items-center transition-opacity hover:opacity-70", className)}
    >
      {content}
    </Link>
  )
}
