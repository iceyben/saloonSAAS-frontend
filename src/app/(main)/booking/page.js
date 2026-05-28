"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Clock, ChevronLeft, ChevronRight, Upload, CheckCircle } from "lucide-react";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const schema = z.object({
  customerName:  z.string().min(2, "Name is required"),
  customerPhone: z.string().min(8, "Valid phone number required"),
  customerEmail: z.string().email("Valid email required").optional().or(z.literal("")),
  notes:         z.string().optional(),
  paymentMethod: z.enum(["CASH", "MOMO"]),
});

export default function BookingPage() {
  return (
    <Suspense fallback={<div style={{ paddingTop: "120px", textAlign: "center" }}>Loading...</div>}>
      <BookingContent />
    </Suspense>
  );
}

function BookingContent() {
  const searchParams = useSearchParams();
  const [step, setStep]             = useState(1);
  const [services, setServices]     = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate]       = useState("");
  const [selectedSlot, setSelectedSlot]       = useState("");
  const [slots, setSlots]           = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [screenshot, setScreenshot] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [booking, setBooking]       = useState(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { paymentMethod: "CASH" },
  });
  const paymentMethod = watch("paymentMethod");

  useEffect(() => {
    axios.get(`${API}/services`).then(r => {
      setServices(r.data);
      const preselect = searchParams.get("serviceId");
      if (preselect) {
        const found = r.data.find(s => s.id === parseInt(preselect));
        if (found) { setSelectedService(found); setStep(2); }
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedDate || !selectedService) return;
    setSlotsLoading(true);
    axios.get(`${API}/bookings/slots`, { params: { date: selectedDate, serviceId: selectedService.id } })
      .then(r => setSlots(r.data.slots || []))
      .catch(() => setSlots([]))
      .finally(() => setSlotsLoading(false));
  }, [selectedDate, selectedService]);

  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i + 1); return d;
  });

  const onSubmit = async (data) => {
    if (!selectedService || !selectedSlot) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => v && formData.append(k, v));
      formData.append("serviceId", selectedService.id);
      formData.append("appointmentDate", selectedSlot);
      if (screenshot) formData.append("paymentScreenshot", screenshot);
      const res = await axios.post(`${API}/bookings`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      setBooking(res.data.booking);
      setStep(4);
    } catch (err) {
      alert(err.response?.data?.error || "Booking failed. Please try again.");
    } finally { setSubmitting(false); }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  const formatTime = (iso) => new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

  return (
    <div style={{ paddingTop: "64px", minHeight: "100vh", background: "var(--cream)" }}>
      <section style={{ padding: "60px 24px 40px", background: `linear-gradient(135deg, var(--cream), var(--rose-blush))`, borderBottom: "1px solid var(--border)", textAlign: "center" }}>
        <div className="section-tag" style={{ justifyContent: "center" }}>Appointment</div>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(32px, 4vw, 56px)", fontWeight: 300 }}>Book Your Visit</h1>
        {step < 4 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "32px", flexWrap: "wrap" }}>
            {["Service", "Date & Time", "Your Details"].map((label, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: step >= i + 1 ? "var(--rose)" : "var(--border)", color: step >= i + 1 ? "white" : "var(--dark-mid)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 500 }}>
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                <span style={{ fontSize: "12px", fontWeight: 400, letterSpacing: "0.06em", textTransform: "uppercase", color: step === i + 1 ? "var(--rose)" : "var(--dark-mid)" }}>{label}</span>
                {i < 2 && <div style={{ width: "32px", height: "1px", background: "var(--border)" }} />}
              </div>
            ))}
          </div>
        )}
      </section>

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "48px 24px" }}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: 300, marginBottom: "32px" }}>Choose a Service</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }} className="booking-details-grid">
                {services.map(s => (
                  <div key={s.id} onClick={() => { setSelectedService(s); setStep(2); }}
                    style={{ background: "white", border: `2px solid ${selectedService?.id === s.id ? "var(--rose)" : "var(--border)"}`, borderRadius: "4px", padding: "24px", cursor: "pointer", transition: "all 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "var(--rose)"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = selectedService?.id === s.id ? "var(--rose)" : "var(--border)"}
                  >
                    <div style={{ fontFamily: "var(--font-serif)", fontSize: "20px", marginBottom: "6px" }}>{s.name}</div>
                    <div style={{ fontSize: "12px", color: "var(--dark-mid)", marginBottom: "16px" }}>{s.category}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontFamily: "var(--font-serif)", fontSize: "22px", color: "var(--rose)" }}>${s.price}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "var(--dark-mid)" }}><Clock size={12} /> {s.duration} min</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
                <button onClick={() => setStep(1)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--dark-mid)" }}><ChevronLeft size={20} /></button>
                <div>
                  <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: 300 }}>Pick a Date & Time</h2>
                  <p style={{ fontSize: "13px", color: "var(--rose)" }}>{selectedService?.name} — {selectedService?.duration} min — ${selectedService?.price}</p>
                </div>
              </div>
              <div style={{ marginBottom: "40px" }}>
                <div style={{ fontSize: "12px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--dark-mid)", marginBottom: "16px" }}>Select Date</div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {dates.map((d, i) => {
                    const iso = d.toISOString().split("T")[0];
                    const isSelected = selectedDate === iso;
                    return (
                      <button key={i} onClick={() => { setSelectedDate(iso); setSelectedSlot(""); }}
                        style={{ padding: "12px 14px", borderRadius: "2px", cursor: "pointer", border: `1px solid ${isSelected ? "var(--rose)" : "var(--border)"}`, background: isSelected ? "var(--rose)" : "white", color: isSelected ? "white" : "var(--dark)", fontFamily: "var(--font-sans)", fontSize: "12px", textAlign: "center", minWidth: "56px" }}>
                        <div style={{ fontWeight: 500 }}>{d.toLocaleDateString("en-US", { weekday: "short" })}</div>
                        <div>{d.getDate()}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
              {selectedDate && (
                <div style={{ marginBottom: "40px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--dark-mid)", marginBottom: "16px" }}>Available Times</div>
                  {slotsLoading ? <div style={{ fontSize: "14px", color: "var(--dark-mid)" }}>Loading slots...</div>
                    : slots.length === 0 ? <div style={{ fontSize: "14px", color: "var(--dark-mid)", padding: "20px", background: "white", borderRadius: "4px", border: "1px solid var(--border)" }}>No available slots. Please pick another day.</div>
                    : <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {slots.map((slot, i) => (
                          <button key={i} onClick={() => setSelectedSlot(slot)}
                            style={{ padding: "10px 20px", borderRadius: "2px", cursor: "pointer", border: `1px solid ${selectedSlot === slot ? "var(--rose)" : "var(--border)"}`, background: selectedSlot === slot ? "var(--rose)" : "white", color: selectedSlot === slot ? "white" : "var(--dark)", fontFamily: "var(--font-sans)", fontSize: "13px" }}>
                            {formatTime(slot)}
                          </button>
                        ))}
                      </div>
                  }
                </div>
              )}
              <button onClick={() => setStep(3)} disabled={!selectedSlot} className="btn-primary" style={{ opacity: selectedSlot ? 1 : 0.4, cursor: selectedSlot ? "pointer" : "not-allowed" }}>
                Continue <ChevronRight size={16} />
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
                <button onClick={() => setStep(2)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--dark-mid)" }}><ChevronLeft size={20} /></button>
                <div>
                  <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: 300 }}>Your Details</h2>
                  <p style={{ fontSize: "13px", color: "var(--rose)" }}>{selectedService?.name} · {formatDate(selectedSlot)} · {formatTime(selectedSlot)}</p>
                </div>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }} className="booking-details-grid">
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--dark-mid)", marginBottom: "8px" }}>Full Name *</label>
                    <input {...register("customerName")} className="input-salon" placeholder="Your full name" />
                    {errors.customerName && <p style={{ fontSize: "12px", color: "var(--rose-deep)", marginTop: "4px" }}>{errors.customerName.message}</p>}
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--dark-mid)", marginBottom: "8px" }}>Phone Number *</label>
                    <input {...register("customerPhone")} className="input-salon" placeholder="+250 700 000 000" />
                    {errors.customerPhone && <p style={{ fontSize: "12px", color: "var(--rose-deep)", marginTop: "4px" }}>{errors.customerPhone.message}</p>}
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--dark-mid)", marginBottom: "8px" }}>Email (optional)</label>
                  <input {...register("customerEmail")} className="input-salon" placeholder="your@email.com" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--dark-mid)", marginBottom: "8px" }}>Special Requests</label>
                  <textarea {...register("notes")} className="input-salon" rows={3} placeholder="Any special requests..." style={{ resize: "vertical" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--dark-mid)", marginBottom: "12px" }}>Payment Method *</label>
                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    {[{ value: "CASH", label: "Pay in Cash", desc: "Pay when we arrive" }, { value: "MOMO", label: "Mobile Money", desc: "Upload payment screenshot" }].map(opt => (
                      <label key={opt.value} style={{ flex: 1, minWidth: "140px", padding: "16px", border: `2px solid ${paymentMethod === opt.value ? "var(--rose)" : "var(--border)"}`, borderRadius: "4px", cursor: "pointer", background: paymentMethod === opt.value ? "var(--rose-blush)" : "white", transition: "all 0.2s" }}>
                        <input type="radio" value={opt.value} {...register("paymentMethod")} style={{ display: "none" }} />
                        <div style={{ fontWeight: 500, fontSize: "14px", marginBottom: "4px" }}>{opt.label}</div>
                        <div style={{ fontSize: "12px", color: "var(--dark-mid)", fontWeight: 300 }}>{opt.desc}</div>
                      </label>
                    ))}
                  </div>
                </div>
                {paymentMethod === "MOMO" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--dark-mid)", marginBottom: "8px" }}>Payment Screenshot *</label>
                    <label style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", padding: "32px", border: "2px dashed var(--border)", borderRadius: "4px", cursor: "pointer", background: "white" }}>
                      <Upload size={24} color="var(--rose)" />
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "14px", fontWeight: 400 }}>{screenshot ? screenshot.name : "Click to upload screenshot"}</div>
                        <div style={{ fontSize: "12px", color: "var(--dark-mid)", fontWeight: 300 }}>PNG, JPG up to 5MB</div>
                      </div>
                      <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => setScreenshot(e.target.files[0])} />
                    </label>
                  </motion.div>
                )}
                <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "4px", padding: "24px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--dark-mid)", marginBottom: "16px" }}>Booking Summary</div>
                  {[
                    { label: "Service",  value: selectedService?.name },
                    { label: "Date",     value: formatDate(selectedSlot) },
                    { label: "Time",     value: formatTime(selectedSlot) },
                    { label: "Duration", value: `${selectedService?.duration} minutes` },
                    { label: "Price",    value: `$${selectedService?.price}` },
                    { label: "Payment",  value: paymentMethod === "CASH" ? "Cash on arrival" : "Mobile Money" },
                  ].map(row => (
                    <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)", fontSize: "14px" }}>
                      <span style={{ color: "var(--dark-mid)", fontWeight: 300 }}>{row.label}</span>
                      <span style={{ fontWeight: 400 }}>{row.value}</span>
                    </div>
                  ))}
                </div>
                <button type="submit" disabled={submitting} className="btn-primary" style={{ fontSize: "14px", padding: "16px 40px", opacity: submitting ? 0.7 : 1 }}>
                  {submitting ? "Submitting..." : "Confirm Booking"}
                </button>
              </form>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ color: "var(--rose)", marginBottom: "24px" }}><CheckCircle size={64} strokeWidth={1} /></div>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "40px", fontWeight: 300, marginBottom: "16px" }}>Booking Received!</h2>
              <p style={{ fontSize: "15px", color: "var(--dark-mid)", fontWeight: 300, maxWidth: "460px", margin: "0 auto 12px", lineHeight: "1.8" }}>
                Thank you, <strong>{booking?.customerName}</strong>! Your appointment is awaiting confirmation.
              </p>
              <p style={{ fontSize: "14px", color: "var(--rose)", marginBottom: "40px" }}>You'll receive an SMS at {booking?.customerPhone} once approved.</p>
              <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
                <a href="/" className="btn-outline">Back to Home</a>
                <a href="/booking" className="btn-primary">Book Another</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
