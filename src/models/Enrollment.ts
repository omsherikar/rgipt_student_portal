import mongoose, { Schema, models } from "mongoose";

const EnrollmentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  semester: { type: String, required: true },
  grade: { type: String },
});

export default models.Enrollment || mongoose.model("Enrollment", EnrollmentSchema); 