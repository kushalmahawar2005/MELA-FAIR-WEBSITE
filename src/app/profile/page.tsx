"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "motion/react";
import { useAuthStore, Booking } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { toast } from "sonner";
import {
  User as UserIcon,
  Ticket,
  Calendar,
  Settings,
  LogOut,
  Clock,
  QrCode,
  CheckCircle,
  Sparkles,
} from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const router = useRouter();
  const { user, bookings, logout, updateProfile, changePassword, fetchBookings } =
    useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"tickets" | "history" | "settings">("tickets");
  const [pwForm, setPwForm] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [pwSaving, setPwSaving] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.next.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    if (pwForm.next !== pwForm.confirm) {
      toast.error("New passwords do not match.");
      return;
    }
    setPwSaving(true);
    const result = await changePassword(pwForm.current, pwForm.next);
    setPwSaving(false);
    if (result.success) {
      toast.success("Password changed successfully.");
      setPwForm({ current: "", next: "", confirm: "" });
    } else {
      toast.error(result.message || "Failed to change password.");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (mounted && !user) {
      router.push("/login");
    }
  }, [mounted, user, router]);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user, fetchBookings]);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
    },
  });

  // Reset form when user state hydrates
  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        phone: user.phone,
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    const success = await updateProfile(data.name, data.phone);
    if (success) {
      toast.success("Profile updated successfully!");
      reset(data); // reset dirty state
    } else {
      toast.error("Failed to update profile.");
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Signed out successfully.");
    router.push("/");
  };

  if (!mounted || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-deep-purple">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent-yellow border-t-transparent mx-auto" />
          <p className="text-sm text-fk-offwhite/60">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Filter bookings: active vs past
  const activeBookings = bookings.filter((b) => b.userEmail === user?.email && new Date(b.date) >= new Date(new Date().setHours(0, 0, 0, 0)));
  const pastBookings = bookings.filter((b) => b.userEmail === user?.email && new Date(b.date) < new Date(new Date().setHours(0, 0, 0, 0)));

  return (
    <div className="relative flex min-h-screen flex-col bg-deep-purple overflow-x-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 left-[-10%] h-[500px] w-[500px] rounded-full bg-accent-magenta/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-accent-yellow/5 blur-[120px] pointer-events-none" />

      <Header />

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-10 pt-28 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Area */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Profile Card */}
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-center backdrop-blur-md">
              <div className="mx-auto h-20 w-20 rounded-full bg-accent-magenta/20 border-2 border-accent-yellow flex items-center justify-center font-display text-[32px] text-accent-yellow mb-4 shadow-lg shadow-accent-magenta/10">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="font-display text-[24px] text-white leading-tight">
                {user.name}
              </h2>
              <p className="text-xs text-fk-offwhite/60 mt-1 truncate">{user.email}</p>
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-[11px] text-fk-offwhite/80">
                <Clock className="h-3 w-3 text-accent-yellow" />
                Joined {new Date(user.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
              </div>

              {/* Navigation Menu */}
              <nav className="mt-8 space-y-1.5 text-left">
                <button
                  onClick={() => setActiveTab("tickets")}
                  className={`flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                    activeTab === "tickets"
                      ? "bg-accent-yellow text-deep-purple font-semibold shadow-md"
                      : "text-fk-offwhite/80 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Ticket className="h-4 w-4" />
                    My Active Tickets
                  </span>
                  {activeBookings.length > 0 && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        activeTab === "tickets" ? "bg-deep-purple text-white" : "bg-accent-yellow text-deep-purple"
                      }`}
                    >
                      {activeBookings.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab("history")}
                  className={`flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                    activeTab === "history"
                      ? "bg-accent-yellow text-deep-purple font-semibold shadow-md"
                      : "text-fk-offwhite/80 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Calendar className="h-4 w-4" />
                    Booking History
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("settings")}
                  className={`flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                    activeTab === "settings"
                      ? "bg-accent-yellow text-deep-purple font-semibold shadow-md"
                      : "text-fk-offwhite/80 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Settings className="h-4 w-4" />
                    Account Settings
                  </span>
                </button>

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-lg px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all mt-4"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </nav>
            </div>

            {/* Quick Stats Banner */}
            <div className="rounded-xl border border-white/5 bg-gradient-to-br from-accent-magenta/30 to-deep-purple/10 p-5 relative overflow-hidden">
              <div className="relative z-10 space-y-4">
                <span className="text-[11px] font-bold text-accent-yellow tracking-wider uppercase flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 animate-pulse text-accent-yellow" /> Exclusive Member Perks
                </span>
                <p className="font-display text-[22px] leading-tight text-white">
                  Naaz Amusement Club
                </p>
                <p className="text-xs text-fk-offwhite/70">
                  Earn points on rides bookings and get fast-track entries on weekends! Show your active barcode at the counter.
                </p>
                <div className="flex items-center justify-between text-xs border-t border-white/10 pt-3">
                  <span className="text-fk-offwhite/60">Total Visits</span>
                  <span className="font-bold text-accent-yellow">{bookings.length} times</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {activeTab === "tickets" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="font-display text-[32px] text-white">
                    MY ACTIVE <span className="text-accent-yellow">TICKETS</span>
                  </h1>
                  <p className="text-sm text-fk-offwhite/60 mt-1">
                    Present the barcode at the ticket gate or ride operator counters.
                  </p>
                </div>

                {activeBookings.length === 0 ? (
                  <div className="rounded-xl border border-white/5 bg-white/[0.01] p-12 text-center flex flex-col items-center justify-center">
                    <Ticket className="h-12 w-12 text-fk-offwhite/20 mb-4" />
                    <h3 className="font-display text-[20px] text-white">NO ACTIVE TICKETS</h3>
                    <p className="text-xs text-fk-offwhite/60 mt-1 max-w-[280px] mx-auto">
                      You don&apos;t have any upcoming bookings. Book private rides or a carnival pack now!
                    </p>
                    <Button
                      onClick={() => router.push("/book")}
                      className="mt-6 bg-accent-yellow hover:bg-accent-yellow/90 text-deep-purple font-display tracking-wide px-6 py-2.5 h-auto text-sm"
                    >
                      BOOK TICKETS NOW
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {activeBookings.map((booking) => (
                      <TicketCard key={booking.id} booking={booking} />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "history" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="font-display text-[32px] text-white">
                    BOOKING <span className="text-accent-yellow">HISTORY</span>
                  </h1>
                  <p className="text-sm text-fk-offwhite/60 mt-1">
                    Receipts and details of all your previous purchases.
                  </p>
                </div>

                {pastBookings.length === 0 ? (
                  <div className="rounded-xl border border-white/5 bg-white/[0.01] p-12 text-center flex flex-col items-center justify-center">
                    <Calendar className="h-12 w-12 text-fk-offwhite/20 mb-4" />
                    <h3 className="font-display text-[20px] text-white">NO PAST BOOKINGS</h3>
                    <p className="text-xs text-fk-offwhite/60 mt-1 max-w-[280px] mx-auto">
                      All your previous bookings and receipts will show up here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pastBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="rounded-xl border border-white/10 bg-white/[0.02] p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition hover:bg-white/[0.04]"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-display text-[16px] text-white tracking-wide uppercase">
                              {booking.eventType} Rental
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-fk-offwhite/70">
                              Completed
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-fk-offwhite/60">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-accent-yellow" />
                              {new Date(booking.date).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <UserIcon className="h-3 w-3 text-accent-yellow" />
                              {booking.guests} Guests
                            </span>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
                          <span className="text-xs text-fk-offwhite/60 sm:hidden">Total Paid</span>
                          <span className="font-mono-ibm text-[16px] text-accent-yellow font-bold">
                            ₹{booking.totalPrice.toLocaleString("en-IN")}
                          </span>
                          <span className="text-[10px] text-fk-offwhite/40 block mt-0.5">
                            ID: {booking.id}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "settings" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="font-display text-[32px] text-white">
                    ACCOUNT <span className="text-accent-yellow">SETTINGS</span>
                  </h1>
                  <p className="text-sm text-fk-offwhite/60 mt-1">
                    Manage your personal details and contact information.
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-lg">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="name" className="text-xs font-medium text-fk-offwhite/90">
                          Full Name
                        </Label>
                        {errors.name && (
                          <span className="text-[11px] text-red-400 font-medium">
                            {errors.name.message}
                          </span>
                        )}
                      </div>
                      <Input
                        id="name"
                        type="text"
                        className="h-10 bg-white/[0.04] border-white/10 text-white placeholder:text-white/20 focus-visible:border-accent-yellow focus-visible:ring-accent-yellow/20"
                        {...register("name")}
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="phone" className="text-xs font-medium text-fk-offwhite/90">
                          Phone Number
                        </Label>
                        {errors.phone && (
                          <span className="text-[11px] text-red-400 font-medium">
                            {errors.phone.message}
                          </span>
                        )}
                      </div>
                      <Input
                        id="phone"
                        type="text"
                        className="h-10 bg-white/[0.04] border-white/10 text-white placeholder:text-white/20 focus-visible:border-accent-yellow focus-visible:ring-accent-yellow/20"
                        {...register("phone")}
                      />
                    </div>

                    {/* Email (Readonly) */}
                    <div className="space-y-1.5 opacity-60">
                      <Label htmlFor="email" className="text-xs font-medium text-fk-offwhite/90">
                        Email Address (Cannot be modified)
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={user.email}
                        readOnly
                        className="h-10 bg-white/[0.02] border-white/5 text-fk-offwhite/80 cursor-not-allowed"
                      />
                    </div>

                    {/* Save Changes Button */}
                    <Button
                      type="submit"
                      disabled={!isDirty}
                      className={`h-10 px-6 rounded-lg font-display text-[15px] tracking-wide ${
                        isDirty
                          ? "bg-accent-yellow text-deep-purple hover:bg-accent-yellow/90"
                          : "bg-white/10 text-fk-offwhite/40 cursor-not-allowed"
                      }`}
                    >
                      SAVE PROFILE CHANGES
                    </Button>
                  </form>
                </div>

                {/* Change Password */}
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
                  <h2 className="font-display text-lg text-white">
                    CHANGE <span className="text-accent-yellow">PASSWORD</span>
                  </h2>
                  <p className="mt-1 text-sm text-fk-offwhite/60">
                    Update the password you use to sign in.
                  </p>

                  <form
                    onSubmit={handleChangePassword}
                    className="mt-6 space-y-5 max-w-lg"
                  >
                    <div className="space-y-1.5">
                      <Label htmlFor="currentPassword" className="text-xs font-medium text-fk-offwhite/90">
                        Current Password
                      </Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        placeholder="••••••"
                        value={pwForm.current}
                        onChange={(e) =>
                          setPwForm((prev) => ({ ...prev, current: e.target.value }))
                        }
                        className="h-10 bg-white/[0.04] border-white/10 text-white placeholder:text-white/20 focus-visible:border-accent-yellow focus-visible:ring-accent-yellow/20"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="newPassword" className="text-xs font-medium text-fk-offwhite/90">
                        New Password
                      </Label>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="••••••"
                        value={pwForm.next}
                        onChange={(e) =>
                          setPwForm((prev) => ({ ...prev, next: e.target.value }))
                        }
                        className="h-10 bg-white/[0.04] border-white/10 text-white placeholder:text-white/20 focus-visible:border-accent-yellow focus-visible:ring-accent-yellow/20"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="confirmNewPassword" className="text-xs font-medium text-fk-offwhite/90">
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirmNewPassword"
                        type="password"
                        placeholder="••••••"
                        value={pwForm.confirm}
                        onChange={(e) =>
                          setPwForm((prev) => ({ ...prev, confirm: e.target.value }))
                        }
                        className="h-10 bg-white/[0.04] border-white/10 text-white placeholder:text-white/20 focus-visible:border-accent-yellow focus-visible:ring-accent-yellow/20"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={
                        pwSaving ||
                        !pwForm.current ||
                        !pwForm.next ||
                        !pwForm.confirm
                      }
                      className="h-10 px-6 rounded-lg font-display text-[15px] tracking-wide bg-accent-yellow text-deep-purple hover:bg-accent-yellow/90 disabled:bg-white/10 disabled:text-fk-offwhite/40"
                    >
                      {pwSaving ? "UPDATING..." : "UPDATE PASSWORD"}
                    </Button>
                  </form>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Ticket Card Subcomponent
function TicketCard({ booking }: { booking: Booking }) {
  const [showCode, setShowCode] = useState(false);

  // Generate lines for the mock barcode
  const barcodeLines = Array.from({ length: 48 }, (_, i) => {
    // Semi-random widths for the barcode look
    const widths = [1, 2, 3, 4, 1, 3, 2, 1, 4, 2];
    const width = widths[i % widths.length];
    return (
      <div
        key={i}
        className={`h-full bg-deep-purple transition-all`}
        style={{
          width: `${width}px`,
          opacity: (i * 7) % 5 === 0 ? 0 : 1, // Add space intervals
        }}
      />
    );
  });

  return (
    <div className="relative rounded-2xl bg-white text-deep-purple overflow-hidden flex flex-col justify-between shadow-xl min-h-[380px]">
      {/* Top Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between">
          <span className="font-display text-[14px] text-accent-magenta tracking-wide">
            NAAZ CLUB PASS
          </span>
          <div className="flex items-center gap-1 bg-green-500/10 px-2.5 py-0.5 rounded-full text-green-700 text-[10px] font-bold">
            <CheckCircle className="h-3 w-3" /> CONFIRMED
          </div>
        </div>

        <h3 className="font-display text-[26px] mt-2 leading-none uppercase tracking-wide">
          {booking.locationId ? "MELA TICKETS" : `${booking.eventType} RENTAL`}
        </h3>

        <div className="mt-4 grid grid-cols-2 gap-4 border-t border-deep-purple/10 pt-4">
          <div className="space-y-0.5">
            <span className="text-[10px] text-deep-purple/60 block uppercase font-medium">
              Event Date
            </span>
            <span className="text-sm font-semibold flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-accent-magenta" />
              {new Date(booking.date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] text-deep-purple/60 block uppercase font-medium">
              {booking.locationId ? "Total Tickets" : "Guests count"}
            </span>
            <span className="text-sm font-semibold flex items-center gap-1">
              <UserIcon className="h-3.5 w-3.5 text-accent-magenta" />
              {booking.locationId 
                ? `${booking.tickets?.reduce((acc, t) => acc + t.quantity, 0) || 0} Tickets` 
                : `${booking.guests} People`}
            </span>
          </div>

          <div className="col-span-2 space-y-0.5">
            <span className="text-[10px] text-deep-purple/60 block uppercase font-medium">
              Selected Attractions ({booking.locationId ? (booking.tickets?.length || 0) : (booking.selectedRides?.length || 0)})
            </span>
            <p className="text-xs font-medium text-deep-purple/80 truncate">
              {booking.locationId
                ? booking.tickets && booking.tickets.length > 0 
                  ? booking.tickets.map(t => `${t.quantity}x ${t.rideSlug}`).join(", ") 
                  : "Standard entry only"
                : booking.selectedRides && booking.selectedRides.length > 0
                  ? booking.selectedRides.map((r) => r.replace("-", " ")).join(", ")
                  : "Standard entry only"
              }
            </p>
          </div>
        </div>
      </div>

      {/* Ticket Stub Divider */}
      <div className="relative flex items-center justify-between px-0">
        {/* Left Cutout */}
        <div className="absolute left-[-12px] w-6 h-6 rounded-full bg-deep-purple" />
        {/* Dashed line */}
        <div className="w-full border-t border-dashed border-deep-purple/35 mx-6" />
        {/* Right Cutout */}
        <div className="absolute right-[-12px] w-6 h-6 rounded-full bg-deep-purple" />
      </div>

      {/* Bottom Stub */}
      <div className="p-6 pt-4 bg-fk-offwhite flex flex-col justify-between items-center gap-3">
        <div className="flex w-full items-center justify-between">
          <div>
            <span className="text-[10px] text-deep-purple/50 block font-medium">TICKET VALUE</span>
            <span className="font-mono-ibm text-[18px] font-bold text-accent-magenta">
              ₹{booking.totalPrice.toLocaleString("en-IN")}
            </span>
          </div>

          <button
            onClick={() => setShowCode(!showCode)}
            className="flex items-center gap-1 text-[11px] font-bold bg-deep-purple/5 hover:bg-deep-purple/10 text-deep-purple px-2.5 py-1 rounded-md transition"
          >
            {showCode ? (
              <>
                <QrCode className="h-3 w.5-3" /> Show Barcode
              </>
            ) : (
              <>
                <QrCode className="h-3 w.5-3" /> View QR Code
              </>
            )}
          </button>
        </div>

        {/* Scan code visualization */}
        <div className="w-full flex flex-col items-center justify-center bg-white border border-deep-purple/10 p-3 rounded-lg h-20 overflow-hidden relative">
          {showCode ? (
            // Mock QR Code representation
            <div className="grid grid-cols-5 gap-1 w-14 h-14">
              {Array.from({ length: 25 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-full h-full ${
                    // Specific design to resemble QR anchor squares and random noise
                    i === 0 ||
                    i === 1 ||
                    i === 2 ||
                    i === 5 ||
                    i === 7 ||
                    i === 10 ||
                    i === 11 ||
                    i === 12 ||
                    i === 20 ||
                    i === 21 ||
                    i === 22 ||
                    i === 24 ||
                    (i * 13) % 7 === 0
                      ? "bg-deep-purple"
                      : "bg-transparent"
                  }`}
                />
              ))}
            </div>
          ) : (
            // Barcode lines
            <div className="flex items-center justify-between w-full h-10 px-2">
              {barcodeLines}
            </div>
          )}
          <span className="text-[9px] font-mono text-deep-purple/50 mt-1 uppercase tracking-wider">
            {booking.id}
          </span>
        </div>
      </div>
    </div>
  );
}
