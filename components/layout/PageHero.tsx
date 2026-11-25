import type { ReactNode } from "react";
import { Mascot, type MascotPose } from "@/components/mascot/Mascot";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

/**
 * Teal header band for inner pages: breadcrumbs, H1, intro and a small mascot "guide".
 * Shares the homepage hero's curved bottom edge so every page feels part of one brand.
 */
export function PageHero({
  title,
  intro,
  crumbs,
  pose,
  note,
  children,
}: {
  title: ReactNode;
  intro: ReactNode;
  crumbs: Crumb[];
  pose?: MascotPose;
  /** Short handwritten annotation beside the mascot */
  note?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-teal text-white">
      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 pt-8 pb-20 sm:px-6 sm:pt-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:px-8 lg:pb-24">
        <div className="max-w-3xl">
          <Breadcrumbs items={crumbs} />
          <h1 className="mt-5 font-display text-4xl leading-[1.05] font-extrabold sm:text-5xl lg:text-[3.5rem]">{title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/90">{intro}</p>
          {children && <div className="mt-8">{children}</div>}
        </div>
        {pose && (
          <div className="relative hidden lg:block" aria-hidden="true">
            {note && (
              <p className="absolute -top-4 -left-24 -rotate-12 font-script text-2xl leading-none text-yellow">{note}</p>
            )}
            <Mascot pose={pose} animated className="-mb-16 h-64 w-auto" />
          </div>
        )}
      </div>
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true" className="absolute inset-x-0 -bottom-px h-10 w-full text-cream sm:h-14" fill="currentColor">
        <path d="M0 60 V26 C320 58 680 60 980 34 C1180 16 1320 10 1440 20 V60 Z" />
      </svg>
    </section>
  );
}
