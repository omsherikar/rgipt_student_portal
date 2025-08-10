"use client";
import { useEffect, useState } from "react";

interface Course {
  _id: string;
  code: string;
  name: string;
}

interface CourseFeedback {
  _id: string;
  courseId: string;
  feedback: string;
  createdAt: string;
}

interface GeneralFeedback {
  _id: string;
  type: string;
  message: string;
  createdAt: string;
}

export default function FeedbackPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseFeedbacks, setCourseFeedbacks] = useState<CourseFeedback[]>([]);
  const [generalFeedbacks, setGeneralFeedbacks] = useState<GeneralFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [courseFeedback, setCourseFeedback] = useState<{ [key: string]: string }>({});
  const [generalType, setGeneralType] = useState("complaint");
  const [generalMessage, setGeneralMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Get enrolled courses
      const acadRes = await fetch("/api/academics");
      if (!acadRes.ok) throw new Error("Failed to fetch courses");
      const acadJson = await acadRes.json();
      setCourses(acadJson.enrollments.map((e: any) => e.courseId));
      // Get course feedbacks
      const cfRes = await fetch("/api/feedback/course");
      const cfJson = await cfRes.json();
      setCourseFeedbacks(cfJson.feedbacks || []);
      // Get general feedbacks
      const gfRes = await fetch("/api/feedback/general");
      const gfJson = await gfRes.json();
      setGeneralFeedbacks(gfJson.feedbacks || []);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCourseFeedback = async (courseId: string) => {
    setSubmitting(true);
    setSuccess("");
    setError("");
    try {
      const res = await fetch("/api/feedback/course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, feedback: courseFeedback[courseId] }),
      });
      if (!res.ok) throw new Error("Failed to submit feedback");
      setCourseFeedback({ ...courseFeedback, [courseId]: "" });
      setSuccess("Course feedback submitted!");
      fetchData();
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGeneralFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess("");
    setError("");
    try {
      const res = await fetch("/api/feedback/general", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: generalType, message: generalMessage }),
      });
      if (!res.ok) throw new Error("Failed to submit feedback");
      setGeneralMessage("");
      setSuccess("Feedback submitted!");
      fetchData();
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center py-10" style={{ background: '#f4f6fb' }}>
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 border border-[#e5e7eb]">
        <h1 className="text-2xl font-bold mb-6" style={{ color: '#22223b' }}>Feedback</h1>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <>
            <h2 className="text-lg font-semibold mb-4" style={{ color: '#6c757d' }}>Course Feedback</h2>
            {courses.length ? (
              <ul className="mb-6 space-y-4">
                {courses.map(course => (
                  <li key={course._id} className="border rounded-xl p-4 bg-gray-50" style={{ borderColor: '#e5e7eb' }}>
                    <div className="font-semibold mb-1" style={{ color: '#1d3557' }}>{course.code} - {course.name}</div>
                    <textarea
                      className="w-full border rounded p-2 mb-2"
                      style={{ borderColor: '#e5e7eb', background: '#f8fafc', color: '#22223b' }}
                      rows={2}
                      placeholder="Enter feedback for this course"
                      value={courseFeedback[course._id] || ""}
                      onChange={e => setCourseFeedback({ ...courseFeedback, [course._id]: e.target.value })}
                    />
                    <button
                      className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                      disabled={submitting || !(courseFeedback[course._id] && courseFeedback[course._id].trim())}
                      onClick={() => handleCourseFeedback(course._id)}
                    >
                      Submit Feedback
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mb-6" style={{ color: '#b0b7c3' }}>No enrolled courses found.</div>
            )}
            <h2 className="text-lg font-semibold mb-4" style={{ color: '#6c757d' }}>Complaint / Suggestion Box</h2>
            <form onSubmit={handleGeneralFeedback} className="mb-6 space-y-2">
              <select
                className="border rounded px-2 py-1"
                style={{ borderColor: '#e5e7eb', background: '#f8fafc', color: '#22223b' }}
                value={generalType}
                onChange={e => setGeneralType(e.target.value)}
              >
                <option value="complaint">Complaint</option>
                <option value="suggestion">Suggestion</option>
              </select>
              <textarea
                className="w-full border rounded p-2"
                style={{ borderColor: '#e5e7eb', background: '#f8fafc', color: '#22223b' }}
                rows={2}
                placeholder="Enter your complaint or suggestion"
                value={generalMessage}
                onChange={e => setGeneralMessage(e.target.value)}
                required
              />
              <button
                className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                disabled={submitting || !generalMessage.trim()}
                type="submit"
              >
                Submit
              </button>
            </form>
            <h2 className="text-lg font-semibold mb-4" style={{ color: '#6c757d' }}>Your Previous Feedback</h2>
            <div className="mb-2 font-medium" style={{ color: '#6c757d' }}>Course Feedback</div>
            <ul className="mb-4 space-y-2">
              {courseFeedbacks.length ? courseFeedbacks.map(fb => (
                <li key={fb._id} className="border rounded p-2 text-sm bg-gray-50" style={{ borderColor: '#e5e7eb' }}>
                  <span className="font-semibold" style={{ color: '#1d3557' }}>{fb.courseId}</span>: <span style={{ color: '#22223b' }}>{fb.feedback}</span>
                  <span className="ml-2" style={{ color: '#b0b7c3' }}>({new Date(fb.createdAt).toLocaleString()})</span>
                </li>
              )) : <li style={{ color: '#b0b7c3' }}>No course feedback yet.</li>}
            </ul>
            <div className="mb-2 font-medium" style={{ color: '#6c757d' }}>Complaints / Suggestions</div>
            <ul className="space-y-2">
              {generalFeedbacks.length ? generalFeedbacks.map(fb => (
                <li key={fb._id} className="border rounded p-2 text-sm bg-gray-50" style={{ borderColor: '#e5e7eb' }}>
                  <span className="font-semibold capitalize" style={{ color: '#1d3557' }}>{fb.type}</span>: <span style={{ color: '#22223b' }}>{fb.message}</span>
                  <span className="ml-2" style={{ color: '#b0b7c3' }}>({new Date(fb.createdAt).toLocaleString()})</span>
                </li>
              )) : <li style={{ color: '#b0b7c3' }}>No complaints or suggestions yet.</li>}
            </ul>
          </>
        )}
        {success && <div className="text-green-600 text-center mt-4">{success}</div>}
        {error && <div className="text-red-600 text-center mt-4">{error}</div>}
      </div>
    </main>
  );
} 