import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Location from "@/models/Location";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    await connectToDatabase();
    
    // Update based on custom id field
    const updatedLocation = await Location.findOneAndUpdate(
      { id },
      { $set: body },
      { new: true, runValidators: true }
    );

    
    if (!updatedLocation) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 });
    }
    
    return NextResponse.json(updatedLocation);
  } catch (error: any) {
    console.error(`Location PUT error:`, error);
    return NextResponse.json(
      { error: "Failed to update location", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const deletedLocation = await Location.findOneAndDelete({ id });

    
    if (!deletedLocation) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(`Location DELETE error:`, error);
    return NextResponse.json(
      { error: "Failed to delete location", details: error.message },
      { status: 500 }
    );
  }
}
