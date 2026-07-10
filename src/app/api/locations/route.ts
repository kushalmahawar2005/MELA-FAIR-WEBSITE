import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Location from "@/models/Location";

export async function GET() {
  try {
    await connectToDatabase();
    // Sort by startDate descending
    const locations = await Location.find().sort({ startDate: -1 }).lean();
    
    return NextResponse.json(locations);
  } catch (error) {
    console.error("Locations GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch locations" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectToDatabase();

    // Ensure ID is provided or generate one
    const id = body.id || `loc_${Date.now()}`;
    const newLocation = new Location({ ...body, id });
    
    await newLocation.save();
    
    return NextResponse.json(newLocation, { status: 201 });
  } catch (error: any) {
    console.error("Locations POST error:", error);
    return NextResponse.json(
      { error: "Failed to create location", details: error.message },
      { status: 500 }
    );
  }
}
