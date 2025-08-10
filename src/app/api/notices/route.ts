import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Notice from "@/models/Notice";

export async function GET(req: NextRequest) {
  await dbConnect();
  const notices = await Notice.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ notices });
}

export async function POST(req: NextRequest) {
  // TODO: Restrict to admin/faculty in the future
  await dbConnect();
  const { title, content, type, attachments } = await req.json();
  if (!title || !content || !type) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  const notice = await Notice.create({ title, content, type, attachments });
  return NextResponse.json({ notice }, { status: 201 });
} 