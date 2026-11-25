import type { PhotoName } from "./images.generated";

/**
 * Portfolio entries. Layouts read from here — adding a project means adding one object.
 *
 * HONESTY RULE: `status: "illustrative"` entries use licensed stock photography to show the
 * kind of space we design. They carry no client, location or area, display an
 * "Illustrative" badge, and are excluded from the sitemap and structured data.
 * Only `status: "verified"` entries may describe real, completed SpaceCraft work.
 */

export type ProjectCategory = "office" | "retail" | "restaurant" | "commercial";

export const projectCategories: { id: ProjectCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "office", label: "Offices" },
  { id: "retail", label: "Retail" },
  { id: "restaurant", label: "Restaurants" },
  { id: "commercial", label: "Commercial" },
];

export const categoryLabel: Record<ProjectCategory, string> = {
  office: "Office",
  retail: "Retail",
  restaurant: "Café & Restaurant",
  commercial: "Commercial",
};

type Photo = { name: PhotoName; alt: string };

/** Design directions offered by the Workspace Builder; projects are tagged with the ones they show. */
export type DesignStyle = "minimal" | "warm" | "bold" | "industrial";

export type Project = {
  slug: string;
  status: "verified" | "illustrative";
  title: string;
  category: ProjectCategory;
  styles?: DesignStyle[];
  /** One line for cards */
  summary: string;
  /** Verified projects only */
  location?: string;
  areaSqFt?: number;
  client?: string;
  cover: Photo;
  featured?: boolean;
  /** Intro paragraph. For illustrative entries this describes the type of space, not a client job. */
  overview: string;
  /** Verified projects: the brief's main design challenge and how it was solved. */
  challenge?: string;
  solution?: string;
  /** Illustrative entries: what this type of space typically needs. */
  considerations?: string[];
  materials: string[];
  gallery?: Photo[];
  /** Only for genuine before/after photo pairs of the same space. */
  beforeAfter?: { before: Photo; after: Photo };
};

export const projects: Project[] = [
  {
    slug: "glass-walled-meeting-suite",
    styles: ["minimal"],
    status: "illustrative",
    title: "Glass-Walled Meeting Suite",
    category: "office",
    summary: "Acoustic glass boardroom that keeps teams connected to the floor.",
    cover: {
      name: "project-glass-meeting-room",
      alt: "Boardroom enclosed by floor-to-ceiling glass partitions with a long table and grey chairs",
    },
    featured: true,
    overview:
      "A meeting suite enclosed in glass keeps conversations private while letting daylight and visibility flow across the floor — a common request for growing teams that want openness without noise.",
    considerations: [
      "Acoustic performance — laminated glass, sealed frames and soft finishes",
      "AV and video-conferencing planned into the table and wall",
      "Manifestation graphics on glazing for safety and privacy",
      "Lighting that works for both presentations and video calls",
    ],
    materials: ["Laminated acoustic glass", "Slim aluminium partition frames", "Carpet tile for sound absorption", "Engineered timber table top"],
  },
  {
    slug: "loft-style-open-office",
    styles: ["industrial"],
    status: "illustrative",
    title: "Loft-Style Open Office",
    category: "office",
    summary: "Exposed services, daylight and a shared table for team huddles.",
    cover: {
      name: "project-loft-office-open-plan",
      alt: "Open office with full-height windows, an exposed concrete ceiling and a shared work table",
    },
    overview:
      "An open, loft-style floor with exposed services suits creative and tech teams who value daylight, flexibility and an informal feel.",
    considerations: [
      "Zoning an open floor into focus, collaboration and social areas",
      "Managing acoustics where ceilings are exposed",
      "Painting and routing services so they look intentional",
      "Flexible furniture that can be reconfigured as teams change",
    ],
    materials: ["Polished concrete or vinyl plank flooring", "Exposed, painted service ducts", "Linear pendant lighting", "Steel and timber furniture"],
  },
  {
    slug: "bright-lifestyle-store",
    styles: ["minimal", "bold"],
    status: "illustrative",
    title: "Bright Lifestyle Store",
    category: "retail",
    summary: "Island displays and clear sightlines that guide shoppers through.",
    cover: {
      name: "project-bright-retail-display",
      alt: "Bright retail store with white island display tables and wall shelving",
    },
    featured: true,
    overview:
      "A bright, island-led store layout gives shoppers clear sightlines and invites them to browse — ideal for lifestyle, gifting and accessories retail.",
    considerations: [
      "Customer flow from entrance to best-sellers to billing",
      "Island displays at a comfortable reach height",
      "Even, high-colour-rendering lighting",
      "Flexible fixtures for seasonal changes",
    ],
    materials: ["Laminate and solid-surface display islands", "Light timber or vinyl plank flooring", "Track lighting with high-CRI LEDs", "Slatwall and adjustable shelving"],
  },
  {
    slug: "premium-display-showroom",
    styles: ["bold"],
    status: "illustrative",
    title: "Premium Display Showroom",
    category: "retail",
    summary: "Glass counters and statement lighting for high-value products.",
    cover: {
      name: "project-retail-display-pendant-lights",
      alt: "Showroom with illuminated glass display counters beneath clusters of globe pendant lights",
    },
    overview:
      "Glass counters, controlled lighting and generous circulation help premium products feel special and give sales staff space to consult.",
    considerations: [
      "Secure, well-lit display counters",
      "Feature lighting that creates focus without glare",
      "Comfortable consultation seating",
      "Concealed storage for stock",
    ],
    materials: ["Toughened glass display counters", "Decorative pendant lighting clusters", "Stone or quartz counter tops", "Concealed LED profile lighting"],
  },
  {
    slug: "warm-neighbourhood-cafe",
    styles: ["warm"],
    status: "illustrative",
    title: "Warm Neighbourhood Café",
    category: "restaurant",
    summary: "Layered seating zones and warm lighting for long, easy visits.",
    cover: {
      name: "project-cafe-lounge-seating",
      alt: "Café with dark timber tables, upholstered chairs and banquette seating in warm light",
    },
    featured: true,
    overview:
      "Layered seating — banquettes, two-tops and lounge chairs — lets a café serve quick visits and long conversations in the same room.",
    considerations: [
      "Mixed seating types to suit different visits",
      "Warm, dimmable lighting scenes",
      "Acoustic softening so conversation stays comfortable",
      "Clear service route from counter to tables",
    ],
    materials: ["Upholstered banquettes", "Dark-stained timber tables", "Warm-white dimmable lighting", "Acoustic panels and soft furnishings"],
  },
  {
    slug: "timber-slat-restaurant",
    styles: ["warm", "industrial"],
    status: "illustrative",
    title: "Timber-Slat Restaurant",
    category: "restaurant",
    summary: "Booth seating framed by vertical timber slats and soft lighting.",
    cover: {
      name: "project-restaurant-wood-slat-booths",
      alt: "Restaurant booths with round wooden tables in front of a vertical timber slat wall",
    },
    overview:
      "Vertical timber slats add warmth and rhythm to a dining room while helping with acoustics and screening service areas.",
    considerations: [
      "Booth seating that maximises covers",
      "Timber slat screening for privacy and acoustics",
      "Lighting focused on tables, not circulation",
      "Hard-wearing finishes that clean easily",
    ],
    materials: ["Timber or timber-look slat cladding", "Round solid-wood tables", "Leather or leatherette upholstery", "Pendant and concealed cove lighting"],
  },
  {
    slug: "grand-reception-lobby",
    styles: ["bold", "minimal"],
    status: "illustrative",
    title: "Grand Reception Lobby",
    category: "commercial",
    summary: "A reception that sets the tone before the first meeting.",
    cover: {
      name: "project-lobby-reception-marble",
      alt: "Double-height lobby with a marble reception desk, feature lighting and lounge seating",
    },
    featured: true,
    overview:
      "A reception lobby sets expectations before the first meeting — double-height volume, feature lighting and a strong reception desk create an immediate impression.",
    considerations: [
      "A reception desk that anchors the space",
      "Feature lighting and ceiling design",
      "Comfortable waiting area with clear sightlines",
      "Durable flooring for heavy footfall",
    ],
    materials: ["Marble or engineered stone", "Metal and glass feature screens", "Statement lighting installation", "Porcelain or stone flooring"],
  },
  {
    slug: "breakout-lounge",
    styles: ["warm"],
    status: "illustrative",
    title: "Breakout Lounge",
    category: "commercial",
    summary: "Soft seating and glass partitions for informal meetings.",
    cover: {
      name: "project-office-lounge-glass-partitions",
      alt: "Lounge area with armchairs and a round rug beside glass-partitioned meeting rooms",
    },
    overview:
      "A breakout lounge beside glass meeting rooms gives teams a relaxed place for informal catch-ups, calls and a change of scene.",
    considerations: [
      "Soft seating in small clusters",
      "Glass partitions that keep the lounge connected",
      "Warm lighting distinct from workstations",
      "Power and data within easy reach",
    ],
    materials: ["Upholstered lounge chairs", "Area rugs for zoning and acoustics", "Glass partition systems", "Timber-look ceiling or wall accents"],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
