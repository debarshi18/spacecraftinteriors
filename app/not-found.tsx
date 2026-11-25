import type { Metadata } from "next";
import Link from "next/link";
import { Mascot } from "@/components/mascot/Mascot";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/data/site-config";

export const metadata: Metadata = {
  title: { absolute: `Page not found | ${siteConfig.name}` },
  robots: { index: false, follow: true },
};

const links = [
  { href: "/services/", label: "Our services" },
  { href: "/projects/", label: "Projects" },
  { href: "/about/", label: "About us" },
  { href: "/contact/", label: "Contact" },
];

export default function NotFound() {
  return (
    <section className="py-16 sm:py-24" aria-labelledby="nf-heading">
      <Container className="flex flex-col items-center gap-10 text-center md:flex-row md:text-left">
        <Mascot pose="think" animated className="h-56 w-auto shrink-0 sm:h-72" />
        <div>
          <p className="font-script text-2xl text-orange-deep">Hmm, that&apos;s not on the plan…</p>
          <h1 id="nf-heading" className="mt-2 font-display text-4xl font-extrabold text-teal sm:text-5xl">
            We couldn&apos;t find that page
          </h1>
          <p className="mt-4 max-w-lg text-lg text-ink-muted">
            The link may be old or mistyped. Try one of these instead, or head back to the homepage.
          </p>
          <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 md:justify-start">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="font-semibold text-orange-deep underline-offset-4 hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Button href="/" arrow className="mt-8">
            Back to homepage
          </Button>
        </div>
      </Container>
    </section>
  );
}
