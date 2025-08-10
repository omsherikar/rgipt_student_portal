import mongoose, { Schema, models } from "mongoose";

const GeneralFeedbackSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["complaint", "suggestion"], required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default models.GeneralFeedback || mongoose.model("GeneralFeedback", GeneralFeedbackSchema); 