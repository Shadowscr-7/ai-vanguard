"use client";

import { useState, useEffect } from "react";
import {
  BookOpen,
  GraduationCap,
  Package,
  Video,
  Clock,
  DollarSign,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Loader2,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Layers,
  FileText,
  Link,
  Download,
  Hash,
  Star,
  Target,
  FolderOpen,
  Paperclip,
} from "lucide-react";

/* ─── Types ─── */
interface BookData {
  id: number; level: number; title: string; subtitle: string;
  pages: number; year: number; description: string; downloadUrl?: string;
}
interface BundleData {
  id: string; name: string; level: number; bookIds: number[];
  price: number; originalPrice: number; color: string; badge?: string;
}
interface VideoMaterial { name: string; size: string; }
interface VideoData {
  id: string; title: string; duration: string;
  description: string; materials: VideoMaterial[];
}
interface ModuleData { id: string; title: string; videos: VideoData[]; }
interface CourseData {
  id: string; title: string; subtitle: string; level: string;
  price: number; duration: string; totalVideos: number; totalHours: number;
  description: string; highlights: string[]; modules: ModuleData[];
  generalMaterials: VideoMaterial[];
}

/* ─── Helpers ─── */
const genId = () => Math.random().toString(36).slice(2, 9);

/* ════════════════════════════════════════ */
export default function AdminContentPage() {
  const [tab, setTab] = useState<"books" | "bundles" | "courses">("books");
  const [books, setBooks] = useState<BookData[]>([]);
  const [bundles, setBundles] = useState<BundleData[]>([]);
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  /* ── Modals ── */
  const [bookModal, setBookModal] = useState<BookData | null>(null);
  const [bundleModal, setBundleModal] = useState<BundleData | null>(null);
  const [editingCourse, setEditingCourse] = useState<CourseData | null>(null);
  const [courseModal, setCourseModal] = useState<CourseData | null>(null);

  const flash = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  /* ── Fetch ── */
  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => r.json())
      .then((data) => {
        setBooks((data.books as BookData[]) || []);
        setBundles((data.bundles as BundleData[]) || []);
        setCourses((data.courses as CourseData[]) || []);
        setLoading(false);
      });
  }, []);

  /* ── Save helper ── */
  const saveKey = async (key: string, data: unknown[]) => {
    setSaving(true);
    await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, data }),
    });
    setSaving(false);
    flash("✓ Guardado correctamente");
  };

  /* ── Quick stats ── */
  const totalVideos = courses.reduce((s, c) => s + c.totalVideos, 0);
  const totalHours = courses.reduce((s, c) => s + c.totalHours, 0);

  const tabs = [
    { key: "books" as const, label: "Libros", icon: BookOpen, count: books.length },
    { key: "bundles" as const, label: "Bundles", icon: Package, count: bundles.length },
    { key: "courses" as const, label: "Cursos", icon: GraduationCap, count: courses.length },
  ];

  /* ════════════════ BOOK CRUD ════════════════ */
  const saveBook = (b: BookData) => {
    const next = books.some((x) => x.id === b.id)
      ? books.map((x) => (x.id === b.id ? b : x))
      : [...books, b];
    setBooks(next);
    saveKey("books", next);
    setBookModal(null);
  };
  const deleteBook = (id: number) => {
    if (!confirm("¿Eliminar este libro?")) return;
    const next = books.filter((b) => b.id !== id);
    setBooks(next);
    saveKey("books", next);
  };

  /* ════════════════ BUNDLE CRUD ════════════════ */
  const saveBundle = (b: BundleData) => {
    const next = bundles.some((x) => x.id === b.id)
      ? bundles.map((x) => (x.id === b.id ? b : x))
      : [...bundles, b];
    setBundles(next);
    saveKey("bundles", next);
    setBundleModal(null);
  };
  const deleteBundle = (id: string) => {
    if (!confirm("¿Eliminar este bundle?")) return;
    const next = bundles.filter((b) => b.id !== id);
    setBundles(next);
    saveKey("bundles", next);
  };

  /* ════════════════ COURSE CRUD ════════════════ */
  const saveCourseMetadata = (c: CourseData) => {
    const next = courses.some((x) => x.id === c.id)
      ? courses.map((x) => (x.id === c.id ? c : x))
      : [...courses, c];
    setCourses(next);
    saveKey("courses", next);
    setCourseModal(null);
  };
  const saveCourseFromEditor = (c: CourseData) => {
    const next = courses.map((x) => (x.id === c.id ? c : x));
    setCourses(next);
    saveKey("courses", next);
    setEditingCourse(null);
  };
  const deleteCourse = (id: string) => {
    if (!confirm("¿Eliminar este curso y todos sus módulos/videos?")) return;
    const next = courses.filter((c) => c.id !== id);
    setCourses(next);
    saveKey("courses", next);
  };

  /* ════════════════ RENDER ════════════════ */
  if (loading) {
    return (
      <div style={{ display: "flex", minHeight: "60vh", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
        <Loader2 size={32} color="#f97316" style={{ animation: "spin 1s linear infinite" }} />
        <span style={{ color: "#6b6b80", fontSize: "0.85rem" }}>Cargando contenido…</span>
      </div>
    );
  }

  /* ── Course Editor (full-screen) ── */
  if (editingCourse) {
    return (
      <CourseEditor
        course={editingCourse}
        onSave={saveCourseFromEditor}
        onCancel={() => setEditingCourse(null)}
        saving={saving}
      />
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 1000,
          padding: "12px 24px", borderRadius: 12,
          background: "linear-gradient(135deg, #10b981, #059669)",
          color: "#fff", fontWeight: 700, fontSize: "0.85rem",
          boxShadow: "0 8px 32px rgba(16,185,129,0.3)",
          animation: "admin-pop 0.3s ease",
        }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 className="a-section-title">Gestión de Contenido</h1>
          <p style={{ color: "#6b6b80", fontSize: "0.88rem", marginTop: 6 }}>
            Administra libros, bundles y cursos de la plataforma
          </p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {[
          { icon: BookOpen, value: books.length, label: "Libros", color: "#f97316" },
          { icon: Package, value: bundles.length, label: "Bundles", color: "#a855f7" },
          { icon: GraduationCap, value: courses.length, label: "Cursos", color: "#6366f1" },
          { icon: Video, value: totalVideos, label: "Videos", color: "#06b6d4" },
          { icon: Clock, value: `${totalHours}h`, label: "Horas", color: "#10b981" },
        ].map((s, i) => (
          <div key={i} className="a-card a-stat" style={{ padding: "12px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: `${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
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

      {/* Tabs */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div className="a-tabs">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`a-tab ${tab === t.key ? "active" : ""}`}
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <t.icon size={14} />
              {t.label}
              <span style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                minWidth: 20, height: 18, borderRadius: 9, fontSize: "0.65rem", fontWeight: 700,
                background: tab === t.key ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.06)",
                color: tab === t.key ? "#fff" : "#6b6b80",
              }}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        <button
          className="a-btn"
          style={{ padding: "9px 18px" }}
          onClick={() => {
            if (tab === "books") setBookModal({ id: Math.max(0, ...books.map((b) => b.id)) + 1, level: 1, title: "", subtitle: "", pages: 200, year: new Date().getFullYear(), description: "" });
            if (tab === "bundles") setBundleModal({ id: genId(), name: "", level: 1, bookIds: [], price: 0, originalPrice: 0, color: "#6366f1" });
            if (tab === "courses") setCourseModal({ id: genId(), title: "", subtitle: "", level: "Básico", price: 29.99, duration: "8 semanas", totalVideos: 10, totalHours: 5, description: "", highlights: ["Acceso de por vida", "Ejercicios prácticos", "Certificado de finalización"], modules: [], generalMaterials: [] });
          }}
        >
          <Plus size={15} /> Agregar {tab === "books" ? "Libro" : tab === "bundles" ? "Bundle" : "Curso"}
        </button>
      </div>

      {/* ════════════════ BOOKS TAB ════════════════ */}
      {tab === "books" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 14 }}>
          {books.map((b, idx) => (
            <div key={b.id} className="a-content-item" style={{ animation: `admin-fade-in 0.3s ease ${idx * 0.04}s both` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      width: 32, height: 32, borderRadius: 8,
                      background: b.level === 1 ? "rgba(0,212,255,0.1)" : b.level === 2 ? "rgba(168,85,247,0.1)" : "rgba(249,115,22,0.1)",
                      fontSize: "0.75rem", fontWeight: 800,
                      color: b.level === 1 ? "#00d4ff" : b.level === 2 ? "#a855f7" : "#f97316",
                    }}>
                      N{b.level}
                    </span>
                    <div>
                      <h3 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "#f0f0f5" }}>
                        {b.title}
                      </h3>
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "#6b6b80" }}>{b.subtitle}</p>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  <button onClick={() => setBookModal({ ...b })} className="a-action" title="Editar">
                    <Edit3 size={12} /> Editar
                  </button>
                  <button onClick={() => deleteBook(b.id)} className="a-action danger" title="Eliminar">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
              <p style={{ margin: "0 0 12px", fontSize: "0.8rem", color: "#a0a0b8", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {b.description}
              </p>
              <div style={{ display: "flex", gap: 12, fontSize: "0.72rem", color: "#4a4a5a", alignItems: "center" }}>
                <span><strong style={{ color: "#6b6b80" }}>{b.pages}</strong> páginas</span>
                <span>·</span>
                <span><strong style={{ color: "#6b6b80" }}>{b.year}</strong></span>
                <span>·</span>
                <span>ID: <strong style={{ color: "#f97316" }}>#{b.id}</strong></span>
                {b.downloadUrl && (
                  <>
                    <span>·</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#10b981", fontWeight: 600 }}>
                      <Download size={11} /> Descarga
                    </span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ════════════════ BUNDLES TAB ════════════════ */}
      {tab === "bundles" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 14 }}>
          {bundles.map((b, idx) => {
            const savings = b.originalPrice > 0 ? ((1 - b.price / b.originalPrice) * 100).toFixed(0) : "0";
            return (
              <div key={b.id} className="a-content-item" style={{ animation: `admin-fade-in 0.3s ease ${idx * 0.04}s both` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: b.color, boxShadow: `0 0 8px ${b.color}40` }} />
                      <h3 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "#f0f0f5" }}>{b.name}</h3>
                    </div>
                    {b.badge && (
                      <span className="a-badge" style={{ background: "rgba(234,179,8,0.12)", color: "#eab308", border: "1px solid rgba(234,179,8,0.25)" }}>
                        ✨ {b.badge}
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button onClick={() => setBundleModal({ ...b })} className="a-action" title="Editar">
                      <Edit3 size={12} /> Editar
                    </button>
                    <button onClick={() => deleteBundle(b.id)} className="a-action danger" title="Eliminar">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: "1.5rem", fontWeight: 800, color: b.color }}>${b.price}</span>
                  <span style={{ fontSize: "0.82rem", color: "#4a4a5a", textDecoration: "line-through" }}>${b.originalPrice}</span>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#10b981" }}>-{savings}%</span>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.72rem", color: "#6b6b80" }}>
                    <BookOpen size={12} style={{ verticalAlign: "middle", marginRight: 4 }} />
                    {b.bookIds.length} libros: [{b.bookIds.join(", ")}]
                  </span>
                  <span style={{ fontSize: "0.72rem", color: "#4a4a5a" }}>· Nivel {b.level || "Todos"}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ════════════════ COURSES TAB ════════════════ */}
      {tab === "courses" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {courses.map((c, idx) => (
            <div key={c.id} className="a-content-item" style={{ animation: `admin-fade-in 0.3s ease ${idx * 0.05}s both` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(99,102,241,0.05))",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      border: "1px solid rgba(99,102,241,0.15)",
                    }}>
                      <GraduationCap size={20} color="#6366f1" />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "#f0f0f5" }}>{c.title}</h3>
                      <p style={{ margin: "2px 0 0", fontSize: "0.78rem", color: "#6b6b80" }}>{c.subtitle}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 12 }}>
                    {[
                      { icon: DollarSign, val: `$${c.price}`, color: "#10b981" },
                      { icon: Layers, val: `${c.modules.length} módulos`, color: "#a855f7" },
                      { icon: Video, val: `${c.totalVideos} videos`, color: "#06b6d4" },
                      { icon: Clock, val: `${c.totalHours}h`, color: "#eab308" },
                    ].map((m, j) => (
                      <div key={j} style={{
                        display: "flex", alignItems: "center", gap: 6, fontSize: "0.78rem",
                        padding: "4px 10px", borderRadius: 8,
                        background: `${m.color}08`, border: `1px solid ${m.color}15`,
                      }}>
                        <m.icon size={13} color={m.color} />
                        <span style={{ fontWeight: 600, color: "#d0d0e0" }}>{m.val}</span>
                      </div>
                    ))}
                    <span className="a-badge" style={{
                      background: c.level === "Básico" ? "rgba(0,212,255,0.12)" : "rgba(249,115,22,0.12)",
                      color: c.level === "Básico" ? "#00d4ff" : "#f97316",
                      border: `1px solid ${c.level === "Básico" ? "rgba(0,212,255,0.25)" : "rgba(249,115,22,0.25)"}`,
                    }}>
                      {c.level}
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                  <button onClick={() => setEditingCourse({ ...c, modules: c.modules.map(m => ({ ...m, videos: m.videos.map(v => ({ ...v, materials: [...v.materials] })) })) })} className="a-action" title="Editar contenido completo">
                    <Edit3 size={12} /> Editor
                  </button>
                  <button onClick={() => setCourseModal({ ...c })} className="a-action" title="Editar datos básicos">
                    <FileText size={12} /> Info
                  </button>
                  <button onClick={() => deleteCourse(c.id)} className="a-action danger" title="Eliminar">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ════════════════ BOOK MODAL ════════════════ */}
      {bookModal && (
        <div className="a-modal-overlay" onClick={() => setBookModal(null)}>
          <div className="a-modal" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ margin: "0 0 20px", fontSize: "1.15rem", fontWeight: 700, color: "#f0f0f5", display: "flex", alignItems: "center", gap: 8 }}>
              <BookOpen size={18} color="#f97316" />
              {books.some((b) => b.id === bookModal.id) ? "Editar Libro" : "Nuevo Libro"}
            </h2>
            <BookForm
              book={bookModal}
              onChange={setBookModal}
              onSave={() => saveBook(bookModal)}
              onCancel={() => setBookModal(null)}
              saving={saving}
            />
          </div>
        </div>
      )}

      {/* ════════════════ BUNDLE MODAL ════════════════ */}
      {bundleModal && (
        <div className="a-modal-overlay" onClick={() => setBundleModal(null)}>
          <div className="a-modal" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ margin: "0 0 20px", fontSize: "1.15rem", fontWeight: 700, color: "#f0f0f5", display: "flex", alignItems: "center", gap: 8 }}>
              <Package size={18} color="#a855f7" />
              {bundles.some((b) => b.id === bundleModal.id) ? "Editar Bundle" : "Nuevo Bundle"}
            </h2>
            <BundleForm
              bundle={bundleModal}
              onChange={setBundleModal}
              onSave={() => saveBundle(bundleModal)}
              onCancel={() => setBundleModal(null)}
              books={books}
              saving={saving}
            />
          </div>
        </div>
      )}

      {/* ════════════════ COURSE METADATA MODAL ════════════════ */}
      {courseModal && (
        <div className="a-modal-overlay" onClick={() => setCourseModal(null)}>
          <div className="a-modal" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ margin: "0 0 20px", fontSize: "1.15rem", fontWeight: 700, color: "#f0f0f5", display: "flex", alignItems: "center", gap: 8 }}>
              <GraduationCap size={18} color="#6366f1" />
              {courses.some((c) => c.id === courseModal.id) ? "Editar Curso" : "Nuevo Curso"}
            </h2>
            <CourseMetaForm
              course={courseModal}
              onChange={setCourseModal}
              onSave={() => saveCourseMetadata(courseModal)}
              onCancel={() => setCourseModal(null)}
              saving={saving}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   BOOK FORM
   ══════════════════════════════════════════════════════ */
function BookForm({ book, onChange, onSave, onCancel, saving }: {
  book: BookData;
  onChange: (b: BookData) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const set = (k: keyof BookData, v: string | number | undefined) => onChange({ ...book, [k]: v });
  const sectionStyle = { padding: "16px", borderRadius: 14, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", marginBottom: 16 };
  const sectionHeader = (icon: React.ReactNode, text: string) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      {icon}
      <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#d0d0e0", textTransform: "uppercase", letterSpacing: "0.5px" }}>{text}</span>
    </div>
  );

  return (
    <div>
      {/* ── Info básica ── */}
      <div style={sectionStyle}>
        {sectionHeader(<BookOpen size={14} color="#f97316" />, "Información Básica")}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div className="a-form-group" style={{ gridColumn: "1 / -1" }}>
            <label className="a-form-label">Título</label>
            <input className="a-form-input" value={book.title} onChange={(e) => set("title", e.target.value)} placeholder="Nombre del libro" />
          </div>
          <div className="a-form-group" style={{ gridColumn: "1 / -1" }}>
            <label className="a-form-label">Subtítulo</label>
            <input className="a-form-input" value={book.subtitle} onChange={(e) => set("subtitle", e.target.value)} placeholder="Subtítulo descriptivo" />
          </div>
          <div className="a-form-group">
            <label className="a-form-label">Descripción</label>
            <textarea className="a-form-input" value={book.description} onChange={(e) => set("description", e.target.value)} rows={3} placeholder="Descripción del libro" style={{ gridColumn: "1 / -1" }} />
          </div>
        </div>
      </div>

      {/* ── Detalles ── */}
      <div style={sectionStyle}>
        {sectionHeader(<Hash size={14} color="#a855f7" />, "Detalles")}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <div className="a-form-group">
            <label className="a-form-label">Nivel</label>
            <select className="a-form-input" value={book.level} onChange={(e) => set("level", Number(e.target.value))}>
              <option value={1}>Nivel 1 — Básico</option>
              <option value={2}>Nivel 2 — Intermedio</option>
              <option value={3}>Nivel 3 — Avanzado</option>
            </select>
          </div>
          <div className="a-form-group">
            <label className="a-form-label">Páginas</label>
            <input className="a-form-input" type="number" value={book.pages} onChange={(e) => set("pages", Number(e.target.value))} />
          </div>
          <div className="a-form-group">
            <label className="a-form-label">Año</label>
            <input className="a-form-input" type="number" value={book.year} onChange={(e) => set("year", Number(e.target.value))} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12, marginTop: 12 }}>
          <div className="a-form-group">
            <label className="a-form-label">ID numérico</label>
            <input className="a-form-input" type="number" value={book.id} onChange={(e) => set("id", Number(e.target.value))} />
          </div>
        </div>
      </div>

      {/* ── Link de descarga ── */}
      <div style={{ ...sectionStyle, background: book.downloadUrl ? "rgba(16,185,129,0.04)" : "rgba(255,255,255,0.02)", border: book.downloadUrl ? "1px solid rgba(16,185,129,0.15)" : "1px solid rgba(255,255,255,0.05)" }}>
        {sectionHeader(<Download size={14} color="#10b981" />, "Link de Descarga")}
        <div className="a-form-group" style={{ margin: 0 }}>
          <label className="a-form-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            URL del archivo
            {book.downloadUrl && (
              <span style={{ fontSize: "0.65rem", padding: "2px 8px", borderRadius: 6, background: "rgba(16,185,129,0.12)", color: "#10b981", fontWeight: 700 }}>
                ✓ Configurado
              </span>
            )}
          </label>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Link size={14} color="#6b6b80" style={{ flexShrink: 0 }} />
            <input
              className="a-form-input"
              value={book.downloadUrl || ""}
              onChange={(e) => set("downloadUrl", e.target.value || undefined)}
              placeholder="https://drive.google.com/... o URL directa del archivo PDF"
              style={{ flex: 1 }}
            />
          </div>
          <p style={{ margin: "8px 0 0", fontSize: "0.72rem", color: "#4a4a5a", lineHeight: 1.5 }}>
            Los compradores podrán descargar el libro desde esta URL. Acepta links de Google Drive, Dropbox, o cualquier URL directa.
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
        <button onClick={onCancel} className="a-btn-outline" style={{ padding: "10px 20px" }}>
          <X size={14} /> Cancelar
        </button>
        <button onClick={onSave} className="a-btn" style={{ padding: "10px 20px" }} disabled={saving || !book.title}>
          {saving ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={14} />}
          Guardar Libro
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   BUNDLE FORM
   ══════════════════════════════════════════════════════ */
function BundleForm({ bundle, onChange, onSave, onCancel, books, saving }: {
  bundle: BundleData;
  onChange: (b: BundleData) => void;
  onSave: () => void;
  onCancel: () => void;
  books: BookData[];
  saving: boolean;
}) {
  const set = (k: keyof BundleData, v: unknown) => onChange({ ...bundle, [k]: v });
  const toggleBook = (id: number) => {
    const ids = bundle.bookIds.includes(id)
      ? bundle.bookIds.filter((x) => x !== id)
      : [...bundle.bookIds, id];
    set("bookIds", ids);
  };
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div className="a-form-group" style={{ gridColumn: "1 / -1" }}>
          <label className="a-form-label">Nombre</label>
          <input className="a-form-input" value={bundle.name} onChange={(e) => set("name", e.target.value)} placeholder="Nombre del bundle" />
        </div>
        <div className="a-form-group">
          <label className="a-form-label">Precio</label>
          <input className="a-form-input" type="number" step="0.01" value={bundle.price} onChange={(e) => set("price", Number(e.target.value))} />
        </div>
        <div className="a-form-group">
          <label className="a-form-label">Precio Original</label>
          <input className="a-form-input" type="number" step="0.01" value={bundle.originalPrice} onChange={(e) => set("originalPrice", Number(e.target.value))} />
        </div>
        <div className="a-form-group">
          <label className="a-form-label">Nivel</label>
          <select className="a-form-input" value={bundle.level} onChange={(e) => set("level", Number(e.target.value))}>
            <option value={0}>Todos</option>
            <option value={1}>Nivel 1</option>
            <option value={2}>Nivel 2</option>
            <option value={3}>Nivel 3</option>
          </select>
        </div>
        <div className="a-form-group">
          <label className="a-form-label">Color (hex)</label>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="color"
              value={bundle.color}
              onChange={(e) => set("color", e.target.value)}
              style={{ width: 40, height: 36, border: "none", borderRadius: 8, cursor: "pointer", background: "transparent" }}
            />
            <input className="a-form-input" value={bundle.color} onChange={(e) => set("color", e.target.value)} style={{ flex: 1 }} />
          </div>
        </div>
        <div className="a-form-group" style={{ gridColumn: "1 / -1" }}>
          <label className="a-form-label">Badge (opcional)</label>
          <input className="a-form-input" value={bundle.badge || ""} onChange={(e) => set("badge", e.target.value || undefined)} placeholder='Ej: "MEJOR VALOR"' />
        </div>
      </div>

      {/* Book selection */}
      <div className="a-form-group">
        <label className="a-form-label">Libros incluidos ({bundle.bookIds.length})</label>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", padding: "12px", borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
          {books.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => toggleBook(b.id)}
              style={{
                padding: "6px 12px", borderRadius: 8, fontSize: "0.78rem", fontWeight: 600,
                cursor: "pointer", transition: "all 0.2s", border: "1px solid",
                background: bundle.bookIds.includes(b.id) ? "rgba(249,115,22,0.12)" : "rgba(255,255,255,0.02)",
                color: bundle.bookIds.includes(b.id) ? "#f97316" : "#6b6b80",
                borderColor: bundle.bookIds.includes(b.id) ? "rgba(249,115,22,0.3)" : "rgba(255,255,255,0.06)",
              }}
            >
              #{b.id} {b.title}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20 }}>
        <button onClick={onCancel} className="a-btn-outline" style={{ padding: "10px 20px" }}>
          <X size={14} /> Cancelar
        </button>
        <button onClick={onSave} className="a-btn" style={{ padding: "10px 20px" }} disabled={saving || !bundle.name}>
          {saving ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={14} />}
          Guardar
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   COURSE METADATA FORM
   ══════════════════════════════════════════════════════ */
function CourseMetaForm({ course, onChange, onSave, onCancel, saving }: {
  course: CourseData;
  onChange: (c: CourseData) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const set = (k: keyof CourseData, v: unknown) => onChange({ ...course, [k]: v });

  return (
    <div>
      {/* Título y subtítulo */}
      <div className="a-form-group">
        <label className="a-form-label">Título</label>
        <input className="a-form-input" value={course.title} onChange={(e) => set("title", e.target.value)} placeholder="Ej: Curso de Algoritmos Básico" style={{ fontSize: "0.95rem", fontWeight: 600 }} />
      </div>
      <div className="a-form-group">
        <label className="a-form-label">Subtítulo</label>
        <input className="a-form-input" value={course.subtitle} onChange={(e) => set("subtitle", e.target.value)} placeholder="Descripción corta para la tarjeta" />
      </div>
      <div className="a-form-group">
        <label className="a-form-label">Descripción</label>
        <textarea className="a-form-input" value={course.description} onChange={(e) => set("description", e.target.value)} rows={2} placeholder="Descripción detallada del curso" />
      </div>

      {/* Grid de campos */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
        <div className="a-form-group" style={{ margin: 0 }}>
          <label className="a-form-label">Nivel</label>
          <select className="a-form-input" value={course.level} onChange={(e) => set("level", e.target.value)}>
            <option value="Básico">Básico</option>
            <option value="Intermedio">Intermedio</option>
            <option value="Avanzado">Avanzado</option>
          </select>
        </div>
        <div className="a-form-group" style={{ margin: 0 }}>
          <label className="a-form-label">Precio USD</label>
          <input className="a-form-input" type="number" value={course.price} onChange={(e) => set("price", Number(e.target.value))} placeholder="29.99" style={{ fontWeight: 700 }} />
        </div>
        <div className="a-form-group" style={{ margin: 0 }}>
          <label className="a-form-label">Duración</label>
          <input className="a-form-input" value={course.duration} onChange={(e) => set("duration", e.target.value)} placeholder="8 semanas" />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
        <div className="a-form-group" style={{ margin: 0 }}>
          <label className="a-form-label">Videos</label>
          <input className="a-form-input" type="number" value={course.totalVideos} onChange={(e) => set("totalVideos", Number(e.target.value))} />
        </div>
        <div className="a-form-group" style={{ margin: 0 }}>
          <label className="a-form-label">Horas</label>
          <input className="a-form-input" type="number" value={course.totalHours} onChange={(e) => set("totalHours", Number(e.target.value))} />
        </div>
        <div className="a-form-group" style={{ margin: 0 }}>
          <label className="a-form-label">ID</label>
          <input className="a-form-input" value={course.id} onChange={(e) => set("id", e.target.value)} placeholder="mi-curso" />
        </div>
      </div>

      {/* Highlights compacto */}
      <div style={{ padding: "12px 14px", borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: course.highlights.length > 0 ? 10 : 0 }}>
          <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#a0a0b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Highlights ({course.highlights.length})
          </span>
          <button
            type="button"
            onClick={() => set("highlights", [...course.highlights, ""])}
            className="a-btn-outline"
            style={{ padding: "4px 10px", fontSize: "0.7rem" }}
          >
            <Plus size={11} /> Agregar
          </button>
        </div>
        {course.highlights.map((h, i) => (
          <div key={i} style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: "0.65rem", fontWeight: 800, color: "#eab308", width: 16, textAlign: "center", flexShrink: 0 }}>{i + 1}</span>
            <input
              className="a-form-input"
              value={h}
              onChange={(e) => {
                const hl = [...course.highlights];
                hl[i] = e.target.value;
                set("highlights", hl);
              }}
              style={{ flex: 1, padding: "6px 10px", fontSize: "0.8rem" }}
              placeholder="Ej: +100 ejercicios prácticos"
            />
            <button onClick={() => set("highlights", course.highlights.filter((_, j) => j !== i))} className="a-action danger" style={{ flexShrink: 0 }}>
              <X size={11} />
            </button>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button onClick={onCancel} className="a-btn-outline" style={{ padding: "10px 20px" }}>
          <X size={14} /> Cancelar
        </button>
        <button onClick={onSave} className="a-btn" style={{ padding: "10px 20px" }} disabled={saving || !course.title}>
          {saving ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={14} />}
          Guardar Curso
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   FULL COURSE EDITOR (modules + videos)
   ══════════════════════════════════════════════════════ */
function CourseEditor({ course, onSave, onCancel, saving }: {
  course: CourseData;
  onSave: (c: CourseData) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [c, setC] = useState<CourseData>(course);
  const [openMod, setOpenMod] = useState<string | null>(c.modules[0]?.id || null);
  const [editVideo, setEditVideo] = useState<{ modIdx: number; vidIdx: number } | null>(null);

  const totalVids = c.modules.reduce((s, m) => s + m.videos.length, 0);

  const addModule = () => {
    const m: ModuleData = { id: `mod-${genId()}`, title: "Nuevo Módulo", videos: [] };
    setC({ ...c, modules: [...c.modules, m] });
    setOpenMod(m.id);
  };

  const removeModule = (idx: number) => {
    if (!confirm("¿Eliminar este módulo y todos sus videos?")) return;
    setC({ ...c, modules: c.modules.filter((_, i) => i !== idx) });
  };

  const updateModule = (idx: number, title: string) => {
    const mods = [...c.modules];
    mods[idx] = { ...mods[idx], title };
    setC({ ...c, modules: mods });
  };

  const addVideo = (modIdx: number) => {
    const v: VideoData = { id: `vid-${genId()}`, title: "Nuevo Video", duration: "00:00", description: "", materials: [] };
    const mods = [...c.modules];
    mods[modIdx] = { ...mods[modIdx], videos: [...mods[modIdx].videos, v] };
    setC({ ...c, modules: mods });
    setEditVideo({ modIdx, vidIdx: mods[modIdx].videos.length - 1 });
  };

  const removeVideo = (modIdx: number, vidIdx: number) => {
    const mods = [...c.modules];
    mods[modIdx] = { ...mods[modIdx], videos: mods[modIdx].videos.filter((_, i) => i !== vidIdx) };
    setC({ ...c, modules: mods });
    if (editVideo?.modIdx === modIdx && editVideo?.vidIdx === vidIdx) setEditVideo(null);
  };

  const updateVideo = (modIdx: number, vidIdx: number, data: Partial<VideoData>) => {
    const mods = [...c.modules];
    mods[modIdx] = {
      ...mods[modIdx],
      videos: mods[modIdx].videos.map((v, i) => i === vidIdx ? { ...v, ...data } : v),
    };
    setC({ ...c, modules: mods });
  };

  const addMaterial = (modIdx: number, vidIdx: number) => {
    const vid = c.modules[modIdx].videos[vidIdx];
    updateVideo(modIdx, vidIdx, { materials: [...vid.materials, { name: "", size: "" }] });
  };

  const removeMaterial = (modIdx: number, vidIdx: number, matIdx: number) => {
    const vid = c.modules[modIdx].videos[vidIdx];
    updateVideo(modIdx, vidIdx, { materials: vid.materials.filter((_, i) => i !== matIdx) });
  };

  const updateMaterial = (modIdx: number, vidIdx: number, matIdx: number, data: Partial<VideoMaterial>) => {
    const vid = c.modules[modIdx].videos[vidIdx];
    updateVideo(modIdx, vidIdx, {
      materials: vid.materials.map((m, i) => i === matIdx ? { ...m, ...data } : m),
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
        padding: "18px 22px", borderRadius: 16,
        background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(168,85,247,0.04))",
        border: "1px solid rgba(99,102,241,0.12)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button onClick={onCancel} className="a-btn-outline" style={{ padding: "8px 14px" }}>
            <ArrowLeft size={15} />
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 800, color: "#f0f0f5" }}>
              {c.title || "Sin título"}
            </h1>
            <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
              {[
                { icon: Layers, val: `${c.modules.length} módulos`, color: "#a855f7" },
                { icon: Video, val: `${totalVids} videos`, color: "#06b6d4" },
              ].map((m, j) => (
                <span key={j} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.75rem", color: m.color, fontWeight: 600 }}>
                  <m.icon size={12} /> {m.val}
                </span>
              ))}
            </div>
          </div>
        </div>
        <button onClick={() => onSave(c)} className="a-btn" style={{ padding: "10px 22px" }} disabled={saving}>
          {saving ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={14} />}
          Guardar Todo
        </button>
      </div>

      {/* Modules */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {c.modules.length === 0 && (
          <div style={{
            padding: "40px 24px", textAlign: "center", borderRadius: 16,
            background: "rgba(15,15,35,0.5)", border: "1px dashed rgba(255,255,255,0.08)",
          }}>
            <FolderOpen size={32} color="#4a4a5a" style={{ marginBottom: 12 }} />
            <p style={{ color: "#6b6b80", fontSize: "0.88rem", fontWeight: 600, margin: 0 }}>
              No hay módulos todavía
            </p>
            <p style={{ color: "#4a4a5a", fontSize: "0.78rem", margin: "6px 0 0" }}>
              Agrega el primer módulo para empezar a estructurar el curso
            </p>
          </div>
        )}

        {c.modules.map((mod, modIdx) => {
          const isOpen = openMod === mod.id;
          return (
            <div key={mod.id} style={{
              borderRadius: 16, overflow: "hidden",
              background: "rgba(15,15,35,0.5)", border: `1px solid ${isOpen ? "rgba(168,85,247,0.12)" : "rgba(255,255,255,0.04)"}`,
              transition: "border-color 0.3s",
            }}>
              {/* Module header */}
              <div
                className="a-accordion-header"
                onClick={() => setOpenMod(isOpen ? null : mod.id)}
                style={{ borderRadius: isOpen ? "16px 16px 0 0" : 16 }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 10,
                    background: "linear-gradient(135deg, rgba(168,85,247,0.2), rgba(168,85,247,0.05))",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.78rem", fontWeight: 800, color: "#a855f7",
                    border: "1px solid rgba(168,85,247,0.15)",
                  }}>
                    {modIdx + 1}
                  </div>
                  <input
                    className="a-form-input"
                    value={mod.title}
                    onChange={(e) => updateModule(modIdx, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    style={{ flex: 1, background: "transparent", border: "1px solid transparent", padding: "6px 10px", fontSize: "0.9rem", fontWeight: 600 }}
                    onFocus={(e) => { e.target.style.borderColor = "rgba(168,85,247,0.3)"; e.target.style.background = "rgba(168,85,247,0.05)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "transparent"; e.target.style.background = "transparent"; }}
                  />
                  <span style={{
                    padding: "3px 10px", borderRadius: 8, fontSize: "0.7rem", fontWeight: 700,
                    background: "rgba(6,182,212,0.08)", color: "#06b6d4",
                    border: "1px solid rgba(6,182,212,0.12)",
                  }}>
                    {mod.videos.length} videos
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeModule(modIdx); }}
                    className="a-action danger"
                    style={{ marginLeft: 4 }}
                  >
                    <Trash2 size={12} />
                  </button>
                  {isOpen ? <ChevronDown size={16} color="#6b6b80" /> : <ChevronRight size={16} color="#6b6b80" />}
                </div>
              </div>

              {/* Videos */}
              {isOpen && (
                <div style={{ padding: "14px 18px 18px" }}>
                  {mod.videos.length === 0 ? (
                    <div style={{
                      padding: "28px 24px", textAlign: "center",
                      borderRadius: 12, border: "1px dashed rgba(255,255,255,0.06)",
                      background: "rgba(255,255,255,0.01)",
                    }}>
                      <Video size={24} color="#4a4a5a" style={{ marginBottom: 8 }} />
                      <p style={{ margin: 0, color: "#4a4a5a", fontSize: "0.82rem" }}>
                        No hay videos en este módulo
                      </p>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {mod.videos.map((vid, vidIdx) => {
                        const isEditing = editVideo?.modIdx === modIdx && editVideo?.vidIdx === vidIdx;
                        return (
                          <div key={vid.id} style={{
                            padding: isEditing ? "16px" : "12px 16px", borderRadius: 14,
                            background: isEditing ? "rgba(99,102,241,0.05)" : "rgba(255,255,255,0.015)",
                            border: `1px solid ${isEditing ? "rgba(99,102,241,0.18)" : "rgba(255,255,255,0.03)"}`,
                            transition: "all 0.3s ease",
                          }}>
                            {isEditing ? (
                              /* ── Editing mode ── */
                              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                {/* Edit header */}
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 10, borderBottom: "1px solid rgba(99,102,241,0.1)" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <div style={{
                                      width: 26, height: 26, borderRadius: 7,
                                      background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(99,102,241,0.05))",
                                      display: "flex", alignItems: "center", justifyContent: "center",
                                    }}>
                                      <Edit3 size={11} color="#6366f1" />
                                    </div>
                                    <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#a0a0c0", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                      Editando Video {vidIdx + 1}
                                    </span>
                                  </div>
                                  <button onClick={() => setEditVideo(null)} className="a-btn" style={{ padding: "6px 14px", fontSize: "0.75rem" }}>
                                    <Sparkles size={12} /> Listo
                                  </button>
                                </div>

                                {/* Fields */}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 140px", gap: 10 }}>
                                  <div className="a-form-group" style={{ margin: 0 }}>
                                    <label className="a-form-label" style={{ fontSize: "0.68rem", display: "flex", alignItems: "center", gap: 5 }}>
                                      <Video size={10} color="#06b6d4" /> Título del video
                                    </label>
                                    <input className="a-form-input" value={vid.title} onChange={(e) => updateVideo(modIdx, vidIdx, { title: e.target.value })} style={{ padding: "8px 12px", fontSize: "0.85rem" }} placeholder="Título del video" />
                                  </div>
                                  <div className="a-form-group" style={{ margin: 0 }}>
                                    <label className="a-form-label" style={{ fontSize: "0.68rem", display: "flex", alignItems: "center", gap: 5 }}>
                                      <Clock size={10} color="#eab308" /> Duración
                                    </label>
                                    <input className="a-form-input" value={vid.duration} onChange={(e) => updateVideo(modIdx, vidIdx, { duration: e.target.value })} style={{ padding: "8px 12px", fontSize: "0.85rem" }} placeholder="MM:SS" />
                                  </div>
                                </div>
                                <div className="a-form-group" style={{ margin: 0 }}>
                                  <label className="a-form-label" style={{ fontSize: "0.68rem", display: "flex", alignItems: "center", gap: 5 }}>
                                    <FileText size={10} color="#a855f7" /> Descripción
                                  </label>
                                  <textarea className="a-form-input" value={vid.description} onChange={(e) => updateVideo(modIdx, vidIdx, { description: e.target.value })} rows={2} style={{ padding: "8px 12px", fontSize: "0.82rem", minHeight: 50 }} placeholder="Descripción del contenido del video" />
                                </div>

                                {/* Materials */}
                                <div style={{ padding: "12px", borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: vid.materials.length > 0 ? 10 : 0 }}>
                                    <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#a0a0b8", display: "flex", alignItems: "center", gap: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                      <Paperclip size={11} color="#f97316" /> Materiales ({vid.materials.length})
                                    </label>
                                    <button
                                      type="button"
                                      onClick={() => addMaterial(modIdx, vidIdx)}
                                      className="a-btn-outline"
                                      style={{ padding: "4px 10px", fontSize: "0.7rem" }}
                                    >
                                      <Plus size={11} /> Agregar
                                    </button>
                                  </div>
                                  {vid.materials.map((mat, matIdx) => (
                                    <div key={matIdx} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                                      <input
                                        className="a-form-input"
                                        value={mat.name}
                                        onChange={(e) => updateMaterial(modIdx, vidIdx, matIdx, { name: e.target.value })}
                                        placeholder="Nombre del archivo"
                                        style={{ flex: 1, padding: "6px 10px", fontSize: "0.78rem" }}
                                      />
                                      <input
                                        className="a-form-input"
                                        value={mat.size}
                                        onChange={(e) => updateMaterial(modIdx, vidIdx, matIdx, { size: e.target.value })}
                                        placeholder="Ej: 2.5 MB"
                                        style={{ width: 100, padding: "6px 10px", fontSize: "0.78rem" }}
                                      />
                                      <button onClick={() => removeMaterial(modIdx, vidIdx, matIdx)} className="a-action danger" style={{ flexShrink: 0 }}>
                                        <X size={11} />
                                      </button>
                                    </div>
                                  ))}
                                  {vid.materials.length === 0 && (
                                    <p style={{ margin: "8px 0 0", fontSize: "0.72rem", color: "#4a4a5a", textAlign: "center" }}>
                                      Sin materiales adjuntos
                                    </p>
                                  )}
                                </div>
                              </div>
                            ) : (
                              /* ── Display mode ── */
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
                                  <div style={{
                                    width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                                    background: "rgba(6,182,212,0.08)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    border: "1px solid rgba(6,182,212,0.1)",
                                  }}>
                                    <Video size={13} color="#06b6d4" />
                                  </div>
                                  <div style={{ minWidth: 0 }}>
                                    <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "#d0d0e0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                      {vid.title}
                                    </div>
                                    <div style={{ display: "flex", gap: 10, fontSize: "0.7rem", color: "#4a4a5a", marginTop: 3 }}>
                                      <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                                        <Clock size={10} /> {vid.duration}
                                      </span>
                                      {vid.materials.length > 0 && (
                                        <span style={{ display: "flex", alignItems: "center", gap: 3, color: "#f97316" }}>
                                          <Paperclip size={10} /> {vid.materials.length}
                                        </span>
                                      )}
                                      {vid.description && (
                                        <span style={{ color: "#10b981", display: "flex", alignItems: "center", gap: 3 }}>
                                          <FileText size={10} /> desc
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div style={{ display: "flex", gap: 4 }}>
                                  <button onClick={() => setEditVideo({ modIdx, vidIdx })} className="a-action" title="Editar video">
                                    <Edit3 size={11} /> Editar
                                  </button>
                                  <button onClick={() => removeVideo(modIdx, vidIdx)} className="a-action danger" title="Eliminar">
                                    <Trash2 size={11} />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <button
                    onClick={() => addVideo(modIdx)}
                    className="a-btn-outline"
                    style={{ padding: "8px 16px", marginTop: 12, fontSize: "0.78rem", borderStyle: "dashed" }}
                  >
                    <Plus size={13} /> Agregar Video
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Module */}
      <button onClick={addModule} className="a-btn-outline" style={{
        padding: "16px 24px", borderRadius: 16, fontSize: "0.88rem",
        borderStyle: "dashed", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        background: "rgba(168,85,247,0.03)",
      }}>
        <Plus size={16} /> Agregar Módulo
      </button>

      {/* Bottom save */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <button onClick={onCancel} className="a-btn-outline" style={{ padding: "10px 22px" }}>
          Cancelar
        </button>
        <button onClick={() => onSave(c)} className="a-btn" style={{ padding: "10px 22px" }} disabled={saving}>
          {saving ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={14} />}
          Guardar Cambios
        </button>
      </div>
    </div>
  );
}
