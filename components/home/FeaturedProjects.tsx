"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { projects } from "@/data/projects";
import { Container } from "@/components/layout/Container";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { CategoryFilter, type FilterValue } from "@/components/projects/CategoryFilter";
import { SectionHeading } from "./SectionHeading";

const MAX_CARDS = 4;

export function FeaturedProjects() {
  const [filter, setFilter] = useState<FilterValue>("all");

  const visible =
    filter === "all"
      ? projects.filter((p) => p.featured).slice(0, MAX_CARDS)
      : projects.filter((p) => p.category === filter).slice(0, MAX_CARDS);
  const anyIllustrative = visible.some((p) => p.status === "illustrative");

  return (
    <section id="featured-projects" aria-labelledby="projects-heading" className="py-10 sm:py-14">
      <Container>
        <SectionHeading
          id="projects-heading"
          aside={<CategoryFilter value={filter} onChange={setFilter} controls="featured-project-list" />}
        >
          Transforming Spaces Across Kolkata
        </SectionHeading>

        <ul id="featured-project-list" aria-live="polite" className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((p) => (
            <li key={p.slug} className="animate-[fade-in_0.4s_ease]">
              <ProjectCard project={p} sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw" />
            </li>
          ))}
        </ul>

        {anyIllustrative && (
          <p className="mt-6 flex items-start gap-2 text-sm text-ink-muted">
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            Images marked “Illustrative” are licensed photographs showing the kinds of spaces we design. Our own project
            photography will appear here as projects are published.
          </p>
        )}
      </Container>
    </section>
  );
}
