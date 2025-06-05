"use client";

import React, { useState } from 'react';
import EnviarArchivo from './organism/EnviarArchivo';
import Resumen from './Resumen';
import Habilidades from './Habilidades';
import Cuenta from './Cuenta';
import ExperienciaLaboral from './organism/ExperianciaLaboral';
import Educacion from './organism/Educacion';

interface UsuarioMenuProps {
  userId: string;
}

const UsuarioMenu: React.FC<UsuarioMenuProps> = ({ userId }) => {
  const [tab, setTab] = useState<
    'resumen' | 'documentos' | 'experiencia' | 'educacion' | 'habilidades' | 'cuenta'
  >('resumen');

  return (
    <div className="usuario-menu-container" style={{ display: 'flex', height: '100vh' }}>
      {/* Menú lateral */}
      <aside
        className="usuario-menu"
        style={{ width: '220px', borderRight: '1px solid #ddd', padding: '20px', boxSizing: 'border-box' }}
      >
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
                    backgroundColor: tab === key ? '#143D8D' : 'transparent',
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
            <Resumen userId={userId} />
          </div>
        )}

        {tab === 'documentos' && (
          <EnviarArchivo />
        )}

        {tab === 'experiencia' && (
          <ExperienciaLaboral />
        )}

        {tab === 'educacion' && (
          <Educacion />
        )}

        {tab === 'habilidades' && (
          <div>
            <Habilidades />
          </div>
        )}

        {tab === 'cuenta' && (
          <div>
            <Cuenta />
          </div>
        )}
      </main>
    </div>
  );
};

export default UsuarioMenu;
