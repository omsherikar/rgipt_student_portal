"use client";
import { useEffect, useState } from "react";

interface Document {
  _id: string;
  type: string;
  url: string;
  uploadedAt: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [type, setType] = useState("");
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState("");

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/documents");
      if (!res.ok) throw new Error("Failed to fetch documents");
      const json = await res.json();
      setDocuments(json.documents || []);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, url }),
      });
      if (!res.ok) throw new Error("Failed to upload document");
      setType("");
      setUrl("");
      setSuccess("Document uploaded!");
      fetchDocuments();
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center py-10" style={{ background: '#f4f6fb' }}>
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 border border-[#e5e7eb]">
        <h1 className="text-2xl font-bold mb-6" style={{ color: '#22223b' }}>Document Center</h1>
        <form onSubmit={handleUpload} className="mb-8 space-y-4">
          <div>
            <label className="block font-medium mb-1" style={{ color: '#6c757d' }}>Document Type</label>
            <input
              className="w-full px-4 py-2 border rounded focus:outline-none"
              style={{ borderColor: '#e5e7eb', background: '#f8fafc', color: '#22223b' }}
              value={type}
              onChange={e => setType(e.target.value)}
              placeholder="e.g. Bonafide, ID Card, Fee Receipt"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1" style={{ color: '#6c757d' }}>Document URL</label>
            <input
              className="w-full px-4 py-2 border rounded focus:outline-none"
              style={{ borderColor: '#e5e7eb', background: '#f8fafc', color: '#22223b' }}
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="Paste file URL here (upload not implemented)"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload Document"}
          </button>
          {success && <div className="text-green-600 text-center">{success}</div>}
          {error && <div className="text-red-600 text-center">{error}</div>}
        </form>
        <h2 className="text-lg font-semibold mb-4" style={{ color: '#6c757d' }}>Your Documents</h2>
        {loading ? (
          <div className="text-center">Loading documents...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-0 rounded-lg overflow-hidden">
              <thead>
                <tr style={{ background: '#f4f6fb' }}>
                  <th className="p-3 border-b font-semibold" style={{ borderColor: '#e5e7eb', color: '#6c757d' }}>Type</th>
                  <th className="p-3 border-b font-semibold" style={{ borderColor: '#e5e7eb', color: '#6c757d' }}>Uploaded</th>
                  <th className="p-3 border-b font-semibold" style={{ borderColor: '#e5e7eb', color: '#6c757d' }}>Download</th>
                </tr>
              </thead>
              <tbody>
                {documents.length ? (
                  documents.map(doc => (
                    <tr key={doc._id} style={{ background: '#fff' }}>
                      <td className="p-3 border-b" style={{ borderColor: '#e5e7eb', color: '#22223b' }}>{doc.type}</td>
                      <td className="p-3 border-b" style={{ borderColor: '#e5e7eb', color: '#22223b' }}>{new Date(doc.uploadedAt).toLocaleString()}</td>
                      <td className="p-3 border-b" style={{ borderColor: '#e5e7eb' }}>
                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Download</a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={3} className="p-3 text-center" style={{ color: '#b0b7c3', background: '#fff' }}>No documents found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
} 