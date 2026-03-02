"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  GraduationCap,
  TrendingUp,
  Clock,
  Play,
  Download,
  ShoppingCart,
  LogOut,
  ChevronRight,
  Sparkles,
  Compass,
  Shield,
  Zap,
  Star,
  Home,
  Library,
  ArrowRight,
} from "lucide-react";
import { courses, bundles, books } from "@/data/content";

/* ───────── types ───────── */
interface Purchase {
  id: string;
  productId: string;
  productType: string;
  amount: number;
  createdAt: string;
}
interface ProgressEntry {
  courseId: string;
  videoId: string;
}
type Tab = "overview" | "courses" | "books" | "explore";

/* ───────── dashboard-specific CSS (animations, hover states) ───────── */
const dashCSS = `
/* float animation for decorative orbs */
@keyframes db-float {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-12px) scale(1.05); }
}
@keyframes db-float-alt {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-8px) rotate(3deg); }
}
/* shimmer sweep on cards */
@keyframes db-shimmer {
  0% { left: -100%; }
  100% { left: 200%; }
}
/* glow pulse for featured items */
@keyframes db-glow-pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(99,102,241,0.15); }
  50% { box-shadow: 0 0 40px rgba(99,102,241,0.3); }
}
/* stat counter pop */
@keyframes db-pop {
  0% { transform: scale(0.8); opacity: 0; }
  60% { transform: scale(1.05); }
  100% { transform: scale(1); opacity: 1; }
}

/* ── Dashboard card ── */
.db-card {
  background: var(--bg-card, rgba(15,15,35,0.6));
  border: 1px solid var(--border-color, rgba(255,255,255,0.06));
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4,0,0.2,1);
}
.db-card::before {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent);
  opacity: 0;
  transition: opacity 0.4s;
}
.db-card::after {
  content: "";
  position: absolute;
  top: 0; left: -100%;
  width: 60%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.02), transparent);
  transition: none;
  pointer-events: none;
}
.db-card:hover {
  background: var(--bg-card-hover, rgba(25,25,55,0.8));
  border-color: rgba(99,102,241,0.3);
  transform: translateY(-6px);
  box-shadow: 0 12px 40px rgba(99,102,241,0.12), 0 0 0 1px rgba(99,102,241,0.1);
}
.db-card:hover::before { opacity: 1; }
.db-card:hover::after {
  animation: db-shimmer 0.8s ease forwards;
}

/* ── Stat card ── */
.db-stat {
  animation: db-pop 0.5s ease both;
}
.db-stat:nth-child(2) { animation-delay: 0.08s; }
.db-stat:nth-child(3) { animation-delay: 0.16s; }
.db-stat:nth-child(4) { animation-delay: 0.24s; }

/* ── Decorative orb inside cards ── */
.db-orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(40px);
}
.db-orb-1 {
  width: 120px; height: 120px;
  top: -30px; right: -20px;
  animation: db-float 6s ease-in-out infinite;
}
.db-orb-2 {
  width: 80px; height: 80px;
  bottom: -20px; left: 10%;
  animation: db-float-alt 8s ease-in-out infinite;
}

/* ── Action button (primary) ── */
.db-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 24px;
  border-radius: 12px;
  border: none;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
  text-decoration: none;
  color: #fff;
  background: linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4);
  box-shadow: 0 4px 20px rgba(99,102,241,0.25);
}
.db-btn::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent 50%);
  opacity: 0;
  transition: opacity 0.3s;
}
.db-btn:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 35px rgba(99,102,241,0.4), 0 0 60px rgba(99,102,241,0.15);
}
.db-btn:hover::before { opacity: 1; }
.db-btn:active { transform: translateY(-1px) scale(0.98); }

.db-btn-full { width: 100%; }

.db-btn-lg {
  padding: 14px 32px;
  font-size: 0.95rem;
  border-radius: 14px;
}

/* ── Secondary / outline button ── */
.db-btn-outline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 9px 18px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.03);
  color: #f0f0f5;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
  text-decoration: none;
}
.db-btn-outline::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(99,102,241,0.08), transparent 60%);
  opacity: 0;
  transition: opacity 0.3s;
}
.db-btn-outline:hover {
  border-color: rgba(99,102,241,0.4);
  background: rgba(99,102,241,0.08);
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(99,102,241,0.1);
}
.db-btn-outline:hover::before { opacity: 1; }

/* ── Bundle color button ── */
.db-btn-color {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px 0;
  border-radius: 12px;
  border: none;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  color: #fff;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
}
.db-btn-color::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent 50%);
  opacity: 0;
  transition: opacity 0.3s;
}
.db-btn-color:hover {
  transform: translateY(-2px);
  filter: brightness(1.15);
}
.db-btn-color:hover::before { opacity: 1; }

/* ── Quick-action cards ── */
.db-qaction {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px 16px;
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.06);
  background: rgba(15,15,35,0.6);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4,0,0.2,1);
}
.db-qaction::before {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  opacity: 0;
  transition: opacity 0.3s;
}
.db-qaction:hover {
  background: rgba(25,25,55,0.8);
  border-color: rgba(99,102,241,0.2);
  transform: translateY(-6px);
  box-shadow: 0 8px 30px rgba(99,102,241,0.1);
}
.db-qaction:hover::before { opacity: 1; }
.db-qaction:hover .db-qaction-icon {
  transform: scale(1.15);
}
.db-qaction-icon {
  transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
}

/* ── Tab button in nav ── */
.db-tab {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 16px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
  position: relative;
}
.db-tab:hover {
  background: rgba(99,102,241,0.08);
  color: #c0c0d0;
}

/* ── Progress bar ── */
.db-progress-track {
  height: 6px;
  border-radius: 3px;
  background: rgba(255,255,255,0.06);
  overflow: hidden;
  position: relative;
}
.db-progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.8s cubic-bezier(0.4,0,0.2,1);
  position: relative;
}
.db-progress-fill::after {
  content: "";
  position: absolute;
  top: 0; right: 0;
  width: 20px; height: 100%;
  background: rgba(255,255,255,0.25);
  border-radius: 3px;
  filter: blur(3px);
}

/* ── Owned badge ── */
.db-owned-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 0;
  border-radius: 12px;
  background: rgba(16,185,129,0.08);
  border: 1px solid rgba(16,185,129,0.2);
  color: #10b981;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.3s;
}
.db-owned-badge:hover {
  background: rgba(16,185,129,0.12);
  box-shadow: 0 0 20px rgba(16,185,129,0.1);
}

/* utility: hide on mobile / hide on desktop */
@media (max-width: 639px) {
  .db-hide-mobile { display: none !important; }
}
@media (min-width: 640px) {
  .db-hide-desktop { display: none !important; }
}
`;

/* ══════════════════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login?callbackUrl=/dashboard");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/purchases")
        .then((r) => r.json())
        .then((d) => {
          setPurchases(d.purchases || []);
          setProgress(d.progress || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [status]);

  /* loading state */
  if (status === "loading" || loading) {
    return (
      <div style={{ background: "#050510", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <style dangerouslySetInnerHTML={{ __html: dashCSS }} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <div style={{ position: "relative", width: 64, height: 64 }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: "3px solid transparent",
                borderTopColor: "#6366f1",
                borderRightColor: "#8b5cf6",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Sparkles size={22} color="#6366f1" />
            </div>
          </div>
          <p style={{ color: "#6b6b80", fontSize: "0.875rem" }}>Cargando tu espacio…</p>
        </div>
      </div>
    );
  }
  if (!session) return null;

  /* ── derived data ── */
  const purchasedIds = new Set(purchases.map((p) => p.productId));
  const userCourses = courses.filter((c) => purchasedIds.has(c.id));
  const userBookIds = new Set<number>();
  purchases.forEach((p) => {
    if (p.productType === "bundle") {
      const b = bundles.find((x) => x.id === p.productId);
      if (b) b.bookIds.forEach((id) => userBookIds.add(id));
    }
  });
  const userBooks = books.filter((b) => userBookIds.has(b.id));
  const totalHours = userCourses.reduce((a, c) => a + c.totalHours, 0);
  let avgProgress = 0;
  if (userCourses.length > 0) {
    avgProgress = Math.round(
      userCourses
        .map((c) => (progress.filter((p) => p.courseId === c.id).length / c.totalVideos) * 100)
        .reduce((a, b) => a + b, 0) / userCourses.length
    );
  }

  const userName = session.user?.name || "Usuario";
  const userEmail = session.user?.email || "";
  const initials = userName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  const tabs: { key: Tab; label: string; icon: typeof Home }[] = [
    { key: "overview", label: "Inicio", icon: Home },
    { key: "courses", label: "Cursos", icon: GraduationCap },
    { key: "books", label: "Libros", icon: Library },
    { key: "explore", label: "Tienda", icon: ShoppingCart },
  ];

  return (
    <div style={{ background: "#050510", minHeight: "100vh" }}>
      <style dangerouslySetInnerHTML={{ __html: dashCSS }} />

      {/* ═══ Ambient background glows ═══ */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "-15%", left: "8%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: "-10%", right: "5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", top: "40%", left: "50%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.03) 0%, transparent 70%)" }} />
      </div>

      {/* ═══ Top Navigation ═══ */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(5,5,16,0.85)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Left */}
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
              <img src="/images/logo.png" alt="IA Vanguard" style={{ width: 34, height: 34, borderRadius: 10 }} />
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem", background: "linear-gradient(135deg, #6366f1, #06b6d4, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                IA Vanguard
              </span>
            </Link>

            {/* Desktop tabs — hidden below sm via our CSS media query */}
            <div className="db-hide-mobile" style={{ display: "flex", gap: 4 }}>
              {tabs.map((t) => {
                const active = activeTab === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    className="db-tab"
                    style={{ background: active ? "rgba(99,102,241,0.15)" : "transparent", color: active ? "#6366f1" : "#a0a0b8" }}
                  >
                    <t.icon size={16} />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {session.user?.role === "ADMIN" && (
              <Link
                href="/admin"
                className="db-btn-outline"
                style={{ borderColor: "rgba(249,115,22,0.3)", background: "rgba(249,115,22,0.08)", color: "#f97316", padding: "7px 14px", fontSize: "0.8rem" }}
              >
                <Shield size={14} />
                <span className="db-hide-mobile">Admin</span>
              </Link>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {session.user?.image ? (
                <Image src={session.user.image} alt="" width={32} height={32} style={{ borderRadius: "50%" }} />
              ) : (
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>
                  {initials}
                </div>
              )}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                style={{ background: "none", border: "none", color: "#6b6b80", cursor: "pointer", padding: 6, borderRadius: 8, display: "flex", transition: "color 0.2s" }}
                title="Cerrar sesión"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ═══ Mobile Tab Bar — visible only below 640px ═══ */}
      <div
        className="db-hide-desktop"
        style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50, background: "rgba(5,5,16,0.95)", backdropFilter: "blur(24px)", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-around", padding: "8px 0 12px" }}
      >
        {tabs.map((t) => {
          const active = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "none", border: "none", cursor: "pointer", color: active ? "#6366f1" : "#6b6b80", transition: "color 0.2s" }}
            >
              <t.icon size={20} />
              <span style={{ fontSize: 10, fontWeight: 600 }}>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* ═══ Page Content ═══ */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "32px 24px 100px" }}>
        {activeTab === "overview" && (
          <Overview
            userName={userName}
            userEmail={userEmail}
            initials={initials}
            image={session.user?.image}
            totalCourses={userCourses.length}
            totalBooks={userBooks.length}
            totalHours={totalHours}
            avgProgress={avgProgress}
            userCourses={userCourses}
            progress={progress}
            onNavigate={setActiveTab}
          />
        )}
        {activeTab === "courses" && <CoursesTab userCourses={userCourses} progress={progress} onExplore={() => setActiveTab("explore")} />}
        {activeTab === "books" && <BooksTab userBooks={userBooks} onExplore={() => setActiveTab("explore")} />}
        {activeTab === "explore" && <ExploreTab purchasedIds={purchasedIds} />}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   OVERVIEW
   ══════════════════════════════════════════════════════════════ */
function Overview({
  userName, userEmail, initials, image, totalCourses, totalBooks, totalHours, avgProgress, userCourses, progress, onNavigate,
}: {
  userName: string; userEmail: string; initials: string; image?: string | null;
  totalCourses: number; totalBooks: number; totalHours: number; avgProgress: number;
  userCourses: typeof courses; progress: ProgressEntry[]; onNavigate: (t: Tab) => void;
}) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Buenos días" : hour < 18 ? "Buenas tardes" : "Buenas noches";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {/* ── Hero Banner ── */}
      <div
        className="db-card"
        style={{
          padding: "44px 36px",
          background: "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 50%, rgba(6,182,212,0.06) 100%)",
          border: "1px solid rgba(99,102,241,0.15)",
          borderRadius: 20,
        }}
      >
        {/* Decorative animated orbs */}
        <div className="db-orb db-orb-1" style={{ background: "rgba(99,102,241,0.1)" }} />
        <div className="db-orb db-orb-2" style={{ background: "rgba(139,92,246,0.08)" }} />
        {/* Diagonal decorative line */}
        <div style={{ position: "absolute", top: 0, right: 80, width: 1, height: "100%", background: "linear-gradient(to bottom, transparent, rgba(99,102,241,0.1), transparent)", transform: "rotate(15deg)", transformOrigin: "top" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
            {image ? (
              <Image src={image} alt="" width={52} height={52} style={{ borderRadius: "50%", border: "2px solid rgba(99,102,241,0.4)" }} />
            ) : (
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 700, color: "#fff", border: "2px solid rgba(99,102,241,0.4)", boxShadow: "0 0 25px rgba(99,102,241,0.25)" }}>
                {initials}
              </div>
            )}
            <div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 3vw, 2.1rem)", fontWeight: 800, color: "#f0f0f5", margin: 0, lineHeight: 1.2 }}>
                {greeting},{" "}
                <span style={{ background: "linear-gradient(135deg, #6366f1, #06b6d4, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {userName.split(" ")[0]}
                </span>
              </h1>
              <p style={{ color: "#a0a0b8", fontSize: "0.9rem", margin: "4px 0 0" }}>{userEmail}</p>
            </div>
          </div>
          <p style={{ color: "#a0a0b8", fontSize: "0.95rem", maxWidth: 520, lineHeight: 1.7 }}>
            Tu espacio personal de aprendizaje. Aquí encontrarás tus cursos, libros y progreso.
          </p>
        </div>
      </div>

      {/* ── Stats ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        <StatCard icon={GraduationCap} value={totalCourses} label="Cursos Activos" color="#6366f1" />
        <StatCard icon={BookOpen} value={totalBooks} label="Libros Disponibles" color="#06b6d4" />
        <StatCard icon={TrendingUp} value={`${avgProgress}%`} label="Progreso General" color="#10b981" />
        <StatCard icon={Clock} value={`${totalHours}h`} label="Horas de Contenido" color="#f97316" />
      </div>

      {/* ── Continue learning / CTA ── */}
      {userCourses.length > 0 ? (
        <section>
          <SectionHeader title="Continuar Aprendiendo" action="Ver todos" onAction={() => onNavigate("courses")} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 16 }}>
            {userCourses.slice(0, 2).map((c) => (
              <CourseCard key={c.id} course={c} watched={progress.filter((p) => p.courseId === c.id).length} />
            ))}
          </div>
        </section>
      ) : (
        <EmptyCTA onAction={() => onNavigate("explore")} />
      )}

      {/* ── Quick Actions ── */}
      <section>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.2rem", color: "#f0f0f5", margin: "0 0 20px" }}>
          Acceso Rápido
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
          <QAction icon={GraduationCap} label="Mis Cursos" color="#6366f1" onClick={() => onNavigate("courses")} />
          <QAction icon={Library} label="Mis Libros" color="#06b6d4" onClick={() => onNavigate("books")} />
          <QAction icon={ShoppingCart} label="Tienda" color="#8b5cf6" onClick={() => onNavigate("explore")} />
          <QAction icon={Star} label="Landing" color="#f97316" onClick={() => (window.location.href = "/")} />
        </div>
      </section>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   COURSES TAB
   ══════════════════════════════════════════════════════════════ */
function CoursesTab({ userCourses, progress, onExplore }: { userCourses: typeof courses; progress: ProgressEntry[]; onExplore: () => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.75rem", color: "#f0f0f5", margin: 0 }}>Mis Cursos</h1>
        <p style={{ color: "#a0a0b8", marginTop: 4, fontSize: "0.9rem" }}>
          {userCourses.length > 0 ? `${userCourses.length} curso${userCourses.length > 1 ? "s" : ""} en tu colección` : "Aún no tienes cursos"}
        </p>
      </div>
      {userCourses.length === 0 ? (
        <EmptyState icon={GraduationCap} title="Sin cursos" desc="Explora nuestros cursos y comienza hoy." btn="Explorar Cursos" onAction={onExplore} />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 16 }}>
          {userCourses.map((c) => (
            <CourseCard key={c.id} course={c} watched={progress.filter((p) => p.courseId === c.id).length} showMeta />
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   BOOKS TAB
   ══════════════════════════════════════════════════════════════ */
function BooksTab({ userBooks, onExplore }: { userBooks: typeof books; onExplore: () => void }) {
  const lc: Record<number, string> = { 1: "#06b6d4", 2: "#a855f7", 3: "#f97316" };
  const ln: Record<number, string> = { 1: "Nivel I — Iniciación", 2: "Nivel II — Profundización", 3: "Nivel III — Trascendencia" };
  const groups = [1, 2, 3].map((l) => ({ level: l, items: userBooks.filter((b) => b.level === l) })).filter((g) => g.items.length > 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.75rem", color: "#f0f0f5", margin: 0 }}>Mi Biblioteca</h1>
        <p style={{ color: "#a0a0b8", marginTop: 4, fontSize: "0.9rem" }}>
          {userBooks.length > 0 ? `${userBooks.length} libro${userBooks.length > 1 ? "s" : ""} desbloqueados` : "Tu biblioteca está vacía"}
        </p>
      </div>
      {userBooks.length === 0 ? (
        <EmptyState icon={BookOpen} title="Sin libros" desc="Adquiere un bundle para desbloquear libros." btn="Ver Bundles" onAction={onExplore} />
      ) : (
        groups.map(({ level, items }) => (
          <section key={level}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 32, height: 4, borderRadius: 2, background: lc[level] }} />
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.05rem", color: "#f0f0f5", margin: 0 }}>{ln[level]}</h2>
              <span style={{ fontSize: "0.75rem", color: "#6b6b80" }}>{items.length} libros</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
              {items.map((book) => (
                <BookCard key={book.id} book={book} color={lc[book.level]} />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   EXPLORE TAB
   ══════════════════════════════════════════════════════════════ */
function ExploreTab({ purchasedIds }: { purchasedIds: Set<string> }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <div>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.75rem", color: "#f0f0f5", margin: 0 }}>Tienda</h1>
        <p style={{ color: "#a0a0b8", marginTop: 4, fontSize: "0.9rem" }}>Explora todos los cursos y bundles disponibles.</p>
      </div>

      {/* Courses */}
      <section>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.2rem", color: "#f0f0f5", margin: "0 0 16px" }}>Cursos</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 16 }}>
          {courses.map((course) => {
            const owned = purchasedIds.has(course.id);
            return (
              <div key={course.id} className="db-card" style={owned ? { borderColor: "rgba(16,185,129,0.25)" } : {}}>
                {/* top gradient bar */}
                <div style={{ height: 3, background: owned ? "linear-gradient(90deg,#10b981,#06b6d4)" : "linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)" }} />
                {/* floating orb */}
                <div className="db-orb" style={{ width: 100, height: 100, top: -30, right: -20, background: owned ? "rgba(16,185,129,0.06)" : "rgba(99,102,241,0.06)", animation: "db-float 7s ease-in-out infinite" }} />
                <div style={{ padding: 24, position: "relative", zIndex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: "rgba(99,102,241,0.12)", color: "#6366f1", letterSpacing: 0.5 }}>
                      {course.level}
                    </span>
                    <span style={{ fontSize: 12, color: "#6b6b80" }}>{course.totalVideos} videos · {course.totalHours}h</span>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.15rem", color: "#f0f0f5", margin: "0 0 6px" }}>{course.title}</h3>
                  <p style={{ fontSize: "0.85rem", color: "#a0a0b8", margin: "0 0 22px", lineHeight: 1.6 }}>{course.subtitle}</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    {owned ? (
                      <>
                        <span style={{ display: "flex", alignItems: "center", gap: 6, color: "#10b981", fontSize: "0.85rem", fontWeight: 600 }}>
                          <Sparkles size={14} /> Adquirido
                        </span>
                        <Link href={`/course/${course.id}`} className="db-btn">
                          <Play size={14} /> Ir al Curso
                        </Link>
                      </>
                    ) : (
                      <>
                        <span style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 800, background: "linear-gradient(135deg,#6366f1,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                          ${course.price}
                        </span>
                        <button className="db-btn">
                          <ShoppingCart size={14} /> Comprar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bundles */}
      <section>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.2rem", color: "#f0f0f5", margin: "0 0 16px" }}>Bundles de Libros</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
          {bundles.map((b) => {
            const owned = purchasedIds.has(b.id);
            const save = Math.round(((b.originalPrice - b.price) / b.originalPrice) * 100);
            return (
              <div key={b.id} className="db-card" style={owned ? { borderColor: "rgba(16,185,129,0.25)" } : {}}>
                {/* top gradient bar */}
                <div style={{ height: 3, background: b.color }} />
                {/* floating orb */}
                <div className="db-orb" style={{ width: 90, height: 90, top: -25, right: -15, background: `${b.color}12`, animation: "db-float-alt 9s ease-in-out infinite" }} />
                <div style={{ padding: 24, position: "relative", zIndex: 1 }}>
                  {b.badge && (
                    <span style={{ display: "inline-block", padding: "4px 12px", borderRadius: 20, fontSize: 10, fontWeight: 700, letterSpacing: 1, background: `${b.color}18`, color: b.color, marginBottom: 14, textTransform: "uppercase", border: `1px solid ${b.color}30` }}>
                      {b.badge}
                    </span>
                  )}
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", color: "#f0f0f5", margin: "0 0 16px" }}>{b.name}</h3>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: "1.7rem", fontWeight: 800, color: "#f0f0f5" }}>${b.price}</span>
                    <span style={{ fontSize: 12, color: "#6b6b80", textDecoration: "line-through" }}>${b.originalPrice.toFixed(2)}</span>
                  </div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: b.color, margin: "0 0 18px" }}>
                    Ahorras {save}% · {b.bookIds.length} libros
                  </p>
                  {owned ? (
                    <div className="db-owned-badge" style={{ width: "100%" }}>
                      <Sparkles size={14} /> Ya adquirido
                    </div>
                  ) : (
                    <button className="db-btn-color" style={{ background: `linear-gradient(135deg, ${b.color}, ${b.color}bb)`, boxShadow: `0 4px 20px ${b.color}25` }}>
                      <ShoppingCart size={14} /> Comprar Bundle
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   SHARED COMPONENTS
   ══════════════════════════════════════════════════════════════ */
function SectionHeader({ title, action, onAction }: { title: string; action: string; onAction: () => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
      <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.2rem", color: "#f0f0f5", margin: 0 }}>{title}</h2>
      <button
        onClick={onAction}
        style={{ background: "none", border: "none", color: "#6366f1", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: "0.85rem", fontWeight: 600, transition: "gap 0.2s" }}
      >
        {action} <ChevronRight size={14} />
      </button>
    </div>
  );
}

function StatCard({ icon: Icon, value, label, color }: { icon: typeof Home; value: string | number; label: string; color: string }) {
  return (
    <div className="db-card db-stat" style={{ padding: 24 }}>
      {/* subtle orb */}
      <div className="db-orb" style={{ width: 80, height: 80, top: -20, right: -10, background: `${color}10`, animation: "db-float 8s ease-in-out infinite" }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
          <Icon size={20} style={{ color }} />
        </div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "1.85rem", fontWeight: 800, color: "#f0f0f5", lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: "0.8rem", color: "#6b6b80", marginTop: 6 }}>{label}</div>
      </div>
    </div>
  );
}

function CourseCard({ course, watched, showMeta }: { course: (typeof courses)[number]; watched: number; showMeta?: boolean }) {
  const pct = Math.round((watched / course.totalVideos) * 100);
  const done = pct === 100;
  return (
    <div className="db-card" style={done ? { borderColor: "rgba(16,185,129,0.25)" } : {}}>
      {/* top gradient bar */}
      <div style={{ height: 3, background: done ? "linear-gradient(90deg,#10b981,#06b6d4)" : "linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)" }} />
      {/* decorative orb */}
      <div className="db-orb" style={{ width: 100, height: 100, top: -25, right: -15, background: done ? "rgba(16,185,129,0.06)" : "rgba(99,102,241,0.06)", animation: "db-float 7s ease-in-out infinite" }} />

      <div style={{ padding: 24, position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: "rgba(99,102,241,0.12)", color: "#6366f1" }}>
            {course.level}
          </span>
          {done && (
            <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: "rgba(16,185,129,0.12)", color: "#10b981" }}>
              ✓ Completado
            </span>
          )}
        </div>
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.15rem", color: "#f0f0f5", margin: "0 0 4px" }}>{course.title}</h3>
        {showMeta && <p style={{ fontSize: "0.85rem", color: "#a0a0b8", margin: "0 0 16px", lineHeight: 1.6 }}>{course.subtitle}</p>}

        {/* progress */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: "#6b6b80" }}>{watched} de {course.totalVideos} videos</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: done ? "#10b981" : "#6366f1" }}>{pct}%</span>
          </div>
          <div className="db-progress-track">
            <div
              className="db-progress-fill"
              style={{ width: `${pct}%`, background: done ? "linear-gradient(90deg,#10b981,#06b6d4)" : "linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)" }}
            />
          </div>
        </div>

        {showMeta && (
          <div style={{ display: "flex", gap: 16, marginBottom: 18, fontSize: 12, color: "#6b6b80" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Play size={12} /> {course.totalVideos} videos</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} /> {course.totalHours}h</span>
          </div>
        )}

        <Link href={`/course/${course.id}`} className="db-btn db-btn-full">
          <Play size={16} /> {pct > 0 ? "Continuar" : "Empezar"} Curso <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

function BookCard({ book, color }: { book: (typeof books)[number]; color: string }) {
  return (
    <div className="db-card">
      <div style={{ height: 3, background: color }} />
      <div className="db-orb" style={{ width: 70, height: 70, top: -15, right: -10, background: `${color}10`, animation: "db-float-alt 7s ease-in-out infinite" }} />
      <div style={{ padding: 22, position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: `${color}18`, color, border: `1px solid ${color}30` }}>
            Nivel {book.level}
          </span>
          <span style={{ fontSize: 12, color: "#6b6b80" }}>{book.pages} págs · {book.year}</span>
        </div>
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", color: "#f0f0f5", margin: "0 0 4px" }}>{book.title}</h3>
        <p style={{ fontSize: "0.85rem", color: "#a0a0b8", margin: "0 0 18px", lineHeight: 1.5 }}>{book.subtitle}</p>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="db-btn-outline" style={{ flex: 1 }}>
            <Download size={13} /> PDF
          </button>
          <button className="db-btn-outline" style={{ flex: 1 }}>
            <Download size={13} /> EPUB
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyCTA({ onAction }: { onAction: () => void }) {
  return (
    <div
      className="db-card"
      style={{
        padding: "64px 32px",
        textAlign: "center",
        background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.04))",
        border: "1px solid rgba(99,102,241,0.15)",
        borderRadius: 20,
      }}
    >
      <div className="db-orb" style={{ width: 180, height: 180, top: -60, left: "20%", background: "rgba(99,102,241,0.06)", animation: "db-float 10s ease-in-out infinite" }} />
      <div className="db-orb" style={{ width: 120, height: 120, bottom: -40, right: "15%", background: "rgba(139,92,246,0.05)", animation: "db-float-alt 8s ease-in-out infinite" }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ width: 76, height: 76, borderRadius: 22, background: "rgba(99,102,241,0.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 22px", boxShadow: "0 0 40px rgba(99,102,241,0.15)" }}>
          <Zap size={34} color="#6366f1" />
        </div>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, color: "#f0f0f5", marginBottom: 8 }}>
          ¡Empieza tu viaje!
        </h3>
        <p style={{ color: "#a0a0b8", fontSize: "0.95rem", maxWidth: 460, margin: "0 auto 28px", lineHeight: 1.7 }}>
          Aún no tienes cursos ni libros. Explora nuestro catálogo y domina la inteligencia artificial.
        </p>
        <button onClick={onAction} className="db-btn db-btn-lg">
          <Compass size={18} /> Explorar Catálogo <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, desc, btn, onAction }: { icon: typeof Home; title: string; desc: string; btn: string; onAction: () => void }) {
  return (
    <div
      className="db-card"
      style={{ padding: "60px 32px", textAlign: "center", background: "linear-gradient(135deg, rgba(99,102,241,0.05), rgba(139,92,246,0.03))", border: "1px solid rgba(99,102,241,0.12)", borderRadius: 20 }}
    >
      <div className="db-orb" style={{ width: 140, height: 140, top: -40, right: "25%", background: "rgba(99,102,241,0.05)", animation: "db-float 8s ease-in-out infinite" }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ width: 68, height: 68, borderRadius: 20, background: "rgba(99,102,241,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", boxShadow: "0 0 30px rgba(99,102,241,0.1)" }}>
          <Icon size={30} color="#6366f1" />
        </div>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 700, color: "#f0f0f5", marginBottom: 8 }}>{title}</h3>
        <p style={{ color: "#a0a0b8", fontSize: "0.9rem", maxWidth: 380, margin: "0 auto 24px", lineHeight: 1.6 }}>{desc}</p>
        <button onClick={onAction} className="db-btn db-btn-lg">{btn} <ArrowRight size={16} /></button>
      </div>
    </div>
  );
}

function QAction({ icon: Icon, label, color, onClick }: { icon: typeof Home; label: string; color: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="db-qaction" style={{ border: "none" }}>
      {/* top gradient line (reveals on hover via CSS) */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${color}, transparent)`, opacity: 0, transition: "opacity 0.3s" }} className="db-qaction-line" />
      {/* orb */}
      <div className="db-orb" style={{ width: 60, height: 60, top: -15, right: -10, background: `${color}08`, animation: "db-float 8s ease-in-out infinite" }} />
      <div className="db-qaction-icon" style={{ width: 48, height: 48, borderRadius: 14, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}>
        <Icon size={22} style={{ color }} />
      </div>
      <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#a0a0b8", position: "relative", zIndex: 1 }}>{label}</span>
    </button>
  );
}
