import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { connectToDatabase } from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";

function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
}

async function sendOwnerNotification(inquiry: {
  name: string;
  phone: string;
  email: string;
  eventCity: string;
  eventDate: string;
  packageName: string;
  notes: string;
}) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) return;

  const transporter = createTransporter();
  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8" /></head>
    <body style="margin:0;padding:0;background:#0A0514;font-family:Arial,sans-serif;">
      <div style="max-width:560px;margin:30px auto;background:#13082a;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);">
        <div style="background:linear-gradient(135deg,#7c3aed,#4c1d95);padding:24px 28px;">
          <h1 style="color:#EEA727;font-size:20px;margin:0;letter-spacing:2px;">🎪 NEW PACKAGE INQUIRY</h1>
          <p style="color:rgba(255,255,255,0.6);margin:6px 0 0;font-size:13px;">Naaz Amusement — Admin Alert</p>
        </div>
        <div style="padding:28px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="color:rgba(255,255,255,0.4);font-size:11px;padding:8px 0 2px;text-transform:uppercase;letter-spacing:1px;">Customer Name</td></tr>
            <tr><td style="color:#fff;font-size:15px;font-weight:bold;padding-bottom:16px;border-bottom:1px solid rgba(255,255,255,0.05);">${inquiry.name}</td></tr>
            <tr><td style="padding:10px 0 0;"></td></tr>
            <tr><td style="color:rgba(255,255,255,0.4);font-size:11px;padding:8px 0 2px;text-transform:uppercase;letter-spacing:1px;">Phone</td></tr>
            <tr><td style="color:#EEA727;font-size:15px;font-weight:bold;padding-bottom:16px;border-bottom:1px solid rgba(255,255,255,0.05);">${inquiry.phone}</td></tr>
            <tr><td style="padding:10px 0 0;"></td></tr>
            <tr><td style="color:rgba(255,255,255,0.4);font-size:11px;padding:8px 0 2px;text-transform:uppercase;letter-spacing:1px;">Email</td></tr>
            <tr><td style="color:#fff;font-size:13px;padding-bottom:16px;border-bottom:1px solid rgba(255,255,255,0.05);">${inquiry.email}</td></tr>
            <tr><td style="padding:10px 0 0;"></td></tr>
            <tr><td style="color:rgba(255,255,255,0.4);font-size:11px;padding:8px 0 2px;text-transform:uppercase;letter-spacing:1px;">Package Interested In</td></tr>
            <tr><td style="color:#a78bfa;font-size:15px;font-weight:bold;padding-bottom:16px;border-bottom:1px solid rgba(255,255,255,0.05);">${inquiry.packageName}</td></tr>
            <tr><td style="padding:10px 0 0;"></td></tr>
            <tr><td style="color:rgba(255,255,255,0.4);font-size:11px;padding:8px 0 2px;text-transform:uppercase;letter-spacing:1px;">Event City</td></tr>
            <tr><td style="color:#fff;font-size:13px;padding-bottom:16px;border-bottom:1px solid rgba(255,255,255,0.05);">${inquiry.eventCity}</td></tr>
            <tr><td style="padding:10px 0 0;"></td></tr>
            <tr><td style="color:rgba(255,255,255,0.4);font-size:11px;padding:8px 0 2px;text-transform:uppercase;letter-spacing:1px;">Event Date</td></tr>
            <tr><td style="color:#fff;font-size:13px;padding-bottom:16px;border-bottom:1px solid rgba(255,255,255,0.05);">${inquiry.eventDate}</td></tr>
            ${inquiry.notes ? `
            <tr><td style="padding:10px 0 0;"></td></tr>
            <tr><td style="color:rgba(255,255,255,0.4);font-size:11px;padding:8px 0 2px;text-transform:uppercase;letter-spacing:1px;">Additional Notes</td></tr>
            <tr><td style="color:rgba(255,255,255,0.7);font-size:13px;padding-bottom:16px;">${inquiry.notes}</td></tr>
            ` : ""}
          </table>
          <a href="https://wa.me/${inquiry.phone.replace(/\D/g, "")}" 
             style="display:inline-block;margin-top:20px;background:#25D366;color:#fff;text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:bold;font-size:13px;">
            📱 Reply on WhatsApp
          </a>
        </div>
        <div style="padding:16px 28px;border-top:1px solid rgba(255,255,255,0.05);text-align:center;">
          <p style="color:rgba(255,255,255,0.2);font-size:11px;margin:0;">Naaz Amusement · Admin Notifications</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Naaz Amusement Alerts" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `🎪 New Inquiry: ${inquiry.packageName} — ${inquiry.name} (${inquiry.phone})`,
    html,
  });
}

// ─── GET all inquiries ────────────────────────────────────────────────────────
export async function GET() {
  try {
    await connectToDatabase();
    const inquiries = await Inquiry.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(inquiries);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ─── POST new inquiry ─────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, email, eventCity, eventDate, packageId, packageName, notes } = body;

    if (!name || !phone || !email || !eventCity || !eventDate || !packageId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectToDatabase();

    const id = `inq_${Date.now()}`;
    const inquiry = await Inquiry.create({
      id,
      name,
      phone,
      email,
      eventCity,
      eventDate,
      packageId,
      packageName,
      notes: notes || "",
      status: "New",
    });

    // Send email notification to owner (non-blocking)
    sendOwnerNotification({ name, phone, email, eventCity, eventDate, packageName, notes: notes || "" })
      .catch((e) => console.error("Owner email failed:", e));

    return NextResponse.json({ success: true, id: inquiry.id }, { status: 201 });
  } catch (error: any) {
    console.error("Inquiry POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
