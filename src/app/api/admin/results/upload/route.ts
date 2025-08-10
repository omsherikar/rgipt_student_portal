import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { pdfBase64, filename } = data;
    if (!pdfBase64 || !filename) {
      return NextResponse.json({ error: "Missing PDF data or filename" }, { status: 400 });
    }
    // Remove data URL prefix if present
    const base64 = pdfBase64.replace(/^data:application\/pdf;base64,/, "");
    const buffer = Buffer.from(base64, "base64");
    // Ensure marksheets directory exists
    const marksheetDir = path.join(process.cwd(), "public", "marksheets");
    if (!fs.existsSync(marksheetDir)) {
      fs.mkdirSync(marksheetDir, { recursive: true });
    }
    const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filePath = path.join(marksheetDir, safeFilename);
    fs.writeFileSync(filePath, buffer);
    const url = `/marksheets/${safeFilename}`;
    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json({ error: "Failed to upload PDF" }, { status: 500 });
  }
} 