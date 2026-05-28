// src/app/admin/messages/page.js
"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, MailOpen, Phone } from "lucide-react";
import { adminApi } from "@/lib/adminApi";

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading]   = useState(true);

  const fetch = async () => {
    setLoading(true);
    try { const r = await adminApi().get("/contact"); setMessages(r.data); }
    catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const markRead = async (id) => {
    try { await adminApi().patch(`/contact/${id}/read`); fetch(); }
    catch {}
  };

  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "32px", fontWeight: 300, marginBottom: "24px" }}>Messages</h1>

      {loading ? <div style={{ textAlign: "center", padding: "60px" }}>Loading...</div> : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {messages.length === 0 && <div style={{ textAlign: "center", padding: "60px", color: "var(--dark-mid)" }}>No messages yet</div>}
          {messages.map((m, i) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              style={{
                background: m.isRead ? "white" : "var(--rose-blush)",
                border: `1px solid ${m.isRead ? "var(--border)" : "var(--rose-light)"}`,
                borderRadius: "8px", padding: "20px",
                display: "flex", gap: "16px", alignItems: "flex-start",
              }}
            >
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: m.isRead ? "var(--beige)" : "var(--rose-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {m.isRead ? <MailOpen size={16} color="var(--dark-mid)" /> : <Mail size={16} color="var(--rose-deep)" />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: "16px" }}>{m.name}</div>
                  <div style={{ fontSize: "12px", color: "var(--dark-mid)" }}>{new Date(m.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</div>
                </div>
                <div style={{ display: "flex", gap: "16px", marginBottom: "10px" }}>
                  {m.phone && <span style={{ fontSize: "12px", color: "var(--dark-mid)", display: "flex", alignItems: "center", gap: "4px" }}><Phone size={11} /> {m.phone}</span>}
                  {m.email && <span style={{ fontSize: "12px", color: "var(--rose)" }}>{m.email}</span>}
                </div>
                <p style={{ fontSize: "14px", color: "var(--dark-mid)", fontWeight: 300, lineHeight: "1.6" }}>{m.message}</p>
              </div>
              {!m.isRead && (
                <button onClick={() => markRead(m.id)} style={{ padding: "6px 14px", background: "white", border: "1px solid var(--border)", borderRadius: "4px", fontSize: "12px", cursor: "pointer", flexShrink: 0 }}>
                  Mark read
                </button>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
