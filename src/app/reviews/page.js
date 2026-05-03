// ============================================================
// src/app/reviews/page.js
// ============================================================
"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Star, Send } from "lucide-react";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function ReviewsPage() {
  const [reviews, setReviews]   = useState([]);
  const [rating, setRating]     = useState(5);
  const [hover, setHover]       = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    axios.get(`${API}/reviews`).then(r => setReviews(r.data)).catch(() => {});
  }, []);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await axios.post(`${API}/reviews`, { ...data, rating });
      setSubmitted(true);
      reset();
      setRating(5);
    } catch {
      alert("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ paddingTop: "72px" }}>
      <section style={{ padding: "80px 40px 60px", background: "linear-gradient(135deg, var(--cream), var(--rose-blush))", textAlign: "center", borderBottom: "1px solid var(--border)" }}>
        <div className="section-tag" style={{ justifyContent: "center" }}>Testimonials</div>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 300 }}>Client Reviews</h1>
      </section>

      <section style={{ padding: "80px 40px", background: "var(--cream)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px" }}>
          {/* Reviews list */}
          <div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: 300, marginBottom: "32px" }}>What People Say</h2>
            {reviews.length === 0 ? (
              <p style={{ fontSize: "14px", color: "var(--dark-mid)", fontWeight: 300 }}>No reviews yet. Be the first to share your experience!</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {reviews.map((r, i) => (
                  <motion.div key={r.id}
                    initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                    style={{ background: "white", border: "1px solid var(--border)", borderRadius: "4px", padding: "28px" }}
                  >
                    <div style={{ display: "flex", gap: "4px", marginBottom: "12px" }}>
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} size={14} fill={j < r.rating ? "var(--gold)" : "transparent"} color={j < r.rating ? "var(--gold)" : "var(--border)"} />
                      ))}
                    </div>
                    <p style={{ fontSize: "14px", fontWeight: 300, color: "var(--dark-mid)", lineHeight: "1.8", marginBottom: "16px", fontStyle: "italic" }}>"{r.feedback}"</p>
                    <div style={{ fontFamily: "var(--font-serif)", fontSize: "16px" }}>{r.customerName}</div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Leave a review form */}
          <div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: 300, marginBottom: "32px" }}>Leave a Review</h2>
            {submitted ? (
              <div style={{ background: "var(--rose-blush)", border: "1px solid var(--rose-light)", borderRadius: "4px", padding: "32px", textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: "32px", color: "var(--rose)", marginBottom: "12px" }}>✦</div>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "22px", marginBottom: "8px" }}>Thank You!</h3>
                <p style={{ fontSize: "14px", color: "var(--dark-mid)", fontWeight: 300 }}>Your review has been submitted and is awaiting approval.</p>
                <button onClick={() => setSubmitted(false)} className="btn-outline" style={{ marginTop: "20px", fontSize: "12px" }}>Write Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--dark-mid)", marginBottom: "8px" }}>Your Name *</label>
                  <input {...register("customerName", { required: "Name is required" })} className="input-salon" placeholder="Your full name" />
                  {errors.customerName && <p style={{ fontSize: "12px", color: "var(--rose-deep)", marginTop: "4px" }}>{errors.customerName.message}</p>}
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--dark-mid)", marginBottom: "12px" }}>Rating *</label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button key={i} type="button"
                        onClick={() => setRating(i + 1)}
                        onMouseEnter={() => setHover(i + 1)}
                        onMouseLeave={() => setHover(0)}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                      >
                        <Star size={28} fill={(hover || rating) > i ? "var(--gold)" : "transparent"} color={(hover || rating) > i ? "var(--gold)" : "var(--border)"} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--dark-mid)", marginBottom: "8px" }}>Your Feedback *</label>
                  <textarea {...register("feedback", { required: "Feedback is required" })} className="input-salon" rows={5} placeholder="Tell us about your experience..." style={{ resize: "vertical" }} />
                  {errors.feedback && <p style={{ fontSize: "12px", color: "var(--rose-deep)", marginTop: "4px" }}>{errors.feedback.message}</p>}
                </div>

                <button type="submit" disabled={submitting} className="btn-primary" style={{ opacity: submitting ? 0.7 : 1 }}>
                  {submitting ? "Submitting..." : <><Send size={16} /> Submit Review</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}