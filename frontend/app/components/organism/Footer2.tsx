import React from 'react';
import './Footer2.css';

const Footer2: React.FC = () => (
  <div className="footer2">
    <div className="footer2-column">
      <h4>General</h4>
      <ul>
        <li><a href="/register">Regístrate</a></li>
        <li><a href="/help">Centro de ayuda</a></li>
        <li><a href="/blog">Blog</a></li>
        <li><a href="/jobs">Empleos</a></li>
        <li><a href="/developers">Desarrolladores</a></li>
      </ul>
    </div>
    <div className="footer2-column">
      <h4>Navegar por SkillNet</h4>
      <ul>
        <li><a href="/">Inicio</a></li>
        <li><a href="/notif">Notificaciones</a></li>
        <li><a href="/doc">Documentos</a></li>
        <li><a href="/admin">Administración</a></li>
      </ul>
    </div>
    <div className="footer2-column">
      <h4>Directorios</h4>
      <ul>
        <li><a href="/members">Miembros</a></li>
        <li><a href="/jobs">Empleos</a></li>
        <li><a href="/companies">Empresas</a></li>
        <li><a href="/institutions">Instituciones Educativas</a></li>
        <li><a href="/publications">Publicaciones</a></li>
      </ul>
    </div>
  </div>
);

export default Footer2;
