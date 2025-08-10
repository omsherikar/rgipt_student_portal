"use client";
import { useEffect, useState } from "react";

interface Attachment {
  name: string;
  url: string;
}

interface Notice {
  _id: string;
  title: string;
  content: string;
  type: string;
  createdAt: string;
  attachments?: Attachment[];
}

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/notices");
        if (!res.ok) throw new Error("Failed to fetch notices");
        const json = await res.json();
        setNotices(json.notices || []);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center py-10" style={{ background: '#f4f6fb' }}>
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8 border border-[#e5e7eb]">
        <h1 className="text-2xl font-bold mb-6" style={{ color: '#22223b' }}>Notices & Announcements</h1>
        {loading ? (
          <div className="text-center">Loading notices...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : (
          <ul className="space-y-6">
            {notices.length ? notices.map(notice => (
              <li key={notice._id} className="border rounded-xl p-6 bg-gray-50" style={{ borderColor: '#e5e7eb' }}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <div className="font-semibold text-lg" style={{ color: '#1d3557' }}>{notice.title}</div>
                  <div className="text-xs" style={{ color: '#6c757d' }}>
                    {notice.type.charAt(0).toUpperCase() + notice.type.slice(1)} | {new Date(notice.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="mb-2" style={{ color: '#22223b' }}>{notice.content}</div>
                {notice.attachments && notice.attachments.length > 0 && (
                  <div className="mt-2">
                    <div className="font-medium text-sm mb-1" style={{ color: '#6c757d' }}>Attachments:</div>
                    <ul className="list-disc list-inside">
                      {notice.attachments.map((att, i) => (
                        <li key={i}>
                          <a href={att.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{att.name || att.url}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            )) : <li className="text-center" style={{ color: '#b0b7c3' }}>No notices found.</li>}
          </ul>
        )}
      </div>
    </main>
  );
} 