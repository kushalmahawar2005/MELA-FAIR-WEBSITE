import mongoose, { Schema } from "mongoose";

const RideSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    nameHi: { type: String, required: true },
    thrill: { 
      type: String, 
      enum: ["Family", "Medium", "Wild", "Extreme"], 
      default: "Medium" 
    },
    minAge: { type: Number, required: true },
    capacity: { type: Number, required: true },
    pricePaise: { type: Number, required: true },
    duration: { type: String, required: true },
    tagline: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    tint: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Ride || mongoose.model("Ride", RideSchema);
