export const site = {
  name: "Naaz Amusement",
  tagline: "North India's trusted amusement ride operator — lighting up melas and celebrations across Rajasthan, Delhi & Uttar Pradesh since 1986.",
  description:
    "For four decades, Naaz Amusement has been part of the biggest celebrations across North India. From Dussehra melas in Delhi to city carnivals across Rajasthan and Uttar Pradesh, our rides have created memories for generations of families — one mela at a time.",
  legacyYears: 40,
  ridesCount: "20+",
  googleReviews: "6K+",
  bookingUrl: "/book",
  whatsapp: "+919026752751",
  instagram: "naazamusementjaipur",
  facebook: "naazamusementjaipur",
  youtube: "naazamusementjaipur",
  fbPixelId: process.env.NEXT_PUBLIC_FB_PIXEL_ID ?? "",
  address:
    "Rajasthan, Delhi & Uttar Pradesh — Pan North India Operations",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Naaz+Amusement+Jaipur",
  email: "info@naazamusementjaipur.com",
  phone: "+91-9026752751",
} as const;

export const waLink = (text: string) => {
  const phone = site.whatsapp.replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
};
