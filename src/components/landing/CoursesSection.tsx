"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { courses } from "@/data/content";

export default function CoursesSection() {
  return (
    <section id="cursos" className="section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag">🎓 CURSOS</span>
          <h2 className="section-title">
            Aprende <span className="gradient-text-2">Haciendo</span>
          </h2>
          <p className="section-subtitle">
            Cursos prácticos con proyectos reales. Acceso de por vida.
          </p>
        </div>

        <div className="courses-grid">
          {courses.map((course, i) => {
            const isAdvanced = course.level === "Avanzado";
            const badgeClass = isAdvanced ? "advanced" : "basic";

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="course-card shimmer-hover"
              >
                <div className="course-header">
                  <span className={`course-level-badge ${badgeClass}`}>
                    {course.level}
                  </span>
                  <h3 className="course-title">{course.title}</h3>
                  <p className="course-subtitle">{course.subtitle}</p>

                  <div className="course-meta">
                    <span className="course-meta-item">⏱️ {course.duration}</span>
                    <span className="course-meta-item">🎬 {course.totalVideos} videos</span>
                    <span className="course-meta-item">📚 {course.totalHours} horas</span>
                  </div>

                  <p className="course-description">{course.description}</p>

                  <ul className="course-highlights">
                    {course.highlights.map((h, j) => (
                      <li key={j}>{h}</li>
                    ))}
                  </ul>
                </div>

                <div className="course-footer">
                  <div className="course-price">
                    <span className="course-price-currency">$</span>
                    {course.price}
                    <span className="course-price-period">Acceso de por vida</span>
                  </div>
                  <Link href="/auth/register" className="btn btn-primary btn-lg btn-glow">
                    Inscribirme Ahora
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
