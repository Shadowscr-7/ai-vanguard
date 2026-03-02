"use client";

import { useEffect, useState } from "react";
import {
  Users,
  DollarSign,
  ShoppingCart,
  Shield,
  TrendingUp,
  ArrowUpRight,
  Package,
  Clock,
  Ban,
  Gift,
} from "lucide-react";
import Link from "next/link";

interface Stats {
  totalUsers: number;
  totalPurchases: number;
  totalRevenue: number;
  totalAdmins: number;
  totalBanned: number;
  totalFreePass: number;
  recentUsers: {
    id: string;
    name: string | null;
    email: string;
    createdAt: string;
    role: string;
    banned: boolean;
    freePass: boolean;
  }[];
  recentPurchases: {
    id: string;
    productId: string;
    productType: string;
    amount: number;
    createdAt: string;
    user: { name: string | null; email: string };
  }[];
  purchasesByProduct: {
    productId: string;
    _count: number;
    _sum: { amount: number | null };
  }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", minHeight: "60vh", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ position: "relative", width: 56, height: 56 }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "3px solid transparent", borderTopColor: "#f97316", borderRightColor: "#ef4444", animation: "spin 0.8s linear infinite" }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Shield size={20} color="#f97316" />
            </div>
          </div>
          <p style={{ color: "#6b6b80", fontSize: "0.85rem" }}>Cargando panel…</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="a-card" style={{ padding: 48, textAlign: "center" }}>
        <p style={{ color: "#a0a0b8" }}>Error al cargar estadísticas.</p>
      </div>
    );
  }

  const topProduct = stats.purchasesByProduct.reduce(
    (best, p) => ((p._sum.amount || 0) > (best._sum.amount || 0) ? p : best),
    stats.purchasesByProduct[0]
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* ── Title ── */}
      <div>
        <h1 className="a-section-title">Panel de Administración</h1>
        <p style={{ color: "#6b6b80", fontSize: "0.9rem", marginTop: 4 }}>
          Vista general de tu plataforma educativa.
        </p>
      </div>

      {/* ── Stats Grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        <StatCard icon={Users} value={stats.totalUsers} label="Usuarios Totales" color="#6366f1" delay={0} />
        <StatCard icon={DollarSign} value={`$${stats.totalRevenue.toFixed(2)}`} label="Ingresos Totales" color="#10b981" delay={1} />
        <StatCard icon={ShoppingCart} value={stats.totalPurchases} label="Compras Realizadas" color="#06b6d4" delay={2} />
        <StatCard icon={Shield} value={stats.totalAdmins} label="Administradores" color="#f97316" delay={3} />
        <StatCard icon={Ban} value={stats.totalBanned} label="Usuarios Baneados" color="#ef4444" delay={4} />
        <StatCard icon={Gift} value={stats.totalFreePass} label="Free Pass Activos" color="#10b981" delay={5} />
      </div>

      {/* ── Quick Insights Row ── */}
      {topProduct && (
        <div className="a-card" style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div className="a-orb" style={{ width: 100, height: 100, top: -30, right: -20, background: "rgba(16,185,129,0.06)", filter: "blur(35px)", animation: "admin-float 8s ease-in-out infinite" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <TrendingUp size={16} color="#10b981" />
            <span style={{ fontSize: "0.82rem", color: "#6b6b80" }}>Producto estrella:</span>
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.9rem", color: "#f0f0f5" }}>
            {topProduct.productId}
          </span>
          <span style={{ fontSize: "0.82rem", color: "#10b981", fontWeight: 600 }}>
            ${(topProduct._sum.amount || 0).toFixed(2)} ({topProduct._count} ventas)
          </span>
          <div style={{ marginLeft: "auto" }}>
            <span style={{ fontSize: "0.78rem", color: "#6b6b80" }}>
              Ticket promedio: ${stats.totalPurchases > 0 ? (stats.totalRevenue / stats.totalPurchases).toFixed(2) : "0.00"}
            </span>
          </div>
        </div>
      )}

      {/* ── Two Column Grid ── */}
      <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))" }}>
        {/* Revenue by Product */}
        <div className="a-card" style={{ padding: 28 }}>
          <div className="a-orb" style={{ width: 120, height: 120, top: -35, right: -25, background: "rgba(16,185,129,0.05)", filter: "blur(35px)", animation: "admin-float 7s ease-in-out infinite" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(16,185,129,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <DollarSign size={18} color="#10b981" />
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.05rem", color: "#f0f0f5", margin: 0 }}>
                  Ventas por Producto
                </h3>
              </div>
              <Link href="/admin/purchases" className="a-btn-outline" style={{ padding: "5px 12px", fontSize: "0.75rem" }}>
                Ver todas <ArrowUpRight size={12} />
              </Link>
            </div>

            {stats.purchasesByProduct.length === 0 ? (
              <p style={{ color: "#6b6b80", fontSize: "0.85rem" }}>Sin ventas aún</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {stats.purchasesByProduct.map((p) => {
                  const maxAmount = Math.max(...stats.purchasesByProduct.map((x) => x._sum.amount || 0));
                  const pct = maxAmount > 0 ? Math.round(((p._sum.amount || 0) / maxAmount) * 100) : 0;
                  return (
                    <div key={p.productId} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Package size={14} color="#6b6b80" />
                          <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#d0d0e0" }}>{p.productId}</span>
                          <span className="a-badge" style={{ background: "rgba(99,102,241,0.1)", color: "#6366f1" }}>
                            {p._count} ventas
                          </span>
                        </div>
                        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.9rem", color: "#10b981" }}>
                          ${(p._sum.amount || 0).toFixed(2)}
                        </span>
                      </div>
                      {/* Bar */}
                      <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.04)", overflow: "hidden" }}>
                        <div style={{ height: "100%", borderRadius: 2, width: `${pct}%`, background: "linear-gradient(90deg, #10b981, #06b6d4)", transition: "width 0.8s ease" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="a-card" style={{ padding: 28 }}>
          <div className="a-orb" style={{ width: 100, height: 100, top: -25, right: -15, background: "rgba(99,102,241,0.05)", filter: "blur(35px)", animation: "admin-float 9s ease-in-out infinite" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(99,102,241,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Users size={18} color="#6366f1" />
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.05rem", color: "#f0f0f5", margin: 0 }}>
                  Usuarios Recientes
                </h3>
              </div>
              <Link href="/admin/users" className="a-btn-outline" style={{ padding: "5px 12px", fontSize: "0.75rem" }}>
                Ver todos <ArrowUpRight size={12} />
              </Link>
            </div>

            {stats.recentUsers.length === 0 ? (
              <p style={{ color: "#6b6b80", fontSize: "0.85rem" }}>Sin usuarios aún</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {stats.recentUsers.map((u) => (
                  <div
                    key={u.id}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", transition: "all 0.2s" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: u.role === "ADMIN" ? "linear-gradient(135deg, #f97316, #ef4444)" : "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>
                        {(u.name || u.email)[0].toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#f0f0f5" }}>{u.name || "Sin nombre"}</div>
                        <div style={{ fontSize: "0.75rem", color: "#6b6b80" }}>{u.email}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {u.banned && (
                        <span className="a-badge" style={{ background: "rgba(239,68,68,0.12)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.25)" }}>
                          BAN
                        </span>
                      )}
                      {u.freePass && (
                        <span className="a-badge" style={{ background: "rgba(16,185,129,0.12)", color: "#10b981", border: "1px solid rgba(16,185,129,0.25)" }}>
                          FREE
                        </span>
                      )}
                      <span
                        className="a-badge"
                        style={{
                          background: u.role === "ADMIN" ? "rgba(249,115,22,0.12)" : "rgba(99,102,241,0.12)",
                          color: u.role === "ADMIN" ? "#f97316" : "#6366f1",
                          border: `1px solid ${u.role === "ADMIN" ? "rgba(249,115,22,0.25)" : "rgba(99,102,241,0.25)"}`,
                        }}
                      >
                        {u.role}
                      </span>
                      <span style={{ fontSize: "0.72rem", color: "#6b6b80", display: "flex", alignItems: "center", gap: 3 }}>
                        <Clock size={10} />
                        {new Date(u.createdAt).toLocaleDateString("es")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Recent Purchases Table ── */}
      <div className="a-card" style={{ padding: 28 }}>
        <div className="a-orb" style={{ width: 150, height: 150, top: -50, left: "40%", background: "rgba(6,182,212,0.04)", filter: "blur(35px)", animation: "admin-float 10s ease-in-out infinite" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(6,182,212,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ShoppingCart size={18} color="#06b6d4" />
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.05rem", color: "#f0f0f5", margin: 0 }}>
                Compras Recientes
              </h3>
            </div>
            <Link href="/admin/purchases" className="a-btn-outline" style={{ padding: "5px 12px", fontSize: "0.75rem" }}>
              Historial completo <ArrowUpRight size={12} />
            </Link>
          </div>

          {stats.recentPurchases.length === 0 ? (
            <p style={{ color: "#6b6b80", fontSize: "0.85rem" }}>Sin compras aún</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="a-table">
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Producto</th>
                    <th>Tipo</th>
                    <th>Monto</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentPurchases.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                            {(p.user.name || p.user.email)[0].toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>{p.user.name || "—"}</div>
                            <div style={{ fontSize: "0.72rem", color: "#6b6b80" }}>{p.user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontWeight: 600 }}>{p.productId}</td>
                      <td>
                        <span
                          className="a-badge"
                          style={{
                            background: p.productType === "course" ? "rgba(99,102,241,0.12)" : "rgba(139,92,246,0.12)",
                            color: p.productType === "course" ? "#6366f1" : "#a855f7",
                            border: `1px solid ${p.productType === "course" ? "rgba(99,102,241,0.25)" : "rgba(139,92,246,0.25)"}`,
                          }}
                        >
                          {p.productType}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "#10b981" }}>
                          ${p.amount.toFixed(2)}
                        </span>
                      </td>
                      <td style={{ color: "#6b6b80", fontSize: "0.82rem" }}>
                        {new Date(p.createdAt).toLocaleDateString("es")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Stat Card ── */
function StatCard({
  icon: Icon,
  value,
  label,
  color,
  delay,
}: {
  icon: typeof Users;
  value: string | number;
  label: string;
  color: string;
  delay: number;
}) {
  return (
    <div className="a-card a-stat" style={{ padding: 24, animationDelay: `${delay * 0.06}s` }}>
      <div className="a-orb" style={{ width: 80, height: 80, top: -20, right: -10, background: `${color}0a`, filter: "blur(30px)", animation: "admin-float 8s ease-in-out infinite" }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, boxShadow: `0 0 20px ${color}15` }}>
          <Icon size={20} style={{ color }} />
        </div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "1.85rem", fontWeight: 800, color: "#f0f0f5", lineHeight: 1 }}>
          {value}
        </div>
        <div style={{ fontSize: "0.78rem", color: "#6b6b80", marginTop: 6 }}>{label}</div>
      </div>
    </div>
  );
}
