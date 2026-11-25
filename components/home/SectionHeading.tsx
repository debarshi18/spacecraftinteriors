import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

/** Section title with the reference's yellow underline bar and an optional "view all" link. */
export function SectionHeading({
  id,
  children,
  link,
  aside,
}: {
  id: string;
  children: ReactNode;
  link?: { href: string; label: string };
  aside?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-4 sm:mb-10">
      <h2 id={id} className="heading-bar font-display text-3xl font-bold text-teal sm:text-4xl">
        {children}
      </h2>
      {link && (
        <Link href={link.href} className="group inline-flex items-center gap-1.5 text-sm font-semibold text-orange-deep hover:text-orange-deeper">
          {link.label}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      )}
      {aside}
    </div>
  );
}
