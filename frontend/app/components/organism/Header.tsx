'use client';

import React from 'react';
import { 
  FaHome, 
  FaBell, 
  FaFileAlt, 
  FaCogs, 
  FaUsers 
} from 'react-icons/fa';
import './Header.css';

const Header: React.FC = () => {
  const handleClick = () => {
    window.location.href = "/PerfilUsuario"; // Redirige a la página de Login
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo pegado a la izquierda */}
        <div className="logo">
          <img 
            src="/logo2.svg" 
            alt="Logo SkillNet" 
            onClick={handleClick} // Hacer clic en el logo también muestra el alert
          />
        </div>

        {/* Navegación con iconos encima del texto */}
        <nav className="nav">
          <ul>
            <li>
              <a href="/Inicio" onClick={(e) => { e.preventDefault(); handleClick(); }}>
                <FaHome className="icon" />
                <span>Inicio</span>
              </a>
            </li>
            <li>
              <a href="/notif" onClick={(e) => { e.preventDefault(); handleClick(); }}>
                <FaBell className="icon" />
                <span>Notificaciones</span>
              </a>
            </li>
            <li>
              <a href="/doc" onClick={(e) => { e.preventDefault(); handleClick(); }}>
                <FaFileAlt className="icon" />
                <span>Documentos</span>
              </a>
            </li>
            <li>
              <a href="/admin" onClick={(e) => { e.preventDefault(); handleClick(); }}>
                <FaCogs className="icon" />
                <span>Administración</span>
              </a>
            </li>
            <li>
              <a href="/cont" onClick={(e) => { e.preventDefault(); handleClick(); }}>
                <FaUsers className="icon" />
                <span>Contactos</span>
              </a>
            </li>
          </ul>
        </nav>

        {/* Icono de perfil en círculo */}
        <div className="profile-avatar-container">
          <img 
            src="/user-avatar.png" 
            alt="Perfil de usuario" 
            className="profile-avatar" 
            onClick={handleClick} // Al hacer clic en la imagen también muestra el alert
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
