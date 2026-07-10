"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, ArrowRight, ShieldCheck, Zap, Users, X, Loader2, CheckCircle2, Phone, Mail, MapPin, Calendar, FileText } from "lucide-react";
import { useContentStore } from "@/stores/content-store";
import { Eyebrow } from "@/components/shared/eyebrow";
import type { EventPackage } from "@/lib/content";
import { toast } from "sonner";

const iconMap: Record<EventPackage["iconKey"], any> = {
  "zap": Zap,
  "shield-check": ShieldCheck,
  "users": Users,
};

type InquiryState = "idle" | "loading" | "success";

export function EventPackages() {
  const { content, fetchContent } = useContentStore();
  const section = content.eventPackages;
  const packages = section.packages;

  // Modal state
  const [selectedPkg, setSelectedPkg] = useState<EventPackage | null>(null);
  const [inquiryState, setInquiryState] = useState<InquiryState>("idle");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    eventCity: "",
    eventDate: "",
    notes: "",
  });

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const openModal = (pkg: EventPackage) => {
    setSelectedPkg(pkg);
    setInquiryState("idle");
    setForm({ name: "", phone: "", email: "", eventCity: "", eventDate: "", notes: "" });
  };

  const closeModal = () => {
    if (inquiryState === "loading") return;
    setSelectedPkg(null);
    setInquiryState("idle");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPkg) return;
    if (!form.name || !form.phone || !form.email || !form.eventCity || !form.eventDate) {
      toast.error("Kripya saari required fields fill karein");
      return;
    }

    setInquiryState("loading");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          packageId: selectedPkg.id,
          packageName: selectedPkg.name,
        }),
      });

      if (!res.ok) throw new Error("Server error");
      setInquiryState("success");
    } catch (err) {
      toast.error("Kuch galat ho gaya. Dobara try karein.");
      setInquiryState("idle");
    }
  };

  return (
    <>
      <section id="packages" className="relative isolate overflow-hidden bg-[#0A0514] py-20 sm:py-28 lg:py-32">
        {/* Decorative Blur Orbs */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-yellow/[0.02] blur-[150px]" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-8">
          
          {/* Section Header */}
          <div className="text-center">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-xs uppercase tracking-[0.2em] text-accent-yellow"
            >
              <Eyebrow className="justify-center">{section.eyebrow}</Eyebrow>
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-3 font-display text-[clamp(1.8rem,4vw,3rem)] leading-none tracking-wide text-white"
            >
              {section.heading}
            </motion.h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/50">
              {section.subtext}
            </p>
          </div>

          {/* Packages Grid */}
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg, i) => {
              const Icon = iconMap[pkg.iconKey] ?? Zap;
              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className={`relative flex flex-col justify-between rounded-[2rem] border bg-white/[0.01] p-8 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.03] hover:shadow-2xl ${pkg.themeColor}`}
                  style={{
                    boxShadow: `0 10px 30px -10px ${pkg.shadowColor}`
                  }}
                >
                  {pkg.highlightText && (
                    <span className="absolute -top-3 right-6 rounded-full bg-accent-yellow px-3 py-1 font-display text-[9px] uppercase tracking-wider text-deep-purple font-semibold shadow-md">
                      {pkg.highlightText}
                    </span>
                  )}

                  <div>
                    {/* Icon & Title */}
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg tracking-wide text-white">
                          {pkg.name}
                        </h3>
                        <span className="text-[10px] text-white/40 uppercase tracking-widest block font-medium mt-0.5">
                          Best for: {pkg.bestFor}
                        </span>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="mt-8 flex items-baseline gap-2">
                      <span className="font-display text-4xl font-semibold text-white">
                        {pkg.price}
                      </span>
                      <span className="text-xs text-white/40 uppercase tracking-wider">
                        / {pkg.duration}
                      </span>
                    </div>

                    <p className="mt-4 text-xs leading-relaxed text-white/50">
                      {pkg.tagline}
                    </p>

                    {/* Features List */}
                    <div className="mt-8 space-y-3.5 border-t border-white/5 pt-6">
                      {pkg.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <Check className="h-4 w-4 text-accent-yellow shrink-0 mt-0.5" />
                          <span className="text-xs leading-relaxed text-white/70">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-8 pt-4">
                    <button
                      onClick={() => openModal(pkg)}
                      className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white/5 hover:bg-white text-white hover:text-deep-purple border border-white/10 hover:border-white text-xs font-display tracking-widest uppercase transition-all duration-300"
                    >
                      SELECT PACKAGE
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>

                    <a
                      href={`https://wa.me/919929068065?text=Hello%20Naaz%20Amusement,%20I'm%20interested%20in%20the%20${encodeURIComponent(pkg.name)}%20package.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center mt-3 text-[10px] text-white/40 hover:text-white transition uppercase font-display tracking-wider"
                    >
                      Or Inquiry on WhatsApp
                    </a>
                  </div>

                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ─── INQUIRY MODAL ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedPkg && (
          <motion.div
            key="inquiry-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
          >
            <motion.div
              key="inquiry-modal-box"
              initial={{ scale: 0.93, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.93, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-[2rem] border border-white/10 bg-[#0e0620] shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="relative bg-gradient-to-r from-violet-900/60 to-purple-900/40 px-8 py-6 border-b border-white/5">
                <div className="pr-8">
                  <p className="text-[10px] font-display uppercase tracking-[0.2em] text-accent-yellow mb-1">Package Inquiry</p>
                  <h3 className="font-display text-2xl text-white">{selectedPkg.name}</h3>
                  <p className="text-xs text-white/50 mt-1">{selectedPkg.price} / {selectedPkg.duration}</p>
                </div>
                <button
                  onClick={closeModal}
                  className="absolute top-5 right-5 text-white/40 hover:text-white transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-8 max-h-[70vh] overflow-y-auto">
                <AnimatePresence mode="wait">
                  {inquiryState === "success" ? (
                    /* ── SUCCESS STATE ── */
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 border border-green-500/20">
                        <CheckCircle2 className="h-10 w-10 text-green-400" />
                      </div>
                      <h4 className="font-display text-2xl text-white mb-3">Inquiry Mil Gayi!</h4>
                      <p className="text-white/60 text-sm leading-relaxed max-w-xs mx-auto">
                        Aapki inquiry humein mil gayi hai. Hum <span className="text-accent-yellow font-semibold">jald hi aapse contact karenge</span> — usually 24 ghante ke andar.
                      </p>
                      <p className="text-white/40 text-xs mt-4">
                        WhatsApp par bhi connect kar sakte hain: <a href="https://wa.me/919929068065" className="text-green-400 hover:underline" target="_blank">+91 99290 68065</a>
                      </p>
                      <button
                        onClick={closeModal}
                        className="mt-8 px-8 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-display text-sm tracking-wider transition"
                      >
                        CLOSE
                      </button>
                    </motion.div>
                  ) : (
                    /* ── FORM STATE ── */
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onSubmit={handleSubmit}
                      className="space-y-4"
                    >
                      {/* Package (auto-filled, read-only) */}
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-2">Selected Package</label>
                        <div className="w-full rounded-xl border border-accent-yellow/30 bg-accent-yellow/5 px-4 py-3 text-sm text-accent-yellow font-display">
                          {selectedPkg.name}
                        </div>
                      </div>

                      {/* Name */}
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-2">
                          Full Name <span className="text-accent-magenta">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="Aapka poora naam"
                            className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-sm text-white placeholder-white/20 focus:border-accent-yellow focus:outline-none focus:ring-1 focus:ring-accent-yellow/30 transition"
                          />
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">👤</span>
                        </div>
                      </div>

                      {/* Phone + Email row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-2">
                            Phone <span className="text-accent-magenta">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="tel"
                              required
                              value={form.phone}
                              onChange={(e) => setForm({ ...form, phone: e.target.value })}
                              placeholder="+91 98765 43210"
                              className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-3 py-3 text-sm text-white placeholder-white/20 focus:border-accent-yellow focus:outline-none transition"
                            />
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-2">
                            Email <span className="text-accent-magenta">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="email"
                              required
                              value={form.email}
                              onChange={(e) => setForm({ ...form, email: e.target.value })}
                              placeholder="email@example.com"
                              className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-3 py-3 text-sm text-white placeholder-white/20 focus:border-accent-yellow focus:outline-none transition"
                            />
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                          </div>
                        </div>
                      </div>

                      {/* City + Date row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-2">
                            Event City <span className="text-accent-magenta">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              required
                              value={form.eventCity}
                              onChange={(e) => setForm({ ...form, eventCity: e.target.value })}
                              placeholder="Jaipur, Delhi..."
                              className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-3 py-3 text-sm text-white placeholder-white/20 focus:border-accent-yellow focus:outline-none transition"
                            />
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-2">
                            Event Date <span className="text-accent-magenta">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="date"
                              required
                              value={form.eventDate}
                              onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                              min={new Date().toISOString().split("T")[0]}
                              className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-3 py-3 text-sm text-white/80 focus:border-accent-yellow focus:outline-none transition [color-scheme:dark]"
                            />
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                          </div>
                        </div>
                      </div>

                      {/* Notes */}
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-2">
                          Additional Notes <span className="text-white/20">(Optional)</span>
                        </label>
                        <div className="relative">
                          <textarea
                            rows={3}
                            value={form.notes}
                            onChange={(e) => setForm({ ...form, notes: e.target.value })}
                            placeholder="Koi khaas zaroorat ya sawaal ho toh yahan likhein..."
                            className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-sm text-white placeholder-white/20 focus:border-accent-yellow focus:outline-none transition resize-none"
                          />
                          <FileText className="absolute left-3 top-4 h-4 w-4 text-white/30" />
                        </div>
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={inquiryState === "loading"}
                        className="flex h-13 w-full mt-2 items-center justify-center gap-2 rounded-xl bg-accent-yellow hover:bg-accent-yellow/90 text-deep-purple font-display text-sm font-bold tracking-widest uppercase transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(238,167,39,0.25)]"
                      >
                        {inquiryState === "loading" ? (
                          <><Loader2 className="h-4 w-4 animate-spin" /> BHEJ Rahe Hain...</>
                        ) : (
                          <>INQUIRY BHEJEIN 🚀</>
                        )}
                      </button>
                      <p className="text-center text-[10px] text-white/30">
                        Hum typically 24 ghante ke andar call/WhatsApp karenge.
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
