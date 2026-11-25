import { featuredServices } from "./services";
import { siteConfig } from "./site-config";

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
};

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about/" },
  {
    label: "Services",
    href: "/services/",
    children: featuredServices.map((s) => ({
      label: s.title,
      href: `/services/#${s.id}`,
      description: s.blurb,
    })),
  },
  { label: "Projects", href: "/projects/" },
  // WordPress lives at /blog/ (outside Next.js). Use a plain <a>, not next/link, for this item.
  ...(siteConfig.features.blog ? [{ label: "Blog", href: "/blog/" }] : []),
  { label: "Contact", href: "/contact/" },
];

export const consultationCta = {
  label: "Get a Free Consultation",
  href: "/contact/",
} as const;

export const footerQuickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about/" },
  { label: "Services", href: "/services/" },
  { label: "Projects", href: "/projects/" },
  { label: "Contact", href: "/contact/" },
];
