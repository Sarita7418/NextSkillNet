'use client';

import React, { useEffect, useState } from 'react';
import {
  FaHome,
  FaBell,
  FaBriefcase,
  FaCogs,
  FaUsers
} from 'react-icons/fa';
import './Header.css';

interface PerfilPlano {
  id_usuario: string;
  contrasena: string;
  fecha_registro: string;
  id_persona: string;
  id_rol: string;
  nombre: string;
  apellido: string;
  fecha_nacimiento: string;
  id_genero: string;
  estado_empleado: string;
  correo: string;
}

const Header: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [rol, setRol] = useState('');

  const convertirRol = (rolId: number) => {
    switch (rolId) {
      case 1:
        return 'Usuario';
      case 2:
        return 'Administrador';            // <-- Aquí mapeamos 2 → Administrador
      case 3:
        return 'Representante';            // <-- Y 3 → Representante
      case 4:
        return 'Aspirante a Representante';
      default:
        return 'Desconocido';
    }
  };

  useEffect(() => {
    const storedUsuario = localStorage.getItem('usuario');
    if (!storedUsuario) return;

    const usuarioGuardado = JSON.parse(storedUsuario) as { id_usuario: string };
    const idUsuario = usuarioGuardado.id_usuario;

    fetch(`http://127.0.0.1:8000/usuario/completo/${idUsuario}`)
      .then(res => {
        if (!res.ok) throw new Error('Respuesta no OK');
        return res.json();
      })
      .then((data: PerfilPlano) => {
        setNombre(data.nombre);
        setApellido(data.apellido);
        setRol(convertirRol(Number(data.id_rol)));
      })
      .catch(err => {
        console.error('Error al obtener perfil completo:', err);
      });
  }, []);

  const handlePerfilClick = () => {
    const storedUsuario = localStorage.getItem('usuario');
    if (!storedUsuario) {
      window.location.href = '/PerfilUsuario';
      return;
    }
    const usuarioGuardado = JSON.parse(storedUsuario) as { id_usuario: string };
    window.location.href = `/PerfilUsuario?id=${usuarioGuardado.id_usuario}`;
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
            <li>
              <a href="/Inicio">
                <FaHome className="icon" />
                <span>Inicio</span>
              </a>
            </li>
            <li>
              <a href="/notif">
                <FaBell className="icon" />
                <span>Notificaciones</span>
              </a>
            </li>
            <li>
              <a href="/Candidatos">
                <FaBriefcase className="icon" />
                <span>Candidatos</span>
              </a>
            </li>
            <li>
              <a href="/Administracion">
                <FaCogs className="icon" />
                <span>Administración</span>
              </a>
            </li>
            <li>
              <a href="/cont">
                <FaUsers className="icon" />
                <span>Contactos</span>
              </a>
            </li>
          </ul>
        </nav>

        {/* Perfil */}
        <div
          className="profile-avatar-container"
          onClick={handlePerfilClick}
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <img
            src="/user-avatar.png"
            alt="Perfil de usuario"
            className="profile-avatar"
          />
          <div className="profile-info">
            <strong>
              {nombre} {apellido}
            </strong>
            <span className="rol-text">{rol}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
