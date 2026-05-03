"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Star, Clock, ChevronRight } from "lucide-react";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const fade = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.12 } } };

export default function HomePage() {
  const [services, setServices] = useState([]);
  const [reviews, setReviews]   = useState([]);

  useEffect(() => {
    axios.get(`${API}/services`).then(r => setServices(r.data.slice(0, 6))).catch(() => {});
    axios.get(`${API}/reviews`).then(r => setReviews(r.data.slice(0, 3))).catch(() => {});
  }, []);

  return (
    <div style={{ paddingTop: "72px" }}>
      <Hero />
      <Features />
      <ServicesPreview services={services} />
      <GalleryTeaser />
      <ReviewsPreview reviews={reviews} />
      <CTA />
    </div>
  );
}

// ── Hero ────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{
      minHeight: "92vh", display: "flex", alignItems: "center",
      background: `linear-gradient(135deg, var(--cream) 0%, var(--rose-blush) 60%, var(--beige) 100%)`,
      padding: "80px 40px", position: "relative", overflow: "hidden",
    }}>
      {/* Decorative circles */}
      <div style={{
        position: "absolute", top: "-80px", right: "-80px",
        width: "400px", height: "400px", borderRadius: "50%",
        border: "1px solid var(--rose-light)", opacity: 0.4, pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", top: "40px", right: "40px",
        width: "260px", height: "260px", borderRadius: "50%",
        border: "1px solid var(--rose-light)", opacity: 0.3, pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-60px", left: "30%",
        width: "200px", height: "200px", borderRadius: "50%",
        background: "var(--rose-blush)", opacity: 0.5, pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
        <motion.div initial="hidden" animate="show" variants={stagger}>
          <motion.div variants={fade} className="section-tag">
            Premium Salon Services
          </motion.div>

          <motion.h1 variants={fade} style={{
            fontFamily: "var(--font-serif)", fontSize: "clamp(48px, 6vw, 80px)",
            fontWeight: 300, lineHeight: 1.1, color: "var(--dark)",
            marginBottom: "24px",
          }}>
            Where Beauty<br />
            <em style={{ color: "var(--rose)", fontStyle: "italic" }}>Meets Elegance</em>
          </motion.h1>

          <motion.p variants={fade} style={{
            fontSize: "16px", fontWeight: 300, color: "var(--dark-mid)",
            lineHeight: "1.8", maxWidth: "460px", marginBottom: "40px",
          }}>
            Experience luxury hair, nail, and makeup services from the comfort of home. 
            Professional results, personal touch — every single time.
          </motion.p>

          <motion.div variants={fade} style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <a href="/booking" className="btn-primary">
              Book Appointment <ArrowRight size={16} />
            </a>
            <a href="/services" className="btn-outline">
              Our Services
            </a>
          </motion.div>

          <motion.div variants={fade} style={{
            display: "flex", gap: "40px", marginTop: "56px",
            paddingTop: "40px", borderTop: "1px solid var(--border)",
          }}>
            {[
              { num: "50+", label: "Happy clients" },
              { num: "8",    label: "Services offered" },
              { num: "5★",   label: "Average rating"  },
            ].map(s => (
              <div key={s.num}>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: "32px", fontWeight: 400, color: "var(--rose)" }}>{s.num}</div>
                <div style={{ fontSize: "12px", fontWeight: 400, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--dark-mid)" }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right side image placeholder with styled card */}
        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
          <div style={{
            background: "white", borderRadius: "4px", padding: "8px",
            border: "1px solid var(--border)",
            boxShadow: "0 24px 80px rgba(200,131,122,0.15)",
          }}>
            <div style={{
              background: `linear-gradient(135deg, var(--rose-blush), var(--beige))`,
              borderRadius: "2px", height: "480px",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexDirection: "column", gap: "16px",
            }}>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "48px", color: "var(--rose-light)" }}>✦</div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "20px", color: "var(--dark-mid)", fontStyle: "italic" }}>Choice Saloon</div>
              <div style={{ fontSize: "12px", color: "var(--rose)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Add your hero photo here</div>
            </div>

            {/* Floating badge */}
            <div style={{
              position: "relative", marginTop: "-24px", marginLeft: "24px",
              background: "white", border: "1px solid var(--border)",
              borderRadius: "4px", padding: "12px 20px", width: "fit-content",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#4CAF50" }} />
                <span style={{ fontSize: "13px", fontWeight: 400, color: "var(--dark)" }}>Available for booking today</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Features ────────────────────────────────────────────────────────────
function Features() {
  const items = [
    { icon: "◈", title: "Expert stylists", desc: "Trained professionals with years of experience" },
    { icon: "◉", title: "Premium products", desc: "Only top-quality products used on every client" },
    { icon: "◎", title: "Flexible booking", desc: "Choose your time, we work around your schedule" },
     ];

  return (
    <section style={{ background: "white", padding: "80px 40px", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "40px" }}>
        {items.map((item, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            style={{ textAlign: "center" }}
          >
            <div style={{ fontSize: "24px", color: "var(--rose)", marginBottom: "12px" }}>{item.icon}</div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: "18px", marginBottom: "8px" }}>{item.title}</div>
            <div style={{ fontSize: "13px", color: "var(--dark-mid)", fontWeight: 300, lineHeight: "1.6" }}>{item.desc}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ── Services Preview ────────────────────────────────────────────────────
function ServicesPreview({ services }) {
  const categoryColors = { Hair: "var(--rose)", Nails: "var(--gold)", Makeup: "var(--rose-deep)" };

  return (
    <section style={{ padding: "100px 40px", background: "var(--cream)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <div className="section-tag" style={{ justifyContent: "center" }}>What we offer</div>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 300, marginBottom: "16px" }}>
            Our Services
          </h2>
          <p style={{ fontSize: "15px", color: "var(--dark-mid)", fontWeight: 300, maxWidth: "500px", margin: "0 auto" }}>
            From everyday glam to bridal perfection — we have everything you need.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", marginBottom: "48px" }}>
          {services.map((s, i) => (
            <motion.div key={s.id}
              className="card-salon"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              style={{ padding: "32px" }}
            >
              <div style={{
                width: "4px", height: "32px", borderRadius: "2px",
                background: categoryColors[s.category] || "var(--rose)",
                marginBottom: "20px",
              }} />
              <div style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: categoryColors[s.category] || "var(--rose)", marginBottom: "8px" }}>
                {s.category}
              </div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "22px", marginBottom: "8px" }}>{s.name}</div>
              <div style={{ fontSize: "13px", color: "var(--dark-mid)", fontWeight: 300, marginBottom: "20px", lineHeight: "1.6" }}>{s.description}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: "24px", color: "var(--rose)" }}>${s.price}</div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "var(--dark-mid)" }}>
                  <Clock size={12} /> {s.duration} min
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <a href="/services" className="btn-outline">
            View all services <ChevronRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}

// ── Gallery Teaser ──────────────────────────────────────────────────────
function GalleryTeaser() {
  return (
    <section style={{ padding: "100px 40px", background: "var(--rose-blush)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
        <div>
          <div className="section-tag">Our work</div>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 300, marginBottom: "24px" }}>
            Beauty That<br /><em style={{ color: "var(--rose)", fontStyle: "italic" }}>Speaks for Itself</em>
          </h2>
          <p style={{ fontSize: "15px", color: "var(--dark-mid)", fontWeight: 300, lineHeight: "1.8", marginBottom: "32px" }}>
            Browse our portfolio of hair, nail, and makeup transformations. Every look is crafted with precision and passion.
          </p>
          <a href="/gallery" className="btn-primary">View Gallery <ArrowRight size={16} /></a>
        </div>

        {/* Gallery grid placeholder */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{
              background: i % 2 === 0 ? "var(--beige)" : "var(--rose-light)",
              borderRadius: "4px", height: i === 1 ? "220px" : "180px",
              display: "flex", alignItems: "center", justifyContent: "center",
              opacity: 0.7,
            }}>
              <span style={{ fontFamily: "var(--font-serif)", fontSize: "13px", color: "var(--dark-mid)", fontStyle: "italic" }}>Photo {i}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Reviews Preview ─────────────────────────────────────────────────────
function ReviewsPreview({ reviews }) {
  return (
    <section style={{ padding: "100px 40px", background: "white" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <div className="section-tag" style={{ justifyContent: "center" }}>Testimonials</div>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 300 }}>
            What Clients Say
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", marginBottom: "48px" }}>
          {reviews.length > 0 ? reviews.map((r, i) => (
            <motion.div key={r.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{
                background: "var(--cream)", border: "1px solid var(--border)",
                borderRadius: "4px", padding: "32px",
              }}
            >
              <div style={{ display: "flex", gap: "4px", marginBottom: "16px" }}>
                {Array.from({ length: r.rating }).map((_, j) => (
                  <Star key={j} size={14} fill="var(--gold)" color="var(--gold)" />
                ))}
              </div>
              <p style={{ fontSize: "14px", fontWeight: 300, color: "var(--dark-mid)", lineHeight: "1.8", marginBottom: "20px", fontStyle: "italic" }}>
                "{r.feedback}"
              </p>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "16px", color: "var(--dark)" }}>{r.customerName}</div>
            </motion.div>
          )) : (
            // Placeholder reviews
            [
              { name: "Amira K.",    text: "Absolutely stunning braids! The service was so professional and done right at my home. Will definitely book again.", rating: 5 },
              { name: "Grace M.",    text: "My gel nails lasted over 3 weeks and looked perfect the entire time. Highly recommend Choice Saloon!", rating: 5 },
              { name: "Fatima N.",   text: "The bridal makeup was everything I dreamed of. I felt like royalty on my wedding day. Thank you!", rating: 5 },
            ].map((r, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{ background: "var(--cream)", border: "1px solid var(--border)", borderRadius: "4px", padding: "32px" }}
              >
                <div style={{ display: "flex", gap: "4px", marginBottom: "16px" }}>
                  {Array.from({ length: r.rating }).map((_, j) => (
                    <Star key={j} size={14} fill="var(--gold)" color="var(--gold)" />
                  ))}
                </div>
                <p style={{ fontSize: "14px", fontWeight: 300, color: "var(--dark-mid)", lineHeight: "1.8", marginBottom: "20px", fontStyle: "italic" }}>"{r.text}"</p>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: "16px", color: "var(--dark)" }}>{r.name}</div>
              </motion.div>
            ))
          )}
        </div>

        <div style={{ textAlign: "center" }}>
          <a href="/reviews" className="btn-outline">Read all reviews <ChevronRight size={16} /></a>
        </div>
      </div>
    </section>
  );
}

// ── CTA ─────────────────────────────────────────────────────────────────
function CTA() {
  return (
    <section style={{
      padding: "100px 40px",
      background: `linear-gradient(135deg, var(--dark) 0%, #5C3A3A 100%)`,
      textAlign: "center",
    }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ maxWidth: "600px", margin: "0 auto" }}
      >
        <div style={{ fontFamily: "var(--font-serif)", fontSize: "48px", color: "var(--rose-light)", marginBottom: "8px" }}>✦</div>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 300, color: "white", marginBottom: "20px" }}>
          Ready to Look<br /><em style={{ color: "var(--rose-light)", fontStyle: "italic" }}>Your Best?</em>
        </h2>
        <p style={{ fontSize: "15px", color: "#B8A8A4", fontWeight: 300, marginBottom: "40px", lineHeight: "1.8" }}>
          Book your appointment in minutes. We'll take care of everything else.
        </p>
        <a href="/booking" className="btn-primary" style={{ fontSize: "14px", padding: "16px 40px" }}>
          Book Your Appointment <ArrowRight size={16} />
        </a>
      </motion.div>
    </section>
  );
}