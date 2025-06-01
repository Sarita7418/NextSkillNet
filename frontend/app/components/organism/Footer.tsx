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
    e.preventDefault(); // Prevenir el comportamiento por defecto del enlace
    alert("Para acceder a nuestros servicios debe iniciar sesión.");
    window.location.href = "/Login"; // Redirigir a la página de Login
  };

  return (
    <footer id="Footer" className="Footer">
      <div className="menuFooter">
        <h2>Navegar por Skillnet</h2>
        <div>
          <Link href="/" onClick={handleLinkClick}>
            Inicio
          </Link>
          <Link href="/notificaciones" onClick={handleLinkClick}>
            Notificaciones
          </Link>
          <Link href="/documentos" onClick={handleLinkClick}>
            Documentos
          </Link>
          <Link href="/admin" onClick={handleLinkClick}>
            Administración
          </Link>
        </div>
      </div>

      <div className="generalFooter">
        <div className="AcercaFooter">
          <Link href="/acerca" onClick={handleLinkClick}>
            Acerca de
          </Link>
          <Link href="/privacidad" onClick={handleLinkClick}>
            Política de privacidad
          </Link>
          <Link href="/condiciones" onClick={handleLinkClick}>
            Condiciones de uso
          </Link>
          <Link href="/accesibilidad" onClick={handleLinkClick}>
            Accesibilidad
          </Link>
        </div>

        <div className="Contactos">
          <div className="RedesSociales">
            <p>Nuestras redes sociales</p>
            <div>
              <Image src={facebook} alt="Facebook" />
              <Image src={instagram} alt="Instagram" />
              <Image src={youtube} alt="YouTube" />
            </div>
          </div>

          <div className="TelMail">
            <Image src={telefono} alt="Teléfono" />
            <p>+591 76599447</p>
            <p>Dirección: EMI Irpavi</p>
            <Image src={mail} alt="Correo electrónico" />
            <p>cybertigres@skillnet</p>
          </div>

          <div className="MarcaF">
            <p>© SkillNet project 2025</p>
            <Image src={logo} alt="SkillNet logo" />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
