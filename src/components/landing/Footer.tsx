import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="nav-logo">
              <img src="/images/logo.png" alt="IA Vanguard" style={{ width: 28, height: 28, borderRadius: 6 }} />
              <span className="logo-text">IA Vanguard</span>
            </Link>
            <p>Transformando el futuro a través de la educación en inteligencia artificial.</p>
          </div>
          <div className="footer-col">
            <h4>Productos</h4>
            <a href="#libros">Libros</a>
            <a href="#cursos">Cursos</a>
          </div>
          <div className="footer-col">
            <h4>Recursos</h4>
            <a href="#faq">FAQ</a>
            <a href="#testimonios">Testimonios</a>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <Link href="/terms">Términos</Link>
            <Link href="/privacy">Privacidad</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} IA Vanguard. Todos los derechos reservados.</p>
          <p style={{ marginTop: "0.25rem", fontSize: "0.8rem", opacity: 0.6 }}>
            Razón social: Julio Gómez
          </p>
        </div>
      </div>
    </footer>
  );
}
