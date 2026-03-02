import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary">
      <div className="text-center">
        <Loader2
          size={40}
          className="mx-auto animate-spin text-accent-indigo"
        />
        <p className="mt-4 text-sm text-text-muted">Cargando...</p>
      </div>
    </div>
  );
}
