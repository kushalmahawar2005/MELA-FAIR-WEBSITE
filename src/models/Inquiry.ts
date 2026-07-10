import mongoose from "mongoose";

const InquirySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    eventCity: { type: String, required: true },
    eventDate: { type: String, required: true },
    packageId: { type: String, required: true },
    packageName: { type: String, required: true },
    notes: { type: String, default: "" },
    status: {
      type: String,
      enum: ["New", "Contacted", "Closed"],
      default: "New",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Inquiry ||
  mongoose.model("Inquiry", InquirySchema);
