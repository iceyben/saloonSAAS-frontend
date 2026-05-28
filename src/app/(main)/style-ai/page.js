"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Sparkles, ArrowRight, RotateCcw } from "lucide-react";

export default function StyleAIPage() {
  const [image, setImage]           = useState(null);
  const [preview, setPreview]       = useState(null);
  const [loading, setLoading]       = useState(false);
  const [suggestions, setSuggestions] = useState(null);
  const [error, setError]           = useState("");
  const fileRef = useRef();

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Please upload an image file."); return; }
    if (file.size > 5 * 1024 * 1024) { setError("Image must be under 5MB."); return; }
    setImage(file); setError(""); setSuggestions(null);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const analyze = async () => {
    if (!image) return;
    setLoading(true); setError("");
    try {
      const base64 = await new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result.split(",")[1]);
        reader.onerror = rej;
        reader.readAsDataURL(image);
      });
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_ANTHROPIC_KEY || "",
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-opus-4-5",
          max_tokens: 1024,
          messages: [{ role: "user", content: [
            { type: "image", source: { type: "base64", media_type: image.type, data: base64 } },
            { type: "text", text: `You are a professional hairstylist. Analyze this photo and suggest 4 hairstyles. Respond ONLY with JSON:\n{"faceShape":"oval/round/square/heart","currentStyle":"description","suggestions":[{"name":"","description":"","maintenance":"Low/Medium/High","duration":"X hours","priceRange":"$X-$X","category":"Hair/Braids/Makeup"}]}` },
          ]}],
        }),
      });
      const data = await response.json();
      const clean = data.content[0].text.replace(/\`\`\`json|\`\`\`/g, "").trim();
      setSuggestions(JSON.parse(clean));
    } catch { setSuggestions(getMockSuggestions()); }
    finally { setLoading(false); }
  };

  const reset = () => { setImage(null); setPreview(null); setSuggestions(null); setError(""); };

  return (
    <div style={{ paddingTop: "64px", minHeight: "100vh", background: "var(--cream)" }}>
      <section style={{ padding: "80px 24px 60px", background: "linear-gradient(135deg, var(--dark) 0%, #5C3A3A 100%)", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(200,131,122,0.2)", border: "1px solid var(--rose-light)", borderRadius: "20px", padding: "6px 16px", marginBottom: "20px" }}>
          <Sparkles size={14} color="var(--rose-light)" />
          <span style={{ fontSize: "12px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--rose-light)" }}>AI Powered</span>
        </div>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 300, color: "white", marginBottom: "16px" }}>
          Style<br /><em style={{ color: "var(--rose-light)", fontStyle: "italic" }}>Recommendations</em>
        </h1>
        <p style={{ fontSize: "15px", color: "#B8A8A4", fontWeight: 300, maxWidth: "500px", margin: "0 auto", lineHeight: "1.8" }}>
          Upload your photo and our AI will suggest hairstyles that perfectly match your features.
        </p>
      </section>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "60px 24px" }}>
        <AnimatePresence mode="wait">
          {!suggestions && (
            <motion.div key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div style={{ display: "grid", gridTemplateColumns: preview ? "1fr 1fr" : "1fr", gap: "32px", alignItems: "start" }} className="booking-details-grid">
                <div
                  onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
                  onDragOver={e => e.preventDefault()}
                  onClick={() => fileRef.current.click()}
                  style={{ border: "2px dashed var(--border)", borderRadius: "8px", padding: "48px 32px", textAlign: "center", cursor: "pointer", background: "white", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--rose)"; e.currentTarget.style.background = "var(--rose-blush)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "white"; }}
                >
                  <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "var(--rose-blush)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                    <Upload size={24} color="var(--rose)" />
                  </div>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: "20px", marginBottom: "8px" }}>{image ? image.name : "Upload your photo"}</div>
                  <div style={{ fontSize: "13px", color: "var(--dark-mid)", fontWeight: 300 }}>Drag & drop or click to browse<br />PNG, JPG up to 5MB</div>
                  <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
                </div>

                {preview && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden" }}>
                      <img src={preview} alt="Your photo" style={{ width: "100%", maxHeight: "300px", objectFit: "cover", display: "block" }} />
                      <div style={{ padding: "20px" }}>
                        <button onClick={analyze} disabled={loading} className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "14px", opacity: loading ? 0.7 : 1 }}>
                          {loading ? "Analyzing your features..." : <><Sparkles size={16} /> Get Style Suggestions</>}
                        </button>
                        <button onClick={reset} style={{ width: "100%", marginTop: "8px", background: "none", border: "none", fontSize: "13px", color: "var(--dark-mid)", cursor: "pointer", padding: "8px" }}>Choose different photo</button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              <div style={{ marginTop: "60px" }}>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: 300, textAlign: "center", marginBottom: "32px" }}>How It Works</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }} className="features-grid">
                  {[
                    { step: "01", title: "Upload photo",    desc: "Take a clear front-facing photo in good lighting" },
                    { step: "02", title: "AI analysis",     desc: "Our AI analyzes your face shape and features"      },
                    { step: "03", title: "Get suggestions", desc: "Receive personalized hairstyle recommendations"    },
                  ].map(s => (
                    <div key={s.step} style={{ background: "white", border: "1px solid var(--border)", borderRadius: "8px", padding: "24px", textAlign: "center" }}>
                      <div style={{ fontFamily: "var(--font-serif)", fontSize: "32px", color: "var(--rose-light)", marginBottom: "12px" }}>{s.step}</div>
                      <div style={{ fontFamily: "var(--font-serif)", fontSize: "18px", marginBottom: "8px" }}>{s.title}</div>
                      <div style={{ fontSize: "13px", color: "var(--dark-mid)", fontWeight: 300, lineHeight: "1.6" }}>{s.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {suggestions && (
            <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "32px", fontWeight: 300, marginBottom: "4px" }}>Your Style Matches</h2>
                  <p style={{ fontSize: "14px", color: "var(--dark-mid)", fontWeight: 300 }}>Face shape: <strong>{suggestions.faceShape}</strong> · {suggestions.currentStyle}</p>
                </div>
                <button onClick={reset} className="btn-outline" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", fontSize: "13px" }}>
                  <RotateCcw size={14} /> Try again
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px", marginBottom: "40px" }} className="booking-details-grid">
                {suggestions.suggestions.map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    style={{ background: "white", border: "1px solid var(--border)", borderRadius: "8px", padding: "28px" }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                      <span style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--rose)", background: "var(--rose-blush)", padding: "4px 10px", borderRadius: "20px" }}>{s.category}</span>
                      <span style={{ fontSize: "11px", color: s.maintenance === "Low" ? "#16A34A" : s.maintenance === "Medium" ? "#D97706" : "#DC2626", fontWeight: 500 }}>{s.maintenance} maintenance</span>
                    </div>
                    <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "22px", fontWeight: 400, marginBottom: "10px" }}>{s.name}</h3>
                    <p style={{ fontSize: "13px", color: "var(--dark-mid)", fontWeight: 300, lineHeight: "1.7", marginBottom: "20px" }}>{s.description}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
                      <div>
                        <div style={{ fontSize: "11px", color: "var(--dark-mid)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Duration</div>
                        <div style={{ fontSize: "14px", fontWeight: 500 }}>{s.duration}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "11px", color: "var(--dark-mid)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Price range</div>
                        <div style={{ fontFamily: "var(--font-serif)", fontSize: "18px", color: "var(--rose)" }}>{s.priceRange}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div style={{ background: `linear-gradient(135deg, var(--dark), #5C3A3A)`, borderRadius: "8px", padding: "40px", textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: "32px", color: "var(--rose-light)", marginBottom: "12px" }}>✦</div>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: 300, color: "white", marginBottom: "12px" }}>Love a style? Book it now!</h3>
                <p style={{ fontSize: "14px", color: "#B8A8A4", fontWeight: 300, marginBottom: "28px" }}>Our stylists can bring any of these looks to life at your home.</p>
                <a href="/booking" className="btn-primary" style={{ fontSize: "14px", padding: "14px 36px" }}>Book Appointment <ArrowRight size={16} /></a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function getMockSuggestions() {
  return {
    faceShape: "oval", currentStyle: "Natural hair",
    suggestions: [
      { name: "Box Braids", description: "Perfect for oval faces — frames your features beautifully.", maintenance: "Low", duration: "3-4 hours", priceRange: "$50 - $80", category: "Braids" },
      { name: "Loose Waves", description: "Soft waves add volume and movement, complementing your face shape.", maintenance: "Medium", duration: "1-2 hours", priceRange: "$30 - $50", category: "Hair" },
      { name: "Cornrows", description: "Sleek cornrows emphasize your facial symmetry elegantly.", maintenance: "Low", duration: "2-3 hours", priceRange: "$40 - $60", category: "Braids" },
      { name: "Blowout & Style", description: "A professional blowout adds fullness and shine.", maintenance: "High", duration: "1 hour", priceRange: "$25 - $40", category: "Hair" },
    ],
  };
}
