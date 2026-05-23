export type ArchitecturePageContent = {
  hero: {
    title: string
    subtitle: string
    breadcrumbHomeLabel: string
    breadcrumbCurrentLabel: string
    backgroundImage: {
      src: string
      alt: string
      path?: string | null
    }
  }
  philosophy: {
    label: string
    titleLines: string[]
    paragraphs: string[]
  }
  services: {
    label: string
    items: Array<{
      title: string
      description: string
    }>
  }
  process: {
    title: string
    steps: Array<{
      step: string
      title: string
      description: string
    }>
  }
  featuredProject: {
    label: string
    title: string
    body: string
    href: string
    image: {
      src: string
      alt: string
      path?: string | null
    }
  }
  values: {
    title: string
    items: string[]
  }
  cta: {
    phrase: string
    backgroundImage: {
      src: string
      alt: string
      path?: string | null
    }
    primaryCtaLabel: string
    primaryCtaHref: string
  }
  crossLinks: {
    title: string
    cards: Array<{
      title: string
      description: string
    }>
  }
}

export type ArchitecturePageSectionKey = keyof ArchitecturePageContent

export const architectureSectionOrder: ArchitecturePageSectionKey[] = [
  "hero",
  "philosophy",
  "services",
  "process",
  "featuredProject",
  "values",
  "cta",
  "crossLinks",
]

export const architecturePageDefaults: ArchitecturePageContent = {
  hero: {
    title: "Architecture & Gestion de Projet",
    subtitle:
      "Du diagnostic à la livraison, un accompagnement complet pour vos projets architecturaux en Algérie et en France.",
    breadcrumbHomeLabel: "Accueil",
    breadcrumbCurrentLabel: "Architecture",
    backgroundImage: {
      src: "/images/paysagiste-hero.jpg",
      alt: "Plans architecturaux et maquettes chez Noun Studio",
    },
  },
  philosophy: {
    label: "Philosophy",
    titleLines: ["UNE ARCHITECTURE", "PENSÉE AVEC", "INTENTION"],
    paragraphs: [
      "Nous concevons des espaces contemporains où lumière, matière et fonction dialoguent avec équilibre et précision.",
      "Chaque projet naît d'une compréhension profonde du lieu, des usages et de l'identité de celles et ceux qui l'habitent.",
    ],
  },
  services: {
    label: "NOS EXPERTISES",
    items: [
      {
        title: "Architecture résidentielle",
        description:
          "Conception de villas, maisons privées et espaces résidentiels pensés autour du confort, de la fluidité et de l'élégance contemporaine.",
      },
      {
        title: "Architecture commerciale",
        description:
          "Création d'espaces professionnels, restaurants, boutiques et bureaux valorisant votre activité à travers une approche architecturale cohérente.",
      },
      {
        title: "Architecture d'intérieur",
        description:
          "Des intérieurs où volumes, matières et lumière composent des espaces raffinés, fonctionnels et intemporels.",
      },
      {
        title: "Rénovation & réhabilitation",
        description:
          "Transformation d'espaces existants avec une vision contemporaine respectueuse de l'identité et du caractère du lieu.",
      },
    ],
  },
  process: {
    title: "NOTRE APPROCHE",
    steps: [
      {
        step: "01",
        title: "Découverte",
        description:
          "Comprendre votre vision, les contraintes du projet et les usages du lieu.",
      },
      {
        step: "02",
        title: "Concept",
        description:
          "Développer une direction architecturale forte, cohérente et adaptée à votre identité.",
      },
      {
        step: "03",
        title: "Développement",
        description:
          "Affiner les espaces, matériaux et détails pour donner forme au projet.",
      },
      {
        step: "04",
        title: "Réalisation",
        description:
          "Accompagner la concrétisation du projet avec précision et exigence.",
      },
    ],
  },
  featuredProject: {
    label: "PROJET SÉLECTIONNÉ",
    title: "Villa Horizon",
    body: "Une architecture minimaliste pensée autour de la lumière, des perspectives et de la relation entre intérieur et extérieur.",
    href: "/realisations",
    image: {
      src: "/images/gallery-1.jpg",
      alt: "Villa Horizon — projet architectural par Noun Studio",
    },
  },
  values: {
    title: "NOTRE VISION",
    items: [
      "Précision architecturale",
      "Approche sur mesure",
      "Sensibilité culturelle",
      "Vision contemporaine",
      "Attention au détail",
    ],
  },
  cta: {
    phrase: "Concevons un espace à la hauteur de votre vision et ambitions",
    backgroundImage: {
      src: "/architecture-cta.png",
      alt: "Projet architectural par Noun Studio",
    },
    primaryCtaLabel: "Discutons de votre projet",
    primaryCtaHref: "/contact",
  },
  crossLinks: {
    title: "Nos autres expertises",
    cards: [
      {
        title: "Notre portfolio",
        description: "Parcourez nos projets d'architecture et de design.",
      },
    ],
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

const mergePhilosophy = (
  fallback: ArchitecturePageContent["philosophy"],
  value: unknown,
  legacyIntro?: unknown,
): ArchitecturePageContent["philosophy"] => {
  const source = isRecord(value) ? value : isRecord(legacyIntro) ? legacyIntro : undefined
  if (!source) {
    return fallback
  }
  const legacyTitle = typeof source.title === "string" ? source.title : undefined
  const legacyBody = typeof source.body === "string" ? source.body : undefined
  const merged = mergeObject(fallback, source)
  return {
    ...merged,
    titleLines: mergeStringArray(
      fallback.titleLines,
      source.titleLines ?? (legacyTitle ? legacyTitle.split("\n").map((line) => line.trim()).filter(Boolean) : undefined),
    ),
    paragraphs: mergeStringArray(
      fallback.paragraphs,
      source.paragraphs ??
        (legacyBody
          ? legacyBody.split(/\n\n+/).map((p) => p.trim()).filter(Boolean)
          : undefined),
    ),
  }
}

const mergeServiceList = (
  fallback: ArchitecturePageContent["services"]["items"],
  value: unknown,
): ArchitecturePageContent["services"]["items"] => {
  if (!Array.isArray(value)) {
    return fallback
  }
  const template = fallback[0]
  return value.flatMap((entry, index) => {
    if (!isRecord(entry)) {
      return []
    }
    const item = fallback[index] ?? template
    return {
      title: typeof entry.title === "string" ? entry.title : item.title,
      description: typeof entry.description === "string" ? entry.description : item.description,
    }
  })
}

const mergeStepList = (
  fallback: ArchitecturePageContent["process"]["steps"],
  value: unknown,
): ArchitecturePageContent["process"]["steps"] => {
  if (!Array.isArray(value)) {
    return fallback
  }
  const template = fallback[0]
  return value.flatMap((entry, index) => {
    if (!isRecord(entry)) {
      return []
    }
    const item = fallback[index] ?? template
    return {
      ...item,
      ...(entry as Partial<typeof item>),
    }
  })
}

const mergeCardList = (
  fallback: ArchitecturePageContent["crossLinks"]["cards"],
  value: unknown,
): ArchitecturePageContent["crossLinks"]["cards"] => {
  if (!Array.isArray(value)) {
    return fallback
  }
  const template = fallback[0]
  return value.flatMap((entry, index) => {
    if (!isRecord(entry)) {
      return []
    }
    const item = fallback[index] ?? template
    return {
      ...item,
      ...(entry as Partial<typeof item>),
    }
  })
}

export const mergeArchitectureContent = (
  entries: SiteContentEntry[] = [],
): ArchitecturePageContent => {
  const contentBySection = new Map(entries.map((entry) => [entry.section, entry.content]))

  const heroOverride = contentBySection.get("hero")
  const philosophyOverride = contentBySection.get("philosophy")
  const introOverride = contentBySection.get("intro")
  const servicesOverride = contentBySection.get("services")
  const processOverride = contentBySection.get("process")
  const featuredOverride = contentBySection.get("featuredProject")
  const valuesOverride = contentBySection.get("values")
  const ctaOverride = contentBySection.get("cta")
  const crossLinksOverride = contentBySection.get("crossLinks")

  const servicesMerged = mergeObject(architecturePageDefaults.services, servicesOverride)
  const legacyServicesTitle =
    isRecord(servicesOverride) && typeof servicesOverride.title === "string"
      ? servicesOverride.title
      : undefined

  return {
    hero: {
      ...mergeObject(architecturePageDefaults.hero, heroOverride),
      backgroundImage: mergeObject(
        architecturePageDefaults.hero.backgroundImage,
        isRecord(heroOverride) ? heroOverride.backgroundImage : undefined,
      ),
    },
    philosophy: mergePhilosophy(
      architecturePageDefaults.philosophy,
      philosophyOverride,
      introOverride,
    ),
    services: {
      label: servicesMerged.label || legacyServicesTitle || architecturePageDefaults.services.label,
      items: mergeServiceList(
        architecturePageDefaults.services.items,
        isRecord(servicesOverride) ? servicesOverride.items : undefined,
      ),
    },
    process: {
      ...mergeObject(architecturePageDefaults.process, processOverride),
      steps: mergeStepList(
        architecturePageDefaults.process.steps,
        isRecord(processOverride) ? processOverride.steps : undefined,
      ),
    },
    featuredProject: {
      ...mergeObject(architecturePageDefaults.featuredProject, featuredOverride),
      image: mergeObject(
        architecturePageDefaults.featuredProject.image,
        isRecord(featuredOverride) ? featuredOverride.image : undefined,
      ),
    },
    values: {
      ...mergeObject(architecturePageDefaults.values, valuesOverride),
      items: mergeStringArray(
        architecturePageDefaults.values.items,
        isRecord(valuesOverride) ? valuesOverride.items : undefined,
      ),
    },
    cta: (() => {
      const merged = mergeObject(architecturePageDefaults.cta, ctaOverride)
      const legacyPhrase =
        isRecord(ctaOverride) && typeof ctaOverride.title === "string"
          ? ctaOverride.title
          : undefined
      return {
        ...merged,
        phrase: merged.phrase || legacyPhrase || architecturePageDefaults.cta.phrase,
        backgroundImage: mergeObject(
          architecturePageDefaults.cta.backgroundImage,
          isRecord(ctaOverride) ? ctaOverride.backgroundImage : undefined,
        ),
      }
    })(),
    crossLinks: {
      ...mergeObject(architecturePageDefaults.crossLinks, crossLinksOverride),
      cards: mergeCardList(
        architecturePageDefaults.crossLinks.cards,
        isRecord(crossLinksOverride) ? crossLinksOverride.cards : undefined,
      ),
    },
  }
}
