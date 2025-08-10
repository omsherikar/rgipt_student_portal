import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import Attendance from "@/models/Attendance";
import Course from "@/models/Course";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await dbConnect();

  // Find the user first
  const user = await User.findOne({ email: userEmail });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Find attendance records for this user, populated with course info
  const records = await Attendance.find({ userId: user._id })
    .populate({ path: "courseId", model: Course })
    .lean();

  return NextResponse.json({ attendance: records });
} 