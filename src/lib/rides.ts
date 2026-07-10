export type Thrill = "Family" | "Medium" | "Wild" | "Extreme";

export type Ride = {
  slug: string;
  name: string;
  nameHi: string;
  thrill: Thrill;
  minAge: number;
  capacity: number;
  pricePaise: number;
  duration: string;
  tagline: string;
  description: string;
  image: string;
  tint: string;
};

export const rides: Ride[] = [
  {
    slug: "striker",
    name: "Striker",
    nameHi: "स्ट्राइकर",
    thrill: "Extreme",
    minAge: 12,
    capacity: 24,
    pricePaise: 80000,
    duration: "4 min",
    tagline: "Where gravity is just a suggestion.",
    description:
      "Naaz Amusement's signature thrill ride — a towering experience that sends you spinning, twisting, and screaming through the Jaipur sky.",
    image: "/generic-bouncy.png",
    tint: "#210C6D",
  },
  {
    slug: "sky-scrambler",
    name: "Sky Scrambler",
    nameHi: "स्काई स्क्रैम्बलर",
    thrill: "Extreme",
    minAge: 14,
    capacity: 16,
    pricePaise: 80000,
    duration: "5 min",
    tagline: "Scramble your senses at 100 feet.",
    description:
      "A towering ride that spins you in multiple axes at once. Not for the faint-hearted — but absolutely unforgettable.",
    image: "/11.jpeg",
    tint: "#EEA727",
  },
  {
    slug: "wave-pool",
    name: "Wave Pool",
    nameHi: "वेव पूल",
    thrill: "Family",
    minAge: 4,
    capacity: 200,
    pricePaise: 50000,
    duration: "30 min",
    tagline: "A tropical escape without the airfare.",
    description:
      "Beat the Jaipur heat with our massive wave pool. Gentle waves for families, bigger ones for thrill-seekers.",
    image: "/3.jpg",
    tint: "#172F2E",
  },
  {
    slug: "roller-coaster",
    name: "Roller Coaster",
    nameHi: "रोलर कोस्टर",
    thrill: "Wild",
    minAge: 10,
    capacity: 24,
    pricePaise: 60000,
    duration: "4 min",
    tagline: "Loops, drops, and pure adrenaline.",
    description:
      "Naaz Amusement's signature coaster with multiple loops, sudden drops, and speeds that will leave you breathless.",
    image: "/4.jpeg",
    tint: "#8F0177",
  },
  {
    slug: "bumper-cars",
    name: "Bumper Cars",
    nameHi: "बम्पर कार",
    thrill: "Family",
    minAge: 6,
    capacity: 20,
    pricePaise: 30000,
    duration: "5 min",
    tagline: "Bump, dodge, repeat.",
    description:
      "Electric bumper cars on a polished floor. The only ride where crashing into your friends is encouraged.",
    image: "/5.jpg",
    tint: "#210C6D",
  },
  {
    slug: "zip-line",
    name: "Zip Line",
    nameHi: "ज़िप लाइन",
    thrill: "Wild",
    minAge: 8,
    capacity: 4,
    pricePaise: 40000,
    duration: "2 min",
    tagline: "Fly across the fairground.",
    description:
      "Soar across the park on our 200-meter zip line. Feel the wind as the entire park spreads out beneath you.",
    image: "/6.jpg",
    tint: "#EEA727",
  },
  {
    slug: "lazy-river",
    name: "Lazy River",
    nameHi: "लेज़ी रिवर",
    thrill: "Family",
    minAge: 2,
    capacity: 100,
    pricePaise: 30000,
    duration: "20 min",
    tagline: "Float, relax, repeat.",
    description:
      "A gentle, winding river ride through tropical landscapes. Grab a tube and let the current do the rest.",
    image: "/14.jpeg",
    tint: "#172F2E",
  },
  {
    slug: "sky-cycling",
    name: "Sky Cycling",
    nameHi: "स्काई साइकिलिंग",
    thrill: "Medium",
    minAge: 8,
    capacity: 8,
    pricePaise: 35000,
    duration: "10 min",
    tagline: "Pedal through the sky.",
    description:
      "Cycle on a track suspended 30 feet in the air. An adventure activity that tests your courage and balance.",
    image: "/2.jpg",
    tint: "#8F0177",
  },
];

export const formatPrice = (paise: number) => `₹ ${(paise / 100).toFixed(0)}`;

export const rideBySlug = (slug: string) =>
  rides.find((r) => r.slug === slug);
