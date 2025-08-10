import mongoose, { Schema, models } from "mongoose";

const ExamScheduleSchema = new Schema({
  department: { type: String, required: true },
  semester: { type: String, required: true },
  courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  location: { type: String },
});

export default models.ExamSchedule || mongoose.model("ExamSchedule", ExamScheduleSchema); 