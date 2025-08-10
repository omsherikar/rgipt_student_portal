"use client";

import { useEffect, useState } from "react";

interface Course {
  code: string;
  name: string;
}

interface AttendanceRecord {
  courseId: Course;
  date: string;
  status: "present" | "absent";
}

interface SubjectAttendance {
  code: string;
  name: string;
  total: number;
  present: number;
}

function getSubjectAttendance(records: AttendanceRecord[]): SubjectAttendance[] {
  const map: Record<string, SubjectAttendance> = {};
  for (const rec of records) {
    if (!rec.courseId) continue;
    const key = rec.courseId.code;
    if (!map[key]) {
      map[key] = {
        code: rec.courseId.code,
        name: rec.courseId.name,
        total: 0,
        present: 0,
      };
    }
    map[key].total++;
    if (rec.status === "present") map[key].present++;
  }
  return Object.values(map);
}

export default function AttendancePage() {
  const [data, setData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/attendance");
        if (!res.ok) throw new Error("Failed to fetch attendance");
        const json = await res.json();
        setData(json.attendance || []);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const subjects = getSubjectAttendance(data);

  if (loading) return <div className="p-8 text-center">Loading attendance...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <main className="min-h-screen flex flex-col items-center py-10" style={{ background: '#f4f6fb' }}>
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8 border border-[#e5e7eb]">
        <h1 className="text-2xl font-bold mb-6" style={{ color: '#22223b' }}>Attendance Tracker</h1>
        <h2 className="text-lg font-semibold mb-4" style={{ color: '#6c757d' }}>Subject-wise Attendance</h2>
        <div className="overflow-x-auto rounded-lg mb-6">
          <table className="w-full text-sm border-separate border-spacing-0 rounded-lg overflow-hidden">
            <thead>
              <tr style={{ background: '#f4f6fb' }}>
                <th className="p-3 text-left font-semibold border-b" style={{ borderColor: '#e5e7eb', color: '#6c757d' }}>Code</th>
                <th className="p-3 text-left font-semibold border-b" style={{ borderColor: '#e5e7eb', color: '#6c757d' }}>Name</th>
                <th className="p-3 text-left font-semibold border-b" style={{ borderColor: '#e5e7eb', color: '#6c757d' }}>Total Classes</th>
                <th className="p-3 text-left font-semibold border-b" style={{ borderColor: '#e5e7eb', color: '#6c757d' }}>Present</th>
                <th className="p-3 text-left font-semibold border-b" style={{ borderColor: '#e5e7eb', color: '#6c757d' }}>Attendance %</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subj) => (
                <tr key={subj.code} style={{ background: '#fff' }}>
                  <td className="p-3 border-b" style={{ borderColor: '#e5e7eb', color: '#22223b' }}>{subj.code}</td>
                  <td className="p-3 border-b" style={{ borderColor: '#e5e7eb', color: '#22223b' }}>{subj.name}</td>
                  <td className="p-3 border-b" style={{ borderColor: '#e5e7eb', color: '#22223b' }}>{subj.total}</td>
                  <td className="p-3 border-b" style={{ borderColor: '#e5e7eb', color: '#22223b' }}>{subj.present}</td>
                  <td className="p-3 border-b" style={{ borderColor: '#e5e7eb', color: '#2563eb', fontWeight: 600 }}>{((subj.present / subj.total) * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h2 className="text-lg font-semibold mb-4" style={{ color: '#6c757d' }}>Attendance Percentage by Subject</h2>
        <div className="flex gap-6 items-end h-40 mb-4">
          {subjects.map((subj) => {
            const percent = subj.total ? (subj.present / subj.total) * 100 : 0;
            return (
              <div key={subj.code} className="flex flex-col items-center justify-end h-full">
                <div
                  className="w-8 rounded-t"
                  style={{ height: `${percent * 1.2}px`, background: '#2563eb' }}
                  title={`${percent.toFixed(1)}%`}
                ></div>
                <span className="text-xs mt-1" style={{ color: '#6c757d' }}>{subj.code}</span>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
} 