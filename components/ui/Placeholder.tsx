import { isDev } from "@/data/site-config";

/**
 * Development-only marker for business information that still needs verifying.
 * Renders nothing in production builds, so placeholders never reach the live site.
 */
export function PlaceholderTag({ field }: { field: string }) {
  if (!isDev) return null;
  return (
    <span
      title={`Set ${field} in data/site-config.ts`}
      className="ml-1 inline-block rounded bg-orange px-1.5 py-0.5 align-middle font-sans text-[0.65rem] font-bold tracking-wide text-ink uppercase"
    >
      Placeholder
    </span>
  );
}
