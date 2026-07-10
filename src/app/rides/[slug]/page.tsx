import { Metadata } from "next";
import { rideBySlug, rides } from "@/lib/rides";
import RideDetailClient from "./ride-detail-client";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return rides.map((ride) => ({
    slug: ride.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ride = rideBySlug(slug);

  if (!ride) {
    return {
      title: "Attraction Not Found",
    };
  }

  return {
    title: `${ride.name} | Attractions`,
    description: ride.description.slice(0, 160),
    openGraph: {
      title: `${ride.name} | Naaz Amusement`,
      description: ride.tagline,
      images: [{ url: ride.image }],
    },
  };
}

export default async function RidePage({ params }: Props) {
  const { slug } = await params;
  return <RideDetailClient slug={slug} />;
}
