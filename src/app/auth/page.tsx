"use client";
// src/app/auth/page.tsx
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) throw error;
        if (data.user) {
          // Create workspace for new user
          // workspace creation skipped for now
          setSuccess("Account created! Redirecting…");
          setTimeout(() => router.push("/"), 1500);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; }`}</style>
      <div style={{ width: 400, background: "#0d0d16", border: "1px solid #1e1e2e", borderRadius: 16, padding: 32, boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚡</div>
          <span style={{ fontWeight: 700, fontSize: 18, color: "#f1f5f9", letterSpacing: "-0.02em" }}>FlowBoard</span>
        </div>

        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#f1f5f9", marginBottom: 4 }}>
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 24 }}>
          {mode === "login" ? "Sign in to your workspace" : "Start managing your team's work"}
        </p>

        {mode === "signup" && (
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600, display: "block", marginBottom: 6 }}>Full Name</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Badri Koushik"
              style={{ width: "100%", background: "#111118", border: "1px solid #1e1e2e", borderRadius: 8, padding: "10px 14px", color: "#f1f5f9", fontSize: 14, outline: "none" }}
              onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
              onBlur={(e) => (e.target.style.borderColor = "#1e1e2e")}
            />
          </div>
        )}

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600, display: "block", marginBottom: 6 }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{ width: "100%", background: "#111118", border: "1px solid #1e1e2e", borderRadius: 8, padding: "10px 14px", color: "#f1f5f9", fontSize: 14, outline: "none" }}
            onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
            onBlur={(e) => (e.target.style.borderColor = "#1e1e2e")}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600, display: "block", marginBottom: 6 }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            style={{ width: "100%", background: "#111118", border: "1px solid #1e1e2e", borderRadius: 8, padding: "10px 14px", color: "#f1f5f9", fontSize: 14, outline: "none" }}
            onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
            onBlur={(e) => (e.target.style.borderColor = "#1e1e2e")}
          />
        </div>

        {error && (
          <div style={{ padding: "10px 14px", background: "#ef444415", border: "1px solid #ef444430", borderRadius: 8, color: "#ef4444", fontSize: 13, marginBottom: 16 }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ padding: "10px 14px", background: "#10b98115", border: "1px solid #10b98130", borderRadius: 8, color: "#10b981", fontSize: 13, marginBottom: 16 }}>
            {success}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ width: "100%", padding: "11px", background: "#6366f1", border: "none", borderRadius: 8, color: "#fff", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, letterSpacing: "-0.01em" }}
        >
          {loading ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
        </button>

        <p style={{ textAlign: "center", fontSize: 13, color: "#6b7280", marginTop: 20 }}>
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <span onClick={() => setMode(mode === "login" ? "signup" : "login")} style={{ color: "#6366f1", cursor: "pointer", fontWeight: 600 }}>
            {mode === "login" ? "Sign up" : "Sign in"}
          </span>
        </p>
      </div>
    </div>
  );
}