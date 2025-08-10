"use client";
import { useEffect, useState } from "react";

interface Course {
  code: string;
  name: string;
}

interface ClassSlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  courseId: Course;
  location?: string;
}

interface ExamSlot {
  courseId: Course;
  date: string;
  startTime: string;
  endTime: string;
  location?: string;
}

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function TimetablePage() {
  const [classSlots, setClassSlots] = useState<ClassSlot[]>([]);
  const [examSlots, setExamSlots] = useState<ExamSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [classRes, examRes] = await Promise.all([
          fetch("/api/timetable/class"),
          fetch("/api/timetable/exam"),
        ]);
        if (!classRes.ok || !examRes.ok) throw new Error("Failed to fetch timetable");
        const classJson = await classRes.json();
        const examJson = await examRes.json();
        setClassSlots(classJson.schedule || []);
        setExamSlots(examJson.exams || []);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading timetable...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  // Group class slots by day
  const slotsByDay: { [key: number]: ClassSlot[] } = {};
  for (const slot of classSlots) {
    if (!slotsByDay[slot.dayOfWeek]) slotsByDay[slot.dayOfWeek] = [];
    slotsByDay[slot.dayOfWeek].push(slot);
  }

  return (
    <main className="min-h-screen flex flex-col items-center py-10" style={{ background: '#f4f6fb' }}>
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8 border border-[#e5e7eb]">
        <h1 className="text-2xl font-bold mb-6" style={{ color: '#22223b' }}>Timetable</h1>
        <h2 className="text-lg font-semibold mb-4" style={{ color: '#6c757d' }}>Weekly Class Schedule</h2>
        <div className="overflow-x-auto mb-8">
          <table className="w-full border-separate border-spacing-0 rounded-lg overflow-hidden">
            <thead>
              <tr style={{ background: '#f4f6fb' }}>
                {days.map((day, i) => (
                  <th key={i} className="p-3 border-b font-semibold min-w-[120px]" style={{ borderColor: '#e5e7eb', color: '#6c757d' }}>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {days.map((_, dayIdx) => (
                  <td key={dayIdx} className="align-top border p-2" style={{ borderColor: '#e5e7eb', background: '#fff' }}>
                    {slotsByDay[dayIdx]?.length ? (
                      <ul className="space-y-2">
                        {slotsByDay[dayIdx].map((slot, i) => (
                          <li key={i} className="bg-blue-50 rounded p-2 shadow-sm">
                            <div className="font-semibold" style={{ color: '#22223b' }}>{slot.courseId?.code} - {slot.courseId?.name}</div>
                            <div className="text-sm" style={{ color: '#6c757d' }}>{slot.startTime} - {slot.endTime}</div>
                            {slot.location && <div className="text-xs" style={{ color: '#6c757d' }}>{slot.location}</div>}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-sm" style={{ color: '#b0b7c3' }}>No class</span>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <h2 className="text-lg font-semibold mb-4" style={{ color: '#6c757d' }}>Upcoming Exams</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0 rounded-lg overflow-hidden">
            <thead>
              <tr style={{ background: '#f4f6fb' }}>
                <th className="p-3 text-left font-semibold border-b" style={{ borderColor: '#e5e7eb', color: '#6c757d' }}>Course</th>
                <th className="p-3 text-left font-semibold border-b" style={{ borderColor: '#e5e7eb', color: '#6c757d' }}>Date</th>
                <th className="p-3 text-left font-semibold border-b" style={{ borderColor: '#e5e7eb', color: '#6c757d' }}>Time</th>
                <th className="p-3 text-left font-semibold border-b" style={{ borderColor: '#e5e7eb', color: '#6c757d' }}>Location</th>
              </tr>
            </thead>
            <tbody>
              {examSlots.length ? (
                examSlots.map((exam, i) => (
                  <tr key={i} style={{ background: '#fff' }}>
                    <td className="p-3 border-b" style={{ borderColor: '#e5e7eb', color: '#22223b' }}>{exam.courseId?.code} - {exam.courseId?.name}</td>
                    <td className="p-3 border-b" style={{ borderColor: '#e5e7eb', color: '#22223b' }}>{new Date(exam.date).toLocaleDateString()}</td>
                    <td className="p-3 border-b" style={{ borderColor: '#e5e7eb', color: '#22223b' }}>{exam.startTime} - {exam.endTime}</td>
                    <td className="p-3 border-b" style={{ borderColor: '#e5e7eb', color: '#22223b' }}>{exam.location || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={4} className="p-3 text-center" style={{ color: '#b0b7c3', background: '#fff' }}>No upcoming exams</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
} 