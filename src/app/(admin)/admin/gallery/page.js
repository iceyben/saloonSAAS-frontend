// ── GALLERY PAGE ─────────────────────────────────────────────────────────
"use client";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, Trash2, Eye, EyeOff } from "lucide-react";
import { adminApi } from "@/lib/adminApi";

export default function GalleryPage() {
  const [photos, setPhotos]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState("Hair");
  const [caption, setCaption]   = useState("");
  const fileRef = useRef();

  const fetch = async () => {
    setLoading(true);
    try { const r = await adminApi().get("/gallery"); setPhotos(r.data); }
    catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const upload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("photo", file);
      fd.append("category", category);
      fd.append("caption", caption);
      await adminApi().post("/gallery", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setCaption(""); fetch();
    } catch { alert("Upload failed"); }
    finally { setUploading(false); }
  };

  const remove = async (id) => {
    if (!confirm("Delete this photo?")) return;
    try { await adminApi().delete(`/gallery/${id}`); fetch(); }
    catch { alert("Failed"); }
  };

  const toggleVisible = async (photo) => {
    try { await adminApi().patch(`/gallery/${photo.id}`, { isVisible: !photo.isVisible }); fetch(); }
    catch { alert("Failed"); }
  };

  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "32px", fontWeight: 300, marginBottom: "24px" }}>Gallery</h1>

      {/* Upload area */}
      <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "8px", padding: "24px", marginBottom: "24px" }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: 400, marginBottom: "16px" }}>Upload Photo</h2>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "flex-end" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--dark-mid)", marginBottom: "6px" }}>Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="input-salon" style={{ width: "140px" }}>
              {["Hair", "Nails", "Makeup"].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--dark-mid)", marginBottom: "6px" }}>Caption (optional)</label>
            <input value={caption} onChange={e => setCaption(e.target.value)} placeholder="e.g. Box braids" className="input-salon" />
          </div>
          <button onClick={() => fileRef.current.click()} disabled={uploading} className="btn-primary" style={{ padding: "12px 24px" }}>
            <Upload size={16} /> {uploading ? "Uploading..." : "Choose Photo"}
          </button>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={upload} />
        </div>
      </div>

      {/* Photos grid */}
      {loading ? <div style={{ textAlign: "center", padding: "60px", color: "var(--dark-mid)" }}>Loading...</div> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
          {photos.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
              style={{ position: "relative", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border)", opacity: p.isVisible ? 1 : 0.5 }}
            >
              <img src={p.imageUrl} alt={p.caption || p.category} style={{ width: "100%", height: "180px", objectFit: "cover", display: "block" }} />
              <div style={{ padding: "10px 12px", background: "white" }}>
                <div style={{ fontSize: "11px", fontWeight: 500, color: "var(--rose)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{p.category}</div>
                {p.caption && <div style={{ fontSize: "12px", color: "var(--dark-mid)", marginTop: "2px" }}>{p.caption}</div>}
              </div>
              <div style={{ position: "absolute", top: "8px", right: "8px", display: "flex", gap: "6px" }}>
                <button onClick={() => toggleVisible(p)} style={{ width: "28px", height: "28px", background: "white", border: "none", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {p.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button onClick={() => remove(p.id)} style={{ width: "28px", height: "28px", background: "#FEE2E2", border: "none", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Trash2 size={14} color="#DC2626" />
                </button>
              </div>
            </motion.div>
          ))}
          {photos.length === 0 && (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px", color: "var(--dark-mid)" }}>No photos yet. Upload your first one!</div>
          )}
        </div>
      )}
    </div>
  );
}
