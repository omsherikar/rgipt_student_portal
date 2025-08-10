import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get("admin-auth")?.value === "true";
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await dbConnect();
  const students = await User.find({}).lean();
  return NextResponse.json({ students });
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await dbConnect();
  const { name, email, rollNumber, department } = await req.json();
  if (!name || !email || !rollNumber || !department) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  // Check if student already exists
  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json({ error: "Student with this email already exists" }, { status: 409 });
  }
  const student = await User.create({
    name,
    email,
    rollNumber,
    department,
    role: "student",
  });
  return NextResponse.json({ student });
}

export async function PUT(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await dbConnect();
  const { _id, name, email, rollNumber, department } = await req.json();
  if (!_id || !name || !email || !rollNumber || !department) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  const student = await User.findByIdAndUpdate(_id, { name, email, rollNumber, department }, { new: true });
  if (!student) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }
  return NextResponse.json({ student });
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await dbConnect();
  const { _id } = await req.json();
  if (!_id) {
    return NextResponse.json({ error: "Missing student ID" }, { status: 400 });
  }
  const student = await User.findByIdAndDelete(_id);
  if (!student) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }
  return NextResponse.json({ student });
} 