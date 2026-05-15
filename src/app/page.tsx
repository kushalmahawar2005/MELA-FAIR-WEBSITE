import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { Hero } from "@/components/sections/hero";
import { Rides } from "@/components/sections/rides";
import { Gallery } from "@/components/sections/gallery";
import { Tour } from "@/components/sections/tour";
import { Testimonials } from "@/components/sections/testimonials";
import { CtaStrip } from "@/components/sections/cta-strip";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-cream">
      <Header />
      <main className="flex-1">
        <Hero />
        <Rides />
        <Tour />
        <Gallery />
        <Testimonials />
        <CtaStrip />
      </main>
      <Footer />
    </div>
  );
}
