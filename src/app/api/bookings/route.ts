import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { verifyAdminToken, decodeUserEmail } from "@/lib/auth-token";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const adminToken = request.cookies.get("naaz-admin")?.value;
    const isAdmin = await verifyAdminToken(adminToken);

    if (isAdmin) {
      const bookingsList = await Booking.find().sort({ createdAt: -1 });
      return NextResponse.json(bookingsList);
    }

    const userToken = request.cookies.get("naaz-user")?.value;
    const userEmail = decodeUserEmail(userToken);
    
    if (userEmail) {
      const bookingsList = await Booking.find({ userEmail }).sort({ createdAt: -1 });
      return NextResponse.json(bookingsList);
    }

    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  } catch (error: any) {
    console.error("Fetch bookings error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const bookingDetails = await request.json();

    if (!bookingDetails.userName || !bookingDetails.userPhone || !bookingDetails.userEmail) {
      return NextResponse.json(
        { message: "Customer name, phone and email are required" },
        { status: 400 }
      );
    }

    const generatedId = `BK_${Math.random().toString(36).substring(2, 11).toUpperCase()}`;

    const newBooking = await Booking.create({
      ...bookingDetails,
      id: generatedId,
      status: bookingDetails.status || "Pending",
    });

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error: any) {
    console.error("Create booking error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
