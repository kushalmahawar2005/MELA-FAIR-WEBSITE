"use client";

import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { motion } from "motion/react";
import { ArrowLeft, Ticket, Calendar, ShieldCheck, Heart, User, Hourglass, Award, Sparkles } from "lucide-react";
import { rides as defaultRides, formatPrice } from "@/lib/rides";
import { useRidesStore } from "@/stores/rides-store";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function RideDetailClient({ slug }: { slug: string }) {
  const { rides: dynamicRides } = useRidesStore();
  const [mounted, setMounted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const activeRides = mounted ? dynamicRides : defaultRides;
  const ride = activeRides.find((r) => r.slug === slug);

  if (!ride) {
    return (
      <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#0A0514] text-white">
        <Header />
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center py-32 text-center">
          <h1 className="font-display text-4xl text-accent-yellow">Ride Not Found</h1>
          <p className="mt-4 text-xs text-white/50">The attraction you are looking for does not exist.</p>
          <Link
            href="/attractions"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-accent-yellow px-8 text-xs font-display tracking-widest text-deep-purple"
          >
            BACK TO ATTRACTIONS
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Handle wishlist toggle with a spring-like toast feedback
  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      toast.success(`${ride.name} added to your wishlist!`, {
        icon: "💖",
      });
    } else {
      toast.info(`${ride.name} removed from your wishlist.`);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-deep-purple text-white">
      {/* Immersive Background tint */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-[10%] left-[-10%] h-[60%] w-[60%] rounded-full blur-[160px] opacity-25 mix-blend-screen transition-all duration-700"
          style={{ backgroundColor: ride.tint }}
        />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay" />
      </div>

      <Header />

      <main className="relative z-10 flex-1 pt-28 pb-20 md:pt-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Back link */}
          <Link
            href="/attractions"
            className="group relative mb-8 inline-flex items-center gap-2 text-[0.8rem] font-semibold uppercase tracking-[0.1em] text-white/50 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
            Back to Attractions
          </Link>

          {/* Core Layout Grid */}
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16 items-start">
            
            {/* Left Column: Visual Showcase */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative rounded-[2rem] border border-white/10 bg-white/[0.02] p-4 sm:p-5 backdrop-blur-2xl shadow-2xl overflow-hidden group"
            >
              {/* Aspect Ratio Container for Responsive Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.5rem]">
                <Image
                  src={ride.image}
                  alt={ride.name}
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 95vw"
                  className="object-cover transition-transform duration-[1200ms] group-hover:scale-102"
                />

                {/* Heart/Wishlist Button */}
                <button
                  onClick={handleLikeToggle}
                  aria-label="Add to wishlist"
                  className="absolute top-6 right-6 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white transition hover:bg-black/60 active:scale-90"
                >
                  <Heart
                    className={cn(
                      "h-5 w-5 transition-transform duration-300",
                      isLiked ? "fill-red-500 stroke-red-500 scale-110" : "stroke-white"
                    )}
                  />
                </button>

                {/* Thrill Badge */}
                <div className="absolute top-6 left-6 z-20">
                  <span
                    className={cn(
                      "inline-block rounded-md px-4 py-1.5 text-[10px] font-display uppercase tracking-widest font-bold text-white shadow-md",
                      ride.thrill === "Extreme" && "bg-red-600/90",
                      ride.thrill === "Wild" && "bg-orange-500/90",
                      ride.thrill === "Medium" && "bg-yellow-500/90 text-black",
                      ride.thrill === "Family" && "bg-green-600/90"
                    )}
                  >
                    {ride.thrill} Thrill
                  </span>
                </div>

                {/* Bottom Scrim overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
              </div>
            </motion.div>

            {/* Right Column: Ride Details & CTA */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex flex-col justify-between"
            >
              <div>
                <span className="font-display text-xs uppercase tracking-[0.2em] text-accent-yellow">
                  ATTRACTION PROFILE
                </span>
                <h1 className="mt-4 font-display text-[clamp(2.2rem,5vw,3.5rem)] leading-none tracking-wide text-white">
                  {ride.name} <br />
                  <span className="text-accent-yellow">{ride.nameHi}</span>
                </h1>
                
                <p className="mt-4 font-geist text-sm md:text-base italic text-white/80 leading-relaxed border-l-2 border-accent-yellow pl-4">
                  &ldquo;{ride.tagline}&rdquo;
                </p>

                <p className="mt-6 text-sm md:text-base leading-relaxed text-white/60">
                  {ride.description}
                </p>

                {/* Ride Specifications Grid */}
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-white/5 bg-white/[0.01] p-4 flex items-center gap-3">
                    <User className="h-5 w-5 text-accent-yellow shrink-0" />
                    <div>
                      <span className="block text-[10px] text-white/40 uppercase tracking-widest font-display">Min Age Limit</span>
                      <span className="text-sm font-semibold">{ride.minAge} Years+</span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-white/[0.01] p-4 flex items-center gap-3">
                    <Hourglass className="h-5 w-5 text-accent-yellow shrink-0" />
                    <div>
                      <span className="block text-[10px] text-white/40 uppercase tracking-widest font-display">Ride Duration</span>
                      <span className="text-sm font-semibold">{ride.duration}</span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-white/[0.01] p-4 flex items-center gap-3">
                    <Award className="h-5 w-5 text-accent-yellow shrink-0" />
                    <div>
                      <span className="block text-[10px] text-white/40 uppercase tracking-widest font-display">Rider Capacity</span>
                      <span className="text-sm font-semibold">{ride.capacity} Riders</span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-white/[0.01] p-4 flex items-center gap-3">
                    <Ticket className="h-5 w-5 text-accent-yellow shrink-0" />
                    <div>
                      <span className="block text-[10px] text-white/40 uppercase tracking-widest font-display">Event Rental Rate</span>
                      <span className="text-sm font-semibold">{formatPrice(ride.pricePaise)} / day</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-10 space-y-4 border-t border-white/10 pt-8">
                <Link
                  href={`/book?ride=${ride.slug}`}
                  className="group relative flex h-16 w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-accent-yellow font-display text-[1.1rem] tracking-[0.1em] text-deep-purple shadow-[0_0_20px_rgba(238,167,39,0.25)] transition-all hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(238,167,39,0.45)]"
                >
                  <Ticket className="h-5 w-5 animate-pulse" />
                  BOOK EVENT SETUP WITH THIS RIDE
                </Link>

                <div className="flex items-center justify-center gap-2.5 text-xs text-white/40">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Fully insured setup with professional safety operators</span>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
