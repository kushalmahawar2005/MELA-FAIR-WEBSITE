import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Ride from "@/models/Ride";
import { rides as defaultRides } from "@/lib/rides";

export async function GET() {
  try {
    await connectToDatabase();
    let ridesList = await Ride.find().sort({ createdAt: -1 });

    // If database is empty, seed it with defaults
    if (ridesList.length === 0) {
      // Use clean mapping to avoid inserting mongoose schema metadata or duplicate keys
      const cleanRides = defaultRides.map(r => ({
        slug: r.slug,
        name: r.name,
        nameHi: r.nameHi,
        thrill: r.thrill,
        minAge: r.minAge,
        capacity: r.capacity,
        pricePaise: r.pricePaise,
        duration: r.duration,
        tagline: r.tagline,
        description: r.description,
        image: r.image,
        tint: r.tint
      }));
      await Ride.insertMany(cleanRides);
      ridesList = await Ride.find().sort({ createdAt: -1 });
    }

    return NextResponse.json(ridesList);
  } catch (error: any) {
    console.error("Fetch rides error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const rideData = await request.json();

    if (!rideData.name || !rideData.slug) {
      return NextResponse.json(
        { message: "Name and Slug are required" },
        { status: 400 }
      );
    }

    const existingRide = await Ride.findOne({ slug: rideData.slug.toLowerCase() });
    if (existingRide) {
      return NextResponse.json(
        { message: "Ride with this slug already exists" },
        { status: 409 }
      );
    }

    const newRide = await Ride.create({
      ...rideData,
      slug: rideData.slug.toLowerCase(),
    });

    return NextResponse.json(newRide, { status: 201 });
  } catch (error: any) {
    console.error("Create ride error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
