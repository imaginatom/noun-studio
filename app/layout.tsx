import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Cormorant_Garamond } from "next/font/google"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { FloatingCTA } from "@/components/floating-cta"
import { BackToTop } from "@/components/back-to-top"
import { ScrollAnimations } from "@/components/scroll-animations"
import { SmoothScroll } from "@/components/smooth-scroll"
import { MagneticScroll } from "@/components/motion"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://noun-studio.com"),
  title: {
    default: "Noun Studio | Cabinet d'architecture \u00e0 Oran",
    template: "%s | Noun Studio",
  },
  description:
    "Noun Studio, cabinet d'architecture et studio de design \u00e0 Oran, Alg\u00e9rie. Architecture r\u00e9sidentielle et commerciale et contenu culturel.",
  keywords: [
    "architecte Oran",
    "cabinet d'architecture Oran",
    "architecture Oran",
    "studio design Oran",
    "Noun Studio",
    "Alg\u00e9rie",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_DZ",
    url: "/",
    siteName: "Noun Studio",
    title: "Noun Studio — Architecture & Design",
    description:
      "Cabinet d'architecture et studio de design \u00e0 Oran, Alg\u00e9rie. Architecture et contenu culturel.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Noun Studio \u00e0 Oran, Alg\u00e9rie",
      },
    ],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  twitter: {
    card: "summary_large_image",
    title: "Noun Studio | Cabinet d'architecture \u00e0 Oran",
    description:
      "Cabinet d'architecture et studio de design \u00e0 Oran, Alg\u00e9rie. Architecture et contenu culturel.",
    images: ["/images/og-image.jpg"],
  }
}

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Architect",
  name: "Noun Studio",
  image: "https://noun-studio.com/images/og-image.jpg",
  email: "contact@nounstudio.dz",
  founder: {
    "@type": "Person",
    name: "SAHNOUNE Mohammed",
    jobTitle: "Architecte & Directeur Cr\u00e9atif",
  },
  url: "https://noun-studio.com",
  description:
    "Cabinet d'architecture et studio de design \u00e0 Oran, Alg\u00e9rie. Architecture et contenu culturel.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Oran",
    addressRegion: "Oran",
    addressCountry: "DZ",
  },
  areaServed: ["Oran", "Alg\u00e9rie"],
  priceRange: "$$",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr-DZ" className={`${inter.variable} ${cormorant.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">
        <SmoothScroll />
        <MagneticScroll />
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
        <FloatingCTA />
        <BackToTop />
        <ScrollAnimations />
      </body>
    </html>
  )
}
