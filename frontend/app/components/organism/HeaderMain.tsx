'use client';

import React from 'react';
import {
  FaHome,
  FaInfoCircle,
  FaBullseye,
  FaStar,
  FaEnvelope
} from 'react-icons/fa';
import './HeaderMain.css';

const HeaderMain: React.FC = () => {

  // Función para hacer scroll suave a la sección
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo pegado a la izquierda */}
        <div className="logo">
          <a href="/Institucional">
            <img
              src="/logo2.svg"
              alt="Logo SkillNet"
            />
          </a>
        </div>

        {/* Navegación con iconos encima del texto */}
        <nav className="nav">
          <ul>
            <li>
              <a href="/Institucional">
                <FaHome className="icon" />
                <span>Inicio</span>
              </a>
            </li>
            <li>
              <button
                type="button"
                className="nav-button"
                onClick={() => scrollToSection('about-container')}
              >
                <FaInfoCircle className="icon" />
                <span>Quienes Somos</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="nav-button"
                onClick={() => scrollToSection('objective-container')}
              >
                <FaBullseye className="icon" />
                <span>Objetivos</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="nav-button"
                onClick={() => scrollToSection('features-skillnet')}
              >
                <FaStar className="icon" />
                <span>Características</span>
              </button>
            </li>
            
          </ul>
        </nav>

        {/* Botones de registro e inicio de sesión */}
        <div className="auth-buttons">
          <a href="/nuevoUsuario" className="btn-register">Registrarse</a>
          <a href="/Login" className="btn-login">Iniciar Sesión</a>
        </div>
      </div>
    </header>
  );
};

export default HeaderMain;
