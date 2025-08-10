"use client";
import { SessionProvider, useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import {
  HiOutlineHome,
  HiOutlineAcademicCap,
  HiOutlineClipboardList,
  HiOutlineCalendar,
  HiOutlineDocumentText,
  HiOutlineChatAlt2,
  HiOutlineBell,
  HiOutlineUser,
  HiOutlineMenuAlt2,
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
  HiOutlineX,
} from "react-icons/hi";

const navLinks = [
  { title: "Dashboard", href: "/dashboard", icon: HiOutlineHome },
  { title: "Personal Info", href: "/dashboard/personal", icon: HiOutlineUser },
  { title: "Academic Info", href: "/dashboard/academics", icon: HiOutlineAcademicCap },
  { title: "Attendance", href: "/dashboard/attendance", icon: HiOutlineClipboardList },
  { title: "Timetable", href: "/dashboard/timetable", icon: HiOutlineCalendar },
  { title: "Document Center", href: "/dashboard/documents", icon: HiOutlineDocumentText },
  { title: "Feedback", href: "/dashboard/feedback", icon: HiOutlineChatAlt2 },
  { title: "Notices", href: "/dashboard/notices", icon: HiOutlineBell },
];

function Sidebar({ minimized, setMinimized }: { minimized: boolean; setMinimized: (v: boolean) => void }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const user = session?.user;

  return (
    <aside className={`h-full ${minimized ? 'w-16' : 'w-64'} bg-white border-r flex flex-col justify-between fixed z-10 left-0 top-0 bottom-0 shadow-lg transition-all duration-200`}>
      <div>
        <div className="flex items-center justify-between px-4 py-6 border-b bg-white">
          <div className="flex items-center gap-3">
            <img src="/rgipt-logo.png" alt="RGIPT Logo" width={40} height={40} className="block" />
          </div>
          <button
            onClick={() => setMinimized(!minimized)}
            className="p-2 rounded-full bg-blue-600 shadow hover:bg-blue-700 transition flex items-center justify-center"
            aria-label={minimized ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {minimized ? HiOutlineChevronDoubleRight({ className: "w-6 h-6 text-white" }) : HiOutlineChevronDoubleLeft({ className: "w-6 h-6 text-white" })}
          </button>
        </div>
        {!minimized && (
          <div className="flex flex-col items-center py-8 border-b bg-white">
            <img
              src={user?.image || "https://randomuser.me/api/portraits/men/32.jpg"}
              alt="Profile"
              className="w-16 h-16 rounded-full border-2 border-blue-500 object-cover mb-3" />
            <div className="font-semibold text-lg text-gray-800 mb-1">{user?.name || "Student"}</div>
            <div className="text-xs text-gray-500">{user?.email}</div>
          </div>
        )}
        <nav className={`mt-8 flex flex-col ${minimized ? 'items-center px-2 gap-2' : 'px-4 gap-3'}`}>
          {navLinks.map(link => {
            const Icon = link.icon;
            return (
              <button
                key={link.href}
                onClick={() => router.push(link.href)}
                className={`flex items-center ${minimized ? 'justify-center' : 'gap-3 text-left'} px-4 py-2 rounded transition font-medium text-base ${pathname === link.href ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100 text-gray-700"}`}
                style={minimized ? { width: '100%' } : {}}
              >
                {/** @ts-expect-error React 19 + react-icons type workaround */}
                <Icon className="w-5 h-5" />
                {!minimized && link.title}
              </button>
            );
          })}
        </nav>
      </div>
      <div className="p-6 border-t mt-auto bg-white">
        {!minimized && (
          <button
            onClick={() => signOut({ callbackUrl: "/auth/signin" })}
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 font-semibold"
          >
            Logout
          </button>
        )}
      </div>
    </aside>
  );
}

export default function DashboardLayout({ children }: { children: any }) {
  const [minimized, setMinimized] = useState(false);
  // Chatbot state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'bot', text: string }[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  async function sendToHuggingFace(message: string) {
    setChatLoading(true);
    setChatMessages(msgs => [...msgs, { sender: 'user', text: message }]);
    try {
      const res = await fetch("https://api-inference.huggingface.co/models/google/flan-t5-base", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: message }),
      });
      const data = await res.json();
      let botText = "Sorry, I couldn't understand that.";
      if (Array.isArray(data) && data[0]?.generated_text) botText = data[0].generated_text;
      else if (data.generated_text) botText = data.generated_text;
      setChatMessages(msgs => [...msgs, { sender: 'bot', text: botText }]);
    } catch {
      setChatMessages(msgs => [...msgs, { sender: 'bot', text: "Error contacting AI. Please try again." }]);
    } finally {
      setChatLoading(false);
    }
  }

  function handleChatSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (chatInput.trim()) {
      sendToHuggingFace(chatInput.trim());
      setChatInput("");
    }
  }

  return (
    <SessionProvider>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar minimized={minimized} setMinimized={setMinimized} />
        <div className="flex-1" style={{ marginLeft: minimized ? 64 : 256, transition: 'margin 0.2s' }}>
          {children}
          {/* Floating Chatbot Button */}
          <button
            className="fixed bottom-8 right-8 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
            onClick={() => setChatOpen(true)}
            aria-label="Open chatbot"
          >
            {/* @ts-expect-error React 19 + react-icons type workaround */}
            {HiOutlineChatAlt2({ className: "w-7 h-7" })}
          </button>
          {/* Chatbot Modal */}
          {chatOpen && (
            <div className="fixed inset-0 bg-black/30 flex items-end justify-end z-50">
              <div className="bg-white rounded-2xl shadow-2xl m-8 w-full max-w-sm flex flex-col h-[70vh]">
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="font-bold text-blue-700">AI Chatbot</div>
                  <button onClick={() => setChatOpen(false)} className="p-1 rounded hover:bg-gray-100">
                    {/* @ts-expect-error React 19 + react-icons type workaround */}
                    {HiOutlineX({ className: "w-6 h-6 text-gray-500" })}
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                  {chatMessages.length === 0 && <div className="text-gray-400 text-sm text-center">Ask me anything about the portal, academics, or campus life!</div>}
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`px-4 py-2 rounded-lg max-w-[80%] text-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-white border'}`}>{msg.text}</div>
                    </div>
                  ))}
                  {chatLoading && <div className="text-xs text-gray-400">AI is typing...</div>}
                </div>
                <form onSubmit={handleChatSubmit} className="flex gap-2 p-4 border-t bg-white">
                  <input
                    className="flex-1 border rounded px-3 py-2 text-sm"
                    style={{ borderColor: '#e5e7eb', color: '#22223b' }}
                    placeholder="Type your question..."
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    disabled={chatLoading}
                  />
                  <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition" disabled={chatLoading || !chatInput.trim()}>Send</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </SessionProvider>
  );
}