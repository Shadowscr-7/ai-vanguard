import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary px-6">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/3 top-1/4 h-96 w-96 rounded-full bg-accent-indigo/8 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/3 h-96 w-96 rounded-full bg-accent-purple/8 blur-[120px]" />
      </div>
      <div className="relative z-10 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-[8rem] font-bold leading-none gradient-text">
          404
        </h1>
        <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold text-text-primary">
          Página no encontrada
        </h2>
        <p className="mt-3 max-w-md text-text-secondary">
          La página que buscas no existe o ha sido movida. Verifica la URL o regresa al inicio.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link href="/" className="btn btn-primary btn-glow">
            Ir al Inicio
          </Link>
          <Link href="/dashboard" className="btn btn-secondary">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
