"use client";
import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { Search, CheckCircle, XCircle, Eye } from "lucide-react";
import { adminApi } from "@/lib/adminApi";

const STATUS = {
  PENDING:     { bg: "#FEF9C3", color: "#854D0E", dot: "#F59E0B" },
  APPROVED:    { bg: "#DCFCE7", color: "#166534", dot: "#10B981" },
  CANCELLED:   { bg: "#FEE2E2", color: "#991B1B", dot: "#EF4444" },
  RESCHEDULED: { bg: "#DBEAFE", color: "#1E40AF", dot: "#3B82F6" },
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState("ALL");
  const [search, setSearch]     = useState("");
  const [selected, setSelected] = useState(null);

  const tableRef  = useRef(null);
  const headerRef = useRef(null);
  const detailRef = useRef(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = filter !== "ALL" ? `?status=${filter}` : "";
      const res = await adminApi().get(`/bookings${params}`);
      setBookings(res.data);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBookings(); }, [filter]);

  useEffect(() => {
    if (loading || !tableRef.current) return;
    gsap.fromTo(headerRef.current,
      { opacity: 0, y: -16 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
    );
    const rows = tableRef.current.querySelectorAll("tr");
    gsap.fromTo(rows,
      { opacity: 0, x: -16 },
      { opacity: 1, x: 0, duration: 0.35, stagger: 0.04, ease: "power2.out", delay: 0.1 }
    );
  }, [loading, bookings]);

  // Animate detail panel open
  useEffect(() => {
    if (!detailRef.current) return;
    if (selected) {
      gsap.fromTo(detailRef.current,
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 0.35, ease: "power3.out" }
      );
    }
  }, [selected]);

  const approve = async (id) => {
    try {
      await adminApi().patch(`/bookings/${id}/approve`);
      animateRowOut(id);
    } catch { alert("Failed"); }
  };

  const cancel = async (id) => {
    const reason = prompt("Reason for cancellation (optional):");
    try {
      await adminApi().patch(`/bookings/${id}/cancel`, { reason });
      fetchBookings();
      if (selected?.id === id) setSelected(null);
    } catch { alert("Failed"); }
  };

  const animateRowOut = (id) => {
    const row = document.getElementById(`row-${id}`);
    if (row) {
      gsap.to(row, {
        opacity: 0, x: 20, height: 0,
        duration: 0.3, ease: "power2.in",
        onComplete: fetchBookings,
      });
    } else { fetchBookings(); }
  };

  const filtered = bookings.filter(b =>
    b.customerName.toLowerCase().includes(search.toLowerCase()) ||
    b.customerPhone.includes(search) ||
    b.service?.name.toLowerCase().includes(search.toLowerCase())
  );

  const formatDT = (iso) => new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true });

  return (
    <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
      {/* Main table */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Header */}
        <div ref={headerRef} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: 300 }}>Bookings</h1>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {["ALL","PENDING","APPROVED","CANCELLED"].map(s => (
              <button key={s} onClick={() => setFilter(s)} style={{
                padding: "7px 14px", borderRadius: "6px", cursor: "pointer",
                fontSize: "11px", fontWeight: 500, letterSpacing: "0.06em",
                border: `1px solid ${filter === s ? "var(--rose)" : "var(--border)"}`,
                background: filter === s ? "var(--rose)" : "white",
                color: filter === s ? "white" : "var(--dark-mid)",
                transition: "all 0.15s",
              }}>{s}</button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: "16px" }}>
          <Search size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--dark-mid)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, phone, or service..."
            style={{ width: "100%", padding: "10px 12px 10px 36px", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "13px", background: "white", outline: "none", boxSizing: "border-box" }}
          />
        </div>

        {/* Table */}
        <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
          {loading ? (
            <div style={{ padding: "60px", textAlign: "center", color: "var(--dark-mid)" }}>
              <div style={{ fontSize: "24px", marginBottom: "8px", animation: "spin 2s linear infinite" }}>✦</div>
              Loading bookings...
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: "60px", textAlign: "center", color: "var(--dark-mid)" }}>No bookings found</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table ref={tableRef} style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#FAFAFA", borderBottom: "1px solid var(--border)" }}>
                    {["Customer","Service","Date & Time","Payment","Status","Actions"].map(h => (
                      <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--dark-mid)", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(b => (
                    <tr id={`row-${b.id}`} key={b.id}
                      style={{ borderBottom: "1px solid var(--border)", cursor: "pointer", transition: "background 0.15s", background: selected?.id === b.id ? "var(--rose-blush)" : "white" }}
                      onClick={() => setSelected(selected?.id === b.id ? null : b)}
                      onMouseEnter={e => { if (selected?.id !== b.id) e.currentTarget.style.background = "#FAFAFA"; }}
                      onMouseLeave={e => { if (selected?.id !== b.id) e.currentTarget.style.background = "white"; }}
                    >
                      <td style={{ padding: "13px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--rose-blush)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 600, color: "var(--rose)", flexShrink: 0 }}>
                            {b.customerName[0].toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--dark)" }}>{b.customerName}</div>
                            <div style={{ fontSize: "11px", color: "var(--dark-mid)" }}>{b.customerPhone}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "13px 16px", fontSize: "13px", color: "var(--dark)", whiteSpace: "nowrap" }}>{b.service?.name}</td>
                      <td style={{ padding: "13px 16px", fontSize: "12px", color: "var(--dark)", whiteSpace: "nowrap" }}>{formatDT(b.appointmentDate)}</td>
                      <td style={{ padding: "13px 16px" }}>
                        <span style={{ fontSize: "11px", fontWeight: 500, padding: "3px 8px", borderRadius: "20px", background: b.paymentMethod === "MOMO" ? "#EDE9FE" : "#F0FDF4", color: b.paymentMethod === "MOMO" ? "#6D28D9" : "#166534" }}>
                          {b.paymentMethod}
                        </span>
                      </td>
                      <td style={{ padding: "13px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: STATUS[b.status]?.dot || "#999", flexShrink: 0 }} />
                          <span style={{ fontSize: "11px", fontWeight: 500, color: STATUS[b.status]?.color }}>{b.status}</span>
                        </div>
                      </td>
                      <td style={{ padding: "13px 16px" }}>
                        <div style={{ display: "flex", gap: "6px" }} onClick={e => e.stopPropagation()}>
                          {b.status === "PENDING" && (
                            <>
                              <button onClick={() => approve(b.id)}
                                style={{ padding: "5px 10px", background: "#DCFCE7", color: "#166534", border: "1px solid #BBF7D0", borderRadius: "5px", fontSize: "11px", fontWeight: 500, cursor: "pointer", transition: "all 0.15s" }}
                                onMouseEnter={e => { e.currentTarget.style.background = "#166534"; e.currentTarget.style.color = "white"; }}
                                onMouseLeave={e => { e.currentTarget.style.background = "#DCFCE7"; e.currentTarget.style.color = "#166534"; }}
                              >✓ Approve</button>
                              <button onClick={() => cancel(b.id)}
                                style={{ padding: "5px 10px", background: "#FEE2E2", color: "#991B1B", border: "1px solid #FCA5A5", borderRadius: "5px", fontSize: "11px", fontWeight: 500, cursor: "pointer", transition: "all 0.15s" }}
                                onMouseEnter={e => { e.currentTarget.style.background = "#991B1B"; e.currentTarget.style.color = "white"; }}
                                onMouseLeave={e => { e.currentTarget.style.background = "#FEE2E2"; e.currentTarget.style.color = "#991B1B"; }}
                              >✕ Cancel</button>
                            </>
                          )}
                          {b.status === "APPROVED" && (
                            <button onClick={() => cancel(b.id)}
                              style={{ padding: "5px 10px", background: "#FEE2E2", color: "#991B1B", border: "1px solid #FCA5A5", borderRadius: "5px", fontSize: "11px", fontWeight: 500, cursor: "pointer" }}>
                              Cancel
                            </button>
                          )}
                          <button onClick={() => setSelected(selected?.id === b.id ? null : b)}
                            style={{ padding: "5px 10px", background: "var(--rose-blush)", color: "var(--rose)", border: "1px solid var(--rose-light)", borderRadius: "5px", fontSize: "11px", cursor: "pointer" }}>
                            <Eye size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <div ref={detailRef} style={{
          width: "300px", flexShrink: 0,
          background: "white", border: "1px solid var(--border)",
          borderRadius: "12px", padding: "24px",
          position: "sticky", top: "80px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", fontWeight: 400 }}>Booking Detail</h3>
            <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--dark-mid)", fontSize: "18px" }}>×</button>
          </div>

          <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "var(--rose-blush)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: 600, color: "var(--rose)", margin: "0 auto 16px" }}>
            {selected.customerName[0].toUpperCase()}
          </div>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: "18px", marginBottom: "4px" }}>{selected.customerName}</div>
            <div style={{ fontSize: "13px", color: "var(--rose)" }}>{selected.customerPhone}</div>
          </div>

          {[
            { label: "Service",   value: selected.service?.name    },
            { label: "Date",      value: formatDT(selected.appointmentDate) },
            { label: "Duration",  value: `${selected.durationMinutes} min`  },
            { label: "Price",     value: `$${selected.service?.price}`      },
            { label: "Payment",   value: selected.paymentMethod              },
            { label: "Status",    value: selected.status                     },
          ].map(row => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)", fontSize: "13px" }}>
              <span style={{ color: "var(--dark-mid)", fontWeight: 300 }}>{row.label}</span>
              <span style={{ fontWeight: 500, color: "var(--dark)", textAlign: "right", maxWidth: "160px" }}>{row.value}</span>
            </div>
          ))}

          {selected.notes && (
            <div style={{ marginTop: "16px", padding: "12px", background: "var(--rose-blush)", borderRadius: "8px" }}>
              <div style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--rose)", marginBottom: "4px" }}>Notes</div>
              <div style={{ fontSize: "13px", color: "var(--dark)", fontWeight: 300 }}>{selected.notes}</div>
            </div>
          )}

          {selected.paymentScreenshot && (
            <a href={selected.paymentScreenshot} target="_blank" style={{ display: "block", marginTop: "12px", padding: "10px", background: "#EDE9FE", borderRadius: "8px", textAlign: "center", fontSize: "12px", color: "#6D28D9", textDecoration: "none", fontWeight: 500 }}>
              View MoMo Screenshot ↗
            </a>
          )}

          {selected.status === "PENDING" && (
            <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
              <button onClick={() => approve(selected.id)} style={{ flex: 1, padding: "10px", background: "#166534", color: "white", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>
                ✓ Approve
              </button>
              <button onClick={() => cancel(selected.id)} style={{ flex: 1, padding: "10px", background: "#FEE2E2", color: "#991B1B", border: "1px solid #FCA5A5", borderRadius: "6px", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>
                ✕ Cancel
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .detail-panel { display: none; }
        }
      `}</style>
    </div>
  );
}
