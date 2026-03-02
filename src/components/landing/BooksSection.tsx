"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { getBooksByLevel } from "@/data/content";

const levels = [
  { n: 1, label: "Nivel I — Iniciación", color: "#06b6d4" },
  { n: 2, label: "Nivel II — Profundización", color: "#8b5cf6" },
  { n: 3, label: "Nivel III — Trascendencia", color: "#f97316" },
];

const bookGradients: Record<number, [string, string]> = {
  1: ["#06b6d4", "#0891b2"],
  2: ["#0891b2", "#0e7490"],
  3: ["#6366f1", "#4f46e5"],
  4: ["#8b5cf6", "#7c3aed"],
  5: ["#a855f7", "#9333ea"],
  6: ["#d946ef", "#c026d3"],
  7: ["#f97316", "#ea580c"],
  8: ["#ef4444", "#dc2626"],
  9: ["#f59e0b", "#d97706"],
  10: ["#eab308", "#ca8a04"],
};

export default function BooksSection() {
  const [activeLevel, setActiveLevel] = useState(1);
  const filtered = getBooksByLevel(activeLevel);

  return (
    <section id="libros" className="section section-books">
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag">📚 COLECCIÓN COMPLETA</span>
          <h2 className="section-title">
            IA <span className="gradient-text">Vanguard</span>
          </h2>
          <p className="section-subtitle">
            10 libros divididos en 3 niveles progresivos. Cada libro construye
            sobre el anterior para llevarte desde los fundamentos hasta las
            fronteras del conocimiento.
          </p>
        </div>

        <div className="level-tabs">
          {levels.map((lvl) => (
            <button
              key={lvl.n}
              onClick={() => setActiveLevel(lvl.n)}
              className={`level-tab ${activeLevel === lvl.n ? "active" : ""}`}
            >
              <span className="tab-icon">{["I", "II", "III"][lvl.n - 1]}</span>
              <span>{lvl.label}</span>
            </button>
          ))}
        </div>

        <div className="books-grid">
          {filtered.map((book, i) => {
            const [c1, c2] = bookGradients[book.id] || ["#6366f1", "#4f46e5"];
            return (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="book-card shimmer-hover"
              >
                <div className="book-cover">
                  <div
                    className="book-cover-gradient"
                    style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
                  />
                  <div className="book-cover-content">
                    <div className="book-cover-number">
                      {String(book.id).padStart(2, "0")}
                    </div>
                    <div className="book-cover-title">{book.title}</div>
                    <div className="book-cover-subtitle">{book.subtitle}</div>
                  </div>
                </div>
                <div className="book-body">
                  <div className="book-meta">
                    <span>📖 {book.pages} pág.</span>
                    <span>📅 {book.year}</span>
                    <span
                      className="book-level-badge"
                      style={{
                        background: `${levels[book.level - 1]?.color}20`,
                        color: levels[book.level - 1]?.color,
                        border: `1px solid ${levels[book.level - 1]?.color}30`,
                      }}
                    >
                      Nivel {book.level}
                    </span>
                  </div>
                  <p className="book-description">{book.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
