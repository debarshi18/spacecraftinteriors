import type { CSSProperties, ElementType, ReactNode } from "react";

/**
 * Fades content up as it scrolls into view, using a CSS scroll timeline (see globals.css).
 * No JavaScript: content is visible at first paint, and reduced-motion users get no animation.
 * `delay` (ms, in steps of ~100) staggers siblings.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: ElementType;
}) {
  return (
    <Tag data-reveal="" className={className} style={{ "--reveal-step": Math.round(delay / 100) } as CSSProperties}>
      {children}
    </Tag>
  );
}
