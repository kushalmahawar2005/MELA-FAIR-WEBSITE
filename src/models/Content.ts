import mongoose, { Schema } from "mongoose";

const ContentSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    data: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Content || mongoose.model("Content", ContentSchema);
