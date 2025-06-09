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
import { FaBriefcase } from "react-icons/fa";

const Header: React.FC = () => {
  const handleClick = () => {
    window.location.href = "/PerfilUsuario";
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo pegado a la izquierda */}
        <div className="logo">
          <img
            src="/logo2.svg"
            alt="Logo SkillNet"
          />
        </div>

        {/* Navegación */}
        <nav className="nav">
          <ul>
            <li>
              <a href="/Inicio" onClick={(e) => { e.preventDefault(); }}>
                <FaHome className="icon" />
                <span>Inicio</span>
              </a>
            </li>
            <li>
              <a href="/notif" onClick={(e) => { e.preventDefault(); }}>
                <FaBell className="icon" />
                <span>Notificaciones</span>
              </a>
            </li>
            <li>
              <a href="/Candidatos" onClick={(e) => { e.preventDefault(); handleClick(); }}>
                <FaBriefcase className="icon" />
                <span>Candidatos</span>
              </a>
            </li>
            <li>
              <a href="/admin" onClick={(e) => { e.preventDefault(); }}>
                <FaCogs className="icon" />
                <span>Administración</span>
              </a>
            </li>
            <li>
              <a href="/cont" onClick={(e) => { e.preventDefault(); }}>
                <FaUsers className="icon" />
                <span>Contactos</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
      {/* Contenedor para la foto de perfil y las opciones */}
      <div className="profile-section">
        <a href="/PerfilUsuario" className="profile-link-expanded">
          <img
            src="/user-avatar.png"
            alt="Perfil de usuario"
            className="profile-avatar-expanded"
          />
          <div className="profile-options-expanded">Más opciones</div>
        </a>
      </div>
    </header>
  );
};

export default Header;