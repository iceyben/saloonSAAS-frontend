"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { adminApi } from "@/lib/adminApi";

// ── SERVICES PAGE ────────────────────────────────────────────────────────
export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState({ name: "", description: "", price: "", duration: "", category: "Hair" });

  const fetch = async () => {
    setLoading(true);
    try { const r = await adminApi().get("/services"); setServices(r.data); }
    catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setEditing(null); setForm({ name: "", description: "", price: "", duration: "", category: "Hair" }); setShowForm(true); };
  const openEdit   = (s) => { setEditing(s); setForm({ name: s.name, description: s.description || "", price: s.price, duration: s.duration, category: s.category }); setShowForm(true); };

  const save = async () => {
    try {
      if (editing) await adminApi().patch(`/services/${editing.id}`, form);
      else         await adminApi().post("/services", form);
      setShowForm(false); fetch();
    } catch { alert("Failed to save service"); }
  };

  const remove = async (id) => {
    if (!confirm("Deactivate this service?")) return;
    try { await adminApi().delete(`/services/${id}`); fetch(); }
    catch { alert("Failed"); }
  };

  const categoryColors = { Hair: "var(--rose)", Nails: "var(--gold)", Makeup: "var(--rose-deep)" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "32px", fontWeight: 300 }}>Services</h1>
        <button onClick={openCreate} className="btn-primary" style={{ padding: "10px 20px", fontSize: "13px" }}>
          <Plus size={16} /> Add Service
        </button>
      </div>

      {loading ? <div style={{ textAlign: "center", padding: "60px", color: "var(--dark-mid)" }}>Loading...</div> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {services.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              style={{ background: "white", border: "1px solid var(--border)", borderRadius: "8px", padding: "20px" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <span style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: categoryColors[s.category] || "var(--rose)" }}>{s.category}</span>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button onClick={() => openEdit(s)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--dark-mid)", padding: "4px" }}><Pencil size={14} /></button>
                  <button onClick={() => remove(s.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#DC2626", padding: "4px" }}><Trash2 size={14} /></button>
                </div>
              </div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "20px", marginBottom: "6px" }}>{s.name}</div>
              <div style={{ fontSize: "12px", color: "var(--dark-mid)", fontWeight: 300, marginBottom: "16px", lineHeight: "1.5" }}>{s.description}</div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "var(--font-serif)", fontSize: "22px", color: "var(--rose)" }}>${s.price}</span>
                <span style={{ fontSize: "12px", color: "var(--dark-mid)" }}>{s.duration} min</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div style={{ background: "white", borderRadius: "8px", padding: "32px", width: "100%", maxWidth: "480px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", fontWeight: 400 }}>{editing ? "Edit Service" : "Add Service"}</h2>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                { label: "Name",        key: "name",        type: "text",   placeholder: "e.g. Braids" },
                { label: "Description", key: "description", type: "text",   placeholder: "Short description" },
                { label: "Price ($)",   key: "price",       type: "number", placeholder: "50" },
                { label: "Duration (min)", key: "duration", type: "number", placeholder: "120" },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--dark-mid)", marginBottom: "6px" }}>{f.label}</label>
                  <input type={f.type} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder} className="input-salon" />
                </div>
              ))}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--dark-mid)", marginBottom: "6px" }}>Category</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="input-salon">
                  {["Hair", "Nails", "Makeup"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button onClick={() => setShowForm(false)} className="btn-outline" style={{ flex: 1, justifyContent: "center" }}>Cancel</button>
                <button onClick={save} className="btn-primary" style={{ flex: 1, justifyContent: "center" }}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
