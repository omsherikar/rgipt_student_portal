import mongoose, { Schema, models } from "mongoose";

const CourseFeedbackSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  feedback: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default models.CourseFeedback || mongoose.model("CourseFeedback", CourseFeedbackSchema); 