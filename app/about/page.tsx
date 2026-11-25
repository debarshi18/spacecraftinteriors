import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { BadgeCheck, CalendarCheck, ClipboardList, Compass, Hammer, Lightbulb, MapPin, Ruler, ShieldCheck, Sparkles, UserRound, Wallet } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Container";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { Reveal } from "@/components/ui/Reveal";
import { PlaceholderTag } from "@/components/ui/Placeholder";
import { ProcessSection } from "@/components/home/ProcessSection";
import { ContactCTA } from "@/components/home/ContactCTA";
import { isDev } from "@/data/site-config";

export const metadata: Metadata = pageMetadata({
  title: "About SpaceCraft Interiors | Commercial Interior Design Kolkata",
  absoluteTitle: true,
  description:
    "SpaceCraft Interiors is a Kolkata commercial interior design company creating offices, retail stores, showrooms and cafés that work as well as they look.",
  path: "/about/",
});

const philosophy = [
  {
    Icon: Compass,
    title: "Function first",
    text: "A beautiful space that slows your team down isn't good design. Every layout starts with how your business operates day to day.",
  },
  {
    Icon: Sparkles,
    title: "Character that fits",
    text: "Your space should feel like your brand — not like a template. We build a visual identity into materials, colour and light.",
  },
  {
    Icon: ShieldCheck,
    title: "Built to last",
    text: "Commercial interiors work hard. We specify finishes and details that stand up to daily use and stay easy to maintain.",
  },
];

const spaceTypes = [
  { title: "Offices", text: "Focus and collaboration in balance, room to grow, and comfort for long working days." },
  { title: "Retail & showrooms", text: "Storefronts that attract, layouts that guide, and lighting that sells." },
  { title: "Cafés & restaurants", text: "Atmosphere guests remember, with service routes and kitchens that keep up." },
  { title: "Commercial spaces", text: "Receptions, lounges and shared floors that make a confident first impression." },
];

const approach = [
  { Icon: ClipboardList, title: "Brief", text: "We listen first: your goals, team, customers, budget and timeline." },
  { Icon: Ruler, title: "Plan", text: "Measured layouts that test furniture, circulation and services before anything is built." },
  { Icon: Lightbulb, title: "Visualise", text: "Mood boards, material palettes and 3D views so you can see the space before committing." },
  { Icon: Hammer, title: "Deliver", text: "Detailed drawings and a coordinated site team turn the design into reality." },
];

const reasons = [
  { Icon: UserRound, title: "One point of contact", text: "Design, procurement and site work are coordinated by one team." },
  { Icon: BadgeCheck, title: "Business-first design", text: "Decisions are tested against how your space needs to perform." },
  { Icon: Wallet, title: "Clear estimates", text: "Itemised proposals so you understand where your budget goes." },
  { Icon: CalendarCheck, title: "Realistic timelines", text: "Schedules planned around approvals, lead times and your operations." },
  { Icon: ShieldCheck, title: "Quality checks", text: "Inspections at each stage, with snagging completed before handover." },
  { Icon: MapPin, title: "Based in Kolkata", text: "Local site visits and familiarity with the city's commercial buildings." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about/" },
        ]}
        title={
          <>
            Designing Better Spaces <span className="text-yellow">for Better Businesses.</span>
          </>
        }
        intro="SpaceCraft Interiors is a Kolkata-based commercial interior design and turnkey execution company. We design offices, retail stores, showrooms and cafés that look good, work hard and are delivered properly."
        pose="blueprint"
        note="Hello there!"
      />

      {/* 1. Introduction */}
      <Section labelledBy="intro-heading">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Not a Reveal: on phones this sits at the first-screen fold and must be fully legible at load. */}
          <div>
            <h2 id="intro-heading" className="heading-bar font-display text-3xl font-bold text-teal sm:text-4xl">
              Who we are
            </h2>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink">
              <p>
                Most businesses only fit out a space every few years, so it&apos;s easy to underestimate how many decisions are
                involved. We bring the design thinking, technical planning and site management together so you don&apos;t have
                to coordinate a dozen separate vendors.
              </p>
              <p className="text-ink-muted">
                Our work covers new office set-ups, corporate floors, retail shops, showrooms, cafés, restaurants and
                commercial renovations — from the first site visit to the day you move in.
              </p>
            </div>
            {isDev && (
              <p className="mt-6 rounded-xl border border-dashed border-orange p-4 text-sm text-ink-muted">
                Company history, founder profile and credentials will appear here once supplied.
                <PlaceholderTag field="about page: history & team" />
              </p>
            )}
          </div>
          <Reveal delay={120}>
            <div className="relative">
              <ResponsiveImage
                name="service-reception-lobby-wood-panelling"
                alt="Reception lobby with wood-panelled walls, a stone reception desk and plants"
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="aspect-[4/3] w-full rounded-[var(--radius-panel)] object-cover shadow-[var(--shadow-card-hover)]"
              />
              <span className="absolute bottom-3 left-3 rounded-full bg-ink/80 px-2.5 py-1 text-[0.7rem] font-semibold text-white">
                Illustrative image
              </span>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* 2. Philosophy */}
      <Section tone="beige" labelledBy="philosophy-heading">
        <h2 id="philosophy-heading" className="heading-bar font-display text-3xl font-bold text-teal sm:text-4xl">
          Our philosophy
        </h2>
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {philosophy.map(({ Icon, title, text }, i) => (
            <Reveal as="li" key={title} delay={i * 100} className="rounded-[var(--radius-card)] bg-cream p-7 shadow-[var(--shadow-card)]">
              <span className="inline-flex size-12 items-center justify-center rounded-full bg-yellow">
                <Icon className="size-6 text-ink" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-display text-xl font-bold text-ink">{title}</h3>
              <p className="mt-2 leading-relaxed text-ink-muted-strong">{text}</p>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* 3. Understanding commercial spaces */}
      <Section tone="teal" labelledBy="spaces-heading">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <h2 id="spaces-heading" className="heading-bar font-display text-3xl font-bold text-white sm:text-4xl">
              We understand commercial spaces
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-teal-muted">
              A commercial interior is a business tool. It affects how productive your team is, how long customers stay and
              how your brand is remembered. That&apos;s why we design differently for each type of space.
            </p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {spaceTypes.map((s) => (
              <li key={s.title} className="rounded-[var(--radius-card)] bg-white/6 p-6 ring-1 ring-white/15">
                <h3 className="font-display text-lg font-bold text-yellow">{s.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-teal-muted">{s.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* 4. Design approach */}
      <Section labelledBy="approach-heading">
        <h2 id="approach-heading" className="heading-bar font-display text-3xl font-bold text-teal sm:text-4xl">
          Our design approach
        </h2>
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {approach.map(({ Icon, title, text }, i) => (
            <Reveal as="li" key={title} delay={i * 100} className="relative border-t-4 border-yellow pt-6">
              <span className="font-display text-sm font-bold tracking-widest text-orange-deep">0{i + 1}</span>
              <Icon className="mt-3 size-8 text-teal" aria-hidden="true" />
              <h3 className="mt-3 font-display text-xl font-bold text-ink">{title}</h3>
              <p className="mt-2 leading-relaxed text-ink-muted">{text}</p>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* 5. Why choose us */}
      <Section tone="beige" labelledBy="why-heading">
        <h2 id="why-heading" className="heading-bar font-display text-3xl font-bold text-teal sm:text-4xl">
          Why businesses choose SpaceCraft
        </h2>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map(({ Icon, title, text }) => (
            <li key={title} className="flex gap-4 rounded-[var(--radius-card)] bg-cream p-6">
              <Icon className="mt-1 size-7 shrink-0 text-orange-deep" aria-hidden="true" />
              <div>
                <h3 className="font-display text-lg font-bold text-ink">{title}</h3>
                <p className="mt-1 text-[0.95rem] leading-relaxed text-ink-muted-strong">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* 6. Process */}
      <ProcessSection />

      {/* 7. CTA */}
      <ContactCTA />
    </>
  );
}
