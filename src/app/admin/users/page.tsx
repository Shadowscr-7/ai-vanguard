"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import {
  Search,
  Shield,
  ShieldOff,
  Trash2,
  UserCheck,
  Ban,
  Gift,
  ChevronLeft,
  ChevronRight,
  Filter,
  Loader2,
  AlertTriangle,
  Users,
  UserX,
  Crown,
  Sparkles,
} from "lucide-react";

interface UserData {
  id: string;
  name: string | null;
  email: string;
  role: string;
  banned: boolean;
  bannedAt: string | null;
  bannedReason: string | null;
  freePass: boolean;
  createdAt: string;
  image: string | null;
  _count: { purchases: number; reviews: number };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [banModal, setBanModal] = useState<{ userId: string; name: string } | null>(null);
  const [banReason, setBanReason] = useState("");

  const fetchUsers = useCallback(async (p = 1, q = "", f = "") => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(p), search: q, filter: f });
    const res = await fetch(`/api/admin/users?${params}`);
    const data = await res.json();
    setUsers(data.users || []);
    setTotal(data.total || 0);
    setPage(data.page || 1);
    setTotalPages(data.totalPages || 1);
    setLoading(false);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams({ page: "1", search: "", filter: "" });
    fetch(`/api/admin/users?${params}`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users || []);
        setTotal(data.total || 0);
        setPage(data.page || 1);
        setTotalPages(data.totalPages || 1);
        setLoading(false);
      });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(1, search, filter);
  };

  const doAction = async (userId: string, action: string, extra: Record<string, unknown> = {}) => {
    setActionLoading(userId);
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, action, ...extra }),
    });
    setActionLoading(null);
    fetchUsers(page, search, filter);
  };

  const toggleRole = (u: UserData) =>
    doAction(u.id, "toggle-role", { role: u.role === "ADMIN" ? "USER" : "ADMIN" });
  const confirmBan = () => {
    if (!banModal) return;
    doAction(banModal.userId, "ban", { reason: banReason || undefined });
    setBanModal(null);
    setBanReason("");
  };
  const unban = (u: UserData) => doAction(u.id, "unban");
  const toggleFreePass = (u: UserData) =>
    doAction(u.id, u.freePass ? "revoke-freepass" : "grant-freepass");

  const deleteUser = async (u: UserData) => {
    if (!confirm(`¿Eliminar a "${u.name || u.email}"? Esta acción no se puede deshacer.`)) return;
    setActionLoading(u.id);
    await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: u.id }),
    });
    setActionLoading(null);
    fetchUsers(page, search, filter);
  };

  const filterButtons = [
    { key: "", label: "Todos", icon: Users },
    { key: "banned", label: "Baneados", icon: UserX },
    { key: "freepass", label: "Free Pass", icon: Gift },
  ];

  const bannedCount = users.filter((u) => u.banned).length;
  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const freePassCount = users.filter((u) => u.freePass).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* ── Ban Modal ── */}
      {banModal && (
        <div className="a-modal-overlay">
          <div className="a-modal" style={{ maxWidth: 480 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: "linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.05))",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "1px solid rgba(239,68,68,0.2)",
              }}>
                <Ban size={22} color="#ef4444" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "#f0f0f5" }}>
                  Banear Usuario
                </h3>
                <p style={{ margin: "2px 0 0", fontSize: "0.82rem", color: "#6b6b80" }}>{banModal.name}</p>
              </div>
            </div>

            <div style={{
              padding: "14px 16px", borderRadius: 12, marginBottom: 20,
              background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.12)",
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <AlertTriangle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={{ margin: 0, color: "#d0d0e0", fontSize: "0.82rem", lineHeight: 1.6 }}>
                  El usuario no podrá iniciar sesión ni acceder a contenido. Esta acción es <strong style={{ color: "#f0f0f5" }}>reversible</strong>.
                </p>
              </div>
            </div>

            <div className="a-form-group">
              <label className="a-form-label">Razón (opcional)</label>
              <textarea
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Ej: Comportamiento inapropiado en comentarios…"
                rows={3}
                className="a-form-input"
              />
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 24 }}>
              <button onClick={() => { setBanModal(null); setBanReason(""); }} className="a-btn-outline" style={{ padding: "10px 22px" }}>
                Cancelar
              </button>
              <button onClick={confirmBan} className="a-btn" style={{
                padding: "10px 22px",
                background: "linear-gradient(135deg, #ef4444, #dc2626)",
                boxShadow: "0 4px 20px rgba(239,68,68,0.25)",
              }}>
                <Ban size={14} /> Confirmar Ban
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Header + Stats ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <h1 className="a-section-title">Gestión de Usuarios</h1>
          <p style={{ color: "#6b6b80", fontSize: "0.88rem", marginTop: 6 }}>
            Administra roles, permisos y acceso de {total} usuarios
          </p>
        </div>

        {/* Mini stat strip */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { icon: Users, value: total, label: "Total", color: "#6366f1", bg: "rgba(99,102,241,0.1)" },
            { icon: Crown, value: adminCount, label: "Admins", color: "#f97316", bg: "rgba(249,115,22,0.1)" },
            { icon: UserX, value: bannedCount, label: "Baneados", color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
            { icon: Sparkles, value: freePassCount, label: "Free Pass", color: "#10b981", bg: "rgba(16,185,129,0.1)" },
          ].map((s, i) => (
            <div key={i} className="a-card a-stat" style={{ padding: "12px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 9, background: s.bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <s.icon size={16} color={s.color} />
                </div>
                <div>
                  <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "#f0f0f5" }}>{s.value}</div>
                  <div style={{ fontSize: "0.62rem", color: "#6b6b80", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Search + Filters ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 12, padding: "14px 20px", borderRadius: 14,
        background: "rgba(15,15,35,0.4)", border: "1px solid rgba(255,255,255,0.04)",
      }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <Filter size={14} style={{ color: "#6b6b80", marginRight: 4 }} />
          <div className="a-tabs">
            {filterButtons.map((f) => (
              <button
                key={f.key}
                onClick={() => { setFilter(f.key); fetchUsers(1, search, f.key); }}
                className={`a-tab ${filter === f.key ? "active" : ""}`}
                style={{ display: "flex", alignItems: "center", gap: 5 }}
              >
                <f.icon size={13} />
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <form onSubmit={handleSearch} style={{ display: "flex", gap: 8 }}>
          <div style={{ position: "relative" }}>
            <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#6b6b80" }} />
            <input
              type="text"
              placeholder="Buscar nombre o email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="a-input"
              style={{ width: 240 }}
            />
          </div>
          <button type="submit" className="a-btn" style={{ padding: "9px 18px" }}>
            Buscar
          </button>
        </form>
      </div>

      {/* ── User List ── */}
      {loading ? (
        <div style={{ display: "flex", minHeight: "40vh", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
          <Loader2 size={32} color="#f97316" style={{ animation: "spin 1s linear infinite" }} />
          <span style={{ color: "#6b6b80", fontSize: "0.85rem" }}>Cargando usuarios…</span>
        </div>
      ) : users.length === 0 ? (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: "64px 24px", borderRadius: 16,
          background: "rgba(15,15,35,0.4)", border: "1px solid rgba(255,255,255,0.04)",
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: 20, marginBottom: 16,
            background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(99,102,241,0.05))",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "1px solid rgba(99,102,241,0.15)",
          }}>
            <Users size={28} color="#6366f1" />
          </div>
          <p style={{ color: "#6b6b80", fontSize: "0.95rem", fontWeight: 600 }}>No se encontraron usuarios</p>
          <p style={{ color: "#4a4a5a", fontSize: "0.82rem", marginTop: 4 }}>Intenta cambiar los filtros o la búsqueda</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {users.map((u, idx) => (
            <div
              key={u.id}
              className="a-user-row"
              style={{
                opacity: u.banned ? 0.6 : 1,
                animationDelay: `${idx * 0.04}s`,
                animation: `admin-fade-in 0.3s ease ${idx * 0.04}s both`,
              }}
            >
              {/* Left: avatar + info */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, minWidth: 0 }}>
                {u.image ? (
                  <Image src={u.image} alt="" width={42} height={42} style={{
                    borderRadius: 12, flexShrink: 0,
                    border: u.role === "ADMIN" ? "2px solid rgba(249,115,22,0.4)" : "2px solid rgba(255,255,255,0.06)",
                  }} />
                ) : (
                  <div style={{
                    width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                    background: u.banned
                      ? "linear-gradient(135deg, #3a3a4a, #2a2a3a)"
                      : u.role === "ADMIN"
                        ? "linear-gradient(135deg, #f97316, #ef4444)"
                        : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, fontWeight: 700, color: "#fff",
                    boxShadow: u.role === "ADMIN"
                      ? "0 4px 16px rgba(249,115,22,0.2)"
                      : u.banned ? "none" : "0 4px 16px rgba(99,102,241,0.15)",
                  }}>
                    {(u.name || u.email)[0].toUpperCase()}
                  </div>
                )}

                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 700, fontSize: "0.92rem", color: "#f0f0f5" }}>
                      {u.name || "Sin nombre"}
                    </span>
                    <span className="a-badge" style={{
                      background: u.role === "ADMIN" ? "rgba(249,115,22,0.12)" : "rgba(99,102,241,0.1)",
                      color: u.role === "ADMIN" ? "#f97316" : "#6366f1",
                      border: `1px solid ${u.role === "ADMIN" ? "rgba(249,115,22,0.25)" : "rgba(99,102,241,0.2)"}`,
                    }}>
                      {u.role === "ADMIN" ? "👑 ADMIN" : "USER"}
                    </span>
                    {u.banned && (
                      <span className="a-badge" style={{ background: "rgba(239,68,68,0.12)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.25)", display: "flex", alignItems: "center", gap: 3 }}>
                        <Ban size={9} /> BANEADO
                      </span>
                    )}
                    {u.freePass && (
                      <span className="a-badge" style={{ background: "rgba(16,185,129,0.12)", color: "#10b981", border: "1px solid rgba(16,185,129,0.25)", display: "flex", alignItems: "center", gap: 3 }}>
                        <Sparkles size={9} /> FREE PASS
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
                    <span style={{ color: "#6b6b80", fontSize: "0.78rem" }}>{u.email}</span>
                    <span style={{ color: "#3a3a4a" }}>·</span>
                    <span style={{ color: "#4a4a5a", fontSize: "0.72rem" }}>
                      {new Date(u.createdAt).toLocaleDateString("es", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Middle: mini stats */}
              <div style={{ display: "flex", gap: 20, marginRight: 24 }} className="a-hide-mobile">
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#f0f0f5" }}>{u._count.purchases}</div>
                  <div style={{ fontSize: "0.6rem", color: "#4a4a5a", fontWeight: 600, textTransform: "uppercase" }}>Compras</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#f0f0f5" }}>{u._count.reviews}</div>
                  <div style={{ fontSize: "0.6rem", color: "#4a4a5a", fontWeight: 600, textTransform: "uppercase" }}>Reviews</div>
                </div>
              </div>

              {/* Right: actions */}
              <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                <button
                  onClick={() => toggleRole(u)}
                  disabled={actionLoading === u.id}
                  className={`a-action ${u.role === "ADMIN" ? "warn" : ""}`}
                  title={u.role === "ADMIN" ? "Quitar admin" : "Hacer admin"}
                >
                  {u.role === "ADMIN" ? <ShieldOff size={13} /> : <Shield size={13} />}
                  <span className="a-hide-mobile">{u.role === "ADMIN" ? "Quitar" : "Admin"}</span>
                </button>

                {u.banned ? (
                  <button
                    onClick={() => unban(u)}
                    disabled={actionLoading === u.id}
                    className="a-action success"
                    title="Desbanear"
                  >
                    <UserCheck size={13} />
                    <span className="a-hide-mobile">Desbanear</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setBanModal({ userId: u.id, name: u.name || u.email })}
                    disabled={actionLoading === u.id}
                    className="a-action danger"
                    title="Banear"
                  >
                    <Ban size={13} />
                    <span className="a-hide-mobile">Banear</span>
                  </button>
                )}

                <button
                  onClick={() => toggleFreePass(u)}
                  disabled={actionLoading === u.id}
                  className={`a-action ${u.freePass ? "warn" : "success"}`}
                  title={u.freePass ? "Revocar free pass" : "Dar free pass"}
                >
                  <Gift size={13} />
                  <span className="a-hide-mobile">{u.freePass ? "Revocar" : "Free"}</span>
                </button>

                <button
                  onClick={() => deleteUser(u)}
                  disabled={actionLoading === u.id}
                  className="a-action danger"
                  title="Eliminar"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              {/* Loading overlay */}
              {actionLoading === u.id && (
                <div style={{
                  position: "absolute", inset: 0, borderRadius: 14,
                  background: "rgba(5,5,16,0.6)", backdropFilter: "blur(4px)",
                  display: "flex", alignItems: "center", justifyContent: "center", zIndex: 5,
                }}>
                  <Loader2 size={20} color="#f97316" style={{ animation: "spin 1s linear infinite" }} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 16,
          padding: "16px 0", marginTop: 4,
        }}>
          <button
            onClick={() => fetchUsers(page - 1, search, filter)}
            disabled={page <= 1}
            className="a-btn-outline"
            style={{ padding: "9px 18px", opacity: page <= 1 ? 0.35 : 1 }}
          >
            <ChevronLeft size={15} /> Anterior
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const p = page <= 3 ? i + 1 : page - 2 + i;
              if (p > totalPages || p < 1) return null;
              return (
                <button
                  key={p}
                  onClick={() => fetchUsers(p, search, filter)}
                  style={{
                    width: 36, height: 36, borderRadius: 10, border: "none",
                    background: p === page ? "linear-gradient(135deg, #f97316, #ef4444)" : "rgba(255,255,255,0.03)",
                    color: p === page ? "#fff" : "#6b6b80",
                    fontWeight: 700, fontSize: "0.82rem", cursor: "pointer",
                    transition: "all 0.25s",
                    boxShadow: p === page ? "0 4px 16px rgba(249,115,22,0.25)" : "none",
                  }}
                >
                  {p}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => fetchUsers(page + 1, search, filter)}
            disabled={page >= totalPages}
            className="a-btn-outline"
            style={{ padding: "9px 18px", opacity: page >= totalPages ? 0.35 : 1 }}
          >
            Siguiente <ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
