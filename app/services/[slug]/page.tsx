import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { CheckCircle2, ClipboardList } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ContactCTA } from "@/components/home/ContactCTA";
import { serviceDetails, servicePath } from "@/data/services";
import { projects } from "@/data/projects";
import { JsonLd } from "@/components/seo/JsonLd";
import { serviceSchema } from "@/lib/schema";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return serviceDetails.map(({ id }) => ({ slug: id }));
}

async function getService(params: Props["params"]) {
  const { slug } = await params;
  const service = serviceDetails.find(({ id }) => id === slug);
  if (!service) notFound();
  return service;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await getService(params);
  return pageMetadata({
    title: `${service.title} in Kolkata`,
    description: service.intro,
    path: servicePath(service.id),
  });
}

export default async function ServicePage({ params }: Props) {
  const s = await getService(params);
  const related = projects.filter((p) => p.category === s.category).slice(0, 2);

  return (
    <>
      <JsonLd data={serviceSchema(s)} />
      <PageHero
        title={s.title}
        intro={s.intro}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services/" },
          { label: s.title, href: servicePath(s.id) },
        ]}
      />
      <section aria-labelledby="service-details" className="bg-cream py-16 sm:py-20">
        <Container>
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
            <Reveal>
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
              <h2 id="service-details" className="font-display text-3xl font-bold text-teal sm:text-4xl">What’s included</h2>
              <p className="mt-4 leading-relaxed text-ink-muted">{s.body}</p>

              <div className="mt-8 grid gap-8 sm:grid-cols-2">
                <div>
                  <h3 className="font-display text-lg font-bold text-ink">Key benefits</h3>
                  <ul className="mt-3 space-y-2.5">
                    {s.benefits.map((b) => (
                      <li key={b} className="flex gap-2.5 text-[0.95rem] leading-snug">
                        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-teal" aria-hidden="true" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-ink">Typical requirements</h3>
                  <ul className="mt-3 space-y-2.5">
                    {s.requirements.map((r) => (
                      <li key={r} className="flex gap-2.5 text-[0.95rem] leading-snug">
                        <ClipboardList className="mt-0.5 size-5 shrink-0 text-orange-deep" aria-hidden="true" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8">
                <Button href={`/contact/?type=${s.category}`} arrow>
                  Discuss your project
                </Button>
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <div className="mt-12">
              <h3 className="font-display text-lg font-bold text-ink">Related spaces</h3>
              <ul className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((p) => (
                  <li key={p.slug}>
                    <ProjectCard project={p} sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw" />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Container>
      </section>
      <ContactCTA />
    </>
  );
}
