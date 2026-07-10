"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Eyebrow } from "@/components/shared/eyebrow";
import { useContentStore } from "@/stores/content-store";

export function Gallery() {
  const { content, fetchContent } = useContentStore();
  const gallery = content.gallery;
  const rows = gallery.rows;

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return (
    <section
      id="gallery"
      className="relative isolate overflow-hidden bg-deep-purple py-16 sm:py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-8">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-display text-[clamp(0.85rem,1.2vw,1.1rem)] uppercase tracking-wide text-accent-yellow"
        >
          <Eyebrow>{gallery.eyebrow}</Eyebrow>
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-4 max-w-2xl font-display text-[clamp(2rem,4.5vw,3rem)] leading-[1.17] tracking-[0.96px] text-white"
        >
          {gallery.heading}
        </motion.h2>
      </div>

      {/* 3-row scrolling gallery */}
      <div className="mt-10 sm:mt-14 space-y-4 sm:space-y-6">
        {rows.map((row, rowIdx) => (
          <div
            key={rowIdx}
            className="marquee-mask relative w-full overflow-hidden"
          >
            <div
              className={`flex gap-3 sm:gap-5 ${
                rowIdx % 2 === 0 ? "animate-marquee" : "animate-marquee-reverse"
              }`}
              style={{ animationDuration: `${40 + rowIdx * 8}s` }}
            >
              {[...row, ...row].map((img, i) => (
                <div
                  key={`${rowIdx}-${i}`}
                  className="relative shrink-0"
                  style={{
                    transform: `rotate(${(i % 2 === 0 ? -2 : 2)}deg)`,
                  }}
                >
                  <div className="relative h-[150px] w-[200px] sm:h-[200px] sm:w-[280px] overflow-hidden rounded-sm border-[4px] sm:border-[6px] border-white bg-white shadow-xl md:h-[240px] md:w-[340px]">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="340px"
                      className="object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
