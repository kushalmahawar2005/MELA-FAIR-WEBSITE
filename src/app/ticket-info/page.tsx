"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { motion, AnimatePresence } from "motion/react";
import { Ticket, Calendar, ShieldAlert, Sparkles, Clock, CheckCircle2, HelpCircle, Plus, Minus } from "lucide-react";
import { site } from "@/lib/site";

const pricingOptions = [
  {
    name: "General Admission (Adult)",
    price: "₹799",
    description: "Full access to all 80+ standard mechanical swings, water pool zones, and show displays.",
    features: ["Access to all rides", "Water Park entry", "Free parking"],
  },
  {
    name: "Child Pass (Under 4ft)",
    price: "₹499",
    description: "Special discounted entry for children. Access to all family and kid-appropriate rides.",
    features: ["Access to 40+ kids rides", "Water pool entry", "Complimentary juice box", "Free parking"],
  },
  {
    name: "Express VIP Ticket",
    price: "₹1,499",
    description: "Skip the queues with VIP Fast-Track lanes. Ideal for peak weekend hours and busy days.",
    features: ["Skip lines on major thrill rides", "VIP Lounge access", "Complimentary welcome drink", "Premium parking"],
  },
  {
    name: "Family Combo (2 Adult + 2 Child)",
    price: "₹2,199",
    description: "Exclusive family bundle offer. Perfect package for weekend family picnics.",
    features: ["Access to all rides", "Water Park entry", "₹200 food court coupon", "Free parking"],
  },
];

const timingDetails = [
  { day: "Monday", hours: "09:00 AM - 09:00 PM" },
  { day: "Tuesday", hours: "09:00 AM - 09:00 PM" },
  { day: "Wednesday", hours: "09:00 AM - 09:00 PM" },
  { day: "Thursday", hours: "09:00 AM - 09:00 PM" },
  { day: "Friday", hours: "09:00 AM - 09:00 PM" },
  { day: "Saturday", hours: "08:00 AM - 10:00 PM (Weekend hours)" },
  { day: "Sunday & Holidays", hours: "08:00 AM - 10:00 PM (Weekend hours)" },
];

const faqs = [
  {
    q: "Can I cancel or postpone my ticket bookings?",
    a: "Online admission tickets cannot be cancelled, refunded, or transferred to another date under ordinary circumstances. However, in the event of park closure due to weather conditions, rescheduling options will be provided.",
  },
  {
    q: "Are group booking discounts available for schools?",
    a: "Yes! We offer exclusive pricing packages for school picnics and corporate outings (20+ guests). Go to our customized Event Setup Booking tool (/book) or dial our helpdesk to formulate a quote.",
  },
  {
    q: "Is parking free at the park?",
    a: "Standard parking is free for all ticketed visitors. VIP Express Ticket holders receive premium reserved parking close to the main ticketing gates.",
  },
];

export default function TicketInfoPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-deep-purple text-white">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[20%] left-[-10%] h-[50%] w-[45%] rounded-full bg-purple-600/10 blur-[130px] mix-blend-screen" />
        <div className="absolute bottom-[20%] right-[-10%] h-[50%] w-[45%] rounded-full bg-emerald-600/10 blur-[130px] mix-blend-screen" />
      </div>

      <Header />

      <main className="relative z-10 flex-1 pt-28 pb-20 md:pt-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Header section */}
          <div className="max-w-3xl">
            <span className="font-display text-xs uppercase tracking-[0.2em] text-accent-yellow flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-accent-yellow animate-pulse" />
              PLAN YOUR EXPERIENCES
            </span>
            <h1 className="mt-4 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-none tracking-wide text-white">
              Ticketing & <br />
              <span className="text-accent-yellow">Operating Hours</span>
            </h1>
            <p className="mt-6 text-base leading-relaxed text-white/70">
              Find complete ticket prices, group discounts, operational hours, and general park rules. We advise buying tickets online to skip ticket counter lines.
            </p>
          </div>

          {/* Pricing Options Grid */}
          <div className="mt-16">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {pricingOptions.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-300 p-6 flex flex-col justify-between shadow-xl"
                >
                  <div>
                    <h3 className="font-display text-lg tracking-wide text-white group-hover:text-accent-yellow transition">
                      {option.name}
                    </h3>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="font-display text-4xl text-accent-yellow">{option.price}</span>
                      <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono">/ person</span>
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-white/50">
                      {option.description}
                    </p>

                    {/* Features list */}
                    <ul className="mt-6 space-y-2.5 border-t border-white/5 pt-6 text-[11px] text-white/60">
                      {option.features.map((feat, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-accent-yellow shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8">
                    <Link
                      href={site.bookingUrl}
                      className="flex h-11 w-full items-center justify-center rounded-xl bg-white/10 group-hover:bg-accent-yellow text-xs font-display tracking-widest text-white group-hover:text-deep-purple transition active:scale-95"
                    >
                      BOOK THIS TICKET
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Timings and Schedule block */}
          <div className="mt-32 grid grid-cols-1 gap-12 lg:grid-cols-2 items-start">
            
            {/* Timings Table */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-[2rem] border border-white/10 bg-white/[0.02] p-8 md:p-10 backdrop-blur-md"
            >
              <div className="flex items-center gap-2 mb-6">
                <Clock className="h-6 w-6 text-accent-yellow" />
                <h2 className="font-display text-2xl tracking-wide text-white">
                  Operating Hours
                </h2>
              </div>
              <p className="text-xs text-white/50 mb-6 leading-relaxed">
                Operating hours vary slightly on weekends, national holidays, and during special seasonal exhibitions.
              </p>

              <div className="divide-y divide-white/5">
                {timingDetails.map((time, index) => (
                  <div key={index} className="flex justify-between items-center py-3 text-xs">
                    <span className="font-medium text-white/70">{time.day}</span>
                    <span className="text-white font-semibold font-mono-ibm">{time.hours}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Park Guidelines / Safety Rules */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-[2rem] border border-white/10 bg-white/[0.02] p-8 md:p-10 backdrop-blur-md"
            >
              <div className="flex items-center gap-2 mb-6">
                <ShieldAlert className="h-6 w-6 text-accent-yellow" />
                <h2 className="font-display text-2xl tracking-wide text-white">
                  Park Rules & Guidelines
                </h2>
              </div>

              <div className="space-y-4 text-xs text-white/60 leading-relaxed">
                <div className="border-l-2 border-accent-yellow pl-4">
                  <h4 className="font-bold text-white mb-1">Dress Code Policy</h4>
                  <p>Appropriate sportswear or nylon clothing is required for water park zones. Loosely hanging garments are prohibited on high-speed thrill swings.</p>
                </div>
                <div className="border-l-2 border-accent-yellow pl-4">
                  <h4 className="font-bold text-white mb-1">Food & Beverage Policy</h4>
                  <p>Outside food and alcoholic beverages are strictly prohibited inside the park. Our food court offers a wide range of vegetarian food and filtered water.</p>
                </div>
                <div className="border-l-2 border-accent-yellow pl-4">
                  <h4 className="font-bold text-white mb-1">Re-entry Rules</h4>
                  <p>Single-admission tickets do not permit re-entry. Please check with safety coordinators at the gates if you need to access parking.</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Ticket FAQs Accordion */}
          <div className="mt-32">
            <div className="text-center max-w-xl mx-auto mb-16">
              <span className="font-display text-xs uppercase tracking-[0.2em] text-accent-yellow flex items-center justify-center gap-1.5">
                <HelpCircle className="h-4 w-4 text-accent-yellow" />
                FREQUENTLY ASKED QUESTIONS
              </span>
              <h2 className="mt-3 font-display text-[clamp(2.2rem,4.5vw,3.5rem)] leading-none tracking-wide text-white">
                Ticketing Helpdesk
              </h2>
            </div>

            <div className="max-w-3xl mx-auto rounded-[2rem] border border-white/10 bg-white/[0.01] p-6 sm:p-10 backdrop-blur-md">
              <div className="space-y-3">
                {faqs.map((faq, i) => {
                  const isOpen = openIndex === i;
                  return (
                    <div
                      key={i}
                      className="overflow-hidden rounded-xl border border-white/5 bg-white/[0.02]"
                    >
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : i)}
                        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition hover:bg-white/5"
                      >
                        <span className="font-display text-[1rem] sm:text-[1.1rem] text-white hover:text-accent-yellow transition">
                          {faq.q}
                        </span>
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/20">
                          {isOpen ? (
                            <Minus className="h-4 w-4 text-accent-yellow" />
                          ) : (
                            <Plus className="h-4 w-4 text-white" />
                          )}
                        </span>
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-5 text-xs text-white/50 leading-relaxed">
                              {faq.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
