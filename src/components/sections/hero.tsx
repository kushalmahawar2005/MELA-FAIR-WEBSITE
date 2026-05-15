"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";
import { waLink } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative isolate min-h-[100svh] w-full overflow-hidden">
      {/* Background image — replace /public/hero-mela.svg with your photo */}
      <Image
        src="/hero-mela.png"
        alt=""
        aria-hidden
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />


      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-4 pt-28 pb-32 sm:px-5 md:px-8 md:pt-40 md:pb-40">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
        >
          <Button
            asChild
            size="lg"
            className="group h-12 rounded-full bg-marigold px-5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-ink shadow-poster transition hover:bg-marigold/90 sm:h-13 sm:px-7 sm:text-[0.78rem] sm:tracking-[0.2em]"
          >
            <Link href="/book">
              Book a Ride
              <ArrowRight className="ml-1 h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 rounded-full border-cream/30 bg-cream/5 px-5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-cream backdrop-blur-md hover:bg-cream/15 hover:border-cream/50 hover:text-cream sm:h-13 sm:px-7 sm:text-[0.78rem] sm:tracking-[0.2em]"
          >
            <Link
              href={waLink(
                "Hi NAAZ BROTHERS! We'd love to invite your mela to our city. Can we discuss?",
              )}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="mr-1.5 h-4 w-4 text-marigold" />
              <span className="hidden sm:inline">Invite Us to Your City</span>
              <span className="sm:hidden">Invite Us</span>
            </Link>
          </Button>
        </motion.div>
      </div>

      {/* Subtle stat strip at bottom */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="absolute inset-x-0 bottom-0 z-10 border-t border-cream/15 bg-ink/40 backdrop-blur-md"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-3 gap-3 px-4 py-3 sm:gap-6 sm:px-5 sm:py-4 md:px-8">
          {[
            { k: "55+", v: "Years", vFull: "Years of rounaq" },
            { k: "8", v: "Jhoolas", vFull: "Iconic jhoolas" },
            { k: "1M+", v: "Faces", vFull: "Happy faces yearly" },
          ].map((s) => (
            <div
              key={s.v}
              className="flex flex-col items-start gap-0.5 sm:flex-row sm:items-baseline sm:gap-3"
            >
              <div className="font-display text-xl text-marigold sm:text-2xl md:text-3xl">
                {s.k}
              </div>
              <div className="text-[0.6rem] uppercase tracking-[0.16em] text-cream/70 sm:text-[0.65rem] md:text-[0.72rem]">
                <span className="sm:hidden">{s.v}</span>
                <span className="hidden sm:inline">{s.vFull}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
