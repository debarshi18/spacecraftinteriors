# SpaceCraft Interiors — Phase 1 Implementation Plan

Status: **Phase 1 (inspect & plan) complete — awaiting go-ahead for Phase 2.**
Date: 2026-10-30

---

## 1. Reference analysis

| Area | What the reference does | How we'll treat it |
|---|---|---|
| Header | Cream bar, building-icon wordmark + "OFFICE · RETAIL · COMMERCIAL · KOLKATA" tagline, orange pill CTA | Keep. Nav reduced to the brief's 5 items (reference also shows *Process* and *Blog* — Process becomes a homepage anchor, Blog is hidden behind a config flag until WordPress is live). |
| Hero | Teal left panel with curved bottom edge, 3-line bold heading ("that Work" in yellow), 4 icon tiles, orange CTA + "Watch Our Work"; photo right; mascot overlaps the seam pointing at the photo; handwritten "Great Spaces Happen Here!" note | Keep composition. Curved edge = inline SVG. Handwritten notes become a recurring brand device (script font). On mobile: heading → CTA → mascot+photo stacked card → icon tiles as a 2×2 grid. |
| Trust bar | 4 stats on a white strip overlapping the hero edge | Keep layout, **but no numbers are invented** — see §6. |
| Services | 4 photo cards, title, 2-line copy, circular arrow | Keep; whole card is one link, arrow animates on hover/focus. |
| Projects | Pill filters (All/Offices/Retail/Restaurants/Commercial), 4 photo cards with name, location, sq ft | Keep; the reference's "IT Office – Salt Lake, 6,000 sq ft" style data is exactly what we must **not** fabricate. |
| Process | 4 numbered yellow badges, mascot in 4 poses, chevrons between | Keep; chevrons become an animated dashed connector line (static under reduced motion). |
| CTA band | Beige rounded panel, mascot at drawing table, orange "Get in Touch", phone/email | Keep; contact lines render only if configured. |
| Footer | Deep teal, 4 columns + social icons + copyright bar | Keep. |

**Type:** reference uses a bold geometric sans for headings and a handwritten script for annotations.
Plan: **Outfit** (headings, 600/700/800), **Inter** (body, 400/500/600), **Caveat** (annotations, 600 only) — self-hosted via `next/font` with `display: swap` and subsetting. Three families, five weights total.

**Shape language:** 16px radius cards, 999px pill buttons/filters, 24–32px radius large panels, soft warm shadows (no glassmorphism, no gradients except the hero photo scrim).

---

## 2. Colour system & a contrast problem in the brief

Tokens live once, in `app/globals.css` as Tailwind v4 `@theme` variables (`--color-teal`, `--color-orange`, …) — every component uses the token, never a hex.

I checked the specified palette against WCAG AA. Most pairs pass; three don't:

| Pair | Ratio | Verdict |
|---|---|---|
| White on Deep Teal `#0F4C43` | 9.8 : 1 | ✅ |
| Warm Yellow on Deep Teal | 6.4 : 1 | ✅ |
| **White text on Orange `#FF6A00`** (every CTA in the reference) | **2.9 : 1** | ❌ fails even the 3 : 1 large-text rule |
| **Orange text/links on Cream** | ~2.8 : 1 | ❌ |
| **Grey `#6B7280` text on Light Beige `#F2E8D9`** | 4.0 : 1 | ❌ for body text (needs 4.5) |
| Charcoal `#1F2937` on Orange | 5.1 : 1 | ✅ |

**✅ Decision (2026-10-30): deeper orange buttons.**
- `--color-orange-deep: #C44600` — button fills and orange text links on cream/white. White on it ≈ 5.0 : 1, it on Cream ≈ 4.75 : 1. Hover/pressed: `#A93C00`.
- `#FF6A00` remains the brand orange for icons, highlights, underlines, badges, focus glows and illustration — never as a fill behind white text or as small text.
- On Light Beige panels, links use Charcoal/Teal with an orange underline (orange-deep on beige is only ~4.1 : 1).
- Ratios to be re-verified with a script in Phase 2.

Original options considered:
- Add one derived token `--color-orange-deep: #C2410C`-range shade (final value tuned to ≥4.5 : 1 with white) used for **button fills and orange text links**. `#FF6A00` stays the brand orange for icons, underlines, highlights, hover glows, badges and illustration.
- Alternative: keep `#FF6A00` buttons but switch button text to Charcoal (fully compliant, but looks less like the reference).
- Secondary text on beige uses a slightly darker grey token (`--color-ink-muted-strong`) rather than `#6B7280`.

---

## 3. Architecture

**Stack:** Next.js (latest stable, App Router) + TypeScript + React + Tailwind CSS v4 + Lucide React.
**Output:** `output: "export"`, `trailingSlash: true` → produces `/about/index.html` etc., matching the required `/about/` URLs. Plain static files on Hostinger — no Node process needed.

Deliberately **not** added: Motion for React (CSS transitions + one IntersectionObserver `Reveal` component cover every listed interaction; we add Motion only if the portfolio filter animation genuinely needs it), CMS, state libraries, UI kits.

### Contact form on a static site
Static export has no API routes, so:

- **`/api/contact.php`** on Hostinger (shared plans run PHP natively). It validates server-side, applies spam checks, and sends via **Hostinger SMTP** (business mailbox) using vendored PHPMailer.
- Secrets (SMTP password, Turnstile secret) live in a PHP config file **outside `public_html`** — nothing secret ever reaches the browser bundle.
- Spam protection: honeypot field + minimum fill-time check + per-IP rate limit + **Cloudflare Turnstile** (free, privacy-friendly; site key is public by design, secret is server-side).
- Client: progressive form with inline validation, accessible error summary, loading state, real success/failure messages. In `next dev` the endpoint is mocked so the UI can be tested locally; real delivery is tested on Hostinger.
- Fallback if you'd rather not run PHP: Web3Forms/Formspree. I recommend PHP — no third party holding enquiries, no monthly limits.

### Images
`next/image` optimisation is unavailable in static export, so a small **build-time `sharp` script** generates AVIF + WebP at 480/768/1200/1920 widths with fixed dimensions; a `<ResponsiveImage>` component emits `<picture>` + `srcset` + `width/height` (zero CLS). Hero image is `fetchpriority="high"` and preloaded; everything below the fold is `loading="lazy"`.

### Folder structure
```
app/
  layout.tsx            fonts, Header/Footer, Organization JSON-LD, GA4 (only if ID set)
  page.tsx              Home
  about/page.tsx
  services/page.tsx
  projects/page.tsx
  projects/[slug]/page.tsx   generateStaticParams from data/projects.ts
  contact/page.tsx
  not-found.tsx         custom 404 (Hostinger ErrorDocument)
  sitemap.ts  robots.ts
  globals.css           tokens, base typography, reduced-motion rules
components/
  layout/   Header, MobileNav, Footer, Breadcrumbs, Container, Section
  ui/       Button (CTA variants), IconTile, Badge, FilterPills, ResponsiveImage, Reveal
  home/     Hero, TrustBar, ServicesGrid, FeaturedProjects, ProcessSection, ContactCTA
  mascot/   Mascot.tsx (pose prop) + pose SVG parts
  projects/ ProjectCard, ProjectGallery (filters), BeforeAfterSlider, ProjectDetail
  services/ ServiceSection
  contact/  ContactForm, WorkspaceBuilder ("Build Your Workspace")
  seo/      JsonLd
data/
  site-config.ts   business details, social, analytics IDs, feature flags (blog, whatsapp)
  navigation.ts  services.ts  projects.ts  process.ts
lib/
  seo.ts (buildMetadata per page)  schema.ts (JSON-LD builders)  validation.ts
public/
  images/{hero,services,projects,about}/   images/mascot/   icons/   og/
  api/contact.php   .htaccess
scripts/
  optimize-images.mjs
docs/
  PHASE-1-PLAN.md  DEPLOYMENT-HOSTINGER.md  CONTENT-CHECKLIST.md
```

---

## 4. Mascot plan (highest-risk asset)

I can't paint raster illustrations, and the brief forbids temporary external image URLs. Plan:

1. **I build an original vector mascot as a modular SVG rig**: one shared head/face, helmet, torso, shirt, utility belt and boots; poses are composed from swappable arm/prop layers. This *guarantees* identical proportions and colours across every pose, weighs a few KB, and allows subtle CSS animation (blink, wave, bob) with reduced-motion fallbacks.
2. **Distinctiveness from existing characters:** teal-rimmed yellow helmet with an "SC" building monogram, pencil tucked behind the ear, light-blue shirt with rolled sleeves and a teal collar, measuring-tape on the belt, a set-square in the pocket. No overalls, no checked shirt, no cap, no moustache — avoids Bob the Builder / Mario cues.
3. **Six poses:** pointing (hero) · holding blueprint (Design step, About) · thinking with tablet (Understand step) · thumbs-up with drill (Execute step) · celebrating (Handover step, form success) · at drawing table (CTA band).
4. `<Mascot pose="…" />` is the only API. If you later commission a painted version (closer to the reference's rendered style), drop transparent WebPs into `public/images/mascot/` and flip one config switch — no layout changes.

Honest expectation: the vector rig will be clean, flat-shaded cartoon style — professional and consistent, but not as richly rendered as the reference image. If that rendered look is essential, a commissioned illustrator or a curated AI-generated set should replace it before launch.

---

## 5. Pages, SEO & keyword map

| URL | H1 | Title | Primary target |
|---|---|---|---|
| `/` | Workspaces that Work Better. | Office Interior Designer Kolkata \| Space Craft Interiors | office interior designer Kolkata |
| `/about/` | Designing Better Spaces for Better Businesses. | About SpaceCraft Interiors \| Commercial Interior Design Company in Kolkata | brand + commercial interior design company Kolkata |
| `/services/` | Commercial Interior Design Solutions for Every Business. | Commercial Interior Design Services in Kolkata \| SpaceCraft Interiors | commercial interior design Kolkata (+ 7 service sections, each with an `id` anchor and its own H2) |
| `/projects/` | Spaces We've Designed. Businesses We've Helped. | Office & Commercial Interior Projects in Kolkata \| SpaceCraft Interiors | office interior projects Kolkata |
| `/projects/[slug]/` | Project name | per project | long-tail, **only for genuine projects** |
| `/contact/` | Let's Discuss Your Next Project. | Contact an Office Interior Designer in Kolkata \| SpaceCraft Interiors | consultation intent |

Every page via `buildMetadata()`: unique title + description, absolute canonical (`https://officeinteriordesignerkolkata.com/…/`), OG/Twitter tags, OG image (1200×630, built from mascot + brand), robots directives.

**Structured data** (only visible, verified facts): `Organization` + `WebSite` sitewide; `GeneralContractor` (a `LocalBusiness` subtype — schema.org has no "interior designer" type; this fits turnkey execution) on Home/Contact, emitting address/phone/geo **only when set** in config; `BreadcrumbList` on inner pages; `Service` items on /services/. No ratings, no reviews.

**Other:** `sitemap.xml` (generated, excludes demo/noindex pages), `robots.txt` referencing both the main sitemap and the future WordPress sitemap, semantic landmarks, single H1 per page, breadcrumbs on inner pages, descriptive filenames (`open-plan-office-workstations-kolkata.webp`) and alt text, Search Console meta-tag slot + GA4 slot in config (rendered only when filled).

---

## 6. Honesty rules for missing information

- **Trust bar:** each stat in `site-config.ts` is `{ value: null | "150+", label }`. In development, unset values render a visible orange `PLACEHOLDER` tag. In production, unset stats fall back to a qualitative line ("Offices · Retail · F&B", "Design → Build → Handover") so the live site never shows a fake or empty number.
- **Contact details / socials / WhatsApp / map:** components render only when a value is configured. The reference's +91 98765 43210 is not used.
- **Projects:** each entry has `status: "verified" | "illustrative"`. Illustrative entries show an "Illustrative concept" badge, have no client name/address/area, are `noindex`, and are excluded from the sitemap and JSON-LD. Adding a real project = adding one object to `data/projects.ts`.
- **Before/after slider:** built and tested, but shown publicly only on projects with a genuine before/after pair (two unrelated stock photos would misrepresent the work).
- **About page:** history, founder and credentials sections are config-driven slots, hidden until filled.
- **"Watch Our Work"** — there's no video, so the button scrolls to Featured Projects; label becomes "See Our Work" unless a video is supplied.

---

## 7. Interactions

Sticky header (shrinks on scroll) · active-page indicator · keyboard-accessible Services dropdown and mobile drawer (focus trap, Esc to close) · CTA hover (arrow nudge + lift) · `Reveal` scroll animations · mascot idle micro-animations · portfolio filters (URL-synced `?category=` so filtered views are shareable) · before/after slider (pointer + keyboard + ARIA slider role) · contact form validation · WhatsApp link (when number set) · **Build Your Workspace**: 3 quick choices (space type → size band → style) that show matching projects and pre-fill the contact form's project type/area — no game, ~3 KB of JS. All motion disabled under `prefers-reduced-motion`.

---

## 8. Hostinger & /blog/

- `npm run build` → `out/` → upload to `public_html/` (File Manager or Git deploy).
- `.htaccess`: force HTTPS, redirect `www` → apex (preferred domain is `officeinteriordesignerkolkata.com`), `ErrorDocument 404`, long cache headers for hashed assets, short for HTML, gzip/brotli where available. **All rewrite rules exclude `^blog/`.**
- `/blog/` is reserved: no Next.js route uses it; WordPress later installs into `public_html/blog/` with its own sitemap/SEO plugin. A blog theme brief (tokens, fonts, header/footer markup) will be included so it matches. Nav "Blog" link appears when `features.blog = true`.
- Deployment doc covers SSL, DNS, SMTP mailbox, Turnstile keys, Search Console (DNS verification preferred), GA4, post-deploy checklist (routes, form, sitemap, robots, canonicals, mobile, Chrome/Edge/Safari).

---

## 9. Assets needed

| Asset | Count | Source plan |
|---|---|---|
| Mascot poses | 6 | Built by me as SVG (§4) |
| Hero office photo | 1 (≥2000px) | Your photo, else licensed stock (Unsplash/Pexels licence permits commercial use) |
| Service photos | 4 cards + 7 sections (overlap allowed) | Same |
| Project photos | 3–5 per project | **Yours** for real projects; stock only for clearly-badged illustrative entries |
| About page photos | 3–4 | Same |
| OG image, favicon | 1 + set | Built by me from brand + mascot |

Stock photos would be downloaded once and stored locally under `public/images/`; I'll ask before downloading.

---

## 10. Missing business information (placeholders until supplied)

Phone · WhatsApp number · email (is `info@officeinteriordesignerkolkata.com` an existing mailbox?) · office address & map location · business hours · social profile URLs · years in business · project count · client count · founder/team details · any real project photos and descriptions · before/after photo pairs · Hostinger plan type (shared/Business/Cloud — affects nothing for static, but confirms PHP + SMTP) · GA4 ID · Search Console verification · Turnstile keys.

None of these block development.

---

## 11. Blocker on this machine

**Node.js is not installed** (`node`/`npm` not found). Phase 2 needs Node.js 22 LTS (or newer LTS) from nodejs.org or `winget install OpenJS.NodeJS.LTS`. Please install it and restart the app/terminal so it's on PATH.

---

## 12. Phase sequence

1. ✅ Inspect & plan (this document)
2. Foundation — tokens, fonts, Button/Container/Section, Header + mobile nav, Footer, mascot rig
3. Homepage — all sections, compared against the reference screenshot in the browser at desktop and mobile widths
4. About, Services, Projects (+ detail template), Contact
5. Interactions — filters, slider, form + PHP endpoint, Workspace Builder
6. SEO — metadata, JSON-LD, sitemap/robots, validation
7. Performance & accessibility — Lighthouse, axe, keyboard pass, overflow checks at 360/390/768/1280px
8. Deployment pack — `.htaccess`, PHP config template, `DEPLOYMENT-HOSTINGER.md`, production build verification
