"use client";

import { useEffect, useState } from "react";
import { projectCategories, projects, type ProjectCategory } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";
import { CategoryFilter, type FilterValue } from "./CategoryFilter";

const validIds = new Set(projectCategories.map((c) => c.id));

/**
 * Full portfolio grid with category filters. The active filter is mirrored in ?category=
 * so filtered views can be shared and the back button behaves. (Read from window rather than
 * useSearchParams so the page stays fully static.)
 */
export function ProjectGallery() {
  const [filter, setFilter] = useState<FilterValue>("all");

  useEffect(() => {
    const sync = () => {
      const c = new URLSearchParams(window.location.search).get("category");
      setFilter(c && validIds.has(c as FilterValue) ? (c as FilterValue) : "all");
    };
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  const change = (v: FilterValue) => {
    setFilter(v);
    const url = new URL(window.location.href);
    if (v === "all") url.searchParams.delete("category");
    else url.searchParams.set("category", v);
    window.history.pushState(null, "", url);
  };

  const visible = filter === "all" ? projects : projects.filter((p) => p.category === (filter as ProjectCategory));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <CategoryFilter value={filter} onChange={change} controls="project-gallery" />
        <p className="text-sm text-ink-muted" aria-live="polite">
          Showing {visible.length} {visible.length === 1 ? "space" : "spaces"}
        </p>
      </div>
      <ul id="project-gallery" className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => (
          <li key={p.slug} className="animate-[fade-in_0.4s_ease]">
            <ProjectCard project={p} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" />
          </li>
        ))}
      </ul>
    </div>
  );
}
