"use client";

import { motion } from "framer-motion";

interface Row {
  feature: string;
  basico: boolean | string;
  avanzado: boolean | string;
}

const rows: Row[] = [
  { feature: "Duración", basico: "8 semanas", avanzado: "12 semanas" },
  { feature: "Videos", basico: "17 videos", avanzado: "18 videos" },
  { feature: "Horas de contenido", basico: "16 horas", avanzado: "32 horas" },
  { feature: "Prompt Engineering", basico: true, avanzado: true },
  { feature: "Herramientas de IA", basico: true, avanzado: true },
  { feature: "Automatización", basico: true, avanzado: true },
  { feature: "Creación de contenido", basico: true, avanzado: true },
  { feature: "APIs e integraciones", basico: false, avanzado: true },
  { feature: "Fine-Tuning de modelos", basico: false, avanzado: true },
  { feature: "RAG & Vectores", basico: false, avanzado: true },
  { feature: "Agentes Autónomos", basico: false, avanzado: true },
  { feature: "IA para Negocios", basico: false, avanzado: true },
  { feature: "Mentoría personalizada", basico: false, avanzado: true },
  { feature: "Materiales descargables", basico: true, avanzado: true },
  { feature: "Certificado", basico: "Básico", avanzado: "Profesional" },
  { feature: "Proyecto final", basico: true, avanzado: true },
];

function Cell({ value }: { value: boolean | string }) {
  if (typeof value === "string")
    return <span style={{ fontWeight: 500 }}>{value}</span>;
  return value ? (
    <span className="check">✓</span>
  ) : (
    <span className="cross">✗</span>
  );
}

export default function ComparisonTable() {
  return (
    <section id="comparar" className="section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag">⚡ COMPARA</span>
          <h2 className="section-title">
            ¿Qué curso es <span className="gradient-text">para ti</span>?
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="comparison-table"
        >
          <table>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Característica</th>
                <th>
                  <div className="th-content">
                    <span className="th-badge basic">BÁSICO</span>
                    <span className="th-price">$199</span>
                  </div>
                </th>
                <th>
                  <div className="th-content popular">
                    <span className="th-popular-badge">MÁS POPULAR</span>
                    <span className="th-badge advanced">AVANZADO</span>
                    <span className="th-price">$599</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  <td>{row.feature}</td>
                  <td><Cell value={row.basico} /></td>
                  <td><Cell value={row.avanzado} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}
