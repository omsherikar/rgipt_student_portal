import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await dbConnect();
  const user = await User.findOne({ email: userEmail }).lean();
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  // @ts-ignore
  const { name, email, image, department, semester, rollNumber, dob, gender, phone, address, program, admissionYear, bloodGroup, emergencyContact, guardianName } = user;
  return NextResponse.json({ name, email, image, department, semester, rollNumber, dob, gender, phone, address, program, admissionYear, bloodGroup, emergencyContact, guardianName });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await dbConnect();
  const body = await req.json();
  const update: any = {};
  if (body.name !== undefined) update.name = body.name;
  if (body.department !== undefined) update.department = body.department;
  if (body.semester !== undefined) update.semester = body.semester;
  if (body.image !== undefined) update.image = body.image;
  if (body.rollNumber !== undefined) update.rollNumber = body.rollNumber;
  if (body.dob !== undefined) update.dob = body.dob;
  if (body.gender !== undefined) update.gender = body.gender;
  if (body.phone !== undefined) update.phone = body.phone;
  if (body.address !== undefined) update.address = body.address;
  if (body.program !== undefined) update.program = body.program;
  if (body.admissionYear !== undefined) update.admissionYear = body.admissionYear;
  if (body.bloodGroup !== undefined) update.bloodGroup = body.bloodGroup;
  if (body.emergencyContact !== undefined) update.emergencyContact = body.emergencyContact;
  if (body.guardianName !== undefined) update.guardianName = body.guardianName;
  const user = await User.findOneAndUpdate({ email: userEmail }, update, { new: true, lean: true }) as Record<string, any>;
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const { name, email, image, department, semester, rollNumber, dob, gender, phone, address, program, admissionYear, bloodGroup, emergencyContact, guardianName } = user;
  return NextResponse.json({ name, email, image, department, semester, rollNumber, dob, gender, phone, address, program, admissionYear, bloodGroup, emergencyContact, guardianName });
} 