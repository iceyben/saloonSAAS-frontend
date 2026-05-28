"use client";
import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { Calendar, TrendingUp, AlertCircle, CheckCircle, ArrowRight } from "lucide-react";
import { adminApi } from "@/lib/adminApi";

const STATUS_COLORS = {
  PENDING:   { bg: "#FEF9C3", color: "#854D0E", dot: "#F59E0B" },
  APPROVED:  { bg: "#DCFCE7", color: "#166534", dot: "#10B981" },
  CANCELLED: { bg: "#FEE2E2", color: "#991B1B", dot: "#EF4444" },
};

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState(null);
  const [bookings, setBookings]   = useState([]);
  const [loading, setLoading]     = useState(true);

  const statsRef    = useRef([]);
  const cardsRef    = useRef([]);
  const headerRef   = useRef(null);

  const fetchData = async () => {
    try {
      const [a, b] = await Promise.all([
        adminApi().get("/analytics/overview"),
        adminApi().get("/bookings?status=PENDING"),
      ]);
      setAnalytics(a.data);
      setBookings(b.data.slice(0, 6));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  // ── GSAP entrance animations ──────────────────────────
  useEffect(() => {
    if (loading) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Header
    tl.fromTo(headerRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.5 }
    );

    // Stats cards stagger
    tl.fromTo(statsRef.current,
      { opacity: 0, y: 30, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1 },
      "-=0.2"
    );

    // Content cards
    tl.fromTo(cardsRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.12 },
      "-=0.3"
    );

  }, [loading]);

  const approve = async (id) => {
    try {
      await adminApi().patch(`/bookings/${id}/approve`);
      // Animate out the approved booking
      const el = document.getElementById(`booking-${id}`);
      if (el) {
        gsap.to(el, {
          opacity: 0, x: 20, height: 0, padding: 0, margin: 0,
          duration: 0.4, ease: "power2.in",
          onComplete: () => fetchData(),
        });
      } else { fetchData(); }
    } catch { alert("Failed to approve"); }
  };

  const formatDT = (iso) => new Date(iso).toLocaleString("en-US", {
    month: "short", day: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true,
  });

  const stats = [
    { label: "Today's bookings", value: analytics?.todayBookings  || 0, icon: Calendar,    color: "var(--rose)",  bg: "var(--rose-blush)"  },
    { label: "Pending approval", value: analytics?.pendingBookings || 0, icon: AlertCircle, color: "#F59E0B",       bg: "#FEF9C3"             },
    { label: "Total approved",   value: analytics?.totalBookings   || 0, icon: CheckCircle, color: "#10B981",       bg: "#DCFCE7"             },
    { label: "Monthly revenue",  value: `$${analytics?.revenue?.monthly || 0}`, icon: TrendingUp, color: "var(--gold)", bg: "var(--gold-light)" },
  ];

  if (loading) return <LoadingState />;

  return (
    <div>
      {/* Header */}
      <div ref={headerRef} style={{ marginBottom: "28px" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 300, marginBottom: "4px", color: "var(--dark)" }}>
          Good morning ✦
        </h1>
        <p style={{ fontSize: "14px", color: "var(--dark-mid)", fontWeight: 300 }}>
          Here's what's happening at Choice Saloon today.
        </p>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" }} className="admin-stats-grid">
        {stats.map((stat, i) => (
          <div
            key={i}
            ref={el => statsRef.current[i] = el}
            style={{
              background: "white", border: "1px solid var(--border)",
              borderRadius: "12px", padding: "20px",
              cursor: "default", transition: "box-shadow 0.2s, transform 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--dark-mid)" }}>{stat.label}</div>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: stat.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <stat.icon size={16} color={stat.color} />
              </div>
            </div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: 400, color: "var(--dark)" }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "20px" }} className="admin-main-grid">

        {/* Pending bookings */}
        <div ref={el => cardsRef.current[0] = el}
          style={{ background: "white", border: "1px solid var(--border)", borderRadius: "12px", padding: "24px", overflow: "hidden" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: 400 }}>Pending Bookings</h2>
            <a href="/admin/bookings" style={{
              display: "flex", alignItems: "center", gap: "4px",
              fontSize: "12px", color: "var(--rose)", textDecoration: "none", fontWeight: 500,
              padding: "6px 12px", borderRadius: "6px", border: "1px solid var(--rose-light)",
              background: "var(--rose-blush)", transition: "all 0.2s",
            }}>
              View all <ArrowRight size={12} />
            </a>
          </div>

          {bookings.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>🎉</div>
              <div style={{ fontSize: "14px", color: "var(--dark-mid)" }}>No pending bookings!</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {bookings.map(b => (
                <div id={`booking-${b.id}`} key={b.id}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 16px", background: "#FAFAFA",
                    borderRadius: "8px", border: "1px solid var(--border)",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--rose-blush)"}
                  onMouseLeave={e => e.currentTarget.style.background = "#FAFAFA"}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--rose-blush)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 600, color: "var(--rose)", flexShrink: 0 }}>
                      {b.customerName[0].toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--dark)" }}>{b.customerName}</div>
                      <div style={{ fontSize: "12px", color: "var(--dark-mid)" }}>{b.service?.name} · {formatDT(b.appointmentDate)}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 500, padding: "3px 8px", borderRadius: "20px", background: b.paymentMethod === "MOMO" ? "#EDE9FE" : "#F0FDF4", color: b.paymentMethod === "MOMO" ? "#6D28D9" : "#166534" }}>
                      {b.paymentMethod}
                    </span>
                    <button onClick={() => approve(b.id)}
                      style={{
                        padding: "6px 14px", background: "#DCFCE7", color: "#166534",
                        border: "1px solid #BBF7D0", borderRadius: "6px", fontSize: "12px",
                        fontWeight: 500, cursor: "pointer", transition: "all 0.15s",
                        whiteSpace: "nowrap",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#166534"; e.currentTarget.style.color = "white"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "#DCFCE7"; e.currentTarget.style.color = "#166534"; }}
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Revenue */}
          <div ref={el => cardsRef.current[1] = el}
            style={{ background: "white", border: "1px solid var(--border)", borderRadius: "12px", padding: "24px" }}
          >
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: 400, marginBottom: "16px" }}>Revenue</h2>
            {[
              { label: "Today",  value: analytics?.revenue?.daily   || 0, bar: 30  },
              { label: "Week",   value: analytics?.revenue?.weekly  || 0, bar: 60  },
              { label: "Month",  value: analytics?.revenue?.monthly || 0, bar: 100 },
            ].map(r => (
              <div key={r.label} style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontSize: "13px", color: "var(--dark-mid)" }}>{r.label}</span>
                  <span style={{ fontFamily: "var(--font-serif)", fontSize: "18px", color: "var(--rose)" }}>${r.value}</span>
                </div>
                <div style={{ height: "4px", background: "var(--border)", borderRadius: "2px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${r.bar}%`, background: "linear-gradient(90deg, var(--rose-light), var(--rose))", borderRadius: "2px", transition: "width 1s ease" }} />
                </div>
              </div>
            ))}
          </div>

          {/* Top services */}
          <div ref={el => cardsRef.current[2] = el}
            style={{ background: "white", border: "1px solid var(--border)", borderRadius: "12px", padding: "24px" }}
          >
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: 400, marginBottom: "16px" }}>Top Services</h2>
            {(analytics?.popularServices || []).length === 0 ? (
              <p style={{ fontSize: "13px", color: "var(--dark-mid)", textAlign: "center", padding: "16px 0" }}>No data yet</p>
            ) : (analytics.popularServices || []).slice(0, 5).map((s, i) => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px 0", borderBottom: i < 4 ? "1px solid var(--border)" : "none" }}>
                <div style={{
                  width: "24px", height: "24px", borderRadius: "6px",
                  background: i === 0 ? "var(--gold-light)" : "var(--rose-blush)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "11px", color: i === 0 ? "var(--gold)" : "var(--rose)", fontWeight: 600,
                }}>{i + 1}</div>
                <span style={{ flex: 1, fontSize: "13px", color: "var(--dark)" }}>{s.name}</span>
                <span style={{ fontSize: "12px", color: "var(--dark-mid)", fontWeight: 500 }}>{s.bookingCount} ×</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .admin-stats-grid { grid-template-columns: 1fr 1fr !important; }
          .admin-main-grid  { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .admin-stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function LoadingState() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ height: "60px", background: "white", borderRadius: "12px", animation: "shimmer 1.5s ease-in-out infinite" }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px" }}>
        {[1,2,3,4].map(i => <div key={i} style={{ height: "100px", background: "white", borderRadius: "12px", animation: "shimmer 1.5s ease-in-out infinite" }} />)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "20px" }}>
        <div style={{ height: "400px", background: "white", borderRadius: "12px", animation: "shimmer 1.5s ease-in-out infinite" }} />
        <div style={{ height: "400px", background: "white", borderRadius: "12px", animation: "shimmer 1.5s ease-in-out infinite" }} />
      </div>
      <style>{`
        @keyframes shimmer {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
