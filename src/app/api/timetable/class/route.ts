import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import ClassSchedule from "@/models/ClassSchedule";
import Enrollment from "@/models/Enrollment";
import Course from "@/models/Course";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await dbConnect();

  // Find the user's department and semester
  const user: any = await User.findOne({ email: userEmail }).lean();
  if (!user || !user.department || !user.semester) {
    return NextResponse.json({ error: "User profile incomplete" }, { status: 400 });
  }

  // Find class schedule for the user's department and semester
  const schedule = await ClassSchedule.find({
    department: user.department,
    semester: user.semester,
  })
    .populate({ path: "courseId", model: Course })
    .lean();

  return NextResponse.json({ schedule });
} 