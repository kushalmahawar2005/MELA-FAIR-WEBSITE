"use client";

import { useEffect } from "react";
import { motion } from "motion/react";
import { useContentStore } from "@/stores/content-store";
import { Eyebrow } from "@/components/shared/eyebrow";
import type { FacilityItem } from "@/lib/content";

export function Facilities() {
  const { content, fetchContent } = useContentStore();
  const facilities = content.facilities;
  const row1 = facilities.rows[0] ?? [];
  const row2 = facilities.rows[1] ?? [];

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return (
    <section
      id="facilities"
      className="relative isolate overflow-hidden bg-deep-purple py-16 sm:py-24 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-display text-[clamp(0.85rem,1.2vw,1.1rem)] uppercase tracking-wide text-accent-yellow"
          >
            <Eyebrow className="justify-center">{facilities.eyebrow}</Eyebrow>
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 font-display text-[clamp(1.6rem,4.5vw,3rem)] leading-[1.17] text-white"
          >
            {facilities.heading}
          </motion.h2>
        </div>
      </div>

      {/* Scrolling pill rows */}
      <div className="mt-10 sm:mt-14 space-y-4 sm:space-y-5 overflow-hidden">
        {/* Row 1 — scrolls left */}
        <div className="marquee-mask relative w-full">
          <div className="flex animate-marquee gap-4" style={{ animationDuration: "35s" }}>
            {[...row1, ...row1].map((f, i) => (
              <FacilityPill key={`r1-${i}`} facility={f} />
            ))}
          </div>
        </div>

        {/* Row 2 — scrolls right */}
        <div className="marquee-mask relative w-full">
          <div className="flex animate-marquee-reverse gap-4" style={{ animationDuration: "38s" }}>
            {[...row2, ...row2].map((f, i) => (
              <FacilityPill key={`r2-${i}`} facility={f} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FacilityPill({ facility }: { facility: FacilityItem }) {
  return (
    <div className="flex shrink-0 items-center gap-2 sm:gap-3 rounded-full border border-accent-yellow/40 bg-warm-cream/10 px-4 sm:px-6 py-2 sm:py-3 backdrop-blur-sm">
      <span className="text-xl">{facility.icon}</span>
      <span className="whitespace-nowrap font-display text-[0.8rem] sm:text-[0.9rem] text-white">
        {facility.label}
      </span>
    </div>
  );
}
