import { servicePath } from "@/data/services";
import { ArrowDown, Building, BuildingComplex, Coffee, Store } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Mascot } from "@/components/mascot/Mascot";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { consultationCta } from "@/data/navigation";

const heroServices = [
  { label: "Office Interiors", href: servicePath("office-interiors"), Icon: Building },
  { label: "Retail Showrooms", href: servicePath("retail-shop-interiors"), Icon: Store },
  { label: "Cafés & Restaurants", href: servicePath("cafe-restaurant-interiors"), Icon: Coffee },
  { label: "Commercial Spaces", href: servicePath("commercial-renovation"), Icon: BuildingComplex },
];

const heroPhoto = {
  name: "hero-office-workstations-wood-shelving",
  alt: "Modern office with timber shelving, rows of workstations, task chairs and indoor plants",
} as const;

/** Handwritten brand annotation, as in the reference ("Great Spaces Happen Here!"). */
function ScriptNote({ className = "" }: { className?: string }) {
  return (
    <p aria-hidden="true" className={`font-script leading-[0.95] text-white drop-shadow-[0_2px_6px_rgb(0_0_0/0.45)] ${className}`}>
      Great Spaces
      <br />
      Happen Here!
      <svg viewBox="0 0 40 16" className="mt-1 ml-10 h-4 w-10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M4 4 Q20 18 36 4" />
      </svg>
    </p>
  );
}

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative overflow-hidden bg-teal text-white">
      {/* Desktop photo: right ~58%, with a curved teal edge sweeping into it */}
      <div className="absolute inset-y-0 right-0 hidden w-[58%] lg:block">
        <ResponsiveImage
          {...heroPhoto}
          priority
          // Hidden below lg: "1px" makes phones fetch only the smallest file for this copy.
          sizes="(min-width: 1024px) 58vw, 1px"
          className="h-full w-full object-cover object-[60%_center]"
        />
        <svg
          viewBox="0 0 100 400"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="absolute inset-y-0 -left-px h-full w-28 text-teal"
          fill="currentColor"
        >
          <path d="M0 0 H62 C18 120 96 250 30 400 H0 Z" />
        </svg>
      </div>

      <div className="relative mx-auto grid max-w-7xl px-4 pt-10 pb-24 sm:px-6 sm:pt-14 lg:min-h-[640px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:px-8 lg:pt-16 lg:pb-28">
        <div className="relative z-10 max-w-xl">
          <h1 id="hero-heading" className="font-display text-[2.75rem] leading-[1.02] font-extrabold sm:text-6xl lg:text-[4.25rem]">
            Workspaces
            <br />
            <span className="text-yellow">that Work</span>
            <br />
            Better.
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-white/90 sm:text-xl">
            Office, Retail and Commercial Interior Design &amp; Turnkey Execution in Kolkata.
          </p>

          {/* Service tiles — desktop/tablet sit here; mobile shows them after the photo */}
          <ul className="mt-8 hidden grid-cols-4 divide-x divide-white/15 sm:grid">
            {heroServices.map(({ label, href, Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="group flex flex-col items-center gap-2 rounded-lg px-2 py-1 text-center text-sm leading-tight text-white transition-colors hover:text-yellow"
                >
                  <Icon className="size-9 stroke-[1.5] text-yellow transition-transform group-hover:-translate-y-0.5" aria-hidden="true" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Button href={consultationCta.href} size="lg" arrow>
              {consultationCta.label}
            </Button>
            <a href="#featured-projects" className="group inline-flex items-center gap-3 font-display font-semibold text-white hover:text-yellow">
              <span className="inline-flex size-12 items-center justify-center rounded-full bg-white text-teal shadow-lg transition-transform group-hover:translate-y-0.5">
                <ArrowDown className="size-5" aria-hidden="true" />
              </span>
              <span className="leading-tight">
                See
                <br />
                Our Work
              </span>
            </a>
          </div>
        </div>

        {/* Mascot + note on desktop, positioned over the seam between text and photo */}
        <div className="pointer-events-none relative hidden lg:block">
          <ScriptNote className="absolute top-2 left-[34%] -rotate-12 text-[2rem]" />
          <Mascot pose="point" animated title="SpaceCraft builder mascot pointing at a finished office" className="absolute -bottom-14 -left-20 h-[100%] w-auto" />
        </div>

        {/* Mobile/tablet: photo card with mascot */}
        <div className="relative mt-10 lg:hidden">
          <div className="relative overflow-hidden rounded-[var(--radius-panel)] shadow-2xl ring-4 ring-white/10">
            {/* This is the LCP image on phones, so it loads eagerly too; on desktop it's hidden and fetched at minimum size. */}
            <ResponsiveImage {...heroPhoto} priority sizes="(min-width: 1024px) 1px, 100vw" className="aspect-[4/3] w-full object-cover" />
            <ScriptNote className="absolute top-4 right-4 rotate-[-8deg] text-2xl sm:text-3xl" />
          </div>
          <Mascot pose="point" animated title="SpaceCraft builder mascot pointing at a finished office" className="absolute -bottom-8 -left-3 h-[72%] max-h-72 w-auto sm:h-[78%]" />
        </div>

        <ul className="mt-14 grid grid-cols-2 gap-3 sm:hidden">
          {heroServices.map(({ label, href, Icon }) => (
            <li key={href}>
              <Link href={href} className="flex min-h-14 items-center gap-3 rounded-2xl bg-white/8 px-3 py-3 text-sm font-medium leading-tight ring-1 ring-white/15 hover:bg-white/15">
                <Icon className="size-7 shrink-0 stroke-[1.5] text-yellow" aria-hidden="true" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Cream wave into the trust bar */}
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true" className="absolute inset-x-0 -bottom-px h-12 w-full text-cream sm:h-16 lg:h-20" fill="currentColor">
        <path d="M0 80 V30 C240 70 520 76 760 48 C1000 20 1220 6 1440 26 V80 Z" />
      </svg>
    </section>
  );
}
