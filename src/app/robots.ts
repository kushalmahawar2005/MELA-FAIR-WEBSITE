import type { MetadataRoute } from "next";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://naazamusementjaipur.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/", "/profile", "/login", "/register", "/forgot-password"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
