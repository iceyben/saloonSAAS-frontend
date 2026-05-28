"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Phone } from "lucide-react";

export default function WhatsAppButton() {
  const [open, setOpen] = useState(false);
  const PHONE = process.env.NEXT_PUBLIC_WHATSAPP || "250700000000";

  return (
    <div style={{ position: "fixed", bottom: "28px", right: "28px", zIndex: 200 }}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            style={{
              position: "absolute", bottom: "72px", right: 0,
              background: "white", borderRadius: "12px",
              border: "1px solid var(--border)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.15)",
              width: "280px", overflow: "hidden",
            }}
          >
            {/* Header */}
            <div style={{ background: "#25D366", padding: "16px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "var(--font-serif)", fontSize: "16px", color: "white" }}>CS</span>
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 500, color: "white" }}>Choice Saloon</div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.8)" }}>Usually replies instantly</div>
                </div>
              </div>
            </div>

            {/* Message bubble */}
            <div style={{ padding: "16px 20px" }}>
              <div style={{ background: "#F0F0F0", borderRadius: "8px 8px 8px 0", padding: "12px 14px", marginBottom: "16px" }}>
                <p style={{ fontSize: "13px", color: "var(--dark)", fontWeight: 300, lineHeight: "1.6", margin: 0 }}>
                  Hi! 👋 Welcome to Choice Saloon. How can we help you today? Book an appointment or ask us anything!
                </p>
                <div style={{ fontSize: "10px", color: "var(--dark-mid)", marginTop: "6px", textAlign: "right" }}>Now</div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <a
                  href={`https://wa.me/${PHONE}?text=Hi! I'd like to book an appointment at Choice Saloon.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    background: "#25D366", color: "white", borderRadius: "6px",
                    padding: "11px 16px", textDecoration: "none", fontSize: "13px", fontWeight: 500,
                    transition: "background 0.15s",
                  }}
                >
                  <MessageCircle size={16} /> Chat on WhatsApp
                </a>
                <a
                  href={`tel:+${PHONE}`}
                  style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    background: "var(--rose-blush)", color: "var(--rose)", borderRadius: "6px",
                    padding: "11px 16px", textDecoration: "none", fontSize: "13px", fontWeight: 500,
                    border: "1px solid var(--rose-light)",
                  }}
                >
                  <Phone size={16} /> Call us
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          width: "56px", height: "56px", borderRadius: "50%",
          background: "#25D366", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 20px rgba(37,211,102,0.4)",
          transition: "background 0.2s",
        }}
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.div key="x"    initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X size={22} color="white" /></motion.div>
            : <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }}  animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><MessageCircle size={24} color="white" /></motion.div>
          }
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
