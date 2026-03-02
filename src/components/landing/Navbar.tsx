"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

const navLinks = [
  { href: "#libros", label: "Libros" },
  { href: "#cursos", label: "Cursos" },
  { href: "#testimonios", label: "Testimonios" },
  { href: "#faq", label: "FAQ" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`} id="navbar">
      <div className="nav-container">
        <Link href="/" className="nav-logo">
          <img src="/images/logo.png" alt="IA Vanguard" style={{ width: 42, height: 42 }} />
          <span className="logo-text">IA Vanguard</span>
        </Link>

        <div className={`nav-links ${mobileOpen ? "active" : ""}`} id="navLinks">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="nav-link"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="nav-actions">
          {session ? (
            <>
              <Link href="/dashboard" className="btn btn-ghost">
                Dashboard
              </Link>
              <button onClick={() => signOut()} className="btn btn-ghost">
                Salir
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="btn btn-ghost">
                Iniciar Sesión
              </Link>
              <Link href="/auth/register" className="btn btn-primary btn-glow">
                Registrarse
              </Link>
            </>
          )}
        </div>

        <button
          className="nav-hamburger"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}
