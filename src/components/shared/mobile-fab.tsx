"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, X, Phone, Ticket } from "lucide-react";
import Link from "next/link";
import { site, waLink } from "@/lib/site";

export function MobileFab() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 left-5 z-[55] sm:hidden">
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              transition={{ duration: 0.25 }}
              className="absolute bottom-16 left-0 flex flex-col gap-3"
            >
              {/* Call Us */}
              <a
                href={`tel:${site.phone}`}
                className="flex items-center gap-3 rounded-full bg-white px-5 py-3 shadow-xl"
                onClick={() => setOpen(false)}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-deep-purple">
                  <Phone className="h-4 w-4 text-accent-yellow" />
                </span>
                <span className="font-display text-[0.85rem] uppercase tracking-wide text-deep-purple">
                  Call Us
                </span>
              </a>

              {/* Book Ticket */}
              <Link
                href={site.bookingUrl}
                className="flex items-center gap-3 rounded-full bg-white px-5 py-3 shadow-xl"
                onClick={() => setOpen(false)}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-yellow">
                  <Ticket className="h-4 w-4 text-deep-purple" />
                </span>
                <span className="font-display text-[0.85rem] uppercase tracking-wide text-deep-purple">
                  Book Ticket
                </span>
              </Link>

              {/* WhatsApp */}
              <a
                href={waLink("Hi! I'd like to know more about Naaz Amusement Jaipur.")}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center gap-3 rounded-full bg-white px-5 py-3 shadow-xl"
                onClick={() => setOpen(false)}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366]">
                  <svg viewBox="0 0 32 32" className="h-4 w-4" fill="white" aria-hidden>
                    <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.888 2.722.888.358 0 2.13-.43 2.13-1.59 0-.143-.27-.286-.36-.330-.515-.244-1.36-.66-1.755-.785zM16.32 6.05a8.85 8.85 0 0 0-8.85 8.85c0 1.534.395 3.025 1.146 4.345l-1.404 5.16 5.297-1.318a8.83 8.83 0 0 0 4.04.967h.004a8.85 8.85 0 0 0 8.85-8.85c0-2.36-.916-4.585-2.59-6.26a8.79 8.79 0 0 0-6.26-2.59zm-.04 16.01h-.005a7.13 7.13 0 0 1-3.628-1l-.262-.16-3.143.825.838-3.07-.17-.27a7.16 7.16 0 0 1-1.09-3.79c0-3.95 3.224-7.165 7.165-7.165 1.915 0 3.715.745 5.07 2.1 1.355 1.355 2.1 3.16 2.1 5.07 0 3.945-3.22 7.165-7.16 7.165z" />
                  </svg>
                </span>
                <span className="font-display text-[0.85rem] uppercase tracking-wide text-deep-purple">
                  WhatsApp
                </span>
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main FAB button */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileTap={{ scale: 0.9 }}
        className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-deep-purple text-white shadow-[0_8px_28px_-4px_rgba(33,12,109,0.6)] ring-2 ring-accent-yellow/50"
      >
        <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }}>
          {open ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
        </motion.div>
        {!open && (
          <span className="absolute inset-0 -z-10 rounded-full bg-deep-purple motion-safe:animate-ping opacity-20" />
        )}
      </motion.button>
    </div>
  );
}
