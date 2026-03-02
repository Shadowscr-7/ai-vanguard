"use client";

const items = [
  "INTELIGENCIA ARTIFICIAL",
  "PROMPT ENGINEERING",
  "MACHINE LEARNING",
  "DEEP LEARNING",
  "TRANSFORMERS",
  "AGENTES AUTÓNOMOS",
  "RAG",
  "FINE-TUNING",
  "COMPUTACIÓN CUÁNTICA",
  "ÉTICA DIGITAL",
];

export default function Marquee() {
  const doubled = [...items, ...items];

  return (
    <div className="marquee-section">
      <div className="marquee-track">
        <div className="marquee-content">
          {doubled.map((item, i) => (
            <span key={i}>
              {item}
              <span className="marquee-dot">◆</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
