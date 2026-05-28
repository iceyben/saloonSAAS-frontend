"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { label: "Services", href: "/services" },
    { label: "Gallery", href: "/gallery" },
    { label: "Reviews", href: "/reviews" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: "rgba(251,247,244,0.97)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border)",
          padding: "0 24px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "20px",
            fontWeight: 400,
            color: "var(--dark)",
            textDecoration: "none",
            letterSpacing: "0.02em",
          }}
        >
          <span
            style={{
              position: "flexed ",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              src="/logo1.jpg"
              alt="Choice Saloon"
              width={40}
              height={40}
              style={{
                objectFit: "cover",
              }}
            />
          hoicee's <span style={{ color: "var(--rose)" }}>Salon</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div
          className="desktop-nav"
          style={{ display: "flex", alignItems: "center", gap: "32px" }}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "12px",
                fontWeight: 400,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color:
                  pathname === link.href ? "var(--rose)" : "var(--dark-mid)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/booking"
            className="btn-primary"
            style={{ padding: "10px 22px", fontSize: "12px" }}
          >
            Book Now
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="mobile-menu-btn"
          onClick={() => setOpen(!open)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--dark)",
            padding: "4px",
          }}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div
          style={{
            position: "fixed",
            top: "64px",
            left: 0,
            right: 0,
            zIndex: 99,
            background: "rgba(251,247,244,0.98)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid var(--border)",
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "14px",
                fontWeight: 400,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color:
                  pathname === link.href ? "var(--rose)" : "var(--dark-mid)",
                textDecoration: "none",
                padding: "12px 0",
                borderBottom: "1px solid var(--border)",
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/booking"
            onClick={() => setOpen(false)}
            className="btn-primary"
            style={{
              marginTop: "12px",
              justifyContent: "center",
              padding: "14px",
              fontSize: "13px",
            }}
          >
            Book Appointment
          </Link>
          <Link
            href="/admin/login"
            onClick={() => setOpen(false)}
            style={{
              textAlign: "center",
              fontSize: "11px",
              color: "var(--dark-mid)",
              textDecoration: "none",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              opacity: 0.4,
              marginTop: "8px",
            }}
          >
            Owner login →
          </Link>
        </div>
      )}

      <style>{`
        .mobile-menu-btn { display: none !important; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </>
  );
}
