import { NextResponse } from "next/server";
import Razorpay from "razorpay";

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency = "INR", bookingRef } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { message: "Valid amount is required" },
        { status: 400 }
      );
    }

    // Razorpay amount is in paise (multiply rupees by 100)
    const amountInPaise = Math.round(amount * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency,
      receipt: bookingRef || `rcpt_${Date.now()}`,
      notes: {
        source: "Naaz Amusement Booking",
        bookingRef: bookingRef || "",
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error: unknown) {
    console.error("Razorpay order creation error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create payment order";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
