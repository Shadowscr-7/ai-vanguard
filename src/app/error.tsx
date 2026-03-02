"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary px-6">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/3 top-1/4 h-96 w-96 rounded-full bg-red-500/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/3 h-96 w-96 rounded-full bg-accent-orange/5 blur-[120px]" />
      </div>
      <div className="relative z-10 text-center">
        <AlertTriangle
          size={64}
          className="mx-auto mb-4 text-accent-orange"
        />
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-text-primary">
          Algo salió mal
        </h1>
        <p className="mt-3 max-w-md text-text-secondary">
          Ocurrió un error inesperado. Puedes intentar nuevamente o volver al inicio.
        </p>
        {error.digest && (
          <p className="mt-2 text-xs text-text-muted">
            Código de error: {error.digest}
          </p>
        )}
        <div className="mt-8 flex items-center justify-center gap-4">
          <button onClick={reset} className="btn btn-primary btn-glow">
            <RefreshCw size={16} />
            Intentar de nuevo
          </button>
          <Link href="/" className="btn btn-secondary">
            Ir al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
