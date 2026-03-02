"use client";

import { motion } from "framer-motion";
import { testimonials } from "@/data/content";

export default function Testimonials() {
  return (
    <section id="testimonios" className="section section-testimonials">
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag">💬 TESTIMONIOS</span>
          <h2 className="section-title">
            Lo que dicen nuestros <span className="gradient-text">estudiantes</span>
          </h2>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="testimonial-card"
            >
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-text">&ldquo;{t.text}&rdquo;</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{t.avatar}</div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-role">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
