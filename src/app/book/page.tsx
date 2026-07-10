"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { Check, ChevronLeft, ChevronRight, ArrowLeft, Plus, Minus, Info, Sparkles, Download, MessageCircle, Loader2, ShieldCheck, CreditCard, QrCode, MapPin, Calendar as CalendarIcon, Ticket } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  getDay,
  isBefore,
  isAfter,
  startOfDay,
  parseISO,
} from "date-fns";
import { useRidesStore } from "@/stores/rides-store";
import { useAuthStore } from "@/stores/auth-store";
import { useLocationsStore, LocationEvent } from "@/stores/locations-store";
import { toast } from "sonner";

// ─── Razorpay global type ─────────────────────────────────────────────────────
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  modal?: { ondismiss?: () => void };
}
interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}
interface RazorpayInstance {
  open(): void;
}

const steps = [
  { id: "location", label: "Location" },
  { id: "date", label: "Date" },
  { id: "tickets", label: "Tickets" },
  { id: "checkout", label: "Checkout" },
];

export default function BookPage() {
  const [currentStep, setCurrentStep] = useState("location");
  const { user } = useAuthStore();
  const { rides, fetchRides } = useRidesStore();
  const { locations, fetchLocations } = useLocationsStore();
  const [mounted, setMounted] = useState(false);

  // Booking State
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [tickets, setTickets] = useState<{ rideSlug: string; quantity: number; pricePaise: number; rideName: string }[]>([]);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Payment & QR state
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);

  const selectedLocation = useMemo(() => 
    locations.find((l) => l.id === selectedLocationId),
  [locations, selectedLocationId]);

  const activeLocations = useMemo(() => 
    locations.filter(l => l.isActive),
  [locations]);

  const totalPrice = useMemo(() => 
    tickets.reduce((sum, t) => sum + (t.pricePaise * t.quantity), 0),
  [tickets]);

  const totalTickets = useMemo(() => 
    tickets.reduce((sum, t) => sum + t.quantity, 0),
  [tickets]);

  // Load Razorpay checkout script
  const loadRazorpayScript = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      if (document.querySelector('script[src*="razorpay"]')) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }, []);

  useEffect(() => {
    setMounted(true);
    fetchRides();
    fetchLocations();
    loadRazorpayScript();
  }, [fetchRides, fetchLocations, loadRazorpayScript]);

  // Prefill details from auth session
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
        phone: user.phone,
      }));
    }
  }, [user]);

  const isDateAvailable = (date: Date) => {
    if (!selectedLocation) return false;
    const today = startOfDay(new Date());
    if (isBefore(date, today)) return false;
    
    const start = startOfDay(parseISO(selectedLocation.startDate));
    const end = startOfDay(parseISO(selectedLocation.endDate));
    
    if (isBefore(date, start) || isAfter(date, end)) return false;
    return true;
  };

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startingDayIndex = getDay(monthStart);

  const handleTicketChange = (rideSlug: string, delta: number, pricePaise: number, rideName: string) => {
    setTickets(prev => {
      const existing = prev.find(t => t.rideSlug === rideSlug);
      if (existing) {
        const newQuantity = Math.max(0, existing.quantity + delta);
        if (newQuantity === 0) return prev.filter(t => t.rideSlug !== rideSlug);
        return prev.map(t => t.rideSlug === rideSlug ? { ...t, quantity: newQuantity } : t);
      }
      if (delta > 0) {
        return [...prev, { rideSlug, quantity: delta, pricePaise, rideName }];
      }
      return prev;
    });
  };

  const handlePaymentAndBooking = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill in all contact details");
      return;
    }
    if (totalPrice === 0 || totalTickets === 0) {
      toast.error("Please select at least one ticket");
      return;
    }

    setIsPaymentLoading(true);

    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error("Razorpay SDK failed to load. Are you online?");
      }

      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalPrice / 100 }), // Amount in INR for order creation
      });

      if (!orderRes.ok) {
        const errorData = await orderRes.json();
        throw new Error(errorData.error || "Failed to create payment order");
      }

      const orderData = await orderRes.json();

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Naaz Amusement",
        description: `Booking for ${selectedLocation?.name}`,
        order_id: orderData.id,
        handler: async function (response: RazorpayResponse) {
          try {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingData: {
                  userName: formData.name,
                  userEmail: formData.email,
                  userPhone: formData.phone,
                  date: selectedDate?.toISOString(),
                  locationId: selectedLocation?.id,
                  locationName: selectedLocation?.name,
                  tickets,
                  totalPrice: totalPrice / 100,
                },
              }),
            });

            if (!verifyRes.ok) throw new Error("Payment verification failed on server");
            
            const verifyData = await verifyRes.json();
            setConfirmedBookingId(verifyData.bookingId);
            setQrCodeDataUrl(verifyData.qrCode);
            setCurrentStep("success");
            toast.success("Payment successful! Tickets booked.");
          } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Payment verification failed.");
          } finally {
            setIsPaymentLoading(false);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#EEA727",
        },
        modal: {
          ondismiss: function () {
            setIsPaymentLoading(false);
            toast.info("Payment popup closed");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "An unexpected error occurred");
      setIsPaymentLoading(false);
    }
  };

  if (!mounted) return <div className="min-h-screen bg-deep-purple" />;

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-deep-purple font-sans text-white">
      {/* Background Ambience */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] h-[60%] w-[50%] rounded-full bg-accent-magenta/10 blur-[150px] mix-blend-screen" />
        <div className="absolute top-[30%] right-[-10%] h-[50%] w-[40%] rounded-full bg-blue-600/10 blur-[140px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[20%] h-[50%] w-[50%] rounded-full bg-accent-yellow/5 blur-[160px] mix-blend-screen" />
      </div>

      <Header />

      <main className="relative z-10 flex-1 pt-28 pb-20 md:pt-36">
        <div className="mx-auto max-w-[1100px] px-5">
          {currentStep !== "success" && (
            <Link
              href="/"
              className="group relative mb-8 inline-flex items-center gap-2 text-[0.8rem] font-semibold uppercase tracking-[0.1em] text-white/50 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
              Back to Home
            </Link>
          )}

          {/* Progress Bar */}
          {currentStep !== "success" && (
            <div className="mb-14 flex items-center justify-center overflow-x-auto pb-4">
              <div className="flex items-center min-w-max px-4">
                {steps.map((step, index) => {
                  const stepIndex = steps.findIndex(s => s.id === step.id);
                  const currentIndex = steps.findIndex(s => s.id === currentStep);
                  const isActive = stepIndex <= currentIndex;

                  return (
                    <div key={step.id} className="flex items-center">
                      <div className="flex flex-col items-center gap-3">
                        <div
                          className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                            isActive
                              ? "border-accent-yellow bg-accent-yellow/10 text-accent-yellow drop-shadow-[0_0_10px_rgba(238,167,39,0.5)]"
                              : "border-white/10 bg-white/5 text-white/20"
                          }`}
                        >
                          <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                        <span
                          className={`font-display text-[0.7rem] sm:text-[0.8rem] uppercase tracking-widest ${
                            isActive ? "text-white drop-shadow-md" : "text-white/30"
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                      {index < steps.length - 1 && (
                        <div className="mx-2 mb-7 h-[1px] w-12 sm:mx-4 sm:w-20 lg:w-32 bg-gradient-to-r from-white/20 to-white/5" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            
            {/* STEP 1: LOCATION */}
            {currentStep === "location" && (
              <motion.div
                key="step-location"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="max-w-4xl mx-auto"
              >
                <div className="text-center mb-10">
                  <h2 className="font-display text-4xl md:text-5xl tracking-wide text-white drop-shadow-sm mb-4">
                    Select a Mela
                  </h2>
                  <p className="text-white/60 text-sm md:text-base max-w-xl mx-auto">
                    Choose which active mela or carnival you want to visit to see available rides and book your tickets.
                  </p>
                </div>

                {activeLocations.length === 0 ? (
                  <div className="text-center py-20 border border-white/10 rounded-3xl bg-white/[0.02]">
                    <div className="text-6xl mb-4">🎪</div>
                    <h3 className="font-display text-2xl text-white mb-2">No Active Melas</h3>
                    <p className="text-white/50">Check back later for upcoming events in your city!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {activeLocations.map((loc) => (
                      <button
                        key={loc.id}
                        onClick={() => setSelectedLocationId(loc.id)}
                        className={`group relative overflow-hidden rounded-[2rem] border text-left p-8 transition-all duration-300 ${
                          selectedLocationId === loc.id
                            ? "border-accent-yellow bg-accent-yellow/5 shadow-[0_0_30px_rgba(238,167,39,0.15)] scale-[1.02]"
                            : "border-white/10 bg-white/[0.02] hover:border-white/30 hover:bg-white/5"
                        }`}
                      >
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                          <MapPin className="w-24 h-24 text-accent-yellow" />
                        </div>
                        <h3 className="font-display text-2xl text-white mb-2">{loc.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-white/60 mb-1">
                          <MapPin className="w-4 h-4 text-accent-yellow" /> {loc.city} - {loc.address}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/60">
                          <CalendarIcon className="w-4 h-4 text-accent-magenta" /> 
                          {new Date(loc.startDate).toLocaleDateString()} to {new Date(loc.endDate).toLocaleDateString()}
                        </div>
                        
                        {selectedLocationId === loc.id && (
                          <div className="mt-8">
                            <div className="inline-flex items-center justify-center gap-2 px-6 py-2 rounded-full bg-accent-yellow text-deep-purple font-display uppercase tracking-wider text-sm font-bold">
                              Selected <Check className="w-4 h-4" />
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                <div className="mt-12 flex justify-center">
                  <button
                    disabled={!selectedLocationId}
                    onClick={() => {
                      setCurrentStep("date");
                      // Reset date if it's out of bounds of new location
                      if (selectedDate && !isDateAvailable(selectedDate)) {
                        setSelectedDate(null);
                      }
                      if (selectedLocationId) {
                        const loc = locations.find(l => l.id === selectedLocationId);
                        if (loc) setCurrentMonth(startOfMonth(parseISO(loc.startDate)));
                      }
                    }}
                    className="flex h-16 w-full max-w-md items-center justify-center rounded-full bg-accent-yellow font-display text-[1.1rem] tracking-[0.2em] text-deep-purple transition-all disabled:cursor-not-allowed disabled:opacity-30 disabled:grayscale hover:bg-accent-yellow/90"
                  >
                    CONTINUE TO DATE
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: DATE */}
            {currentStep === "date" && (
              <motion.div
                key="step-date"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-4xl mx-auto"
              >
                <div className="text-center mb-10">
                  <h2 className="font-display text-4xl tracking-wide text-white drop-shadow-sm mb-4">
                    When will you visit?
                  </h2>
                  <p className="text-white/60 text-sm md:text-base">
                    {selectedLocation?.name} runs from {selectedLocation ? new Date(selectedLocation.startDate).toLocaleDateString() : ""} to {selectedLocation ? new Date(selectedLocation.endDate).toLocaleDateString() : ""}
                  </p>
                </div>

                <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.02] p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] backdrop-blur-2xl sm:p-12 mx-auto max-w-2xl">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-2xl md:text-3xl tracking-wide text-white drop-shadow-sm">
                      {format(currentMonth, "MMMM yyyy")}
                    </h2>
                    <div className="flex gap-3">
                      <button
                        onClick={handlePrevMonth}
                        className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={handleNextMonth}
                        className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-10">
                    <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center font-display text-[0.7rem] sm:text-[0.85rem] uppercase tracking-widest text-white/50">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                        <div key={d} className="pb-4">{d}</div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1 sm:gap-2">
                      {Array.from({ length: startingDayIndex }).map((_, i) => (
                        <div key={`empty-${i}`} className="h-10 sm:h-14" />
                      ))}
                      {daysInMonth.map((day) => {
                        const isAvailable = isDateAvailable(day);
                        const isSelected = selectedDate && isSameDay(day, selectedDate);
                        return (
                          <button
                            key={day.toISOString()}
                            disabled={!isAvailable}
                            onClick={() => setSelectedDate(day)}
                            className={`flex h-10 sm:h-14 items-center justify-center rounded-xl text-[0.9rem] sm:text-[1rem] font-medium transition-all duration-300 ${
                              isSelected
                                ? "border border-accent-yellow bg-accent-yellow text-deep-purple shadow-[0_0_20px_rgba(238,167,39,0.5)] scale-110 sm:scale-105"
                                : isAvailable
                                ? "border border-white/10 bg-[#0d2a1a]/80 text-[#88b04b] hover:border-[#88b04b]/50 hover:bg-[#123e25] hover:text-[#a5d65c]"
                                : "cursor-not-allowed border border-transparent bg-white/[0.02] text-white/20"
                            }`}
                          >
                            {format(day, "d")}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-12 flex justify-center gap-4">
                  <button
                    onClick={() => setCurrentStep("location")}
                    className="flex h-16 px-8 items-center justify-center rounded-full bg-white/5 font-display text-sm tracking-[0.2em] text-white transition-all hover:bg-white/10"
                  >
                    BACK
                  </button>
                  <button
                    disabled={!selectedDate}
                    onClick={() => setCurrentStep("tickets")}
                    className="flex h-16 w-full max-w-xs items-center justify-center rounded-full bg-accent-yellow font-display text-[1.1rem] tracking-[0.2em] text-deep-purple transition-all disabled:cursor-not-allowed disabled:opacity-30 disabled:grayscale hover:bg-accent-yellow/90"
                  >
                    SELECT RIDES
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: TICKETS */}
            {currentStep === "tickets" && (
              <motion.div
                key="step-tickets"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 max-w-6xl mx-auto"
              >
                {/* Rides Selection */}
                <div className="space-y-4">
                  <div className="mb-6 border-b border-white/10 pb-4">
                    <h2 className="font-display text-3xl text-white mb-2">Select Rides</h2>
                    <p className="text-white/50 text-sm">Add tickets for the rides you want to enjoy.</p>
                  </div>

                  {selectedLocation?.ridePricing.filter(rp => rp.isActive).map((rp) => {
                    const rideInfo = rides.find(r => r.slug === rp.rideSlug);
                    if (!rideInfo) return null;
                    const ticketCount = tickets.find(t => t.rideSlug === rp.rideSlug)?.quantity || 0;
                    
                    return (
                      <div key={rp.rideSlug} className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition">
                        <div className="h-16 w-16 rounded-xl flex items-center justify-center font-display text-lg font-bold border border-white/10 shrink-0"
                             style={{ backgroundColor: rideInfo.tint + "20", color: rideInfo.tint }}>
                          {rideInfo.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                          <h4 className="font-display text-lg text-white">{rideInfo.name}</h4>
                          <p className="text-[11px] text-white/50 uppercase tracking-wider">{rideInfo.thrill} Thrill • Min Age {rideInfo.minAge}+</p>
                        </div>
                        <div className="text-center sm:text-right px-4">
                          <div className="text-xl font-bold text-accent-yellow font-mono">₹{(rp.pricePaise / 100)}</div>
                          <div className="text-[10px] text-white/40 uppercase">per ticket</div>
                        </div>
                        <div className="flex items-center gap-4 bg-white/5 rounded-full p-1 border border-white/10">
                          <button
                            onClick={() => handleTicketChange(rp.rideSlug, -1, rp.pricePaise, rideInfo.name)}
                            className="h-8 w-8 rounded-full flex items-center justify-center bg-white/10 text-white hover:bg-white/20 transition"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-4 text-center font-mono font-bold">{ticketCount}</span>
                          <button
                            onClick={() => handleTicketChange(rp.rideSlug, 1, rp.pricePaise, rideInfo.name)}
                            className="h-8 w-8 rounded-full flex items-center justify-center bg-accent-yellow text-deep-purple hover:bg-accent-yellow/90 transition"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Cart Summary */}
                <div className="lg:pl-8 lg:border-l border-white/10">
                  <div className="sticky top-32 rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 backdrop-blur-xl">
                    <h3 className="font-display text-xl text-white border-b border-white/10 pb-4 mb-6 flex items-center gap-2">
                      <Ticket className="h-5 w-5 text-accent-yellow" /> Cart Summary
                    </h3>
                    
                    <div className="space-y-4 mb-6">
                      {tickets.length === 0 ? (
                        <div className="text-center py-6 text-white/30 text-sm italic">
                          No tickets selected yet
                        </div>
                      ) : (
                        tickets.map(t => (
                          <div key={t.rideSlug} className="flex justify-between items-center text-sm">
                            <span className="text-white/80">{t.quantity}x {t.rideName}</span>
                            <span className="font-mono text-white">₹{(t.pricePaise * t.quantity) / 100}</span>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="border-t border-white/10 pt-4 mb-8">
                      <div className="flex justify-between items-end">
                        <span className="text-white/50 uppercase tracking-widest text-xs">Total Amount</span>
                        <span className="font-display text-3xl text-accent-yellow">₹{totalPrice / 100}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3">
                      <button
                        onClick={() => setCurrentStep("date")}
                        className="flex h-12 flex-1 items-center justify-center rounded-xl border border-white/20 bg-transparent font-display text-xs tracking-widest text-white transition hover:bg-white/5"
                      >
                        BACK
                      </button>
                      <button
                        disabled={totalTickets === 0}
                        onClick={() => setCurrentStep("checkout")}
                        className="flex h-12 flex-[2] items-center justify-center rounded-xl bg-accent-yellow font-display text-sm font-bold tracking-widest text-deep-purple transition disabled:opacity-50 disabled:grayscale hover:bg-accent-yellow/90 shadow-[0_0_20px_rgba(238,167,39,0.3)]"
                      >
                        CHECKOUT
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: CHECKOUT */}
            {currentStep === "checkout" && (
              <motion.div
                key="step-checkout"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 max-w-5xl mx-auto"
              >
                {/* Details Form */}
                <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-10 backdrop-blur-xl">
                  <h2 className="font-display text-3xl text-white mb-8">Contact Details</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[0.7rem] font-semibold uppercase tracking-widest text-white/50 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-white/20 focus:border-accent-yellow focus:outline-none focus:ring-1 focus:ring-accent-yellow transition"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[0.7rem] font-semibold uppercase tracking-widest text-white/50 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-white/20 focus:border-accent-yellow focus:outline-none transition"
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-[0.7rem] font-semibold uppercase tracking-widest text-white/50 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-white/20 focus:border-accent-yellow focus:outline-none transition"
                          placeholder="+91 9876543210"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Checkout Summary */}
                <div>
                  <div className="sticky top-32 rounded-3xl border border-accent-yellow/20 bg-accent-yellow/5 p-6 sm:p-8 backdrop-blur-xl">
                    <h3 className="font-display text-xl text-white mb-6">Final Summary</h3>
                    
                    <div className="space-y-3 mb-6 border-b border-white/10 pb-6 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/50">Mela</span>
                        <span className="text-white font-medium text-right">{selectedLocation?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/50">Date</span>
                        <span className="text-white font-medium">{selectedDate ? format(selectedDate, "dd MMM yyyy") : ""}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/50">Total Tickets</span>
                        <span className="text-white font-medium">{totalTickets}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-end mb-8">
                      <span className="text-white/50 uppercase tracking-widest text-xs">Amount to Pay</span>
                      <span className="font-display text-4xl text-accent-yellow drop-shadow-[0_0_15px_rgba(238,167,39,0.5)]">₹{totalPrice / 100}</span>
                    </div>

                    <div className="flex flex-col gap-3">
                      <button
                        onClick={handlePaymentAndBooking}
                        disabled={isPaymentLoading}
                        className="group relative flex h-14 w-full items-center justify-center overflow-hidden rounded-xl bg-accent-yellow font-display text-[1rem] tracking-[0.1em] text-deep-purple transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:bg-white"
                      >
                        {isPaymentLoading ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <>
                            <CreditCard className="mr-2 h-5 w-5" />
                            PAY SECURELY
                          </>
                        )}
                      </button>
                      <button
                        disabled={isPaymentLoading}
                        onClick={() => setCurrentStep("tickets")}
                        className="flex h-12 w-full items-center justify-center rounded-xl border border-white/20 bg-transparent font-display text-xs tracking-widest text-white transition hover:bg-white/5"
                      >
                        BACK TO TICKETS
                      </button>
                    </div>

                    <div className="mt-6 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-white/40">
                      <ShieldCheck className="h-4 w-4 text-green-500" />
                      128-bit SSL Secured Checkout
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 5: SUCCESS / TICKET GENERATED */}
            {currentStep === "success" && qrCodeDataUrl && (
              <motion.div
                key="step-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mx-auto max-w-2xl text-center"
              >
                <div className="mb-8 inline-flex h-24 w-24 items-center justify-center rounded-full bg-green-500/20 text-green-400 shadow-[0_0_40px_rgba(34,197,94,0.3)]">
                  <Check className="h-12 w-12" />
                </div>
                
                <h1 className="font-display text-4xl sm:text-5xl tracking-wide text-white mb-4">
                  Tickets Confirmed!
                </h1>
                <p className="text-white/60 mb-10 max-w-md mx-auto">
                  Your booking for {selectedLocation?.name} is confirmed. A copy of this ticket has been sent to your email.
                </p>

                <div className="relative mx-auto max-w-sm overflow-hidden rounded-3xl bg-white p-8 text-deep-purple shadow-2xl">
                  {/* Ticket jagged edge effect (top/bottom) could go here via CSS radial gradients if needed */}
                  
                  <div className="text-center mb-6">
                    <h3 className="font-display text-2xl uppercase tracking-wide text-deep-purple">{selectedLocation?.name}</h3>
                    <p className="text-sm font-bold text-black/60">{selectedDate ? format(selectedDate, "dd MMM yyyy") : ""}</p>
                  </div>

                  <div className="mx-auto bg-white p-2 rounded-xl shadow-inner border border-gray-100 flex justify-center mb-6">
                    <img src={qrCodeDataUrl} alt="Booking QR Code" className="w-48 h-48" />
                  </div>

                  <div className="space-y-2 border-t border-dashed border-gray-300 pt-4 text-sm text-left font-mono">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Booking ID</span>
                      <span className="font-bold">{confirmedBookingId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Name</span>
                      <span className="font-bold truncate max-w-[120px]">{formData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tickets</span>
                      <span className="font-bold">{totalTickets}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Amount Paid</span>
                      <span className="font-bold text-green-600">₹{totalPrice / 100}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-12">
                  <Link
                    href="/"
                    className="inline-flex h-14 items-center justify-center rounded-full bg-white/10 px-8 font-display text-sm tracking-widest text-white transition hover:bg-white/20"
                  >
                    RETURN TO HOME
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}
