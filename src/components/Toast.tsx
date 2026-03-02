"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
  toasts: Toast[];
}

const ToastContext = createContext<ToastContextValue>({
  toast: () => {},
  toasts: [],
});

export const useToast = () => useContext(ToastContext);

const ICONS: Record<ToastType, ReactNode> = {
  success: <CheckCircle size={18} />,
  error: <AlertCircle size={18} />,
  info: <Info size={18} />,
  warning: <AlertTriangle size={18} />,
};

const COLORS: Record<ToastType, string> = {
  success: "var(--accent-green, #22c55e)",
  error: "#ef4444",
  info: "var(--accent-1, #6366f1)",
  warning: "var(--accent-orange, #f97316)",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast, toasts }}>
      {children}

      {/* Toast Container */}
      <div
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          pointerEvents: "none",
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              pointerEvents: "auto",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 16px",
              borderRadius: "12px",
              background: "rgba(20, 20, 35, 0.95)",
              backdropFilter: "blur(12px)",
              border: `1px solid ${COLORS[t.type]}40`,
              boxShadow: `0 4px 24px rgba(0,0,0,0.3), 0 0 0 1px ${COLORS[t.type]}20`,
              color: "#e0e0e0",
              fontSize: "0.875rem",
              maxWidth: "380px",
              animation: "slideInRight 0.3s ease-out",
            }}
          >
            <span style={{ color: COLORS[t.type], flexShrink: 0 }}>
              {ICONS[t.type]}
            </span>
            <span style={{ flex: 1 }}>{t.message}</span>
            <button
              onClick={() => remove(t.id)}
              style={{
                background: "none",
                border: "none",
                color: "#888",
                cursor: "pointer",
                padding: "2px",
                flexShrink: 0,
              }}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(100px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}} />
    </ToastContext.Provider>
  );
}
