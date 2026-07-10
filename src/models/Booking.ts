import mongoose, { Schema } from "mongoose";

const BookingSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    date: { type: Date, required: true },
    locationId: { type: String, required: false }, // ID of the Mela/Location
    tickets: {
      type: [
        {
          rideSlug: { type: String, required: true },
          quantity: { type: Number, required: true },
          pricePaise: { type: Number, required: true },
        }
      ],
      default: []
    },
    // Legacy B2B fields (kept optional for backward compatibility)
    eventType: { type: String, required: false },
    guests: { type: Number, required: false },
    selectedRides: { type: [String], default: [] },
    distanceSlab: { 
      type: String, 
      enum: ["inside", "medium", "far"], 
      required: false 
    },
    totalPrice: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ["Pending", "Confirmed", "Scanned"], 
      default: "Pending" 
    },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    userPhone: { type: String, required: true },
    // Razorpay payment tracking
    razorpayOrderId: { type: String, default: null },
    razorpayPaymentId: { type: String, default: null },
    // QR code as base64 data URL
    qrCode: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
