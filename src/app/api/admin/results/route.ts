import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/mongoose";
import Result from "@/models/Result";

async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get("admin-auth")?.value === "true";
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await dbConnect();
  const results = await Result.find({}).lean();
  return NextResponse.json({ results });
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await dbConnect();
  const { userId, semester, cpi, pdfUrl } = await req.json();
  if (!userId || !semester || cpi === undefined) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  const result = await Result.create({ userId, semester, cpi, pdfUrl });
  return NextResponse.json({ result });
}

export async function PUT(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await dbConnect();
  const { _id, userId, semester, cpi, pdfUrl } = await req.json();
  if (!_id || !userId || !semester || cpi === undefined) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  const result = await Result.findByIdAndUpdate(_id, { userId, semester, cpi, pdfUrl }, { new: true });
  if (!result) {
    return NextResponse.json({ error: "Result not found" }, { status: 404 });
  }
  return NextResponse.json({ result });
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await dbConnect();
  const { _id } = await req.json();
  if (!_id) {
    return NextResponse.json({ error: "Missing result ID" }, { status: 400 });
  }
  const result = await Result.findByIdAndDelete(_id);
  if (!result) {
    return NextResponse.json({ error: "Result not found" }, { status: 404 });
  }
  return NextResponse.json({ result });
} 