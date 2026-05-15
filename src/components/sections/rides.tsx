"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { rides } from "@/lib/rides";
import { cn } from "@/lib/utils";

// Masonry tile sizes — varied aspect ratios for visual rhythm.
// Pattern repeats so order stays predictable as more rides are added.
const tileSizes = [
  "md:row-span-2 aspect-[3/4]",      // tall
  "aspect-[4/3]",                     // wide
  "aspect-[4/3]",                     // wide
  "md:row-span-2 aspect-[3/4]",      // tall
  "aspect-[4/3]",                     // wide
  "md:row-span-2 aspect-[3/4]",      // tall
  "md:row-span-2 aspect-[3/4]",      // tall
  "aspect-[4/3]",                     // wide
];

export function Rides() {
  return (
    <section
      id="rides"
      className="relative isolate overflow-hidden bg-cream py-24 md:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(circle at 10% 0%, rgba(245,183,0,0.18), transparent 40%), radial-gradient(circle at 90% 100%, rgba(30,58,138,0.10), transparent 50%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        {/* Header */}
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="font-display text-[0.78rem] uppercase tracking-[0.32em] text-festival">
              Our Jhoolas · हमारे झूले
            </p>
            <h2 className="mt-4 font-display text-[clamp(2.4rem,4.8vw,4.2rem)] leading-[1.02] text-ink">
              Eight rides.{" "}
              <span className="italic text-festival">A thousand</span> stories
              from the swing.
            </h2>
          </div>
          <p className="max-w-sm text-[0.98rem] leading-relaxed text-ink/70">
            From hand-painted carousel horses to a 60-foot giant wheel — every
            jhoola is checked, polished and re-painted before every mela.
          </p>
        </div>

        {/* Masonry gallery */}
        <div className="mt-14 grid auto-rows-[180px] grid-cols-2 gap-1.5 md:auto-rows-[200px] md:grid-cols-3 md:gap-2 lg:grid-cols-4">
          {rides.map((r, i) => (
            <motion.article
              key={r.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
              className={cn(
                "group relative overflow-hidden bg-ink/5 transition-shadow hover:shadow-xl",
                tileSizes[i % tileSizes.length],
              )}
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
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/15 to-transparent" />

                {/* name overlay — bottom */}
                <div className="absolute inset-x-3 bottom-3 text-cream">
                  <div className="flex items-end justify-between gap-2">
                    <div>
                      <div className="font-display text-[1.4rem] leading-tight drop-shadow-md md:text-[1.7rem]">
                        {r.name}
                      </div>
                      <div className="mt-0.5 font-display text-[0.85rem] leading-none text-marigold drop-shadow-md devanagari">
                        {r.nameHi}
                      </div>
                    </div>
                    <span
                      aria-hidden
                      className="flex h-9 w-9 shrink-0 translate-y-2 items-center justify-center rounded-full bg-marigold text-ink opacity-0 shadow-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
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
          <Link
            href="/rides"
            className="group inline-flex items-center gap-2 rounded-full border border-ink/15 bg-cream/60 px-6 py-3 text-[0.74rem] font-semibold uppercase tracking-[0.2em] text-ink shadow-sm backdrop-blur transition hover:border-festival/40 hover:bg-festival hover:text-cream"
          >
            View all jhoolas
            <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
