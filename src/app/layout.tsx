import type { Metadata, Viewport } from "next";
import { Staatliches, Host_Grotesk, Geist, IBM_Plex_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WhatsAppFloat } from "@/components/shared/whatsapp-float";
import { MobileFab } from "@/components/shared/mobile-fab";
import "./globals.css";

const staatliches = Staatliches({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const hostGrotesk = Host_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://naazamusementjaipur.com"),
  title: {
    default: "Naaz Amusement — Rajasthan's Premier Amusement Park",
    template: "%s · Naaz Amusement Jaipur",
  },
  description:
    "Naaz Amusement is Rajasthan's premier themed entertainment destination. A world-class amusement park spread across 18 acres of adrenaline, laughter, and wonder.",
  keywords: [
    "Naaz Amusement",
    "amusement park",
    "Jaipur",
    "Rajasthan",
    "theme park",
    "rides",
    "attractions",
    "water park",
    "family entertainment",
  ],
  openGraph: {
    type: "website",
    siteName: "Naaz Amusement Jaipur",
    title: "Naaz Amusement — Rajasthan's Premier Amusement Park",
    description:
      "80+ rides & attractions across 18 acres. Amusement Park, Water Park & more.",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Naaz Amusement Jaipur",
    description:
      "Rajasthan's premier themed entertainment destination. 80+ rides, 18 acres of pure fun.",
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#210C6D" },
    { media: "(prefers-color-scheme: dark)", color: "#210C6D" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${staatliches.variable} ${hostGrotesk.variable} ${geist.variable} ${ibmPlexMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-deep-purple text-white pb-24 sm:pb-0">
        <TooltipProvider delay={150}>
          {children}
          <WhatsAppFloat />
          <MobileFab />
          <Toaster
            position="top-center"
            richColors
            closeButton
            toastOptions={{
              style: { fontFamily: "var(--font-body)" },
            }}
          />
        </TooltipProvider>
      </body>
    </html>
  );
}
