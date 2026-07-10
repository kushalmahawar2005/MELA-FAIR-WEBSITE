import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Ride from "@/models/Ride";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDatabase();
    const { slug } = await params;
    const updateData = await request.json();

    const updatedRide = await Ride.findOneAndUpdate(
      { slug: slug.toLowerCase() },
      { $set: updateData },
      { new: true }
    );

    if (!updatedRide) {
      return NextResponse.json(
        { message: "Ride not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedRide);
  } catch (error: any) {
    console.error("Update ride error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDatabase();
    const { slug } = await params;

    const deletedRide = await Ride.findOneAndDelete({ slug: slug.toLowerCase() });

    if (!deletedRide) {
      return NextResponse.json(
        { message: "Ride not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Ride deleted successfully" });
  } catch (error: any) {
    console.error("Delete ride error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
