// ============================================================
// src/app/gallery/page.js
// ============================================================
"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const CATEGORIES = ["All", "Hair", "Nails", "Makeup"];

export default function GalleryPage() {
  const [photos, setPhotos]   = useState([]);
  const [active, setActive]   = useState("All");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    axios.get(`${API}/gallery`).then(r => setPhotos(r.data)).catch(() => {});
  }, []);

  const filtered = active === "All" ? photos : photos.filter(p => p.category === active);

  return (
    <div style={{ paddingTop: "72px" }}>
      <section style={{ padding: "80px 40px 60px", background: "linear-gradient(135deg, var(--cream), var(--rose-blush))", textAlign: "center", borderBottom: "1px solid var(--border)" }}>
        <div className="section-tag" style={{ justifyContent: "center" }}>Our work</div>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 300, marginBottom: "16px" }}>Gallery</h1>
        <p style={{ fontSize: "15px", color: "var(--dark-mid)", fontWeight: 300, marginBottom: "40px" }}>Every look, crafted with passion.</p>
        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActive(cat)} style={{
              padding: "10px 24px", borderRadius: "2px", cursor: "pointer",
              fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 500,
              letterSpacing: "0.08em", textTransform: "uppercase", transition: "all 0.2s",
              background: active === cat ? "var(--rose)" : "white",
              color: active === cat ? "white" : "var(--dark-mid)",
              border: active === cat ? "1px solid var(--rose)" : "1px solid var(--border)",
            }}>{cat}</button>
          ))}
        </div>
      </section>

      <section style={{ padding: "60px 40px", background: "var(--cream)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "48px", color: "var(--rose-light)", marginBottom: "16px" }}>✦</div>
              <p style={{ fontSize: "15px", color: "var(--dark-mid)", fontWeight: 300 }}>Photos coming soon. Check back later!</p>
            </div>
          ) : (
            <div style={{ columns: "3", gap: "16px" }}>
              {filtered.map((photo, i) => (
                <motion.div key={photo.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}
                  onClick={() => setSelected(photo)}
                  style={{ breakInside: "avoid", marginBottom: "16px", cursor: "pointer", borderRadius: "4px", overflow: "hidden", border: "1px solid var(--border)" }}
                >
                  <img src={photo.imageUrl} alt={photo.caption || photo.category} style={{ width: "100%", display: "block", transition: "transform 0.3s" }}
                    onMouseEnter={e => e.target.style.transform = "scale(1.03)"}
                    onMouseLeave={e => e.target.style.transform = "scale(1)"}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px" }}
          >
            <img src={selected.imageUrl} alt={selected.caption} style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain", borderRadius: "4px" }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}