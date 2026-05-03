"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(251,247,244,0.95)", backdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--border)",
      padding: "0 40px", height: "72px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      
      {/* Logo + Brand */}
      <Link href="/" style={{
        display: "flex",// 🔥 key change
        alignItems: "center", 
        textDecoration: "none",
      }}>
        
        {/* Logo replaces "C" */}
        <Image
          src="/logo.png"
          alt="Choice Logo"
          width={45}   // 🔥 reduced size
          height={45}
          style={{
            objectFit: "contain",
            transform: "translateY(2px)", // 🔥 fine vertical alignment
            marginRight: "-3px", // 🔥 tight connection to text
          }}
        />

        {/* Remaining text */}
        <span style={{
          fontFamily: "var(--font-serif)",
          fontSize: "22px",
          fontWeight: 400,
          color: "var(--dark)",
          letterSpacing: "0.02em",
          lineHeight: 1, // 🔥 prevents vertical shift
        }}>
          hoice <span style={{ color: "var(--rose)" }}>Saloon</span>
        </span>
      </Link>

      {/* Navigation */}
      <div style={{ display: "flex", alignItems: "center", gap: "36px" }}>
        {[
          { label: "Services", href: "/services" },
          { label: "Gallery",  href: "/gallery"  },
          { label: "Reviews",  href: "/reviews"  },
          { label: "Contact",  href: "/contact"  },
        ].map((link) => (
          <Link key={link.href} href={link.href} style={{
            fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 400,
            letterSpacing: "0.08em", textTransform: "uppercase",
            color: pathname === link.href ? "var(--rose)" : "var(--dark-mid)",
            textDecoration: "none", transition: "color 0.2s",
          }}>
            {link.label}
          </Link>
        ))}

        <Link href="/booking" className="btn-primary" style={{ padding: "10px 24px" }}>
          Book Now
        </Link>
      </div>
    </nav>
  );
}