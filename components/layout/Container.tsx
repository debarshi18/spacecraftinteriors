import type { ElementType, ReactNode } from "react";

/** Horizontal page gutter + max width used by every section. */
export function Container({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  return <Tag className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</Tag>;
}

const tones = {
  cream: "bg-cream",
  beige: "bg-beige",
  white: "bg-white",
  teal: "bg-teal text-white",
} as const;

/** Vertical rhythm for page sections. */
export function Section({
  children,
  id,
  tone = "cream",
  className = "",
  labelledBy,
}: {
  children: ReactNode;
  id?: string;
  tone?: keyof typeof tones;
  className?: string;
  labelledBy?: string;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`py-16 sm:py-20 lg:py-24 ${tones[tone]} ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}
