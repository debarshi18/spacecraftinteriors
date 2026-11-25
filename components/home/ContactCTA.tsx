import { Mail, Phone } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Mascot } from "@/components/mascot/Mascot";
import { PlaceholderTag } from "@/components/ui/Placeholder";
import { siteConfig, isDev } from "@/data/site-config";

/** Faint line-art skyline behind the CTA panel. */
function Skyline({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 120" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M0 120 V78 H30 V50 H58 V78 H74 V30 H104 V120 M104 64 H140 V20 H168 V120 M168 70 H196 V44 H230 V120 M230 84 H262 V36 H280 V12 H298 V120 M298 60 H330 V88 H360 V54 H400 V120" />
      <path d="M82 40 H96 M82 52 H96 M82 64 H96 M146 32 H162 M146 46 H162 M146 60 H162 M268 48 H276 M286 24 H294 M286 40 H294" />
    </svg>
  );
}

export function ContactCTA() {
  const { phone, email } = siteConfig.contact;

  return (
    <section aria-labelledby="cta-heading" className="pt-6 pb-16 sm:pb-20">
      <Container>
        <div className="relative overflow-hidden rounded-[var(--radius-panel)] bg-beige px-6 pt-10 pb-0 sm:px-10 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-6 lg:py-10">
          <Skyline className="pointer-events-none absolute right-0 bottom-0 h-28 w-auto text-teal/15 sm:h-36" />

          <div className="relative">
            <h2 id="cta-heading" className="font-display text-3xl leading-tight font-extrabold text-ink sm:text-4xl">
              Let’s Build Your
              <br />
              <span className="text-orange-deep">Next Workspace</span>
            </h2>
            <p className="mt-3 max-w-sm text-ink-muted-strong">
              Book a free consultation and take the first step towards a better workspace.
            </p>
          </div>

          <div className="relative order-last mx-auto mt-6 w-56 sm:w-64 lg:order-none lg:-my-6 lg:mt-0 lg:w-64">
            <p aria-hidden="true" className="absolute -top-2 right-0 z-10 rotate-6 font-script text-2xl leading-none text-teal sm:-right-6">
              Your Vision,
              <br />
              Our Build!
            </p>
            <Mascot pose="drawing" animated className="h-auto w-full" />
          </div>

          <div className="relative mt-8 flex flex-col gap-4 lg:mt-0 lg:items-start lg:pl-6">
            <Button href="/contact/" size="lg" arrow>
              Get in Touch
            </Button>
            <ul className="space-y-2 text-ink">
              {phone ? (
                <li>
                  <a href={`tel:${phone}`} className="inline-flex items-center gap-2 font-medium hover:text-orange-deep">
                    <Phone className="size-4 text-teal" aria-hidden="true" /> {phone}
                  </a>
                </li>
              ) : (
                isDev && (
                  <li className="inline-flex items-center gap-2">
                    <Phone className="size-4 text-teal" aria-hidden="true" /> Phone <PlaceholderTag field="contact.phone" />
                  </li>
                )
              )}
              {email ? (
                <li>
                  <a href={`mailto:${email}`} className="inline-flex items-center gap-2 font-medium break-all hover:text-orange-deep">
                    <Mail className="size-4 text-teal" aria-hidden="true" /> {email}
                  </a>
                </li>
              ) : (
                isDev && (
                  <li className="flex items-center gap-2">
                    <Mail className="size-4 text-teal" aria-hidden="true" /> Email <PlaceholderTag field="contact.email" />
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
