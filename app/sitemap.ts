import type { MetadataRoute } from "next";
import { serviceDetails, servicePath } from "@/data/services";
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
  const services = serviceDetails.map(({ id }) => servicePath(id));
  return [...pages, ...services, ...verifiedProjects].map((path) => ({ url: absoluteUrl(path) }));
}
