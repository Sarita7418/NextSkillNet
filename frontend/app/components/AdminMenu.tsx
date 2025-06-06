"use client";
import React, { useState } from 'react';
import './AdminMenu.css';
import Personas from './Personas';
import NuevoUAdmin from './NuevoUAdmin';
import Solicitudes from './Solicitudes';
import Empresas from './Empresas';
import EmpresaNuevo from './EmpresaNuevo';

function AdminMenu() {
  const [tab, setTab] = useState<'usuarios' | 'añadir' | 'solicitudes' | 'empresas' | 'añadirEmpresa'>('usuarios');

  return (
    <div className="usuario-menu-container" style={{ display: 'flex', height: '100vh' }}>
      {/* Menú lateral */}
      <aside
        className="usuario-menu"
        style={{
          width: '220px',
          borderRight: '1px solid #ddd',
          padding: '20px',
          boxSizing: 'border-box',
          backgroundColor: '#f8fafc'
        }}
      >
        <nav className="usuario-menu__nav">
          <ul className="usuario-menu__list" style={{ listStyle: 'none', padding: 0 }}>
            {[
              { key: 'usuarios', label: 'Usuarios' },
              { key: 'añadir', label: 'Añadir usuario' },
              { key: 'solicitudes', label: 'Solicitudes representantes' },
              { key: 'empresas', label: 'Empresas' },
              { key: 'añadirEmpresa', label: 'Añadir empresa' }, // NUEVA OPCIÓN
            ].map(({ key, label }) => (
              <li key={key} className="usuario-menu__item" style={{ marginBottom: '10px' }}>
                <button
                  type="button"
                  onClick={() => setTab(key as typeof tab)}
                  style={{
                    width: '100%',
                    padding: '12px 10px',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: tab === key ? '#143D8D' : 'transparent',
                    color: tab === key ? 'white' : '#333',
                    fontWeight: tab === key ? 'bold' : 'normal',
                    textAlign: 'left',
                    transition: 'background 0.3s',
                  }}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Contenido dinámico */}
      <main
        className="usuario-menu-content"
        style={{
          flexGrow: 1,
          padding: '30px',
          overflowY: 'auto',
          backgroundColor: 'white',
        }}
      >
        {tab === 'usuarios' && <Personas />}
        {tab === 'añadir' && <NuevoUAdmin />}
        {tab === 'solicitudes' && <Solicitudes />}
        {tab === 'empresas' && <Empresas />}
        {tab === 'añadirEmpresa' && (
          <EmpresaNuevo/>
        )}
      </main>
    </div>
  );
}

export default AdminMenu;
