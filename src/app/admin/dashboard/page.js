"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import { adminApi } from "@/lib/adminApi";

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState(null);
  const [bookings, setBookings]   = useState([]);
  const [loading, setLoading]     = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [a, b] = await Promise.all([
        adminApi().get("/analytics/overview"),
        adminApi().get("/bookings?status=PENDING"),
      ]);
      setAnalytics(a.data);
      setBookings(b.data.slice(0, 5));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const approve = async (id) => {
    try { await adminApi().patch(`/bookings/${id}/approve`); fetchData(); }
    catch { alert("Failed to approve"); }
  };

  const formatDT = (iso) => new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true });

  if (loading) return <div style={{ padding: "60px", textAlign: "center", color: "var(--dark-mid)" }}>Loading dashboard...</div>;

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "32px", fontWeight: 300, marginBottom: "4px" }}>Good morning ✦</h1>
        <p style={{ fontSize: "14px", color: "var(--dark-mid)", fontWeight: 300 }}>Here's what's happening at Choice Saloon today.</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
        {[
          { label: "Today's bookings", value: analytics?.todayBookings  || 0,  icon: Calendar,    color: "var(--rose)" },
          { label: "Pending approval", value: analytics?.pendingBookings || 0,  icon: AlertCircle, color: "#F59E0B"     },
          { label: "Total approved",   value: analytics?.totalBookings   || 0,  icon: CheckCircle, color: "#10B981"     },
          { label: "Monthly revenue",  value: `$${analytics?.revenue?.monthly || 0}`, icon: TrendingUp, color: "var(--gold)" },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            style={{ background: "white", border: "1px solid var(--border)", borderRadius: "8px", padding: "24px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div style={{ fontSize: "12px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--dark-mid)" }}>{stat.label}</div>
              <stat.icon size={18} color={stat.color} />
            </div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: "32px", fontWeight: 400, color: "var(--dark)" }}>{stat.value}</div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "24px" }}>
        {/* Pending bookings */}
        <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "8px", padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: 400 }}>Pending Bookings</h2>
            <a href="/admin/bookings" style={{ fontSize: "12px", color: "var(--rose)", textDecoration: "none", fontWeight: 500 }}>View all →</a>
          </div>
          {bookings.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "var(--dark-mid)", fontSize: "14px" }}>No pending bookings 🎉</div>
          ) : bookings.map(b => (
            <div key={b.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "#FAFAFA", borderRadius: "6px", border: "1px solid var(--border)", marginBottom: "8px" }}>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--dark)" }}>{b.customerName}</div>
                <div style={{ fontSize: "12px", color: "var(--dark-mid)" }}>{b.service?.name} · {formatDT(b.appointmentDate)}</div>
              </div>
              <button onClick={() => approve(b.id)} style={{ padding: "5px 12px", background: "#DCFCE7", color: "#166534", border: "1px solid #BBF7D0", borderRadius: "4px", fontSize: "11px", fontWeight: 500, cursor: "pointer" }}>
                Approve
              </button>
            </div>
          ))}
        </div>

        {/* Revenue + Top services */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "8px", padding: "24px" }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: 400, marginBottom: "16px" }}>Revenue</h2>
            {[
              { label: "Today",  value: analytics?.revenue?.daily   || 0 },
              { label: "Week",   value: analytics?.revenue?.weekly  || 0 },
              { label: "Month",  value: analytics?.revenue?.monthly || 0 },
            ].map(r => (
              <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontSize: "13px", color: "var(--dark-mid)" }}>{r.label}</span>
                <span style={{ fontFamily: "var(--font-serif)", fontSize: "20px", color: "var(--rose)" }}>${r.value}</span>
              </div>
            ))}
          </div>

          <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "8px", padding: "24px" }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: 400, marginBottom: "16px" }}>Top Services</h2>
            {(analytics?.popularServices || []).length === 0
              ? <p style={{ fontSize: "13px", color: "var(--dark-mid)", textAlign: "center", padding: "16px 0" }}>No data yet</p>
              : (analytics.popularServices || []).slice(0, 4).map((s, i) => (
                <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "var(--rose-blush)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: "var(--rose)", fontWeight: 600 }}>{i + 1}</div>
                    <span style={{ fontSize: "13px" }}>{s.name}</span>
                  </div>
                  <span style={{ fontSize: "12px", color: "var(--dark-mid)" }}>{s.bookingCount} bookings</span>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}