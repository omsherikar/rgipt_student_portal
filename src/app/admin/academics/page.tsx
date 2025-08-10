"use client";
import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface Course {
  _id: string;
  code: string;
  name: string;
  semester: string;
  credits: number;
  department: string;
}

interface Result {
  _id: string;
  userId: string;
  semester: string;
  spi: number;
  cpi: number;
  pdfUrl?: string;
}

interface Student {
  _id: string;
  name: string;
  email: string;
  department: string;
}

const DEPARTMENTS = [
  "Computer Science",
  "Chemical Engineering",
  "Petroleum Engineering",
  "Mathematics",
  "Physics",
  "Chemistry",
  // Add more as needed
];

const AdminAcademicsPage = () => {
  // Courses state and handlers
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ code: "", name: "", semester: "", credits: 0, department: "" });
  const [addError, setAddError] = useState<string | null>(null);
  const [addLoading, setAddLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<{ _id: string; code: string; name: string; semester: string; credits: number; department: string }>({ _id: "", code: "", name: "", semester: "", credits: 0, department: "" });
  const [editError, setEditError] = useState<string | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All Departments');

  // Results/Grades state and handlers
  const [results, setResults] = useState<Result[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [resultsLoading, setResultsLoading] = useState(true);
  const [resultsError, setResultsError] = useState<string | null>(null);
  const [showAddResultModal, setShowAddResultModal] = useState(false);
  const [addResultForm, setAddResultForm] = useState({ userId: '', semester: '', cpi: 0, pdfUrl: '', spi: 0 });
  const [addResultError, setAddResultError] = useState<string | null>(null);
  const [addResultLoading, setAddResultLoading] = useState(false);
  const [showEditResultModal, setShowEditResultModal] = useState(false);
  const [editResultForm, setEditResultForm] = useState<{ _id: string; userId: string; semester: string; cpi: number; pdfUrl?: string; spi: number }>({ _id: '', userId: '', semester: '', cpi: 0, pdfUrl: '', spi: 0 });
  const [editResultError, setEditResultError] = useState<string | null>(null);
  const [editResultLoading, setEditResultLoading] = useState(false);
  const [deleteResultLoadingId, setDeleteResultLoadingId] = useState<string | null>(null);
  const [showEditGradesModal, setShowEditGradesModal] = useState(false);
  const [editGradesStudent, setEditGradesStudent] = useState<Student | null>(null);
  const [editGradesSemester, setEditGradesSemester] = useState<string>("");
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [gradesLoading, setGradesLoading] = useState(false);
  const [gradesError, setGradesError] = useState<string | null>(null);
  const [editGradesCourses, setEditGradesCourses] = useState<any[]>([]);
  const [editGradesCourseGrades, setEditGradesCourseGrades] = useState<Record<string, string>>({});

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/courses");
      if (!res.ok) throw new Error("Failed to fetch courses");
      const data = await res.json();
      setCourses(data.courses || []);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const fetchResults = async () => {
    setResultsLoading(true);
    setResultsError(null);
    try {
      const res = await fetch("/api/admin/results");
      if (!res.ok) throw new Error("Failed to fetch results");
      const data = await res.json();
      setResults(data.results || []);
    } catch (err: any) {
      setResultsError(err.message || "Unknown error");
    } finally {
      setResultsLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await fetch("/api/admin/students");
      if (!res.ok) throw new Error("Failed to fetch students");
      const data = await res.json();
      setStudents(data.students || []);
    } catch {}
  };

  useEffect(() => {
    fetchCourses();
    fetchResults();
    fetchStudents();
  }, []);

  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError(null);
    try {
      const res = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...addForm, credits: Number(addForm.credits) }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add course");
      }
      setShowAddModal(false);
      setAddForm({ code: "", name: "", semester: "", credits: 0, department: "" });
      fetchCourses();
    } catch (err: any) {
      setAddError(err.message || "Unknown error");
    } finally {
      setAddLoading(false);
    }
  };

  const handleEditClick = (course: Course) => {
    setEditForm({ ...course });
    setShowEditModal(true);
    setEditError(null);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError(null);
    try {
      const res = await fetch("/api/admin/courses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editForm, credits: Number(editForm.credits) }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update course");
      }
      setShowEditModal(false);
      fetchCourses();
    } catch (err: any) {
      setEditError(err.message || "Unknown error");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (_id: string) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    setDeleteLoadingId(_id);
    try {
      const res = await fetch("/api/admin/courses", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete course");
      }
      fetchCourses();
    } catch (err) {
      alert("Error deleting course.");
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const handleAddResultChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAddResultForm({ ...addResultForm, [e.target.name]: e.target.value });
  };

  const handleAddResultSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddResultLoading(true);
    setAddResultError(null);
    try {
      const res = await fetch("/api/admin/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...addResultForm, cpi: Number(addResultForm.cpi) }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add result");
      }
      setShowAddResultModal(false);
      setAddResultForm({ userId: '', semester: '', cpi: 0, pdfUrl: '', spi: 0 });
      fetchResults();
    } catch (err: any) {
      setAddResultError(err.message || "Unknown error");
    } finally {
      setAddResultLoading(false);
    }
  };

  const handleEditResultClick = (result: Result) => {
    setEditResultForm({ ...result });
    setShowEditResultModal(true);
    setEditResultError(null);
  };

  const handleEditResultChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditResultForm({ ...editResultForm, [e.target.name]: e.target.value });
  };

  const handleEditResultSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditResultLoading(true);
    setEditResultError(null);
    try {
      const res = await fetch("/api/admin/results", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editResultForm, cpi: Number(editResultForm.cpi) }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update result");
      }
      setShowEditResultModal(false);
      fetchResults();
    } catch (err: any) {
      setEditResultError(err.message || "Unknown error");
    } finally {
      setEditResultLoading(false);
    }
  };

  const handleDeleteResult = async (_id: string) => {
    if (!window.confirm("Are you sure you want to delete this result?")) return;
    setDeleteResultLoadingId(_id);
    try {
      const res = await fetch("/api/admin/results", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete result");
      }
      fetchResults();
    } catch {
      alert("Error deleting result.");
    } finally {
      setDeleteResultLoadingId(null);
    }
  };

  const handleEditGradesClick = (result: Result) => {
    const student = students.find(s => s._id === result.userId);
    setEditGradesStudent(student || null);
    setEditGradesSemester(result.semester);
    setShowEditGradesModal(true);
    setEditGradesCourses([]);
    setEditGradesCourseGrades({});
    setGradesError(null);
    setGradesLoading(true);
    const department = student?.department || "";
    fetch(`/api/admin/courses?department=${encodeURIComponent(department)}&semester=${result.semester}`)
      .then(res => res.json())
      .then(data => {
        setEditGradesCourses(data.courses || []);
        // Optionally, fetch existing enrollments to prefill grades
        fetch(`/api/admin/enrollments?userId=${result.userId}&semester=${result.semester}`)
          .then(res2 => res2.json())
          .then(data2 => {
            const grades: Record<string, string> = {};
            (data2.enrollments || []).forEach((e: any) => {
              if (e.courseId && e.grade) grades[e.courseId._id] = e.grade;
            });
            setEditGradesCourseGrades(grades);
            setGradesLoading(false);
          })
          .catch(() => {
            setGradesLoading(false);
          });
      })
      .catch(() => {
        setGradesError("Failed to fetch courses.");
        setGradesLoading(false);
      });
  };

  const handleCourseGradeChange = (courseId: string, grade: string) => {
    setEditGradesCourseGrades(prev => ({ ...prev, [courseId]: grade }));
  };

  const handleSaveGrades = async () => {
    setGradesLoading(true);
    setGradesError(null);
    try {
      // Save grades for all courses (create or update enrollments)
      const updates = editGradesCourses.map(course => ({
        userId: editGradesStudent?._id,
        courseId: course._id,
        semester: editGradesSemester,
        grade: editGradesCourseGrades[course._id] || ""
      }));
      const res = await fetch("/api/admin/enrollments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update grades");
      }
      setShowEditGradesModal(false);
      fetchResults();
    } catch (err: any) {
      setGradesError(err.message || "Unknown error");
    } finally {
      setGradesLoading(false);
    }
  };

  const handleExportPDF = async (result: Result) => {
    const student = students.find(s => s._id === result.userId);
    // Gather enrollments for this student and semester
    const enrollmentsRes = await fetch(`/api/admin/enrollments?userId=${result.userId}&semester=${result.semester}`);
    const enrollmentsData = await enrollmentsRes.json();
    const enrollments = enrollmentsData.enrollments || [];
    // Gather course details with alternating row colors
    const courseRows = enrollments.map((e: any, idx: number) =>
      `<tr style='background:${idx % 2 === 0 ? "#f8fafc" : "#e9f0fb"};color:#111;'>
        <td style='padding:8px 14px;border:1px solid #e0e7ef;text-align:left;'>${e.courseId?.code || ""}</td>
        <td style='padding:8px 14px;border:1px solid #e0e7ef;text-align:left;'>${e.courseId?.name || ""}</td>
        <td style='padding:8px 14px;border:1px solid #e0e7ef;text-align:center;'>${e.courseId?.credits || ""}</td>
        <td style='padding:8px 14px;border:1px solid #e0e7ef;text-align:center;'>${e.grade || ""}</td>
      </tr>`
    ).join("");
    // Build HTML for PDF
    const html = `
      <div id='pdf-content' style='font-family:Segoe UI,Arial,sans-serif;max-width:650px;margin:auto;background:#fff;border-radius:18px;box-shadow:0 2px 16px rgba(37,99,235,0.10);padding-bottom:24px;color:#111;'>
        <div style='background:#1746a2;padding:28px 0 18px 0;border-top-left-radius:18px;border-top-right-radius:18px;text-align:center;box-shadow:0 2px 8px rgba(23,70,162,0.08);'>
          <img src='/rgipt-logo.png' style='height:60px;margin-bottom:10px;box-shadow:0 2px 8px #fff2;' />
          <h2 style='margin:0;color:#fff;font-size:2rem;letter-spacing:1px;'>Rajiv Gandhi Institute of Petroleum Technology</h2>
          <div style='font-size:17px;color:#e0e7ef;margin-top:4px;'>Official Grade Sheet</div>
        </div>
        <div style='margin:28px 0 18px 0;padding:18px 28px;background:#f4f7fb;border-radius:10px;border:1.5px solid #e0e7ef;display:flex;flex-wrap:wrap;gap:32px 48px;font-size:16px;color:#111;'>
          <div style='min-width:180px;'><span style='color:#1746a2;font-weight:600;'>Name:</span> <span style='color:#111;'>${student?.name || "-"}</span></div>
          <div style='min-width:180px;'><span style='color:#1746a2;font-weight:600;'>Roll Number:</span> <span style='color:#111;'>${student?.email?.split("@")[0] || "-"}</span></div>
          <div style='min-width:180px;'><span style='color:#1746a2;font-weight:600;'>Department:</span> <span style='color:#111;'>${student?.department || "-"}</span></div>
          <div style='min-width:120px;'><span style='color:#1746a2;font-weight:600;'>Semester:</span> <span style='color:#111;'>${result.semester}</span></div>
        </div>
        <table style='width:92%;margin:0 auto 22px auto;border-collapse:collapse;font-size:15px;color:#111;'>
          <thead>
            <tr style='background:#2563eb;color:#fff;'>
              <th style='padding:10px 14px;border:1px solid #e0e7ef;text-align:left;'>Course Code</th>
              <th style='padding:10px 14px;border:1px solid #e0e7ef;text-align:left;'>Course Name</th>
              <th style='padding:10px 14px;border:1px solid #e0e7ef;text-align:center;'>Credits</th>
              <th style='padding:10px 14px;border:1px solid #e0e7ef;text-align:center;'>Grade</th>
            </tr>
          </thead>
          <tbody>${courseRows}</tbody>
        </table>
        <div style='width:92%;margin:0 auto 0 auto;'>
          <div style='background:#e9f0fb;border-radius:10px;padding:18px 0 14px 0;display:flex;justify-content:center;gap:48px;font-size:18px;font-weight:600;box-shadow:0 1px 4px #2563eb11;'>
            <span style='color:#1746a2;'>SPI: <span style='color:#111;'>${result.spi !== undefined ? result.spi.toFixed(2) : "-"}</span></span>
            <span style='color:#1746a2;'>CPI: <span style='color:#111;'>${result.cpi !== undefined ? result.cpi.toFixed(2) : "-"}</span></span>
          </div>
        </div>
        <div style='margin-top:38px;text-align:right;font-size:13px;color:#888;padding-right:32px;'>
          Generated by RGIPT Student Portal &nbsp;|&nbsp; ${new Date().toLocaleDateString()}
        </div>
      </div>
    `;
    // Create a hidden container for rendering
    const container = document.createElement("div");
    container.innerHTML = html;
    container.style.position = "fixed";
    container.style.left = "-9999px";
    document.body.appendChild(container);
    const pdfContent = container.querySelector("#pdf-content") as HTMLElement;
    // Wait for logo image to load
    const img = pdfContent.querySelector("img");
    if (img && !img.complete) await new Promise(res => { img.onload = res; });
    // Render to canvas and PDF
    const canvas = await html2canvas(pdfContent, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 60;
    const imgHeight = canvas.height * imgWidth / canvas.width;
    pdf.addImage(imgData, "PNG", 30, 30, imgWidth, imgHeight);
    // Get PDF as base64
    const pdfBase64 = pdf.output("dataurlstring").split(",")[1];
    // Upload PDF to server
    const filename = `${student?.name?.replace(/\s+/g, "_") || "result"}_semester${result.semester}.pdf`;
    const uploadRes = await fetch("/api/admin/results/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pdfBase64, filename })
    });
    const uploadData = await uploadRes.json();
    if (uploadRes.ok && uploadData.url) {
      // Update the result's pdfUrl
      await fetch("/api/admin/results", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: result._id, userId: result.userId, semester: result.semester, cpi: result.cpi, spi: result.spi, pdfUrl: uploadData.url })
      });
      // Refresh results
      fetchResults();
    } else {
      alert("Failed to upload PDF");
    }
    document.body.removeChild(container);
  };

  return (
    <div style={{ background: "#f4f6fb", minHeight: "100vh", padding: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: "100%", maxWidth: 900, marginTop: 32, background: "#fff", borderRadius: 20, boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1.5px solid #e5e7eb", padding: 32, marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#22223b", margin: 0 }}>Courses Management</h1>
          <button
            style={{
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "10px 22px",
              fontWeight: 600,
              fontSize: 16,
              cursor: "pointer",
              boxShadow: "0 1px 4px rgba(37,99,235,0.08)",
              transition: "background 0.15s",
            }}
            onClick={() => setShowAddModal(true)}
            onMouseOver={e => (e.currentTarget.style.background = "#1746a2")}
            onMouseOut={e => (e.currentTarget.style.background = "#2563eb")}
          >
            + Add Course
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
          <label style={{ fontWeight: 600, color: '#22223b', marginRight: 12 }}>Department:</label>
          <select
            value={selectedDepartment}
            onChange={e => setSelectedDepartment(e.target.value)}
            style={{ padding: 8, borderRadius: 6, border: '1.5px solid #e5e7eb', minWidth: 180 }}
          >
            <option value="All Departments">All Departments</option>
            {DEPARTMENTS.map(dep => <option key={dep} value={dep}>{dep}</option>)}
          </select>
        </div>
        {showAddModal && (
          <div style={{
            position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
            background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
          }}>
            <div style={{ background: "#fff", padding: 32, borderRadius: 16, minWidth: 340, boxShadow: "0 2px 16px rgba(0,0,0,0.10)", border: "2px solid #2563eb" }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#2563eb", marginBottom: 18 }}>Add Course</h2>
              <form onSubmit={handleAddSubmit}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontWeight: 600, color: "#22223b" }}>Code:<br />
                    <input name="code" value={addForm.code || ""} onChange={handleAddChange} required style={{ width: "100%", padding: 8, borderRadius: 6, border: "1.5px solid #e5e7eb", marginTop: 4 }} />
                  </label>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontWeight: 600, color: "#22223b" }}>Name:<br />
                    <input name="name" value={addForm.name || ""} onChange={handleAddChange} required style={{ width: "100%", padding: 8, borderRadius: 6, border: "1.5px solid #e5e7eb", marginTop: 4 }} />
                  </label>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontWeight: 600, color: "#22223b" }}>Semester:<br />
                    <input name="semester" value={addForm.semester || ""} onChange={handleAddChange} required style={{ width: "100%", padding: 8, borderRadius: 6, border: "1.5px solid #e5e7eb", marginTop: 4 }} />
                  </label>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontWeight: 600, color: "#22223b" }}>Credits:<br />
                    <input name="credits" type="number" value={addForm.credits} onChange={handleAddChange} required min={0} style={{ width: "100%", padding: 8, borderRadius: 6, border: "1.5px solid #e5e7eb", marginTop: 4 }} />
                  </label>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontWeight: 600, color: "#22223b" }}>Department:<br />
                    <select name="department" value={addForm.department} onChange={handleAddChange} required style={{ width: "100%", padding: 8, borderRadius: 6, border: "1.5px solid #e5e7eb", marginTop: 4 }}>
                      <option value="">Select department</option>
                      {DEPARTMENTS.map(dep => <option key={dep} value={dep}>{dep}</option>)}
                    </select>
                  </label>
                </div>
                {addError && <div style={{ color: "red", marginBottom: 8 }}>{addError}</div>}
                <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                  <button type="submit" disabled={addLoading} style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", fontWeight: 600, fontSize: 15, cursor: "pointer", transition: "background 0.15s" }}>{addLoading ? "Adding..." : "Add"}</button>
                  <button type="button" onClick={() => setShowAddModal(false)} disabled={addLoading} style={{ background: "#e5e7eb", color: "#22223b", border: "none", borderRadius: 8, padding: "8px 20px", fontWeight: 600, fontSize: 15, cursor: "pointer" }}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
        {showEditModal && (
          <div style={{
            position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
            background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
          }}>
            <div style={{ background: "#fff", padding: 32, borderRadius: 16, minWidth: 340, boxShadow: "0 2px 16px rgba(0,0,0,0.10)", border: "2px solid #2563eb" }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#2563eb", marginBottom: 18 }}>Edit Course</h2>
              <form onSubmit={handleEditSubmit}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontWeight: 600, color: "#22223b" }}>Code:<br />
                    <input name="code" value={editForm.code || ""} onChange={handleEditChange} required style={{ width: "100%", padding: 8, borderRadius: 6, border: "1.5px solid #e5e7eb", marginTop: 4 }} />
                  </label>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontWeight: 600, color: "#22223b" }}>Name:<br />
                    <input name="name" value={editForm.name || ""} onChange={handleEditChange} required style={{ width: "100%", padding: 8, borderRadius: 6, border: "1.5px solid #e5e7eb", marginTop: 4 }} />
                  </label>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontWeight: 600, color: "#22223b" }}>Semester:<br />
                    <input name="semester" value={editForm.semester || ""} onChange={handleEditChange} required style={{ width: "100%", padding: 8, borderRadius: 6, border: "1.5px solid #e5e7eb", marginTop: 4 }} />
                  </label>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontWeight: 600, color: "#22223b" }}>Credits:<br />
                    <input name="credits" type="number" value={editForm.credits} onChange={handleEditChange} required min={0} style={{ width: "100%", padding: 8, borderRadius: 6, border: "1.5px solid #e5e7eb", marginTop: 4 }} />
                  </label>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontWeight: 600, color: "#22223b" }}>Department:<br />
                    <select name="department" value={editForm.department} onChange={handleEditChange} required style={{ width: "100%", padding: 8, borderRadius: 6, border: "1.5px solid #e5e7eb", marginTop: 4 }}>
                      <option value="">Select department</option>
                      {DEPARTMENTS.map(dep => <option key={dep} value={dep}>{dep}</option>)}
                    </select>
                  </label>
                </div>
                {editError && <div style={{ color: "red", marginBottom: 8 }}>{editError}</div>}
                <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                  <button type="submit" disabled={editLoading} style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", fontWeight: 600, fontSize: 15, cursor: "pointer", transition: "background 0.15s" }}>{editLoading ? "Saving..." : "Save"}</button>
                  <button type="button" onClick={() => setShowEditModal(false)} disabled={editLoading} style={{ background: "#e5e7eb", color: "#22223b", border: "none", borderRadius: 8, padding: "8px 20px", fontWeight: 600, fontSize: 15, cursor: "pointer" }}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
        {loading ? (
          <p style={{ color: "#2563eb", fontWeight: 600 }}>Loading...</p>
        ) : error ? (
          <p style={{ color: "red", fontWeight: 600 }}>{error}</p>
        ) : (
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, background: "#fff", borderRadius: 12, boxShadow: "0 1px 4px rgba(37,99,235,0.04)" }}>
              <thead>
                <tr style={{ background: "#f0f4ff" }}>
                  <th style={{ padding: "12px 8px", fontWeight: 700, color: "#2563eb", fontSize: 15, borderTopLeftRadius: 12 }}>Code</th>
                  <th style={{ padding: "12px 8px", fontWeight: 700, color: "#2563eb", fontSize: 15 }}>Name</th>
                  <th style={{ padding: "12px 8px", fontWeight: 700, color: "#2563eb", fontSize: 15 }}>Semester</th>
                  <th style={{ padding: "12px 8px", fontWeight: 700, color: "#2563eb", fontSize: 15 }}>Credits</th>
                  <th style={{ padding: "12px 8px", fontWeight: 700, color: "#2563eb", fontSize: 15 }}>Department</th>
                  <th style={{ padding: "12px 8px", fontWeight: 700, color: "#2563eb", fontSize: 15, borderTopRightRadius: 12 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses
                  .filter(course => selectedDepartment === 'All Departments' || course.department === selectedDepartment)
                  .map((course) => (
                    <tr key={course._id} style={{ borderBottom: "1.5px solid #e5e7eb" }}>
                      <td style={{ padding: "10px 8px", color: "#22223b", fontWeight: 500 }}>{course.code}</td>
                      <td style={{ padding: "10px 8px", color: "#22223b", fontWeight: 500 }}>{course.name}</td>
                      <td style={{ padding: "10px 8px", color: "#22223b", fontWeight: 500 }}>{course.semester}</td>
                      <td style={{ padding: "10px 8px", color: "#22223b", fontWeight: 500 }}>{course.credits}</td>
                      <td style={{ padding: "10px 8px", color: "#22223b", fontWeight: 500 }}>{course.department}</td>
                      <td style={{ padding: "10px 8px" }}>
                        <button
                          style={{ background: "#e5e7eb", color: "#2563eb", border: "none", borderRadius: 6, padding: "6px 16px", fontWeight: 600, cursor: "pointer", marginRight: 8 }}
                          onClick={() => handleEditClick(course)}
                        >Edit</button>
                        <button
                          style={{ background: "#ffeded", color: "#d90429", border: "none", borderRadius: 6, padding: "6px 16px", fontWeight: 600, cursor: "pointer" }}
                          onClick={() => handleDelete(course._id)}
                          disabled={deleteLoadingId === course._id}
                        >{deleteLoadingId === course._id ? "Deleting..." : "Delete"}</button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Results/Grades Management Section Placeholder */}
      <div style={{ width: "100%", maxWidth: 900, background: "#fff", borderRadius: 20, boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1.5px solid #e5e7eb", padding: 32, marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#22223b", margin: 0 }}>Results / Grades Management</h1>
          <button
            style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, padding: "10px 22px", fontWeight: 600, fontSize: 16, cursor: "pointer", boxShadow: "0 1px 4px rgba(37,99,235,0.08)", transition: "background 0.15s" }}
            onClick={() => setShowAddResultModal(true)}
            onMouseOver={e => (e.currentTarget.style.background = "#1746a2")}
            onMouseOut={e => (e.currentTarget.style.background = "#2563eb")}
          >
            + Add Result
          </button>
        </div>
        {showAddResultModal && (
          <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
            <div style={{ background: "#fff", padding: 32, borderRadius: 16, minWidth: 340, boxShadow: "0 2px 16px rgba(0,0,0,0.10)", border: "2px solid #2563eb" }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#2563eb", marginBottom: 18 }}>Add Result</h2>
              <form onSubmit={handleAddResultSubmit}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontWeight: 600, color: "#22223b" }}>Student:<br />
                    <select name="userId" value={addResultForm.userId} onChange={handleAddResultChange} required style={{ width: "100%", padding: 8, borderRadius: 6, border: "1.5px solid #e5e7eb", marginTop: 4 }}>
                      <option value="">Select student</option>
                      {students.map(s => <option key={s._id} value={s._id}>{s.name} ({s.email})</option>)}
                    </select>
                  </label>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontWeight: 600, color: "#22223b" }}>Semester:<br />
                    <input name="semester" value={addResultForm.semester} onChange={handleAddResultChange} required style={{ width: "100%", padding: 8, borderRadius: 6, border: "1.5px solid #e5e7eb", marginTop: 4 }} />
                  </label>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontWeight: 600, color: "#22223b" }}>CPI:<br />
                    <input name="cpi" type="number" value={addResultForm.cpi} onChange={handleAddResultChange} required min={0} step={0.01} style={{ width: "100%", padding: 8, borderRadius: 6, border: "1.5px solid #e5e7eb", marginTop: 4 }} />
                  </label>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontWeight: 600, color: "#22223b" }}>SPI:<br />
                    <input name="spi" type="number" value={addResultForm.spi || 0} onChange={handleAddResultChange} required min={0} step={0.01} style={{ width: "100%", padding: 8, borderRadius: 6, border: "1.5px solid #e5e7eb", marginTop: 4 }} />
                  </label>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontWeight: 600, color: "#22223b" }}>Marksheet PDF URL:<br />
                    <input name="pdfUrl" value={addResultForm.pdfUrl} onChange={handleAddResultChange} style={{ width: "100%", padding: 8, borderRadius: 6, border: "1.5px solid #e5e7eb", marginTop: 4 }} />
                  </label>
                </div>
                {addResultError && <div style={{ color: "red", marginBottom: 8 }}>{addResultError}</div>}
                <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                  <button type="submit" disabled={addResultLoading} style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", fontWeight: 600, fontSize: 15, cursor: "pointer", transition: "background 0.15s" }}>{addResultLoading ? "Adding..." : "Add"}</button>
                  <button type="button" onClick={() => setShowAddResultModal(false)} disabled={addResultLoading} style={{ background: "#e5e7eb", color: "#22223b", border: "none", borderRadius: 8, padding: "8px 20px", fontWeight: 600, fontSize: 15, cursor: "pointer" }}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
        {showEditResultModal && (
          <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
            <div style={{ background: "#fff", padding: 32, borderRadius: 16, minWidth: 340, boxShadow: "0 2px 16px rgba(0,0,0,0.10)", border: "2px solid #2563eb" }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#2563eb", marginBottom: 18 }}>Edit Result</h2>
              <form onSubmit={handleEditResultSubmit}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontWeight: 600, color: "#22223b" }}>Student:<br />
                    <select name="userId" value={editResultForm.userId} onChange={handleEditResultChange} required style={{ width: "100%", padding: 8, borderRadius: 6, border: "1.5px solid #e5e7eb", marginTop: 4 }}>
                      <option value="">Select student</option>
                      {students.map(s => <option key={s._id} value={s._id}>{s.name} ({s.email})</option>)}
                    </select>
                  </label>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontWeight: 600, color: "#22223b" }}>Semester:<br />
                    <input name="semester" value={editResultForm.semester} onChange={handleEditResultChange} required style={{ width: "100%", padding: 8, borderRadius: 6, border: "1.5px solid #e5e7eb", marginTop: 4 }} />
                  </label>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontWeight: 600, color: "#22223b" }}>CPI:<br />
                    <input name="cpi" type="number" value={editResultForm.cpi} onChange={handleEditResultChange} required min={0} step={0.01} style={{ width: "100%", padding: 8, borderRadius: 6, border: "1.5px solid #e5e7eb", marginTop: 4 }} />
                  </label>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontWeight: 600, color: "#22223b" }}>SPI:<br />
                    <input name="spi" type="number" value={editResultForm.spi || 0} onChange={handleEditResultChange} required min={0} step={0.01} style={{ width: "100%", padding: 8, borderRadius: 6, border: "1.5px solid #e5e7eb", marginTop: 4 }} />
                  </label>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontWeight: 600, color: "#22223b" }}>Marksheet PDF URL:<br />
                    <input name="pdfUrl" value={editResultForm.pdfUrl || ''} onChange={handleEditResultChange} style={{ width: "100%", padding: 8, borderRadius: 6, border: "1.5px solid #e5e7eb", marginTop: 4 }} />
                  </label>
                </div>
                {editResultError && <div style={{ color: "red", marginBottom: 8 }}>{editResultError}</div>}
                <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                  <button type="submit" disabled={editResultLoading} style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", fontWeight: 600, fontSize: 15, cursor: "pointer", transition: "background 0.15s" }}>{editResultLoading ? "Saving..." : "Save"}</button>
                  <button type="button" onClick={() => setShowEditResultModal(false)} disabled={editResultLoading} style={{ background: "#e5e7eb", color: "#22223b", border: "none", borderRadius: 8, padding: "8px 20px", fontWeight: 600, fontSize: 15, cursor: "pointer" }}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
        {showEditGradesModal && (
          <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
            <div style={{ background: "#fff", padding: 32, borderRadius: 16, minWidth: 400, boxShadow: "0 2px 16px rgba(0,0,0,0.10)", border: "2px solid #2563eb" }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#2563eb", marginBottom: 18 }}>Edit Grades</h2>
              <div style={{ marginBottom: 12 }}>
                <strong>Student:</strong> {editGradesStudent ? `${editGradesStudent.name} (${editGradesStudent.email})` : ""}<br />
                <strong>Semester:</strong> {editGradesSemester}
              </div>
              {gradesLoading ? (
                <p style={{ color: "#2563eb" }}>Loading courses...</p>
              ) : gradesError ? (
                <p style={{ color: "red" }}>{gradesError}</p>
              ) : (
                editGradesCourses.length > 0 && (
                  <form onSubmit={e => { e.preventDefault(); handleSaveGrades(); }}>
                    <table style={{ width: "100%", marginBottom: 16 }}>
                      <thead>
                        <tr>
                          <th style={{ textAlign: "left", padding: 6 }}>Course</th>
                          <th style={{ textAlign: "left", padding: 6 }}>Grade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {editGradesCourses.map(course => (
                          <tr key={course._id}>
                            <td style={{ padding: 6 }}>{course.name || course.code}</td>
                            <td style={{ padding: 6 }}>
                              <input
                                value={editGradesCourseGrades[course._id] || ""}
                                onChange={ev => handleCourseGradeChange(course._id, ev.target.value)}
                                style={{ width: 80, padding: 4, borderRadius: 4, border: '1.5px solid #e5e7eb' }}
                                required
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                      <button type="submit" disabled={gradesLoading} style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", fontWeight: 600, fontSize: 15, cursor: "pointer", transition: "background 0.15s" }}>{gradesLoading ? "Saving..." : "Save"}</button>
                      <button type="button" onClick={() => setShowEditGradesModal(false)} disabled={gradesLoading} style={{ background: "#e5e7eb", color: "#22223b", border: "none", borderRadius: 8, padding: "8px 20px", fontWeight: 600, fontSize: 15, cursor: "pointer" }}>Cancel</button>
                    </div>
                  </form>
                )
              )}
            </div>
          </div>
        )}
        {resultsLoading ? (
          <p style={{ color: "#2563eb", fontWeight: 600 }}>Loading...</p>
        ) : resultsError ? (
          <p style={{ color: "red", fontWeight: 600 }}>{resultsError}</p>
        ) : (
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, background: "#fff", borderRadius: 12, boxShadow: "0 1px 4px rgba(37,99,235,0.04)" }}>
              <thead>
                <tr style={{ background: "#f0f4ff" }}>
                  <th style={{ padding: "12px 8px", fontWeight: 700, color: "#2563eb", fontSize: 15, borderTopLeftRadius: 12 }}>Student</th>
                  <th style={{ padding: "12px 8px", fontWeight: 700, color: "#2563eb", fontSize: 15 }}>Semester</th>
                  <th style={{ padding: "12px 8px", fontWeight: 700, color: "#2563eb", fontSize: 15 }}>CPI</th>
                  <th style={{ padding: "12px 8px", fontWeight: 700, color: "#2563eb", fontSize: 15 }}>SPI</th>
                  <th style={{ padding: "12px 8px", fontWeight: 700, color: "#2563eb", fontSize: 15 }}>Marksheet</th>
                  <th style={{ padding: "12px 8px", fontWeight: 700, color: "#2563eb", fontSize: 15, borderTopRightRadius: 12 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => {
                  const student = students.find(s => s._id === result.userId);
                  return (
                    <tr key={result._id} style={{ borderBottom: "1.5px solid #e5e7eb" }}>
                      <td style={{ padding: "10px 8px", color: "#22223b", fontWeight: 500 }}>{student ? `${student.name} (${student.email})` : result.userId}</td>
                      <td style={{ padding: "10px 8px", color: "#22223b", fontWeight: 500 }}>{result.semester}</td>
                      <td style={{ padding: "10px 8px", color: "#22223b", fontWeight: 500 }}>{result.cpi !== undefined ? result.cpi.toFixed(2) : ''}</td>
                      <td style={{ padding: "10px 8px", color: "#22223b", fontWeight: 500 }}>{result.spi !== undefined ? result.spi.toFixed(2) : ''}</td>
                      <td style={{ padding: "10px 8px", color: "#22223b", fontWeight: 500 }}>
                        {result.pdfUrl ? (
                          <a href={result.pdfUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb", textDecoration: "underline" }}>Download PDF</a>
                        ) : null}
                        <button
                          style={{ display: "block", marginTop: 8, background: "#2563eb", color: "#fff", border: "none", borderRadius: 6, padding: "6px 16px", fontWeight: 600, cursor: "pointer" }}
                          onClick={() => handleExportPDF(result)}
                        >
                          Export as PDF
                        </button>
                      </td>
                      <td style={{ padding: "10px 8px" }}>
                        <button
                          style={{ background: "#e5e7eb", color: "#2563eb", border: "none", borderRadius: 6, padding: "6px 16px", fontWeight: 600, cursor: "pointer", marginRight: 8 }}
                          onClick={() => handleEditResultClick(result)}
                        >Edit</button>
                        <button
                          style={{ background: "#ffeded", color: "#d90429", border: "none", borderRadius: 6, padding: "6px 16px", fontWeight: 600, cursor: "pointer" }}
                          onClick={() => handleDeleteResult(result._id)}
                          disabled={deleteResultLoadingId === result._id}
                        >{deleteResultLoadingId === result._id ? "Deleting..." : "Delete"}</button>
                        <button
                          style={{ background: "#e5e7eb", color: "#2563eb", border: "none", borderRadius: 6, padding: "6px 16px", fontWeight: 600, cursor: "pointer", marginLeft: 8 }}
                          onClick={() => handleEditGradesClick(result)}
                        >
                          Edit Grades
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAcademicsPage; 