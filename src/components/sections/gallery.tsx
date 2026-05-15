"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { site } from "@/lib/site";

const u = (id: string, w = 1100) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

type Shot = {
  src: string;
  alt: string;
  span: "tall" | "wide" | "square";
  caption?: string;
  captionHi?: string;
};

const shots: Shot[] = [
  {
    src: u("1517423568366-8b83523034fd", 900),
    alt: "Giant wheel lit up at night",
    span: "tall",
    caption: "Lights on",
    captionHi: "रोशनी",
  },
  {
    src: u("1533174072545-7a4b6ad7a6c3", 1200),
    alt: "Crowd at an Indian mela",
    span: "wide",
    caption: "The crowd",
    captionHi: "भीड़",
  },
  {
    src: u("1559131397-f94da358f7ca", 900),
    alt: "Carnival arcade at dusk",
    span: "square",
  },
  {
    src: u("1551817958-d9d86fb29431", 900),
    alt: "Swing ride in motion",
    span: "square",
  },
  {
    src: u("1467810563316-b5476525c0f9", 1200),
    alt: "Carnival lights blur",
    span: "wide",
    caption: "After 9pm",
    captionHi: "रात नौ बजे",
  },
  {
    src: u("1554189097-ffe88e998a2b", 900),
    alt: "Children at a fair",
    span: "tall",
  },
  {
    src: u("1530541930197-ff16ac917b0e", 900),
    alt: "Carousel detail",
    span: "square",
  },
  {
    src: u("1543872084-c7bd3822856f", 1200),
    alt: "Mela arch lit up",
    span: "wide",
    caption: "The entrance",
    captionHi: "दरवाज़ा",
  },
];

const spanClass: Record<Shot["span"], string> = {
  tall: "row-span-2",
  wide: "col-span-2",
  square: "",
};

export function Gallery() {
  return (
    <section
      id="gallery"
      className="relative isolate overflow-hidden bg-cream py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="font-display text-[0.78rem] uppercase tracking-[0.32em] text-festival">
              Postcards from the mela · तस्वीरें
            </p>
            <h2 className="mt-4 font-display text-[clamp(2.4rem,4.8vw,4.2rem)] leading-[1.02] text-ink">
              The mela is best{" "}
              <span className="italic text-mehendi">remembered</span> after dark.
            </h2>
          </div>
          <a
            href={`https://instagram.com/${site.instagram}`}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-ink/15 bg-cream px-4 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-ink transition hover:border-festival hover:text-festival"
          >
            Tag us @{site.instagram}
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </a>
        </div>

        <div className="mt-14 grid auto-rows-[180px] grid-cols-2 gap-3 sm:auto-rows-[200px] sm:gap-4 md:grid-cols-3 md:auto-rows-[220px] lg:grid-cols-4 lg:auto-rows-[240px]">
          {shots.map((s, i) => (
            <motion.figure
              key={s.src}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.03 }}
              whileHover={{ y: -4 }}
              className={`group relative overflow-hidden rounded-2xl bg-ink/5 ring-1 ring-ink/10 ${spanClass[s.span]}`}
            >
              <Image
                src={s.src}
                alt={s.alt}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent opacity-70 transition-opacity group-hover:opacity-90" />
              {s.caption && (
                <figcaption className="absolute bottom-3 left-3 right-3 flex items-baseline justify-between text-cream">
                  <span className="font-display text-lg leading-none drop-shadow">
                    {s.caption}
                  </span>
                  {s.captionHi && (
                    <span className="font-display text-sm text-marigold drop-shadow">
                      {s.captionHi}
                    </span>
                  )}
                </figcaption>
              )}
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
