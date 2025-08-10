"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Student {
  _id: string;
  name: string;
  email: string;
  rollNumber: string;
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

const AdminStudentsPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', email: '', rollNumber: '', department: '' });
  const [addError, setAddError] = useState<string | null>(null);
  const [addLoading, setAddLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<{ _id: string; name: string; email: string; rollNumber: string; department: string }>({ _id: '', name: '', email: '', rollNumber: '', department: '' });
  const [editError, setEditError] = useState<string | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All Departments');
  const router = useRouter();

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/students');
      if (!res.ok) throw new Error('Failed to fetch students');
      const data = await res.json();
      setStudents(data.students || []);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError(null);
    try {
      const res = await fetch('/api/admin/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add student');
      }
      setShowAddModal(false);
      setAddForm({ name: '', email: '', rollNumber: '', department: '' });
      fetchStudents();
    } catch (err: any) {
      setAddError(err.message || 'Unknown error');
    } finally {
      setAddLoading(false);
    }
  };

  const handleEditClick = (student: Student) => {
    setEditForm({ ...student });
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
      const res = await fetch('/api/admin/students', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update student');
      }
      setShowEditModal(false);
      fetchStudents();
    } catch (err: any) {
      setEditError(err.message || 'Unknown error');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (_id: string) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    setDeleteLoadingId(_id);
    try {
      const res = await fetch('/api/admin/students', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete student');
      }
      fetchStudents();
    } catch (err) {
      alert('Error deleting student.');
    } finally {
      setDeleteLoadingId(null);
    }
  };

  return (
    <div style={{ background: '#f4f6fb', minHeight: '100vh', padding: '0', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
      <div style={{
        width: '100%',
        maxWidth: 900,
        marginTop: 32,
        background: '#fff',
        borderRadius: 20,
        boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
        border: '1.5px solid #e5e7eb',
        padding: 32,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#22223b', margin: 0 }}>Student Management</h1>
          <button
            style={{
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '10px 22px',
              fontWeight: 600,
              fontSize: 16,
              cursor: 'pointer',
              boxShadow: '0 1px 4px rgba(37,99,235,0.08)',
              transition: 'background 0.15s',
            }}
            onClick={() => setShowAddModal(true)}
            onMouseOver={e => (e.currentTarget.style.background = '#1746a2')}
            onMouseOut={e => (e.currentTarget.style.background = '#2563eb')}
          >
            + Add Student
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
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
          }}>
            <div style={{ background: '#fff', padding: 32, borderRadius: 16, minWidth: 340, boxShadow: '0 2px 16px rgba(0,0,0,0.10)', border: '2px solid #2563eb' }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#2563eb', marginBottom: 18 }}>Add Student</h2>
              <form onSubmit={handleAddSubmit}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontWeight: 600, color: '#22223b' }}>Name:<br />
                    <input name="name" value={addForm.name || ''} onChange={handleAddChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1.5px solid #e5e7eb', marginTop: 4 }} />
                  </label>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontWeight: 600, color: '#22223b' }}>Email:<br />
                    <input name="email" type="email" value={addForm.email || ''} onChange={handleAddChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1.5px solid #e5e7eb', marginTop: 4 }} />
                  </label>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontWeight: 600, color: '#22223b' }}>Roll Number:<br />
                    <input name="rollNumber" value={addForm.rollNumber || ''} onChange={handleAddChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1.5px solid #e5e7eb', marginTop: 4 }} />
                  </label>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontWeight: 600, color: '#22223b' }}>Department:<br />
                    <select name="department" value={addForm.department} onChange={e => setAddForm({ ...addForm, department: e.target.value })} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1.5px solid #e5e7eb', marginTop: 4 }}>
                      <option value="">Select department</option>
                      {DEPARTMENTS.map(dep => <option key={dep} value={dep}>{dep}</option>)}
                    </select>
                  </label>
                </div>
                {addError && <div style={{ color: 'red', marginBottom: 8 }}>{addError}</div>}
                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <button type="submit" disabled={addLoading} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 600, fontSize: 15, cursor: 'pointer', transition: 'background 0.15s' }}>{addLoading ? 'Adding...' : 'Add'}</button>
                  <button type="button" onClick={() => setShowAddModal(false)} disabled={addLoading} style={{ background: '#e5e7eb', color: '#22223b', border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
        {showEditModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
          }}>
            <div style={{ background: '#fff', padding: 32, borderRadius: 16, minWidth: 340, boxShadow: '0 2px 16px rgba(0,0,0,0.10)', border: '2px solid #2563eb' }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#2563eb', marginBottom: 18 }}>Edit Student</h2>
              <form onSubmit={handleEditSubmit}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontWeight: 600, color: '#22223b' }}>Name:<br />
                    <input name="name" value={editForm.name || ''} onChange={handleEditChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1.5px solid #e5e7eb', marginTop: 4 }} />
                  </label>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontWeight: 600, color: '#22223b' }}>Email:<br />
                    <input name="email" type="email" value={editForm.email || ''} onChange={handleEditChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1.5px solid #e5e7eb', marginTop: 4 }} />
                  </label>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontWeight: 600, color: '#22223b' }}>Roll Number:<br />
                    <input name="rollNumber" value={editForm.rollNumber || ''} onChange={handleEditChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1.5px solid #e5e7eb', marginTop: 4 }} />
                  </label>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontWeight: 600, color: '#22223b' }}>Department:<br />
                    <select name="department" value={editForm.department} onChange={e => setEditForm({ ...editForm, department: e.target.value })} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1.5px solid #e5e7eb', marginTop: 4 }}>
                      <option value="">Select department</option>
                      {DEPARTMENTS.map(dep => <option key={dep} value={dep}>{dep}</option>)}
                    </select>
                  </label>
                </div>
                {editError && <div style={{ color: 'red', marginBottom: 8 }}>{editError}</div>}
                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <button type="submit" disabled={editLoading} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 600, fontSize: 15, cursor: 'pointer', transition: 'background 0.15s' }}>{editLoading ? 'Saving...' : 'Save'}</button>
                  <button type="button" onClick={() => setShowEditModal(false)} disabled={editLoading} style={{ background: '#e5e7eb', color: '#22223b', border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
        {loading ? (
          <p style={{ color: '#2563eb', fontWeight: 600 }}>Loading...</p>
        ) : error ? (
          <p style={{ color: 'red', fontWeight: 600 }}>{error}</p>
        ) : (
          <div style={{ overflowX: 'auto', marginTop: 12 }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(37,99,235,0.04)' }}>
              <thead>
                <tr style={{ background: '#f0f4ff' }}>
                  <th style={{ padding: '12px 8px', fontWeight: 700, color: '#2563eb', fontSize: 15, borderTopLeftRadius: 12 }}>Name</th>
                  <th style={{ padding: '12px 8px', fontWeight: 700, color: '#2563eb', fontSize: 15 }}>Email</th>
                  <th style={{ padding: '12px 8px', fontWeight: 700, color: '#2563eb', fontSize: 15 }}>Roll Number</th>
                  <th style={{ padding: '12px 8px', fontWeight: 700, color: '#2563eb', fontSize: 15 }}>Department</th>
                  <th style={{ padding: '12px 8px', fontWeight: 700, color: '#2563eb', fontSize: 15, borderTopRightRadius: 12 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.filter(student => selectedDepartment === 'All Departments' || student.department === selectedDepartment).map((student) => (
                  <tr key={student._id} style={{ borderBottom: '1.5px solid #e5e7eb' }}>
                    <td style={{ padding: '10px 8px', color: '#22223b', fontWeight: 500 }}>{student.name}</td>
                    <td style={{ padding: '10px 8px', color: '#22223b', fontWeight: 500 }}>{student.email}</td>
                    <td style={{ padding: '10px 8px', color: '#22223b', fontWeight: 500 }}>{student.rollNumber}</td>
                    <td style={{ padding: '10px 8px', color: '#22223b', fontWeight: 500 }}>{student.department}</td>
                    <td style={{ padding: '10px 8px' }}>
                      <button
                        style={{ background: '#e5e7eb', color: '#2563eb', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 600, cursor: 'pointer', marginRight: 8 }}
                        onClick={() => handleEditClick(student)}
                      >Edit</button>
                      <button
                        style={{ background: '#ffeded', color: '#d90429', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 600, cursor: 'pointer' }}
                        onClick={() => handleDelete(student._id)}
                        disabled={deleteLoadingId === student._id}
                      >{deleteLoadingId === student._id ? 'Deleting...' : 'Delete'}</button>
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

export default AdminStudentsPage; 