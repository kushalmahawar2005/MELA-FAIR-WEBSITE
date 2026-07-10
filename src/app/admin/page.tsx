"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { motion, AnimatePresence } from "motion/react";
import { useAuthStore } from "@/stores/auth-store";
import { useRidesStore } from "@/stores/rides-store";
import { useLocationsStore, LocationEvent, RidePricing } from "@/stores/locations-store";
import { Ride, Thrill } from "@/lib/rides";
import { isAdminEmail } from "@/lib/admin";

import { toast } from "sonner";
import { CloudinaryUploadButton } from "@/components/admin/cloudinary-upload-button";
import {
  LayoutDashboard,
  Calendar,
  Trash2,
  Edit3,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Sliders,
  Users,
  DollarSign,
  TrendingUp,
  Briefcase,
  Layers,
  ArrowUpRight,
  MessageSquare,
  PhoneCall,
  MapPin,
  Clock,
} from "lucide-react";
import { ContentManager } from "@/components/admin/content-manager";

export default function AdminPage() {
  const { bookings, updateBookingStatus, deleteBooking, addBooking, user, fetchBookings } = useAuthStore();
  const { rides, addRide, updateRide, deleteRide, resetRides, fetchRides } = useRidesStore();
  const { locations, addLocation, updateLocation, deleteLocation, fetchLocations } = useLocationsStore();
  
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "bookings" | "rides" | "users" | "content" | "locations" | "inquiries">("dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  // Inquiries state
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);

  const fetchInquiries = async () => {
    setInquiriesLoading(true);
    try {
      const res = await fetch("/api/inquiries");
      if (res.ok) setInquiries(await res.json());
    } catch (e) {
      console.error("Failed to fetch inquiries", e);
    } finally {
      setInquiriesLoading(false);
    }
  };

  const updateInquiryStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status } : inq));
        toast.success(`Status updated to ${status}`);
      }
    } catch (e) {
      toast.error("Failed to update status");
    }
  };

  // Modal states
  const [showAddRideModal, setShowAddRideModal] = useState(false);
  const [showEditRideModal, setShowEditRideModal] = useState(false);
  const [showAddBookingModal, setShowAddBookingModal] = useState(false);
  const [showAddLocationModal, setShowAddLocationModal] = useState(false);
  
  // Selected ride for editing
  const [editingRideSlug, setEditingRideSlug] = useState<string | null>(null);

  // Form states - Ride
  const [rideForm, setRideForm] = useState({
    name: "",
    slug: "",
    nameHi: "",
    thrill: "Medium" as Thrill,
    minAge: 10,
    capacity: 24,
    pricePaise: 5000000, // in paise
    duration: "5 min",
    tagline: "",
    description: "",
    image: "/p1.jpg",
    tint: "#210C6D",
  });

  // Form states - Booking
  const [bookingForm, setBookingForm] = useState({
    userName: "",
    userEmail: "",
    userPhone: "",
    eventType: "Corporate Event",
    guests: 50,
    selectedRides: [] as string[],
    distanceSlab: "inside" as "inside" | "medium" | "far",
    totalPrice: 150000,
    date: new Date().toISOString().split("T")[0],
    status: "Pending" as "Pending" | "Confirmed",
  });

  // Form states - Location
  const [locationForm, setLocationForm] = useState({
    name: "",
    city: "Jaipur",
    address: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    lat: 26.9124,
    lng: 75.7873,
    gmapsLink: "",
    details: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      fetchBookings();
      fetchRides();
      fetchLocations();
      fetchInquiries();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchBookings, fetchRides, fetchLocations]);

  if (!mounted) {
    return (
      <div className="relative flex min-h-screen flex-col bg-deep-purple">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent-yellow border-t-transparent" />
        </div>
        <Footer />
      </div>
    );
  }

  const isAdmin = isAdminEmail(user?.email);

  // Stats calculation
  const totalRevenue = bookings
    .filter((b) => b.status === "Confirmed")
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const pendingBookingsCount = bookings.filter((b) => b.status === "Pending").length;
  const activeAttractionsCount = rides.length;
  const averageBookingValue = bookings.length > 0 
    ? Math.round(bookings.reduce((sum, b) => sum + b.totalPrice, 0) / bookings.length) 
    : 0;

  // Bookings filtering
  const filteredBookings = bookings.filter((b) => {
    const query = searchQuery.toLowerCase();
    return (
      b.id.toLowerCase().includes(query) ||
      (b.userName || "").toLowerCase().includes(query) ||
      (b.userEmail || "").toLowerCase().includes(query) ||
      (b.eventType || "").toLowerCase().includes(query)
    );
  });

  // Unique users list derived from bookings
  const userStatsMap = new Map<string, { name: string; email: string; phone: string; count: number; totalPaid: number }>();
  bookings.forEach((b) => {
    const email = b.userEmail || "guest@naazamusement.com";
    const existing = userStatsMap.get(email);
    const paid = b.status === "Confirmed" ? b.totalPrice : 0;
    if (existing) {
      userStatsMap.set(email, {
        name: b.userName || existing.name,
        email,
        phone: b.userPhone || existing.phone,
        count: existing.count + 1,
        totalPaid: existing.totalPaid + paid,
      });
    } else {
      userStatsMap.set(email, {
        name: b.userName || "Guest Customer",
        email,
        phone: b.userPhone || "N/A",
        count: 1,
        totalPaid: paid,
      });
    }
  });
  const derivedUsers = Array.from(userStatsMap.values());

  // Form submission - Add Ride
  const handleAddRideSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rideForm.name || !rideForm.slug) {
      toast.error("Please fill in Ride Name and URL Slug");
      return;
    }
    const success = await addRide({
      ...rideForm,
      pricePaise: Number(rideForm.pricePaise),
      minAge: Number(rideForm.minAge),
      capacity: Number(rideForm.capacity),
    });
    
    if (success) {
      toast.success(`${rideForm.name} added to rides store!`);
      setShowAddRideModal(false);
      // Reset form
      setRideForm({
        name: "",
        slug: "",
        nameHi: "",
        thrill: "Medium",
        minAge: 10,
        capacity: 24,
        pricePaise: 5000000,
        duration: "5 min",
        tagline: "",
        description: "",
        image: "/p1.jpg",
        tint: "#210C6D",
      });
    } else {
      toast.error("Failed to add ride. Please check connection.");
    }
  };

  // Form submission - Edit Ride
  const handleEditRideClick = (ride: Ride) => {
    setEditingRideSlug(ride.slug);
    setRideForm({
      name: ride.name,
      slug: ride.slug,
      nameHi: ride.nameHi,
      thrill: ride.thrill,
      minAge: ride.minAge,
      capacity: ride.capacity,
      pricePaise: ride.pricePaise,
      duration: ride.duration,
      tagline: ride.tagline,
      description: ride.description,
      image: ride.image,
      tint: ride.tint,
    });
    setShowEditRideModal(true);
  };

  const handleEditRideSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRideSlug) {
      const success = await updateRide(editingRideSlug, {
        ...rideForm,
        pricePaise: Number(rideForm.pricePaise),
        minAge: Number(rideForm.minAge),
        capacity: Number(rideForm.capacity),
      });
      if (success) {
        toast.success(`${rideForm.name} updated successfully!`);
        setShowEditRideModal(false);
        setEditingRideSlug(null);
      } else {
        toast.error("Failed to update ride. Please check connection.");
      }
    }
  };

  // Form submission - Add Booking
  const handleAddBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.userName || !bookingForm.userPhone) {
      toast.error("Please fill customer details");
      return;
    }
    addBooking({
      date: new Date(bookingForm.date).toISOString(),
      eventType: bookingForm.eventType,
      guests: Number(bookingForm.guests),
      selectedRides: bookingForm.selectedRides,
      distanceSlab: bookingForm.distanceSlab,
      totalPrice: Number(bookingForm.totalPrice),
      userName: bookingForm.userName,
      userEmail: bookingForm.userEmail || "guest@naazamusement.com",
      userPhone: bookingForm.userPhone,
      status: bookingForm.status,
    });
    toast.success("Offline booking successfully registered!");
    setShowAddBookingModal(false);
  };

  const toggleSelectRideInForm = (slug: string) => {
    setBookingForm((prev) => {
      const selected = prev.selectedRides.includes(slug)
        ? prev.selectedRides.filter((s) => s !== slug)
        : [...prev.selectedRides, slug];
      return { ...prev, selectedRides: selected };
    });
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-deep-purple text-white">
      {/* Dynamic Background Glowing effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[5%] left-[-10%] h-[500px] w-[500px] rounded-full bg-accent-magenta/10 blur-[130px]" />
        <div className="absolute bottom-[10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-accent-yellow/5 blur-[130px]" />
      </div>

      <Header />

      <main className="relative z-10 flex-1 pt-28 pb-20 md:pt-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Admin Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-8 mb-10">
            <div>
              <span className="font-display text-xs uppercase tracking-[0.25em] text-accent-yellow">
                Management Terminal
              </span>
              <h1 className="font-display text-[42px] leading-tight text-white mt-1">
                ADMIN <span className="text-accent-yellow">PORTAL</span>
              </h1>
            </div>

            {/* Admin Profile indicator */}
            {isAdmin ? (
              <div className="flex items-center gap-3 bg-white/[0.04] border border-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
                <div className="h-8 w-8 rounded-full bg-accent-yellow flex items-center justify-center text-deep-purple font-display font-bold">
                  A
                </div>
                <div>
                  <div className="text-xs font-semibold">{user?.name}</div>
                  <div className="text-[10px] text-white/50">System Administrator</div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-accent-magenta/15 border border-accent-magenta/30 px-5 py-3 rounded-2xl max-w-md">
                <div>
                  <div className="text-xs font-bold text-accent-yellow flex items-center gap-1.5">
                    <span>⚠️</span> DEMO MODE (VIEW ONLY)
                  </div>
                  <div className="text-[11px] text-white/70 mt-0.5">
                    Log in as administrator to unlock full management controls and booking edits.
                  </div>
                </div>
                <Link
                  href="/login"
                  className="bg-accent-yellow hover:bg-accent-yellow/90 text-deep-purple font-display text-xs px-4 py-2 rounded-xl transition flex items-center justify-center gap-1 shrink-0"
                >
                  Admin Login <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            )}
          </div>

          {/* Admin Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
            
            {/* Sidebar Navigation */}
            <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 border-b lg:border-b-0 lg:border-r border-white/10 lg:pr-6 shrink-0">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-display text-sm tracking-wider uppercase shrink-0 ${
                  activeTab === "dashboard"
                    ? "bg-accent-yellow text-deep-purple shadow-lg shadow-accent-yellow/15"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </button>
              <button
                onClick={() => setActiveTab("bookings")}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-display text-sm tracking-wider uppercase shrink-0 ${
                  activeTab === "bookings"
                    ? "bg-accent-yellow text-deep-purple shadow-lg shadow-accent-yellow/15"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <Calendar className="h-4 w-4" /> Bookings ({bookings.length})
              </button>
              <button
                onClick={() => setActiveTab("rides")}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-display text-sm tracking-wider uppercase shrink-0 ${
                  activeTab === "rides"
                    ? "bg-accent-yellow text-deep-purple shadow-lg shadow-accent-yellow/15"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <Sliders className="h-4 w-4" /> Rides ({rides.length})
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-display text-sm tracking-wider uppercase shrink-0 ${
                  activeTab === "users"
                    ? "bg-accent-yellow text-deep-purple shadow-lg shadow-accent-yellow/15"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <Users className="h-4 w-4" /> Customers ({derivedUsers.length})
              </button>
              <button
                onClick={() => { setActiveTab("locations"); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-display text-sm tracking-wider uppercase shrink-0 ${
                  activeTab === "locations"
                    ? "bg-accent-yellow text-deep-purple shadow-lg shadow-accent-yellow/15"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <LayoutDashboard className="h-4 w-4" /> Melas / Locations
              </button>
              <button
                onClick={() => { setActiveTab("inquiries"); fetchInquiries(); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-display text-sm tracking-wider uppercase shrink-0 relative ${
                  activeTab === "inquiries"
                    ? "bg-accent-yellow text-deep-purple shadow-lg shadow-accent-yellow/15"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <MessageSquare className="h-4 w-4" /> Inquiries
                {inquiries.filter(i => i.status === "New").length > 0 && (
                  <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    activeTab === "inquiries" ? "bg-deep-purple text-accent-yellow" : "bg-accent-yellow text-deep-purple"
                  }`}>
                    {inquiries.filter(i => i.status === "New").length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("content")}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-display text-sm tracking-wider uppercase shrink-0 ${
                  activeTab === "content"
                    ? "bg-accent-yellow text-deep-purple shadow-lg shadow-accent-yellow/15"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <Layers className="h-4 w-4" /> Content
              </button>
            </div>

            {/* Sub-tab Content Area */}
            <div className="min-h-[500px]">
              
              {/* --- DASHBOARD TAB --- */}
              {activeTab === "dashboard" && (
                <div className="space-y-8 animate-fadeIn">
                  
                  {/* Quick Actions */}
                  <div className="flex justify-end mb-4">
                    <Link
                      href="/admin/scanner"
                      className="bg-accent-yellow hover:bg-accent-yellow/90 text-deep-purple font-display px-6 py-3 rounded-xl transition flex items-center justify-center gap-2 uppercase tracking-wide w-full sm:w-auto shadow-[0_4px_16px_rgba(238,167,39,0.3)]"
                    >
                      <CheckCircle2 className="h-5 w-5" /> Open Ticket Scanner
                    </Link>
                  </div>
                  
                  {/* Dashboard Stats Panel */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Stat Card 1 */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-md relative overflow-hidden group">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">Total Revenue</span>
                        <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400">
                          <DollarSign className="h-4 w-4" />
                        </div>
                      </div>
                      <div className="font-mono-ibm text-2xl font-bold mt-4 text-white">
                        ₹{totalRevenue.toLocaleString("en-IN")}
                      </div>
                      <div className="text-[10px] text-white/40 mt-1 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-green-400" /> confirmed bookings total
                      </div>
                    </div>

                    {/* Stat Card 2 */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-md relative overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">Pending Requests</span>
                        <div className="h-8 w-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-400">
                          <RefreshCw className="h-4 w-4 animate-spin" style={{ animationDuration: "8s" }} />
                        </div>
                      </div>
                      <div className="font-mono-ibm text-2xl font-bold mt-4 text-accent-yellow">
                        {pendingBookingsCount}
                      </div>
                      <div className="text-[10px] text-white/40 mt-1">Inquiries awaiting approval</div>
                    </div>

                    {/* Stat Card 3 */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-md relative overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">Average Order</span>
                        <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                          <Briefcase className="h-4 w-4" />
                        </div>
                      </div>
                      <div className="font-mono-ibm text-2xl font-bold mt-4 text-white">
                        ₹{averageBookingValue.toLocaleString("en-IN")}
                      </div>
                      <div className="text-[10px] text-white/40 mt-1">Value per corporate setup</div>
                    </div>

                    {/* Stat Card 4 */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-md relative overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">Active Attractions</span>
                        <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                          <Layers className="h-4 w-4" />
                        </div>
                      </div>
                      <div className="font-mono-ibm text-2xl font-bold mt-4 text-white">
                        {activeAttractionsCount}
                      </div>
                      <div className="text-[10px] text-white/40 mt-1">Rides in service catalog</div>
                    </div>
                  </div>

                  {/* Operational Summary Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Recent Inquiries Panel */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-md">
                      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                        <h3 className="font-display text-lg tracking-wide">PENDING INQUIRIES</h3>
                        <span className="text-[10px] bg-white/5 px-2.5 py-1 rounded-full text-white/70">
                          Needs Confirmation
                        </span>
                      </div>
                      {bookings.filter((b) => b.status === "Pending").length === 0 ? (
                        <div className="text-center py-10 text-white/40 text-xs">
                          All inquiries have been reviewed and confirmed!
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {bookings
                            .filter((b) => b.status === "Pending")
                            .slice(0, 4)
                            .map((b) => (
                              <div key={b.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04]">
                                <div>
                                  <div className="text-xs font-bold text-white uppercase">{b.userName}</div>
                                  <div className="text-[10px] text-white/50 mt-0.5">{b.eventType} — {b.guests} Guests</div>
                                </div>
                                <div className="text-right">
                                  <div className="text-xs font-bold text-accent-yellow font-mono">
                                    ₹{b.totalPrice.toLocaleString("en-IN")}
                                  </div>
                                  {isAdmin && (
                                    <button
                                      onClick={() => {
                                        updateBookingStatus(b.id, "Confirmed");
                                        toast.success(`Booking ${b.id} Confirmed!`);
                                      }}
                                      className="text-[9px] font-bold text-green-400 uppercase tracking-wider hover:underline block mt-1"
                                    >
                                      Confirm now
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>

                    {/* Quick System Stats */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-md flex flex-col justify-between">
                      <div>
                        <div className="border-b border-white/10 pb-4 mb-4">
                          <h3 className="font-display text-lg tracking-wide">SYSTEM DIAGNOSTICS</h3>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-white/60">Persistent Storage Status</span>
                            <span className="font-semibold text-green-400">Online & Persistent</span>
                          </div>
                           <div className="flex justify-between items-center text-xs">
                            <span className="text-white/60">Customer Database</span>
                            <span className="font-semibold text-white">{derivedUsers.length} entries</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-white/60">Total Active Bookings</span>
                            <span className="font-semibold text-white">{bookings.length} reservations</span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-white/5 pt-4 mt-6 flex justify-between items-center">
                        <span className="text-[10px] text-white/40 font-mono">SYS-VERSION: v1.1.2-ALPHA</span>
                        <button
                          onClick={() => {
                            resetRides();
                            toast.success("Rides database reset to system defaults!");
                          }}
                          className="text-[10px] font-display uppercase tracking-wider text-accent-yellow hover:underline"
                        >
                          Reset System Rides
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* --- BOOKINGS TAB --- */}
              {activeTab === "bookings" && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Search and action header */}
                  <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by customer name, email, booking ID..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-accent-yellow"
                      />
                    </div>

                    <button
                      onClick={() => {
                        if (!isAdmin) {
                          toast.error("Please login as Admin to add offline bookings.");
                          return;
                        }
                        setShowAddBookingModal(true);
                      }}
                      className="bg-accent-yellow hover:bg-accent-yellow/90 text-deep-purple font-display text-xs tracking-wider px-5 py-3 rounded-xl transition flex items-center justify-center gap-1.5"
                    >
                      <Plus className="h-4 w-4" /> Add Offline Entry
                    </button>
                  </div>

                  {/* Bookings Table / Listing */}
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md overflow-hidden">
                    {filteredBookings.length === 0 ? (
                      <div className="text-center py-20 text-white/40 text-xs">
                        No bookings found matching search criteria.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-xs">
                          <thead>
                            <tr className="border-b border-white/10 bg-white/[0.02] text-white/50 font-display tracking-wider uppercase">
                              <th className="p-4 font-normal">Customer</th>
                              <th className="p-4 font-normal">Event Type</th>
                              <th className="p-4 font-normal">Guests</th>
                              <th className="p-4 font-normal">Event Date</th>
                              <th className="p-4 font-normal">Estimated Price</th>
                              <th className="p-4 font-normal">Status</th>
                              <th className="p-4 font-normal text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {filteredBookings.map((b) => (
                              <tr key={b.id} className="hover:bg-white/[0.02] transition">
                                <td className="p-4">
                                  <div className="font-bold text-white uppercase">{b.userName || "Guest User"}</div>
                                  <div className="text-[10px] text-white/50 mt-0.5">{b.userEmail}</div>
                                  <div className="text-[10px] text-white/40 font-mono mt-0.5">{b.userPhone || "No Phone"}</div>
                                </td>
                                <td className="p-4">
                                  <span className="font-medium text-white">{b.eventType}</span>
                                  <div className="text-[9px] text-white/30 uppercase mt-0.5 tracking-wider font-mono">{b.id}</div>
                                </td>
                                <td className="p-4 font-mono text-white/80">{b.guests} Pax</td>
                                <td className="p-4">
                                  {new Date(b.date).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </td>
                                <td className="p-4 font-mono font-bold text-accent-yellow">
                                  ₹{b.totalPrice.toLocaleString("en-IN")}
                                </td>
                                <td className="p-4">
                                  <span
                                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                      b.status === "Confirmed"
                                        ? "bg-green-500/10 text-green-400"
                                        : "bg-yellow-500/10 text-yellow-400"
                                    }`}
                                  >
                                    {b.status === "Confirmed" ? (
                                      <>
                                        <CheckCircle2 className="h-3 w-3" /> Confirmed
                                      </>
                                    ) : (
                                      <>
                                        <RefreshCw className="h-3 w-3 animate-spin" style={{ animationDuration: "10s" }} /> Pending
                                      </>
                                    )}
                                  </span>
                                </td>
                                <td className="p-4 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    {isAdmin && (
                                      <>
                                        <button
                                          onClick={() => {
                                            const newStatus = b.status === "Confirmed" ? "Pending" : "Confirmed";
                                            updateBookingStatus(b.id, newStatus);
                                            toast.success(`Booking ${b.id} updated to ${newStatus}`);
                                          }}
                                          title={b.status === "Confirmed" ? "Mark Pending" : "Confirm Booking"}
                                          className={`p-1.5 rounded-lg border transition ${
                                            b.status === "Confirmed"
                                              ? "border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                                              : "border-green-500/30 text-green-400 hover:bg-green-500/10"
                                          }`}
                                        >
                                          <RefreshCw className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                          onClick={() => {
                                            if (confirm("Are you sure you want to delete this booking inquiry?")) {
                                              deleteBooking(b.id);
                                              toast.info(`Deleted booking ${b.id}`);
                                            }
                                          }}
                                          title="Delete Booking"
                                          className="p-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition"
                                        >
                                          <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                      </>
                                    )}
                                    {!isAdmin && (
                                      <span className="text-[10px] text-white/30 italic">Locked</span>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* --- RIDES TAB --- */}
              {activeTab === "rides" && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Action header */}
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-display text-lg tracking-wide uppercase">Attractions Registry</h3>
                      <p className="text-xs text-white/50 mt-0.5">Customize ride properties, pricing, and age requirements.</p>
                    </div>

                    <button
                      onClick={() => {
                        if (!isAdmin) {
                          toast.error("Please login as Admin to add new rides.");
                          return;
                        }
                        setShowAddRideModal(true);
                      }}
                      className="bg-accent-yellow hover:bg-accent-yellow/90 text-deep-purple font-display text-xs tracking-wider px-5 py-3 rounded-xl transition flex items-center justify-center gap-1.5"
                    >
                      <Plus className="h-4 w-4" /> Register Attraction
                    </button>
                  </div>

                  {/* Rides Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {rides.map((ride) => (
                      <div
                        key={ride.slug}
                        className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 flex flex-col justify-between gap-6 hover:bg-white/[0.04] transition group"
                      >
                        <div className="flex gap-4">
                          {/* Ride Mock Image Box with color tint representation */}
                          <div
                            className="h-16 w-16 rounded-xl flex items-center justify-center font-display text-lg font-bold border border-white/10 shrink-0 select-none shadow-inner"
                            style={{ backgroundColor: ride.tint + "20", color: ride.tint }}
                          >
                            {ride.name.substring(0, 2).toUpperCase()}
                          </div>
                          
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-display text-lg tracking-wide text-white uppercase truncate">{ride.name}</h4>
                              <span className="text-[9px] px-2 py-0.5 bg-white/5 rounded-full text-white/60 font-mono">
                                {ride.thrill}
                              </span>
                            </div>
                            <p className="text-[10px] text-white/40 tracking-wider font-mono uppercase mt-0.5">Slug: {ride.slug}</p>
                            <p className="text-xs text-white/70 mt-2 line-clamp-2">{ride.description}</p>
                          </div>
                        </div>

                        {/* Stats & Actions */}
                        <div className="flex justify-between items-center border-t border-white/5 pt-4">
                          <div className="grid grid-cols-3 gap-x-6 gap-y-1">
                            <div>
                              <span className="text-[9px] text-white/40 block">Daily Price</span>
                              <span className="text-xs font-mono font-bold text-accent-yellow">
                                ₹{(ride.pricePaise / 100).toLocaleString("en-IN")}
                              </span>
                            </div>
                            <div>
                              <span className="text-[9px] text-white/40 block">Capacity</span>
                              <span className="text-xs font-semibold text-white/80">{ride.capacity} / cycle</span>
                            </div>
                            <div>
                              <span className="text-[9px] text-white/40 block">Min Age</span>
                              <span className="text-xs font-semibold text-white/80">{ride.minAge}+ yrs</span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            {isAdmin ? (
                              <>
                                <button
                                  onClick={() => handleEditRideClick(ride)}
                                  title="Edit Ride Parameters"
                                  className="p-2 rounded-lg border border-white/10 hover:bg-white/10 text-white/80 transition"
                                >
                                  <Edit3 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Remove "${ride.name}" from service registry?`)) {
                                      deleteRide(ride.slug);
                                      toast.info(`Deleted ride ${ride.name}`);
                                    }
                                  }}
                                  title="Remove Ride"
                                  className="p-2 rounded-lg border border-red-500/20 hover:bg-red-500/10 text-red-400 transition"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </>
                            ) : (
                              <span className="text-[10px] text-white/30 italic">Locked</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* --- CUSTOMERS TAB --- */}
              {activeTab === "users" && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h3 className="font-display text-lg tracking-wide uppercase">Customer Directory</h3>
                    <p className="text-xs text-white/50 mt-0.5">Contact details and booking activities of registered park visitors.</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-left text-xs">
                        <thead>
                          <tr className="border-b border-white/10 bg-white/[0.02] text-white/50 font-display tracking-wider uppercase">
                            <th className="p-4 font-normal">Name</th>
                            <th className="p-4 font-normal">Email Address</th>
                            <th className="p-4 font-normal">Phone Contact</th>
                            <th className="p-4 font-normal">Total Reservations</th>
                            <th className="p-4 font-normal text-right">Acquisition Spent</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {derivedUsers.map((cust) => (
                            <tr key={cust.email} className="hover:bg-white/[0.02] transition">
                              <td className="p-4 font-bold text-white uppercase">{cust.name}</td>
                              <td className="p-4 text-white/80 font-mono">{cust.email}</td>
                              <td className="p-4 text-white/80 font-mono">{cust.phone}</td>
                              <td className="p-4 text-white/80 font-mono">{cust.count} bookings</td>
                              <td className="p-4 text-right font-mono font-bold text-green-400">
                                ₹{cust.totalPaid.toLocaleString("en-IN")}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* --- LOCATIONS TAB --- */}
              {activeTab === "locations" && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-display text-lg tracking-wide uppercase">Active Melas & Locations</h3>
                      <p className="text-xs text-white/50 mt-0.5">Manage event locations and override ride prices for specific melas.</p>
                    </div>
                    <button
                      onClick={() => {
                        if (!isAdmin) { toast.error("Admin only"); return; }
                        setShowAddLocationModal(true);
                      }}
                      className="bg-accent-yellow hover:bg-accent-yellow/90 text-deep-purple font-display text-xs px-5 py-3 rounded-xl transition flex items-center justify-center gap-1.5"
                    >
                      <Plus className="h-4 w-4" /> Add Location
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    {locations.map((loc) => (
                      <div key={loc.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h4 className="font-display text-xl text-white flex items-center gap-2">
                              {loc.name}
                              {loc.isActive ? (
                                <span className="bg-green-500/10 text-green-400 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest font-bold">Live</span>
                              ) : (
                                <span className="bg-red-500/10 text-red-400 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest font-bold">Closed</span>
                              )}
                            </h4>
                            <p className="text-xs text-white/50 mt-1">{loc.city} • {loc.address}</p>
                            <p className="text-[10px] text-white/40 font-mono mt-1">
                              {new Date(loc.startDate).toLocaleDateString()} - {new Date(loc.endDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                updateLocation(loc.id, { isActive: !loc.isActive });
                              }}
                              className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-white/80 hover:bg-white/5"
                            >
                              Toggle Status
                            </button>
                            <button
                              onClick={() => {
                                if (confirm("Delete this location?")) deleteLocation(loc.id);
                              }}
                              className="px-3 py-1.5 rounded-lg border border-red-500/20 text-xs text-red-400 hover:bg-red-500/10"
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        <div className="border-t border-white/5 pt-4">
                          <h5 className="font-display text-sm text-white/70 mb-4">Location Specific Ride Pricing</h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {rides.map((rideInfo) => {
                              const existingPricingIndex = loc.ridePricing.findIndex(rp => rp.rideSlug === rideInfo.slug);
                              const existingPricing = existingPricingIndex >= 0 ? loc.ridePricing[existingPricingIndex] : null;
                              
                              const currentPricePaise = existingPricing ? existingPricing.pricePaise : rideInfo.pricePaise;

                              return (
                                <div key={rideInfo.slug} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                                  <div>
                                    <div className="text-xs font-bold text-white">{rideInfo.name}</div>
                                    <div className="text-[10px] text-white/40">Base: ₹{rideInfo.pricePaise / 100}</div>
                                  </div>
                                  <div className="flex flex-col items-end gap-1">
                                    <input 
                                      type="number"
                                      className="w-20 bg-black/50 border border-white/10 rounded px-2 py-1 text-xs text-accent-yellow font-mono text-right"
                                      value={currentPricePaise / 100}
                                      onChange={(e) => {
                                        const newPricePaise = Number(e.target.value) * 100;
                                        const newPricing = [...loc.ridePricing];
                                        
                                        if (existingPricingIndex >= 0) {
                                          newPricing[existingPricingIndex] = { ...newPricing[existingPricingIndex], pricePaise: newPricePaise };
                                        } else {
                                          newPricing.push({ rideSlug: rideInfo.slug, pricePaise: newPricePaise, isActive: true });
                                        }
                                        
                                        updateLocation(loc.id, { ridePricing: newPricing });
                                      }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                            
                            {rides.length === 0 && (
                              <div className="text-center py-4 text-white/30 text-[10px] col-span-full">
                                No rides available. Add rides from the "RIDES" tab first.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {locations.length === 0 && (
                      <div className="text-center py-10 text-white/40 text-xs border border-dashed border-white/10 rounded-2xl">
                        No locations added yet. Click 'Add Location' to create your first mela.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* --- PACKAGE INQUIRIES TAB --- */}
              {activeTab === "inquiries" && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex justify-between items-start flex-wrap gap-4">
                    <div>
                      <h3 className="font-display text-lg tracking-wide uppercase">Package Inquiries</h3>
                      <p className="text-xs text-white/50 mt-0.5">Customers who clicked &apos;Select Package&apos; and filled the inquiry form.</p>
                    </div>
                    <div className="flex gap-3 items-center">
                      <div className="flex gap-2 text-xs">
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                          <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                          New: {inquiries.filter(i => i.status === "New").length}
                        </span>
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                          Contacted: {inquiries.filter(i => i.status === "Contacted").length}
                        </span>
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 text-white/40 border border-white/10">
                          <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
                          Closed: {inquiries.filter(i => i.status === "Closed").length}
                        </span>
                      </div>
                      <button
                        onClick={fetchInquiries}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-white/10 hover:bg-white/5 text-white/60 text-xs transition"
                      >
                        <RefreshCw className="h-3.5 w-3.5" /> Refresh
                      </button>
                    </div>
                  </div>

                  {inquiriesLoading ? (
                    <div className="flex justify-center py-20">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent-yellow border-t-transparent" />
                    </div>
                  ) : inquiries.length === 0 ? (
                    <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl text-white/40 text-sm">
                      <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-30" />
                      Abhi tak koi inquiry nahi aayi. Package section ke buttons ab live hain!
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {inquiries.map((inq) => (
                        <div
                          key={inq.id}
                          className={`rounded-2xl border p-5 transition ${
                            inq.status === "New"
                              ? "border-orange-500/20 bg-orange-500/[0.03]"
                              : inq.status === "Contacted"
                              ? "border-blue-500/20 bg-blue-500/[0.03]"
                              : "border-white/5 bg-white/[0.01]"
                          }`}
                        >
                          <div className="flex flex-wrap justify-between gap-4">
                            {/* Left: Contact Info */}
                            <div className="space-y-2 min-w-0">
                              <div className="flex items-center gap-3 flex-wrap">
                                <h4 className="font-display text-lg text-white">{inq.name}</h4>
                                <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-widest ${
                                  inq.status === "New"
                                    ? "bg-orange-500/10 text-orange-400"
                                    : inq.status === "Contacted"
                                    ? "bg-blue-500/10 text-blue-400"
                                    : "bg-white/5 text-white/30"
                                }`}>
                                  {inq.status}
                                </span>
                                <span className="text-[10px] px-2 py-1 bg-violet-500/10 text-violet-400 rounded-full font-medium">
                                  {inq.packageName}
                                </span>
                              </div>

                              <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-white/60">
                                <a href={`tel:${inq.phone}`} className="flex items-center gap-1.5 hover:text-accent-yellow transition">
                                  <PhoneCall className="h-3.5 w-3.5" /> {inq.phone}
                                </a>
                                <a href={`mailto:${inq.email}`} className="flex items-center gap-1.5 hover:text-accent-yellow transition">
                                  📧 {inq.email}
                                </a>
                                <span className="flex items-center gap-1.5">
                                  <MapPin className="h-3.5 w-3.5" /> {inq.eventCity}
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <Calendar className="h-3.5 w-3.5" /> {new Date(inq.eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                </span>
                                <span className="flex items-center gap-1.5 text-white/30">
                                  <Clock className="h-3 w-3" /> {new Date(inq.createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                                </span>
                              </div>

                              {inq.notes && (
                                <p className="text-xs text-white/40 italic border-l-2 border-white/10 pl-3 mt-1">{inq.notes}</p>
                              )}
                            </div>

                            {/* Right: Actions */}
                            <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center shrink-0">
                              <a
                                href={`https://wa.me/${inq.phone.replace(/\D/g, "")}?text=Hello%20${encodeURIComponent(inq.name)},%20Naaz%20Amusement%20ki%20taraf%20se%20aapki%20${encodeURIComponent(inq.packageName)}%20package%20inquiry%20ke%20regarding%20hum%20contact%20kar%20rahe%20hain.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-500/10 hover:bg-green-500/20 text-green-400 text-xs font-medium transition border border-green-500/20"
                              >
                                📱 WhatsApp
                              </a>
                              {inq.status === "New" && (
                                <button
                                  onClick={() => updateInquiryStatus(inq.id, "Contacted")}
                                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-medium transition border border-blue-500/20"
                                >
                                  <PhoneCall className="h-3.5 w-3.5" /> Mark Contacted
                                </button>
                              )}
                              {inq.status === "Contacted" && (
                                <button
                                  onClick={() => updateInquiryStatus(inq.id, "Closed")}
                                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 text-xs font-medium transition border border-white/10"
                                >
                                  <CheckCircle2 className="h-3.5 w-3.5" /> Close
                                </button>
                              )}
                              {inq.status === "Closed" && (
                                <button
                                  onClick={() => updateInquiryStatus(inq.id, "New")}
                                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 text-xs font-medium transition border border-orange-500/20"
                                >
                                  <RefreshCw className="h-3.5 w-3.5" /> Reopen
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* --- CONTENT TAB --- */}
              {activeTab === "content" && (
                <div className="animate-fadeIn">
                  <ContentManager />
                </div>
              )}

            </div>
          </div>
        </div>
      </main>

      {/* --- ADD RIDE MODAL --- */}
      <AnimatePresence>
        {showAddRideModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg rounded-2xl border border-white/10 bg-deep-purple p-6 shadow-2xl overflow-y-auto max-h-[85vh]"
            >
              <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
                <h3 className="font-display text-xl uppercase tracking-wide">Register New Attraction</h3>
                <button onClick={() => setShowAddRideModal(false)} className="text-white/40 hover:text-white">
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleAddRideSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/50 uppercase tracking-widest text-[9px] mb-1 font-semibold">Ride Name</label>
                    <input
                      type="text"
                      required
                      value={rideForm.name}
                      onChange={(e) => setRideForm({ ...rideForm, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, "-") })}
                      className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/5 focus:outline-none focus:border-accent-yellow text-white"
                      placeholder="e.g. Space Odyssey"
                    />
                  </div>
                  <div>
                    <label className="block text-white/50 uppercase tracking-widest text-[9px] mb-1 font-semibold">URL Slug (Auto)</label>
                    <input
                      type="text"
                      required
                      value={rideForm.slug}
                      onChange={(e) => setRideForm({ ...rideForm, slug: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/5 focus:outline-none focus:border-accent-yellow text-white"
                      placeholder="space-odyssey"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/50 uppercase tracking-widest text-[9px] mb-1 font-semibold">Hindi Name Translation</label>
                    <input
                      type="text"
                      value={rideForm.nameHi}
                      onChange={(e) => setRideForm({ ...rideForm, nameHi: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/5 focus:outline-none focus:border-accent-yellow text-white"
                      placeholder="e.g. स्पेस ओडिसी"
                    />
                  </div>
                  <div>
                    <label className="block text-white/50 uppercase tracking-widest text-[9px] mb-1 font-semibold">Thrill Category</label>
                    <select
                      value={rideForm.thrill}
                      onChange={(e) => setRideForm({ ...rideForm, thrill: e.target.value as Thrill })}
                      className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/5 focus:outline-none focus:border-accent-yellow text-white/80"
                    >
                      <option value="Family" className="bg-deep-purple">Family</option>
                      <option value="Medium" className="bg-deep-purple">Medium</option>
                      <option value="Wild" className="bg-deep-purple">Wild</option>
                      <option value="Extreme" className="bg-deep-purple">Extreme</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-white/50 uppercase tracking-widest text-[9px] mb-1 font-semibold">Ride Image</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={rideForm.image}
                      onChange={(e) => setRideForm({ ...rideForm, image: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/5 focus:outline-none focus:border-accent-yellow text-white"
                      placeholder="/image.jpg"
                    />
                    <CloudinaryUploadButton
                      folder="naaz-amusement/rides"
                      onUploaded={(url) => setRideForm((current) => ({ ...current, image: url }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-white/50 uppercase tracking-widest text-[9px] mb-1 font-semibold">Min Age (Years)</label>
                    <input
                      type="number"
                      value={rideForm.minAge}
                      onChange={(e) => setRideForm({ ...rideForm, minAge: Number(e.target.value) })}
                      className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/5 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-white/50 uppercase tracking-widest text-[9px] mb-1 font-semibold">Cycle Capacity</label>
                    <input
                      type="number"
                      value={rideForm.capacity}
                      onChange={(e) => setRideForm({ ...rideForm, capacity: Number(e.target.value) })}
                      className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/5 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-white/50 uppercase tracking-widest text-[9px] mb-1 font-semibold">Cycle Duration</label>
                    <input
                      type="text"
                      value={rideForm.duration}
                      onChange={(e) => setRideForm({ ...rideForm, duration: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/5 focus:outline-none"
                      placeholder="e.g. 4 min"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/50 uppercase tracking-widest text-[9px] mb-1 font-semibold">Base Ticket Price (Paise, eg: 5000 = ₹50)</label>
                    <input
                      type="number"
                      value={rideForm.pricePaise}
                      onChange={(e) => setRideForm({ ...rideForm, pricePaise: Number(e.target.value) })}
                      className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/5 focus:outline-none focus:border-accent-yellow"
                    />
                  </div>
                  <div>
                    <label className="block text-white/50 uppercase tracking-widest text-[9px] mb-1 font-semibold">Glow Accent Color (Hex)</label>
                    <input
                      type="text"
                      value={rideForm.tint}
                      onChange={(e) => setRideForm({ ...rideForm, tint: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/5 focus:outline-none focus:border-accent-yellow"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/50 uppercase tracking-widest text-[9px] mb-1 font-semibold">Tagline Hook</label>
                  <input
                    type="text"
                    value={rideForm.tagline}
                    onChange={(e) => setRideForm({ ...rideForm, tagline: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/5 focus:outline-none focus:border-accent-yellow"
                    placeholder="Short catching tagline..."
                  />
                </div>

                <div>
                  <label className="block text-white/50 uppercase tracking-widest text-[9px] mb-1 font-semibold">Detailed Description</label>
                  <textarea
                    rows={3}
                    value={rideForm.description}
                    onChange={(e) => setRideForm({ ...rideForm, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 focus:outline-none focus:border-accent-yellow"
                    placeholder="Detailed explanation of the safety limits, specs, and layout..."
                  />
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddRideModal(false)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-accent-yellow hover:bg-accent-yellow/90 text-deep-purple font-display uppercase tracking-wider rounded-lg transition"
                  >
                    Confirm & Register
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- EDIT RIDE MODAL --- */}
      <AnimatePresence>
        {showEditRideModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg rounded-2xl border border-white/10 bg-deep-purple p-6 shadow-2xl overflow-y-auto max-h-[85vh]"
            >
              <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
                <h3 className="font-display text-xl uppercase tracking-wide">Edit Attraction Parameters</h3>
                <button onClick={() => { setShowEditRideModal(false); setEditingRideSlug(null); }} className="text-white/40 hover:text-white">
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleEditRideSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/50 uppercase tracking-widest text-[9px] mb-1 font-semibold">Ride Name</label>
                    <input
                      type="text"
                      required
                      value={rideForm.name}
                      onChange={(e) => setRideForm({ ...rideForm, name: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/5 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-white/50 uppercase tracking-widest text-[9px] mb-1 font-semibold">URL Slug (Uneditable)</label>
                    <input
                      type="text"
                      disabled
                      value={rideForm.slug}
                      className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white/40 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/50 uppercase tracking-widest text-[9px] mb-1 font-semibold">Hindi Name Translation</label>
                    <input
                      type="text"
                      value={rideForm.nameHi}
                      onChange={(e) => setRideForm({ ...rideForm, nameHi: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/5 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-white/50 uppercase tracking-widest text-[9px] mb-1 font-semibold">Thrill Category</label>
                    <select
                      value={rideForm.thrill}
                      onChange={(e) => setRideForm({ ...rideForm, thrill: e.target.value as Thrill })}
                      className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white/80"
                    >
                      <option value="Family" className="bg-deep-purple">Family</option>
                      <option value="Medium" className="bg-deep-purple">Medium</option>
                      <option value="Wild" className="bg-deep-purple">Wild</option>
                      <option value="Extreme" className="bg-deep-purple">Extreme</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-white/50 uppercase tracking-widest text-[9px] mb-1 font-semibold">Ride Image</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={rideForm.image}
                      onChange={(e) => setRideForm({ ...rideForm, image: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/5 focus:outline-none focus:border-accent-yellow text-white"
                      placeholder="/image.jpg"
                    />
                    <CloudinaryUploadButton
                      folder="naaz-amusement/rides"
                      onUploaded={(url) => setRideForm((current) => ({ ...current, image: url }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-white/50 uppercase tracking-widest text-[9px] mb-1 font-semibold">Min Age (Years)</label>
                    <input
                      type="number"
                      value={rideForm.minAge}
                      onChange={(e) => setRideForm({ ...rideForm, minAge: Number(e.target.value) })}
                      className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/5"
                    />
                  </div>
                  <div>
                    <label className="block text-white/50 uppercase tracking-widest text-[9px] mb-1 font-semibold">Cycle Capacity</label>
                    <input
                      type="number"
                      value={rideForm.capacity}
                      onChange={(e) => setRideForm({ ...rideForm, capacity: Number(e.target.value) })}
                      className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/5"
                    />
                  </div>
                  <div>
                    <label className="block text-white/50 uppercase tracking-widest text-[9px] mb-1 font-semibold">Cycle Duration</label>
                    <input
                      type="text"
                      value={rideForm.duration}
                      onChange={(e) => setRideForm({ ...rideForm, duration: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/50 uppercase tracking-widest text-[9px] mb-1 font-semibold">Rental Cost (Paise)</label>
                    <input
                      type="number"
                      value={rideForm.pricePaise}
                      onChange={(e) => setRideForm({ ...rideForm, pricePaise: Number(e.target.value) })}
                      className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/5"
                    />
                  </div>
                  <div>
                    <label className="block text-white/50 uppercase tracking-widest text-[9px] mb-1 font-semibold">Glow Accent Color (Hex)</label>
                    <input
                      type="text"
                      value={rideForm.tint}
                      onChange={(e) => setRideForm({ ...rideForm, tint: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/5"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/50 uppercase tracking-widest text-[9px] mb-1 font-semibold">Tagline Hook</label>
                  <input
                    type="text"
                    value={rideForm.tagline}
                    onChange={(e) => setRideForm({ ...rideForm, tagline: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/5"
                  />
                </div>

                <div>
                  <label className="block text-white/50 uppercase tracking-widest text-[9px] mb-1 font-semibold">Detailed Description</label>
                  <textarea
                    rows={3}
                    value={rideForm.description}
                    onChange={(e) => setRideForm({ ...rideForm, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5"
                  />
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => { setShowEditRideModal(false); setEditingRideSlug(null); }}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-accent-yellow hover:bg-accent-yellow/90 text-deep-purple font-display uppercase tracking-wider rounded-lg transition"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- ADD BOOKING/INQUIRY MODAL --- */}
      <AnimatePresence>
        {showAddBookingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg rounded-2xl border border-white/10 bg-deep-purple p-6 shadow-2xl overflow-y-auto max-h-[85vh]"
            >
              <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
                <h3 className="font-display text-xl uppercase tracking-wide">Register Offline Reservation</h3>
                <button onClick={() => setShowAddBookingModal(false)} className="text-white/40 hover:text-white">
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleAddBookingSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/50 uppercase tracking-widest text-[9px] mb-1 font-semibold">Customer Name</label>
                    <input
                      type="text"
                      required
                      value={bookingForm.userName}
                      onChange={(e) => setBookingForm({ ...bookingForm, userName: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/5 focus:outline-none"
                      placeholder="Customer full name"
                    />
                  </div>
                  <div>
                    <label className="block text-white/50 uppercase tracking-widest text-[9px] mb-1 font-semibold">Customer Contact Phone</label>
                    <input
                      type="text"
                      required
                      value={bookingForm.userPhone}
                      onChange={(e) => setBookingForm({ ...bookingForm, userPhone: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/5 focus:outline-none"
                      placeholder="e.g. 9876543210"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/50 uppercase tracking-widest text-[9px] mb-1 font-semibold">Customer Email</label>
                  <input
                    type="email"
                    value={bookingForm.userEmail}
                    onChange={(e) => setBookingForm({ ...bookingForm, userEmail: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/5 focus:outline-none"
                    placeholder="customer@email.com (defaults to guest)"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-white/50 uppercase tracking-widest text-[9px] mb-1 font-semibold">Event Type</label>
                    <select
                      value={bookingForm.eventType}
                      onChange={(e) => setBookingForm({ ...bookingForm, eventType: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/5 focus:outline-none text-white/80"
                    >
                      <option value="Corporate Event" className="bg-deep-purple">Corporate Event</option>
                      <option value="Birthday Party" className="bg-deep-purple">Birthday Party</option>
                      <option value="School Trip" className="bg-deep-purple">School Trip</option>
                      <option value="Wedding Carnival" className="bg-deep-purple">Wedding Carnival</option>
                      <option value="Other" className="bg-deep-purple">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/50 uppercase tracking-widest text-[9px] mb-1 font-semibold">Expected Guests</label>
                    <input
                      type="number"
                      value={bookingForm.guests}
                      onChange={(e) => setBookingForm({ ...bookingForm, guests: Number(e.target.value) })}
                      className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/5"
                    />
                  </div>
                  <div>
                    <label className="block text-white/50 uppercase tracking-widest text-[9px] mb-1 font-semibold">Target Date</label>
                    <input
                      type="date"
                      value={bookingForm.date}
                      onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white/80"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/50 uppercase tracking-widest text-[9px] mb-1 font-semibold">Distance Setup Slab</label>
                    <select
                      value={bookingForm.distanceSlab}
                      onChange={(e) => setBookingForm({ ...bookingForm, distanceSlab: e.target.value as "inside" | "medium" | "far" })}
                      className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white/80"
                    >
                      <option value="inside" className="bg-deep-purple">Jaipur Limits (₹5,000)</option>
                      <option value="medium" className="bg-deep-purple">50-100 km (₹12,000)</option>
                      <option value="far" className="bg-deep-purple">100+ km (₹25,000)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/50 uppercase tracking-widest text-[9px] mb-1 font-semibold">Total Price Estimate (₹)</label>
                    <input
                      type="number"
                      value={bookingForm.totalPrice}
                      onChange={(e) => setBookingForm({ ...bookingForm, totalPrice: Number(e.target.value) })}
                      className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/5 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/50 uppercase tracking-widest text-[9px] mb-1 font-semibold mb-1.5">Selected Amusement Rides</label>
                  <div className="grid grid-cols-3 gap-2 border border-white/10 bg-white/5 p-3 rounded-lg max-h-24 overflow-y-auto">
                    {rides.map((r) => (
                      <button
                        key={r.slug}
                        type="button"
                        onClick={() => toggleSelectRideInForm(r.slug)}
                        className={`px-2 py-1 rounded border text-[10px] font-medium transition truncate text-left ${
                          bookingForm.selectedRides.includes(r.slug)
                            ? "bg-accent-yellow border-accent-yellow text-deep-purple"
                            : "border-white/10 hover:bg-white/5 text-white/70"
                        }`}
                      >
                        {r.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-white/50 uppercase tracking-widest text-[9px] mb-1 font-semibold">Inquiry Status</label>
                  <select
                    value={bookingForm.status}
                    onChange={(e) => setBookingForm({ ...bookingForm, status: e.target.value as "Pending" | "Confirmed" })}
                    className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white/80"
                  >
                    <option value="Pending" className="bg-deep-purple">Pending Approval</option>
                    <option value="Confirmed" className="bg-deep-purple">Confirmed & Active</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddBookingModal(false)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-accent-yellow hover:bg-accent-yellow/90 text-deep-purple font-display uppercase tracking-wider rounded-lg transition"
                  >
                    Register Booking
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
      {/* --- ADD LOCATION MODAL --- */}
      <AnimatePresence>
        {showAddLocationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl rounded-2xl border border-white/10 bg-deep-purple p-6 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-display text-2xl text-white">Add New Location</h3>
                <button
                  onClick={() => setShowAddLocationModal(false)}
                  className="text-white/40 hover:text-white"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!locationForm.name || !locationForm.city || !locationForm.address) {
                    toast.error("Please fill required fields");
                    return;
                  }
                  
                  const success = await addLocation({
                    ...locationForm,
                    startDate: new Date(locationForm.startDate).toISOString(),
                    endDate: new Date(locationForm.endDate).toISOString(),
                    isActive: true,
                    ridePricing: rides.map(r => ({ rideSlug: r.slug, pricePaise: r.pricePaise, isActive: true }))
                  });
                  
                  if (success) {
                    toast.success("Location added!");
                    setShowAddLocationModal(false);
                    setLocationForm({
                      name: "",
                      city: "Jaipur",
                      address: "",
                      startDate: new Date().toISOString().split("T")[0],
                      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                      lat: 26.9124,
                      lng: 75.7873,
                      gmapsLink: "",
                      details: "",
                    });
                  } else {
                    toast.error("Failed to add location. Database connection might be offline.");
                  }
                }} 
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-white/50 mb-1">Location Name *</label>
                    <input
                      required
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white"
                      placeholder="e.g. Jaipur Summer Mela"
                      value={locationForm.name}
                      onChange={(e) => setLocationForm({ ...locationForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-white/50 mb-1">City *</label>
                    <input
                      required
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white"
                      placeholder="e.g. Jaipur"
                      value={locationForm.city}
                      onChange={(e) => setLocationForm({ ...locationForm, city: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/50 mb-1">Venue Address *</label>
                  <input
                    required
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white"
                    placeholder="e.g. VT Road Ground, Mansarovar"
                    value={locationForm.address}
                    onChange={(e) => setLocationForm({ ...locationForm, address: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-white/50 mb-1">Start Date *</label>
                    <input
                      required
                      type="date"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white [color-scheme:dark]"
                      value={locationForm.startDate}
                      onChange={(e) => setLocationForm({ ...locationForm, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-white/50 mb-1">End Date *</label>
                    <input
                      required
                      type="date"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white [color-scheme:dark]"
                      value={locationForm.endDate}
                      onChange={(e) => setLocationForm({ ...locationForm, endDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-white/50 mb-1">Latitude (for map) *</label>
                    <input
                      required
                      type="number"
                      step="any"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white"
                      value={locationForm.lat}
                      onChange={(e) => setLocationForm({ ...locationForm, lat: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-white/50 mb-1">Longitude (for map) *</label>
                    <input
                      required
                      type="number"
                      step="any"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white"
                      value={locationForm.lng}
                      onChange={(e) => setLocationForm({ ...locationForm, lng: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/50 mb-1">Google Maps Link</label>
                  <input
                    type="url"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white"
                    placeholder="https://maps.google.com/..."
                    value={locationForm.gmapsLink}
                    onChange={(e) => setLocationForm({ ...locationForm, gmapsLink: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/50 mb-1">Event Details (shown on map)</label>
                  <textarea
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white resize-none"
                    placeholder="Short description of the mela..."
                    value={locationForm.details}
                    onChange={(e) => setLocationForm({ ...locationForm, details: e.target.value })}
                  />
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddLocationModal(false)}
                    className="px-6 py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition font-display uppercase tracking-widest text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-accent-yellow text-deep-purple hover:bg-accent-yellow/90 transition font-display uppercase tracking-widest text-sm font-bold"
                  >
                    Add Location
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
