"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ComponentProps } from "react";
import { ChevronDown, Menu, X, ArrowRight } from "lucide-react";
import { mainNav, consultationCta, type NavItem } from "@/data/navigation";
import { BrandMark } from "./BrandMark";
import { Button } from "@/components/ui/Button";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href.replace(/#.*$/, ""));
}

function NavLink({ href, className, children, ...rest }: ComponentProps<"a"> & { href: string }) {
  // /blog/ is served by WordPress, so it must be a full page load.
  return href.startsWith("/blog") ? (
    <a href={href} className={className} {...rest}>
      {children}
    </a>
  ) : (
    <Link href={href} className={className} {...rest}>
      {children}
    </Link>
  );
}

export function Header() {
  const pathname = usePathname() ?? "/";
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the drawer on navigation
  // Stable reference so the drawer's focus-trap effect doesn't re-run on every render.
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <>
    <header
      className={`sticky top-0 z-50 border-b bg-cream/95 backdrop-blur-sm transition-[box-shadow,border-color] duration-300 ${
        scrolled ? "border-line shadow-[0_6px_20px_-14px_rgb(31_41_55/0.35)]" : "border-transparent"
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-full focus:bg-teal focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 transition-[padding] duration-300 sm:px-6 lg:px-8 ${
          scrolled ? "py-2.5" : "py-3.5 lg:py-4"
        }`}
      >
        <BrandMark />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) =>
              item.children ? (
                <DesktopDropdown key={item.href} item={item} active={isActive(pathname, item.href)} />
              ) : (
                <li key={item.href}>
                  <NavLink
                    href={item.href}
                    aria-current={isActive(pathname, item.href) ? "page" : undefined}
                    className="relative inline-flex whitespace-nowrap rounded-md px-3 py-2 text-[0.95rem] font-medium text-ink transition-colors hover:text-orange-deep aria-[current=page]:font-semibold aria-[current=page]:text-teal aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-3 aria-[current=page]:after:-bottom-0.5 aria-[current=page]:after:h-[3px] aria-[current=page]:after:rounded-full aria-[current=page]:after:bg-orange"
                  >
                    {item.label}
                  </NavLink>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="hidden shrink-0 lg:block">
          <Button href={consultationCta.href} arrow>
            {consultationCta.label}
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-full text-teal hover:bg-beige lg:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="size-6" aria-hidden="true" />
          <span className="sr-only">Open menu</span>
        </button>
      </div>

    </header>
    {/* Outside <header>: its backdrop-filter would otherwise trap position:fixed children */}
    <MobileNav open={mobileOpen} onClose={closeMobile} pathname={pathname} />
    </>
  );
}

function DesktopDropdown({ item, active }: { item: NavItem; active: boolean }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLLIElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      // If focus is inside the menu, send it back to the toggle so it isn't lost in a hidden element.
      if (wrapRef.current?.querySelector("#services-menu")?.contains(document.activeElement)) {
        wrapRef.current.querySelector<HTMLElement>('button[aria-controls="services-menu"]')?.focus();
      }
      setOpen(false);
    };
    const onClick = (e: MouseEvent) => !wrapRef.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <li
      ref={wrapRef}
      className="relative"
      onMouseEnter={() => {
        clearTimeout(closeTimer.current);
        setOpen(true);
      }}
      onMouseLeave={() => {
        closeTimer.current = setTimeout(() => setOpen(false), 150);
      }}
      onBlur={(e) => !wrapRef.current?.contains(e.relatedTarget as Node) && setOpen(false)}
      onKeyDown={(e) => {
        // Optional arrow-key support (disclosure navigation pattern): Down/Up move through the links.
        if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
        const links = [...(wrapRef.current?.querySelectorAll<HTMLElement>("#services-menu a") ?? [])];
        const i = links.indexOf(document.activeElement as HTMLElement);
        e.preventDefault();
        if (!open) setOpen(true);
        const next = i === -1 ? (e.key === "ArrowDown" ? 0 : links.length - 1) : (i + (e.key === "ArrowDown" ? 1 : -1) + links.length) % links.length;
        // The menu un-hides on the next render when it was closed.
        setTimeout(() => links[next]?.focus(), 0);
      }}
    >
      <div className="flex items-center">
        <Link
          href={item.href}
          aria-current={active ? "page" : undefined}
          className="relative inline-flex whitespace-nowrap rounded-md py-2 pr-1 pl-3 text-[0.95rem] font-medium text-ink transition-colors hover:text-orange-deep aria-[current=page]:font-semibold aria-[current=page]:text-teal aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-3 aria-[current=page]:after:-bottom-0.5 aria-[current=page]:after:h-[3px] aria-[current=page]:after:rounded-full aria-[current=page]:after:bg-orange"
        >
          {item.label}
        </Link>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="services-menu"
          onClick={() => setOpen((v) => !v)}
          className="rounded-md p-1.5 text-ink hover:text-orange-deep"
        >
          <ChevronDown className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
          <span className="sr-only">{item.label} submenu</span>
        </button>
      </div>
      <div
        id="services-menu"
        hidden={!open}
        className="absolute top-full left-1/2 w-80 -translate-x-1/2 pt-3"
      >
        <ul className="rounded-[var(--radius-card)] border border-line bg-white p-2 shadow-[var(--shadow-card-hover)]">
          {item.children!.map((child) => (
            <li key={child.href}>
              <Link
                href={child.href}
                onClick={() => setOpen(false)}
                className="group flex items-start gap-3 rounded-xl px-3 py-2.5 hover:bg-cream"
              >
                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-yellow group-hover:bg-orange" aria-hidden="true" />
                <span>
                  <span className="block font-display font-semibold text-ink">{child.label}</span>
                  {child.description && <span className="block text-sm text-ink-muted">{child.description}</span>}
                </span>
              </Link>
            </li>
          ))}
          <li className="mt-1 border-t border-line pt-1">
            <Link
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-orange-deep hover:bg-cream"
            >
              All services <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </li>
        </ul>
      </div>
    </li>
  );
}

function MobileNav({ open, onClose, pathname }: { open: boolean; onClose: () => void; pathname: string }) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    panel?.querySelector<HTMLElement>("button, a")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !panel) return;
      // Trap focus inside the drawer
      const focusables = panel.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  return (
    <div className={`fixed inset-0 z-50 lg:hidden ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div
        className={`absolute inset-0 bg-ink/50 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <div
        id="mobile-nav"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        inert={!open}
        className={`absolute inset-y-0 right-0 flex w-[min(22rem,88vw)] flex-col bg-cream shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <span className="font-display text-lg font-bold text-teal">Menu</span>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-11 items-center justify-center rounded-full text-teal hover:bg-beige"
          >
            <X className="size-6" aria-hidden="true" />
            <span className="sr-only">Close menu</span>
          </button>
        </div>
        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {mainNav.map((item) => (
              <li key={item.href}>
                <NavLink
                  href={item.href}
                  onClick={onClose}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                  className="flex min-h-12 items-center rounded-xl px-4 font-display text-lg font-semibold text-ink hover:bg-beige aria-[current=page]:bg-teal aria-[current=page]:text-white"
                >
                  {item.label}
                </NavLink>
                {item.children && (
                  <ul className="mt-1 mb-2 ml-4 space-y-0.5 border-l-2 border-yellow pl-3">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          onClick={onClose}
                          className="flex min-h-11 items-center rounded-lg px-3 text-[0.95rem] text-ink-muted hover:bg-beige hover:text-ink"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t border-line p-5">
          <Button href={consultationCta.href} arrow size="lg" className="w-full" onClick={onClose}>
            {consultationCta.label}
          </Button>
        </div>
      </div>
    </div>
  );
}
