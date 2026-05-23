insert into public.site_content (page, section, content_type, content, sort_order)
select
  'home',
  'hero',
  'text',
  '{
    "badgeText": "Architecture · Contenu culturel",
    "title": "Architecture, Design & Identité Culturelle",
    "subtitle": "Noun Studio est un cabinet d''architecture et studio de design multidisciplinaire fondé par SAHNOUNE Mohammed. Nous concevons des espaces, des marques et des histoires.",
    "trustBullets": [
      "Architecte agréé",
      "Plus de 70 identités visuelles livrées",
      "Projets en Algérie et en France",
      "Accompagnement du diagnostic à la livraison"
    ],
    "primaryCtaLabel": "Découvrir nos services",
    "secondaryCtaLabel": "Portfolio"
  }'::jsonb,
  0
where not exists (
  select 1 from public.site_content where page = 'home' and section = 'hero'
);

insert into public.site_content (page, section, content_type, content, sort_order)
select
  'home',
  'socialProof',
  'text',
  '{
    "stats": [
      { "value": "Architecte", "label": "agréée" },
      { "value": "70+", "label": "identités visuelles" },
      { "value": "2", "label": "pays d''activité" },
      { "value": "3", "label": "experts en studio" }
    ]
  }'::jsonb,
  1
where not exists (
  select 1 from public.site_content where page = 'home' and section = 'socialProof'
);

insert into public.site_content (page, section, content_type, content, sort_order)
select
  'home',
  'services',
  'text',
  '{
    "eyebrow": "Nos expertises",
    "title": "Un studio multidisciplinaire au service de vos projets",
    "items": [
      {
        "title": "Architecture",
        "description": "Conception et suivi de projets architecturaux résidentiels, commerciaux et de rénovation. Du diagnostic à la livraison."
      },
      {
        "title": "Contenu Culturel",
        "description": "Production de contenu autour de l''architecture, du patrimoine algérien et de la culture du design."
      }
    ]
  }'::jsonb,
  2
where not exists (
  select 1 from public.site_content where page = 'home' and section = 'services'
);

insert into public.site_content (page, section, content_type, content, sort_order)
select
  'home',
  'whyUs',
  'text',
  '{
    "eyebrow": "Notre approche",
    "title": "Pourquoi choisir Noun Studio ?",
    "floatingBadge": { "value": "70+", "label": "clients satisfaits" },
    "benefits": [
      {
        "title": "Expertise technique",
        "description": "Architecte agréé avec une maîtrise complète du cycle projet."
      },
      {
        "title": "Sensibilité culturelle",
        "description": "Chaque projet intègre une dimension identitaire et patrimoniale."
      },
      {
        "title": "Vision stratégique",
        "description": "L''architecture comme outil d''expression et de mise en valeur des lieux."
      },
      {
        "title": "Écoute & sur-mesure",
        "description": "Des solutions personnalisées selon vos besoins et votre contexte."
      },
      {
        "title": "Approche intégrée",
        "description": "Architecture, design et contenu dans une seule démarche cohérente."
      }
    ],
    "ctaLabel": "Discutons de votre projet"
  }'::jsonb,
  3
where not exists (
  select 1 from public.site_content where page = 'home' and section = 'whyUs'
);

insert into public.site_content (page, section, content_type, content, sort_order)
select
  'home',
  'testimonials',
  'text',
  '{
    "eyebrow": "Témoignages",
    "title": "Ce que disent nos clients",
    "items": [
      {
        "stars": 5,
        "text": "Noun Studio a conçu notre villa avec une sensibilité remarquable. Le projet respecte notre identité tout en apportant une modernité élégante. Un travail d''architecte exceptionnel.",
        "name": "Karim B.",
        "city": "Alger"
      },
      {
        "stars": 5,
        "text": "L''identité visuelle créée pour notre startup est parfaite. Le logo, la charte graphique et les supports de communication sont cohérents et professionnels. Un vrai partenaire stratégique.",
        "name": "Amina H.",
        "city": "Oran"
      },
      {
        "stars": 5,
        "text": "La rénovation de notre espace commercial a complètement transformé notre image. Mohammed et son équipe comprennent parfaitement la relation entre architecture et identité de marque.",
        "name": "Yacine M.",
        "city": "Constantine"
      },
      {
        "stars": 5,
        "text": "Nous avons fait appel à Noun Studio pour le branding complet de notre restaurant. Du nom à la décoration intérieure, tout est pensé avec cohérence. Résultat impeccable.",
        "name": "Sara T.",
        "city": "Alger"
      },
      {
        "stars": 5,
        "text": "Le suivi de chantier par Noun Studio est rigoureux et transparent. Chaque étape est documentée, les délais respectés et la qualité irréprochable. Je recommande vivement.",
        "name": "Djamel F.",
        "city": "Blida"
      }
    ]
  }'::jsonb,
  4
where not exists (
  select 1 from public.site_content where page = 'home' and section = 'testimonials'
);

insert into public.site_content (page, section, content_type, content, sort_order)
select
  'home',
  'gallery',
  'text',
  '{
    "eyebrow": "Portfolio",
    "title": "Nos réalisations",
    "subtitle": "Des projets qui témoignent de notre savoir-faire",
    "ctaLabel": "Voir tout le portfolio"
  }'::jsonb,
  5
where not exists (
  select 1 from public.site_content where page = 'home' and section = 'gallery'
);

insert into public.site_content (page, section, content_type, content, sort_order)
select
  'home',
  'localSeo',
  'text',
  '{
    "eyebrow": "Présence locale",
    "title": "Basé à Oran, Algérie",
    "body": "Noun Studio est implanté à Oran et intervient à travers l''Algérie. Notre positionnement combine l''expertise technique en architecture avec le développement d''identités visuelles et la création de contenu culturel lié au patrimoine architectural algérien.",
    "highlights": [
      {
        "title": "Architecture à Oran",
        "description": "Résidentiel, commercial et rénovation à Oran. Des projets ancrés dans le patrimoine local avec une vision contemporaine."
      },
      {
        "title": "Contenu culturel",
        "description": "Production de contenu autour de l''architecture algérienne, du patrimoine et de la culture du design."
      }
    ]
  }'::jsonb,
  6
where not exists (
  select 1 from public.site_content where page = 'home' and section = 'localSeo'
);

insert into public.site_content (page, section, content_type, content, sort_order)
select
  'home',
  'contactCta',
  'text',
  '{
    "title": "Parlons de votre projet",
    "subtitle": "Consultation gratuite — réponse garantie sous 48h",
    "emailLabel": "Email",
    "emailAddress": "contact@nounstudio.dz"
  }'::jsonb,
  7
where not exists (
  select 1 from public.site_content where page = 'home' and section = 'contactCta'
);

-- Architecture page content
insert into public.site_content (page, section, content_type, content, sort_order)
select
  'architecture',
  'hero',
  'text',
  '{
    "title": "Architecture & Gestion de Projet",
    "subtitle": "Du diagnostic à la livraison, un accompagnement complet pour vos projets architecturaux en Algérie et en France.",
    "breadcrumbHomeLabel": "Accueil",
    "breadcrumbCurrentLabel": "Architecture",
    "backgroundImage": {
      "src": "/images/paysagiste-hero.jpg",
      "alt": "Plans architecturaux et maquettes chez Noun Studio",
      "path": null
    }
  }'::jsonb,
  0
where not exists (
  select 1 from public.site_content where page = 'architecture' and section = 'hero'
);

insert into public.site_content (page, section, content_type, content, sort_order)
select
  'architecture',
  'philosophy',
  'text',
  '{
    "label": "Philosophy",
    "titleLines": ["UNE ARCHITECTURE", "PENSÉE AVEC", "INTENTION"],
    "paragraphs": [
      "Nous concevons des espaces contemporains où lumière, matière et fonction dialoguent avec équilibre et précision.",
      "Chaque projet naît d''une compréhension profonde du lieu, des usages et de l''identité de celles et ceux qui l''habitent."
    ]
  }'::jsonb,
  1
where not exists (
  select 1 from public.site_content where page = 'architecture' and section = 'philosophy'
);

insert into public.site_content (page, section, content_type, content, sort_order)
select
  'architecture',
  'services',
  'text',
  '{
    "label": "NOS EXPERTISES",
    "items": [
      {
        "title": "Architecture résidentielle",
        "description": "Conception de villas, maisons privées et espaces résidentiels pensés autour du confort, de la fluidité et de l''élégance contemporaine."
      },
      {
        "title": "Architecture commerciale",
        "description": "Création d''espaces professionnels, restaurants, boutiques et bureaux valorisant votre activité à travers une approche architecturale cohérente."
      },
      {
        "title": "Architecture d''intérieur",
        "description": "Des intérieurs où volumes, matières et lumière composent des espaces raffinés, fonctionnels et intemporels."
      },
      {
        "title": "Rénovation & réhabilitation",
        "description": "Transformation d''espaces existants avec une vision contemporaine respectueuse de l''identité et du caractère du lieu."
      }
    ]
  }'::jsonb,
  2
where not exists (
  select 1 from public.site_content where page = 'architecture' and section = 'services'
);

insert into public.site_content (page, section, content_type, content, sort_order)
select
  'architecture',
  'process',
  'text',
  '{
    "title": "NOTRE APPROCHE",
    "steps": [
      {
        "step": "01",
        "title": "Découverte",
        "description": "Comprendre votre vision, les contraintes du projet et les usages du lieu."
      },
      {
        "step": "02",
        "title": "Concept",
        "description": "Développer une direction architecturale forte, cohérente et adaptée à votre identité."
      },
      {
        "step": "03",
        "title": "Développement",
        "description": "Affiner les espaces, matériaux et détails pour donner forme au projet."
      },
      {
        "step": "04",
        "title": "Réalisation",
        "description": "Accompagner la concrétisation du projet avec précision et exigence."
      }
    ]
  }'::jsonb,
  3
where not exists (
  select 1 from public.site_content where page = 'architecture' and section = 'process'
);

insert into public.site_content (page, section, content_type, content, sort_order)
select
  'architecture',
  'featuredProject',
  'text',
  '{
    "label": "PROJET SÉLECTIONNÉ",
    "title": "Villa Horizon",
    "body": "Une architecture minimaliste pensée autour de la lumière, des perspectives et de la relation entre intérieur et extérieur.",
    "href": "/realisations",
    "image": {
      "src": "/images/gallery-1.jpg",
      "alt": "Villa Horizon — projet architectural par Noun Studio",
      "path": null
    }
  }'::jsonb,
  4
where not exists (
  select 1 from public.site_content where page = 'architecture' and section = 'featuredProject'
);

insert into public.site_content (page, section, content_type, content, sort_order)
select
  'architecture',
  'values',
  'text',
  '{
    "title": "NOTRE VISION",
    "items": [
      "Précision architecturale",
      "Approche sur mesure",
      "Sensibilité culturelle",
      "Vision contemporaine",
      "Attention au détail"
    ]
  }'::jsonb,
  5
where not exists (
  select 1 from public.site_content where page = 'architecture' and section = 'values'
);

insert into public.site_content (page, section, content_type, content, sort_order)
select
  'architecture',
  'cta',
  'text',
  '{
    "phrase": "Concevons un espace à la hauteur de votre vision et ambitions",
    "backgroundImage": {
      "src": "/architecture-cta.png",
      "alt": "Projet architectural par Noun Studio",
      "path": null
    },
    "primaryCtaLabel": "Discutons de votre projet",
    "primaryCtaHref": "/contact"
  }'::jsonb,
  6
where not exists (
  select 1 from public.site_content where page = 'architecture' and section = 'cta'
);

insert into public.site_content (page, section, content_type, content, sort_order)
select
  'architecture',
  'crossLinks',
  'text',
  '{
    "title": "Nos autres expertises",
    "cards": [
      {
        "title": "Notre portfolio",
        "description": "Parcourez nos projets d''architecture et de design."
      }
    ]
  }'::jsonb,
  7
where not exists (
  select 1 from public.site_content where page = 'architecture' and section = 'crossLinks'
);
