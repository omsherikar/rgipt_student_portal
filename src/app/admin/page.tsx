"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import * as HiIcons from "react-icons/hi";

const features = [
  { name: "Students", path: "/admin/students", icon: HiIcons.HiOutlineUserGroup },
  { name: "Academics", path: "/admin/academics", icon: HiIcons.HiOutlineAcademicCap },
  { name: "Attendance", path: "/admin/attendance", icon: HiIcons.HiOutlineClipboardList },
  { name: "Documents", path: "/admin/documents", icon: HiIcons.HiOutlineDocumentText },
  { name: "Notices", path: "/admin/notices", icon: HiIcons.HiOutlineSpeakerphone },
  { name: "Timetable", path: "/admin/timetable", icon: HiIcons.HiOutlineCalendar },
  { name: "Feedback", path: "/admin/feedback", icon: HiIcons.HiOutlineChatAlt2 },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  
  return (
    <>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <aside
          className={`h-full ${sidebarMinimized ? 'w-16' : 'w-64'} bg-white border-r flex flex-col justify-between fixed z-10 left-0 top-0 bottom-0 shadow-lg transition-all duration-200`}
        >
          <div>
            <div className="flex items-center justify-between px-4 py-6 border-b bg-white">
              <div className="flex items-center gap-3">
                <img src="/rgipt-logo.png" alt="RGIPT Logo" width={40} height={40} className="block" />
              </div>
              <button
                onClick={() => setSidebarMinimized(!sidebarMinimized)}
                className="p-2 rounded-full bg-blue-600 shadow hover:bg-blue-700 transition flex items-center justify-center"
                aria-label={sidebarMinimized ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {sidebarMinimized ? HiIcons.HiOutlineChevronDoubleRight({ className: "w-6 h-6 text-white" }) : HiIcons.HiOutlineChevronDoubleLeft({ className: "w-6 h-6 text-white" })}
              </button>
            </div>
            <nav className={`mt-8 flex flex-col ${sidebarMinimized ? 'items-center px-2 gap-2' : 'px-4 gap-3'}`}>
              {features.map(feature => (
                <button
                  key={feature.path}
                  onClick={() => router.push(feature.path)}
                  className={`flex items-center ${sidebarMinimized ? 'justify-center' : 'gap-3 text-left'} px-4 py-2 rounded transition font-medium text-base hover:bg-gray-100 text-gray-700`}
                  style={sidebarMinimized ? { width: '100%' } : {}}
                >
                  {feature.icon({ className: "w-5 h-5", style: { color: '#2563eb' } })}
                  {!sidebarMinimized && feature.name}
                </button>
              ))}
            </nav>
          </div>
          
          {/* Logout Button */}
          <div className={`${sidebarMinimized ? 'px-2' : 'px-4'} pb-6`}>
            <button
              onClick={handleLogout}
              className={`flex items-center ${sidebarMinimized ? 'justify-center' : 'gap-3 text-left'} w-full px-4 py-3 rounded transition font-medium text-base hover:bg-red-50 text-red-600 border border-red-200 hover:border-red-300`}
              style={sidebarMinimized ? { width: '100%' } : {}}
            >
              <HiIcons.HiOutlineLogout className="w-5 h-5" />
              {!sidebarMinimized && "Logout"}
            </button>
          </div>
        </aside>
        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-12" style={{ marginLeft: sidebarMinimized ? 64 : 256, transition: 'margin 0.2s' }}>
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-10 border border-[#e5e7eb] flex items-center gap-6" style={{ minHeight: 220, justifyContent: 'center' }}>
            <div>
              <h1 className="text-3xl font-bold" style={{ color: '#22223b' }}>Welcome, Admin!</h1>
              <p style={{ color: '#6c757d', marginTop: 8 }}>
                Use the sidebar to manage Students, Academics, Attendance, Documents, Notices, Timetable, and Feedback.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Divider above footer */}
      <div style={{ width: '100%', height: 2, background: '#e5e7eb', margin: 0 }} />
      {/* Footer */}
      <footer style={{ width: '100%', background: '#fff', borderTop: '1px solid #e5e7eb', padding: '28px 0 18px 0', textAlign: 'center', fontSize: 15, color: '#555', boxShadow: '0 -2px 8px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: 1200, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div style={{ fontWeight: 700, color: '#1746a2', fontSize: 18, letterSpacing: 0.5, marginBottom: 2 }}>Rajiv Gandhi Institute of Petroleum Technology</div>
          <div style={{ color: '#2563eb', fontWeight: 700, fontSize: 16, marginBottom: 2, letterSpacing: 0.5 }}>Admin Portal</div>
          <div style={{ color: '#444', fontSize: 14, marginBottom: 2, fontWeight: 500 }}>
            Official Administrative Interface for RGIPT Staff
          </div>
          <div style={{ color: '#888', fontSize: 13, marginBottom: 2 }}>
            &copy; {new Date().getFullYear()} Rajiv Gandhi Institute of Petroleum Technology. All rights reserved.
          </div>
          <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 18, fontSize: 15, justifyContent: 'center', alignItems: 'center' }}>
            <a href="/admin/students" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500, transition: 'color 0.15s' }} onMouseOver={e => (e.currentTarget.style.color = '#1746a2')} onMouseOut={e => (e.currentTarget.style.color = '#2563eb')}>Students</a>
            <a href="/admin/academics" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500, transition: 'color 0.15s' }} onMouseOver={e => (e.currentTarget.style.color = '#1746a2')} onMouseOut={e => (e.currentTarget.style.color = '#2563eb')}>Academics</a>
            <a href="/admin/attendance" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500, transition: 'color 0.15s' }} onMouseOver={e => (e.currentTarget.style.color = '#1746a2')} onMouseOut={e => (e.currentTarget.style.color = '#2563eb')}>Attendance</a>
            <a href="/admin/documents" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500, transition: 'color 0.15s' }} onMouseOver={e => (e.currentTarget.style.color = '#1746a2')} onMouseOut={e => (e.currentTarget.style.color = '#2563eb')}>Documents</a>
            <a href="/admin/notices" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500, transition: 'color 0.15s' }} onMouseOver={e => (e.currentTarget.style.color = '#1746a2')} onMouseOut={e => (e.currentTarget.style.color = '#2563eb')}>Notices</a>
          </div>
        </div>
      </footer>
    </>
  );
} 