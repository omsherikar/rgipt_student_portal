import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/mongoose";
import Course from "@/models/Course";

async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get("admin-auth")?.value === "true";
}

export async function GET(req: NextRequest) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const department = searchParams.get("department");
    const semester = searchParams.get("semester");
    const filter: Record<string, any> = {};
    if (department) filter["department"] = department;
    if (semester) filter["semester"] = semester;
    const courses = await Course.find(filter).lean();
    return NextResponse.json({ courses });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await dbConnect();
    const { code, name, semester, credits, department } = await req.json();
    if (!code || !name || !semester || credits === undefined || !department) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    // Check if course already exists
    const existing = await Course.findOne({ code });
    if (existing) {
      return NextResponse.json({ error: "Course with this code already exists" }, { status: 409 });
    }
    const course = await Course.create({ code, name, semester, credits, department });
    return NextResponse.json({ course });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await dbConnect();
    const { _id, code, name, semester, credits, department } = await req.json();
    if (!_id || !code || !name || !semester || credits === undefined || !department) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const course = await Course.findByIdAndUpdate(_id, { code, name, semester, credits, department }, { new: true });
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    return NextResponse.json({ course });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await dbConnect();
    const { _id } = await req.json();
    if (!_id) {
      return NextResponse.json({ error: "Missing course ID" }, { status: 400 });
    }
    const course = await Course.findByIdAndDelete(_id);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    return NextResponse.json({ course });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 