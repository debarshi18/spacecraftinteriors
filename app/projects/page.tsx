import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Info } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Container";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { ContactCTA } from "@/components/home/ContactCTA";

export const metadata: Metadata = pageMetadata({
  title: "Interior Design Projects in Kolkata",
  path: "/projects/",
  description:
    "Explore the office, retail, showroom, café and commercial spaces we design in Kolkata, and the thinking behind each type of space.",
});

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Projects", href: "/projects/" },
        ]}
        title={
          <>
            Spaces We&apos;ve Designed. <span className="text-yellow">Businesses We&apos;ve Helped.</span>
          </>
        }
        intro="Offices, shops, showrooms, cafés and commercial floors — browse by category to see the kinds of spaces we create and what goes into each one."
        pose="celebrate"
      />

      <Section labelledBy="gallery-heading">
        <h2 id="gallery-heading" className="sr-only">
          Project gallery
        </h2>
        <p className="mb-8 flex max-w-3xl items-start gap-2 rounded-xl bg-beige p-4 text-sm text-ink-muted-strong">
          <Info className="mt-0.5 size-4 shrink-0 text-teal" aria-hidden="true" />
          Our project photography is being prepared. Until then, spaces marked “Illustrative” use licensed photographs to
          show the types of interiors we design — they are not presented as completed SpaceCraft projects.
        </p>
        <ProjectGallery />
      </Section>

      <ContactCTA />
    </>
  );
}
