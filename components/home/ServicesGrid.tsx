import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { featuredServices } from "@/data/services";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { Reveal } from "@/components/ui/Reveal";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "./SectionHeading";

export function ServicesGrid() {
  return (
    <section aria-labelledby="services-heading" className="pt-16 pb-10 sm:pt-20 lg:pt-24">
      <Container>
        <SectionHeading id="services-heading" link={{ href: "/services/", label: "View All Services" }}>
          Our Services
        </SectionHeading>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredServices.map((s, i) => (
            <Reveal as="li" key={s.id} delay={i * 80}>
              <Link
                href={`/services/#${s.id}`}
                className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-[var(--shadow-card)] transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
              >
                <div className="overflow-hidden">
                  <ResponsiveImage
                    name={s.image.name}
                    alt={s.image.alt}
                    sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"
                    className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 items-end justify-between gap-3 p-5">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-ink">{s.title}</h3>
                    <p className="mt-1 text-sm leading-snug text-ink-muted">{s.blurb}</p>
                  </div>
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-ink/80 text-ink transition-colors group-hover:border-orange-deep group-hover:bg-orange-deep group-hover:text-white">
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
