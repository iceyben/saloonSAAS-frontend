// ── HOURS PAGE ───────────────────────────────────────────────────────────
"use client";
import { useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function HoursPage() {
  const [hours, setHours]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(null);

  const fetch = async () => {
    setLoading(true);
    try { const r = await adminApi().get("/hours"); setHours(r.data); }
    catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const update = async (id, field, value) => {
    setHours(prev => prev.map(h => h.id === id ? { ...h, [field]: value } : h));
  };

  const save = async (h) => {
    setSaving(h.id);
    try {
      await adminApi().patch(`/hours/${h.id}`, { openTime: h.openTime, closeTime: h.closeTime, isClosed: h.isClosed });
      alert("Saved!");
    } catch { alert("Failed to save"); }
    finally { setSaving(null); }
  };

  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "32px", fontWeight: 300, marginBottom: "8px" }}>Business Hours</h1>
      <p style={{ fontSize: "14px", color: "var(--dark-mid)", fontWeight: 300, marginBottom: "24px" }}>Set your opening and closing times for each day.</p>

      {loading ? <div style={{ textAlign: "center", padding: "60px" }}>Loading...</div> : (
        <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden" }}>
          {hours.sort((a, b) => a.dayOfWeek - b.dayOfWeek).map((h, i) => (
            <div key={h.id} style={{
              display: "flex", alignItems: "center", gap: "20px", padding: "16px 24px",
              borderBottom: i < hours.length - 1 ? "1px solid var(--border)" : "none",
              background: h.isClosed ? "#FAFAFA" : "white",
            }}>
              <div style={{ width: "100px", fontSize: "14px", fontWeight: 500, color: h.isClosed ? "var(--dark-mid)" : "var(--dark)" }}>
                {DAYS[h.dayOfWeek]}
              </div>

              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input type="checkbox" checked={h.isClosed} onChange={e => update(h.id, "isClosed", e.target.checked)} />
                <span style={{ fontSize: "13px", color: "var(--dark-mid)" }}>Closed</span>
              </label>

              {!h.isClosed && (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <label style={{ fontSize: "12px", color: "var(--dark-mid)" }}>Open</label>
                    <input type="time" value={h.openTime} onChange={e => update(h.id, "openTime", e.target.value)}
                      style={{ padding: "6px 10px", border: "1px solid var(--border)", borderRadius: "4px", fontSize: "13px", outline: "none" }}
                    />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <label style={{ fontSize: "12px", color: "var(--dark-mid)" }}>Close</label>
                    <input type="time" value={h.closeTime} onChange={e => update(h.id, "closeTime", e.target.value)}
                      style={{ padding: "6px 10px", border: "1px solid var(--border)", borderRadius: "4px", fontSize: "13px", outline: "none" }}
                    />
                  </div>
                </>
              )}

              <button onClick={() => save(h)} disabled={saving === h.id}
                style={{ marginLeft: "auto", padding: "6px 16px", background: "var(--rose)", color: "white", border: "none", borderRadius: "4px", fontSize: "12px", fontWeight: 500, cursor: "pointer", opacity: saving === h.id ? 0.7 : 1 }}>
                {saving === h.id ? "Saving..." : "Save"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}