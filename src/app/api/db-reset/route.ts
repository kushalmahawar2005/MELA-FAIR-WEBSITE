import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Ride from "@/models/Ride";
import { rides as defaultRides } from "@/lib/rides";

export async function POST() {
  try {
    await connectToDatabase();
    
    // Clear existing rides
    await Ride.deleteMany({});
    
    // Seed default rides
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
    
    const ridesList = await Ride.find().sort({ createdAt: -1 });
    return NextResponse.json({
      message: "Database rides reset to default settings successfully",
      rides: ridesList
    });
  } catch (error: any) {
    console.error("Database reset error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
