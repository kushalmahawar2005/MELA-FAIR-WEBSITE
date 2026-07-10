"use client";

import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { motion } from "motion/react";
import { MapPin, Shield, Star, Users, Award, Landmark } from "lucide-react";
import { FerrisWheel } from "@/components/decor/ferris-wheel";
import { site } from "@/lib/site";
import Link from "next/link";

const stats = [
  { label: "Years of Legacy", value: `40+` },
  { label: "Rides & Attractions", value: site.ridesCount },
  { label: "Google Reviews", value: site.googleReviews },
  { label: "States Covered", value: "3" },
];

const pillars = [
  {
    icon: Shield,
    title: "Safety First",
    description: "Every ride undergoes rigorous daily safety inspections and complies with international safety standards.",
  },
  {
    icon: Star,
    title: "Absolute Adrenaline",
    description: "From massive 100ft spinners to high-speed looping coasters, we deliver top-tier thrills.",
  },
  {
    icon: Users,
    title: "Memories For All",
    description: "Multi-generational experiences where children, teens, parents, and grandparents find joy.",
  },
  {
    icon: Landmark,
    title: "Cultural Pride",
    description: "Celebrating Rajasthan's rich culture with locally curated food, crafts, and festive theme décors.",
  },
];

export default function AboutPage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-deep-purple text-white">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[20%] left-[-10%] h-[50%] w-[40%] rounded-full bg-purple-600/10 blur-[130px]" />
        <div className="absolute bottom-[20%] right-[-10%] h-[50%] w-[40%] rounded-full bg-emerald-600/10 blur-[130px]" />
      </div>

      <Header />

      <main className="relative z-10 flex-1 pt-28 pb-20 md:pt-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Hero Section */}
          <div className="relative grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="font-display text-xs uppercase tracking-[0.2em] text-accent-yellow">
                WELCOME TO NAAZ AMUSEMENT
              </span>
              <h1 className="mt-4 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-none tracking-wide text-white">
                North India's Favourite <br />
                <span className="text-accent-yellow">Traveling Carnival</span>
              </h1>
              <p className="mt-6 text-base leading-relaxed text-white/70 max-w-xl">
                For 40 years, Naaz Amusement has been lighting up melas, fairs, and city festivals across Rajasthan, Delhi, and Uttar Pradesh. We don't have a fixed address — we bring the carnival to your city.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href={site.bookingUrl}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-accent-yellow px-8 text-xs font-display tracking-widest text-deep-purple transition hover:scale-[1.02] shadow-[0_0_15px_rgba(238,167,39,0.25)]"
                >
                  BOOK SETUP NOW
                </Link>
                <Link
                  href="/attractions"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 text-xs font-display tracking-widest text-white transition hover:bg-white/10"
                >
                  EXPLORE ATTRACTIONS
                </Link>
              </div>
            </motion.div>

            {/* Floating Ferris Wheel illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="w-full max-w-[360px] md:max-w-[420px] aspect-square rounded-full border border-white/5 bg-white/[0.01] p-8 shadow-2xl backdrop-blur-sm relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-accent-magenta/10 via-transparent to-accent-yellow/5 rounded-full" />
                <FerrisWheel className="w-full h-full text-accent-yellow" spokes={12} />
              </div>
            </motion.div>
          </div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-24 grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8 rounded-[2rem] border border-white/10 bg-white/[0.02] p-8 md:p-12 backdrop-blur-md"
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <span className="block font-display text-[clamp(2.5rem,5vw,4rem)] leading-none text-accent-yellow">
                  {stat.value}
                </span>
                <span className="mt-2 block font-display text-xs uppercase tracking-widest text-white/50">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>

          {/* History / Mission */}
          <div className="mt-32 grid grid-cols-1 gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <span className="font-display text-xs uppercase tracking-[0.2em] text-accent-yellow">
                OUR HISTORY
              </span>
              <h2 className="font-display text-[clamp(2rem,4vw,3rem)] leading-none tracking-wide">
                A 40-Year Journey Across North India
              </h2>
              <p className="text-sm leading-relaxed text-white/60">
                Since 1986, Naaz Amusement has been a familiar name at the biggest melas and carnivals across Rajasthan, Delhi, and Uttar Pradesh. What began as a small collection of joyrides has grown into one of North India's most trusted traveling ride operators.
              </p>
              <p className="text-sm leading-relaxed text-white/60">
                Every year, we set up our 20+ high-thrill and family rides at major trade fairs, Dussehra melas, and city carnivals. Our fleet is fully owned, maintained to international safety standards, and operated by a trained permanent crew — ensuring the same quality of experience at every location.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <span className="font-display text-xs uppercase tracking-[0.2em] text-accent-yellow">
                OUR MISSION
              </span>
              <h2 className="font-display text-[clamp(2rem,4vw,3rem)] leading-none tracking-wide">
                Where Joy Knows No Boundaries
              </h2>
              <p className="text-sm leading-relaxed text-white/60">
                We believe that entertainment is a catalyst for human connection. Our mission is to design safe, engaging, and awe-inspiring environments that encourage families to play together, friends to laugh together, and teams to build trust.
              </p>
              <div className="rounded-xl border border-white/5 bg-white/[0.01] p-6 flex gap-4 items-start">
                <MapPin className="h-6 w-6 text-accent-yellow shrink-0 mt-1" />
                <div>
                  <h4 className="font-display text-base text-white">Pan North India Operations</h4>
                  <p className="mt-1 text-xs text-white/40 leading-relaxed">
                    We operate across Rajasthan, Delhi, and Uttar Pradesh — setting up rides at major melas, Dussehra grounds, and city carnivals throughout the year.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Core Pillars */}
          <div className="mt-32">
            <div className="text-center max-w-xl mx-auto">
              <span className="font-display text-xs uppercase tracking-[0.2em] text-accent-yellow">
                THE NAAZ WAY
              </span>
              <h2 className="mt-3 font-display text-[clamp(2.2rem,4.5vw,3.5rem)] leading-none tracking-wide text-white">
                Our Core Pillars
              </h2>
              <p className="mt-4 text-xs text-white/50 leading-relaxed">
                Everything we build and operate at Naaz Amusement is rooted in these core principles.
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {pillars.map((pillar, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.01] p-8 transition-all hover:bg-white/[0.03] hover:-translate-y-1"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-yellow/10 text-accent-yellow">
                    <pillar.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 font-display text-lg tracking-wide text-white">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-white/50">
                    {pillar.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
