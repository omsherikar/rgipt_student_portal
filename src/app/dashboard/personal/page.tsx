"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface UserProfile {
  name?: string;
  email?: string;
  image?: string;
  department?: string;
  semester?: string;
  rollNumber?: string;
  dob?: string;
  gender?: string;
  phone?: string;
  address?: string;
  program?: string;
  admissionYear?: string;
  bloodGroup?: string;
  emergencyContact?: string;
  guardianName?: string;
}

export default function PersonalInfoPage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    department: "",
    semester: "",
    image: "",
    rollNumber: "",
    dob: "",
    gender: "",
    phone: "",
    address: "",
    program: "",
    admissionYear: "",
    bloodGroup: "",
    emergencyContact: "",
    guardianName: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const res = await fetch("/api/user");
        if (!res.ok) throw new Error("Failed to fetch user info");
        const data = await res.json();
        setProfile(data);
        setForm({
          name: data.name || "",
          department: data.department || "",
          semester: data.semester || "",
          image: data.image || "",
          rollNumber: data.rollNumber || "",
          dob: data.dob || "",
          gender: data.gender || "",
          phone: data.phone || "",
          address: data.address || "",
          program: data.program || "",
          admissionYear: data.admissionYear || "",
          bloodGroup: data.bloodGroup || "",
          emergencyContact: data.emergencyContact || "",
          guardianName: data.guardianName || "",
        });
        setImagePreview(data.image || null);
      } catch {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (status === "loading" || loading) return <div className="p-8 text-center">Loading...</div>;
  if (!session) return <div className="p-8 text-center text-red-600">Not signed in</div>;

  const user = session.user;
  const name = profile?.name || user?.name || "Student";
  const email = profile?.email || user?.email || "—";
  const image = profile?.image || user?.image || "https://randomuser.me/api/portraits/men/32.jpg";
  const department = profile?.department || "—";
  const semester = profile?.semester || "—";
  const rollNumber = profile?.rollNumber || "—";
  const dob = profile?.dob || "—";
  const gender = profile?.gender || "—";
  const phone = profile?.phone || "—";
  const address = profile?.address || "—";
  const program = profile?.program || "—";
  const admissionYear = profile?.admissionYear || "—";
  const bloodGroup = profile?.bloodGroup || "—";
  const emergencyContact = profile?.emergencyContact || "—";
  const guardianName = profile?.guardianName || "—";

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      const data = await res.json();
      setProfile(data);
      setEditOpen(false);
      setMessage("Profile updated successfully.");
    } catch {
      setMessage("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm(f => ({ ...f, image: ev.target?.result as string }));
      setImagePreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  return (
    <main className="min-h-screen flex flex-col items-center py-10" style={{ background: '#f4f6fb' }}>
      <div className="w-full max-w-xl flex flex-col items-center gap-6 bg-white rounded-2xl shadow-lg p-8 border border-[#e5e7eb]">
        <img
          src={image}
          alt="Profile Photo"
          className="w-24 h-24 rounded-full border-4 border-[#2563eb] object-cover shadow"
        />
        <div className="w-full flex flex-col items-center gap-2">
          <h1 className="text-2xl font-bold" style={{ color: '#22223b' }}>{name}</h1>
          <p style={{ color: '#6c757d' }}>{email}</p>
        </div>
        <div className="w-full flex flex-col gap-6 mt-4">
          {/* Academic Info */}
          <div>
            <div className="font-bold text-base mb-2" style={{ color: '#2563eb' }}>Academic Info</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              <div className="font-semibold" style={{ color: '#6c757d' }}>Department</div>
              <div style={{ color: '#22223b' }}>{department}</div>
              <div className="font-semibold" style={{ color: '#6c757d' }}>Program</div>
              <div style={{ color: '#22223b' }}>{program}</div>
              <div className="font-semibold" style={{ color: '#6c757d' }}>Semester</div>
              <div style={{ color: '#22223b' }}>{semester}</div>
              <div className="font-semibold" style={{ color: '#6c757d' }}>Year of Admission</div>
              <div style={{ color: '#22223b' }}>{admissionYear}</div>
              <div className="font-semibold" style={{ color: '#6c757d' }}>Roll Number</div>
              <div style={{ color: '#22223b' }}>{rollNumber}</div>
            </div>
          </div>
          <hr className="my-2 border-[#e5e7eb]" />
          {/* Contact Info */}
          <div>
            <div className="font-bold text-base mb-2" style={{ color: '#2563eb' }}>Contact Info</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              <div className="font-semibold" style={{ color: '#6c757d' }}>Phone Number</div>
              <div style={{ color: '#22223b' }}>{phone}</div>
              <div className="font-semibold" style={{ color: '#6c757d' }}>Address</div>
              <div style={{ color: '#22223b' }}>{address}</div>
              <div className="font-semibold" style={{ color: '#6c757d' }}>Email</div>
              <div style={{ color: '#22223b' }}>{email}</div>
              <div className="font-semibold" style={{ color: '#6c757d' }}>Emergency Contact</div>
              <div style={{ color: '#22223b' }}>{emergencyContact}</div>
            </div>
          </div>
          <hr className="my-2 border-[#e5e7eb]" />
          {/* Other Info */}
          <div>
            <div className="font-bold text-base mb-2" style={{ color: '#2563eb' }}>Other Info</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              <div className="font-semibold" style={{ color: '#6c757d' }}>Date of Birth</div>
              <div style={{ color: '#22223b' }}>{dob}</div>
              <div className="font-semibold" style={{ color: '#6c757d' }}>Gender</div>
              <div style={{ color: '#22223b' }}>{gender}</div>
              <div className="font-semibold" style={{ color: '#6c757d' }}>Blood Group</div>
              <div style={{ color: '#22223b' }}>{bloodGroup}</div>
              <div className="font-semibold" style={{ color: '#6c757d' }}>Guardian Name</div>
              <div style={{ color: '#22223b' }}>{guardianName}</div>
            </div>
          </div>
        </div>
        <button
          className="mt-4 px-4 py-2 rounded font-semibold shadow transition"
          style={{ background: '#2563eb', color: '#fff' }}
          onClick={() => setEditOpen(true)}
          onMouseOver={e => (e.currentTarget.style.background = '#174bbd')}
          onMouseOut={e => (e.currentTarget.style.background = '#2563eb')}
        >
          Edit Info
        </button>
        {message && <div className="text-center text-green-600 text-sm mt-2">{message}</div>}
      </div>
      {/* Edit Modal */}
      {editOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <form
            className="bg-white border border-[#e5e7eb] rounded-2xl shadow-lg p-8 w-full max-w-md flex flex-col gap-6 overflow-y-auto max-h-[90vh]"
            onSubmit={handleSave}
          >
            <h2 className="text-xl font-bold mb-2" style={{ color: '#22223b' }}>Edit Profile</h2>
            <div className="flex flex-col items-center gap-2 mb-2">
              <img
                src={imagePreview || image}
                alt="Profile Preview"
                className="w-20 h-20 rounded-full border-4 border-[#2563eb] object-cover shadow"
              />
              <label className="text-sm font-semibold cursor-pointer mt-2" style={{ color: '#2563eb' }}>
                <span className="underline">Change Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={saving}
                />
              </label>
            </div>
            {/* Academic Info */}
            <div>
              <div className="font-bold text-base mb-2" style={{ color: '#2563eb' }}>Academic Info</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                <label className="flex flex-col gap-1">
                  <span className="font-semibold text-sm" style={{ color: '#6c757d' }}>Name</span>
                  <input className="border rounded px-3 py-2" style={{ borderColor: '#e5e7eb', color: '#22223b' }} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-semibold text-sm" style={{ color: '#6c757d' }}>Department</span>
                  <input className="border rounded px-3 py-2" style={{ borderColor: '#e5e7eb', color: '#22223b' }} value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-semibold text-sm" style={{ color: '#6c757d' }}>Program</span>
                  <input className="border rounded px-3 py-2" style={{ borderColor: '#e5e7eb', color: '#22223b' }} value={form.program} onChange={e => setForm(f => ({ ...f, program: e.target.value }))} />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-semibold text-sm" style={{ color: '#6c757d' }}>Semester</span>
                  <input className="border rounded px-3 py-2" style={{ borderColor: '#e5e7eb', color: '#22223b' }} value={form.semester} onChange={e => setForm(f => ({ ...f, semester: e.target.value }))} />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-semibold text-sm" style={{ color: '#6c757d' }}>Year of Admission</span>
                  <input className="border rounded px-3 py-2" style={{ borderColor: '#e5e7eb', color: '#22223b' }} value={form.admissionYear} onChange={e => setForm(f => ({ ...f, admissionYear: e.target.value }))} />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-semibold text-sm" style={{ color: '#6c757d' }}>Roll Number</span>
                  <input className="border rounded px-3 py-2" style={{ borderColor: '#e5e7eb', color: '#22223b' }} value={form.rollNumber} onChange={e => setForm(f => ({ ...f, rollNumber: e.target.value }))} />
                </label>
              </div>
            </div>
            <hr className="my-2 border-[#e5e7eb]" />
            {/* Contact Info */}
            <div>
              <div className="font-bold text-base mb-2" style={{ color: '#2563eb' }}>Contact Info</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                <label className="flex flex-col gap-1">
                  <span className="font-semibold text-sm" style={{ color: '#6c757d' }}>Phone Number</span>
                  <input className="border rounded px-3 py-2" style={{ borderColor: '#e5e7eb', color: '#22223b' }} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-semibold text-sm" style={{ color: '#6c757d' }}>Address</span>
                  <input className="border rounded px-3 py-2" style={{ borderColor: '#e5e7eb', color: '#22223b' }} value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-semibold text-sm" style={{ color: '#6c757d' }}>Emergency Contact</span>
                  <input className="border rounded px-3 py-2" style={{ borderColor: '#e5e7eb', color: '#22223b' }} value={form.emergencyContact} onChange={e => setForm(f => ({ ...f, emergencyContact: e.target.value }))} />
                </label>
              </div>
            </div>
            <hr className="my-2 border-[#e5e7eb]" />
            {/* Other Info */}
            <div>
              <div className="font-bold text-base mb-2" style={{ color: '#2563eb' }}>Other Info</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                <label className="flex flex-col gap-1">
                  <span className="font-semibold text-sm" style={{ color: '#6c757d' }}>Date of Birth</span>
                  <input type="date" className="border rounded px-3 py-2" style={{ borderColor: '#e5e7eb', color: '#22223b' }} value={form.dob} onChange={e => setForm(f => ({ ...f, dob: e.target.value }))} />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-semibold text-sm" style={{ color: '#6c757d' }}>Gender</span>
                  <select className="border rounded px-3 py-2" style={{ borderColor: '#e5e7eb', color: '#22223b' }} value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-semibold text-sm" style={{ color: '#6c757d' }}>Blood Group</span>
                  <input className="border rounded px-3 py-2" style={{ borderColor: '#e5e7eb', color: '#22223b' }} value={form.bloodGroup} onChange={e => setForm(f => ({ ...f, bloodGroup: e.target.value }))} />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-semibold text-sm" style={{ color: '#6c757d' }}>Guardian Name</span>
                  <input className="border rounded px-3 py-2" style={{ borderColor: '#e5e7eb', color: '#22223b' }} value={form.guardianName} onChange={e => setForm(f => ({ ...f, guardianName: e.target.value }))} />
                </label>
              </div>
            </div>
            <div className="flex gap-4 mt-4 justify-end">
              <button
                type="button"
                className="py-2 px-4 rounded font-semibold"
                style={{ background: '#f4f6fb', color: '#22223b', border: '1px solid #e5e7eb' }}
                onClick={() => setEditOpen(false)}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                aria-label="Save profile changes"
                className="py-2 px-6 rounded font-semibold shadow transition"
                style={{ background: '#2563eb', color: '#fff' }}
                disabled={saving}
                onMouseOver={e => (e.currentTarget.style.background = '#174bbd')}
                onMouseOut={e => (e.currentTarget.style.background = '#2563eb')}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
} 