import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "outline-light" | "outline-dark" | "ghost-light";
type Size = "md" | "lg";

const base =
  "group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-display font-semibold " +
  "transition-[background-color,color,box-shadow,transform] duration-200 ease-out " +
  "hover:-translate-y-0.5 active:translate-y-0 motion-reduce:hover:translate-y-0 " +
  "focus-visible:outline-offset-4 min-h-11";

const variants: Record<Variant, string> = {
  // Deeper orange keeps white text at 4.97:1 (see docs/PHASE-1-PLAN.md §2)
  primary:
    "bg-orange-deep text-white shadow-[var(--shadow-cta)] hover:bg-orange-deeper " +
    "hover:shadow-[0_14px_28px_-12px_rgb(196_70_0/0.7)]",
  "outline-light": "border-2 border-white/70 text-white hover:bg-white hover:text-teal",
  "outline-dark": "border-2 border-teal text-teal hover:bg-teal hover:text-white",
  "ghost-light": "text-white hover:text-yellow",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5 text-[0.95rem]",
  lg: "px-7 py-3.5 text-base sm:text-lg",
};

type Props = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  /** Show the animated trailing arrow */
  arrow?: boolean;
  className?: string;
} & Omit<ComponentProps<"a">, "href" | "className" | "children">;

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className = "") {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`;
}

/** Link styled as a call-to-action. External/blog/tel/mailto links render a plain <a>. */
export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  arrow = false,
  className = "",
  ...rest
}: Props) {
  const content = (
    <>
      {children}
      {arrow && (
        <ArrowRight
          aria-hidden="true"
          className="size-[1.1em] transition-transform duration-200 group-hover:translate-x-1"
        />
      )}
    </>
  );
  const cls = buttonClasses(variant, size, className);
  const isInternal = href.startsWith("/") && !href.startsWith("/blog");

  return isInternal ? (
    <Link href={href} className={cls} {...rest}>
      {content}
    </Link>
  ) : (
    <a href={href} className={cls} {...rest}>
      {content}
    </a>
  );
}
