import Link from "next/link";
import { siteConfig } from "@/data/site-config";

/**
 * TEMPORARY text-based brand treatment. The final logo is being designed separately —
 * replace this component's contents when it arrives; every usage goes through here.
 */
export function BrandMark({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const name = tone === "dark" ? "text-teal" : "text-white";
  const sub = tone === "dark" ? "text-ink-muted" : "text-teal-muted";
  // Wordmark accent: deep orange on cream, brand orange on teal (both ≥3:1 for large text)
  const accent = tone === "dark" ? "text-orange-deep" : "text-orange";

  return (
    // Named by its visible text (plus "home") so voice-control users can say what they see.
    <Link href="/" className="group inline-flex items-center gap-2.5">
      <BuildingIcon className="h-10 w-9 shrink-0 sm:h-11 sm:w-10" />
      <span className="flex flex-col leading-none">
        <span className={`font-display text-[1.45rem] font-extrabold tracking-tight sm:text-[1.6rem] ${name}`}>
          Space<span className={accent}>Craft</span>
        </span>
        <span className={`mt-0.5 font-display text-[0.8rem] font-medium tracking-[0.32em] ${name}`}>Interiors</span>
        <span aria-hidden="true" className={`mt-1 hidden whitespace-nowrap text-[0.55rem] font-semibold tracking-[0.16em] uppercase sm:block ${sub}`}>
          {siteConfig.tagline}
        </span>
      </span>
      <span className="sr-only">home</span>
    </Link>
  );
}

/** Placeholder architectural icon: three building blocks of different heights. */
export function BuildingIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 40" className={className} aria-hidden="true">
      <rect x="1" y="14" width="10" height="25" rx="1.5" fill="var(--color-yellow)" />
      <rect x="12.5" y="2" width="11" height="37" rx="1.5" fill="var(--color-teal)" />
      <rect x="25" y="20" width="10" height="19" rx="1.5" fill="var(--color-orange)" />
      <g fill="var(--color-cream)">
        <rect x="15.5" y="7" width="2" height="3" rx=".5" />
        <rect x="19" y="7" width="2" height="3" rx=".5" />
        <rect x="15.5" y="14" width="2" height="3" rx=".5" />
        <rect x="19" y="14" width="2" height="3" rx=".5" />
        <rect x="15.5" y="21" width="2" height="3" rx=".5" />
        <rect x="19" y="21" width="2" height="3" rx=".5" />
        <rect x="16.5" y="31" width="3.5" height="8" rx=".5" />
      </g>
      <g fill="var(--color-teal)" opacity=".55">
        <rect x="4" y="19" width="4" height="2.5" rx=".5" />
        <rect x="4" y="25" width="4" height="2.5" rx=".5" />
        <rect x="28" y="25" width="4" height="2.5" rx=".5" />
      </g>
    </svg>
  );
}
