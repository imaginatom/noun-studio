// One-off seed script for the architecture page site_content rows.
// Usage: node scripts/seed-architecture.mjs
import fs from "node:fs"
import path from "node:path"
import { createClient } from "@supabase/supabase-js"

const envPath = path.resolve(process.cwd(), ".env.local")
if (fs.existsSync(envPath)) {
  const raw = fs.readFileSync(envPath, "utf8")
  for (const line of raw.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i)
    if (!match) continue
    const [, key, valueRaw] = match
    if (process.env[key]) continue
    let value = valueRaw
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1)
    process.env[key] = value
  }
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceRole) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local")
  process.exit(1)
}

const supabase = createClient(url, serviceRole, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const rows = [
  {
    section: "hero",
    sort_order: 0,
    content: {
      title: "Architecture & Gestion de Projet",
      subtitle:
        "Du diagnostic à la livraison, un accompagnement complet pour vos projets architecturaux en Algérie et en France.",
      breadcrumbHomeLabel: "Accueil",
      breadcrumbCurrentLabel: "Architecture",
      backgroundImage: {
        src: "/images/paysagiste-hero.jpg",
        alt: "Plans architecturaux et maquettes chez Noun Studio",
        path: null,
      },
    },
  },
  {
    section: "philosophy",
    sort_order: 1,
    content: {
      label: "Philosophy",
      titleLines: ["UNE ARCHITECTURE", "PENSÉE AVEC", "INTENTION"],
      paragraphs: [
        "Nous concevons des espaces contemporains où lumière, matière et fonction dialoguent avec équilibre et précision.",
        "Chaque projet naît d'une compréhension profonde du lieu, des usages et de l'identité de celles et ceux qui l'habitent.",
      ],
    },
  },
  {
    section: "services",
    sort_order: 2,
    content: {
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
  },
  {
    section: "process",
    sort_order: 3,
    content: {
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
  },
  {
    section: "featuredProject",
    sort_order: 4,
    content: {
      label: "PROJET SÉLECTIONNÉ",
      title: "Villa Horizon",
      body: "Une architecture minimaliste pensée autour de la lumière, des perspectives et de la relation entre intérieur et extérieur.",
      href: "/realisations",
      image: {
        src: "/images/gallery-1.jpg",
        alt: "Villa Horizon — projet architectural par Noun Studio",
        path: null,
      },
    },
  },
  {
    section: "values",
    sort_order: 5,
    content: {
      title: "NOTRE VISION",
      items: [
        "Précision architecturale",
        "Approche sur mesure",
        "Sensibilité culturelle",
        "Vision contemporaine",
        "Attention au détail",
      ],
    },
  },
  {
    section: "cta",
    sort_order: 6,
    content: {
      phrase: "Concevons un espace à la hauteur de votre vision et ambitions",
      backgroundImage: {
        src: "/architecture-cta.png",
        alt: "Projet architectural par Noun Studio",
        path: null,
      },
      primaryCtaLabel: "Discutons de votre projet",
      primaryCtaHref: "/contact",
    },
  },
  {
    section: "crossLinks",
    sort_order: 7,
    content: {
      title: "Nos autres expertises",
      cards: [
        {
          title: "Notre portfolio",
          description: "Parcourez nos projets d'architecture et de design.",
        },
      ],
    },
  },
]

const payload = rows.map((row) => ({
  page: "architecture",
  section: row.section,
  content_type: "text",
  content: row.content,
  sort_order: row.sort_order,
}))

const { data, error } = await supabase
  .from("site_content")
  .upsert(payload, { onConflict: "page,section" })
  .select("section, sort_order")

if (error) {
  console.error("Failed to seed architecture content:", error.message)
  process.exit(1)
}

console.log(`Seeded ${data?.length ?? 0} architecture section rows:`)
for (const row of data ?? []) {
  console.log(`  - ${row.sort_order}: ${row.section}`)
}
