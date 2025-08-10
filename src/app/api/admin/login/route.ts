import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const baseUrl = req.nextUrl.origin;

  if (email === adminEmail && password === adminPassword) {
    const res = NextResponse.redirect(`${baseUrl}/admin`, { status: 302 });
    res.cookies.set("admin-auth", "true", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8, // 8 hours
    });
    return res;
  }

  // Optionally, redirect back to /admin with an error message
  return NextResponse.redirect(`${baseUrl}/admin?error=1`, { status: 302 });
} 