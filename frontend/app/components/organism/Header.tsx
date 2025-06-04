'use client';

import React, { useEffect, useState } from 'react';
import {
  FaHome,
  FaBell,
  FaFileAlt,
  FaCogs,
  FaUsers,
  FaBriefcase
} from 'react-icons/fa';
import './Header.css';

const Header: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [rol, setRol] = useState('');

  useEffect(() => {
    const usuarioStr = localStorage.getItem('usuario');
    if (usuarioStr) {
      const usuario = JSON.parse(usuarioStr);
      setNombre(usuario.nombre || '');
      setApellido(usuario.apellido || '');
      setRol(convertirRol(usuario.rol));
    }
  }, []);

  const convertirRol = (rolId: number) => {
    switch (rolId) {
      case 1: return 'Usuario';
      case 2: return 'Representante';
      case 3: return 'Administrador';
      case 4: return 'Aspirante a Representante';
      default: return 'Desconocido';
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo">
          <img src="/logo2.svg" alt="Logo SkillNet" />
        </div>

        {/* Navegación */}
        <nav className="nav">
          <ul>
            <li><a href="/Inicio"><FaHome className="icon" /><span>Inicio</span></a></li>
            <li><a href="/notif"><FaBell className="icon" /><span>Notificaciones</span></a></li>
            <li><a href="/Candidatos"><FaBriefcase className="icon" /><span>Candidatos</span></a></li>
            <li><a href="/admin"><FaCogs className="icon" /><span>Administración</span></a></li>
            <li><a href="/cont"><FaUsers className="icon" /><span>Contactos</span></a></li>
          </ul>
        </nav>

        {/* Perfil */}
        <div className="profile-avatar-container">
          <a href="/PerfilUsuario">
            <img
              src="/user-avatar.png"
              alt="Perfil de usuario"
              className="profile-avatar"
            />
          </a>
          <div className="profile-info">
            <strong>{nombre} {apellido}</strong>
            <span className="rol-text">{rol}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
