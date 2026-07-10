import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Ride } from "@/lib/rides";

interface RidesState {
  rides: Ride[];
  addRide: (ride: Ride) => Promise<boolean>;
  updateRide: (slug: string, updatedRide: Partial<Ride>) => Promise<boolean>;
  deleteRide: (slug: string) => Promise<boolean>;
  resetRides: () => Promise<void>;
  fetchRides: () => Promise<void>;
}

export const useRidesStore = create<RidesState>()(
  persist(
    (set) => ({
      rides: [],

      fetchRides: async () => {
        try {
          const res = await fetch("/api/rides");
          if (res.ok) {
            const data = await res.json();
            set({ rides: data });
          }
        } catch (error) {
          console.error("Failed to fetch rides:", error);
        }
      },

      addRide: async (ride) => {
        try {
          const res = await fetch("/api/rides", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(ride),
          });

          if (res.ok) {
            const newRide = await res.json();
            set((state) => ({ rides: [newRide, ...state.rides] }));
            return true;
          }
          console.warn("DB failed, using offline fallback for ride");
          set((state) => ({ rides: [ride, ...state.rides] }));
          return true;
        } catch (error) {
          console.error("Add ride API error, using offline fallback:", error);
          set((state) => ({ rides: [ride, ...state.rides] }));
          return true;
        }
      },

      updateRide: async (slug, updatedRide) => {
        try {
          const res = await fetch(`/api/rides/${slug}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedRide),
          });

          if (res.ok) {
            const updated = await res.json();
            set((state) => ({
              rides: state.rides.map((r) => (r.slug === slug ? updated : r)),
            }));
            return true;
          }
          console.warn("DB failed, using offline fallback for ride update");
          set((state) => ({
            rides: state.rides.map((r) => (r.slug === slug ? { ...r, ...updatedRide } : r)),
          }));
          return true;
        } catch (error) {
          console.error("Update ride API error, using offline fallback:", error);
          set((state) => ({
            rides: state.rides.map((r) => (r.slug === slug ? { ...r, ...updatedRide } : r)),
          }));
          return true;
        }
      },

      deleteRide: async (slug) => {
        try {
          const res = await fetch(`/api/rides/${slug}`, {
            method: "DELETE",
          });

          if (res.ok) {
            set((state) => ({ rides: state.rides.filter((r) => r.slug !== slug) }));
            return true;
          }
          console.warn("DB failed, using offline fallback for ride delete");
          set((state) => ({ rides: state.rides.filter((r) => r.slug !== slug) }));
          return true;
        } catch (error) {
          console.error("Delete ride API error, using offline fallback:", error);
          set((state) => ({ rides: state.rides.filter((r) => r.slug !== slug) }));
          return true;
        }
      },

      resetRides: async () => {
        try {
          const res = await fetch("/api/db-reset", {
            method: "POST",
          });

          if (res.ok) {
            const data = await res.json();
            set({ rides: data.rides });
          }
        } catch (error) {
          console.error("Reset rides API error:", error);
        }
      },
    }),
    {
      name: "naaz-rides-storage",
    }
  )
);
