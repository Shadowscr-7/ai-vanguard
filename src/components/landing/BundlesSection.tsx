"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { bundles, getBooksByIds } from "@/data/content";

export default function BundlesSection() {
  return (
    <section className="section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag">📦 BUNDLES</span>
          <h2 className="section-title">
            Paquetes <span className="gradient-text">Especiales</span>
          </h2>
          <p className="section-subtitle">
            Obtén varios libros por una fracción del precio. Cuanto más inviertes, más ahorras.
          </p>
        </div>

        <div className="bundles-grid">
          {bundles.map((bundle, i) => {
            const books = getBooksByIds(bundle.bookIds);
            const savingsPercent = Math.round(
              ((bundle.originalPrice - bundle.price) / bundle.originalPrice) * 100
            );
            const isDefinitive = bundle.id === "definitive";

            return (
              <motion.div
                key={bundle.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bundle-card shimmer-hover"
                style={{ borderColor: `${bundle.color}20` }}
              >
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: bundle.color }} />

                {bundle.badge && (
                  <span className="bundle-badge">{bundle.badge}</span>
                )}

                <h4 className="bundle-name">{bundle.name}</h4>
                <p className="bundle-books">{books.length} libros incluidos</p>

                <div className="bundle-original-price">${bundle.originalPrice.toFixed(2)}</div>
                <div className="bundle-price" style={{ color: bundle.color }}>
                  ${bundle.price}
                </div>
                <div className="bundle-savings">Ahorra {savingsPercent}%</div>

                <Link
                  href="/auth/register"
                  className="btn btn-primary btn-glow"
                  style={{ background: bundle.color }}
                >
                  {isDefinitive ? "Obtener Colección Completa" : "Comprar Bundle"}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
