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
  return (
    <header className="header">
      <div className="header-container">
        
        {/* Logo pegado a la izquierda */}
        <div className="logo">
          <img src="/logo2.svg" alt="Logo SkillNet" />
        </div>

        {/* Navegación con iconos encima del texto */}
        <nav className="nav">
          <ul>
            <li>
              <a href="/">
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
              <a href="/doc">
                <FaFileAlt className="icon" />
                <span>Documentos</span>
              </a>
            </li>
            <li>
              <a href="/admin">
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

        {/* Caja de búsqueda a la derecha */}
        <div className="search">
          <input type="text" placeholder="Buscar" />
        </div>

      </div>
    </header>
  );
};

export default Header;
