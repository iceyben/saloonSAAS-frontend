"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { gsap } from "gsap";
import {
  LayoutDashboard, Calendar, Scissors, Image,
  Star, Clock, LogOut, Menu, X, MessageSquare,
  ChevronRight, Sparkles,
} from "lucide-react";

const NAV = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, color: "#C8837A" },
  { label: "Bookings",  href: "/admin/bookings",  icon: Calendar,         color: "#C9A96E" },
  { label: "Services",  href: "/admin/services",  icon: Scissors,         color: "#9B8EC4" },
  { label: "Gallery",   href: "/admin/gallery",   icon: Image,            color: "#6BB5C9" },
  { label: "Reviews",   href: "/admin/reviews",   icon: Star,             color: "#E8847A" },
  { label: "Hours",     href: "/admin/hours",     icon: Clock,            color: "#7AC98B" },
  { label: "Messages",  href: "/admin/messages",  icon: MessageSquare,    color: "#C9A96E" },
];

export default function AdminLayout({ children }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin]       = useState(null);
  const [open, setOpen]         = useState(false);
  const [checked, setChecked]   = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const sidebarRef  = useRef(null);
  const overlayRef  = useRef(null);
  const contentRef  = useRef(null);
  const logoRef     = useRef(null);
  const navItemsRef = useRef([]);

  const isLoginPage = pathname === "/admin/login";

  // ── Auth check ──────────────────────────────────────────
  useEffect(() => {
    if (isLoginPage) { setChecked(true); return; }
    const token = localStorage.getItem("admin_token");
    const info  = localStorage.getItem("admin_info");
    if (!token) { router.push("/admin/login"); return; }
    if (info) setAdmin(JSON.parse(info));
    setChecked(true);
  }, [pathname]);

  // ── Detect screen size ───────────────────────────────────
  useEffect(() => {
    const check = () => {
      if (window.innerWidth < 1024) setCollapsed(true);
      else setCollapsed(false);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── GSAP: Mobile sidebar open/close ─────────────────────
  useEffect(() => {
    if (isLoginPage) return;
    if (!sidebarRef.current || !overlayRef.current) return;

    if (open) {
      // Show overlay
      gsap.set(overlayRef.current, { display: "block" });
      gsap.fromTo(overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      );
      // Slide sidebar in
      gsap.fromTo(sidebarRef.current,
        { x: -280 },
        { x: 0, duration: 0.35, ease: "power3.out" }
      );
      // Stagger nav items
      gsap.fromTo(navItemsRef.current,
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.3, stagger: 0.05, delay: 0.15, ease: "power2.out" }
      );
    } else {
      gsap.to(overlayRef.current, {
        opacity: 0, duration: 0.25, ease: "power2.in",
        onComplete: () => gsap.set(overlayRef.current, { display: "none" }),
      });
      gsap.to(sidebarRef.current, { x: -280, duration: 0.3, ease: "power3.in" });
    }
  }, [open]);

  // ── GSAP: Page transition on route change ────────────────
  useEffect(() => {
    if (!contentRef.current || isLoginPage) return;
    gsap.fromTo(contentRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
    );
  }, [pathname]);

  // ── GSAP: Desktop sidebar collapse ──────────────────────
  useEffect(() => {
    if (!sidebarRef.current || isLoginPage) return;
    if (window.innerWidth < 1024) return;
    gsap.to(sidebarRef.current, {
      width: collapsed ? 64 : 240,
      duration: 0.3, ease: "power2.inOut",
    });
  }, [collapsed]);

  const logout = () => {
    gsap.to(contentRef.current, {
      opacity: 0, y: -12, duration: 0.3,
      onComplete: () => {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_info");
        router.push("/admin/login");
      },
    });
  };

  if (isLoginPage) return <>{children}</>;

  if (!checked || !admin) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0F0A0A" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-serif)", fontSize: "32px", color: "var(--rose)", marginBottom: "16px", animation: "pulse 2s ease-in-out infinite" }}>✦</div>
        <div style={{ fontSize: "13px", color: "#6B5A5A", letterSpacing: "0.1em", textTransform: "uppercase" }}>Loading...</div>
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.9)} }`}</style>
    </div>
  );

  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0F0A0A", fontFamily: "var(--font-sans)" }}>

      {/* ── Mobile overlay ─────────────────────────────── */}
      <div ref={overlayRef} onClick={() => setOpen(false)} style={{
        display: "none", position: "fixed", inset: 0, zIndex: 90,
        background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
      }} />

      {/* ── Sidebar ────────────────────────────────────── */}
      <aside ref={sidebarRef} style={{
        width: collapsed ? "64px" : "240px",
        flexShrink: 0,
        background: "linear-gradient(180deg, #1A0F0F 0%, #0F0A0A 100%)",
        borderRight: "1px solid rgba(200,131,122,0.15)",
        display: "flex", flexDirection: "column",
        position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 100,
        overflow: "hidden",
        boxShadow: "4px 0 40px rgba(0,0,0,0.4)",
        // Mobile: start off-screen
        ...(typeof window !== "undefined" && window.innerWidth < 1024 ? { transform: "translateX(-280px)" } : {}),
      }}>
        {/* Logo area */}
        <div ref={logoRef} style={{
          padding: "20px 16px",
          borderBottom: "1px solid rgba(200,131,122,0.1)",
          display: "flex", alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          minHeight: "64px",
        }}>
          {!collapsed && (
            <div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "17px", color: "white", letterSpacing: "0.02em" }}>
                Choice <span style={{ color: "var(--rose)" }}>Saloon</span>
              </div>
              <div style={{ fontSize: "10px", color: "#6B5A5A", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: "2px" }}>Admin Panel</div>
            </div>
          )}
          {/* Desktop collapse toggle */}
          <button onClick={() => setCollapsed(!collapsed)}
            className="desktop-collapse-btn"
            style={{ background: "rgba(200,131,122,0.1)", border: "1px solid rgba(200,131,122,0.2)", borderRadius: "6px", cursor: "pointer", padding: "6px", color: "var(--rose)", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(200,131,122,0.2)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(200,131,122,0.1)"}
          >
            <ChevronRight size={14} style={{ transform: collapsed ? "rotate(0deg)" : "rotate(180deg)", transition: "transform 0.3s" }} />
          </button>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto", overflowX: "hidden" }}>
          {NAV.map(({ label, href, icon: Icon, color }, i) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                ref={el => navItemsRef.current[i] = el}
                onClick={() => setOpen(false)}
                title={collapsed ? label : ""}
                style={{
                  display: "flex", alignItems: "center",
                  gap: collapsed ? 0 : "12px",
                  justifyContent: collapsed ? "center" : "flex-start",
                  padding: collapsed ? "12px" : "10px 12px",
                  borderRadius: "8px", marginBottom: "4px",
                  textDecoration: "none", transition: "all 0.2s",
                  background: active
                    ? `linear-gradient(135deg, ${color}22, ${color}11)`
                    : "transparent",
                  border: `1px solid ${active ? color + "33" : "transparent"}`,
                  position: "relative", overflow: "hidden",
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
              >
                {/* Active indicator */}
                {active && (
                  <div style={{ position: "absolute", left: 0, top: "20%", bottom: "20%", width: "2px", borderRadius: "0 2px 2px 0", background: color }} />
                )}
                <Icon size={17} color={active ? color : "#6B5A5A"} style={{ flexShrink: 0, transition: "color 0.2s" }} />
                {!collapsed && (
                  <span style={{ fontSize: "13px", fontWeight: active ? 500 : 400, color: active ? "white" : "#8A7A7A", whiteSpace: "nowrap", transition: "color 0.2s" }}>
                    {label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Admin info + logout */}
        <div style={{ padding: "12px", borderTop: "1px solid rgba(200,131,122,0.1)" }}>
          {!collapsed && admin && (
            <div style={{ padding: "10px 12px", marginBottom: "8px", background: "rgba(255,255,255,0.03)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg, var(--rose), var(--rose-deep))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 600, color: "white", flexShrink: 0 }}>
                  {admin?.name?.[0]?.toUpperCase() || "A"}
                </div>
                <div style={{ overflow: "hidden" }}>
                  <div style={{ fontSize: "13px", color: "white", fontWeight: 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{admin.name || "Admin"}</div>
                  <div style={{ fontSize: "11px", color: "#6B5A5A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{admin.email}</div>
                </div>
              </div>
            </div>
          )}
          <button onClick={logout} title={collapsed ? "Sign out" : ""}
            style={{
              display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start",
              gap: "8px", background: "none", border: "1px solid transparent",
              cursor: "pointer", color: "#6B5A5A", fontSize: "13px",
              padding: collapsed ? "10px" : "10px 12px", borderRadius: "8px", width: "100%",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "#FF6B6B"; e.currentTarget.style.background = "rgba(255,107,107,0.08)"; e.currentTarget.style.borderColor = "rgba(255,107,107,0.15)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#6B5A5A"; e.currentTarget.style.background = "none"; e.currentTarget.style.borderColor = "transparent"; }}
          >
            <LogOut size={15} style={{ flexShrink: 0 }} />
            {!collapsed && "Sign out"}
          </button>
        </div>
      </aside>

      {/* ── Main content ────────────────────────────────── */}
      <main style={{
        flex: 1,
        marginLeft: collapsed ? "64px" : "240px",
        transition: "margin-left 0.3s ease",
        minHeight: "100vh",
        background: "#F7F3F0",
        display: "flex", flexDirection: "column",
      }}>
        {/* Top bar */}
        <div style={{
          background: "white",
          borderBottom: "1px solid var(--border)",
          padding: "0 24px", height: "64px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          position: "sticky", top: 0, zIndex: 40,
          boxShadow: "0 1px 20px rgba(0,0,0,0.06)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* Mobile hamburger */}
            <button className="mobile-menu-btn" onClick={() => setOpen(!open)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--dark)", padding: "4px", display: "none" }}>
              <Menu size={20} />
            </button>

            <div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: 400, color: "var(--dark)" }}>
                {NAV.find(n => n.href === pathname)?.label || "Admin"}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <a href="/style-ai" target="_blank" style={{
              display: "flex", alignItems: "center", gap: "6px",
              fontSize: "12px", color: "var(--rose)", textDecoration: "none",
              fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase",
              padding: "6px 12px", borderRadius: "6px", border: "1px solid var(--rose-light)",
              background: "var(--rose-blush)", transition: "all 0.2s",
            }}>
              <Sparkles size={13} /> Style AI
            </a>
            <a href="/" target="_blank" style={{
              fontSize: "12px", color: "var(--dark-mid)", textDecoration: "none",
              fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase",
              padding: "6px 12px", borderRadius: "6px", border: "1px solid var(--border)",
              transition: "all 0.2s",
            }}>
              View Site ↗
            </a>
            <div style={{
              width: "36px", height: "36px", borderRadius: "50%",
              background: "linear-gradient(135deg, var(--rose), var(--rose-deep))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "13px", fontWeight: 600, color: "white",
              boxShadow: "0 2px 8px rgba(200,131,122,0.4)",
            }}>
              {admin?.name?.[0]?.toUpperCase() || "A"}
            </div>
          </div>
        </div>

        {/* Page content */}
        <div ref={contentRef} style={{ padding: "28px 24px", flex: 1 }}>
          {children}
        </div>
      </main>

      <style>{`
        .desktop-collapse-btn { display: flex !important; }
        .mobile-menu-btn { display: none !important; }

        @media (max-width: 1024px) {
          .desktop-collapse-btn { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          main { margin-left: 0 !important; }
          aside {
            width: 260px !important;
            transform: translateX(-280px);
          }
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(200,131,122,0.3); border-radius: 2px; }
      `}</style>
    </div>
  );
}
