"use client";

import { useEffect, useState } from "react";

interface Course {
  code: string;
  name: string;
  semester: string;
  credits: number;
}

interface Enrollment {
  courseId: Course;
  semester: string;
  grade?: string;
}

interface Result {
  semester: string;
  cpi: number;
  pdfUrl?: string;
}

export default function AcademicsPage() {
  const [data, setData] = useState<{ enrollments: Enrollment[]; results: Result[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/academics");
        if (!res.ok) throw new Error("Failed to fetch academic info");
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading academic info...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!data) return null;

  return (
    <main className="min-h-screen flex flex-col items-center py-10" style={{ background: '#f4f6fb' }}>
      <div className="w-full max-w-4xl flex flex-col gap-8">
        <div className="w-full bg-white rounded-2xl shadow-lg p-8 border border-[#e5e7eb]">
          <h1 className="text-2xl font-bold mb-4" style={{ color: '#22223b' }}>Academic Information</h1>
        </div>
        <div className="w-full bg-white rounded-2xl shadow-lg p-8 border border-[#e5e7eb]">
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#6c757d' }}>Enrolled Courses</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-separate border-spacing-0 rounded-lg overflow-hidden">
              <thead>
                <tr style={{ background: '#f4f6fb' }}>
                  <th className="p-3 text-left font-semibold border-b" style={{ borderColor: '#e5e7eb', color: '#6c757d' }}>Code</th>
                  <th className="p-3 text-left font-semibold border-b" style={{ borderColor: '#e5e7eb', color: '#6c757d' }}>Name</th>
                  <th className="p-3 text-left font-semibold border-b" style={{ borderColor: '#e5e7eb', color: '#6c757d' }}>Semester</th>
                  <th className="p-3 text-left font-semibold border-b" style={{ borderColor: '#e5e7eb', color: '#6c757d' }}>Credits</th>
                  <th className="p-3 text-left font-semibold border-b" style={{ borderColor: '#e5e7eb', color: '#6c757d' }}>Grade</th>
                </tr>
              </thead>
              <tbody>
                {data.enrollments.map((enr, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f4f6fb' }}>
                    <td className="p-3 border-b" style={{ borderColor: '#e5e7eb', color: '#22223b' }}>{enr.courseId?.code}</td>
                    <td className="p-3 border-b" style={{ borderColor: '#e5e7eb', color: '#22223b' }}>{enr.courseId?.name}</td>
                    <td className="p-3 border-b" style={{ borderColor: '#e5e7eb', color: '#22223b' }}>{enr.semester}</td>
                    <td className="p-3 border-b" style={{ borderColor: '#e5e7eb', color: '#22223b' }}>{enr.courseId?.credits}</td>
                    <td className="p-3 border-b" style={{ borderColor: '#e5e7eb', color: '#22223b' }}>{enr.grade || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="w-full bg-white rounded-2xl shadow-lg p-8 border border-[#e5e7eb]">
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#6c757d' }}>Semester Results</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-separate border-spacing-0 rounded-lg overflow-hidden">
              <thead>
                <tr style={{ background: '#f4f6fb' }}>
                  <th className="p-3 text-left font-semibold border-b" style={{ borderColor: '#e5e7eb', color: '#6c757d' }}>Semester</th>
                  <th className="p-3 text-left font-semibold border-b" style={{ borderColor: '#e5e7eb', color: '#6c757d' }}>CPI</th>
                  <th className="p-3 text-left font-semibold border-b" style={{ borderColor: '#e5e7eb', color: '#6c757d' }}>Marksheet</th>
                </tr>
              </thead>
              <tbody>
                {data.results.map((res, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f4f6fb' }}>
                    <td className="p-3 border-b" style={{ borderColor: '#e5e7eb', color: '#22223b' }}>{res.semester}</td>
                    <td className="p-3 border-b" style={{ borderColor: '#e5e7eb', color: '#22223b' }}>{res.cpi}</td>
                    <td className="p-3 border-b" style={{ borderColor: '#e5e7eb', color: '#22223b' }}>
                      {res.pdfUrl ? (
                        <a href={res.pdfUrl} target="_blank" rel="noopener noreferrer" className="font-medium underline" style={{ color: '#2563eb' }}>Download PDF</a>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
} 