import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  date: string;
  locationId?: string;
  tickets?: { rideSlug: string; quantity: number; pricePaise: number }[];
  eventType?: string;
  guests?: number;
  selectedRides?: string[];
  distanceSlab?: "inside" | "medium" | "far";
  totalPrice: number;
  createdAt: string;
  status: "Pending" | "Confirmed";
  userName?: string;
  userEmail?: string;
  userPhone?: string;
}

export interface AuthResult {
  success: boolean;
  message?: string;
}

interface AuthState {
  user: User | null;
  bookings: Booking[];
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<AuthResult>;
  register: (name: string, email: string, phone: string, password?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (name: string, phone: string) => Promise<boolean>;
  addBooking: (booking: Omit<Booking, "id" | "createdAt">) => Promise<void>;
  updateBookingStatus: (id: string, status: "Pending" | "Confirmed") => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;
  resetPassword: (email: string, password: string) => Promise<AuthResult>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<AuthResult>;
  fetchBookings: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      bookings: [],
      isLoading: false,

      fetchBookings: async () => {
        try {
          const res = await fetch("/api/bookings");
          if (res.ok) {
            const data = await res.json();
            set({ bookings: data });
          }
        } catch (error) {
          console.error("Failed to fetch bookings:", error);
        }
      },

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          const data = await res.json().catch(() => null);

          if (res.ok) {
            set({ user: data, isLoading: false });
            return { success: true };
          }

          set({ isLoading: false });
          return {
            success: false,
            message: data?.message || "Unable to sign in. Please try again.",
          };
        } catch (error) {
          console.error("Login API error:", error);
        }
        set({ isLoading: false });
        return {
          success: false,
          message: "Unable to reach the login service. Please try again.",
        };
      },

      register: async (name, email, phone, password) => {
        set({ isLoading: true });
        try {
          const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, phone, password }),
          });

          if (res.ok) {
            const userData = await res.json();
            set({ user: userData, isLoading: false });
            return true;
          }
        } catch (error) {
          console.error("Register API error:", error);
        }
        set({ isLoading: false });
        return false;
      },

      logout: () => {
        fetch("/api/auth/logout", { method: "POST" }).catch((error) => {
          console.error("Logout API error:", error);
        });
        set({ user: null });
      },

      updateProfile: async (name, phone) => {
        const currentUser = get().user;
        if (!currentUser) return false;

        try {
          const res = await fetch(`/api/auth/profile`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: currentUser.email, name, phone }),
          });

          if (res.ok) {
            const updatedUser = await res.json();
            set({ user: updatedUser });
            return true;
          }
        } catch (error) {
          console.error("Update profile API error:", error);
        }

        // Fallback local update
        set({
          user: {
            ...currentUser,
            name,
            phone,
          },
        });
        return true;
      },

      addBooking: async (bookingDetails) => {
        try {
          const res = await fetch("/api/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bookingDetails),
          });

          if (res.ok) {
            const newBooking = await res.json();
            set((state) => ({
              bookings: [newBooking, ...state.bookings],
            }));
          }
        } catch (error) {
          console.error("Add booking API error:", error);
        }
      },

      updateBookingStatus: async (id, status) => {
        try {
          const res = await fetch(`/api/bookings/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
          });

          if (res.ok) {
            const updatedBooking = await res.json();
            set((state) => ({
              bookings: state.bookings.map((b) =>
                b.id === id ? updatedBooking : b
              ),
            }));
          }
        } catch (error) {
          console.error("Update booking API error:", error);
        }
      },

      deleteBooking: async (id) => {
        try {
          const res = await fetch(`/api/bookings/${id}`, {
            method: "DELETE",
          });

          if (res.ok) {
            set((state) => ({
              bookings: state.bookings.filter((b) => b.id !== id),
            }));
          }
        } catch (error) {
          console.error("Delete booking API error:", error);
        }
      },

      resetPassword: async (email, password) => {
        set({ isLoading: true });
        try {
          const res = await fetch("/api/auth/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
          const data = await res.json().catch(() => null);
          set({ isLoading: false });

          if (res.ok) {
            return { success: true };
          }
          return {
            success: false,
            message: data?.message || "Unable to reset password.",
          };
        } catch (error) {
          console.error("Reset password API error:", error);
          set({ isLoading: false });
          return {
            success: false,
            message: "Unable to reach the server. Please try again.",
          };
        }
      },

      changePassword: async (currentPassword, newPassword) => {
        const currentUser = get().user;
        if (!currentUser) {
          return { success: false, message: "You are not signed in." };
        }

        set({ isLoading: true });
        try {
          const res = await fetch("/api/auth/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: currentUser.email,
              currentPassword,
              newPassword,
            }),
          });
          const data = await res.json().catch(() => null);
          set({ isLoading: false });

          if (res.ok) {
            return { success: true };
          }
          return {
            success: false,
            message: data?.message || "Unable to change password.",
          };
        } catch (error) {
          console.error("Change password API error:", error);
          set({ isLoading: false });
          return {
            success: false,
            message: "Unable to reach the server. Please try again.",
          };
        }
      },
    }),
    {
      name: "naaz-auth-storage",
      partialize: (state) => ({
        user: state.user,
        bookings: state.bookings,
      }),
    }
  )
);
