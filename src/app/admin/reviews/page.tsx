"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import {
  Search,
  Trash2,
  Star,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MessageSquare,
  Ban,
  TrendingUp,
  BarChart3,
} from "lucide-react";

interface ReviewData {
  id: string;
  videoId: string;
  rating: number;
  text: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    banned: boolean;
  };
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchReviews = useCallback(async (p = 1, q = "") => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(p), search: q });
    const res = await fetch(`/api/admin/reviews?${params}`);
    const data = await res.json();
    setReviews(data.reviews || []);
    setTotal(data.total || 0);
    setPage(data.page || 1);
    setTotalPages(data.totalPages || 1);
    setLoading(false);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams({ page: "1", search: "" });
    fetch(`/api/admin/reviews?${params}`)
      .then((res) => res.json())
      .then((data) => {
        setReviews(data.reviews || []);
        setTotal(data.total || 0);
        setPage(data.page || 1);
        setTotalPages(data.totalPages || 1);
        setLoading(false);
      });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReviews(1, search);
  };

  const deleteReview = async (r: ReviewData) => {
    if (!confirm(`¿Eliminar la review de "${r.user.name || r.user.email}" en video ${r.videoId}?`)) return;
    setDeleting(r.id);
    await fetch("/api/admin/reviews", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewId: r.id }),
    });
    setDeleting(null);
    fetchReviews(page, search);
  };

  const renderStars = (rating: number) => (
    <div style={{ display: "flex", gap: 3 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={14}
          fill={i <= rating ? "#eab308" : "transparent"}
          color={i <= rating ? "#eab308" : "#3a3a4a"}
          style={{ filter: i <= rating ? "drop-shadow(0 0 4px rgba(234,179,8,0.3))" : "none" }}
        />
      ))}
    </div>
  );

  // Summary stats
  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const dist = [1, 2, 3, 4, 5].map((n) => reviews.filter((r) => r.rating === n).length);
  const maxDist = Math.max(...dist, 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 className="a-section-title">Reviews y Comentarios</h1>
          <p style={{ color: "#6b6b80", fontSize: "0.88rem", marginTop: 6 }}>
            Modera y gestiona las opiniones de tus usuarios
          </p>
        </div>
        <form onSubmit={handleSearch} style={{ display: "flex", gap: 8 }}>
          <div style={{ position: "relative" }}>
            <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#6b6b80" }} />
            <input
              type="text"
              placeholder="Buscar por texto, usuario o video…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="a-input"
              style={{ width: 260 }}
            />
          </div>
          <button type="submit" className="a-btn" style={{ padding: "9px 18px" }}>
            Buscar
          </button>
        </form>
      </div>

      {/* ── Stats Row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
        <div className="a-card a-stat" style={{ padding: "18px 22px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, background: "rgba(234,179,8,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MessageSquare size={18} color="#eab308" />
            </div>
            <div>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#f0f0f5" }}>{total}</div>
              <div style={{ fontSize: "0.68rem", color: "#6b6b80", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Total Reviews</div>
            </div>
          </div>
        </div>

        <div className="a-card a-stat" style={{ padding: "18px 22px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, background: "rgba(249,115,22,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TrendingUp size={18} color="#f97316" />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#f0f0f5" }}>{avgRating.toFixed(1)}</span>
                <div style={{ display: "flex", gap: 2 }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={11} fill={i <= Math.round(avgRating) ? "#eab308" : "transparent"} color={i <= Math.round(avgRating) ? "#eab308" : "#4a4a5a"} />
                  ))}
                </div>
              </div>
              <div style={{ fontSize: "0.68rem", color: "#6b6b80", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Rating Promedio</div>
            </div>
          </div>
        </div>

        {/* Rating distribution */}
        <div className="a-card a-stat" style={{ padding: "18px 22px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, background: "rgba(99,102,241,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BarChart3 size={18} color="#6366f1" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.68rem", color: "#6b6b80", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>Distribución</div>
              <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 24 }}>
                {dist.map((count, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                    <div style={{
                      width: "100%", borderRadius: 3, minHeight: 3,
                      height: `${(count / maxDist) * 24}px`,
                      background: `linear-gradient(135deg, ${i >= 3 ? "#eab308" : i >= 2 ? "#f97316" : "#ef4444"}, ${i >= 3 ? "#eab30880" : i >= 2 ? "#f9731680" : "#ef444480"})`,
                    }} />
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 4, marginTop: 2 }}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <span key={n} style={{ flex: 1, textAlign: "center", fontSize: "0.55rem", color: "#4a4a5a", fontWeight: 600 }}>{n}★</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div style={{ display: "flex", minHeight: "40vh", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
          <Loader2 size={32} color="#f97316" style={{ animation: "spin 1s linear infinite" }} />
          <span style={{ color: "#6b6b80", fontSize: "0.85rem" }}>Cargando reviews…</span>
        </div>
      ) : reviews.length === 0 ? (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: "64px 24px", borderRadius: 16,
          background: "rgba(15,15,35,0.4)", border: "1px solid rgba(255,255,255,0.04)",
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: 20, marginBottom: 16,
            background: "linear-gradient(135deg, rgba(234,179,8,0.15), rgba(234,179,8,0.05))",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "1px solid rgba(234,179,8,0.15)",
          }}>
            <MessageSquare size={28} color="#eab308" />
          </div>
          <p style={{ color: "#6b6b80", fontSize: "0.95rem", fontWeight: 600 }}>No se encontraron reviews</p>
          <p style={{ color: "#4a4a5a", fontSize: "0.82rem", marginTop: 4 }}>Las reviews aparecerán aquí cuando los usuarios las dejen</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: 14 }}>
          {reviews.map((r, idx) => (
            <div
              key={r.id}
              className="a-review-card"
              style={{ animation: `admin-fade-in 0.3s ease ${idx * 0.05}s both` }}
            >
              {/* Header: user + actions */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {r.user.image ? (
                    <Image src={r.user.image} alt="" width={38} height={38} style={{
                      borderRadius: 10, flexShrink: 0,
                      border: "2px solid rgba(255,255,255,0.06)",
                    }} />
                  ) : (
                    <div style={{
                      width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                      background: r.user.banned
                        ? "linear-gradient(135deg, #3a3a4a, #2a2a3a)"
                        : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13, fontWeight: 700, color: "#fff",
                      boxShadow: r.user.banned ? "none" : "0 4px 12px rgba(99,102,241,0.15)",
                    }}>
                      {(r.user.name || r.user.email)[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontWeight: 700, fontSize: "0.88rem", color: "#f0f0f5" }}>
                        {r.user.name || r.user.email.split("@")[0]}
                      </span>
                      {r.user.banned && (
                        <span className="a-badge" style={{
                          background: "rgba(239,68,68,0.12)", color: "#ef4444",
                          border: "1px solid rgba(239,68,68,0.25)", fontSize: "0.58rem",
                        }}>
                          <Ban size={8} style={{ marginRight: 2 }} /> BAN
                        </span>
                      )}
                    </div>
                    <span style={{ color: "#4a4a5a", fontSize: "0.72rem" }}>{r.user.email}</span>
                  </div>
                </div>

                <button
                  onClick={() => deleteReview(r)}
                  disabled={deleting === r.id}
                  className="a-action danger"
                  title="Eliminar review"
                >
                  {deleting === r.id
                    ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} />
                    : <Trash2 size={13} />
                  }
                  <span>Eliminar</span>
                </button>
              </div>

              {/* Rating + meta */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12, flexWrap: "wrap" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "6px 12px",
                  borderRadius: 10, background: "rgba(234,179,8,0.06)",
                  border: "1px solid rgba(234,179,8,0.1)",
                }}>
                  {renderStars(r.rating)}
                  <span style={{ fontWeight: 800, fontSize: "0.85rem", color: "#eab308" }}>{r.rating}.0</span>
                </div>
                <span className="a-badge" style={{
                  background: "rgba(99,102,241,0.1)", color: "#6366f1",
                  border: "1px solid rgba(99,102,241,0.2)",
                }}>
                  🎬 {r.videoId}
                </span>
                <span style={{ color: "#4a4a5a", fontSize: "0.72rem" }}>
                  {new Date(r.createdAt).toLocaleDateString("es", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>

              {/* Text */}
              {r.text ? (
                <div style={{
                  padding: "14px 16px", borderRadius: 12,
                  background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)",
                }}>
                  <p style={{ color: "#d0d0e0", fontSize: "0.85rem", lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>
                    &ldquo;{r.text}&rdquo;
                  </p>
                </div>
              ) : (
                <div style={{
                  padding: "12px 16px", borderRadius: 12,
                  background: "rgba(255,255,255,0.01)", border: "1px dashed rgba(255,255,255,0.06)",
                  textAlign: "center",
                }}>
                  <span style={{ color: "#3a3a4a", fontSize: "0.78rem", fontStyle: "italic" }}>Sin comentario escrito</span>
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
            onClick={() => fetchReviews(page - 1, search)}
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
                  onClick={() => fetchReviews(p, search)}
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
            onClick={() => fetchReviews(page + 1, search)}
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
