"use client";

import { useEffect, useState } from "react";
import {
  ShoppingCart,
  Loader2,
  DollarSign,
  Package,
  TrendingUp,
  Calendar,
  CreditCard,
  Search,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface PurchaseData {
  id: string;
  productId: string;
  productType: string;
  amount: number;
  currency: string;
  paypalOrderId: string | null;
  status: string;
  createdAt: string;
  user: { name: string | null; email: string };
}

export default function AdminPurchasesPage() {
  const [purchases, setPurchases] = useState<PurchaseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQ, setSearchQ] = useState("");

  useEffect(() => {
    fetch("/api/admin/purchases")
      .then((res) => res.json())
      .then((data) => {
        setPurchases(data.purchases || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalRevenue = purchases.reduce((s, p) => s + (p.status === "completed" ? p.amount : 0), 0);
  const completedCount = purchases.filter((p) => p.status === "completed").length;
  const avgTicket = completedCount > 0 ? totalRevenue / completedCount : 0;
  const pendingCount = purchases.filter((p) => p.status === "pending").length;

  // Monthly breakdown
  const thisMonth = new Date().toISOString().slice(0, 7);
  const thisMonthRevenue = purchases
    .filter((p) => p.status === "completed" && p.createdAt.slice(0, 7) === thisMonth)
    .reduce((s, p) => s + p.amount, 0);

  const filtered = searchQ
    ? purchases.filter((p) =>
        (p.user.name || "").toLowerCase().includes(searchQ.toLowerCase()) ||
        p.user.email.toLowerCase().includes(searchQ.toLowerCase()) ||
        p.productId.toLowerCase().includes(searchQ.toLowerCase())
      )
    : purchases;

  const statusConfig: Record<string, { bg: string; color: string; border: string; icon: typeof ArrowUpRight }> = {
    completed: { bg: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)", icon: ArrowUpRight },
    pending: { bg: "rgba(234,179,8,0.1)", color: "#eab308", border: "1px solid rgba(234,179,8,0.2)", icon: Calendar },
    refunded: { bg: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)", icon: ArrowDownRight },
  };

  const typeConfig: Record<string, { bg: string; color: string; border: string; emoji: string }> = {
    course: { bg: "rgba(99,102,241,0.1)", color: "#6366f1", border: "1px solid rgba(99,102,241,0.2)", emoji: "🎓" },
    bundle: { bg: "rgba(168,85,247,0.1)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.2)", emoji: "📦" },
    book: { bg: "rgba(249,115,22,0.1)", color: "#f97316", border: "1px solid rgba(249,115,22,0.2)", emoji: "📖" },
  };

  if (loading) {
    return (
      <div style={{ display: "flex", minHeight: "60vh", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
        <Loader2 size={32} color="#f97316" style={{ animation: "spin 1s linear infinite" }} />
        <span style={{ color: "#6b6b80", fontSize: "0.85rem" }}>Cargando compras…</span>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* ── Header ── */}
      <div>
        <h1 className="a-section-title">Historial de Compras</h1>
        <p style={{ color: "#6b6b80", fontSize: "0.88rem", marginTop: 6 }}>
          Monitorea transacciones y revenue en tiempo real
        </p>
      </div>

      {/* ── Stats ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
        {[
          {
            icon: DollarSign, value: `$${totalRevenue.toFixed(2)}`,
            label: "Revenue Total", color: "#10b981", bg: "rgba(16,185,129,0.1)",
            sub: `${completedCount} completadas`,
          },
          {
            icon: TrendingUp, value: `$${thisMonthRevenue.toFixed(2)}`,
            label: "Este Mes", color: "#6366f1", bg: "rgba(99,102,241,0.1)",
            sub: thisMonth,
          },
          {
            icon: CreditCard, value: `$${avgTicket.toFixed(2)}`,
            label: "Ticket Promedio", color: "#a855f7", bg: "rgba(168,85,247,0.1)",
            sub: "por transacción",
          },
          {
            icon: ShoppingCart, value: String(purchases.length),
            label: "Total Compras", color: "#f97316", bg: "rgba(249,115,22,0.1)",
            sub: pendingCount > 0 ? `${pendingCount} pendientes` : "todo al día",
          },
        ].map((s, i) => (
          <div key={i} className="a-card a-stat" style={{ padding: "20px 24px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#f0f0f5", letterSpacing: "-0.5px" }}>
                  {s.value}
                </div>
                <div style={{ fontSize: "0.7rem", color: "#6b6b80", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginTop: 4 }}>
                  {s.label}
                </div>
                <div style={{ fontSize: "0.7rem", color: "#4a4a5a", marginTop: 2 }}>{s.sub}</div>
              </div>
              <div style={{
                width: 44, height: 44, borderRadius: 12, background: s.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: `1px solid ${s.color}20`,
              }}>
                <s.icon size={20} color={s.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Search ── */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "12px 20px", borderRadius: 14,
        background: "rgba(15,15,35,0.4)", border: "1px solid rgba(255,255,255,0.04)",
      }}>
        <Search size={15} color="#6b6b80" />
        <input
          type="text"
          placeholder="Buscar por usuario, email o producto…"
          value={searchQ}
          onChange={(e) => setSearchQ(e.target.value)}
          style={{
            flex: 1, border: "none", background: "transparent", color: "#f0f0f5",
            fontSize: "0.85rem", outline: "none", fontFamily: "inherit",
          }}
        />
        {searchQ && (
          <span style={{ color: "#4a4a5a", fontSize: "0.78rem" }}>
            {filtered.length} resultados
          </span>
        )}
      </div>

      {/* ── Table ── */}
      {filtered.length === 0 ? (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: "64px 24px", borderRadius: 16,
          background: "rgba(15,15,35,0.4)", border: "1px solid rgba(255,255,255,0.04)",
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: 20, marginBottom: 16,
            background: "linear-gradient(135deg, rgba(168,85,247,0.15), rgba(168,85,247,0.05))",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "1px solid rgba(168,85,247,0.15)",
          }}>
            <Package size={28} color="#a855f7" />
          </div>
          <p style={{ color: "#6b6b80", fontSize: "0.95rem", fontWeight: 600 }}>No hay compras registradas</p>
        </div>
      ) : (
        <div className="a-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table className="a-table" style={{ minWidth: 850 }}>
              <thead>
                <tr>
                  <th style={{ paddingLeft: 20, width: 40 }}>#</th>
                  <th>Usuario</th>
                  <th>Producto</th>
                  <th>Tipo</th>
                  <th>Monto</th>
                  <th>Estado</th>
                  <th>PayPal</th>
                  <th style={{ paddingRight: 20 }}>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, idx) => {
                  const sc = statusConfig[p.status] || statusConfig.pending;
                  const tc = typeConfig[p.productType] || typeConfig.course;
                  return (
                    <tr key={p.id} style={{ animation: `admin-fade-in 0.3s ease ${idx * 0.03}s both` }}>
                      <td style={{ paddingLeft: 20, color: "#4a4a5a", fontSize: "0.75rem", fontWeight: 600 }}>
                        {idx + 1}
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{
                            width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 12, fontWeight: 700, color: "#fff",
                          }}>
                            {(p.user.name || p.user.email)[0].toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "#f0f0f5" }}>
                              {p.user.name || "—"}
                            </div>
                            <div style={{ color: "#4a4a5a", fontSize: "0.72rem" }}>{p.user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontWeight: 700, fontSize: "0.85rem" }}>{p.productId}</td>
                      <td>
                        <span className="a-badge" style={{ background: tc.bg, color: tc.color, border: tc.border }}>
                          {tc.emoji} {p.productType.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 800, fontSize: "0.95rem", fontVariantNumeric: "tabular-nums", color: "#f0f0f5" }}>
                          ${p.amount.toFixed(2)}
                        </span>
                        <span style={{ color: "#4a4a5a", fontSize: "0.65rem", marginLeft: 4 }}>{p.currency}</span>
                      </td>
                      <td>
                        <span className="a-badge" style={{ background: sc.bg, color: sc.color, border: sc.border, display: "flex", alignItems: "center", gap: 4, width: "fit-content" }}>
                          <sc.icon size={10} />
                          {p.status.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        {p.paypalOrderId ? (
                          <span style={{
                            color: "#6b6b80", fontSize: "0.72rem", fontFamily: "monospace",
                            padding: "3px 8px", borderRadius: 6, background: "rgba(255,255,255,0.02)",
                          }}>
                            {p.paypalOrderId.slice(0, 18)}…
                          </span>
                        ) : (
                          <span style={{ color: "#3a3a4a", fontSize: "0.75rem" }}>—</span>
                        )}
                      </td>
                      <td style={{ paddingRight: 20 }}>
                        <div style={{ color: "#6b6b80", fontSize: "0.8rem" }}>
                          {new Date(p.createdAt).toLocaleDateString("es", { day: "numeric", month: "short" })}
                        </div>
                        <div style={{ color: "#3a3a4a", fontSize: "0.68rem" }}>
                          {new Date(p.createdAt).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
