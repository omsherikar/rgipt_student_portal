import mongoose, { Schema, models } from "mongoose";

const DocumentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, required: true }, // e.g., Bonafide, ID Card, Fee Receipt
  url: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

export default models.Document || mongoose.model("Document", DocumentSchema); 