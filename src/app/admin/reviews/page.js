"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Check, X, Trash2 } from "lucide-react";
import { adminApi } from "@/lib/adminApi";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("PENDING");

  const fetch = async () => {
    setLoading(true);
    try { const r = await adminApi().get("/reviews/all"); setReviews(r.data); }
    catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const approve = async (id) => {
    try { await adminApi().patch(`/reviews/${id}/approve`); fetch(); }
    catch { alert("Failed"); }
  };

  const reject = async (id) => {
    try { await adminApi().patch(`/reviews/${id}/reject`); fetch(); }
    catch { alert("Failed"); }
  };

  const remove = async (id) => {
    if (!confirm("Delete this review?")) return;
    try { await adminApi().delete(`/reviews/${id}`); fetch(); }
    catch { alert("Failed"); }
  };

  const filtered = filter === "ALL" ? reviews : reviews.filter(r => r.status === filter);

  const statusStyles = {
    PENDING:  { bg: "#FEF9C3", color: "#854D0E" },
    APPROVED: { bg: "#DCFCE7", color: "#166534" },
    REJECTED: { bg: "#FEE2E2", color: "#991B1B" },
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "32px", fontWeight: 300 }}>Reviews</h1>
        <div style={{ display: "flex", gap: "8px" }}>
          {["ALL", "PENDING", "APPROVED", "REJECTED"].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{
              padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: 500,
              border: `1px solid ${filter === s ? "var(--rose)" : "var(--border)"}`,
              background: filter === s ? "var(--rose)" : "white",
              color: filter === s ? "white" : "var(--dark-mid)", transition: "all 0.15s",
            }}>{s}</button>
          ))}
        </div>
      </div>

      {loading ? <div style={{ textAlign: "center", padding: "60px" }}>Loading...</div> : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filtered.length === 0 && <div style={{ textAlign: "center", padding: "60px", color: "var(--dark-mid)" }}>No reviews found</div>}
          {filtered.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              style={{ background: "white", border: "1px solid var(--border)", borderRadius: "8px", padding: "20px", display: "flex", gap: "20px", alignItems: "flex-start" }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: "16px", fontWeight: 400 }}>{r.customerName}</div>
                  <div style={{ display: "flex", gap: "2px" }}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} size={13} fill={j < r.rating ? "var(--gold)" : "transparent"} color={j < r.rating ? "var(--gold)" : "var(--border)"} />
                    ))}
                  </div>
                  <span style={{ fontSize: "11px", fontWeight: 500, padding: "2px 8px", borderRadius: "20px", background: statusStyles[r.status]?.bg, color: statusStyles[r.status]?.color }}>
                    {r.status}
                  </span>
                </div>
                <p style={{ fontSize: "14px", color: "var(--dark-mid)", fontWeight: 300, lineHeight: "1.6", fontStyle: "italic" }}>"{r.feedback}"</p>
                <div style={{ fontSize: "11px", color: "var(--dark-mid)", marginTop: "8px" }}>{new Date(r.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</div>
              </div>
              <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                {r.status === "PENDING" && (
                  <>
                    <button onClick={() => approve(r.id)} style={{ padding: "6px 14px", background: "#DCFCE7", color: "#166534", border: "1px solid #BBF7D0", borderRadius: "4px", fontSize: "12px", fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Check size={12} /> Approve
                    </button>
                    <button onClick={() => reject(r.id)} style={{ padding: "6px 14px", background: "#FEF9C3", color: "#854D0E", border: "1px solid #FDE68A", borderRadius: "4px", fontSize: "12px", fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                      <X size={12} /> Reject
                    </button>
                  </>
                )}
                <button onClick={() => remove(r.id)} style={{ padding: "6px", background: "#FEE2E2", border: "1px solid #FCA5A5", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center" }}>
                  <Trash2 size={13} color="#DC2626" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}