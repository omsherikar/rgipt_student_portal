export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="w-full flex justify-between items-center px-8 py-6 border-b bg-white">
        <div className="flex items-center gap-3">
          <img src="/rgipt-logo.png" alt="RGIPT Logo" width={40} height={40} className="inline-block" />
          <span className="text-xl font-bold text-gray-900 tracking-tight">RGIPT Student Portal</span>
        </div>
        <a href="/auth/signin" className="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition">Sign In</a>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 text-center">Welcome to Your Campus Hub</h1>
        <p className="text-lg text-gray-500 mb-10 text-center max-w-xl">
          All your academics, attendance, schedules, documents, and campus updates—organized in one modern, easy-to-use portal.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-4xl mt-8">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 flex flex-col items-start shadow-sm">
            <div className="text-blue-600 text-2xl mb-2">📚</div>
            <div className="font-semibold text-gray-900 mb-1">Academics</div>
            <div className="text-gray-500 text-sm">View courses, grades, and progress.</div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 flex flex-col items-start shadow-sm">
            <div className="text-blue-600 text-2xl mb-2">🗓️</div>
            <div className="font-semibold text-gray-900 mb-1">Timetable</div>
            <div className="text-gray-500 text-sm">Check your class and exam schedules.</div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 flex flex-col items-start shadow-sm">
            <div className="text-blue-600 text-2xl mb-2">✅</div>
            <div className="font-semibold text-gray-900 mb-1">Attendance</div>
            <div className="text-gray-500 text-sm">Track your attendance records.</div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 flex flex-col items-start shadow-sm">
            <div className="text-blue-600 text-2xl mb-2">📄</div>
            <div className="font-semibold text-gray-900 mb-1">Documents</div>
            <div className="text-gray-500 text-sm">Access and download student documents.</div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 flex flex-col items-start shadow-sm">
            <div className="text-blue-600 text-2xl mb-2">🔔</div>
            <div className="font-semibold text-gray-900 mb-1">Notices</div>
            <div className="text-gray-500 text-sm">Stay updated with campus news.</div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 flex flex-col items-start shadow-sm">
            <div className="text-blue-600 text-2xl mb-2">💬</div>
            <div className="font-semibold text-gray-900 mb-1">Feedback</div>
            <div className="text-gray-500 text-sm">Share your feedback with the institute.</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-gray-400 text-sm border-t bg-white">
        &copy; {new Date().getFullYear()} Rajiv Gandhi Institute of Petroleum Technology
      </footer>
    </div>
  );
}
