"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Star } from "lucide-react";
import { useContentStore } from "@/stores/content-store";
import { Eyebrow } from "@/components/shared/eyebrow";
import type { Review } from "@/lib/content";

export function Testimonials() {
  const { content, fetchContent } = useContentStore();
  const testimonials = content.testimonials;
  const reviews = testimonials.reviews;
  const TOTAL = reviews.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleActive = useCallback((i: number) => {
    setActiveIndex(i);
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return (
    <section className="relative isolate overflow-hidden bg-white py-16 sm:py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-8">
        {/* Header */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-display text-[clamp(0.85rem,1.2vw,1.1rem)] uppercase tracking-wide text-accent-yellow"
        >
          <Eyebrow>{testimonials.eyebrow}</Eyebrow>
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-4 max-w-2xl font-display text-[clamp(1.8rem,3.5vw,2.375rem)] leading-[1.37] tracking-[0.76px] text-deep-purple"
        >
          {testimonials.heading}
        </motion.h2>

        {/* Testimonial cards */}
        <div ref={containerRef} className="mt-10 sm:mt-16 space-y-16 sm:space-y-24">
          {reviews.map((review, i) => (
            <TestimonialCard
              key={review.name}
              review={review}
              index={i}
              total={TOTAL}
              onActive={handleActive}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  review,
  index,
  total,
  onActive,
}: {
  review: Review;
  index: number;
  total: number;
  onActive: (i: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onActive(index);
      },
      { rootMargin: "-30% 0px -30% 0px", threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [index, onActive]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.65 }}
      className="grid grid-cols-1 items-start gap-6 sm:gap-10 lg:grid-cols-2 lg:gap-16"
    >
      {/* Left — Image with counter */}
      <div className="relative overflow-hidden rounded-xl">
        <div className="relative aspect-[4/3] sm:aspect-[3/4] w-full">
          <Image
            src={review.image}
            alt={`${review.name} review`}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          {/* Big number overlay */}
          <div className="absolute bottom-8 left-8">
            <span className="font-display text-[clamp(4rem,8vw,7.5rem)] leading-none text-accent-yellow drop-shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="font-display text-[clamp(2rem,4vw,4rem)] leading-none text-accent-yellow/30">
              /{String(total).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

      {/* Right — Quote + narrative */}
      <div className="flex flex-col justify-center">
        {/* Pull quote */}
        <blockquote className="font-display text-[clamp(1.1rem,2.5vw,2rem)] leading-[1.38] tracking-[-0.32px] text-deep-purple">
          &ldquo;{review.quote}&rdquo;
        </blockquote>

        {/* Narrative */}
        <p className="mt-4 sm:mt-6 font-display text-[clamp(0.85rem,1.5vw,1.25rem)] leading-[1.38] tracking-[-0.2px] text-deep-purple/70">
          {review.narrative}
        </p>

        {/* Author */}
        <div className="mt-8">
          <p className="font-display text-[1.25rem] leading-[1.4] tracking-[-0.2px] text-accent-magenta">
            {review.name}
          </p>
          <p className="mt-1 font-display text-[0.875rem] text-deep-purple/60">
            Google Review
          </p>
          {/* Stars */}
          <div className="mt-2 flex items-center gap-1">
            {Array.from({ length: review.rating }).map((_, j) => (
              <Star
                key={j}
                className="h-4 w-4 fill-accent-yellow text-accent-yellow"
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
