"use client";
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
  return (
    <footer className="Footer">
      <div className="menuFooter">
        <h2>Navegar por Skillnet</h2>
        <div>
          <Link href="/">Inicio</Link>
          <Link href="/notificaciones">Notificaciones</Link>
          <Link href="/documentos">Documentos</Link>
          <Link href="/admin">Administración</Link>
        </div>
      </div>

      <div className="generalFooter">
        <div className="AcercaFooter">
          <Link href="/acerca">Acerca de</Link>
          <Link href="/privacidad">Política de privacidad</Link>
          <Link href="/condiciones">Condiciones de uso</Link>
          <Link href="/accesibilidad">Accesibilidad</Link>
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
