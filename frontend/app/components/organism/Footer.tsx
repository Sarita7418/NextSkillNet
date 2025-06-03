'use client';
import Link from "next/link";
import Image from "next/image";
import React from "react";

import facebook from "@/public/Subtract.svg";
import instagram from "@/public/Subtract (1).svg";
import youtube from "@/public/Subtract (2).svg";
import telefono from "@/public/call.svg";
import mail from "@/public/email.svg";
import logo from "@/public/logo1 1.svg";

import "./Footer.css";

function Footer() {
  const handleLinkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    alert("Para acceder a nuestros servicios debe iniciar sesión.");
    window.location.href = "/Login";
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Sección principal del footer */}
        <div className="footer-main">
          {/* Columna de navegación */}
          <div className="footer-column">
            <h3 className="footer-title">Navegar por SkillNet</h3>
            <div className="footer-links">
              <Link href="/" onClick={handleLinkClick} className="footer-link">
                Inicio
              </Link>
              <Link href="/notificaciones" onClick={handleLinkClick} className="footer-link">
                Notificaciones
              </Link>
              <Link href="/can" onClick={handleLinkClick} className="footer-link">
                Candidatos
              </Link>
              <Link href="/admin" onClick={handleLinkClick} className="footer-link">
                Administración
              </Link>
            </div>
          </div>

          {/* Columna de información legal */}
          <div className="footer-column">
            <h3 className="footer-title">Información</h3>
            <div className="footer-links">
              <Link href="/acerca" onClick={handleLinkClick} className="footer-link">
                Acerca de
              </Link>
              <Link href="/privacidad" onClick={handleLinkClick} className="footer-link">
                Política de privacidad
              </Link>
              <Link href="/condiciones" onClick={handleLinkClick} className="footer-link">
                Condiciones de uso
              </Link>
              <Link href="/accesibilidad" onClick={handleLinkClick} className="footer-link">
                Accesibilidad
              </Link>
            </div>
          </div>

          {/* Columna de contacto */}
          <div className="footer-column">
            <h3 className="footer-title">Contacto</h3>
            <div className="footer-contact">
              <div className="contact-item">
                <Image src={telefono} alt="Teléfono" className="contact-icon" />
                <span>+591 76599447</span>
              </div>
              <div className="contact-item">
                <Image src={mail} alt="Correo electrónico" className="contact-icon" />
                <span>cybertigres@skillnet.org</span>
              </div>
              <div className="contact-item location">
                <span>📍 EMI Irpavi</span>
              </div>
            </div>
          </div>

          {/* Columna de redes sociales */}
          <div className="footer-column">
            <h3 className="footer-title">Síguenos</h3>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">
                <Image src={facebook} alt="Facebook" />
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <Image src={instagram} alt="Instagram" />
              </a>
              <a href="#" className="social-link" aria-label="YouTube">
                <Image src={youtube} alt="YouTube" />
              </a>
            </div>
          </div>
        </div>

        {/* Separador */}
        <div className="footer-divider"></div>

        {/* Pie del footer */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            <span>© 2025 SkillNet Project. Todos los derechos reservados.</span>
          </div>
          <div className="footer-logo">
            <Image src={logo} alt="SkillNet logo" className="logo-img" />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;