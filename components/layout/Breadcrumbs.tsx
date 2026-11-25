import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export type Crumb = { label: string; href: string };

/** Visible breadcrumb trail; the last item is the current page. Emits matching BreadcrumbList JSON-LD. */
export function Breadcrumbs({ items, tone = "light" }: { items: Crumb[]; tone?: "light" | "dark" }) {
  const link = tone === "light" ? "text-teal-muted hover:text-yellow" : "text-ink-muted hover:text-orange-deep";
  const current = tone === "light" ? "text-white" : "text-ink";
  return (
    <nav aria-label="Breadcrumb">
      <JsonLd data={breadcrumbSchema(items)} />
      <ol className="flex flex-wrap items-center gap-1 text-sm">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={c.href} className="flex items-center gap-1">
              {last ? (
                <span aria-current="page" className={`font-medium ${current}`}>
                  {c.label}
                </span>
              ) : (
                <>
                  <Link href={c.href} className={link}>
                    {c.label}
                  </Link>
                  <ChevronRight className={`size-3.5 ${tone === "light" ? "text-teal-muted" : "text-ink-muted"}`} aria-hidden="true" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
