import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import Enrollment from "@/models/Enrollment";
import Course from "@/models/Course";
import Result from "@/models/Result";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    console.log("Academics API - User email:", userEmail);
    
    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await dbConnect();

    // Find the user first
    const user = await User.findOne({ email: userEmail });
    console.log("Academics API - User found:", user ? "Yes" : "No");
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get enrollments for this user
    const enrollments = await Enrollment.find({ userId: user._id })
      .populate({ path: "courseId", model: Course })
      .lean();
    console.log("Academics API - Enrollments found:", enrollments.length);

    // Get results for this user
    const results = await Result.find({ userId: user._id }).lean();
    console.log("Academics API - Results found:", results.length);

    return NextResponse.json({
      enrollments,
      results,
    });
  } catch (error) {
    console.error("Academics API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 