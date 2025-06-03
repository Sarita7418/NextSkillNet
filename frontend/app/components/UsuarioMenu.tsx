"useclient";

import React, { useState } from 'react';
import './UsuarioMenu.css';

function UsuarioMenu() {
  const [tab, setTab] = useState<'resumen' | 'documentos' | 'experiencia' | 'educacion' | 'habilidades' | 'cuenta'>('resumen');

  return (
    <div className="usuario-menu-container" style={{ display: 'flex', height: '100vh' }}>
      {/* Menú lateral */}
      <aside className="usuario-menu" style={{ width: '220px', borderRight: '1px solid #ddd', padding: '20px', boxSizing: 'border-box' }}>
        <div className="usuario-menu__logo">
          <h2>MiApp</h2>
        </div>

        <nav className="usuario-menu__nav">
          <ul className="usuario-menu__list" style={{ listStyle: 'none', padding: 0 }}>
            {[
              { key: 'resumen', label: 'Resumen' },
              { key: 'documentos', label: 'Documentos' },
              { key: 'experiencia', label: 'Experiencia laboral' },
              { key: 'educacion', label: 'Educación' },
              { key: 'habilidades', label: 'Habilidades e idiomas' },
              { key: 'cuenta', label: 'Cuenta' },
            ].map(({ key, label }) => (
              <li key={key} className="usuario-menu__item" style={{ marginBottom: '8px' }}>
                <button
                  type="button"
                  onClick={() => setTab(key as typeof tab)}
                  style={{
                    width: '100%',
                    padding: '12px 10px',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    border: 'none',
                    backgroundColor: tab === key ? '#0078d4' : 'transparent',
                    color: tab === key ? 'white' : '#555',
                    fontWeight: tab === key ? 'bold' : 'normal',
                    textAlign: 'left',
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
        {tab === 'resumen' && (
          <div>
            <h2>Resumen</h2>
            <p>Aquí va la información del resumen...</p>
          </div>
        )}
        {tab === 'documentos' && (
          <div>
            <h2>Documentos</h2>
            <p>Subir y ver documentos.</p>
          </div>
        )}
        {tab === 'experiencia' && (
          <div>
            <h2>Experiencia laboral</h2>
            <p>Historial y gestión de trabajos.</p>
          </div>
        )}
        {tab === 'educacion' && (
          <div>
            <h2>Educación</h2>
            <p>Formación académica y técnica.</p>
          </div>
        )}
        {tab === 'habilidades' && (
          <div>
            <h2>Habilidades e idiomas</h2>
            <p>Gestión de habilidades y lenguas.</p>
          </div>
        )}
        {tab === 'cuenta' && (
          <div>
            <h2>Cuenta</h2>
            <button type="button" style={{ marginRight: 10, padding: '10px 15px' }}>
              Cambiar contraseña
            </button>
            <button
              type="button"
              style={{
                backgroundColor: '#f44336',
                color: 'white',
                padding: '10px 15px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default UsuarioMenu;
