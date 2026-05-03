"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock } from "lucide-react";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API}/auth/login`, data);
      localStorage.setItem("admin_token", res.data.token);
      localStorage.setItem("admin_info", JSON.stringify(res.data.admin));
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: `linear-gradient(135deg, var(--dark) 0%, #5C3A3A 100%)`,
      padding: "40px",
    }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: "white", borderRadius: "8px", padding: "48px",
          width: "100%", maxWidth: "420px",
          boxShadow: "0 24px 80px rgba(0,0,0,0.3)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: 400, marginBottom: "4px" }}>
            Choice <span style={{ color: "var(--rose)" }}>Saloon</span>
          </div>
          <div style={{ fontSize: "12px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--dark-mid)" }}>
            Admin Dashboard
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: "32px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "var(--rose-blush)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Lock size={20} color="var(--rose)" />
          </div>
        </div>

        {error && (
          <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: "4px", padding: "12px 16px", marginBottom: "20px", fontSize: "13px", color: "#DC2626" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--dark-mid)", marginBottom: "8px" }}>Email</label>
            <input {...register("email", { required: "Email is required" })} className="input-salon" type="email" placeholder="owner@mysalon.com" />
            {errors.email && <p style={{ fontSize: "12px", color: "var(--rose-deep)", marginTop: "4px" }}>{errors.email.message}</p>}
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--dark-mid)", marginBottom: "8px" }}>Password</label>
            <div style={{ position: "relative" }}>
              <input {...register("password", { required: "Password is required" })} className="input-salon" type={showPassword ? "text" : "password"} placeholder="••••••••" style={{ paddingRight: "44px" }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--dark-mid)" }}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p style={{ fontSize: "12px", color: "var(--rose-deep)", marginTop: "4px" }}>{errors.password.message}</p>}
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "14px", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <a href="/" style={{ fontSize: "13px", color: "var(--dark-mid)", textDecoration: "none" }}>← Back to website</a>
        </div>
      </motion.div>
    </div>
  );
}