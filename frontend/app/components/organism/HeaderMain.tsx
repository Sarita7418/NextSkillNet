'use client';

import React from 'react';
import { 
  FaHome, 
  FaBell, 
  FaFileAlt, 
  FaCogs, 
  FaUsers 
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
              {/* Link a la home */}
              <a href="/Institucional">
                <FaHome className="icon" />
                <span>Inicio</span>
              </a>
            </li>
            <li>
              {/* Scroll a sección "about-container" */}
              <button 
                type="button"
                className="nav-button"
                onClick={() => scrollToSection('about-container')}
              >
                <FaBell className="icon" />
                <span>Quienes Somos</span>
              </button>
            </li>
            <li>
              {/* Scroll a sección "objective-container" */}
              <button 
                type="button"
                className="nav-button"
                onClick={() => scrollToSection('objective-container')}
              >
                <FaFileAlt className="icon" />
                <span>Objetivos</span>
              </button>
            </li>
            <li>
              {/* Scroll a sección "features-container" */}
              <button 
                type="button"
                className="nav-button"
                onClick={() => scrollToSection('features-skillnet')}
              >
                <FaCogs className="icon" />
                <span>Caracteristicas</span>
              </button>
            </li>
            <li>
              {/* Scroll a sección "footer" */}
              <button 
                type="button"
                className="nav-button"
                onClick={() => scrollToSection('Footer')}
              >
                <FaUsers className="icon" />
                <span>Contactenos</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Icono de perfil en círculo */}
        <div className="profile-avatar-container">
          <a href="/Login">
            <img 
              src="/user-avatar.png" 
              alt="Perfil de usuario" 
              className="profile-avatar"
            />
          </a>
        </div>
      </div>
    </header>
  );
};

export default HeaderMain;
