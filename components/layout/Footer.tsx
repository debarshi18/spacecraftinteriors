import Link from "next/link";
import type { ReactNode } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { siteConfig, isDev } from "@/data/site-config";
import { footerQuickLinks } from "@/data/navigation";
import { featuredServices } from "@/data/services";
import { BrandMark } from "./BrandMark";
import { SocialIcon, type SocialNetwork } from "./SocialIcon";
import { PlaceholderTag } from "@/components/ui/Placeholder";

const socialLabels: Record<SocialNetwork, string> = {
  linkedin: "LinkedIn",
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube",
};

function FooterHeading({ children }: { children: ReactNode }) {
  return <h2 className="mb-4 font-display text-base font-semibold text-white">{children}</h2>;
}

const linkCls = "text-sm text-teal-muted transition-colors hover:text-yellow";

export function Footer() {
  const { contact, social } = siteConfig;
  const socials = (Object.entries(social) as [SocialNetwork, string | null][]).filter(([, url]) => url);
  const year = new Date().getFullYear();

  return (
    <footer className="bg-teal text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-10 px-4 pt-14 pb-10 sm:px-6 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1fr_1.3fr] lg:px-8">
        <div className="col-span-2 max-w-xs sm:col-span-1">
          <BrandMark tone="light" />
          <p className="mt-5 text-sm leading-relaxed text-teal-muted">{siteConfig.shortDescription}</p>
          {(socials.length > 0 || isDev) && (
            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold">Follow Us</p>
              {socials.length > 0 ? (
                <ul className="flex gap-3">
                  {socials.map(([network, url]) => (
                    <li key={network}>
                      <a
                        href={url!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex size-10 items-center justify-center rounded-full bg-white text-teal transition-colors hover:bg-yellow"
                      >
                        <SocialIcon network={network} />
                        <span className="sr-only">{socialLabels[network]} (opens in new tab)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <PlaceholderTag field="social profile URLs" />
              )}
            </div>
          )}
        </div>

        <nav aria-label="Footer quick links">
          <FooterHeading>Quick Links</FooterHeading>
          <ul className="space-y-2.5">
            {footerQuickLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkCls}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Footer services">
          <FooterHeading>Our Services</FooterHeading>
          <ul className="space-y-2.5">
            {featuredServices.map((s) => (
              <li key={s.id}>
                <Link href={`/services/#${s.id}`} className={linkCls}>
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-2 sm:col-span-1">
          <FooterHeading>Contact Us</FooterHeading>
          <ul className="space-y-3 text-sm text-teal-muted">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-yellow" aria-hidden="true" />
              <span>
                {contact.address.street && <>{contact.address.street}, </>}
                {contact.address.locality}, {contact.address.region}
                {!contact.address.street && <PlaceholderTag field="contact.address.street" />}
              </span>
            </li>
            {contact.phone ? (
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-yellow" aria-hidden="true" />
                <a href={`tel:${contact.phone}`} className="hover:text-yellow">
                  {contact.phone}
                </a>
              </li>
            ) : (
              isDev && (
                <li className="flex gap-3">
                  <Phone className="mt-0.5 size-4 shrink-0 text-yellow" aria-hidden="true" />
                  <span>
                    Phone <PlaceholderTag field="contact.phone" />
                  </span>
                </li>
              )
            )}
            {contact.email ? (
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-yellow" aria-hidden="true" />
                <a href={`mailto:${contact.email}`} className="break-all hover:text-yellow">
                  {contact.email}
                </a>
              </li>
            ) : (
              isDev && (
                <li className="flex gap-3">
                  <Mail className="mt-0.5 size-4 shrink-0 text-yellow" aria-hidden="true" />
                  <span>
                    Email <PlaceholderTag field="contact.email" />
                  </span>
                </li>
              )
            )}
            <li>
              <Link href="/contact/" className="font-semibold text-yellow underline-offset-4 hover:underline">
                Send us an enquiry →
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 bg-teal-dark">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-teal-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p>{siteConfig.defaultTitle}</p>
        </div>
      </div>
    </footer>
  );
}
