import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Booking from "@/models/Booking";

export async function POST(req: NextRequest) {
  try {
    const { bookingId } = await req.json();

    if (!bookingId) {
      return NextResponse.json(
        { success: false, message: "Booking ID is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const booking = await Booking.findOne({ id: bookingId });

    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Invalid Ticket: Booking not found." },
        { status: 404 }
      );
    }

    if (booking.status === "Pending") {
      return NextResponse.json(
        { success: false, message: "Ticket Not Valid: Payment is still pending." },
        { status: 400 }
      );
    }

    if (booking.status === "Scanned") {
      return NextResponse.json(
        { success: false, message: "Already Scanned: This ticket has already been used." },
        { status: 400 }
      );
    }

    if (booking.status === "Confirmed") {
      booking.status = "Scanned";
      await booking.save();
      
      return NextResponse.json({
        success: true,
        message: "Ticket Valid! Successfully scanned.",
        booking: {
          id: booking.id,
          userName: booking.userName,
          tickets: booking.tickets,
        }
      });
    }

    return NextResponse.json(
      { success: false, message: "Unknown ticket status." },
      { status: 400 }
    );

  } catch (error) {
    console.error("Scan verification error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error during scan verification." },
      { status: 500 }
    );
  }
}
