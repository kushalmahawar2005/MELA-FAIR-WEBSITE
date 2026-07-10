import Link from "next/link";
import { site } from "@/lib/site";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Attractions", href: "/attractions" },
  { label: "Book Tickets", href: "/book" },
  { label: "Contact Us", href: "/contact" },
];

const exploreLinks = [
  { label: "Our Rides", href: "/attractions" },
  { label: "Event Packages", href: "/#packages" },
  { label: "Live Locations", href: "/#locations" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Ticket Info", href: "/ticket-info" },
];

const importantLinks = [
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Refund Policy", href: "/refund" },
  { label: "Safety Guidelines", href: "/safety" },
];

const socialLinks = [
  { label: "Instagram", href: `https://instagram.com/${site.instagram}` },
  { label: "Facebook", href: `https://facebook.com/${site.facebook}` },
  { label: "YouTube", href: `https://youtube.com/@${site.youtube}` },
  { label: "Google Maps", href: site.mapsUrl },
];

export function Footer() {
  return (
    <footer className="relative bg-deep-purple pt-16 sm:pt-20 pb-8 sm:pb-10 text-white">
      {/* Top border */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10"
      />

      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-10 px-4 sm:grid-cols-2 sm:gap-8 sm:px-5 md:px-8 lg:grid-cols-4">
        {/* Quick Link */}
        <FooterColumn title="Quick Link">
          {quickLinks.map((l) => (
            <FooterLink key={l.label} {...l} />
          ))}
        </FooterColumn>

        {/* Explore Links */}
        <FooterColumn title="Explore">
          {exploreLinks.map((l) => (
            <FooterLink key={l.label} {...l} />
          ))}
        </FooterColumn>

        {/* Important */}
        <FooterColumn title="Important">
          {importantLinks.map((l) => (
            <FooterLink key={l.label} {...l} />
          ))}
        </FooterColumn>

        {/* Social */}
        <FooterColumn title="Social">
          {socialLinks.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="font-display text-[1rem] sm:text-[1.1rem] uppercase text-white transition hover:text-accent-yellow"
              >
                {l.label}
              </a>
            </li>
          ))}
        </FooterColumn>
      </div>

      {/* Bottom bar */}
      <div className="mx-auto mt-12 sm:mt-16 flex max-w-7xl flex-col items-center justify-between gap-3 border-t border-white/10 px-4 pt-6 text-[0.7rem] sm:text-[0.78rem] text-white/50 md:flex-row sm:px-5 md:px-8 text-center">
        <p>
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
        <p>
          {site.address}
        </p>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="font-display text-[1rem] sm:text-[1.1rem] uppercase tracking-wide text-accent-yellow">
        {title}
      </h4>
      <ul className="mt-5 space-y-3">{children}</ul>
    </div>
  );
}

function FooterLink({ label, href }: { label: string; href: string }) {
  return (
    <li>
      <Link
        href={href}
        className="font-display text-[1rem] sm:text-[1.1rem] uppercase text-white transition hover:text-accent-yellow"
      >
        {label}
      </Link>
    </li>
  );
}
