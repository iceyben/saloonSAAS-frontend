"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Calendar, Search, Filter } from "lucide-react";
import { adminApi } from "@/lib/adminApi";

const STATUS_COLORS = {
  PENDING:     { bg: "#FEF9C3", color: "#854D0E" },
  APPROVED:    { bg: "#DCFCE7", color: "#166534" },
  CANCELLED:   { bg: "#FEE2E2", color: "#991B1B" },
  RESCHEDULED: { bg: "#DBEAFE", color: "#1E40AF" },
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState("ALL");
  const [search, setSearch]     = useState("");
  const [selected, setSelected] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = filter !== "ALL" ? `?status=${filter}` : "";
      const res = await adminApi().get(`/bookings${params}`);
      setBookings(res.data);
    } catch { }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBookings(); }, [filter]);

  const approve = async (id) => {
    try { await adminApi().patch(`/bookings/${id}/approve`); fetchBookings(); }
    catch { alert("Failed"); }
  };

  const cancel = async (id) => {
    const reason = prompt("Reason for cancellation (optional):");
    try { await adminApi().patch(`/bookings/${id}/cancel`, { reason }); fetchBookings(); }
    catch { alert("Failed"); }
  };

  const filtered = bookings.filter(b =>
    b.customerName.toLowerCase().includes(search.toLowerCase()) ||
    b.customerPhone.includes(search) ||
    b.service?.name.toLowerCase().includes(search.toLowerCase())
  );

  const formatDT = (iso) => new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "32px", fontWeight: 300 }}>Bookings</h1>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--dark-mid)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, phone, service..."
            style={{ width: "100%", padding: "10px 12px 10px 36px", border: "1px solid var(--border)", borderRadius: "6px", fontSize: "13px", background: "white", outline: "none" }}
          />
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {["ALL", "PENDING", "APPROVED", "CANCELLED"].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{
              padding: "10px 16px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: 500,
              border: `1px solid ${filter === s ? "var(--rose)" : "var(--border)"}`,
              background: filter === s ? "var(--rose)" : "white",
              color: filter === s ? "white" : "var(--dark-mid)",
              transition: "all 0.15s",
            }}>{s}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "60px", textAlign: "center", color: "var(--dark-mid)" }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "60px", textAlign: "center", color: "var(--dark-mid)" }}>No bookings found</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#FAFAFA", borderBottom: "1px solid var(--border)" }}>
                {["Customer", "Service", "Date & Time", "Payment", "Status", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--dark-mid)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, i) => (
                <motion.tr key={b.id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  style={{ borderBottom: "1px solid var(--border)", transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"}
                  onMouseLeave={e => e.currentTarget.style.background = "white"}
                >
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--dark)" }}>{b.customerName}</div>
                    <div style={{ fontSize: "12px", color: "var(--dark-mid)" }}>{b.customerPhone}</div>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: "13px", color: "var(--dark)" }}>{b.service?.name}</td>
                  <td style={{ padding: "14px 16px", fontSize: "13px", color: "var(--dark)" }}>{formatDT(b.appointmentDate)}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 500, padding: "3px 10px", borderRadius: "20px",
                      background: b.paymentMethod === "MOMO" ? "#EDE9FE" : "#F0FDF4",
                      color: b.paymentMethod === "MOMO" ? "#6D28D9" : "#166534",
                    }}>
                      {b.paymentMethod}
                    </span>
                    {b.paymentScreenshot && (
                      <a href={b.paymentScreenshot} target="_blank" style={{ display: "block", fontSize: "11px", color: "var(--rose)", marginTop: "4px" }}>View screenshot</a>
                    )}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{
                      fontSize: "11px", fontWeight: 500, padding: "4px 10px", borderRadius: "20px",
                      background: STATUS_COLORS[b.status]?.bg,
                      color: STATUS_COLORS[b.status]?.color,
                    }}>{b.status}</span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {b.status === "PENDING" && (
                        <>
                          <button onClick={() => approve(b.id)} style={{ padding: "5px 12px", background: "#DCFCE7", color: "#166534", border: "1px solid #BBF7D0", borderRadius: "4px", fontSize: "11px", fontWeight: 500, cursor: "pointer" }}>
                            Approve
                          </button>
                          <button onClick={() => cancel(b.id)} style={{ padding: "5px 12px", background: "#FEE2E2", color: "#991B1B", border: "1px solid #FCA5A5", borderRadius: "4px", fontSize: "11px", fontWeight: 500, cursor: "pointer" }}>
                            Cancel
                          </button>
                        </>
                      )}
                      {b.status === "APPROVED" && (
                        <button onClick={() => cancel(b.id)} style={{ padding: "5px 12px", background: "#FEE2E2", color: "#991B1B", border: "1px solid #FCA5A5", borderRadius: "4px", fontSize: "11px", fontWeight: 500, cursor: "pointer" }}>
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}