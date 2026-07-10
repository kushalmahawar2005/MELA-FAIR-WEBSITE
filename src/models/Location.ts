import mongoose, { Schema } from "mongoose";

const RidePricingSchema = new Schema({
  rideSlug: { type: String, required: true },
  pricePaise: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
});

const LocationSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    lat: { type: Number, default: 26.2 },
    lng: { type: Number, default: 74.8 },
    gmapsLink: { type: String, default: "" },
    details: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    ridePricing: { type: [RidePricingSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.Location || mongoose.model("Location", LocationSchema);
