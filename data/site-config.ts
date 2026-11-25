/**
 * Central business configuration.
 *
 * RULE: never put unverified facts here. Any field left as `null` is hidden on the live site
 * (and flagged as PLACEHOLDER in development) — see docs/PHASE-1-PLAN.md §6.
 */

export type Stat = {
  /** Verified figure, e.g. "150+". Leave null until the business confirms it. */
  value: string | null;
  label: string;
  /** Shown instead while `value` is null, so no number is ever invented. */
  fallback: { title: string; text: string };
};

export const siteConfig = {
  name: "SpaceCraft Interiors",
  legalName: null as string | null,
  tagline: "Office · Retail · Commercial · Kolkata",
  url: "https://officeinteriordesignerkolkata.com",
  defaultTitle: "Office Interior Designer Kolkata | Space Craft Interiors",
  description:
    "Transform your workspace with SpaceCraft Interiors, Kolkata. Expert office interiors, retail showrooms, shops and commercial interior design with end-to-end execution. Book a consultation today.",
  shortDescription:
    "Office, retail and commercial interior design with turnkey execution, based in Kolkata.",
  locale: "en_IN",

  contact: {
    /** E.164 format, e.g. "+919800000000" */
    phone: null as string | null,
    /** Digits only with country code, e.g. "919800000000" */
    whatsapp: null as string | null,
    email: null as string | null,
    address: {
      street: null as string | null,
      locality: "Kolkata",
      region: "West Bengal",
      postalCode: null as string | null,
      country: "IN",
    },
    /** Google Maps embed src, only once the business location is verified */
    mapEmbedUrl: null as string | null,
    hours: null as string | null,
  },

  /** Full profile URLs; empty entries are not rendered. */
  social: {
    linkedin: null as string | null,
    instagram: null as string | null,
    facebook: null as string | null,
    youtube: null as string | null,
  },

  stats: [
    { value: null, label: "Projects Completed", fallback: { title: "Every Sector", text: "Offices, retail & cafés" } },
    { value: null, label: "Years Experience", fallback: { title: "Kolkata-Based", text: "Local team, local know-how" } },
    { value: null, label: "Businesses Served", fallback: { title: "Business-First", text: "Designed around how you work" } },
    { value: "End-to-End", label: "Design & Execution", fallback: { title: "End-to-End", text: "Design & Execution" } },
  ] as Stat[],

  integrations: {
    /** e.g. "G-XXXXXXXXXX" — GA4 loads only when set */
    ga4Id: null as string | null,
    /** content value of google-site-verification meta tag (DNS verification is preferred) */
    googleSiteVerification: null as string | null,
    /** Cloudflare Turnstile public site key (secret stays server-side) */
    turnstileSiteKey: null as string | null,
    /** PHP endpoint deployed alongside the static site */
    contactEndpoint: "/api/contact.php",
  },

  features: {
    /** Show "Blog" in navigation once WordPress is live at /blog/ */
    blog: false,
  },
} as const;

export const isDev = process.env.NODE_ENV !== "production";
