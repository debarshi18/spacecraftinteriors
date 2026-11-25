import { Cog, Handshake, Star, UsersRound } from "lucide-react";
import { siteConfig } from "@/data/site-config";
import { PlaceholderTag } from "@/components/ui/Placeholder";

const icons = [Star, UsersRound, Handshake, Cog];

/**
 * Achievement strip under the hero. Figures come only from siteConfig.stats;
 * unverified ones show a qualitative fallback instead of an invented number.
 */
export function TrustBar() {
  return (
    <section aria-label="Why SpaceCraft" className="relative z-10 -mt-6 sm:-mt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ul className="grid grid-cols-2 gap-y-6 rounded-[var(--radius-panel)] border border-line bg-white px-4 py-6 shadow-[var(--shadow-card)] sm:px-6 lg:grid-cols-4 lg:divide-x lg:divide-line lg:py-7">
          {siteConfig.stats.map((stat, i) => {
            const Icon = icons[i % icons.length];
            const verified = stat.value !== null;
            return (
              <li key={stat.label} className="flex items-center gap-3 px-1 sm:px-4 lg:justify-center">
                <Icon className="size-9 shrink-0 fill-yellow stroke-orange stroke-[1.5] sm:size-10" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="font-display text-lg leading-tight font-bold text-ink sm:text-xl">
                    {verified ? stat.value : stat.fallback.title}
                    {!verified && <PlaceholderTag field={`stats: "${stat.label}"`} />}
                  </p>
                  <p className="text-sm leading-snug text-ink-muted">{verified ? stat.label : stat.fallback.text}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
