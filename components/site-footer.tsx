import Link from "next/link"
import { Instagram, Linkedin } from "lucide-react"
import { SiteLogo } from "@/components/site-logo"

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/architecture", label: "Architecture" },
  { href: "/realisations", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
]

export function SiteFooter() {
  return (
    <footer role="contentinfo" className="border-t border-border bg-background text-foreground">
      
      <div className="section-padding mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <SiteLogo size="lg" />
            <p className="mt-8 max-w-sm text-sm font-light leading-relaxed text-muted-foreground">
              Cabinet d&apos;architecture et studio de design multidisciplinaire. Architecture, identité visuelle et contenu culturel entre l&apos;Algérie et la France.
            </p>
            <div className="mt-10">
              <a
                href="mailto:contact@nounstudio.dz"
                className="font-serif text-2xl font-light text-foreground transition-opacity hover:opacity-70 md:text-3xl"
              >
                contact@nounstudio.dz
              </a>
              <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                Oran · Algérie
              </p>
            </div>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Navigation
            </p>
            <nav aria-label="Navigation du pied de page" className="mt-6">
              <ul className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-block text-sm font-light text-foreground transition-opacity hover:opacity-60"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-8 flex items-center gap-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center border border-border text-foreground transition-colors hover:bg-foreground hover:text-background"
              >
                <Instagram className="h-4 w-4" strokeWidth={1.5} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center border border-border text-foreground transition-colors hover:bg-foreground hover:text-background"
              >
                <Linkedin className="h-4 w-4" strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground md:flex-row lg:px-10">
          <p>© {new Date().getFullYear()} Noun Studio · Tous droits réservés</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="transition-colors hover:text-foreground">
              Mentions légales
            </Link>
            <Link href="#" className="transition-colors hover:text-foreground">
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
