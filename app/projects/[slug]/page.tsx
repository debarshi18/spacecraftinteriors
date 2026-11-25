import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2, Layers } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { BeforeAfterSlider } from "@/components/projects/BeforeAfterSlider";
import { ContactCTA } from "@/components/home/ContactCTA";
import { categoryLabel, getProject, projects } from "@/data/projects";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  const illustrative = project.status === "illustrative";
  const description = `${project.summary} ${project.overview}`;
  return pageMetadata({
    title: illustrative ? `${project.title} — ${categoryLabel[project.category]} Interior Concept` : project.title,
    // Cut at a word boundary to stay within the ~160 characters search results show.
    description: description.length > 160 ? description.slice(0, 157).replace(/\s+\S*$/, "") + "…" : description,
    path: `/projects/${project.slug}/`,
    // Illustrative entries use stock photography, so keep them out of search results.
    noindex: illustrative,
  });
}

export default async function ProjectPage({ params }: Props) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  const illustrative = project.status === "illustrative";
  const related = projects.filter((p) => p.category === project.category && p.slug !== project.slug).slice(0, 3);
  const facts = [
    { label: "Category", value: categoryLabel[project.category] },
    project.location && { label: "Location", value: project.location },
    project.areaSqFt && { label: "Area", value: `${project.areaSqFt.toLocaleString("en-IN")} sq ft` },
    project.client && { label: "Client", value: project.client },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <>
      <article>
        <header className="bg-teal pt-8 pb-28 text-white sm:pb-32">
          <Container>
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Projects", href: "/projects/" },
                { label: project.title, href: `/projects/${project.slug}/` },
              ]}
            />
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-yellow px-3 py-1 text-xs font-bold text-ink">{categoryLabel[project.category]}</span>
              {illustrative && (
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/25">
                  Illustrative concept
                </span>
              )}
            </div>
            <h1 className="mt-4 max-w-3xl font-display text-4xl leading-tight font-extrabold sm:text-5xl">{project.title}</h1>
            <p className="mt-4 max-w-2xl text-lg text-white/90">{project.summary}</p>
          </Container>
        </header>

        <Container className="-mt-20 sm:-mt-24">
          <figure>
            <ResponsiveImage
              name={project.cover.name}
              alt={project.cover.alt}
              sizes="(min-width: 1280px) 1216px, 100vw"
              priority
              className="aspect-[16/9] w-full rounded-[var(--radius-panel)] object-cover shadow-[var(--shadow-card-hover)]"
            />
            {illustrative && (
              <figcaption className="mt-3 text-sm text-ink-muted">
                Illustrative image: a licensed photograph showing this type of space — not a completed SpaceCraft project.
              </figcaption>
            )}
          </figure>

          <div className="grid gap-12 py-14 lg:grid-cols-[1fr_20rem] lg:gap-16">
            <div className="space-y-10">
              <section aria-labelledby="overview-heading">
                <h2 id="overview-heading" className="heading-bar font-display text-2xl font-bold text-teal sm:text-3xl">
                  {illustrative ? "About this type of space" : "Project overview"}
                </h2>
                <p className="mt-5 text-lg leading-relaxed">{project.overview}</p>
              </section>

              {project.challenge && (
                <section aria-labelledby="challenge-heading">
                  <h2 id="challenge-heading" className="font-display text-2xl font-bold text-ink">
                    The design challenge
                  </h2>
                  <p className="mt-3 leading-relaxed text-ink-muted">{project.challenge}</p>
                </section>
              )}
              {project.solution && (
                <section aria-labelledby="solution-heading">
                  <h2 id="solution-heading" className="font-display text-2xl font-bold text-ink">
                    Our solution
                  </h2>
                  <p className="mt-3 leading-relaxed text-ink-muted">{project.solution}</p>
                </section>
              )}

              {project.considerations && (
                <section aria-labelledby="considerations-heading">
                  <h2 id="considerations-heading" className="font-display text-2xl font-bold text-ink">
                    What we plan for
                  </h2>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {project.considerations.map((c) => (
                      <li key={c} className="flex gap-2.5 rounded-xl bg-white p-4 shadow-[var(--shadow-card)]">
                        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-teal" aria-hidden="true" />
                        <span className="text-[0.95rem] leading-snug">{c}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {project.beforeAfter && (
                <section aria-labelledby="before-after-heading">
                  <h2 id="before-after-heading" className="font-display text-2xl font-bold text-ink">
                    Before &amp; after
                  </h2>
                  <div className="mt-4">
                    <BeforeAfterSlider {...project.beforeAfter} />
                  </div>
                </section>
              )}

              {project.gallery && project.gallery.length > 0 && (
                <section aria-labelledby="gallery-heading">
                  <h2 id="gallery-heading" className="font-display text-2xl font-bold text-ink">
                    Gallery
                  </h2>
                  <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                    {project.gallery.map((g) => (
                      <li key={g.name}>
                        <ResponsiveImage {...g} sizes="(min-width: 1024px) 30vw, 100vw" className="aspect-[4/3] w-full rounded-[var(--radius-card)] object-cover" />
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-[var(--radius-card)] bg-beige p-6">
                <dl className="space-y-3">
                  {facts.map((f) => (
                    <div key={f.label} className="flex justify-between gap-4 border-b border-ink/10 pb-3 last:border-0 last:pb-0">
                      <dt className="text-sm text-ink-muted-strong">{f.label}</dt>
                      <dd className="text-right font-semibold">{f.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="rounded-[var(--radius-card)] border border-line bg-white p-6">
                <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
                  <Layers className="size-5 text-orange-deep" aria-hidden="true" />
                  {illustrative ? "Typical materials" : "Materials & finishes"}
                </h2>
                <ul className="mt-3 space-y-2 text-[0.95rem] text-ink-muted">
                  {project.materials.map((m) => (
                    <li key={m} className="flex gap-2">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-yellow" aria-hidden="true" />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
              <Button href={`/contact/?type=${project.category}`} arrow className="w-full">
                Plan a space like this
              </Button>
            </aside>
          </div>

          {related.length > 0 && (
            <section aria-labelledby="related-heading" className="border-t border-line py-14">
              <h2 id="related-heading" className="heading-bar font-display text-2xl font-bold text-teal sm:text-3xl">
                More {categoryLabel[project.category].toLowerCase()} spaces
              </h2>
              <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((p) => (
                  <li key={p.slug}>
                    <ProjectCard project={p} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </Container>
      </article>

      <ContactCTA />
    </>
  );
}
