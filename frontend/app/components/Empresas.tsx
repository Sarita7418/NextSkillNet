'use client';

import React, { useEffect, useState } from 'react';
import EmpresasForm from './EmpresasForm';
import './Personas.css';

interface Representante {
  id_persona: string;
  nombre: string;
  apellido: string;
}

interface Empresa {
  id_empresa: string;
  nombre: string;
  area: string;
  ciudad: string;
  representantes: Representante[];
}

function Empresas() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/admin/empresas');
        if (!res.ok) throw new Error('Error en la respuesta del servidor');
        const data: Empresa[] = await res.json();
        setEmpresas(data);
      } catch {
        setError('Error al cargar empresas');
      } finally {
        setLoading(false);
      }
    };
    fetchEmpresas();
  }, []);

  const handleEditar = (id: string) => {
    setEditingId(id);
  };

  const handleCancelarEdicion = () => {
    setEditingId(null);
  };

  if (loading) return <p className="cargando">Cargando empresas…</p>;
  if (error) return <p className="error">{error}</p>;

  if (editingId !== null) {
    const empresa = empresas.find(e => e.id_empresa === editingId);
    if (!empresa) return <p className="error">No se encontró la empresa.</p>;

    return (
      <div className="personas-container">
        <h2 className="titulo">Editar empresa</h2>
        <div className="resumen-wrapper">
          <EmpresasForm
            id_empresa={empresa.id_empresa}
            nombreInicial={empresa.nombre}
            areaInicial={empresa.area}
            ciudadInicial={empresa.ciudad}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="personas-container">
      <h2 className="titulo">Empresas registradas</h2>
      <div className="usuarios-grid">
        {empresas.map((empresa) => (
          <div key={empresa.id_empresa} className="usuario-card">
            <h3>
              {empresa.nombre}
            </h3>
            <p><strong>Área:</strong> {empresa.area}</p>
            <p><strong>Ciudad:</strong> {empresa.ciudad}</p>
            <div>
              <strong>Representantes:</strong>
              {empresa.representantes && empresa.representantes.length > 0 ? (
                <ul>
                  {empresa.representantes.map(rep => (
                    <li key={rep.id_persona}>
                      {rep.nombre} {rep.apellido}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Ninguno</p>
              )}
            </div>
            <div className="acciones">
              <button
                className="btn-editar"
                onClick={() => handleEditar(empresa.id_empresa)}
              >
                Modificar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Empresas;
