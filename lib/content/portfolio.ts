export const MAX_GALLERY_IMAGES = 8

export type GalleryImageAspect = "3/4" | "4/3" | "1/1"

export type GalleryImage = {
  src: string
  alt: string
  path?: string | null
  title?: string
  definition?: string
  aspect?: GalleryImageAspect
}

export type PortfolioProjectContent = {
  title: string
  description: string
  location: string
  category: string
  year: string
  gallery: GalleryImage[]
}

export type PortfolioPageContent = {
  hero: {
    eyebrow: string
    title: string
    subtitle: string
    breadcrumbHomeLabel: string
    breadcrumbCurrentLabel: string
  }
  gallery: {
    categories: string[]
    projects: PortfolioProjectContent[]
  }
  cta: {
    title: string
    subtitle: string
    primaryCtaLabel: string
    primaryCtaHref: string
    emailLabel: string
    emailAddress: string
  }
}

export type PortfolioPageSectionKey = keyof PortfolioPageContent

export const portfolioSectionOrder: PortfolioPageSectionKey[] = ["hero", "gallery", "cta"]

export const portfolioPageDefaults: PortfolioPageContent = {
  hero: {
    eyebrow: "Portfolio",
    title: "Nos Réalisations",
    subtitle:
      "Projets d'architecture et de design réalisés en Algérie et en France.",
    breadcrumbHomeLabel: "Accueil",
    breadcrumbCurrentLabel: "Portfolio",
  },
  gallery: {
    categories: ["Tous", "Architecture", "Intérieur", "Rénovation"],
    projects: [
      {
        title: "Villa Contemporaine",
        description:
          "Conception complète d'une villa résidentielle avec terrasse panoramique et jardin méditerranéen.",
        location: "Alger",
        category: "Architecture",
        year: "2024",
        gallery: [
          {
            src: "/images/gallery-1.jpg",
            alt: "Villa résidentielle contemporaine en Algérie par Noun Studio",
            aspect: "4/3",
          },
        ],
      },
      {
        title: "Espace de Coworking",
        description: "Aménagement et conception d'un espace de travail collaboratif.",
        location: "Oran",
        category: "Intérieur",
        year: "2024",
        gallery: [
          {
            src: "/images/gallery-2.jpg",
            alt: "Espace de coworking par Noun Studio",
            aspect: "4/3",
          },
        ],
      },
      {
        title: "Espace Commercial",
        description: "Aménagement intérieur d'un espace de coworking avec identité architecturale forte.",
        location: "Alger",
        category: "Intérieur",
        year: "2023",
        gallery: [
          {
            src: "/images/gallery-3.jpg",
            alt: "Aménagement intérieur espace commercial par Noun Studio",
            aspect: "4/3",
          },
        ],
      },
      {
        title: "Restauration Patrimoniale",
        description: "Rénovation d'un bâtiment historique avec intégration d'éléments contemporains.",
        location: "Constantine",
        category: "Rénovation",
        year: "2023",
        gallery: [
          {
            src: "/images/gallery-4.jpg",
            alt: "Rénovation patrimoine architectural algérien par Noun Studio",
            aspect: "4/3",
          },
        ],
      },
      {
        title: "Résidence Moderne",
        description:
          "Conception d'une résidence familiale aux lignes épurées avec optimisation de la lumière naturelle.",
        location: "Blida",
        category: "Architecture",
        year: "2023",
        gallery: [
          {
            src: "/images/hero-bg.jpg",
            alt: "Architecture contemporaine par Noun Studio",
            aspect: "4/3",
          },
        ],
      },
      {
        title: "Boutique Retail",
        description: "Design intérieur d'une boutique haut de gamme avec mise en scène des produits.",
        location: "Alger",
        category: "Intérieur",
        year: "2022",
        gallery: [
          {
            src: "/images/gallery-6.jpg",
            alt: "Design intérieur boutique par Noun Studio",
            aspect: "4/3",
          },
        ],
      },
      {
        title: "Restaurant — Aménagement",
        description: "Conception et décoration intérieure pour un restaurant.",
        location: "Oran",
        category: "Intérieur",
        year: "2022",
        gallery: [
          {
            src: "/images/elagage-hero.jpg",
            alt: "Aménagement restaurant par Noun Studio",
            aspect: "4/3",
          },
        ],
      },
      {
        title: "Visualisation 3D",
        description: "Rendu 3D photoréaliste d'un projet de villa avec piscine avant construction.",
        location: "Alger",
        category: "Architecture",
        year: "2022",
        gallery: [
          {
            src: "/images/gallery-5.jpg",
            alt: "Visualisation 3D villa par Noun Studio",
            aspect: "4/3",
          },
        ],
      },
      {
        title: "Cabinet Médical",
        description: "Conception et aménagement intérieur pour un cabinet médical.",
        location: "Constantine",
        category: "Intérieur",
        year: "2021",
        gallery: [
          {
            src: "/images/why-us.jpg",
            alt: "Cabinet médical par Noun Studio",
            aspect: "4/3",
          },
        ],
      },
      {
        title: "Complexe Résidentiel",
        description: "Conception architecturale d'un ensemble résidentiel de 12 logements.",
        location: "Blida",
        category: "Architecture",
        year: "2021",
        gallery: [
          {
            src: "/images/paysagiste-hero.jpg",
            alt: "Plans architecturaux par Noun Studio",
            aspect: "4/3",
          },
        ],
      },
      {
        title: "Siège Social",
        description: "Rénovation et aménagement du siège social d'une entreprise de services.",
        location: "Alger",
        category: "Rénovation",
        year: "2021",
        gallery: [
          {
            src: "/images/contact-hero.jpg",
            alt: "Aménagement bureaux par Noun Studio",
            aspect: "4/3",
          },
        ],
      },
    ],
  },
  cta: {
    title: "Votre projet est le prochain ?",
    subtitle: "Contactez-nous pour discuter de votre projet et obtenir une consultation gratuite.",
    primaryCtaLabel: "Discutons ensemble",
    primaryCtaHref: "/contact",
    emailLabel: "contact@nounstudio.dz",
    emailAddress: "contact@nounstudio.dz",
  },
}

type SiteContentEntry = {
  section: string
  content: unknown
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)

const mergeObject = <T extends Record<string, unknown>>(fallback: T, value: unknown): T => {
  if (!isRecord(value)) {
    return fallback
  }
  return {
    ...fallback,
    ...(value as Partial<T>),
  }
}

const mergeStringArray = (fallback: string[], value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return fallback
  }
  const allStrings = value.every((entry) => typeof entry === "string")
  return allStrings ? (value as string[]) : fallback
}

const VALID_ASPECTS: GalleryImageAspect[] = ["3/4", "4/3", "1/1"]

const normalizeGalleryImage = (value: unknown): GalleryImage | null => {
  if (!isRecord(value)) {
    return null
  }
  const src = typeof value.src === "string" ? value.src : ""
  const alt = typeof value.alt === "string" ? value.alt : ""
  const image: GalleryImage = { src, alt }
  if (typeof value.path === "string") image.path = value.path
  else if (value.path === null) image.path = null
  if (typeof value.title === "string") image.title = value.title
  if (typeof value.definition === "string") image.definition = value.definition
  if (VALID_ASPECTS.includes(value.aspect as GalleryImageAspect)) {
    image.aspect = value.aspect as GalleryImageAspect
  }
  return image
}

const mergeGallery = (fallback: GalleryImage[], entry: Record<string, unknown>): GalleryImage[] => {
  // New shape: a `gallery` array.
  if (Array.isArray(entry.gallery)) {
    const images = entry.gallery
      .map(normalizeGalleryImage)
      .filter((img): img is GalleryImage => img !== null)
      .slice(0, MAX_GALLERY_IMAGES)
    return images
  }
  // Backward-compat: previously saved single `image` object.
  if (isRecord(entry.image)) {
    const migrated = normalizeGalleryImage(entry.image)
    return migrated ? [migrated] : fallback
  }
  return fallback
}

const mergeProjectList = (
  fallback: PortfolioPageContent["gallery"]["projects"],
  value: unknown,
): PortfolioPageContent["gallery"]["projects"] => {
  if (!Array.isArray(value)) {
    return []
  }
  const template = fallback[0]
  return value.flatMap((entry, index) => {
    if (!isRecord(entry)) {
      return []
    }
    const item = fallback[index] ?? template
    return {
      title: typeof entry.title === "string" ? entry.title : item?.title ?? "",
      description: typeof entry.description === "string" ? entry.description : item?.description ?? "",
      location: typeof entry.location === "string" ? entry.location : item?.location ?? "",
      category: typeof entry.category === "string" ? entry.category : item?.category ?? "",
      year: typeof entry.year === "string" ? entry.year : item?.year ?? "",
      gallery: mergeGallery(item?.gallery ?? [], entry),
    }
  })
}

export const mergePortfolioContent = (
  entries: SiteContentEntry[] = [],
): PortfolioPageContent => {
  const contentBySection = new Map(entries.map((entry) => [entry.section, entry.content]))

  const heroOverride = contentBySection.get("hero")
  const galleryOverride = contentBySection.get("gallery")
  const ctaOverride = contentBySection.get("cta")

  return {
    hero: mergeObject(portfolioPageDefaults.hero, heroOverride),
    gallery: {
      ...mergeObject(portfolioPageDefaults.gallery, galleryOverride),
      categories: mergeStringArray(
        portfolioPageDefaults.gallery.categories,
        isRecord(galleryOverride) ? galleryOverride.categories : undefined,
      ),
      projects: mergeProjectList(
        portfolioPageDefaults.gallery.projects,
        isRecord(galleryOverride) ? galleryOverride.projects : undefined,
      ),
    },
    cta: mergeObject(portfolioPageDefaults.cta, ctaOverride),
  }
}
