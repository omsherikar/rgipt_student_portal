import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import GeneralFeedback from "@/models/GeneralFeedback";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await dbConnect();
  const user: any = await User.findOne({ email: userEmail }).lean();
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const feedbacks = await GeneralFeedback.find({ userId: user._id }).lean();
  return NextResponse.json({ feedbacks });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await dbConnect();
  const user: any = await User.findOne({ email: userEmail }).lean();
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const { type, message } = await req.json();
  if (!type || !message) {
    return NextResponse.json({ error: "Missing type or message" }, { status: 400 });
  }
  const fb = await GeneralFeedback.create({ userId: user._id, type, message });
  return NextResponse.json({ feedback: fb }, { status: 201 });
} 