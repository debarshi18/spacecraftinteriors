import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/layout/Container";
import { ContactForm } from "@/components/contact/ContactForm";
import { PlaceholderTag } from "@/components/ui/Placeholder";
import { siteConfig, isDev } from "@/data/site-config";

export const metadata: Metadata = pageMetadata({
  title: "Contact Our Kolkata Interior Designers",
  description:
    "Book a free consultation with SpaceCraft Interiors. Tell us about your office, retail, showroom or café project in Kolkata and our team will get back to you.",
  path: "/contact/",
});

const nextSteps = [
  { title: "We call you back", text: "A short conversation to understand your space, goals and timeline." },
  { title: "Site visit & brief", text: "We visit the space, take measurements and agree the brief." },
  { title: "Proposal", text: "You receive a design direction with a clear, itemised estimate." },
];

export default function ContactPage() {
  const { phone, whatsapp, email, address, mapEmbedUrl, hours } = siteConfig.contact;
  const waText = encodeURIComponent("Hello SpaceCraft Interiors, I'd like to discuss an interior project.");

  return (
    <>
      <PageHero
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Contact", href: "/contact/" },
        ]}
        title={
          <>
            Let&apos;s Discuss Your <span className="text-yellow">Next Project.</span>
          </>
        }
        intro="Share a few details about your office, shop, showroom or café and we'll get back to you to arrange a free consultation."
        pose="point"
        note="Say hello!"
      />

      <section className="py-14 sm:py-20" aria-label="Enquiry form and contact details">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12">
            <ContactForm />

            <aside className="space-y-6">
              <div className="rounded-[var(--radius-panel)] bg-teal p-7 text-white">
                <h2 className="font-display text-xl font-bold">Prefer to talk?</h2>
                <ul className="mt-5 space-y-4">
                  {whatsapp && (
                    <li>
                      <a
                        href={`https://wa.me/${whatsapp}?text=${waText}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-white px-5 font-display font-semibold text-teal hover:bg-yellow"
                      >
                        <MessageCircle className="size-5" aria-hidden="true" /> Chat on WhatsApp
                        <span className="sr-only">(opens in new tab)</span>
                      </a>
                    </li>
                  )}
                  <ContactLine Icon={Phone} label="Phone" value={phone} href={phone ? `tel:${phone}` : undefined} field="contact.phone" />
                  <ContactLine Icon={Mail} label="Email" value={email} href={email ? `mailto:${email}` : undefined} field="contact.email" />
                  <ContactLine
                    Icon={MapPin}
                    label="Office"
                    value={[address.street, address.locality, address.region].filter(Boolean).join(", ")}
                    field={address.street ? undefined : "contact.address.street"}
                  />
                  {(hours || isDev) && <ContactLine Icon={Clock} label="Hours" value={hours} field="contact.hours" />}
                  {!whatsapp && isDev && (
                    <li className="text-sm text-teal-muted">
                      WhatsApp button appears when a number is set <PlaceholderTag field="contact.whatsapp" />
                    </li>
                  )}
                </ul>
              </div>

              <div className="rounded-[var(--radius-panel)] bg-beige p-7">
                <h2 className="font-display text-xl font-bold text-ink">What happens next?</h2>
                <ol className="mt-5 space-y-5">
                  {nextSteps.map((s, i) => (
                    <li key={s.title} className="flex gap-4">
                      <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-yellow font-display font-bold text-ink">
                        {i + 1}
                      </span>
                      <div>
                        <h3 className="font-semibold text-ink">{s.title}</h3>
                        <p className="text-sm leading-snug text-ink-muted-strong">{s.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>
          </div>

          {mapEmbedUrl && (
            <div className="mt-14 overflow-hidden rounded-[var(--radius-panel)] shadow-[var(--shadow-card)]">
              <iframe
                src={mapEmbedUrl}
                title={`Map showing ${siteConfig.name} office location`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-80 w-full border-0"
              />
            </div>
          )}
        </Container>
      </section>
    </>
  );
}

function ContactLine({
  Icon,
  label,
  value,
  href,
  field,
}: {
  Icon: typeof Phone;
  label: string;
  value: string | null;
  href?: string;
  /** site-config field to flag in development when missing */
  field?: string;
}) {
  if (!value && !isDev) return null;
  return (
    <li className="flex gap-3">
      <Icon className="mt-0.5 size-5 shrink-0 text-yellow" aria-hidden="true" />
      <div className="min-w-0">
        <p className="text-xs font-semibold tracking-wide text-teal-muted uppercase">{label}</p>
        {value ? (
          href ? (
            <a href={href} className="font-medium break-words hover:text-yellow">
              {value}
            </a>
          ) : (
            <p className="font-medium">{value}</p>
          )
        ) : null}
        {field && <PlaceholderTag field={field} />}
      </div>
    </li>
  );
}
