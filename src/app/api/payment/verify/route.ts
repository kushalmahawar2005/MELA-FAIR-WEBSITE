import { NextResponse } from "next/server";
import crypto from "crypto";
import QRCode from "qrcode";
import nodemailer from "nodemailer";
import { connectToDatabase } from "@/lib/mongodb";
import Booking from "@/models/Booking";

// ─── Email Transporter ──────────────────────────────────────────────────────
function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
}

// ─── Send Confirmation Email ─────────────────────────────────────────────────
async function sendConfirmationEmail(booking: {
  id: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  locationId?: string;
  locationName?: string;
  date: string;
  totalPrice: number;
  tickets: { rideSlug: string; quantity: number; pricePaise: number; rideName?: string }[];
  qrCode: string;
}
) {
  // Skip if email credentials not configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    console.warn("Email credentials not configured. Skipping email.");
    return;
  }

  const transporter = createTransporter();
  const dateFormatted = new Date(booking.date).toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>Booking Confirmed</title>
      <style>
        body { font-family: Arial, sans-serif; background: #0A0514; color: #ffffff; margin: 0; padding: 0; }
        .container { max-width: 580px; margin: 0 auto; padding: 40px 20px; }
        .header { text-align: center; padding: 30px 0; }
        .logo { font-size: 22px; font-weight: bold; letter-spacing: 4px; color: #EEA727; }
        .badge { display: inline-block; background: #22c55e20; color: #22c55e; border: 1px solid #22c55e40; border-radius: 20px; padding: 6px 18px; font-size: 13px; margin-top: 10px; }
        .card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.10); border-radius: 16px; padding: 28px; margin: 20px 0; }
        .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 14px; }
        .row:last-child { border-bottom: none; }
        .label { color: rgba(255,255,255,0.5); }
        .value { color: #ffffff; font-weight: 600; text-align: right; }
        .total { font-size: 22px; color: #EEA727; font-weight: bold; }
        .qr-section { text-align: center; padding: 24px 0; }
        .qr-section img { border: 4px solid rgba(238,167,39,0.3); border-radius: 12px; padding: 12px; background: #ffffff; }
        .qr-label { color: rgba(255,255,255,0.5); font-size: 12px; margin-top: 10px; letter-spacing: 2px; text-transform: uppercase; }
        .booking-id { font-family: monospace; font-size: 15px; color: #EEA727; letter-spacing: 2px; }
        .footer { text-align: center; color: rgba(255,255,255,0.3); font-size: 11px; margin-top: 30px; }
        .whatsapp-btn { display: inline-block; background: #25D366; color: white; text-decoration: none; border-radius: 8px; padding: 12px 24px; font-size: 14px; font-weight: bold; margin-top: 16px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🎢 NAAZ AMUSEMENT</div>
          <p style="color:rgba(255,255,255,0.5); font-size:13px; margin:6px 0 0;">Jaipur's Premier Amusement & Event Setup</p>
          <span class="badge">✅ Booking Confirmed!</span>
        </div>

        <div class="card">
          <div class="row">
            <span class="label">Booking ID</span>
            <span class="value booking-id">${booking.id}</span>
          </div>
          <div class="row">
            <span class="label">Customer</span>
            <span class="value">${booking.userName}</span>
          </div>
          <div class="row">
            <span class="label">Contact</span>
            <span class="value">${booking.userPhone}</span>
          </div>
          <div class="row">
            <span class="label">Location</span>
            <span class="value">${booking.locationName || "Naaz Amusement Mela"}</span>
          </div>
          <div class="row">
            <span class="label">Tickets</span>
            <span class="value">
              ${booking.tickets.map(t => `${t.quantity}x ${t.rideName || t.rideSlug}`).join('<br/>')}
            </span>
          </div>
          <div class="row" style="padding-top:16px;">

            <span class="label" style="font-size:15px;">Total Paid</span>
            <span class="value total">₹${booking.totalPrice.toLocaleString("en-IN")}</span>
          </div>
        </div>

        <div class="card qr-section">
          <p style="color:rgba(255,255,255,0.6); font-size:13px; margin:0 0 16px;">Show this QR code at the venue for entry verification:</p>
          <img src="${booking.qrCode}" alt="Booking QR Code" width="180" height="180" />
          <div class="qr-label">Scan to verify • Booking ID: ${booking.id}</div>
        </div>

        <div style="text-align:center; padding: 10px 0;">
          <p style="color:rgba(255,255,255,0.5); font-size:13px;">For any queries, contact us on WhatsApp</p>
          <a href="https://wa.me/917737221911?text=Booking%20ID%3A%20${booking.id}%20-%20I%20need%20help" class="whatsapp-btn">💬 WhatsApp Support</a>
        </div>

        <div class="footer">
          <p>Naaz Amusement • Jaipur, Rajasthan</p>
          <p>naazamusementjaipur.com</p>
          <p style="margin-top:10px; font-size:10px; color:rgba(255,255,255,0.2);">This is an automated confirmation. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Naaz Amusement" <${process.env.EMAIL_USER}>`,
    to: booking.userEmail,
    subject: `✅ Booking Confirmed — ${booking.id} | Naaz Amusement`,
    html,
  });
}

// ─── Main Verify Handler ─────────────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingData,
    } = body;

    // 1. Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { message: "Missing payment verification fields" },
        { status: 400 }
      );
    }

    // 2. HMAC-SHA256 Signature Verification
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.error("Signature mismatch — potential tampered request");
      return NextResponse.json(
        { message: "Invalid payment signature. Verification failed." },
        { status: 400 }
      );
    }

    // 3. Connect to MongoDB
    await connectToDatabase();

    // 4. Generate unique booking ID
    const bookingId = `NZ-${Date.now().toString(36).toUpperCase()}-${Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase()}`;

    // 5. Generate QR Code (encodes bookingId as data URL)
    const qrDataUrl = await QRCode.toDataURL(bookingId, {
      errorCorrectionLevel: "H",
      width: 300,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    // 6. Save confirmed booking to MongoDB
    const newBooking = await Booking.create({
      id: bookingId,
      date: bookingData.date,
      locationId: bookingData.locationId,
      tickets: bookingData.tickets,
      totalPrice: bookingData.totalPrice,
      userName: bookingData.userName,
      userEmail: bookingData.userEmail,
      userPhone: bookingData.userPhone,
      status: "Confirmed",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      qrCode: qrDataUrl,
    });


    // 7. Send confirmation email (non-blocking — errors won't fail the response)
    try {
      await sendConfirmationEmail({
        id: bookingId,
        userName: bookingData.userName,
        userEmail: bookingData.userEmail,
        userPhone: bookingData.userPhone,
        date: bookingData.date,
        totalPrice: bookingData.totalPrice,
        locationId: bookingData.locationId,
        locationName: bookingData.locationName,
        tickets: bookingData.tickets,
        qrCode: qrDataUrl,
      });

    } catch (emailErr) {
      console.error("Email send failed (non-critical):", emailErr);
    }

    return NextResponse.json({
      success: true,
      bookingId,
      qrCode: qrDataUrl,
      booking: newBooking,
    });
  } catch (error: unknown) {
    console.error("Payment verification error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Verification failed";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
