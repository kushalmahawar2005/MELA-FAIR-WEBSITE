"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Eyebrow } from "@/components/shared/eyebrow";
import { ArrowUpRight } from "lucide-react";
import { rides as defaultRides } from "@/lib/rides";
import { useRidesStore } from "@/stores/rides-store";
import { useContentStore } from "@/stores/content-store";

// Show only the first 2 rows on the homepage (4 cards per row on desktop).
// The rest are accessible via the "View all attractions" button.
const PREVIEW_COUNT = 8;

export function Rides() {
  const { content, fetchContent } = useContentStore();
  const { rides: dynamicRides, fetchRides } = useRidesStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchRides();
    fetchContent();
  }, [fetchRides, fetchContent]);

  const section = content.rides;
  const allRides = mounted && dynamicRides.length > 0 ? dynamicRides : defaultRides;
  const rides = allRides.slice(0, PREVIEW_COUNT);

  return (
    <section
      id="rides"
      className="relative isolate overflow-hidden bg-deep-purple py-16 sm:py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-8">
        {/* Header */}
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="font-display text-[clamp(0.85rem,1.2vw,1.1rem)] uppercase tracking-wide text-accent-yellow">
              <Eyebrow>{section.eyebrow}</Eyebrow>
            </p>
            <h2 className="mt-3 sm:mt-4 font-display text-[clamp(2.4rem,4.8vw,4.2rem)] leading-[1.02] text-white">
              {section.headingLead}{" "}
              <span className="text-accent-yellow">{section.headingAccent}</span>{" "}
              {section.headingTrail}
            </h2>
          </div>
          <p className="max-w-sm text-[0.98rem] leading-relaxed text-white/70">
            {section.subtext}
          </p>
        </div>

        {/* 2-row preview grid */}
        <div className="mt-10 sm:mt-14 grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4">
          {rides.map((r, i) => (
            <motion.article
              key={r.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
              className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-white/5 transition-shadow hover:shadow-xl"
            >
              <Link
                href={`/rides/${r.slug}`}
                className="block h-full w-full"
                aria-label={`${r.name} — view details`}
              >
                <Image
                  src={r.image}
                  alt={r.name}
                  fill
                  sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
                  className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                />

                {/* gradient scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

                {/* name overlay */}
                <div className="absolute inset-x-3 bottom-3 text-white">
                  <div className="flex items-end justify-between gap-2">
                    <div>
                      <div className="font-display text-[1.1rem] sm:text-[1.4rem] leading-tight drop-shadow-md md:text-[1.7rem]">
                        {r.name}
                      </div>
                    </div>
                    <span
                      aria-hidden
                      className="flex h-9 w-9 shrink-0 translate-y-2 items-center justify-center rounded-full bg-accent-yellow text-deep-purple opacity-0 shadow-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* See all CTA */}
        <div className="mt-12 flex justify-center">
          <Link href="/attractions" className="btn-glass group">
            View all attractions
            <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
