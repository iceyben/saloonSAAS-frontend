"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, Calendar, Scissors, Image,
  Star, Clock, LogOut, Menu, X, MessageSquare
} from "lucide-react";

const NAV = [
  { label: "Dashboard",    href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Bookings",     href: "/admin/bookings",  icon: Calendar        },
  { label: "Services",     href: "/admin/services",  icon: Scissors        },
  { label: "Gallery",      href: "/admin/gallery",   icon: Image           },
  { label: "Reviews",      href: "/admin/reviews",   icon: Star            },
  { label: "Hours",        href: "/admin/hours",     icon: Clock           },
  { label: "Messages",     href: "/admin/messages",  icon: MessageSquare   },
];

export default function AdminLayout({ children }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin]         = useState(null);
  const [sidebarOpen, setSidebar] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const info  = localStorage.getItem("admin_info");
    if (!token) { router.push("/admin/login"); return; }
    if (info) setAdmin(JSON.parse(info));
  }, []);

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_info");
    router.push("/admin/login");
  };

  if (!admin && pathname !== "/admin/login") return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--cream)" }}>
      <div style={{ fontFamily: "var(--font-serif)", fontSize: "20px", color: "var(--dark-mid)" }}>Loading...</div>
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F5F5F5" }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? "240px" : "64px", flexShrink: 0,
        background: "var(--dark)", transition: "width 0.2s",
        display: "flex", flexDirection: "column",
        position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50,
        overflow: "hidden",
      }}>
        {/* Logo */}
        <div style={{ padding: "24px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {sidebarOpen && (
            <div style={{ fontFamily: "var(--font-serif)", fontSize: "18px", color: "white", whiteSpace: "nowrap" }}>
              Choice <span style={{ color: "var(--rose-light)" }}>Saloon</span>
            </div>
          )}
          <button onClick={() => setSidebar(!sidebarOpen)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#B8A8A4", padding: "4px", flexShrink: 0 }}>
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: "16px 8px", overflowY: "auto" }}>
          {NAV.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "10px 12px", borderRadius: "6px", marginBottom: "4px",
                textDecoration: "none", transition: "background 0.15s",
                background: active ? "rgba(200,131,122,0.2)" : "transparent",
                color: active ? "var(--rose-light)" : "#B8A8A4",
                whiteSpace: "nowrap",
              }}>
                <Icon size={18} style={{ flexShrink: 0 }} />
                {sidebarOpen && <span style={{ fontSize: "13px", fontWeight: 400 }}>{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Admin info + logout */}
        <div style={{ padding: "16px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          {sidebarOpen && admin && (
            <div style={{ marginBottom: "12px" }}>
              <div style={{ fontSize: "13px", color: "white", fontWeight: 400 }}>{admin.name || "Admin"}</div>
              <div style={{ fontSize: "11px", color: "#6B5A5A" }}>{admin.email}</div>
            </div>
          )}
          <button onClick={logout} style={{
            display: "flex", alignItems: "center", gap: "8px",
            background: "none", border: "none", cursor: "pointer",
            color: "#6B5A5A", fontSize: "13px", padding: "8px 12px",
            borderRadius: "6px", width: "100%", transition: "color 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--rose-light)"}
          onMouseLeave={e => e.currentTarget.style.color = "#6B5A5A"}
          >
            <LogOut size={16} />
            {sidebarOpen && "Sign out"}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{
        flex: 1, marginLeft: sidebarOpen ? "240px" : "64px",
        transition: "margin-left 0.2s", minHeight: "100vh",
        background: "#F5F5F5",
      }}>
        {/* Top bar */}
        <div style={{
          background: "white", borderBottom: "1px solid var(--border)",
          padding: "0 32px", height: "64px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          position: "sticky", top: 0, zIndex: 40,
        }}>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: 400, color: "var(--dark)" }}>
            {NAV.find(n => n.href === pathname)?.label || "Admin"}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <a href="/" target="_blank" style={{ fontSize: "12px", color: "var(--rose)", textDecoration: "none", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              View Site ↗
            </a>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--rose-blush)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 500, color: "var(--rose)" }}>
              {admin?.name?.[0] || "A"}
            </div>
          </div>
        </div>

        <div style={{ padding: "32px" }}>
          {children}
        </div>
      </main>
    </div>
  );
}