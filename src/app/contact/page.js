// src/app/contact/page.js
"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Phone, MessageCircle, Clock, Send } from "lucide-react";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function ContactPage() {
  const [submitted, setSubmitted]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await axios.post(`${API}/contact`, data);
      setSubmitted(true);
      reset();
    } catch {
      alert("Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ paddingTop: "72px" }}>
      <section style={{ padding: "80px 40px 60px", background: "linear-gradient(135deg, var(--cream), var(--rose-blush))", textAlign: "center", borderBottom: "1px solid var(--border)" }}>
        <div className="section-tag" style={{ justifyContent: "center" }}>Get in touch</div>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 300 }}>Contact Us</h1>
        <p style={{ fontSize: "15px", color: "var(--dark-mid)", fontWeight: 300, marginTop: "12px" }}>We'd love to hear from you.</p>
      </section>

      <section style={{ padding: "80px 40px", background: "var(--cream)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "80px" }}>
          {/* Info */}
          <div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: 300, marginBottom: "32px" }}>How to Reach Us</h2>
            {[
              { icon: <Phone size={20} />, label: "Phone / WhatsApp", value: "+250 700 000 000", href: "tel:+250700000000" },
              { icon: <MessageCircle size={20} />, label: "WhatsApp", value: "Chat with us now", href: "https://wa.me/250700000000" },
              { icon: <Clock size={20} />, label: "Working Hours", value: "Mon–Fri 8:00–18:00\nSat 9:00–16:00\nSun Closed", href: null },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "16px", marginBottom: "28px", alignItems: "flex-start" }}>
                <div style={{ width: "44px", height: "44px", background: "var(--rose-blush)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--rose)", flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--dark-mid)", marginBottom: "4px" }}>{item.label}</div>
                  {item.href ? (
                    <a href={item.href} style={{ fontSize: "15px", color: "var(--rose)", textDecoration: "none", fontWeight: 400 }}>{item.value}</a>
                  ) : (
                    <div style={{ fontSize: "14px", color: "var(--dark)", fontWeight: 300, whiteSpace: "pre-line", lineHeight: "1.7" }}>{item.value}</div>
                  )}
                </div>
              </div>
            ))}

            {/* Map embed */}
            <div style={{ marginTop: "40px", borderRadius: "4px", overflow: "hidden", border: "1px solid var(--border)" }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63800.02064730895!2d30.0187!3d-1.9441!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca4258ed8e797%3A0xa0d3281ffd763b35!2sKigali!5e0!3m2!1sen!2srw!4v1234567890"
                width="100%" height="220" style={{ border: 0, display: "block" }}
                allowFullScreen loading="lazy"
              />
            </div>
          </div>

          {/* Form */}
          <div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: 300, marginBottom: "32px" }}>Send a Message</h2>
            {submitted ? (
              <div style={{ background: "var(--rose-blush)", border: "1px solid var(--rose-light)", borderRadius: "4px", padding: "40px", textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: "40px", color: "var(--rose)", marginBottom: "12px" }}>✦</div>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", marginBottom: "8px" }}>Message Sent!</h3>
                <p style={{ fontSize: "14px", color: "var(--dark-mid)", fontWeight: 300 }}>We'll get back to you as soon as possible.</p>
                <button onClick={() => setSubmitted(false)} className="btn-outline" style={{ marginTop: "20px", fontSize: "12px" }}>Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--dark-mid)", marginBottom: "8px" }}>Name *</label>
                    <input {...register("name", { required: "Name is required" })} className="input-salon" placeholder="Your name" />
                    {errors.name && <p style={{ fontSize: "12px", color: "var(--rose-deep)", marginTop: "4px" }}>{errors.name.message}</p>}
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--dark-mid)", marginBottom: "8px" }}>Phone</label>
                    <input {...register("phone")} className="input-salon" placeholder="+250 700 000 000" />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--dark-mid)", marginBottom: "8px" }}>Email</label>
                  <input {...register("email")} className="input-salon" placeholder="your@email.com" />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--dark-mid)", marginBottom: "8px" }}>Message *</label>
                  <textarea {...register("message", { required: "Message is required" })} className="input-salon" rows={6} placeholder="How can we help you?" style={{ resize: "vertical" }} />
                  {errors.message && <p style={{ fontSize: "12px", color: "var(--rose-deep)", marginTop: "4px" }}>{errors.message.message}</p>}
                </div>

                <button type="submit" disabled={submitting} className="btn-primary" style={{ opacity: submitting ? 0.7 : 1 }}>
                  {submitting ? "Sending..." : <><Send size={16} /> Send Message</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}