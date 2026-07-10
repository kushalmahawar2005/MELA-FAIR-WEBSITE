import type { MetadataRoute } from "next";
import { rides } from "@/lib/rides";
import { blogPosts } from "@/lib/blog";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://naazamusementjaipur.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    "",
    "/about",
    "/attractions",
    "/khao-gali",
    "/ticket-info",
    "/contact",
    "/book",
    "/blog",
    "/terms",
    "/privacy",
    "/refund",
    "/safety",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const rideRoutes = rides.map((ride) => ({
    url: `${baseUrl}/rides/${ride.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const blogRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...rideRoutes, ...blogRoutes];
}
