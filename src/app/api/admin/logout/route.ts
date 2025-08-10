import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const baseUrl = req.nextUrl.origin;
  const res = NextResponse.redirect(`${baseUrl}/admin/login`, { status: 302 });
  
  // Clear the admin-auth cookie
  res.cookies.set("admin-auth", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0, // Expire immediately
  });
  
  return res;
} 