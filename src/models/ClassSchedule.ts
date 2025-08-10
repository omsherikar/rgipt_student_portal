import mongoose, { Schema, models } from "mongoose";

const ClassScheduleSchema = new Schema({
  department: { type: String, required: true },
  semester: { type: String, required: true },
  dayOfWeek: { type: Number, required: true }, // 0=Sunday, 6=Saturday
  startTime: { type: String, required: true }, // e.g., "09:00"
  endTime: { type: String, required: true },   // e.g., "10:00"
  courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  location: { type: String },
});

export default models.ClassSchedule || mongoose.model("ClassSchedule", ClassScheduleSchema); 