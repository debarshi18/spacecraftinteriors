import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site-config";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: [
      absoluteUrl("/sitemap.xml"),
      // Yoast / Rank Math default index; adjust if the blog uses a different SEO plugin.
      ...(siteConfig.features.blog ? [absoluteUrl("/blog/sitemap_index.xml")] : []),
    ],
  };
}
