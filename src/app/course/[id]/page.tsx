"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Play,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  Star,
  Send,
  Loader2,
  Video,
  Clock,
} from "lucide-react";
import { getCourseById } from "@/data/content";
import type { VideoData, CourseData, ModuleData } from "@/data/content";

interface ReviewItem {
  id: string;
  rating: number;
  text: string;
  user: { name: string | null; image: string | null };
  createdAt: string;
}

export default function CoursePlayerPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;

  const [course, setCourse] = useState<CourseData | null>(null);
  const [currentVideo, setCurrentVideo] = useState<VideoData | null>(null);
  const [currentModule, setCurrentModule] = useState<ModuleData | null>(null);
  const [watchedVideos, setWatchedVideos] = useState<Set<string>>(new Set());
  const [openModules, setOpenModules] = useState<Set<string>>(new Set());
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load course data
  useEffect(() => {
    const c = getCourseById(courseId);
    if (!c) {
      router.push("/dashboard");
      return;
    }
    setCourse(c);

    // Open first module by default
    if (c.modules.length > 0) {
      setOpenModules(new Set([c.modules[0].id]));
      if (c.modules[0].videos.length > 0) {
        setCurrentVideo(c.modules[0].videos[0]);
        setCurrentModule(c.modules[0]);
      }
    }
  }, [courseId, router]);

  // Load progress
  useEffect(() => {
    if (status !== "authenticated" || !courseId) return;

    fetch(`/api/progress?courseId=${courseId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.progress) {
          const ids = new Set<string>(data.progress.map((p: { videoId: string }) => p.videoId));
          setWatchedVideos(ids);

          // Auto-select first unwatched video
          if (course) {
            for (const mod of course.modules) {
              for (const vid of mod.videos) {
                if (!ids.has(vid.id)) {
                  setCurrentVideo(vid);
                  setCurrentModule(mod);
                  setOpenModules((prev) => new Set([...prev, mod.id]));
                  setLoading(false);
                  return;
                }
              }
            }
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [status, courseId, course]);

  // Load reviews when video changes
  useEffect(() => {
    if (!currentVideo) return;
    fetch(`/api/reviews?videoId=${currentVideo.id}`)
      .then((r) => r.json())
      .then((data) => setReviews(data.reviews || []))
      .catch(() => {});
  }, [currentVideo]);

  const handleSelectVideo = useCallback(
    (video: VideoData, module: ModuleData) => {
      setCurrentVideo(video);
      setCurrentModule(module);
      setReviewRating(0);
      setReviewText("");
    },
    []
  );

  const handleMarkWatched = async () => {
    if (!currentVideo || !course) return;

    const res = await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId: course.id, videoId: currentVideo.id }),
    });

    if (res.ok) {
      setWatchedVideos((prev) => new Set([...prev, currentVideo.id]));
    }
  };

  const handleNextVideo = () => {
    if (!course || !currentVideo || !currentModule) return;

    const allVideos: { video: VideoData; module: ModuleData }[] = [];
    course.modules.forEach((m) =>
      m.videos.forEach((v) => allVideos.push({ video: v, module: m }))
    );

    const idx = allVideos.findIndex((x) => x.video.id === currentVideo.id);
    if (idx < allVideos.length - 1) {
      const next = allVideos[idx + 1];
      handleSelectVideo(next.video, next.module);
      setOpenModules((prev) => new Set([...prev, next.module.id]));
    }
  };

  const handleSubmitReview = async () => {
    if (!currentVideo || reviewRating === 0) return;
    setReviewLoading(true);

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        videoId: currentVideo.id,
        rating: reviewRating,
        text: reviewText,
      }),
    });

    if (res.ok) {
      // Reload reviews
      const data = await fetch(
        `/api/reviews?videoId=${currentVideo.id}`
      ).then((r) => r.json());
      setReviews(data.reviews || []);
      setReviewRating(0);
      setReviewText("");
    }
    setReviewLoading(false);
  };

  const toggleModule = (moduleId: string) => {
    setOpenModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  };

  if (status === "loading" || loading || !course) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 size={32} className="animate-spin text-accent-indigo" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/auth/login");
    return null;
  }

  const totalVideos = course.totalVideos;
  const watchedCount = watchedVideos.size;
  const progressPercent = Math.round((watchedCount / totalVideos) * 100);

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Top bar */}
      <header className="glass-strong sticky top-0 z-50 border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-text-muted hover:text-text-primary"
            >
              <ArrowLeft size={20} />
            </Link>
            <div className="hidden sm:block">
              <h1 className="font-[family-name:var(--font-display)] text-sm font-bold leading-tight">
                {course.title}
              </h1>
              <div className="flex items-center gap-3 text-xs text-text-muted">
                <span>
                  {watchedCount}/{totalVideos} videos
                </span>
                <span>{progressPercent}%</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="progress-bar w-24 sm:w-40">
              <div
                className="progress-bar-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-accent-indigo">
              {progressPercent}%
            </span>
          </div>
        </div>
      </header>

      <div className="player-grid">
        {/* Main content area */}
        <main className="overflow-y-auto px-4 py-6 lg:px-8">
          {currentVideo ? (
            <>
              {/* Video placeholder */}
              <div className="mb-6 flex aspect-video items-center justify-center rounded-2xl border border-border bg-bg-card">
                <div className="text-center">
                  <Play
                    size={64}
                    className="mx-auto mb-3 text-accent-indigo/50"
                  />
                  <p className="text-sm text-text-muted">
                    Reproductor de video
                  </p>
                  <p className="font-[family-name:var(--font-display)] text-lg font-bold">
                    {currentVideo.title}
                  </p>
                  <p className="text-xs text-text-muted">
                    {currentVideo.duration}
                  </p>
                </div>
              </div>

              {/* Video info */}
              <div className="mb-6">
                <div className="mb-2 flex flex-wrap items-center gap-3">
                  <h2 className="font-[family-name:var(--font-display)] text-xl font-bold">
                    {currentVideo.title}
                  </h2>
                  {watchedVideos.has(currentVideo.id) && (
                    <span className="badge border border-accent-green/30 bg-accent-green/10 text-accent-green">
                      <CheckCircle size={12} className="mr-1 inline" />
                      Completado
                    </span>
                  )}
                </div>
                <p className="mb-4 text-sm text-text-secondary">
                  {currentVideo.description}
                </p>
                <div className="flex flex-wrap gap-3">
                  {!watchedVideos.has(currentVideo.id) && (
                    <button
                      onClick={handleMarkWatched}
                      className="btn-primary text-sm"
                    >
                      <CheckCircle size={16} /> Marcar como visto
                    </button>
                  )}
                  <button
                    onClick={handleNextVideo}
                    className="btn-secondary text-sm"
                  >
                    Siguiente video →
                  </button>
                </div>
              </div>

              {/* Materials */}
              {currentVideo.materials.length > 0 && (
                <div className="mb-6">
                  <h3 className="mb-3 font-[family-name:var(--font-display)] font-bold">
                    Materiales de este video
                  </h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {currentVideo.materials.map((mat, i) => (
                      <button
                        key={i}
                        className="card flex items-center gap-3 !px-4 !py-3 text-left text-sm"
                      >
                        <FileText
                          size={18}
                          className="shrink-0 text-accent-indigo"
                        />
                        <div className="min-w-0">
                          <div className="truncate font-medium">
                            {mat.name}
                          </div>
                          <div className="text-xs text-text-muted">
                            {mat.size}
                          </div>
                        </div>
                        <Download
                          size={16}
                          className="ml-auto shrink-0 text-text-muted"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* General materials */}
              {course.generalMaterials.length > 0 && (
                <div className="mb-6">
                  <h3 className="mb-3 font-[family-name:var(--font-display)] font-bold">
                    Materiales generales del curso
                  </h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {course.generalMaterials.map((mat, i) => (
                      <button
                        key={i}
                        className="card flex items-center gap-3 !px-4 !py-3 text-left text-sm"
                      >
                        <FileText
                          size={18}
                          className="shrink-0 text-accent-cyan"
                        />
                        <div className="min-w-0">
                          <div className="truncate font-medium">
                            {mat.name}
                          </div>
                          <div className="text-xs text-text-muted">
                            {mat.size}
                          </div>
                        </div>
                        <Download
                          size={16}
                          className="ml-auto shrink-0 text-text-muted"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              <div>
                <h3 className="mb-4 font-[family-name:var(--font-display)] font-bold">
                  Reviews de este video
                </h3>

                {/* Write review */}
                <div className="glass mb-6 rounded-xl p-4">
                  <p className="mb-2 text-sm font-medium">Deja tu review:</p>
                  <div className="mb-3 flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        onClick={() => setReviewRating(s)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          size={20}
                          className={
                            s <= reviewRating
                              ? "fill-accent-yellow text-accent-yellow"
                              : "text-text-muted/30"
                          }
                        />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Escribe tu opinión..."
                    className="mb-3 w-full resize-none rounded-lg border border-border bg-bg-card px-3 py-2 text-sm text-text-primary outline-none focus:border-accent-indigo/50"
                    rows={3}
                  />
                  <button
                    onClick={handleSubmitReview}
                    disabled={reviewRating === 0 || reviewLoading}
                    className="btn-primary text-sm disabled:opacity-50"
                  >
                    {reviewLoading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Send size={14} />
                    )}
                    Enviar Review
                  </button>
                </div>

                {/* Review list */}
                {reviews.length > 0 ? (
                  <div className="space-y-3">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="glass rounded-xl px-4 py-3"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-sm font-semibold">
                            {review.user.name || "Anónimo"}
                          </span>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                size={12}
                                className={
                                  s <= review.rating
                                    ? "fill-accent-yellow text-accent-yellow"
                                    : "text-text-muted/30"
                                }
                              />
                            ))}
                          </div>
                        </div>
                        {review.text && (
                          <p className="text-sm text-text-secondary">
                            {review.text}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-text-muted">
                    No hay reviews aún. ¡Sé el primero!
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-text-muted">
                Selecciona un video del panel lateral.
              </p>
            </div>
          )}
        </main>

        {/* Sidebar */}
        <aside className="overflow-y-auto border-l border-border bg-bg-secondary/50">
          <div className="border-b border-border px-4 py-3">
            <h2 className="font-[family-name:var(--font-display)] text-sm font-bold">
              Contenido del curso
            </h2>
            <p className="text-xs text-text-muted">
              {watchedCount}/{totalVideos} completados
            </p>
          </div>

          {course.modules.map((mod) => {
            const isOpen = openModules.has(mod.id);
            const modWatched = mod.videos.filter((v) =>
              watchedVideos.has(v.id)
            ).length;
            const modTotal = mod.videos.length;

            return (
              <div key={mod.id}>
                <button
                  onClick={() => toggleModule(mod.id)}
                  className="sidebar-module-header w-full"
                >
                  <div className="text-left">
                    <div className="text-sm font-semibold">{mod.title}</div>
                    <div className="text-xs text-text-muted">
                      {modWatched}/{modTotal} videos
                    </div>
                  </div>
                  {isOpen ? (
                    <ChevronUp size={16} className="text-text-muted" />
                  ) : (
                    <ChevronDown size={16} className="text-text-muted" />
                  )}
                </button>

                {isOpen && (
                  <div>
                    {mod.videos.map((vid) => {
                      const isActive = currentVideo?.id === vid.id;
                      const isWatched = watchedVideos.has(vid.id);

                      return (
                        <button
                          key={vid.id}
                          onClick={() => handleSelectVideo(vid, mod)}
                          className={`sidebar-video-item w-full ${
                            isActive ? "active" : ""
                          } ${isWatched ? "watched" : ""}`}
                        >
                          {isWatched ? (
                            <CheckCircle
                              size={16}
                              className="shrink-0 text-accent-green"
                            />
                          ) : isActive ? (
                            <Play
                              size={16}
                              className="shrink-0 text-accent-indigo"
                            />
                          ) : (
                            <Video
                              size={16}
                              className="shrink-0 text-text-muted"
                            />
                          )}
                          <div className="min-w-0 text-left">
                            <div className="truncate text-sm">{vid.title}</div>
                            <div className="flex items-center gap-1 text-xs text-text-muted">
                              <Clock size={10} />
                              {vid.duration}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </aside>
      </div>
    </div>
  );
}
