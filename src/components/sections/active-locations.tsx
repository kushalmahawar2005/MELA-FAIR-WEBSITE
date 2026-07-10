"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Navigation, Compass, Phone, Calendar, ArrowRight, CheckCircle2 } from "lucide-react";
import { rides as defaultRides } from "@/lib/rides";
import Link from "next/link";
import { useRidesStore } from "@/stores/rides-store";
import { useContentStore } from "@/stores/content-store";
import { Eyebrow } from "@/components/shared/eyebrow";
import type { ActiveMela, PresetCity } from "@/lib/content";

import { useLocationsStore } from "@/stores/locations-store";

export function ActiveLocations() {
  const { content, fetchContent } = useContentStore();
  const { rides: dynamicRides, fetchRides } = useRidesStore();
  const { locations: storeLocations, fetchLocations } = useLocationsStore();
  
  const section = content.activeLocations;
  const presetCities = section.presetCities as PresetCity[];
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"map" | "find">("map");
  const [selectedMela, setSelectedMela] = useState<ActiveMela | null>(null);
  
  // Geolocation & calculation state
  const [userLocationName, setUserLocationName] = useState<string>("");
  const [nearbyFairs, setNearbyFairs] = useState<(ActiveMela & { distance: number })[]>([]);
  const [isLocating, setIsLocating] = useState(false);
  const [selectedPresetCity, setSelectedPresetCity] = useState("");

  // Leaflet map refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [key: string]: any }>({});
  const userMarkerRef = useRef<any>(null);

  useEffect(() => {
    setMounted(true);
    fetchRides();
    fetchContent();
    fetchLocations();
  }, [fetchRides, fetchContent, fetchLocations]);

  // Compute dynamic locations from DB
  const locations = storeLocations
    .filter((loc) => {
      if (!loc.isActive) return false;
      const end = new Date(loc.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return end >= today; // Keep if it hasn't expired
    })
    .map((loc) => {
      const start = new Date(loc.startDate);
      const end = new Date(loc.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const isLive = start <= today && end >= today;
      const status = isLive ? "LIVE NOW" : "UPCOMING";
      
      return {
        id: loc.id,
        name: loc.name,
        city: loc.city,
        venue: loc.address,
        status,
        dates: `${start.toLocaleDateString("en-IN", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}`,
        details: loc.details || `Join us at ${loc.name} for an incredible experience with the best amusement rides in ${loc.city}.`,
        lat: loc.lat || 26.9124,
        lng: loc.lng || 75.7873,
        installedRides: loc.ridePricing?.filter(rp => rp.isActive).map(rp => rp.rideSlug) || [],
        gmapsLink: loc.gmapsLink || `https://maps.google.com/?q=${loc.lat || 26.9124},${loc.lng || 75.7873}`,
      } as ActiveMela;
    });

  useEffect(() => {
    if (locations.length === 0) return;
    setSelectedMela((current) => {
      if (current && locations.find((loc) => loc.id === current.id)) {
        return current;
      }
      return locations[0] ?? null;
    });
  }, [locations]);

  const rides = mounted && dynamicRides.length > 0 ? dynamicRides : defaultRides;
  const activeMela = selectedMela ?? locations[0] ?? null;

  // Dynamic Leaflet Loader
  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    // Load Leaflet CSS
    const leafletCSS = document.createElement("link");
    leafletCSS.rel = "stylesheet";
    leafletCSS.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    leafletCSS.id = "leaflet-css-link";
    if (!document.getElementById("leaflet-css-link")) {
      document.head.appendChild(leafletCSS);
    }

    // Load Leaflet JS
    const leafletJS = document.createElement("script");
    leafletJS.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    leafletJS.id = "leaflet-js-link";
    leafletJS.async = true;
    
    leafletJS.onload = () => {
      const L = (window as any).L;
      if (!L || !mapContainerRef.current || mapInstanceRef.current) return;

      // Initialize map centered at Rajasthan center
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([26.2, 74.8], 7);

      mapInstanceRef.current = map;

      // Add Zoom control at top right
      L.control.zoom({ position: "topright" }).addTo(map);

      // CartoDB Dark Matter premium dark tiles
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 18,
      }).addTo(map);

      // Setup custom glow markers for locations
      locations.forEach((mela) => {
        const isLive = mela.status === "LIVE NOW";
        const pinHtml = `
          <div class="relative flex h-5 w-5 items-center justify-center">
            ${isLive ? `<span class="absolute inline-flex h-full w-full rounded-full animate-ping bg-accent-yellow opacity-75"></span>` : ""}
            <div class="relative h-3.5 w-3.5 rounded-full bg-accent-yellow border-2 border-[#0A0514] shadow-[0_0_10px_rgba(238,167,39,0.8)]"></div>
          </div>
        `;

        const customIcon = L.divIcon({
          className: "custom-leaflet-marker",
          html: pinHtml,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        const marker = L.marker([mela.lat, mela.lng], { icon: customIcon })
          .addTo(map)
          .bindPopup(`
            <div class="p-2 text-deep-purple font-geist">
              <strong class="font-display text-sm block">${mela.name}</strong>
              <span class="text-xs text-black/60 block mt-1">${mela.venue}</span>
            </div>
          `);

        marker.on("click", () => {
          setSelectedMela(mela);
          setActiveTab("map");
        });

        markersRef.current[mela.id] = marker;
      });
    };

    if (!document.getElementById("leaflet-js-link")) {
      document.head.appendChild(leafletJS);
    } else {
      // Script already loaded, trigger manual onload
      const checkLeaflet = setInterval(() => {
        if ((window as any).L) {
          clearInterval(checkLeaflet);
          if (leafletJS.onload) (leafletJS.onload as any)();
        }
      }, 100);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [activeTab, locations]);

  // Center map on selected mela
  useEffect(() => {
    const L = (window as any).L;
    if (mapInstanceRef.current && activeMela && L) {
      mapInstanceRef.current.setView([activeMela.lat, activeMela.lng], 10, {
        animate: true,
        duration: 1.2,
      });

      // Open selected popup
      const marker = markersRef.current[activeMela.id];
      if (marker) {
        marker.openPopup();
      }
    }
  }, [activeMela]);

  // Calculate distance using Haversine formula
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  const calculateNearest = (lat: number, lng: number, label: string) => {
    setUserLocationName(label);
    const calculated = locations
      .map((item) => {
        const dist = getDistance(lat, lng, item.lat, item.lng);
        return { ...item, distance: dist };
      })
      .sort((a, b) => a.distance - b.distance);
    setNearbyFairs(calculated);

    // Add user location marker on Map
    const L = (window as any).L;
    if (mapInstanceRef.current && L) {
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
      }

      const userIcon = L.divIcon({
        className: "user-leaflet-marker",
        html: `
          <div class="relative flex h-6 w-6 items-center justify-center">
            <span class="absolute inline-flex h-full w-full rounded-full animate-ping bg-blue-500 opacity-60"></span>
            <div class="relative h-4 w-4 rounded-full bg-blue-500 border-2 border-white shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      userMarkerRef.current = L.marker([lat, lng], { icon: userIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup(`<strong class="text-xs font-geist text-blue-600 block p-1">Your Location (${label})</strong>`)
        .openPopup();

      // Pan to user location
      mapInstanceRef.current.setView([lat, lng], 9, { animate: true });
    }
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser. Please select your city instead.");
      return;
    }
    setIsLocating(true);
    setSelectedPresetCity("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        calculateNearest(pos.coords.latitude, pos.coords.longitude, "your GPS location");
      },
      () => {
        setIsLocating(false);
        alert("Could not access your location. Please choose a city from the list below.");
      },
      { timeout: 10000 }
    );
  };

  const handlePresetSelect = (cityName: string) => {
    setSelectedPresetCity(cityName);
    const city = presetCities.find((c) => c.name === cityName);
    if (city) {
      calculateNearest(city.lat, city.lng, cityName);
    }
  };

  return (
    <section id="locations" className="relative isolate overflow-hidden bg-[#0A0514] py-20 sm:py-28 lg:py-32">
      {/* Dynamic Leaflet Popup overrides */}
      <style jsx global>{`
        .leaflet-popup-content-wrapper {
          background: #ffffff !important;
          border-radius: 12px !important;
          border: 1px solid rgba(0,0,0,0.1) !important;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3) !important;
        }
        .leaflet-popup-tip {
          background: #ffffff !important;
        }
        .leaflet-container {
          background: #0A0514 !important;
        }
        .leaflet-bar {
          border: 1px solid rgba(255,255,255,0.1) !important;
          box-shadow: none !important;
          border-radius: 8px !important;
          overflow: hidden;
        }
        .leaflet-bar a {
          background: rgba(30, 20, 48, 0.9) !important;
          color: #ffffff !important;
          border-bottom: 1px solid rgba(255,255,255,0.1) !important;
        }
        .leaflet-bar a:hover {
          background: #EEA727 !important;
          color: #0A0514 !important;
        }
      `}</style>

      {/* Decorative Glow */}
      <div className="pointer-events-none absolute -left-1/4 top-1/4 -z-10 h-96 w-96 rounded-full bg-accent-yellow/5 blur-[120px]" />
      <div className="pointer-events-none absolute -right-1/4 bottom-1/4 -z-10 h-96 w-96 rounded-full bg-emerald-400/5 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-8">
        {/* Header */}
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

        {/* Tab switchers */}
        <div className="mt-10 flex items-center justify-center">
          <div className="grid w-full max-w-sm grid-cols-2 gap-2 rounded-[16px] bg-white/5 p-1 backdrop-blur-md">
            <button
              onClick={() => {
                setActiveTab("map");
                setUserLocationName("");
                setNearbyFairs([]);
              }}
              className={`flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-display tracking-widest transition-all ${
                activeTab === "map"
                  ? "bg-accent-yellow text-deep-purple shadow-[0_0_15px_rgba(238,167,39,0.3)]"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Compass className="h-4 w-4" />
              EXPLORE MAP
            </button>
            <button
              onClick={() => {
                setActiveTab("find");
                handlePresetSelect("Jaipur");
              }}
              className={`flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-display tracking-widest transition-all ${
                activeTab === "find"
                  ? "bg-accent-yellow text-deep-purple shadow-[0_0_15px_rgba(238,167,39,0.3)]"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Navigation className="h-4 w-4" />
              FIND NEAR ME
            </button>
          </div>
        </div>

        {/* Core Layout Grid */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_1.1fr] lg:gap-12 items-stretch">
          
          {/* Left panel: Info Panel */}
          <div className="flex flex-col gap-6">
            <AnimatePresence mode="wait">
              {activeTab === "map" ? (
                // Map Mode details
                <motion.div
                  key="map-details"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-[2rem] border border-white/10 bg-white/[0.02] p-5 sm:p-8 backdrop-blur-2xl h-full flex flex-col justify-between"
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <span className="inline-block rounded-full bg-accent-yellow/10 px-3.5 py-1 text-[10px] font-display uppercase tracking-widest text-accent-yellow">
                          {activeMela?.status}
                        </span>
                        <h3 className="mt-2 font-display text-2xl tracking-wide text-white">
                          {activeMela?.name}
                        </h3>
                        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-white/50">
                          <MapPin className="h-3.5 w-3.5 text-accent-yellow shrink-0" />
                          {activeMela?.venue}, {activeMela?.city}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-xs border border-white/5">
                        <Calendar className="h-3.5 w-3.5 text-accent-yellow" />
                        <span className="text-white/80">{activeMela?.dates}</span>
                      </div>
                    </div>

                    <p className="mt-6 text-sm leading-relaxed text-white/70">
                      {activeMela?.details}
                    </p>

                    {/* Installed Rides Section */}
                    <div className="mt-8 border-t border-white/10 pt-6">
                      <h4 className="font-display text-xs uppercase tracking-widest text-white/40">
                        Rides set up at this location
                      </h4>
                      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {activeMela?.installedRides?.map((slug) => {
                          const ride = rides.find((r) => r.slug === slug);
                          if (!ride) return null;
                          return (
                            <Link
                              key={slug}
                              href={`/rides/${slug}`}
                              className="flex items-center gap-3.5 rounded-xl border border-white/5 bg-white/5 p-3 hover:bg-white/10 hover:border-accent-yellow/30 transition-all group/rideitem"
                            >
                              <img
                                src={ride.image}
                                alt={ride.name}
                                className="h-10 w-10 rounded-lg object-cover group-hover/rideitem:scale-105 transition"
                              />
                              <div>
                                <span className="block text-sm font-semibold text-white group-hover/rideitem:text-accent-yellow transition">{ride.name}</span>
                                <span className="block text-[10px] text-accent-yellow uppercase tracking-widest font-display">
                                  {ride.thrill} THRILL
                                </span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-8 flex flex-wrap gap-4 pt-4 border-t border-white/10">
                    <a
                      href={activeMela?.gmapsLink ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-accent-yellow px-6 text-xs font-display tracking-widest text-deep-purple transition hover:scale-[1.02] shadow-[0_0_15px_rgba(238,167,39,0.2)]"
                    >
                      <Navigation className="h-4 w-4" />
                      GET DIRECTIONS
                    </a>
                    <a
                      href={`https://wa.me/919929068065?text=Hello%20Naaz%20Amusement,%20I'm%20inquiring%20about%20the%20${encodeURIComponent(activeMela?.name ?? "")}%20at%20${encodeURIComponent(activeMela?.venue ?? "")}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 text-xs font-display tracking-widest text-white transition hover:bg-white/10"
                    >
                      <Phone className="h-4 w-4 text-emerald-400" />
                      CONTACT VENUE HELPDESK
                    </a>
                  </div>
                </motion.div>
              ) : (
                // Find Near Me Panel
                <motion.div
                  key="find-panel"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-[2rem] border border-white/10 bg-white/[0.02] p-5 sm:p-8 backdrop-blur-2xl h-full flex flex-col justify-start"
                >
                  <h3 className="font-display text-xl tracking-wide text-white">
                    Locate Fairs & Melas Near You
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-white/50">
                    Share your current GPS coordinates, or pick a major city to instantly calculate the distance to the nearest Naaz Amusement installation site.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      onClick={handleGeolocate}
                      disabled={isLocating}
                      className="flex-1 min-w-[150px] inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white text-deep-purple text-xs font-display tracking-widest transition hover:bg-white/95 disabled:opacity-50"
                    >
                      <Navigation className="h-4 w-4" />
                      {isLocating ? "LOCATING..." : "GPS AUTO LOCATE"}
                    </button>

                    <div className="relative flex-[1.5] min-w-[200px]">
                      <select
                        value={selectedPresetCity}
                        onChange={(e) => handlePresetSelect(e.target.value)}
                        className="w-full h-12 rounded-xl border border-white/10 bg-white/5 px-4 text-xs text-white outline-none focus:border-accent-yellow"
                      >
                        <option value="" className="bg-[#1A1A1A]">Select Your City</option>
                        {presetCities.map((c) => (
                          <option key={c.name} value={c.name} className="bg-[#1A1A1A]">
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Near Me Results list */}
                  {nearbyFairs.length > 0 && (
                    <div className="mt-8 border-t border-white/10 pt-6 overflow-y-auto max-h-[380px] pr-2">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-display text-xs uppercase tracking-widest text-white/40">
                          Nearest setups to {userLocationName}
                        </span>
                        <span className="text-[10px] text-accent-yellow font-display uppercase tracking-widest flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5 text-accent-yellow shrink-0" />
                          CALCULATED LIVE
                        </span>
                      </div>

                      <div className="space-y-4">
                        {nearbyFairs.map((fair, index) => (
                          <div
                            key={fair.id}
                            onClick={() => {
                              setSelectedMela(fair);
                            }}
                            className={`rounded-[20px] border transition-all p-5 cursor-pointer hover:border-accent-yellow/40 ${
                              fair.id === (activeMela?.id ?? "")
                                ? "border-accent-yellow bg-accent-yellow/[0.05]"
                                : index === 0
                                ? "border-accent-yellow/40 bg-accent-yellow/[0.02]"
                                : "border-white/5 bg-white/[0.01]"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                {index === 0 && (
                                  <span className="inline-block rounded-full bg-accent-yellow text-deep-purple px-2 py-0.5 text-[8px] font-display uppercase tracking-wider mb-2">
                                    Closest Installation
                                  </span>
                                )}
                                <h4 className="font-display text-lg tracking-wide text-white">
                                  {fair.name}
                                </h4>
                                <p className="mt-1 text-xs text-white/60">
                                  {fair.venue}, {fair.city}
                                </p>
                              </div>

                              <div className="text-right shrink-0">
                                <span className="block font-display text-lg text-accent-yellow">
                                  {fair.distance} km
                                </span>
                                <span className="text-[9px] text-white/40 uppercase tracking-widest">
                                  Distance
                                </span>
                              </div>
                            </div>

                            <p className="mt-3 text-xs text-white/40 line-clamp-2">
                              {fair.details}
                            </p>

                            <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3.5">
                              <span className="text-[10px] text-accent-yellow/80 font-medium">
                                Running {fair.dates}
                              </span>

                              <a
                                href={fair.gmapsLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-display tracking-widest text-white hover:text-accent-yellow transition uppercase"
                              >
                                View Route <ArrowRight className="h-3 w-3" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right panel: Real Interactive Dark Leaflet Map */}
          <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.02] p-3 sm:p-4 backdrop-blur-2xl flex flex-col justify-between overflow-hidden min-h-[480px] lg:min-h-[580px]">
            
            {/* Map Container */}
            <div 
              ref={mapContainerRef} 
              className="w-full flex-1 rounded-[20px] overflow-hidden border border-white/5 shadow-2xl relative z-10"
              style={{ minHeight: "360px" }}
            />

            {/* Map Legend & Selector Pills */}
            <div className="mt-4 shrink-0 flex flex-wrap items-center justify-between gap-4 px-2 text-[10px] uppercase font-display tracking-widest text-white/40 z-20">
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-yellow opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-yellow"></span>
                  </span>
                  <span>Ongoing Setup</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full border border-white/60 bg-[#0A0514]"></span>
                  <span>Upcoming Setup</span>
                </div>
              </div>
              
              {/* Quick Center Actions */}
              <button 
                onClick={() => {
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.setView([26.2, 74.8], 7);
                  }
                }}
                className="text-[9px] border border-white/10 hover:border-accent-yellow bg-white/5 hover:bg-accent-yellow hover:text-deep-purple px-2 py-1 rounded transition uppercase tracking-wider font-semibold"
              >
                Reset Map Focus
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
