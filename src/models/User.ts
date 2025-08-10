import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  image: String,
  department: String,
  semester: String,
  rollNumber: String,
  dob: String,
  gender: String,
  phone: String,
  address: String,
  program: String,
  admissionYear: String,
  bloodGroup: String,
  emergencyContact: String,
  guardianName: String,
});

export default models.User || mongoose.model("User", UserSchema); 