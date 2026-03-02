"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Complete todos los campos.");
      return;
    }

    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Email o contraseña incorrectos.");
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <div className="modal-overlay active" style={{ position: "relative", minHeight: "100vh" }}>
      {/* Background orbs */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/3 top-1/4 h-96 w-96 rounded-full bg-accent-indigo/8 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/3 h-96 w-96 rounded-full bg-accent-purple/8 blur-[120px]" />
      </div>

      <div className="modal-container">
        {/* Logo */}
        <Link href="/" style={{ display: "block", textAlign: "center", marginBottom: "12px" }}>
          <img src="/images/logo.png" alt="IA Vanguard" style={{ width: 32, height: 32, borderRadius: 8, display: "inline-block", verticalAlign: "middle", marginRight: 8 }} />
          <span className="gradient-text" style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 700 }}>
            IA Vanguard
          </span>
        </Link>

        {/* Header */}
        <div className="modal-header" style={{ textAlign: "center" }}>
          <h2>Bienvenido de vuelta</h2>
          <p>Ingresa para acceder a tus cursos y libros</p>
        </div>

        {/* Error */}
        {error && (
          <div className="modal-error">
            <AlertCircle size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              id="login-email"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="login-email">Email</label>
            <span className="input-line" />
          </div>

          <div className="input-group">
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                id="login-password"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: "40px" }}
              />
              <label htmlFor="login-password">Contraseña</label>
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

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-glow"
            style={{ width: "100%", marginTop: "8px", opacity: loading ? 0.6 : 1 }}
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : null}
            {loading ? "Ingresando..." : "Ingresar"}
          </button>

          <div style={{ textAlign: "right", marginTop: "8px" }}>
            <Link
              href="/auth/forgot-password"
              style={{ fontSize: "0.8rem", color: "var(--accent-1)", textDecoration: "none" }}
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </form>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "24px 0" }}>
          <div style={{ flex: 1, height: "1px", background: "var(--border-color)" }} />
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", letterSpacing: "0.05em" }}>O CONTINÚA CON</span>
          <div style={{ flex: 1, height: "1px", background: "var(--border-color)" }} />
        </div>

        {/* Google */}
        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl })}
          className="btn btn-secondary"
          style={{ width: "100%" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Google
        </button>

        {/* Register link */}
        <div className="modal-switch">
          ¿No tienes cuenta?{" "}
          <Link href="/auth/register">Crear cuenta</Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="modal-overlay active" style={{ position: "relative", minHeight: "100vh" }}>
          <Loader2 size={32} className="animate-spin" style={{ color: "var(--accent-1)" }} />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
