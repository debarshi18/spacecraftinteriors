import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

/**
 * Indexable pages only. Illustrative projects are noindex and deliberately left out.
 * The WordPress blog at /blog/ publishes its own sitemap, referenced from robots.txt.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/about/", "/services/", "/projects/", "/contact/"];
  const verifiedProjects = projects.filter((p) => p.status === "verified").map((p) => `/projects/${p.slug}/`);
  return [...pages, ...verifiedProjects].map((path) => ({ url: absoluteUrl(path) }));
}
