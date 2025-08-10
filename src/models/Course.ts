import mongoose, { Schema, models } from "mongoose";

const CourseSchema = new Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  semester: { type: String, required: true },
  credits: { type: Number, required: true },
  department: { type: String, required: true },
});

export default models.Course || mongoose.model("Course", CourseSchema); 