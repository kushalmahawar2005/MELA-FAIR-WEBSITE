"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Menu, Settings, X } from "lucide-react";
import { site } from "@/lib/site";
import { useAuthStore } from "@/stores/auth-store";
import { isAdminEmail } from "@/lib/admin";

const navLinks = [
  { label: "HOME", href: "/" },
  { label: "ABOUT US", href: "/about" },
  { label: "ATTRACTIONS", href: "/attractions" },
  { label: "TICKET INFO", href: "/ticket-info" },
  { label: "CONTACT US", href: "/contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user } = useAuthStore();
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasHydrated(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const loggedIn = hasHydrated && user;
  const isAdmin = Boolean(loggedIn && isAdminEmail(user?.email));

  const dynamicLinks = [
    ...navLinks,
    loggedIn
      ? { label: "MY PROFILE", href: "/profile" }
      : { label: "SIGN IN", href: "/login" },
    { label: "ADMIN PORTAL", href: "/admin" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed top-0 left-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "bg-deep-purple/90 backdrop-blur-md py-2.5 sm:py-3"
            : "bg-transparent py-3 sm:py-5"
        )}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 sm:px-6 md:px-10">
          {/* Book Tickets — left */}
          <Link
            href={site.bookingUrl}
            className="font-display text-[12px] sm:text-[14px] tracking-[-0.14px] text-fk-offwhite underline underline-offset-4 transition hover:text-accent-yellow"
          >
            BOOK TICKETS
          </Link>

          {/* Logo center (visible on scroll) */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <motion.div
              initial={false}
              animate={{ opacity: scrolled ? 1 : 0, scale: scrolled ? 1 : 0.8 }}
              transition={{ duration: 0.3 }}
              className="pointer-events-auto"
            >
              <span className="font-display text-[1rem] sm:text-[1.3rem] tracking-wide text-white whitespace-nowrap">
                Naaz<span className="text-accent-yellow"> Amusement</span>
              </span>
            </motion.div>
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-4 sm:gap-6">
            {hasHydrated && (
              <Link
                href={loggedIn ? "/profile" : "/login"}
                className="font-display text-[12px] sm:text-[14px] tracking-wide text-fk-offwhite hover:text-accent-yellow transition uppercase"
              >
                {loggedIn ? `HI, ${user.name.split(" ")[0]}` : "SIGN IN"}
              </Link>
            )}

            {isAdmin && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 rounded-full border border-accent-yellow/40 bg-white/5 px-3 py-1.5 font-display text-[11px] uppercase tracking-widest text-accent-yellow transition hover:border-accent-yellow hover:bg-accent-yellow hover:text-deep-purple"
              >
                <Settings className="h-3.5 w-3.5" />
                Admin Panel
              </Link>
            )}

            {/* Menu — right */}
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-2 sm:gap-3 font-display text-[18px] sm:text-[24px] leading-[28px] tracking-normal text-[#EDEDED] transition hover:text-white"
            >
              <span className="hidden sm:inline">MENU</span>
              {open ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Fullscreen Menu Overlay */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3, type: "spring", bounce: 0.2 }}
              className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="font-display text-xl tracking-wide text-deep-purple">NAVIGATION</span>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-gray-100 p-2 text-gray-600 transition hover:bg-gray-200 hover:text-gray-900"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex flex-col gap-2">
                {dynamicLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center rounded-xl px-4 py-3 text-[15px] font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-accent-magenta"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <Link
                  href={site.bookingUrl}
                  className="flex w-full items-center justify-center rounded-full bg-deep-purple px-6 py-3.5 font-display text-[14px] uppercase tracking-wide text-white transition hover:bg-accent-magenta"
                >
                  BOOK YOUR TICKETS
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
