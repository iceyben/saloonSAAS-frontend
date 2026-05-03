import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer style={{
      background: "var(--dark)", color: "white",
      padding: "60px 40px 32px",
    }}>
      <div style={{
        maxWidth: "1200px", margin: "0 auto",
        display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "48px",
        marginBottom: "48px",
      }}>
        <div>
         {/* Logo + Brand */}
<Link href="/" style={{
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
}}>

  {/* Logo */}
  <span style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "22px",
  }}>
    <Image
      src="/logo.png"
      alt="Choice Logo"
      width={45}
      height={45}
      style={{
        objectFit: "contain",
        display: "block",
        marginRight: "-4px",
        transform: "translateY(1px)", // fine tuning
      }}
    />
  </span>

  {/* Text */}
  <span style={{
    fontFamily: "var(--font-serif)",
    fontSize: "22px",
    fontWeight: 400,
    color: "black", // 🔥 important (footer is dark)
    letterSpacing: "0.02em",
    lineHeight: "22px",
  }}>
    hoice <span style={{ color: "var(--rose)" }}>Saloon</span>
  </span>

</Link>


          <p style={{ fontSize: "13px", color: "#B8A8A4", lineHeight: "1.8", fontWeight: 300 }}>
            Luxury beauty services delivered with care and elegance, right from the comfort of home.
          </p>
        </div>

        <div>
          <div style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--rose-light)", marginBottom: "16px" }}>Services</div>
          {["Hair", "Nails", "Makeup", "Braids"].map(s => (
            <Link key={s} href="/services" style={{ display: "block", fontSize: "13px", color: "#B8A8A4", textDecoration: "none", marginBottom: "8px", fontWeight: 300 }}>{s}</Link>
          ))}
        </div>

        <div>
          <div style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--rose-light)", marginBottom: "16px" }}>Quick links</div>
          {[
            { label: "Book appointment", href: "/booking" },
            { label: "Gallery",          href: "/gallery"  },
            { label: "Reviews",          href: "/reviews"  },
            { label: "Contact",          href: "/contact"  },
          ].map(l => (
            <Link key={l.href} href={l.href} style={{ display: "block", fontSize: "13px", color: "#B8A8A4", textDecoration: "none", marginBottom: "8px", fontWeight: 300 }}>{l.label}</Link>
          ))}
        </div>

        <div>
          <div style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--rose-light)", marginBottom: "16px" }}>Hours</div>
          {[
            { day: "Mon – Fri", time: "8:00 – 18:00" },
            { day: "Saturday",  time: "9:00 – 16:00" },
            { day: "Sunday",    time: "Closed"        },
          ].map(h => (
            <div key={h.day} style={{ marginBottom: "8px" }}>
              <div style={{ fontSize: "12px", color: "white", fontWeight: 400 }}>{h.day}</div>
              <div style={{ fontSize: "12px", color: "#B8A8A4", fontWeight: 300 }}>{h.time}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "24px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <p style={{ fontSize: "12px", color: "#6B5A5A", fontWeight: 300 }}>
          © {new Date().getFullYear()} Choice Saloon. All rights reserved.
        </p>
        <a href="https://wa.me/250795656042" style={{
          fontSize: "13px", color: "var(--rose-light)", textDecoration: "none", fontWeight: 400,
        }}>
          WhatsApp us
        </a>
      </div>
    </footer>
  );
}