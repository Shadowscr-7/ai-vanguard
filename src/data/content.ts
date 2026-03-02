// ============================================
// STATIC CONTENT DATA
// ============================================

export interface BookData {
  id: number;
  level: number;
  title: string;
  subtitle: string;
  pages: number;
  year: number;
  description: string;
  downloadUrl?: string;
}

export interface BundleData {
  id: string;
  name: string;
  level: number;
  bookIds: number[];
  price: number;
  originalPrice: number;
  color: string;
  badge?: string;
}

export interface VideoMaterial {
  name: string;
  size: string;
}

export interface VideoData {
  id: string;
  title: string;
  duration: string;
  description: string;
  materials: VideoMaterial[];
}

export interface ModuleData {
  id: string;
  title: string;
  videos: VideoData[];
}

export interface CourseData {
  id: string;
  title: string;
  subtitle: string;
  level: string;
  price: number;
  duration: string;
  totalVideos: number;
  totalHours: number;
  description: string;
  highlights: string[];
  modules: ModuleData[];
  generalMaterials: VideoMaterial[];
}

// ---- BOOKS ----
export const books: BookData[] = [
  { id: 1, level: 1, title: "Despertar Digital", subtitle: "Fundamentos del pensamiento algorítmico", pages: 280, year: 2025, description: "Descubre cómo los algoritmos moldean nuestra realidad cotidiana y aprende a pensar como las máquinas que dominan el mundo moderno." },
  { id: 2, level: 1, title: "Código Humano", subtitle: "La intersección entre humanidad y tecnología", pages: 310, year: 2025, description: "Explora la delgada línea entre la creatividad humana y la capacidad computacional en esta fascinante travesía." },
  { id: 3, level: 1, title: "Redes de Poder", subtitle: "Cómo la conectividad redefine el poder", pages: 295, year: 2025, description: "Comprende las estructuras de poder digital que gobiernan nuestras interacciones y decisiones diarias." },
  { id: 4, level: 2, title: "Mentes Sintéticas", subtitle: "Inteligencia artificial y consciencia", pages: 340, year: 2025, description: "Un análisis profundo sobre la evolución de la IA y el debate filosófico sobre la consciencia artificial." },
  { id: 5, level: 2, title: "El Dilema Cuántico", subtitle: "Computación cuántica para la nueva era", pages: 320, year: 2025, description: "Adéntrate en el fascinante mundo de la computación cuántica y sus implicaciones para el futuro." },
  { id: 6, level: 2, title: "Datos Infinitos", subtitle: "Big Data y el destino de la humanidad", pages: 305, year: 2026, description: "Cómo los datos masivos están redefiniendo la ciencia, la medicina y el destino de nuestra especie." },
  { id: 7, level: 3, title: "Singularidad", subtitle: "El punto de no retorno tecnológico", pages: 380, year: 2026, description: "¿Estamos al borde de la singularidad? Un análisis riguroso del momento en que la IA superará al humano." },
  { id: 8, level: 3, title: "Ética Binaria", subtitle: "Moral y valores en la era digital", pages: 350, year: 2026, description: "Los dilemas éticos más urgentes de nuestra era: privacidad, autonomía y derechos en el mundo digital." },
  { id: 9, level: 3, title: "Horizontes Posthumanos", subtitle: "Más allá de los límites biológicos", pages: 370, year: 2026, description: "Transhumanismo, mejoras cognitivas y biotecnología: el siguiente paso en la evolución humana." },
  { id: 10, level: 3, title: "La Civilización Algorítmica", subtitle: "El manifiesto final", pages: 420, year: 2026, description: "La obra cumbre que reúne todas las ideas: una visión completa del mundo que estamos construyendo." },
];

// ---- BUNDLES ----
export const bundles: BundleData[] = [
  { id: "nivel-1", name: "Bundle Nivel I — Iniciación", level: 1, bookIds: [1, 2, 3], price: 49.99, originalPrice: 74.97, color: "#00d4ff" },
  { id: "nivel-2", name: "Bundle Nivel II — Profundización", level: 2, bookIds: [4, 5, 6], price: 59.99, originalPrice: 89.97, color: "#a855f7" },
  { id: "nivel-3", name: "Bundle Nivel III — Trascendencia", level: 3, bookIds: [7, 8, 9, 10], price: 79.99, originalPrice: 119.96, color: "#f97316" },
  { id: "definitive", name: "Definitive Edition — Colección Completa", level: 0, bookIds: [1,2,3,4,5,6,7,8,9,10], price: 149.99, originalPrice: 284.90, color: "#eab308", badge: "MEJOR VALOR" },
];

// ---- COURSES ----
export const courses: CourseData[] = [
  {
    id: "curso-basico",
    title: "Aprendiendo a Trabajar con la IA",
    subtitle: "Domina las herramientas de inteligencia artificial en tu día a día",
    level: "Básico",
    price: 199,
    duration: "8 semanas",
    totalVideos: 17,
    totalHours: 16,
    description: "Curso diseñado para cualquier persona que quiera integrar la inteligencia artificial en su trabajo y vida diaria. Desde prompts efectivos hasta automatizaciones reales.",
    highlights: [
      "Aprende a usar ChatGPT, Claude, Gemini y más",
      "Crea contenido con IA: textos, imágenes, videos",
      "Automatiza tareas repetitivas",
      "Prompt engineering desde cero",
      "Casos prácticos reales",
      "Certificado de finalización",
    ],
    modules: [
      {
        id: "m1", title: "Introducción a la IA",
        videos: [
          { id: "v1", title: "¿Qué es la Inteligencia Artificial?", duration: "12:30", description: "Una visión general del panorama actual de la IA.", materials: [{ name: "Guía de inicio rápido.pdf", size: "2.4 MB" }, { name: "Mapa mental IA.png", size: "1.1 MB" }] },
          { id: "v2", title: "Historia y Evolución de la IA", duration: "18:45", description: "Desde Turing hasta GPT-5: el viaje de la inteligencia artificial.", materials: [{ name: "Timeline IA.pdf", size: "3.2 MB" }] },
          { id: "v3", title: "Tipos de IA y sus Aplicaciones", duration: "15:20", description: "IA débil, fuerte, general: ¿qué significa cada una?", materials: [] },
        ]
      },
      {
        id: "m2", title: "Prompt Engineering Fundamental",
        videos: [
          { id: "v4", title: "¿Qué es un Prompt?", duration: "10:15", description: "Entiende la base de toda interacción con IA generativa.", materials: [{ name: "Plantillas de prompts.pdf", size: "1.8 MB" }] },
          { id: "v5", title: "Anatomía de un Prompt Efectivo", duration: "22:30", description: "Componentes clave para obtener resultados extraordinarios.", materials: [{ name: "Framework CREA.pdf", size: "2.1 MB" }] },
          { id: "v6", title: "Técnicas Avanzadas de Prompting", duration: "25:10", description: "Chain-of-thought, few-shot, role-playing y más.", materials: [{ name: "Cheatsheet prompting.pdf", size: "1.5 MB" }] },
        ]
      },
      {
        id: "m3", title: "Herramientas de IA en la Práctica",
        videos: [
          { id: "v7", title: "ChatGPT: Guía Completa", duration: "30:00", description: "Todo lo que necesitas saber para dominar ChatGPT.", materials: [{ name: "50 prompts para ChatGPT.pdf", size: "2.8 MB" }] },
          { id: "v8", title: "Claude y Gemini: Alternativas Poderosas", duration: "20:45", description: "Conoce las mejores alternativas y cuándo usar cada una.", materials: [] },
          { id: "v9", title: "IA para Imágenes: Midjourney y DALL-E", duration: "28:30", description: "Genera imágenes increíbles con inteligencia artificial.", materials: [{ name: "Guía de estilos visuales.pdf", size: "4.5 MB" }] },
        ]
      },
      {
        id: "m4", title: "Automatización con IA",
        videos: [
          { id: "v10", title: "Introducción a la Automatización", duration: "14:20", description: "¿Qué puedes automatizar y por qué deberías?", materials: [{ name: "Checklist automatización.pdf", size: "1.2 MB" }] },
          { id: "v11", title: "Zapier + IA: Flujos Inteligentes", duration: "26:40", description: "Conecta herramientas de IA con tus apps favoritas.", materials: [] },
          { id: "v12", title: "Make y n8n: Automatización Avanzada", duration: "32:15", description: "Lleva tus automatizaciones al siguiente nivel.", materials: [{ name: "Templates Make.json", size: "0.8 MB" }] },
        ]
      },
      {
        id: "m5", title: "IA para Creación de Contenido",
        videos: [
          { id: "v13", title: "Escritura con IA", duration: "20:00", description: "Blogs, emails, copy: escribe más rápido y mejor.", materials: [{ name: "Templates de escritura.pdf", size: "2.0 MB" }] },
          { id: "v14", title: "Video y Audio con IA", duration: "24:30", description: "Genera y edita contenido multimedia con IA.", materials: [] },
          { id: "v15", title: "Redes Sociales Potenciadas por IA", duration: "18:50", description: "Estrategias para dominar las redes con ayuda de la IA.", materials: [{ name: "Calendario de contenido IA.xlsx", size: "1.3 MB" }] },
        ]
      },
      {
        id: "m6", title: "Proyecto Final y Certificación",
        videos: [
          { id: "v16", title: "Diseña tu Flujo de Trabajo con IA", duration: "15:40", description: "Integra todo lo aprendido en un flujo personalizado.", materials: [{ name: "Template proyecto final.pdf", size: "3.0 MB" }] },
          { id: "v17", title: "Presentación y Evaluación", duration: "10:00", description: "Guía para presentar tu proyecto y obtener el certificado.", materials: [{ name: "Rúbrica de evaluación.pdf", size: "0.9 MB" }] },
        ]
      },
    ],
    generalMaterials: [
      { name: "Glosario completo de IA.pdf", size: "5.2 MB" },
      { name: "Directorio de herramientas IA 2026.pdf", size: "3.8 MB" },
      { name: "Comunidad Discord - Acceso VIP.txt", size: "0.1 MB" },
    ]
  },
  {
    id: "curso-avanzado",
    title: "IA Avanzada: Domina el Futuro",
    subtitle: "Lleva tus habilidades de IA al nivel experto",
    level: "Avanzado",
    price: 599,
    duration: "12 semanas",
    totalVideos: 18,
    totalHours: 32,
    description: "Para profesionales que quieren ir más allá. Aprende a construir soluciones con IA, fine-tuning de modelos, agentes autónomos y estrategias empresariales.",
    highlights: [
      "Fine-tuning de modelos de lenguaje",
      "Construcción de agentes de IA",
      "APIs e integraciones avanzadas",
      "IA para negocios y startups",
      "Proyectos reales end-to-end",
      "Mentoría personalizada incluida",
      "Certificado profesional",
    ],
    modules: [
      {
        id: "am1", title: "Fundamentos Técnicos de LLMs",
        videos: [
          { id: "av1", title: "Arquitectura Transformer Explicada", duration: "35:20", description: "Comprende cómo funcionan los modelos de lenguaje por dentro.", materials: [{ name: "Diagrama Transformer.pdf", size: "4.2 MB" }] },
          { id: "av2", title: "Tokenización y Embeddings", duration: "28:15", description: "La base matemática detrás de cómo la IA entiende el lenguaje.", materials: [{ name: "Notebook tokenización.ipynb", size: "2.1 MB" }] },
          { id: "av3", title: "Atención y Contexto", duration: "30:40", description: "Mecanismo de atención: el corazón de los LLMs modernos.", materials: [] },
        ]
      },
      {
        id: "am2", title: "APIs y Desarrollo con IA",
        videos: [
          { id: "av4", title: "OpenAI API: Guía Completa", duration: "40:00", description: "Desde tu primera llamada hasta producción.", materials: [{ name: "Código fuente módulo 2.zip", size: "8.5 MB" }] },
          { id: "av5", title: "Anthropic, Google y APIs Alternativas", duration: "32:20", description: "Integra múltiples proveedores de IA en tus proyectos.", materials: [] },
          { id: "av6", title: "Construye tu Primer Chatbot", duration: "45:10", description: "Proyecto práctico: chatbot con memoria y personalidad.", materials: [{ name: "Boilerplate chatbot.zip", size: "5.3 MB" }] },
        ]
      },
      {
        id: "am3", title: "Fine-Tuning y RAG",
        videos: [
          { id: "av7", title: "Introducción al Fine-Tuning", duration: "25:30", description: "Cuándo, por qué y cómo hacer fine-tuning.", materials: [{ name: "Dataset ejemplo.jsonl", size: "12.0 MB" }] },
          { id: "av8", title: "RAG: Retrieval Augmented Generation", duration: "38:45", description: "Conecta tus datos con modelos de lenguaje de forma eficiente.", materials: [{ name: "Proyecto RAG completo.zip", size: "15.2 MB" }] },
          { id: "av9", title: "Vectores y Bases de Datos Vectoriales", duration: "30:20", description: "Pinecone, Weaviate, ChromaDB: cuál elegir y cómo usarlos.", materials: [] },
        ]
      },
      {
        id: "am4", title: "Agentes Autónomos",
        videos: [
          { id: "av10", title: "¿Qué son los Agentes de IA?", duration: "22:15", description: "El futuro de la IA: sistemas que actúan de forma autónoma.", materials: [{ name: "Whitepaper agentes.pdf", size: "6.8 MB" }] },
          { id: "av11", title: "LangChain y CrewAI en Profundidad", duration: "42:30", description: "Frameworks para construir agentes potentes.", materials: [{ name: "Ejemplos LangChain.zip", size: "9.4 MB" }] },
          { id: "av12", title: "Multi-Agent Systems", duration: "35:50", description: "Orquesta múltiples agentes para tareas complejas.", materials: [] },
        ]
      },
      {
        id: "am5", title: "IA para Negocios",
        videos: [
          { id: "av13", title: "Estrategia de IA Empresarial", duration: "28:40", description: "Cómo implementar IA en tu empresa o startup.", materials: [{ name: "Framework estratégico.pdf", size: "3.6 MB" }] },
          { id: "av14", title: "Monetización con IA", duration: "32:10", description: "Modelos de negocio basados en inteligencia artificial.", materials: [] },
          { id: "av15", title: "Casos de Éxito y Análisis", duration: "26:20", description: "Empresas que están ganando con IA: qué puedes aprender.", materials: [{ name: "Case studies.pdf", size: "7.2 MB" }] },
        ]
      },
      {
        id: "am6", title: "Proyecto Final Avanzado",
        videos: [
          { id: "av16", title: "Planificación del Proyecto", duration: "18:30", description: "Define y planifica tu proyecto final avanzado.", materials: [{ name: "Guía proyecto final.pdf", size: "4.0 MB" }] },
          { id: "av17", title: "Desarrollo Guiado", duration: "50:00", description: "Sesión de mentoría para el desarrollo de tu proyecto.", materials: [] },
          { id: "av18", title: "Presentación y Certificación", duration: "15:00", description: "Presenta tu proyecto y obtén tu certificado profesional.", materials: [{ name: "Rúbrica avanzada.pdf", size: "1.5 MB" }] },
        ]
      },
    ],
    generalMaterials: [
      { name: "Repositorio GitHub - Todos los ejercicios.txt", size: "0.1 MB" },
      { name: "Guía API Keys y configuración.pdf", size: "2.5 MB" },
      { name: "Recursos adicionales avanzados.pdf", size: "8.3 MB" },
      { name: "Acceso Mentoría 1-on-1 (3 sesiones).txt", size: "0.1 MB" },
    ]
  }
];

// ---- TESTIMONIALS ----
export const testimonials = [
  { name: "María González", role: "Product Manager", avatar: "MG", text: "Los libros de IA Vanguard cambiaron completamente mi perspectiva sobre tecnología. Lectura obligatoria para cualquier profesional.", rating: 5 },
  { name: "Carlos Ruiz", role: "Desarrollador Full Stack", avatar: "CR", text: "El curso básico me dio herramientas prácticas que uso todos los días. ROI increíble por $199.", rating: 5 },
  { name: "Ana Martínez", role: "CEO Startup", avatar: "AM", text: "El curso avanzado es oro puro. Los módulos de agentes y RAG me ayudaron a construir el MVP de mi empresa.", rating: 5 },
  { name: "Diego López", role: "Data Scientist", avatar: "DL", text: "La Definitive Edition es una obra maestra. Cada libro construye sobre el anterior de forma brillante.", rating: 5 },
  { name: "Laura Chen", role: "Marketing Digital", avatar: "LC", text: "Pensé que la IA no era para mí. Después del curso básico, automaticé el 60% de mis tareas diarias.", rating: 5 },
  { name: "Roberto Sánchez", role: "Ingeniero de Software", avatar: "RS", text: "El nivel de profundidad del curso avanzado es impresionante. Vale cada centavo de los $599.", rating: 5 },
];

// ---- FAQ ----
export const faq = [
  { q: "¿Los cursos tienen acceso de por vida?", a: "Sí, una vez que compras un curso tienes acceso ilimitado a todo el contenido, actualizaciones futuras y materiales descargables." },
  { q: "¿Necesito experiencia previa en tecnología?", a: "Para el curso básico, no. Está diseñado para cualquier persona. El curso avanzado requiere conocimientos básicos de programación." },
  { q: "¿Los libros están en formato digital?", a: "Sí, todos los libros están disponibles en PDF y EPUB para que los leas en cualquier dispositivo." },
  { q: "¿Qué incluye la Definitive Edition?", a: "Los 10 libros completos de la colección, material bonus exclusivo y acceso anticipado a futuros volúmenes." },
  { q: "¿Hay garantía de devolución?", a: "Sí, ofrecemos 30 días de garantía de devolución sin preguntas tanto para cursos como para libros." },
  { q: "¿Puedo acceder desde cualquier dispositivo?", a: "Absolutamente. La plataforma es 100% responsiva y funciona en desktop, tablet y móvil." },
];

// ---- HELPERS ----
export function getCourseById(id: string): CourseData | undefined {
  return courses.find(c => c.id === id);
}

export function getBundleById(id: string): BundleData | undefined {
  return bundles.find(b => b.id === id);
}

export function getBooksByLevel(level: number): BookData[] {
  return books.filter(b => b.level === level);
}

export function getBooksByIds(ids: number[]): BookData[] {
  return books.filter(b => ids.includes(b.id));
}

export function getProductPrice(productId: string): number {
  const course = courses.find(c => c.id === productId);
  if (course) return course.price;
  const bundle = bundles.find(b => b.id === productId);
  if (bundle) return bundle.price;
  return 0;
}

export function getProductName(productId: string): string {
  const course = courses.find(c => c.id === productId);
  if (course) return course.title;
  const bundle = bundles.find(b => b.id === productId);
  if (bundle) return bundle.name;
  return productId;
}
