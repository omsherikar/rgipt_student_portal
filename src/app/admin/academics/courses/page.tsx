Th"use client";
import React, { useEffect, useState } from "react";

interface Course {
  _id: string;
  code: string;
  name: string;
  semester: string;
  credits: number;
}

const AdminCoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ code: "", name: "", semester: "", credits: 0 });
  const [addError, setAddError] = useState<string | null>(null);
  const [addLoading, setAddLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<{ _id: string; code: string; name: string; semester: string; credits: number }>({ _id: "", code: "", name: "", semester: "", credits: 0 });
  const [editError, setEditError] = useState<string | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

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

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setAddForm({ code: "", name: "", semester: "", credits: 0 });
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

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <div style={{ background: "#f4f6fb", minHeight: "100vh", padding: 0, display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
      <div style={{
        width: "100%",
        maxWidth: 900,
        marginTop: 32,
        background: "#fff",
        borderRadius: 20,
        boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
        border: "1.5px solid #e5e7eb",
        padding: 32,
      }}>
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
                  <th style={{ padding: "12px 8px", fontWeight: 700, color: "#2563eb", fontSize: 15, borderTopRightRadius: 12 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course._id} style={{ borderBottom: "1.5px solid #e5e7eb" }}>
                    <td style={{ padding: "10px 8px", color: "#22223b", fontWeight: 500 }}>{course.code}</td>
                    <td style={{ padding: "10px 8px", color: "#22223b", fontWeight: 500 }}>{course.name}</td>
                    <td style={{ padding: "10px 8px", color: "#22223b", fontWeight: 500 }}>{course.semester}</td>
                    <td style={{ padding: "10px 8px", color: "#22223b", fontWeight: 500 }}>{course.credits}</td>
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
    </div>
  );
};

export default AdminCoursesPage; 