/**
 * Service content. Layout components read from here; edit copy without touching JSX.
 * Each detail `id` is the anchor on /services/ (e.g. /services/#office-interiors), so a section
 * can later graduate to its own landing page without changing links elsewhere.
 */

import type { PhotoName } from "./images.generated";
import type { ProjectCategory } from "./projects";

export type ServiceDetail = {
  id: string;
  title: string;
  /** Short line for chips and menus */
  short: string;
  intro: string;
  body: string;
  benefits: string[];
  requirements: string[];
  /** Portfolio category used for "related projects" and the contact form's project type */
  category: ProjectCategory;
  image: { name: PhotoName; alt: string };
};

export const serviceDetails: ServiceDetail[] = [
  {
    id: "office-interiors",
    title: "Office Interior Design",
    short: "Offices",
    intro: "Workspaces planned around how your team actually works — not around a catalogue.",
    body:
      "We start with headcount, growth plans, meeting habits and the way information moves through your business, then turn that into a layout that balances focus areas, collaboration zones and support spaces. Furniture, lighting, acoustics and storage are specified together so the office works as one system on day one.",
    benefits: [
      "Space planning that makes every square foot earn its place",
      "Ergonomic workstations, task lighting and comfortable acoustics",
      "Room to grow without a full refit",
      "A look and feel that reflects your brand",
    ],
    requirements: [
      "New office set-up or relocation",
      "Workstation, cabin and meeting-room planning",
      "Breakout, pantry and reception areas",
      "IT, electrical and HVAC coordination",
    ],
    category: "office",
    image: {
      name: "service-open-plan-office",
      alt: "Open-plan office with rows of workstations, task chairs and natural light",
    },
  },
  {
    id: "corporate-office-interiors",
    title: "Corporate Office Interiors",
    short: "Corporate",
    intro: "Professional, polished environments for established teams and client-facing offices.",
    body:
      "Corporate interiors need to impress visitors while staying practical for hundreds of daily users. We design receptions, boardrooms, leadership cabins and large open floors with durable finishes, clear wayfinding and consistent brand detailing — and plan execution in phases where the business has to keep running.",
    benefits: [
      "First impressions that match your reputation",
      "Boardrooms and meeting suites with AV integration planned in",
      "Durable, easy-to-maintain material palettes",
      "Phased execution to minimise downtime",
    ],
    requirements: [
      "Reception and visitor experience",
      "Boardrooms, conference and training rooms",
      "Leadership cabins and private offices",
      "Multi-department floor plates",
    ],
    category: "office",
    image: {
      name: "project-glass-meeting-room",
      alt: "Boardroom enclosed by floor-to-ceiling glass partitions with a long table and grey chairs",
    },
  },
  {
    id: "retail-shop-interiors",
    title: "Retail Shop Interiors",
    short: "Retail shops",
    intro: "Shops designed to draw people in, guide them through and help them buy.",
    body:
      "Good retail design is about footfall and conversion. We plan the storefront, customer journey, display fixtures, lighting and billing area around your product range and the way your customers shop — making the most of compact high-street units as well as larger stores.",
    benefits: [
      "Storefronts and window displays that stop passers-by",
      "Customer flow planned around your best-selling products",
      "Flexible fixtures that adapt to seasons and stock",
      "Lighting that shows products at their best",
    ],
    requirements: [
      "New store fit-out or brand refresh",
      "Display fixtures, shelving and counters",
      "Trial rooms, billing and storage",
      "Signage and facade coordination",
    ],
    category: "retail",
    image: {
      name: "service-retail-boutique-wood-slats",
      alt: "Boutique with vertical timber slats, clothing rails and a feature display",
    },
  },
  {
    id: "showroom-interiors",
    title: "Showroom Interior Design",
    short: "Showrooms",
    intro: "Showrooms that let high-value products take centre stage.",
    body:
      "Whether it's furniture, lighting, tiles, electronics or jewellery, a showroom has to present products clearly and give sales conversations room to happen. We design display zones, feature lighting, consultation areas and back-of-house storage as one coherent experience.",
    benefits: [
      "Product-first display planning and lighting",
      "Comfortable consultation and demo areas",
      "Secure display and storage where needed",
      "A premium experience that supports pricing",
    ],
    requirements: [
      "Brand or dealer showrooms",
      "Experience and display centres",
      "Feature walls, plinths and display systems",
      "Consultation and customer lounges",
    ],
    category: "retail",
    image: {
      name: "project-retail-display-pendant-lights",
      alt: "Showroom with illuminated glass display counters beneath clusters of globe pendant lights",
    },
  },
  {
    id: "cafe-restaurant-interiors",
    title: "Café & Restaurant Interiors",
    short: "Cafés & restaurants",
    intro: "Spaces with atmosphere — and kitchens and service routes that work.",
    body:
      "A great café or restaurant balances mood with operations. We work through seating capacity, service flow, kitchen and bar requirements, acoustics and lighting scenes, then build a look guests remember and want to share.",
    benefits: [
      "Seating layouts that balance comfort and covers",
      "Efficient kitchen, bar and service routes",
      "Lighting and acoustics for the right atmosphere",
      "Memorable, photogenic design details",
    ],
    requirements: [
      "Cafés, bakeries and dessert bars",
      "Restaurants and cloud-kitchen fronts",
      "Bars, lounges and food courts",
      "Counter, bar and back-of-house planning",
    ],
    category: "restaurant",
    image: {
      name: "service-cafe-industrial-seating",
      alt: "Café with timber tables, patterned floor tiles and pendant lighting",
    },
  },
  {
    id: "commercial-renovation",
    title: "Commercial Renovation",
    short: "Renovation",
    intro: "Give an existing space a second life without starting from scratch.",
    body:
      "Many businesses don't need a new address — they need their current space to work better. We assess what can be kept, what should change and how to sequence the work, then renovate offices, shops and commercial floors with as little disruption to your business as possible.",
    benefits: [
      "Clear assessment of what to keep and what to change",
      "Phased work to keep your business running",
      "Updated services, lighting and finishes",
      "Better use of the space you already have",
    ],
    requirements: [
      "Office and showroom makeovers",
      "Layout changes and space reallocation",
      "Ceiling, flooring, lighting and electrical upgrades",
      "Work in occupied premises",
    ],
    category: "commercial",
    image: {
      name: "project-loft-office-open-plan",
      alt: "Open office with full-height windows, an exposed concrete ceiling and a shared work table",
    },
  },
  {
    id: "turnkey-execution",
    title: "Turnkey Interior Execution",
    short: "Turnkey",
    intro: "One team from first sketch to final handover.",
    body:
      "With turnkey execution you deal with a single point of contact for design, approvals, procurement, civil and electrical work, carpentry, finishes and installation. We manage the schedule, the site and the quality checks, and hand over a ready-to-use space.",
    benefits: [
      "One accountable team and one point of contact",
      "Coordinated design, procurement and site work",
      "Defined timelines and transparent progress updates",
      "Quality checks at every stage before handover",
    ],
    requirements: [
      "End-to-end office, retail and F&B fit-outs",
      "Civil, electrical, HVAC and plumbing coordination",
      "Custom carpentry and furniture",
      "Snagging and handover documentation",
    ],
    category: "commercial",
    image: {
      name: "project-office-lounge-glass-partitions",
      alt: "Lounge area with armchairs and a round rug beside glass-partitioned meeting rooms",
    },
  },
];

export type ServiceSummary = {
  /** Anchor of the matching section on /services/ */
  id: string;
  title: string;
  /** Short line used on cards */
  blurb: string;
  image: { name: PhotoName; alt: string };
};

/** The four headline services shown on the homepage, in navigation and in the footer. */
export const featuredServices: ServiceSummary[] = [
  {
    id: "office-interiors",
    title: "Office Interiors",
    blurb: "Modern, functional and productive workspaces.",
    image: {
      name: "service-open-plan-office",
      alt: "Open-plan office with rows of workstations, task chairs and natural light",
    },
  },
  {
    id: "retail-shop-interiors",
    title: "Retail & Showrooms",
    blurb: "Engaging spaces that drive footfall.",
    image: {
      name: "service-retail-boutique-wood-slats",
      alt: "Boutique with vertical timber slats, clothing rails and a feature display",
    },
  },
  {
    id: "cafe-restaurant-interiors",
    title: "Cafés & Restaurants",
    blurb: "Inviting spaces people love to spend time in.",
    image: {
      name: "service-cafe-industrial-seating",
      alt: "Café with timber tables, patterned floor tiles and pendant lighting",
    },
  },
  {
    id: "commercial-renovation",
    title: "Commercial Spaces",
    blurb: "Tailored design for diverse business needs.",
    image: {
      name: "service-reception-lobby-wood-panelling",
      alt: "Reception lobby with wood-panelled walls, a stone reception desk and plants",
    },
  },
];
