import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/mongoose";
import Enrollment from "@/models/Enrollment";
import Course from "@/models/Course";
import Result from "@/models/Result";

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
    const userId = searchParams.get("userId");
    const semester = searchParams.get("semester");
    const department = searchParams.get("department");
    if (!userId || !semester) {
      return NextResponse.json({ error: "Missing userId or semester" }, { status: 400 });
    }
    let enrollments = await Enrollment.find({ userId, semester })
      .populate({ path: "courseId", model: Course })
      .lean();
    if (department) {
      enrollments = enrollments.filter(e => e.courseId && e.courseId.department === department);
    }
    return NextResponse.json({ enrollments });
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
    const { updates } = await req.json();
    if (!Array.isArray(updates)) {
      return NextResponse.json({ error: "Missing or invalid updates array" }, { status: 400 });
    }
    const results = [];
    let userId = null;
    let semester = null;
    for (const update of updates) {
      const { userId: uid, courseId, semester: sem, grade } = update;
      if (!uid || !courseId || !sem) continue;
      userId = uid;
      semester = sem;
      // Upsert enrollment
      const enrollment = await Enrollment.findOneAndUpdate(
        { userId: uid, courseId, semester: sem },
        { grade },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      results.push(enrollment);
    }
    // Only calculate SPI/CPI if we have a user and semester
    if (userId && semester) {
      // 1. Calculate SPI for this semester
      const enrollments = await Enrollment.find({ userId, semester }).populate({ path: "courseId", model: Course }).lean();
      const gradeMap: { [key: string]: number } = { "A+": 10, "A": 9, "B+": 8, "B": 7, "C+": 6, "C": 5, "D": 4, "F": 0 };
      let totalCredits = 0;
      let weightedSum = 0;
      for (const e of enrollments) {
        const credits = e.courseId?.credits || 0;
        const points = gradeMap[(e.grade as string)] ?? 0;
        totalCredits += credits;
        weightedSum += credits * points;
      }
      const spi = totalCredits > 0 ? weightedSum / totalCredits : 0;
      // 2. Calculate CPI for the academic year
      // Assume semesters 1 & 2 = year 1, 3 & 4 = year 2, etc.
      const semNum = parseInt(semester, 10);
      const yearSemesters = [((Math.floor((semNum - 1) / 2)) * 2 + 1).toString(), ((Math.floor((semNum - 1) / 2)) * 2 + 2).toString()];
      const resultsForYear = await Result.find({ userId, semester: { $in: yearSemesters } });
      // Include the current SPI in the CPI calculation
      let spiList = resultsForYear.map(r => r.spi);
      // If current semester is not in resultsForYear, add it
      if (!resultsForYear.some(r => r.semester === semester)) {
        spiList.push(spi);
      } else {
        // Replace the SPI for the current semester if it exists
        spiList = spiList.map((s, i) => resultsForYear[i].semester === semester ? spi : s);
      }
      const cpi = spiList.length > 0 ? spiList.reduce((a, b) => a + b, 0) / spiList.length : 0;
      // Round SPI and CPI to 2 decimals
      const spiRounded = Math.round(spi * 100) / 100;
      const cpiRounded = Math.round(cpi * 100) / 100;
      // 3. Upsert Result document
      await Result.findOneAndUpdate(
        { userId, semester },
        { userId, semester, spi: spiRounded, cpi: cpiRounded },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
    }
    return NextResponse.json({ enrollments: results });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 