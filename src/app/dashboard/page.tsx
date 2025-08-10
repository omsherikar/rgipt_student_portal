"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import * as HiIcons from "react-icons/hi";

const quickActions = [
  { label: "Request Bonafide", icon: HiIcons.HiOutlineDocumentAdd, href: "/dashboard/documents" },
  { label: "Pay Fees", icon: HiIcons.HiOutlineCreditCard, href: "#" },
  { label: "Contact Faculty", icon: HiIcons.HiOutlineMail, href: "#" },
  { label: "View Library", icon: HiIcons.HiOutlineBookOpen, href: "#" },
];

const resources = [
  { label: "Academic Calendar", href: "#" },
  { label: "Syllabus", href: "#" },
  { label: "Student Handbook", href: "#" },
  { label: "Support Portal", href: "#" },
];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [cpi, setCpi] = useState<number | null>(null);
  const [attendance, setAttendance] = useState<number | null>(null);
  const [nextExam, setNextExam] = useState<{ course: string; date: string } | null>(null);
  const [notices, setNotices] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [todos, setTodos] = useState<string[]>(["Submit feedback for CH101", "Download Bonafide certificate"]);
  const [newTodo, setNewTodo] = useState("");
  const [progress, setProgress] = useState<number>(70); // Example: 70% semester complete
  const [events, setEvents] = useState<any[]>([
    { title: "Midterm Exam - CH101", date: "2024-05-20" },
    { title: "Assignment 2 Due", date: "2024-05-22" },
    { title: "Registration Deadline", date: "2024-05-30" },
  ]);

  console.log("Dashboard - Session:", session);
  console.log("Dashboard - Status:", status);

  useEffect(() => {
    // Fetch CPI
    fetch("/api/academics", {
      credentials: 'include'
    })
      .then(res => {
        console.log("Academics response status:", res.status);
        return res.json();
      })
      .then(data => {
        console.log("Academics data:", data);
        if (data.results && data.results.length > 0) {
          setCpi(data.results[data.results.length - 1].cpi);
        }
      })
      .catch(error => {
        console.error("Error fetching academics:", error);
      });
    
    // Fetch attendance
    fetch("/api/attendance", {
      credentials: 'include'
    })
      .then(res => {
        console.log("Attendance response status:", res.status);
        return res.json();
      })
      .then(data => {
        console.log("Attendance data:", data);
        if (data.attendance && data.attendance.length > 0) {
          const total = data.attendance.length;
          const present = data.attendance.filter((a: any) => a.status === "present").length;
          setAttendance(Math.round((present / total) * 100));
        }
      })
      .catch(error => {
        console.error("Error fetching attendance:", error);
      });
    
    // Fetch next exam
    fetch("/api/timetable/exam", {
      credentials: 'include'
    })
      .then(res => {
        console.log("Exam response status:", res.status);
        return res.json();
      })
      .then(data => {
        console.log("Exam data:", data);
        if (data.exams && data.exams.length > 0) {
          const sorted = data.exams.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
          setNextExam({
            course: sorted[0].courseId?.code || "",
            date: new Date(sorted[0].date).toLocaleDateString(),
          });
        }
      })
      .catch(error => {
        console.error("Error fetching exams:", error);
      });
    
    // Fetch recent notices
    fetch("/api/notices", {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        setNotices(data.notices ? data.notices.slice(0, 2) : []);
      })
      .catch(error => {
        console.error("Error fetching notices:", error);
      });
    
    // Fetch recent documents
    fetch("/api/documents", {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        setDocuments(data.documents ? data.documents.slice(0, 2) : []);
      })
      .catch(error => {
        console.error("Error fetching documents:", error);
      });
  }, []);

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  if (!session) {
    redirect("/auth/signin");
  }
  const user = session?.user;

  return (
    <main className="min-h-screen flex flex-col items-center py-10" style={{ background: '#f4f6fb' }}>
      <div className="w-full max-w-4xl flex flex-col gap-8">
        {/* Quick Actions Bar */}
        <div className="w-full flex flex-wrap gap-4 justify-center bg-white rounded-2xl shadow-lg p-4 border border-[#e5e7eb]">
          {quickActions.map((action, i) => (
            <a key={i} href={action.href} className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold shadow-sm transition border border-[#e5e7eb] hover:bg-blue-50" style={{ color: '#2563eb' }}>
              {/* @ts-expect-error React 19 + react-icons type workaround */}
              {action.icon({ className: "w-5 h-5" })}
              {action.label}
            </a>
          ))}
        </div>
        {/* Welcome/Profile Card */}
        <div className="w-full flex items-center gap-6 bg-white rounded-2xl shadow-lg p-8 border border-[#e5e7eb]">
          <img
            src={user?.image || "https://randomuser.me/api/portraits/men/32.jpg"}
            alt="Student Photo"
            className="w-20 h-20 rounded-full border-4 border-[#2563eb] object-cover shadow"
          />
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#22223b' }}>Welcome, {user?.name || "Student"}!</h1>
            <p style={{ color: '#6c757d' }}>{user?.email}</p>
          </div>
        </div>
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="w-full bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4 border-l-4" style={{ borderColor: '#2563eb', borderLeftWidth: 4, borderStyle: 'solid' }}>
            {/* @ts-expect-error React 19 + react-icons type workaround */}
            {HiIcons.HiOutlineAcademicCap({ className: "w-8 h-8", style: { color: '#2563eb' } })}
            <div>
              <div className="text-sm font-semibold" style={{ color: '#6c757d' }}>Current CPI</div>
              <div className="text-2xl font-bold" style={{ color: '#22223b' }}>{cpi !== null ? cpi : "-"}</div>
            </div>
          </div>
          <div className="w-full bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4 border-l-4" style={{ borderColor: '#2563eb', borderLeftWidth: 4, borderStyle: 'solid' }}>
            {/* @ts-expect-error React 19 + react-icons type workaround */}
            {HiIcons.HiOutlineClipboardList({ className: "w-8 h-8", style: { color: '#2563eb' } })}
            <div>
              <div className="text-sm font-semibold" style={{ color: '#6c757d' }}>Attendance</div>
              <div className="text-2xl font-bold" style={{ color: '#22223b' }}>{attendance !== null ? `${attendance}%` : "-"}</div>
            </div>
          </div>
          <div className="w-full bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4 border-l-4" style={{ borderColor: '#2563eb', borderLeftWidth: 4, borderStyle: 'solid' }}>
            {/* @ts-expect-error React 19 + react-icons type workaround */}
            {HiIcons.HiOutlineCalendar({ className: "w-8 h-8", style: { color: '#2563eb' } })}
            <div>
              <div className="text-sm font-semibold" style={{ color: '#6c757d' }}>Next Exam</div>
              <div className="text-2xl font-bold" style={{ color: '#22223b' }}>{nextExam ? `${nextExam.course} (${nextExam.date})` : "-"}</div>
            </div>
          </div>
        </div>
        {/* New Widgets Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* To-Do/Reminders Widget */}
          <div className="w-full bg-white rounded-2xl shadow-lg p-6 border-l-4 flex flex-col gap-3" style={{ borderColor: '#2563eb', borderLeftWidth: 4, borderStyle: 'solid' }}>
            <div className="flex items-center gap-2 mb-2 font-semibold" style={{ color: '#2563eb' }}>
              {/* @ts-expect-error React 19 + react-icons type workaround */}
              {HiIcons.HiOutlineClipboardCheck({ className: "w-5 h-5" })} To-Do / Reminders
            </div>
            <ul className="text-sm mb-2">
              {todos.length ? todos.map((todo, i) => (
                <li key={i} className="mb-1 flex items-center gap-2">
                  {/* @ts-expect-error React 19 + react-icons type workaround */}
                  {HiIcons.HiOutlineChevronRight({ className: "w-4 h-4 text-blue-400" })}
                  <span style={{ color: '#22223b' }}>{todo}</span>
                </li>
              )) : <li style={{ color: '#6c757d' }}>No reminders.</li>}
            </ul>
            <form className="flex gap-2" onSubmit={e => { e.preventDefault(); if (newTodo.trim()) { setTodos([...todos, newTodo.trim()]); setNewTodo(""); } }}>
              <input
                className="flex-1 border rounded px-2 py-1 text-sm"
                style={{ borderColor: '#e5e7eb', color: '#22223b' }}
                placeholder="Add reminder..."
                value={newTodo}
                onChange={e => setNewTodo(e.target.value)}
              />
              <button type="submit" className="px-3 py-1 rounded bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition">Add</button>
            </form>
          </div>
          {/* Academic Progress Widget */}
          <div className="w-full bg-white rounded-2xl shadow-lg p-6 border-l-4 flex flex-col gap-3" style={{ borderColor: '#2563eb', borderLeftWidth: 4, borderStyle: 'solid' }}>
            <div className="flex items-center gap-2 mb-2 font-semibold" style={{ color: '#2563eb' }}>
              {/* @ts-expect-error React 19 + react-icons type workaround */}
              {HiIcons.HiOutlineTrendingUp({ className: "w-5 h-5" })} Academic Progress
            </div>
            <div className="w-full bg-gray-100 rounded h-4 overflow-hidden">
              <div className="bg-blue-500 h-4 rounded" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="text-sm mt-1" style={{ color: '#22223b' }}>{progress}% of semester completed</div>
          </div>
        </div>
        {/* New Widgets Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upcoming Events Widget */}
          <div className="w-full bg-white rounded-2xl shadow-lg p-6 border-l-4 flex flex-col gap-3" style={{ borderColor: '#2563eb', borderLeftWidth: 4, borderStyle: 'solid' }}>
            <div className="flex items-center gap-2 mb-2 font-semibold" style={{ color: '#2563eb' }}>
              {/* @ts-expect-error React 19 + react-icons type workaround */}
              {HiIcons.HiOutlineCalendar({ className: "w-5 h-5" })} Upcoming Events
            </div>
            <ul className="text-sm">
              {events.length ? events.map((ev, i) => (
                <li key={i} className="mb-2 flex justify-between items-center">
                  <span className="font-medium" style={{ color: '#22223b' }}>{ev.title}</span>
                  <span style={{ color: '#6c757d' }} className="ml-2">{new Date(ev.date).toLocaleDateString()}</span>
                </li>
              )) : <li style={{ color: '#6c757d' }}>No upcoming events.</li>}
            </ul>
          </div>
          {/* Useful Resources Widget */}
          <div className="w-full bg-white rounded-2xl shadow-lg p-6 border-l-4 flex flex-col gap-3" style={{ borderColor: '#2563eb', borderLeftWidth: 4, borderStyle: 'solid' }}>
            <div className="flex items-center gap-2 mb-2 font-semibold" style={{ color: '#2563eb' }}>
              {/* @ts-expect-error React 19 + react-icons type workaround */}
              {HiIcons.HiOutlineLink({ className: "w-5 h-5" })} Useful Resources
            </div>
            <ul className="text-sm">
              {resources.map((r, i) => (
                <li key={i} className="mb-2">
                  <a href={r.href} className="font-medium underline" style={{ color: '#2563eb' }} target="_blank" rel="noopener noreferrer">{r.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Recent Notices & Documents */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="w-full bg-white rounded-2xl shadow-lg p-6 border-l-4" style={{ borderColor: '#2563eb', borderLeftWidth: 4, borderStyle: 'solid' }}>
            <div className="flex items-center gap-2 mb-2 font-semibold" style={{ color: '#2563eb' }}>
              {/* @ts-expect-error React 19 + react-icons type workaround */}
              {HiIcons.HiOutlineBell({ className: "w-5 h-5" })} Recent Notices
            </div>
            <ul className="text-sm">
              {notices.length ? notices.map((n, i) => (
                <li key={i} className="mb-2 flex justify-between items-center">
                  <span className="font-medium" style={{ color: '#22223b' }}>{n.title}</span>
                  <span style={{ color: '#6c757d' }} className="ml-2">{new Date(n.createdAt).toLocaleDateString()}</span>
                </li>
              )) : <li style={{ color: '#6c757d' }}>No recent notices.</li>}
            </ul>
          </div>
          <div className="w-full bg-white rounded-2xl shadow-lg p-6 border-l-4" style={{ borderColor: '#2563eb', borderLeftWidth: 4, borderStyle: 'solid' }}>
            <div className="flex items-center gap-2 mb-2 font-semibold" style={{ color: '#2563eb' }}>
              {/* @ts-expect-error React 19 + react-icons type workaround */}
              {HiIcons.HiOutlineDocumentText({ className: "w-5 h-5" })} Recent Documents
            </div>
            <ul className="text-sm">
              {documents.length ? documents.map((d, i) => (
                <li key={i} className="mb-2 flex justify-between items-center">
                  <a href={d.url} target="_blank" rel="noopener noreferrer" className="font-medium underline" style={{ color: '#2563eb' }}>{d.type}</a>
                  <span style={{ color: '#6c757d' }} className="ml-2">{new Date(d.uploadedAt).toLocaleDateString()}</span>
                </li>
              )) : <li style={{ color: '#6c757d' }}>No recent documents.</li>}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
} 