import mongoose, { Schema, models } from "mongoose";

const AttachmentSchema = new Schema({
  name: String,
  url: String,
}, { _id: false });

const NoticeSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, required: true }, // e.g., circular, exam, event
  createdAt: { type: Date, default: Date.now },
  attachments: [AttachmentSchema],
});

export default models.Notice || mongoose.model("Notice", NoticeSchema); 