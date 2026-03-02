"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
} from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <div
        className="modal-overlay active"
        style={{ position: "relative", minHeight: "100vh" }}
      >
        <div className="modal-container" style={{ textAlign: "center" }}>
          <AlertCircle
            size={48}
            style={{ color: "var(--accent-orange)", margin: "0 auto 16px" }}
          />
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
            Enlace Inválido
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.9rem",
              marginBottom: "24px",
            }}
          >
            Este enlace de recuperación no es válido o ha expirado.
          </p>
          <Link href="/auth/forgot-password" className="btn btn-primary">
            Solicitar Nuevo Enlace
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al restablecer la contraseña.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/auth/login"), 3000);
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
          </span>
        </Link>

        {success ? (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <CheckCircle
              size={48}
              style={{ color: "var(--accent-green)", margin: "0 auto 16px" }}
            />
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.3rem",
                fontWeight: 700,
                marginBottom: "8px",
              }}
            >
              ¡Contraseña actualizada!
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.9rem",
                marginBottom: "16px",
              }}
            >
              Redirigiendo al login...
            </p>
            <Loader2
              size={20}
              className="animate-spin"
              style={{ margin: "0 auto", color: "var(--accent-1)" }}
            />
          </div>
        ) : (
          <>
            <div className="modal-header" style={{ textAlign: "center" }}>
              <Lock
                size={32}
                style={{ color: "var(--accent-1)", margin: "0 auto 12px" }}
              />
              <h2>Nueva Contraseña</h2>
              <p>Ingresa tu nueva contraseña para restablecer el acceso.</p>
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
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="new-password"
                    placeholder=" "
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ paddingRight: "40px" }}
                  />
                  <label htmlFor="new-password">Nueva Contraseña</label>
                  <span className="input-line" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "0",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: "var(--text-muted)",
                      cursor: "pointer",
                      padding: "4px",
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirm-password"
                  placeholder=" "
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <label htmlFor="confirm-password">Confirmar Contraseña</label>
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
                {loading ? "Actualizando..." : "Restablecer Contraseña"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div
          className="modal-overlay active"
          style={{ position: "relative", minHeight: "100vh" }}
        >
          <Loader2
            size={32}
            className="animate-spin"
            style={{ color: "var(--accent-1)" }}
          />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
