import mongoose, { Schema, models } from "mongoose";

const ResultSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  semester: { type: String, required: true },
  spi: { type: Number, required: true },
  cpi: { type: Number, required: true },
  pdfUrl: { type: String },
});

export default models.Result || mongoose.model("Result", ResultSchema); 