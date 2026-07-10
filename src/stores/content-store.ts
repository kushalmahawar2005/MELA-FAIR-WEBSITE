import { create } from "zustand";
import { defaultHomeContent, HomeContent } from "@/lib/content";

interface ContentState {
  content: HomeContent;
  isLoading: boolean;
  hasLoaded: boolean;
  fetchContent: (force?: boolean) => Promise<void>;
  updateContent: (data: HomeContent) => Promise<void>;
  updateSection: <K extends keyof HomeContent>(
    section: K,
    value: HomeContent[K]
  ) => Promise<void>;
}

export const useContentStore = create<ContentState>((set, get) => ({
  content: defaultHomeContent,
  isLoading: false,
  hasLoaded: false,

  fetchContent: async (force = false) => {
    const { hasLoaded } = get();
    if (hasLoaded && !force) return;

    set({ isLoading: true });
    try {
      const res = await fetch("/api/content");
      if (res.ok) {
        const data = (await res.json()) as HomeContent;
        set({ content: data, hasLoaded: true, isLoading: false });
        return;
      }
    } catch (error) {
      console.error("Failed to fetch content:", error);
    }
    set({ isLoading: false, hasLoaded: true });
  },

  updateContent: async (data) => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });
      if (res.ok) {
        const updated = (await res.json()) as HomeContent;
        set({ content: updated, isLoading: false });
        return;
      }
    } catch (error) {
      console.error("Failed to update content:", error);
    }
    set({ isLoading: false });
  },

  updateSection: async (section, value) => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, value }),
      });
      if (res.ok) {
        const updated = (await res.json()) as HomeContent;
        set({ content: updated, isLoading: false });
        return;
      }
    } catch (error) {
      console.error("Failed to update content section:", error);
    }
    set({ isLoading: false });
  },
}));
