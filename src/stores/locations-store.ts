import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface RidePricing {
  rideSlug: string;
  pricePaise: number;
  isActive: boolean;
}

export interface LocationEvent {
  id: string;
  name: string;
  city: string;
  address: string;
  startDate: string;
  endDate: string;
  lat: number;
  lng: number;
  gmapsLink: string;
  details: string;
  isActive: boolean;
  ridePricing: RidePricing[];
}

interface LocationsState {
  locations: LocationEvent[];
  addLocation: (loc: Partial<LocationEvent>) => Promise<boolean>;
  updateLocation: (id: string, updatedLoc: Partial<LocationEvent>) => Promise<void>;
  deleteLocation: (id: string) => Promise<void>;
  fetchLocations: () => Promise<void>;
}

export const useLocationsStore = create<LocationsState>()(
  persist(
    (set) => ({
      locations: [],

      fetchLocations: async () => {
        try {
          const res = await fetch("/api/locations");
          if (res.ok) {
            const data = await res.json();
            set({ locations: data });
          }
        } catch (error) {
          console.error("Failed to fetch locations:", error);
        }
      },

      addLocation: async (loc) => {
        const offlineLoc = { ...loc, id: loc.id || `loc_${Date.now()}` } as LocationEvent;
        try {
          const res = await fetch("/api/locations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(offlineLoc),
          });

          if (res.ok) {
            const newLoc = await res.json();
            set((state) => ({ locations: [newLoc, ...state.locations] }));
            return true;
          }
          console.warn("DB failed, using offline fallback");
          set((state) => ({ locations: [offlineLoc, ...state.locations] }));
          return true;
        } catch (error) {
          console.error("Add location API error, using offline fallback:", error);
          set((state) => ({ locations: [offlineLoc, ...state.locations] }));
          return true;
        }
      },

      updateLocation: async (id, updatedLoc) => {
        try {
          const res = await fetch(`/api/locations/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedLoc),
          });

          if (res.ok) {
            const updated = await res.json();
            set((state) => ({
              locations: state.locations.map((l) => (l.id === id ? updated : l)),
            }));
            return;
          }
          
          set((state) => ({
            locations: state.locations.map((l) => (l.id === id ? { ...l, ...updatedLoc } : l)),
          }));
        } catch (error) {
          console.error("Update location API error:", error);
          set((state) => ({
            locations: state.locations.map((l) => (l.id === id ? { ...l, ...updatedLoc } : l)),
          }));
        }
      },

      deleteLocation: async (id) => {
        try {
          const res = await fetch(`/api/locations/${id}`, {
            method: "DELETE",
          });

          if (res.ok) {
            set((state) => ({ locations: state.locations.filter((l) => l.id !== id) }));
            return;
          }
          set((state) => ({ locations: state.locations.filter((l) => l.id !== id) }));
        } catch (error) {
          console.error("Delete location API error:", error);
          set((state) => ({ locations: state.locations.filter((l) => l.id !== id) }));
        }
      },
    }),
    {
      name: "naaz-locations-storage",
    }
  )
);
