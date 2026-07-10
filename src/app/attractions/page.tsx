"use client";

import { useState, useTransition, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, Search, SlidersHorizontal, Info } from "lucide-react";
import { rides, Thrill } from "@/lib/rides";
import { useRidesStore } from "@/stores/rides-store";
import { cn } from "@/lib/utils";

const categories: (Thrill | "All")[] = ["All", "Extreme", "Wild", "Medium", "Family"];

export default function AttractionsPage() {
  const [selectedThrill, setSelectedThrill] = useState<Thrill | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [, startTransition] = useTransition();
  const { rides: dynamicRides, fetchRides } = useRidesStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchRides();
  }, [fetchRides]);

  const handleThrillChange = (thrill: Thrill | "All") => {
    startTransition(() => {
      setSelectedThrill(thrill);
    });
  };

  const activeRides = mounted ? dynamicRides : rides;

  const filteredRides = activeRides.filter((ride) => {
    const matchesThrill = selectedThrill === "All" || ride.thrill === selectedThrill;
    const matchesSearch =
      ride.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ride.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ride.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesThrill && matchesSearch;
  });

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-deep-purple text-white">
      {/* Ambient backgrounds */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[10%] right-[-5%] h-[40%] w-[35%] rounded-full bg-purple-600/10 blur-[130px]" />
        <div className="absolute bottom-[30%] left-[-5%] h-[50%] w-[35%] rounded-full bg-emerald-600/10 blur-[130px]" />
      </div>

      <Header />

      <main className="relative z-10 flex-1 pt-28 pb-20 md:pt-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Header section */}
          <div className="max-w-3xl">
            <span className="font-display text-xs uppercase tracking-[0.2em] text-accent-yellow">
              THE HEART OF NAAZ
            </span>
            <h1 className="mt-4 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-none tracking-wide text-white">
              Our Rides & <br />
              <span className="text-accent-yellow">Theme Attractions</span>
            </h1>
            <p className="mt-6 text-base leading-relaxed text-white/70">
              From heart-stopping vertical drops to peaceful water currents, our selection of over 80 mechanical joyrides is built to exceed safety levels and deliver the ultimate adrenaline surge.
            </p>
          </div>

          {/* Search and Filters Strip */}
          <div className="mt-14 flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-white/10 pb-8">
            
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleThrillChange(cat)}
                  className={cn(
                    "px-5 py-2.5 rounded-full text-xs font-display tracking-wider uppercase transition active:scale-95",
                    selectedThrill === cat
                      ? "bg-accent-yellow text-deep-purple font-semibold shadow-[0_0_12px_rgba(238,167,39,0.3)]"
                      : "border border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input Box */}
            <div className="relative w-full max-w-md">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="Search rides (e.g. Striker, coaster)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-white/10 bg-white/5 py-3 pl-12 pr-6 text-xs text-white placeholder-white/30 outline-none focus:border-accent-yellow focus:bg-white/10 transition"
              />
            </div>
          </div>

          {/* Rides Grid */}
          <div className="mt-12">
            {filteredRides.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                <AnimatePresence mode="popLayout">
                  {filteredRides.map((ride, i) => (
                    <motion.article
                      key={ride.slug}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
                      className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-300 hover:shadow-2xl hover:border-white/20 hover:-translate-y-1"
                    >
                      <Link href={`/rides/${ride.slug}`} className="block h-full">
                        {/* Image Container with fixed aspect ratio */}
                        <div className="relative aspect-[4/3] w-full overflow-hidden">
                          <Image
                            src={ride.image}
                            alt={ride.name}
                            fill
                            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                          <div className="absolute top-4 left-4 z-10">
                            <span
                              className={cn(
                                "inline-block rounded-md px-3 py-1 text-[9px] font-display uppercase tracking-widest font-semibold text-white",
                                ride.thrill === "Extreme" && "bg-red-600/90",
                                ride.thrill === "Wild" && "bg-orange-500/90",
                                ride.thrill === "Medium" && "bg-yellow-500/90 text-black",
                                ride.thrill === "Family" && "bg-green-600/90"
                              )}
                            >
                              {ride.thrill}
                            </span>
                          </div>
                        </div>

                        {/* Card Info */}
                        <div className="p-6">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="font-display text-xl tracking-wide text-white group-hover:text-accent-yellow transition">
                              {ride.name}
                            </h3>
                            <span className="text-[10px] text-white/40 font-mono">
                              {ride.duration}
                            </span>
                          </div>
                          <span className="mt-1 block text-[10px] text-accent-yellow font-display uppercase tracking-widest">
                            Hindi: {ride.nameHi}
                          </span>
                          <p className="mt-3 text-xs leading-relaxed text-white/50 line-clamp-2">
                            {ride.tagline}
                          </p>

                          <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                            <span className="text-[10px] text-white/40 uppercase tracking-widest">
                              Min Age: {ride.minAge} Yrs
                            </span>
                            <span className="inline-flex items-center gap-1 text-[10px] font-display uppercase tracking-widest text-accent-yellow group-hover:underline">
                              View Details <ArrowUpRight className="h-3.5 w-3.5" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              // Empty State
              <div className="flex flex-col items-center justify-center py-20 text-center rounded-[2rem] border border-dashed border-white/10 bg-white/[0.01]">
                <Info className="h-12 w-12 text-accent-yellow animate-pulse mb-4" />
                <h3 className="font-display text-2xl text-white">No Rides Found</h3>
                <p className="mt-2 text-xs text-white/50 max-w-sm">
                  We couldn't find any rides matching "{searchQuery}" under {selectedThrill} Thrill level. Try resetting your search filters!
                </p>
                <button
                  onClick={() => {
                    setSelectedThrill("All");
                    setSearchQuery("");
                  }}
                  className="mt-6 rounded-full bg-accent-yellow px-6 py-2.5 text-xs font-display tracking-widest text-deep-purple"
                >
                  RESET SEARCH FILTERS
                </button>
              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
