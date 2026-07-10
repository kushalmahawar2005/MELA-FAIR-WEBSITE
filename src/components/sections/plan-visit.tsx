"use client";

import { motion } from "motion/react";
import { Eyebrow } from "@/components/shared/eyebrow";
import { useEffect } from "react";
import { useContentStore } from "@/stores/content-store";

export function PlanVisit() {
  const { content, fetchContent } = useContentStore();
  const planVisit = content.planVisit;

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return (
    <section
      id="plan"
      className="ambient-orbs relative isolate overflow-hidden bg-deep-purple py-16 sm:py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-8">
        {/* Header */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-display text-[clamp(0.85rem,1.2vw,1.1rem)] uppercase tracking-wide text-accent-yellow"
        >
          <Eyebrow>{planVisit.eyebrow}</Eyebrow>
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-4 sm:mt-6 max-w-3xl font-display text-[clamp(1.4rem,4.5vw,3rem)] leading-[1.17] tracking-[0.96px] text-white"
        >
          {planVisit.heading}
        </motion.h2>

        {/* Steps */}
        <div className="mt-10 sm:mt-16 space-y-14 sm:space-y-20 md:space-y-28">
          {planVisit.steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.65 }}
              className={`grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16 ${
                i % 2 === 1 ? "lg:direction-rtl" : ""
              }`}
            >
              {/* Image */}
              <div className={`relative overflow-hidden rounded-xl ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="h-full w-full object-cover"
                  />
                  {/* Corner badge */}
                  <div className="absolute right-4 top-4 flex h-16 w-16 items-center justify-center rounded-lg bg-white shadow-lg">
                    <span className={`font-display text-[2rem] leading-none ${step.numColor}`}>
                      {step.num}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className={`${i % 2 === 1 ? "lg:order-1" : ""}`}>
                <span className={`font-display text-[3rem] leading-none ${step.numColor} opacity-20`}>
                  {step.num}
                </span>
                <h3 className="mt-4 font-display text-[clamp(1.2rem,2.5vw,1.625rem)] leading-[1.1] text-white">
                  {step.title}
                </h3>
                <p className="mt-3 sm:mt-4 font-geist text-[0.95rem] sm:text-[1.125rem] font-light leading-[1.5] text-white/80">
                  {step.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
