import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "var(--dark)", color: "white", padding: "60px 24px 32px" }}>
      <div className="footer-grid" style={{
        maxWidth: "1200px", margin: "0 auto",
        display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "40px",
        marginBottom: "40px",
      }}>
        <div>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: "24px", fontWeight: 400, marginBottom: "14px" }}>
            Choicee' <span style={{ color: "var(--rose-light)" }}>Saloon</span>
          </div>
          <p style={{ fontSize: "13px", color: "#B8A8A4", lineHeight: "1.8", fontWeight: 300 }}>
            Luxury beauty services delivered with care and elegance, right from the comfort of home.
          </p>
        </div>

        <div>
          <div style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--rose-light)", marginBottom: "14px" }}>Services</div>
          {["Hair", "Nails", "Makeup", "Braids"].map(s => (
            <Link key={s} href="/services" style={{ display: "block", fontSize: "13px", color: "#B8A8A4", textDecoration: "none", marginBottom: "8px", fontWeight: 300 }}>{s}</Link>
          ))}
        </div>

        <div>
          <div style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--rose-light)", marginBottom: "14px" }}>Links</div>
          {[
            { label: "Book now", href: "/booking" },
            { label: "Gallery",  href: "/gallery"  },
            { label: "Reviews",  href: "/reviews"  },
            { label: "Contact",  href: "/contact"  },
          ].map(l => (
            <Link key={l.href} href={l.href} style={{ display: "block", fontSize: "13px", color: "#B8A8A4", textDecoration: "none", marginBottom: "8px", fontWeight: 300 }}>{l.label}</Link>
          ))}
        </div>

        <div>
          <div style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--rose-light)", marginBottom: "14px" }}>Hours</div>
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
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px",
      }}>
        <p style={{ fontSize: "12px", color: "#6B5A5A", fontWeight: 300 }}>
          © {new Date().getFullYear()} Choice Saloon. All rights reserved.
        </p>
        <a href="https://wa.me/250700000000" style={{ fontSize: "13px", color: "var(--rose-light)", textDecoration: "none", fontWeight: 400 }}>
          WhatsApp us
        </a>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
