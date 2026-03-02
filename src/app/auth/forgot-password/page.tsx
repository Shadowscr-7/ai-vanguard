"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, CheckCircle, Loader2, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Ingresa tu email.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Error al procesar la solicitud.");
        setLoading(false);
        return;
      }

      setSent(true);
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.");
    }

    setLoading(false);
  };

  return (
    <div
      className="modal-overlay active"
      style={{ position: "relative", minHeight: "100vh" }}
    >
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/3 top-1/4 h-96 w-96 rounded-full bg-accent-indigo/8 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/3 h-96 w-96 rounded-full bg-accent-purple/8 blur-[120px]" />
      </div>

      <div className="modal-container">
        <Link
          href="/"
          style={{
            display: "block",
            textAlign: "center",
            marginBottom: "12px",
          }}
        >
          <img src="/images/logo.png" alt="IA Vanguard" style={{ width: 32, height: 32, borderRadius: 8, display: "inline-block", verticalAlign: "middle", marginRight: 8 }} />
          <span
            className="gradient-text"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.3rem",
              fontWeight: 700,
            }}
          >
            IA Vanguard
          </span> (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <CheckCircle
              size={48}
              style={{
                color: "var(--accent-green)",
                margin: "0 auto 16px",
              }}
            />
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.3rem",
                fontWeight: 700,
                marginBottom: "8px",
              }}
            >
              Revisa tu email
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.9rem",
                marginBottom: "24px",
                lineHeight: 1.6,
              }}
            >
              Si <strong>{email}</strong> tiene una cuenta asociada, recibirás un
              enlace para restablecer tu contraseña.
            </p>
            <Link
              href="/auth/login"
              className="btn btn-primary"
              style={{ display: "inline-flex" }}
            >
              <ArrowLeft size={16} /> Volver al Login
            </Link>
          </div>
        ) : (
          <>
            <div className="modal-header" style={{ textAlign: "center" }}>
              <Mail
                size={32}
                style={{
                  color: "var(--accent-1)",
                  margin: "0 auto 12px",
                }}
              />
              <h2>¿Olvidaste tu contraseña?</h2>
              <p>
                Ingresa tu email y te enviaremos un enlace para
                restablecerla.
              </p>
            </div>

            {error && (
              <div className="modal-error">
                <AlertCircle
                  size={16}
                  style={{
                    display: "inline",
                    verticalAlign: "middle",
                    marginRight: "6px",
                  }}
                />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type="email"
                  id="forgot-email"
                  placeholder=" "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="forgot-email">Email</label>
                <span className="input-line" />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-glow"
                style={{
                  width: "100%",
                  marginTop: "8px",
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : null}
                {loading ? "Enviando..." : "Enviar Enlace de Recuperación"}
              </button>
            </form>

            <div className="modal-switch">
              <Link href="/auth/login">
                <ArrowLeft
                  size={14}
                  style={{ display: "inline", verticalAlign: "middle" }}
                />{" "}
                Volver al Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
