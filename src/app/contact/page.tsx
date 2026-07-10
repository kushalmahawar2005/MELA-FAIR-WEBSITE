"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { motion } from "motion/react";
import { MapPin, Phone, Mail, MessageSquare, Sparkles, Navigation, Send } from "lucide-react";
import { site, waLink } from "@/lib/site";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
  subject: z.string().min(3, { message: "Subject must be at least 3 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: ContactFormValues) => {
    try {
      // Build WhatsApp redirection link
      let text = `🎢 *NEW INQUIRY — Naaz Amusement*\n\n`;
      text += `*Name:* ${data.name}\n`;
      text += `*Phone:* ${data.phone}\n`;
      text += `*Email:* ${data.email}\n`;
      text += `*Subject:* ${data.subject}\n\n`;
      text += `*Message:* ${data.message}\n`;

      toast.success("Redirecting to WhatsApp helpdesk...");
      window.open(waLink(text), "_blank");
      reset();
    } catch (err) {
      toast.error("Failed to submit inquiry. Please try again.");
    }
  };

  const inputClasses =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-[0.95rem] text-white placeholder-white/30 outline-none transition-all focus:border-accent-yellow focus:bg-white/10 focus:ring-1 focus:ring-accent-yellow/50";
  const labelClasses =
    "mb-2 block font-display text-[0.75rem] uppercase tracking-widest text-white/50";

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-deep-purple text-white">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[20%] left-[-10%] h-[50%] w-[45%] rounded-full bg-purple-600/10 blur-[130px] mix-blend-screen" />
        <div className="absolute bottom-[20%] right-[-10%] h-[50%] w-[45%] rounded-full bg-accent-magenta/10 blur-[130px] mix-blend-screen" />
      </div>

      <Header />

      <main className="relative z-10 flex-1 pt-28 pb-20 md:pt-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Header section */}
          <div className="max-w-3xl">
            <span className="font-display text-xs uppercase tracking-[0.2em] text-accent-yellow flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-accent-yellow animate-pulse" />
              CONTACT OUR HELPDESK
            </span>
            <h1 className="mt-4 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-none tracking-wide text-white">
              Get In Touch <br />
              <span className="text-accent-yellow">With Our Team</span>
            </h1>
            <p className="mt-6 text-base leading-relaxed text-white/70">
              Have questions about park timings, custom ride installations, group rates, or marketing collaborations? Send us a message and our support team will reply within 24 hours.
            </p>
          </div>

          {/* Grid Layout: Contact Info vs Form */}
          <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16 items-stretch">
            
            {/* Left Column: Contact Cards & Map Link */}
            <div className="flex flex-col gap-6 justify-between">
              <div className="space-y-6">
                
                {/* Phone Card */}
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.01] p-6 flex gap-4 items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-yellow/10 text-accent-yellow">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-white/40 uppercase tracking-widest font-display">Call Helpdesk</span>
                    <a href={`tel:${site.phone}`} className="text-sm font-semibold hover:text-accent-yellow transition">
                      {site.phone}
                    </a>
                  </div>
                </div>

                {/* Email Card */}
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.01] p-6 flex gap-4 items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-yellow/10 text-accent-yellow">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-white/40 uppercase tracking-widest font-display">Email Support</span>
                    <a href={`mailto:${site.email}`} className="text-sm font-semibold hover:text-accent-yellow transition">
                      {site.email}
                    </a>
                  </div>
                </div>

                {/* Address Card */}
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.01] p-6 flex gap-4 items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-yellow/10 text-accent-yellow">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-white/40 uppercase tracking-widest font-display">Park Address</span>
                    <span className="text-xs text-white/80 leading-relaxed block">
                      {site.address}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Box: Directions */}
              <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.02] p-8 flex flex-col justify-between h-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-accent-magenta/5 to-transparent" />
                <h4 className="font-display text-xl text-white">Find Us on Google Maps</h4>
                <p className="mt-3 text-xs leading-relaxed text-white/40">
                  Ready to visit the park? Plan your road trip route directly on Google Maps. We are located near the Bagru toll plaza.
                </p>
                <div className="mt-8">
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Ajmer+Road+Near+Bagru+Toll+Jaipur+Rajasthan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-accent-yellow px-6 py-3 text-xs font-display tracking-widest text-deep-purple transition hover:scale-[1.02] font-semibold shadow-md"
                  >
                    <Navigation className="h-4 w-4" />
                    GET DIRECTIONS
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Form Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="rounded-[2rem] border border-white/10 bg-white/[0.02] p-8 sm:p-10 backdrop-blur-md shadow-xl"
            >
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="h-6 w-6 text-accent-yellow animate-pulse" />
                <h3 className="font-display text-2xl tracking-wide text-white">
                  Send Inquiry Form
                </h3>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className={labelClasses}>Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      {...register("name")}
                      className={cn(inputClasses, errors.name && "border-red-500")}
                    />
                    {errors.name && (
                      <p className="mt-1 text-[10px] text-red-400">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className={labelClasses}>Phone Number *</label>
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      {...register("phone")}
                      className={cn(inputClasses, errors.phone && "border-red-500")}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-[10px] text-red-400">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className={labelClasses}>Email Address *</label>
                  <input
                    type="email"
                    placeholder="e.g. rahul@example.com"
                    {...register("email")}
                    className={cn(inputClasses, errors.email && "border-red-500")}
                  />
                  {errors.email && (
                    <p className="mt-1 text-[10px] text-red-400">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className={labelClasses}>Inquiry Subject *</label>
                  <input
                    type="text"
                    placeholder="e.g. School picnic group rates"
                    {...register("subject")}
                    className={cn(inputClasses, errors.subject && "border-red-500")}
                  />
                  {errors.subject && (
                    <p className="mt-1 text-[10px] text-red-400">{errors.subject.message}</p>
                  )}
                </div>

                <div>
                  <label className={labelClasses}>Detailed Message *</label>
                  <textarea
                    rows={4}
                    placeholder="Describe your query in detail..."
                    {...register("message")}
                    className={cn(inputClasses, "resize-none", errors.message && "border-red-500")}
                  />
                  {errors.message && (
                    <p className="mt-1 text-[10px] text-red-400">{errors.message.message}</p>
                  )}
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative flex h-14 w-full items-center justify-center gap-2.5 overflow-hidden rounded-full bg-accent-yellow font-display text-[1rem] tracking-[0.1em] text-deep-purple transition-all hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(238,167,39,0.3)] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Send className="h-4.5 w-4.5" />
                    {isSubmitting ? "REDIRECTING..." : "SEND INQUIRY TO WHATSAPP"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
