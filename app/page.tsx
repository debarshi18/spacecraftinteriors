import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/data/site-config";
import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/home/TrustBar";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { WorkspaceBuilder } from "@/components/home/WorkspaceBuilder";
import { ProcessSection } from "@/components/home/ProcessSection";
import { ContactCTA } from "@/components/home/ContactCTA";

export const metadata: Metadata = pageMetadata({
  title: siteConfig.defaultTitle,
  absoluteTitle: true,
  description: siteConfig.description,
  path: "/",
});

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <ServicesGrid />
      <FeaturedProjects />
      <WorkspaceBuilder />
      <ProcessSection />
      <ContactCTA />
    </>
  );
}
