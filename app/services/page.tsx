import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { Reveal } from "@/components/ui/Reveal";
import { ContactCTA } from "@/components/home/ContactCTA";
import { serviceDetails, servicePath } from "@/data/services";
import { JsonLd } from "@/components/seo/JsonLd";
import { servicesSchema } from "@/lib/schema";

export const metadata: Metadata = pageMetadata({
  title: "Interior Design Services in Kolkata",
  path: "/services/",
  description:
    "Office, retail, showroom, café and restaurant interior design in Kolkata, plus commercial renovation and turnkey execution — all delivered by one team.",
});

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={servicesSchema()} />
      <PageHero
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services/" },
        ]}
        title={
          <>
            Commercial Interior Design Solutions <span className="text-yellow">for Every Business.</span>
          </>
        }
        intro="From a compact retail unit to a multi-floor corporate office, we plan, design and deliver commercial interiors in Kolkata — with one team accountable from concept to handover."
        pose="thumbsUp"
        note="We've got it covered!"
      >
        <nav aria-label="Services on this page">
          <ul className="flex flex-wrap gap-2">
            {serviceDetails.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="inline-flex min-h-10 items-center rounded-full bg-white/10 px-4 text-sm font-medium text-white ring-1 ring-white/20 transition-colors hover:bg-yellow hover:text-ink"
                >
                  {s.short}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>

      {serviceDetails.map((s, i) => {
        const flip = i % 2 === 1;
        return (
          <section
            key={s.id}
            id={s.id}
            aria-labelledby={`${s.id}-heading`}
            className={`scroll-mt-24 py-16 sm:py-20 ${i % 2 === 1 ? "bg-beige" : "bg-cream"}`}
          >
            <Container>
              <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
                <Reveal className={flip ? "lg:order-2" : ""}>
                  <div className="relative">
                    <ResponsiveImage
                      name={s.image.name}
                      alt={s.image.alt}
                      sizes="(min-width: 1024px) 45vw, 100vw"
                      className="aspect-[4/3] w-full rounded-[var(--radius-panel)] object-cover shadow-[var(--shadow-card-hover)]"
                    />
                    <span className="absolute bottom-3 left-3 rounded-full bg-ink/80 px-2.5 py-1 text-[0.7rem] font-semibold text-white">
                      Illustrative image
                    </span>
                  </div>
                </Reveal>

                <div>
                  <p className={`font-display text-sm font-bold tracking-widest uppercase ${flip ? "text-orange-deeper" : "text-orange-deep"}`}>
                    Service {String(i + 1).padStart(2, "0")}
                  </p>
                  <h2 id={`${s.id}-heading`} className="mt-2 font-display text-3xl font-bold text-teal sm:text-4xl">
                    {s.title}
                  </h2>
                  <p className="mt-4 text-lg font-medium text-ink">{s.intro}</p>

                  <div className="mt-8">
                    <Button href={servicePath(s.id)} arrow>
                      Explore {s.title.toLowerCase()}
                    </Button>
                  </div>
                </div>
              </div>
            </Container>
          </section>
        );
      })}

      <div className="pt-16">
        <ContactCTA />
      </div>
    </>
  );
}
