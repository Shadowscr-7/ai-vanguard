"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="section section-cta">
      <div className="cta-bg-effects">
        <div className="cta-orb cta-orb-1" />
        <div className="cta-orb cta-orb-2" />
        <div className="cta-orb cta-orb-3" />
      </div>

      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="cta-content"
        >
          <h2 className="cta-title">
            ¿Listo para dominar la <span className="gradient-text">IA</span>?
          </h2>
          <p className="cta-subtitle">
            Únete a más de 2,500 estudiantes que ya están transformando su
            carrera con nuestros cursos y libros.
          </p>
          <div className="cta-buttons">
            <a href="#cursos" className="btn btn-primary btn-xl btn-glow">
              Comenzar Ahora
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
          </div>
          <p className="cta-guarantee">🛡️ 30 días de garantía de devolución</p>
        </motion.div>
      </div>
    </section>
  );
}
