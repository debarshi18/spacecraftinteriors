"use client";

import { projectCategories, type ProjectCategory } from "@/data/projects";

export type FilterValue = ProjectCategory | "all";

/** Pill-style filter buttons (reference: All / Offices / Retail / Restaurants / Commercial). */
export function CategoryFilter({
  value,
  onChange,
  controls,
}: {
  value: FilterValue;
  onChange: (v: FilterValue) => void;
  /** id of the list being filtered */
  controls: string;
}) {
  return (
    <div role="group" aria-label="Filter projects by category" className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <ul className="flex w-max gap-2">
        {projectCategories.map((c) => (
          <li key={c.id}>
            <button
              type="button"
              aria-pressed={value === c.id}
              aria-controls={controls}
              onClick={() => onChange(c.id)}
              className="min-h-10 rounded-full border border-line bg-white px-4 text-sm font-medium text-ink transition-colors hover:border-teal hover:text-teal aria-pressed:border-teal aria-pressed:bg-teal aria-pressed:text-white"
            >
              {c.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
