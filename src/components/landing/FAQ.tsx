"use client";

import { useState } from "react";
import { faq } from "@/data/content";

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section id="faq" className="section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag">❓ FAQ</span>
          <h2 className="section-title">
            Preguntas <span className="gradient-text-2">Frecuentes</span>
          </h2>
        </div>

        <div className="faq-list">
          {faq.map((item, i) => {
            const isOpen = openIdx === i;
            return (
              <div key={i} className={`faq-item ${isOpen ? "active" : ""}`}>
                <button
                  className="faq-question"
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                >
                  <span>{item.q}</span>
                  <span className="faq-icon">+</span>
                </button>
                <div className="faq-answer">
                  <p>{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
