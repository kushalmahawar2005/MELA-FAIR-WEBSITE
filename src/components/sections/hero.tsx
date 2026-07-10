"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { site } from "@/lib/site";
import { useContentStore } from "@/stores/content-store";

type Stat = {
  endValue: number;
  suffix: string;
  label: string;
};

function AnimatedCounter({ endValue, suffix }: { endValue: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const startTime = performance.now();
          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * endValue));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [endValue]);

  return (
    <span ref={ref} className="font-display text-[clamp(2rem,5vw,4.75rem)] leading-none text-accent-yellow">
      {count}{suffix}
    </span>
  );
}

export function Hero() {
  const { content, fetchContent } = useContentStore();
  const hero = content.hero;
  const stats = hero.stats as Stat[];
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const scrollOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return (
    <section
      ref={ref}
      className="relative w-full bg-deep-purple"
    >
      {/* HERO TOP — Photo + wordmark + offer */}
      <div className="relative min-h-[100svh] w-full overflow-hidden">
        {/* Background photo */}
        <div className="absolute inset-0">
          <Image
            src="/hero-mela.jpg"
            alt="Naaz Amusement park at night with rides, lights, and crowds"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Gradient overlays to blend into purple + ensure text legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-deep-purple" />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(ellipse at center, transparent 30%, rgba(33,12,109,0.55) 100%)",
            }}
          />
        </div>

        {/* Center wordmark + CTAs */}
        <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-4 text-center">
          {/* Offer pill */}
          {hero.offer.enabled && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              <Link
                href={site.bookingUrl}
                className="group inline-flex items-center gap-2 rounded-full border border-accent-yellow/40 bg-deep-purple/40 px-4 py-1.5 text-[clamp(0.65rem,1.6vw,0.8rem)] font-display uppercase tracking-wider text-accent-yellow backdrop-blur-md transition hover:border-accent-yellow hover:bg-deep-purple/60"
              >
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent-yellow animate-pulse" />
                {hero.offer.eyebrow} {hero.offer.title}
              </Link>
            </motion.div>
          )}

          {/* Wordmark */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 font-display uppercase leading-[0.92] tracking-[0.02em] text-white drop-shadow-[0_6px_30px_rgba(0,0,0,0.6)] text-[clamp(2.2rem,11vw,8.5rem)]"
          >
            {site.name.split(" ").map((word, i) => (
              <span key={word} className={i === 1 ? "block text-accent-yellow" : "block"}>
                {word}
              </span>
            ))}
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="mt-6 max-w-2xl font-body text-[clamp(0.9rem,1.8vw,1.2rem)] leading-relaxed text-white drop-shadow-md font-medium"
          >
            {hero.body}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="mt-8 flex w-full max-w-md flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row sm:gap-4"
          >
            <Link href={site.bookingUrl} className="btn-primary w-full sm:w-auto">
              Book Tickets
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/attractions" className="btn-glass w-full sm:w-auto">
              Explore Rides
            </Link>
          </motion.div>
        </div>

        {/* Scroll down indicator */}
        <motion.div
          style={{ opacity: scrollOpacity }}
          className="absolute bottom-6 sm:bottom-8 left-1/2 z-20 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-1.5 sm:gap-2">
            <span className="font-display text-[12px] sm:text-[16px] uppercase tracking-wide text-white">
              SCROLL DOWN
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowDown className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* HERO BOTTOM — Purple section with copy + stats */}
      <div className="relative z-10 bg-deep-purple px-4 py-14 sm:px-5 sm:py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-5xl">
          {/* Body copy */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center font-body text-[clamp(0.9rem,1.3vw,1.125rem)] leading-relaxed text-white/90"
          >
            {hero.body}
          </motion.p>

          {/* Description */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mx-auto mt-8 sm:mt-12 max-w-4xl text-center font-display text-[clamp(1.1rem,2.5vw,2rem)] leading-[1.38] tracking-[-0.32px] text-white"
          >
            {hero.description}
          </motion.h2>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 sm:mt-16 grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4 bg-white/5 border border-white/10 rounded-[2rem] p-6 sm:p-10 backdrop-blur-md shadow-2xl"
          >
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`flex flex-col items-center gap-2 sm:gap-3 ${i < stats.length - 1
                  ? "md:border-r md:border-white/15"
                  : ""
                  }`}
              >
                <AnimatedCounter endValue={stat.endValue} suffix={stat.suffix} />
                <span className="font-display text-[clamp(0.75rem,1.2vw,1rem)] uppercase tracking-widest text-white text-center font-semibold">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Fixed sun accent — top right */}
      <div className="pointer-events-none fixed right-5 top-24 z-30 hidden md:block">
        <SunBurst className="h-12 w-12 text-accent-yellow drop-shadow-[0_4px_18px_rgba(238,167,39,0.6)]" />
      </div>
    </section>
  );
}

function SunBurst({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="currentColor" className={className} aria-hidden>
      {Array.from({ length: 12 }).map((_, i) => (
        <rect
          key={i}
          x="22"
          y="2"
          width="4"
          height="10"
          rx="2"
          transform={`rotate(${i * 30} 24 24)`}
        />
      ))}
      <circle cx="24" cy="24" r="8" />
    </svg>
  );
}
