import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Booking from "@/models/Booking";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const { status } = await request.json();

    if (!status || !["Pending", "Confirmed"].includes(status)) {
      return NextResponse.json(
        { message: "Valid status (Pending or Confirmed) is required" },
        { status: 400 }
      );
    }

    const updatedBooking = await Booking.findOneAndUpdate(
      { id: id },
      { $set: { status } },
      { new: true }
    );

    if (!updatedBooking) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedBooking);
  } catch (error: any) {
    console.error("Update booking error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const deletedBooking = await Booking.findOneAndDelete({ id: id });

    if (!deletedBooking) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Booking deleted successfully" });
  } catch (error: any) {
    console.error("Delete booking error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
