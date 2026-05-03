"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const CATEGORIES = ["All", "Hair", "Nails", "Makeup"];
const categoryColors = { Hair: "var(--rose)", Nails: "var(--gold)", Makeup: "var(--rose-deep)" };

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [active, setActive]     = useState("All");
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    axios.get(`${API}/services`)
      .then(r => setServices(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = active === "All" ? services : services.filter(s => s.category === active);

  return (
    <div style={{ paddingTop: "72px" }}>
      {/* Header */}
      <section style={{
        padding: "80px 40px 60px",
        background: `linear-gradient(135deg, var(--cream), var(--rose-blush))`,
        textAlign: "center", borderBottom: "1px solid var(--border)",
      }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="section-tag" style={{ justifyContent: "center" }}>What we offer</div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 300, marginBottom: "16px" }}>
            Our Services
          </h1>
          <p style={{ fontSize: "15px", color: "var(--dark-mid)", fontWeight: 300, maxWidth: "500px", margin: "0 auto 40px" }}>
            Professional beauty services tailored to you, delivered at home.
          </p>

          {/* Category filter */}
          <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActive(cat)} style={{
                padding: "10px 24px", borderRadius: "2px", cursor: "pointer",
                fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 500,
                letterSpacing: "0.08em", textTransform: "uppercase", transition: "all 0.2s",
                background: active === cat ? "var(--rose)" : "white",
                color: active === cat ? "white" : "var(--dark-mid)",
                border: active === cat ? "1px solid var(--rose)" : "1px solid var(--border)",
              }}>
                {cat}
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Services Grid */}
      <section style={{ padding: "80px 40px", background: "var(--cream)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px", color: "var(--dark-mid)" }}>Loading services...</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
              {filtered.map((s, i) => (
                <motion.div key={s.id}
                  className="card-salon"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  style={{ padding: "36px" }}
                >
                  <div style={{
                    width: "100%", height: "4px", borderRadius: "2px",
                    background: categoryColors[s.category] || "var(--rose)",
                    marginBottom: "24px",
                  }} />
                  <div style={{
                    fontSize: "11px", fontWeight: 500, letterSpacing: "0.12em",
                    textTransform: "uppercase", color: categoryColors[s.category] || "var(--rose)",
                    marginBottom: "10px",
                  }}>
                    {s.category}
                  </div>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", fontWeight: 400, marginBottom: "12px" }}>
                    {s.name}
                  </h3>
                  <p style={{ fontSize: "13px", color: "var(--dark-mid)", fontWeight: 300, lineHeight: "1.7", marginBottom: "24px" }}>
                    {s.description || "Professional service delivered with care and expertise."}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "20px", borderTop: "1px solid var(--border)" }}>
                    <div>
                      <div style={{ fontFamily: "var(--font-serif)", fontSize: "28px", color: "var(--rose)", lineHeight: 1 }}>${s.price}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "var(--dark-mid)", marginTop: "4px" }}>
                        <Clock size={12} /> {s.duration} minutes
                      </div>
                    </div>
                    <a href={`/booking?serviceId=${s.id}`} className="btn-primary" style={{ padding: "10px 20px", fontSize: "12px" }}>
                      Book <ArrowRight size={14} />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}