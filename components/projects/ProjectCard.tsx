import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categoryLabel, type Project } from "@/data/projects";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";

export function ProjectCard({ project, sizes }: { project: Project; sizes: string }) {
  const meta = [categoryLabel[project.category], project.location, project.areaSqFt && `${project.areaSqFt.toLocaleString("en-IN")} sq ft`]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link href={`/projects/${project.slug}/`} className="group block h-full">
      <article className="flex h-full flex-col">
        <div className="relative overflow-hidden rounded-[var(--radius-card)] shadow-[var(--shadow-card)]">
          <ResponsiveImage
            name={project.cover.name}
            alt={project.cover.alt}
            sizes={sizes}
            className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {project.status === "illustrative" && (
            <span
              className="absolute top-3 left-3 rounded-full bg-ink/80 px-2.5 py-1 text-[0.7rem] font-semibold tracking-wide text-white backdrop-blur-sm"
              title="Licensed stock image showing the type of space we design — not a completed SpaceCraft project"
            >
              Illustrative
            </span>
          )}
        </div>
        <div className="mt-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-display text-base font-semibold text-ink group-hover:text-teal">{project.title}</h3>
            {/* Strong muted tone: cards also sit on beige sections, where the lighter grey fails contrast */}
            <p className="text-sm text-ink-muted-strong">{meta}</p>
          </div>
          <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-ink/80 text-ink transition-colors group-hover:border-orange-deep group-hover:bg-orange-deep group-hover:text-white">
            <ArrowRight className="size-4" aria-hidden="true" />
          </span>
        </div>
      </article>
    </Link>
  );
}
