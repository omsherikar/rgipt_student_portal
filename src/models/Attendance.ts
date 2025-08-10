import mongoose, { Schema, models } from "mongoose";

const AttendanceSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ["present", "absent"], required: true },
});

export default models.Attendance || mongoose.model("Attendance", AttendanceSchema); 