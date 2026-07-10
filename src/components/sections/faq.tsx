"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus } from "lucide-react";
import { useContentStore } from "@/stores/content-store";
import { Eyebrow } from "@/components/shared/eyebrow";
import type { FaqItem } from "@/lib/content";

export function Faq() {
  const { content, fetchContent } = useContentStore();
  const faq = content.faq;
  const faqs: FaqItem[] = faq.items;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return (
    <section
      id="faq"
      className="ambient-orbs relative isolate overflow-hidden bg-deep-purple py-16 sm:py-24 md:py-32"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-5 md:px-8">
        {/* Header */}
        <div className="text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-display text-[clamp(0.85rem,1.2vw,1.1rem)] uppercase tracking-wide text-accent-yellow"
          >
            <Eyebrow className="justify-center">{faq.eyebrow}</Eyebrow>
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 font-display text-[clamp(2rem,4.5vw,3rem)] leading-[1.17] text-white"
          >
            {faq.heading}
          </motion.h2>
        </div>

        {/* Accordion */}
        <div className="mt-10 sm:mt-14 space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 py-4 sm:py-5 text-left transition hover:bg-white/5"
                >
                  <span className="font-body text-[clamp(0.95rem,1.3vw,1.5rem)] leading-[1.17] tracking-[-0.24px] text-white">
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
                      <div className="px-4 sm:px-6 pb-4 sm:pb-5">
                        <p className="font-body text-[clamp(0.85rem,1.1vw,1.25rem)] leading-[1.4] text-white/75">
                          {faq.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
