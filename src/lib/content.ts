export type HeroStat = {
  endValue: number;
  suffix: string;
  label: string;
};

export type HeroOffer = {
  enabled: boolean;
  eyebrow: string;
  title: string;
  cta: string;
};

export type HeroContent = {
  body: string;
  description: string;
  offer: HeroOffer;
  stats: HeroStat[];
};

export type Experience = {
  num: string;
  title: string;
  tagline: string;
  image: string;
};

export type PlanStep = {
  num: string;
  title: string;
  body: string;
  image: string;
  numColor: string;
};

export type RidesSectionContent = {
  eyebrow: string;
  headingLead: string;
  headingAccent: string;
  headingTrail: string;
  subtext: string;
};

export type ActiveMela = {
  id: string;
  name: string;
  city: string;
  venue: string;
  status: "LIVE NOW" | "UPCOMING";
  dates: string;
  details: string;
  lat: number;
  lng: number;
  installedRides: string[];
  gmapsLink: string;
};

export type PresetCity = {
  name: string;
  lat: number;
  lng: number;
};

export type Review = {
  name: string;
  quote: string;
  narrative: string;
  image: string;
  rating: number;
};

export type GalleryImage = {
  src: string;
  alt: string;
};

export type GalleryRow = GalleryImage[];

export type EventPackage = {
  id: string;
  name: string;
  tagline: string;
  price: string;
  duration: string;
  iconKey: "zap" | "shield-check" | "users";
  themeColor: string;
  shadowColor: string;
  highlightText?: string;
  features: string[];
  bestFor: string;
};

export type FacilityItem = {
  label: string;
  icon: string;
};

export type FaqItem = {
  q: string;
  a: string;
};

export type HomeContent = {
  hero: HeroContent;
  portfolio: {
    eyebrow: string;
    heading: string;
    experiences: Experience[];
  };
  planVisit: {
    eyebrow: string;
    heading: string;
    steps: PlanStep[];
  };
  rides: RidesSectionContent;
  activeLocations: {
    eyebrow: string;
    heading: string;
    subtext: string;
    locations: ActiveMela[];
    presetCities: PresetCity[];
  };
  testimonials: {
    eyebrow: string;
    heading: string;
    reviews: Review[];
  };
  tour: {
    row1Text: string;
    row2Text: string;
  };
  gallery: {
    eyebrow: string;
    heading: string;
    rows: GalleryRow[];
  };
  chronicles: {
    eyebrow: string;
    heading: string;
    ctaLabel: string;
    ctaHref: string;
  };
  eventPackages: {
    eyebrow: string;
    heading: string;
    subtext: string;
    packages: EventPackage[];
  };
  ctaStrip: {
    eyebrow: string;
    heading: string;
    highlight: string;
    body: string;
    ctaLabel: string;
    ctaHref: string;
  };
  facilities: {
    eyebrow: string;
    heading: string;
    rows: FacilityItem[][];
  };
  faq: {
    eyebrow: string;
    heading: string;
    items: FaqItem[];
  };
};



export const defaultHomeContent: HomeContent = {
  hero: {
    body:
      "For four decades, Naaz Amusement has been part of the biggest celebrations across North India. From Dussehra melas in Delhi to city carnivals across Rajasthan and Uttar Pradesh, our rides have created memories for generations of families — one mela at a time.",
    description:
      "40 Years of Bringing Joy to Fairs & Festivals — North India's trusted amusement ride operator, lighting up melas and celebrations across Rajasthan, Delhi & Uttar Pradesh since 1986.",
    offer: {
      enabled: true,
      eyebrow: "Book your setup online and",
      title: "Get Flat 20% off*",
      cta: "BOOK YOUR SETUP NOW",
    },
    stats: [
      { endValue: 40, suffix: "+", label: "Years of Legacy" },
      { endValue: 20, suffix: "+", label: "Rides & Attractions" },
      { endValue: 3, suffix: "", label: "States Covered (RJ, DL, UP)" },
      { endValue: 6, suffix: "K+", label: "Google Reviews" },
    ],
  },
  portfolio: {
    eyebrow: "Signature Experiences",
    heading: "Our portfolio of thrills showcases the diversity of our madness.",
    experiences: [
      {
        num: "01",
        title: "Amusement Park",
        tagline: "Where Gravity is Just a Suggestion",
        image: "/p1.jpg",
      },
      {
        num: "02",
        title: "Corporate Activities",
        tagline:
          "Team building experiences that actually build teams. Adventure courses, challenges, and collaborative fun.",
        image: "/6.jpg",
      },
      {
        num: "03",
        title: "Birthdays & Parties",
        tagline:
          "Private party setups with themed decor, unlimited rides, and memories your child will talk about forever.",
        image: "/p1.jpg",
      },
      {
        num: "04",
        title: "Events & Concerts",
        tagline:
          "With 50+ themed backdrops, Naaz Amusement is Jaipur's most Instagrammable event destination.",
        image: "/2.jpg",
      },
    ],
  },
  planVisit: {
    eyebrow: "Plan Your Visit",
    heading: "Your fun is four steps away. That's it.",
    steps: [
      {
        num: "01",
        title: "Plan Your Visit",
        body:
          "Prepare for 8 hours of continuous enjoyment, with exhilarating ups and downs and fantastic thrills at every turn! Brace yourself to be blown away by the incredible rides that lie ahead.",
        image: "/3.jpg",
        numColor: "text-accent-yellow",
      },
      {
        num: "02",
        title: "Grab Your Discount Ticket",
        body:
          "Save more on your tickets with our exclusive discount coupons! Apply a valid coupon code at checkout to enjoy special discounts on your bookings. Hurry, offers are limited!",
        image: "/4.jpeg",
        numColor: "text-orange-500",
      },
      {
        num: "03",
        title: "Review and Book Your Tickets",
        body:
          "Secure your visit today with our seamless booking experience. Simply enter your details and proceed to checkout for instant confirmation.",
        image: "/5.jpg",
        numColor: "text-accent-yellow",
      },
      {
        num: "04",
        title: "Arrive and Create Memories",
        body:
          "Ride everything, photograph everything, eat everything. Then come back next weekend because you missed that one ride your friend won't shut up about.",
        image: "/6.jpg",
        numColor: "text-orange-500",
      },
    ],
  },
  rides: {
    eyebrow: "Our Rides & Attractions",
    headingLead: "20+ rides.",
    headingAccent: "Decades of",
    headingTrail: "memories made with Naaz.",
    subtext:
      "From thrilling high-speed rides to classic family favourites — every attraction is maintained to the highest safety standards and operated by our trained crew.",
  },
  activeLocations: {
    eyebrow: "Live Installations & Melas",
    heading: "Find Naaz Rides Near You",
    subtext:
      "We custom-build and operate high-thrill amusement setups at major trade fairs and carnivals. Select a city or browse the map to view live locations!",
    locations: [
      {
        id: "jaipur-mela",
        name: "Jaipur Summer Mela",
        city: "Jaipur",
        venue: "Dussehra Ground, Mansarovar",
        status: "LIVE NOW",
        dates: "15 May – 15 Jun 2026",
        details:
          "Rajasthan's largest summer carnival featuring signature Naaz high-thrill rides, specialized food zones, and shopping stalls.",
        lat: 26.9124,
        lng: 75.7873,
        installedRides: ["striker", "sky-scrambler", "wave-pool", "roller-coaster"],
        gmapsLink:
          "https://www.google.com/maps/search/?api=1&query=Dussehra+Ground+Mansarovar+Jaipur",
      },
      {
        id: "ajmer-urs",
        name: "Ajmer Grand Fair",
        city: "Ajmer",
        venue: "Kailash Puri Exhibition Ground",
        status: "LIVE NOW",
        dates: "18 May – 05 Jun 2026",
        details:
          "High-attendance carnival setup surrounding the heart of Ajmer with full family-ride custom setups.",
        lat: 26.4499,
        lng: 74.6399,
        installedRides: ["roller-coaster", "bumper-cars", "lazy-river"],
        gmapsLink:
          "https://www.google.com/maps/search/?api=1&query=Kailash+Puri+Ajmer",
      },
      {
        id: "kota-exhibition",
        name: "Kota Industrial Fair",
        city: "Kota",
        venue: "Dussehra Maidan",
        status: "UPCOMING",
        dates: "01 Jun – 30 Jun 2026",
        details:
          "Massive annual industrial fair featuring Naaz Amusement's giant setups and amusement ride installations.",
        lat: 25.1805,
        lng: 75.83,
        installedRides: ["striker", "wave-pool", "bumper-cars"],
        gmapsLink:
          "https://www.google.com/maps/search/?api=1&query=Dussehra+Maidan+Kota",
      },
      {
        id: "udaipur-carnival",
        name: "Udaipur Lake Carnival",
        city: "Udaipur",
        venue: "Fateh Sagar Lakefront Grounds",
        status: "LIVE NOW",
        dates: "10 May – 30 May 2026",
        details:
          "Beautiful lakeside amusement setup. Perfect evening hangout with high-thrill roller-coasters and classic rides.",
        lat: 24.5854,
        lng: 73.7125,
        installedRides: ["roller-coaster", "sky-cycling", "bumper-cars"],
        gmapsLink:
          "https://www.google.com/maps/search/?api=1&query=Fateh+Sagar+Lakefront+Udaipur",
      },
      {
        id: "jodhpur-exhibition",
        name: "Jodhpur Marwar Exhibition",
        city: "Jodhpur",
        venue: "Umaid Stadium Ground",
        status: "LIVE NOW",
        dates: "22 May – 20 Jun 2026",
        details:
          "Desert-edge summer special exhibition showcasing heavy mechanical joyrides, water features, and giant wheels.",
        lat: 26.2389,
        lng: 73.0243,
        installedRides: ["striker", "sky-scrambler", "zip-line"],
        gmapsLink:
          "https://www.google.com/maps/search/?api=1&query=Umaid+Stadium+Jodhpur",
      },
    ],
    presetCities: [
      { name: "Jaipur", lat: 26.9124, lng: 75.7873 },
      { name: "Jodhpur", lat: 26.2389, lng: 73.0243 },
      { name: "Udaipur", lat: 24.5854, lng: 73.7125 },
      { name: "Kota", lat: 25.1805, lng: 75.83 },
      { name: "Ajmer", lat: 26.4499, lng: 74.6399 },
      { name: "Bikaner", lat: 28.0194, lng: 73.3134 },
      { name: "Alwar", lat: 27.553, lng: 76.6346 },
      { name: "Sikar", lat: 27.6119, lng: 75.1399 },
    ],
  },
  testimonials: {
    eyebrow: "Testimonials",
    heading: "Real screams from real thrill-seekers.",
    reviews: [
      {
        name: "Aslam Khan",
        quote:
          "Striker is amazing, worth the money. All over best, everything is good. Enjoying a lot here!",
        narrative:
          "A first-time visitor who walked in skeptical about the ticket price and walked out calling Striker one of the best rides he's ever experienced. Beyond the rides, he was impressed by the overall quality of the park — from the food court to the ambiance to the energy of the place. The kind of guest who came for one ride and ended up spending the entire day exploring every zone.",
        image: "/p1.jpg",
        rating: 5,
      },
      {
        name: "Bhavi Jain",
        quote:
          "Had great experience in every ride. Hygienic and staff is very cooperative & friendly. Best amusement park in Jaipur!",
        narrative:
          "A family visitor who noticed the two things most amusement parks quietly fail at — hygiene and staff attitude — and was genuinely surprised that Naaz Amusement nailed both. From spotless restrooms to ride operators who greeted her kids with a smile, the experience felt thoughtfully managed rather than chaotic. She didn't just enjoy one ride; she specifically mentioned that every single ride delivered, which is rare praise for a park with 80+ attractions.",
        image: "/2.jpg",
        rating: 5,
      },
      {
        name: "Vishal Chellani",
        quote:
          "Adventure is super cool activity, it's a great FUN at Naaz Amusement. My family had the time of their lives. We're coming back next month!",
        narrative:
          "An adventure zone loyalist who came for the ziplines and rope courses but discovered that Naaz Amusement is just as much a family destination as it is a thrill-seeker's paradise. What started as a solo adrenaline trip turned into a full-family affair, with everyone from his kids to his parents finding something to love. The fact that he's already planning a return visit next month tells you everything — this isn't a one-and-done park, it's the kind of place that earns repeat loyalty.",
        image: "/3.jpg",
        rating: 5,
      },
    ],
  },
  tour: {
    row1Text: "NAAZ AMUSEMENT • LET'S RIDE • NAAZ AMUSEMENT • LET'S RIDE • ",
    row2Text:
      "LET'S PLAY • NAAZ AMUSEMENT • LET'S SCREAM • LET'S PLAY • NAAZ AMUSEMENT • LET'S SCREAM • ",
  },
  gallery: {
    eyebrow: "Gallery",
    heading: "A visual feast from Naaz Amusement.",
    rows: [
      [
        { src: "/11.jpeg", alt: "Naaz Amusement ride at night" },
        { src: "/12jpeg.jpeg", alt: "Crowd at amusement park" },
        { src: "/13.jpeg", alt: "Carnival arcade at dusk" },
        { src: "/14.jpeg", alt: "Swing ride in motion" },
        { src: "/15.jpeg", alt: "Carnival lights" },
        { src: "/17.jpeg", alt: "Children at fair" },
        { src: "/18.jpeg", alt: "Carousel detail" },
      ],
      [
        { src: "/19.jpeg", alt: "Park arch lit up" },
        { src: "/2.jpg", alt: "Park entrance" },
        { src: "/3.jpg", alt: "Families enjoying rides" },
        { src: "/4.jpeg", alt: "Night time rides" },
        { src: "/5.jpg", alt: "Arcade games" },
        { src: "/6.jpg", alt: "Water attractions" },
        { src: "/p1.jpg", alt: "Adventure zone" },
      ],
    ],
  },
  chronicles: {
    eyebrow: "Naaz Amusement Chronicles",
    heading: "Stories, tips, and behind-the-scenes chaos from Naaz Amusement.",
    ctaLabel: "View All Blog",
    ctaHref: "/blog",
  },
  eventPackages: {
    eyebrow: "All-Inclusive Solutions",
    heading: "Curated Event Packages",
    subtext:
      "Choose from our pre-configured setups tailored for different scale celebrations and festivals. Custom packages are also available on request.",
    packages: [
      {
        id: "mela-carnival",
        name: "Mega Mela & Carnival",
        tagline:
          "The ultimate amusement setup for massive public events and city festivals.",
        price: "₹ 2.5L",
        duration: "per day",
        iconKey: "zap",
        themeColor:
          "text-accent-yellow border-accent-yellow/20 hover:border-accent-yellow/50",
        shadowColor: "rgba(238, 167, 39, 0.15)",
        highlightText: "Most Popular",
        features: [
          "3 High-Thrill Rides (Striker, Sky Scrambler, Roller Coaster)",
          "2 Family Rides (Bumper Cars, Wave Pool)",
          "Full technical operator crew & safety supervisors",
          "Custom decorative lighting & entrance setup",
          "Complimentary transport within city limits (subject to location)",
        ],
        bestFor: "Public Melas, Carnivals, Corporate Family Days",
      },
      {
        id: "royal-wedding",
        name: "Royal Celebration",
        tagline:
          "Add grandeur to sangeets, weddings, and premium family gatherings.",
        price: "₹ 1.8L",
        duration: "per day",
        iconKey: "shield-check",
        themeColor: "text-pink-500 border-pink-500/20 hover:border-pink-500/50",
        shadowColor: "rgba(236, 72, 153, 0.15)",
        features: [
          "1 Extreme Thrill Ride (Sky Scrambler or Striker)",
          "2 Family Adventures (Bumper Cars & Sky Cycling)",
          "Dedicated guest relations manager",
          "LED illumination setup for nighttime sangeets",
          "Complete site licensing assistance & safety certifications",
        ],
        bestFor: "Grand Weddings, Pre-Wedding Sangeets, VIP Parties",
      },
      {
        id: "corporate-school",
        name: "Corporate & School Outing",
        tagline:
          "A modular, medium-sized setup perfect for private events and team building.",
        price: "₹ 1.2L",
        duration: "per day",
        iconKey: "users",
        themeColor:
          "text-emerald-400 border-emerald-400/20 hover:border-emerald-400/50",
        shadowColor: "rgba(52, 211, 153, 0.15)",
        features: [
          "2 Family-friendly Rides (Lazy River & Bumper Cars)",
          "1 Adventure Attraction (Zip Line or Sky Cycling)",
          "Trained safety wardens on-site",
          "Setup completion in under 24 hours",
          "Flexible booking dates",
        ],
        bestFor: "Corporate Retreats, School Trips, Community Fairs",
      },
    ],
  },
  ctaStrip: {
    eyebrow: "Ready for the Fun?",
    heading: "Your Adventure Awaits.",
    highlight: "Let's Ride.",
    body:
      "Book your ride setup today and bring the magic of North India's most trusted traveling carnival to your next mela, fair, or celebration.",
    ctaLabel: "BOOK SETUP NOW",
    ctaHref: "/book",
  },
  facilities: {
    eyebrow: "Your Comfort",
    heading: "Everything you need, right inside Naaz Amusement.",
    rows: [
      [
        { label: "Free Parking", icon: "🅿️" },
        { label: "Clean Washrooms", icon: "🚻" },
        { label: "First Aid", icon: "🏥" },
        { label: "Wheelchair Access", icon: "♿" },
        { label: "Cooling Zones", icon: "❄️" },
        { label: "Restaurants", icon: "🍴" },
        { label: "24/7 Security", icon: "🔒" },
        { label: "Free Wi-Fi", icon: "📶" },
        { label: "ATM Available", icon: "🏧" },
        { label: "Baby Care Room", icon: "👶" },
      ],
      [
        { label: "Lockers", icon: "🔐" },
        { label: "Gift Shop", icon: "🎁" },
        { label: "Photo Studio", icon: "📸" },
        { label: "Medical Room", icon: "⚕️" },
        { label: "Prayer Room", icon: "🕌" },
        { label: "Drinking Water", icon: "💧" },
        { label: "Lost & Found", icon: "📦" },
        { label: "EV Charging", icon: "⚡" },
        { label: "Info Desk", icon: "ℹ️" },
        { label: "Stroller Rental", icon: "🍼" },
      ],
    ],
  },
  faq: {
    eyebrow: "FAQ",
    heading: "Got questions? We've got answers.",
    items: [
      {
        q: "Naaz Amusement kahan-kahan lagta hai?",
        a: "Hum Rajasthan ke kai shehron, Uttar Pradesh, aur Dussehra ke samay Delhi mein alag-alag melas aur carnivals mein rides lagate hain. \"Active Locations\" section check karein current aur upcoming locations ke liye.",
      },
      {
        q: "Timings kya hain?",
        a: "Timings har mela location ke hisaab se alag ho sakti hain. Exact dates aur timings ke liye humari website ke \"Live Locations\" section ya current mela ki details check karein.",
      },
      {
        q: "Tickets online kaise book karein?",
        a: "Website ke \"Active Locations\" section se apna city/mela select karein, rides chunein, aur UPI se payment complete karein. Confirmation ke saath QR ticket mil jayega.",
      },
      {
        q: "Kya online booking pe discount milta hai?",
        a: "Haan, humari website se bulk ticket booking par special discounts available hote hain. Current offers ke liye mela page check karein.",
      },
      {
        q: "Kya rides bachon ke liye safe hain?",
        a: "Bilkul! Hamare saare rides certified aur highly trained operators dwara chalaye jaate hain. Har ride open hone se pehle daily safety checks aur trial runs hote hain.",
      },
      {
        q: "Kya event/corporate bookings hoti hain?",
        a: "Haan, hum shaadi, corporate events, pre-wedding sangeets, aur school outings ke liye custom packages offer karte hain. Hamari website par \"Event Packages\" section check karein.",
      },
      {
        q: "Refund/cancellation policy kya hai?",
        a: "Tickets generally non-refundable hote hain. Agar mela kisi technical problem ya weather ki wajah se close rehta hai, toh aap apne ticket ko same location par agle din use kar sakte hain.",
      },
    ],
  },
};
