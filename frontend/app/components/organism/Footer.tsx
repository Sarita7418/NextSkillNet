import React from 'react';
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaPhone,
  FaEnvelope,
} from 'react-icons/fa';
import './Footer.css';

const Footer: React.FC = () => (
  <footer className="footer">
    {/* Enlaces superiores */}
    <div className="footer-top">
      <ul className="footer-links">
        <li><a href="/about">Acerca de</a></li>
        <li><a href="/privacy">Política de privacidad</a></li>
        <li><a href="/terms">Condiciones de uso</a></li>
        <li><a href="/accessibility">Accesibilidad</a></li>
      </ul>
    </div>

    {/* Sección inferior */}
    <div className="footer-bottom">
      {/* Redes sociales */}
      <div className="social-section">
        <p>Nuestras redes sociales</p>
        <div className="social-icons">
          <a href="https://facebook.com" aria-label="Facebook"><FaFacebookF /></a>
          <a href="https://instagram.com" aria-label="Instagram"><FaInstagram /></a>
          <a href="https://youtube.com" aria-label="YouTube"><FaYoutube /></a>
        </div>
      </div>

      {/* Contacto */}
      <div className="contact-section">
        <a href="tel:+59177798626">
          <FaPhone className="icon" />
          <span>+591 77798626</span>
        </a>
        <a href="mailto:cybertigres@skillnet.com">
          <FaEnvelope className="icon" />
          <span>cybertigres@skillnet.com</span>
        </a>
      </div>

      {/* Copyright + logo */}
      <div className="copy-section">
        <p>© SkillNet project 2025</p>
        <img src="/logo2.svg" alt="SkillNet" />
      </div>
    </div>
  </footer>
);

export default Footer;
