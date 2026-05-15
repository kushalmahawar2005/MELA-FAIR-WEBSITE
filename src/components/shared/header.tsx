"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { site } from "@/lib/site";

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 21v-7.5h2.5l.4-3H13.5V8.6c0-.86.24-1.45 1.49-1.45h1.6V4.45A21 21 0 0 0 14.27 4.3C12.05 4.3 10.5 5.66 10.5 8.16V10.5H8v3h2.5V21h3z" />
    </svg>
  );
}

const nav = [
  { label: "Jhoolas", labelHi: "झूले", href: "#rides", id: "rides" },
  { label: "Gallery", labelHi: "तस्वीरें", href: "#gallery", id: "gallery" },
  { label: "Tour", labelHi: "शहर", href: "#tour", id: "tour" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = nav
      .map((n) => document.getElementById(n.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (sections.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const activePill = hovered ?? active;
  const onDark = !scrolled; // top of page = over hero image

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed top-0 left-0 z-50 w-full transition-[padding] duration-300",
        scrolled ? "py-2.5" : "py-4",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
        {/* Logo */}
        <Link href="/" className="group relative flex shrink-0 items-center gap-3">
          <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-festival text-cream shadow-md ring-2 ring-marigold transition-transform group-hover:rotate-[8deg]">
            <span className="font-display text-xl leading-none">न</span>
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-marigold ring-2 ring-cream" />
          </span>
          <span className="flex flex-col leading-none">
            <span
              className={cn(
                "font-display text-[1.1rem] tracking-wide transition-colors",
                onDark ? "text-cream drop-shadow-[0_2px_8px_rgb(15_31_77/0.6)]" : "text-ink",
              )}
            >
              NAAZ{" "}
              <span className={onDark ? "text-marigold" : "text-festival"}>
                BROTHERS
              </span>
            </span>
            <span
              className={cn(
                "font-display text-[0.72rem] mt-0.5 tracking-wide transition-colors",
                onDark ? "text-marigold/85" : "text-festival/70",
              )}
            >
              तीन पीढ़ियों की रौनक़
            </span>
          </span>
        </Link>

        {/* Floating pill nav (desktop) */}
        <nav
          onMouseLeave={() => setHovered(null)}
          className={cn(
            "hidden items-center gap-12 rounded-full border px-3 py-1.5 transition-all duration-300 md:flex",
            onDark
              ? "border-cream/20 bg-ink/25 shadow-[0_8px_32px_-12px_rgb(0_0_0/0.5)] backdrop-blur-xl"
              : "border-ink/10 bg-cream/85 shadow-[0_6px_24px_-12px_rgb(15_31_77/0.25)] backdrop-blur-md",
          )}
        >
          {nav.map((item) => {
            const isActive = activePill === item.id;
            return (
              <Link
                key={item.href}
                href={item.href}
                onMouseEnter={() => setHovered(item.id)}
                className="relative isolate flex items-center px-4 py-2"
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className={cn(
                      "absolute inset-0 -z-10 rounded-full transition-colors",
                      onDark
                        ? "bg-marigold shadow-[0_4px_14px_-4px_rgb(245_183_0/0.6)]"
                        : "bg-festival shadow-[0_4px_14px_-4px_rgb(30_58_138/0.5)]",
                    )}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="flex flex-col items-center leading-none">
                  <span
                    className={cn(
                      "text-[0.78rem] font-semibold tracking-wide transition-colors",
                      isActive
                        ? onDark ? "text-ink" : "text-cream"
                        : onDark ? "text-cream/95" : "text-ink/85",
                    )}
                  >
                    {item.label}
                  </span>
                  <span
                    className={cn(
                      "font-display text-[0.62rem] mt-0.5 tracking-wide transition-colors",
                      isActive
                        ? onDark ? "text-ink/70" : "text-marigold"
                        : onDark ? "text-marigold/85" : "text-festival/60",
                    )}
                  >
                    {item.labelHi}
                  </span>
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-1.5">
          <div className="hidden items-center sm:flex">
            <Link
              href={`https://instagram.com/${site.instagram}`}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full text-ink/65 transition hover:bg-marigold/20 hover:text-festival"
            >
              <InstagramIcon className="h-4 w-4" />
            </Link>
            <Link
              href={`https://facebook.com/${site.facebook}`}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full text-ink/65 transition hover:bg-marigold/20 hover:text-festival"
            >
              <FacebookIcon className="h-4 w-4" />
            </Link>
            <span className="mx-2 h-5 w-px bg-ink/15" />
          </div>

          {/* Ticket-style CTA */}
          <Button
            asChild
            size="sm"
            className="group relative h-11 rounded-full bg-festival px-5 pl-7 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-cream shadow-poster transition hover:bg-festival/90"
          >
            <Link href="/book">
              {/* Ticket punch hole */}
              <span
                aria-hidden
                className="absolute left-3 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-cream/95 ring-1 ring-festival/40"
              />
              <span className="hidden sm:inline">Book a Ride</span>
              <span className="sm:hidden">Book</span>
              <span
                aria-hidden
                className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-marigold transition group-hover:scale-150"
              />
            </Link>
          </Button>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="ml-1 inline-flex h-10 w-10 items-center justify-center rounded-full bg-ink/5 text-ink transition hover:bg-ink/10 md:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mx-4 mt-3 overflow-hidden rounded-2xl border border-ink/10 bg-cream/97 shadow-[0_20px_50px_-20px_rgb(15_31_77/0.35)] backdrop-blur md:hidden"
          >
            <nav className="flex flex-col">
              {nav.map((item, i) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "group relative flex items-center justify-between px-5 py-4 text-base text-ink transition-colors hover:bg-festival hover:text-cream",
                    i !== nav.length - 1 && "border-b border-dashed border-ink/15",
                  )}
                >
                  {/* perforation dot — ticket vibe */}
                  <span
                    aria-hidden
                    className="absolute -left-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-cream group-hover:bg-cream"
                  />
                  <span className="font-semibold tracking-wide">{item.label}</span>
                  <span className="font-display text-sm text-festival/70 transition-colors group-hover:text-marigold">
                    {item.labelHi}
                  </span>
                </Link>
              ))}
              <div className="flex items-center justify-center gap-3 border-t border-ink/10 bg-ink/[0.03] py-4">
                <Link
                  href={`https://instagram.com/${site.instagram}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-ink/70 transition hover:bg-marigold/20 hover:text-festival"
                >
                  <InstagramIcon className="h-4 w-4" />
                </Link>
                <Link
                  href={`https://facebook.com/${site.facebook}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-ink/70 transition hover:bg-marigold/20 hover:text-festival"
                >
                  <FacebookIcon className="h-4 w-4" />
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
