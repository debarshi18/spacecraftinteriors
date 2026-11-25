/**
 * Structured data (JSON-LD). RULE: only facts that are verified and visible on the site.
 * Contact details, street address and social profiles appear here automatically once they are
 * set in data/site-config.ts. No ratings, reviews, prices or founding dates are ever added.
 */
import { siteConfig } from "@/data/site-config";
import { serviceDetails } from "@/data/services";
import { absoluteUrl, defaultOgImage } from "@/lib/seo";

const orgId = absoluteUrl("/#organization");
const kolkata = { "@type": "City", name: "Kolkata" } as const;

/** Site-wide graph: the business (a GeneralContractor, i.e. LocalBusiness + Organization) and the website. */
export function siteSchema() {
  const { contact, social } = siteConfig;
  const sameAs = Object.values(social).filter(Boolean);
  const business = {
    "@type": "GeneralContractor",
    "@id": orgId,
    name: siteConfig.name,
    ...(siteConfig.legalName && { legalName: siteConfig.legalName }),
    url: absoluteUrl("/"),
    description: siteConfig.shortDescription,
    logo: absoluteUrl("/icon-512.png"),
    image: absoluteUrl(defaultOgImage.url),
    areaServed: kolkata,
    address: {
      "@type": "PostalAddress",
      ...(contact.address.street && { streetAddress: contact.address.street }),
      addressLocality: contact.address.locality,
      addressRegion: contact.address.region,
      ...(contact.address.postalCode && { postalCode: contact.address.postalCode }),
      addressCountry: contact.address.country,
    },
    ...(contact.phone && { telephone: contact.phone }),
    ...(contact.email && { email: contact.email }),
    ...(sameAs.length > 0 && { sameAs }),
    knowsAbout: serviceDetails.map((s) => s.title),
  };
  const website = {
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    url: absoluteUrl("/"),
    name: siteConfig.name,
    inLanguage: "en-IN",
    publisher: { "@id": orgId },
  };
  return { "@context": "https://schema.org", "@graph": [business, website] };
}

/** The services described on /services/, each linked to its section. */
export function servicesSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": serviceDetails.map((s) => ({
      "@type": "Service",
      "@id": absoluteUrl(`/services/#${s.id}`),
      url: absoluteUrl(`/services/#${s.id}`),
      name: s.title,
      serviceType: s.title,
      description: s.intro,
      provider: { "@id": orgId },
      areaServed: kolkata,
    })),
  };
}

export function breadcrumbSchema(items: { label: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, item: absoluteUrl(c.href) })),
  };
}
