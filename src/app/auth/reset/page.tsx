"use client";
// src/app/auth/reset/page.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const init = async () => {
      setError(null);
      const { data, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        setError(sessionError.message);
        setChecking(false);
        return;
      }
      if (!data.session) {
        window.location.href = "/auth";
        return;
      }
      setChecking(false);
    };
    void init();
  }, []);

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);

    if (!newPassword || !confirmPassword) {
      setError("Please enter and confirm your new password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) throw updateError;
      setSuccess("Password updated! Redirecting…");
      router.push("/");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; }`}</style>
      <div
        style={{
          width: 400,
          background: "#0d0d16",
          border: "1px solid #1e1e2e",
          borderRadius: 16,
          padding: 32,
          boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
          <div
            style={{
              width: 36,
              height: 36,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            ⚡
          </div>
          <span style={{ fontWeight: 700, fontSize: 18, color: "#f1f5f9", letterSpacing: "-0.02em" }}>FlowBoard</span>
        </div>

        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#f1f5f9", marginBottom: 4 }}>Set a new password</h1>
        <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 24 }}>Choose a strong password to secure your account</p>

        {error && (
          <div
            style={{
              padding: "10px 14px",
              background: "#ef444415",
              border: "1px solid #ef444430",
              borderRadius: 8,
              color: "#ef4444",
              fontSize: 13,
              marginBottom: 16,
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              padding: "10px 14px",
              background: "#10b98115",
              border: "1px solid #10b98130",
              borderRadius: 8,
              color: "#10b981",
              fontSize: 13,
              marginBottom: 16,
            }}
          >
            {success}
          </div>
        )}

        <div style={{ marginBottom: 14, opacity: checking ? 0.7 : 1 }}>
          <label style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600, display: "block", marginBottom: 6 }}>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            disabled={checking}
            style={{
              width: "100%",
              background: "#111118",
              border: "1px solid #1e1e2e",
              borderRadius: 8,
              padding: "10px 14px",
              color: "#f1f5f9",
              fontSize: 14,
              outline: "none",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
            onBlur={(e) => (e.target.style.borderColor = "#1e1e2e")}
          />
        </div>

        <div style={{ marginBottom: 20, opacity: checking ? 0.7 : 1 }}>
          <label style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600, display: "block", marginBottom: 6 }}>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            disabled={checking}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            style={{
              width: "100%",
              background: "#111118",
              border: "1px solid #1e1e2e",
              borderRadius: 8,
              padding: "10px 14px",
              color: "#f1f5f9",
              fontSize: 14,
              outline: "none",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
            onBlur={(e) => (e.target.style.borderColor = "#1e1e2e")}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || checking}
          style={{
            width: "100%",
            padding: "11px",
            background: "#6366f1",
            border: "none",
            borderRadius: 8,
            color: "#fff",
            fontSize: 14,
            fontWeight: 700,
            cursor: loading || checking ? "not-allowed" : "pointer",
            opacity: loading || checking ? 0.7 : 1,
            letterSpacing: "-0.01em",
          }}
        >
          {checking ? "Checking link…" : loading ? "Please wait…" : "Update Password"}
        </button>

        <p style={{ textAlign: "center", fontSize: 13, color: "#6b7280", marginTop: 20 }}>
          <span onClick={() => router.push("/auth")} style={{ color: "#6366f1", cursor: "pointer", fontWeight: 600 }}>
            Back to sign in
          </span>
        </p>
      </div>
    </div>
  );
}

