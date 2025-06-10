'use client';
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'; // Importamos el router para redirigir

// Importa tus iconos
import facebook from "@/public/Subtract.svg";
import instagram from "@/public/Subtract (1).svg";
import youtube from "@/public/Subtract (2).svg";
import telefono from "@/public/call.svg";
import mail from "@/public/email.svg";
import logo from "@/public/logo1 1.svg";

import "./Footer.css";

interface UserSession {
  id_rol: number;
}

function Footer() {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUsuario = localStorage.getItem('usuario');
      if (storedUsuario) {
        const parsedUser = JSON.parse(storedUsuario);
        setSession({ id_rol: Number(parsedUser.id_rol) });
      }
    }
  }, []);

  const handleProtectedLinkClick = (e: React.MouseEvent, requiredRoles: number[], path: string) => {
    e.preventDefault();
    if (session && requiredRoles.includes(session.id_rol)) {
      router.push(path); // Redirige si tiene el rol correcto
    } else {
      alert("No tienes permiso para acceder a esta sección.");
      router.push('/Inicio'); // O redirige a la página de inicio
    }
  };
  
  const scrollToSection = (sectionId: string) => {
    const homeUrl = '/Institucional';
    if (window.location.pathname !== homeUrl) {
      window.location.href = `${homeUrl}#${sectionId}`;
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-main">
          {/* Columna de navegación con lógica de roles */}
          {session && (
            <div className="footer-column">
              <h3 className="footer-title">Navegar por SkillNet</h3>
              <div className="footer-links">
                <Link href="/Inicio" className="footer-link">Inicio</Link>
                <Link href="/Notificaciones" className="footer-link">Notificaciones</Link>
                
                {/* Enlaces protegidos */}
                <a href="/Candidatos" onClick={(e) => handleProtectedLinkClick(e, [2, 3], '/Candidatos')} className="footer-link">Candidatos</a>
                <a href="/Administracion" onClick={(e) => handleProtectedLinkClick(e, [2], '/Administracion')} className="footer-link">Administración</a>
                <a href="/Chats" onClick={(e) => handleProtectedLinkClick(e, [3], '/Chats')} className="footer-link">Chats</a>
              </div>
            </div>
          )}

          {/* Columna de información (siempre visible) */}
          <div className="footer-column">
            <h3 className="footer-title">Información</h3>
            <div className="footer-links">
              <Link href="/Institucional" className="footer-link">Inicio</Link>
              <button type="button" onClick={() => scrollToSection('about-container')} className="footer-link as-button">Quienes Somos</button>
              <button type="button" onClick={() => scrollToSection('objective-container')} className="footer-link as-button">Objetivos</button>
              <button type="button" onClick={() => scrollToSection('features-skillnet')} className="footer-link as-button">Características</button>
            </div>
          </div>

          {/* Columna de contacto (con enlaces funcionales) */}
          <div className="footer-column">
            <h3 className="footer-title">Contacto</h3>
            <div className="footer-contact">
              <a href="https://wa.me/59177798626" target="_blank" rel="noopener noreferrer" className="contact-item">
                <Image src={telefono} alt="WhatsApp" className="contact-icon" />
                <span>+591 77798626</span>
              </a>
              <a href="mailto:cybertigres@skillnet.org?subject=Contacto desde SkillNet" className="contact-item">
                <Image src={mail} alt="Correo" className="contact-icon" />
                <span>cybertigres@skillnet.org</span>
              </a>
              <a href="https://www.google.com/maps/search/?api=1&query=EMI+Irpavi+La+Paz" target="_blank" rel="noopener noreferrer" className="contact-item location">
                <span>📍 EMI Irpavi, La Paz</span>
              </a>
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