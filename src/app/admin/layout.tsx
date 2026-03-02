import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  FileText,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";

const adminCSS = `
@keyframes admin-fade-in {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes admin-float {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-10px) scale(1.03); }
}
@keyframes admin-shimmer {
  0% { left: -100%; }
  100% { left: 200%; }
}
@keyframes admin-glow-pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(249,115,22,0.1); }
  50% { box-shadow: 0 0 40px rgba(249,115,22,0.2); }
}
@keyframes admin-pop {
  0% { transform: scale(0.85); opacity: 0; }
  60% { transform: scale(1.04); }
  100% { transform: scale(1); opacity: 1; }
}

/* ── Shell ── */
.admin-shell {
  min-height: 100vh;
  background: #050510;
  position: relative;
}
.admin-bg-orb {
  position: fixed;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
}

/* ── Header ── */
.admin-header {
  position: sticky; top: 0; z-index: 50;
  background: rgba(5,5,16,0.88);
  backdrop-filter: blur(24px);
  border-bottom: 1px solid rgba(255,255,255,0.06);
  animation: admin-fade-in 0.4s ease;
}

/* ── Nav links ── */
.admin-nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 0.82rem;
  font-weight: 600;
  color: #a0a0b8;
  text-decoration: none;
  transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
  position: relative;
}
.admin-nav-link:hover {
  background: rgba(249,115,22,0.08);
  color: #d0d0e0;
}

/* ── Back link ── */
.admin-back {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #6b6b80;
  text-decoration: none;
  border: 1px solid rgba(255,255,255,0.06);
  transition: all 0.25s;
}
.admin-back:hover {
  color: #a0a0b8;
  border-color: rgba(99,102,241,0.2);
  background: rgba(99,102,241,0.05);
}

/* ── Card ── */
.a-card {
  background: rgba(15,15,35,0.6);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4,0,0.2,1);
}
.a-card::before {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(249,115,22,0.4), transparent);
  opacity: 0;
  transition: opacity 0.4s;
}
.a-card::after {
  content: "";
  position: absolute;
  top: 0; left: -100%;
  width: 60%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.015), transparent);
  pointer-events: none;
}
.a-card:hover {
  background: rgba(25,25,55,0.8);
  border-color: rgba(249,115,22,0.2);
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(249,115,22,0.06), 0 0 0 1px rgba(249,115,22,0.08);
}
.a-card:hover::before { opacity: 1; }
.a-card:hover::after { animation: admin-shimmer 0.8s ease forwards; }

/* ── Stat card ── */
.a-stat {
  animation: admin-pop 0.4s ease both;
}
.a-stat:nth-child(2) { animation-delay: 0.06s; }
.a-stat:nth-child(3) { animation-delay: 0.12s; }
.a-stat:nth-child(4) { animation-delay: 0.18s; }

/* ── Orb in card ── */
.a-orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(35px);
}

/* ── Table ── */
.a-table {
  width: 100%;
  font-size: 0.85rem;
  border-collapse: collapse;
}
.a-table thead tr {
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.a-table th {
  text-align: left;
  padding: 0 16px 14px 0;
  color: #6b6b80;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.a-table tbody tr {
  border-bottom: 1px solid rgba(255,255,255,0.04);
  transition: background 0.2s;
}
.a-table tbody tr:hover {
  background: rgba(99,102,241,0.03);
}
.a-table td {
  padding: 14px 16px 14px 0;
  color: #d0d0e0;
}

/* ── Badge ── */
.a-badge {
  display: inline-flex;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

/* ── Buttons ── */
.a-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 9px 20px;
  border-radius: 10px;
  border: none;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  color: #fff;
  background: linear-gradient(135deg, #f97316, #ef4444);
  box-shadow: 0 4px 20px rgba(249,115,22,0.2);
  transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
  position: relative;
  overflow: hidden;
  text-decoration: none;
}
.a-btn::before {
  content: "";
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent 50%);
  opacity: 0;
  transition: opacity 0.3s;
}
.a-btn:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 30px rgba(249,115,22,0.35);
}
.a-btn:hover::before { opacity: 1; }
.a-btn:active { transform: translateY(0) scale(0.98); }

.a-btn-outline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.03);
  color: #d0d0e0;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s;
  text-decoration: none;
}
.a-btn-outline:hover {
  border-color: rgba(249,115,22,0.3);
  background: rgba(249,115,22,0.06);
  color: #f97316;
  transform: translateY(-2px);
}

.a-btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px; height: 34px;
  border-radius: 9px;
  border: none;
  background: transparent;
  color: #6b6b80;
  cursor: pointer;
  transition: all 0.25s;
}
.a-btn-icon:hover {
  background: rgba(99,102,241,0.1);
  color: #6366f1;
}
.a-btn-icon.danger:hover {
  background: rgba(239,68,68,0.1);
  color: #ef4444;
}

/* ── Input ── */
.a-input {
  padding: 9px 14px 9px 36px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.03);
  color: #f0f0f5;
  font-size: 0.82rem;
  transition: all 0.25s;
  outline: none;
}
.a-input::placeholder { color: #6b6b80; }
.a-input:focus {
  border-color: rgba(249,115,22,0.4);
  background: rgba(249,115,22,0.04);
  box-shadow: 0 0 20px rgba(249,115,22,0.08);
}

/* ── Content area ── */
.admin-content {
  position: relative;
  z-index: 1;
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 24px 64px;
  animation: admin-fade-in 0.5s ease 0.1s both;
}

/* ── Section header ── */
.a-section-title {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 1.65rem;
  color: #f0f0f5;
  margin: 0;
  background: linear-gradient(135deg, #f0f0f5 60%, #f97316);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* responsive hide */
@media (max-width: 768px) {
  .a-hide-mobile { display: none !important; }
  .admin-nav-inline { gap: 2px !important; }
}

/* ── Tabs ── */
.a-tabs {
  display: flex;
  gap: 2px;
  padding: 3px;
  border-radius: 12px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  width: fit-content;
}
.a-tab {
  padding: 8px 18px;
  border-radius: 10px;
  border: none;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  color: #6b6b80;
  background: transparent;
  transition: all 0.25s;
}
.a-tab:hover {
  color: #d0d0e0;
  background: rgba(255,255,255,0.04);
}
.a-tab.active {
  background: linear-gradient(135deg, #f97316, #ef4444);
  color: #fff;
  box-shadow: 0 4px 16px rgba(249,115,22,0.25);
}

/* ── Modal ── */
.a-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 999;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(8px);
  animation: admin-fade-in 0.2s ease;
  padding: 80px 16px 24px;
}
.a-modal {
  background: rgba(15,15,35,0.97);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px;
  padding: 28px 32px;
  max-width: 560px;
  width: 92%;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  margin: 0 auto;
  position: relative;
  box-shadow: 0 40px 100px rgba(0,0,0,0.5);
}
.a-modal::-webkit-scrollbar { width: 6px; }
.a-modal::-webkit-scrollbar-track { background: transparent; }
.a-modal::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }

/* ── Form ── */
.a-form-group { margin-bottom: 16px; }
.a-form-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b6b80;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}
.a-form-input {
  width: 100%;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.03);
  color: #f0f0f5;
  font-size: 0.85rem;
  font-family: inherit;
  outline: none;
  transition: all 0.25s;
  box-sizing: border-box;
}
.a-form-input:focus {
  border-color: rgba(249,115,22,0.4);
  background: rgba(249,115,22,0.04);
  box-shadow: 0 0 20px rgba(249,115,22,0.08);
}
.a-form-input::placeholder { color: #4a4a5a; }
textarea.a-form-input { resize: vertical; min-height: 80px; }

/* ── User row card ── */
.a-user-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-radius: 14px;
  background: rgba(15,15,35,0.5);
  border: 1px solid rgba(255,255,255,0.04);
  transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
  position: relative;
  overflow: hidden;
}
.a-user-row::before {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(249,115,22,0.3), transparent);
  opacity: 0;
  transition: opacity 0.3s;
}
.a-user-row:hover {
  background: rgba(25,25,55,0.7);
  border-color: rgba(249,115,22,0.15);
  transform: translateX(4px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
}
.a-user-row:hover::before { opacity: 1; }

/* ── Review card ── */
.a-review-card {
  background: rgba(15,15,35,0.5);
  border: 1px solid rgba(255,255,255,0.04);
  border-radius: 16px;
  padding: 22px 26px;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4,0,0.2,1);
}
.a-review-card::before {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(234,179,8,0.4), transparent);
  opacity: 0;
  transition: opacity 0.4s;
}
.a-review-card::after {
  content: "";
  position: absolute;
  top: 0; left: -100%;
  width: 50%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.01), transparent);
  pointer-events: none;
}
.a-review-card:hover {
  background: rgba(25,25,55,0.6);
  border-color: rgba(234,179,8,0.15);
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.15);
}
.a-review-card:hover::before { opacity: 1; }
.a-review-card:hover::after { animation: admin-shimmer 0.8s ease forwards; }

/* ── Action chip ── */
.a-action {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 5px 10px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.06);
  background: rgba(255,255,255,0.02);
  color: #6b6b80;
  font-size: 0.72rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s;
  white-space: nowrap;
}
.a-action:hover { background: rgba(99,102,241,0.1); color: #6366f1; border-color: rgba(99,102,241,0.2); }
.a-action.warn:hover { background: rgba(234,179,8,0.1); color: #eab308; border-color: rgba(234,179,8,0.2); }
.a-action.danger:hover { background: rgba(239,68,68,0.1); color: #ef4444; border-color: rgba(239,68,68,0.2); }
.a-action.success:hover { background: rgba(16,185,129,0.1); color: #10b981; border-color: rgba(16,185,129,0.2); }

/* ── Content item card ── */
.a-content-item {
  background: rgba(15,15,35,0.5);
  border: 1px solid rgba(255,255,255,0.04);
  border-radius: 16px;
  padding: 22px;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4,0,0.2,1);
}
.a-content-item::after {
  content: "";
  position: absolute;
  top: 0; left: -100%;
  width: 50%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.015), transparent);
  pointer-events: none;
}
.a-content-item:hover {
  background: rgba(25,25,55,0.6);
  border-color: rgba(99,102,241,0.15);
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.15);
}
.a-content-item:hover::after { animation: admin-shimmer 0.8s ease forwards; }

/* ── Accordion ── */
.a-accordion-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-radius: 12px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.04);
  cursor: pointer;
  transition: all 0.25s;
}
.a-accordion-header:hover {
  background: rgba(255,255,255,0.04);
  border-color: rgba(255,255,255,0.08);
}

@keyframes spin { to { transform: rotate(360deg); } }
`;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/users", label: "Usuarios", icon: Users },
    { href: "/admin/reviews", label: "Reviews", icon: MessageSquare },
    { href: "/admin/purchases", label: "Compras", icon: ShoppingCart },
    { href: "/admin/content", label: "Contenido", icon: FileText },
  ];

  return (
    <div className="admin-shell">
      <style dangerouslySetInnerHTML={{ __html: adminCSS }} />

      {/* Background orbs */}
      <div className="admin-bg-orb" style={{ top: "-15%", left: "8%", width: 600, height: 600, background: "radial-gradient(circle, rgba(249,115,22,0.04) 0%, transparent 70%)" }} />
      <div className="admin-bg-orb" style={{ bottom: "-10%", right: "5%", width: 400, height: 400, background: "radial-gradient(circle, rgba(99,102,241,0.03) 0%, transparent 70%)" }} />

      {/* ── Header ── */}
      <header className="admin-header">
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Left */}
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <Link href="/admin" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
              <img src="/images/logo.png" alt="IA Vanguard" style={{ width: 32, height: 32, borderRadius: 9 }} />
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", color: "#f0f0f5" }}>
                IA Vanguard
              </span>
            </Link>
            <nav className="admin-nav-inline" style={{ display: "flex", gap: 4 }}>
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="admin-nav-link">
                  <item.icon size={15} />
                  <span className="a-hide-mobile">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Right */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 10, fontWeight: 700, letterSpacing: 1, background: "rgba(249,115,22,0.12)", color: "#f97316", border: "1px solid rgba(249,115,22,0.25)" }}>
              ADMIN
            </span>
            <Link href="/dashboard" className="admin-back">
              <ArrowLeft size={14} />
              <span className="a-hide-mobile">Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Content ── */}
      <main className="admin-content">{children}</main>
    </div>
  );
}
