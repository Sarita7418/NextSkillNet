'use client';

import React, { useEffect, useState } from 'react';
import './Personas.css';

interface Usuario {
  id_usuario: string;
  nombre: string;
  apellido: string;
  correo: string;
  estado_empleado: string;
  rol: string; // Aquí esperamos el id del rol, es decir "4"
}

const mostrarEstado = (estado: string) => {
  switch (estado) {
    case '0':
      return 'Desempleado';
    case '1':
      return 'Empleado';
    default:
      return '';
  }
};

function Solicitudes() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/admin/usuarios');
        if (!res.ok) throw new Error('Error en la respuesta del servidor');
        const data = (await res.json()) as Usuario[];
        setUsuarios(data);
      } catch {
        setError('Error al cargar usuarios');
      } finally {
        setLoading(false);
      }
    };
    fetchUsuarios();
  }, []);

  const handleAprobar = async (id: string) => {
    if (!window.confirm('¿Seguro que quieres aprobar este representante?')) return;
    try {
      const res = await fetch('http://127.0.0.1:8000/admin/aprobar-representante', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario: id, aprobacion: 1 }),
      });
      if (!res.ok) throw new Error('No se pudo aprobar');
      setUsuarios(prev => prev.filter(u => u.id_usuario !== id));
      alert('Usuario aprobado correctamente');
    } catch {
      alert('Error al aprobar usuario');
    }
  };

  const handleRechazar = async (id: string) => {
    if (!window.confirm('¿Seguro que quieres rechazar esta solicitud?')) return;
    try {
      const res = await fetch('http://127.0.0.1:8000/admin/aprobar-representante', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario: id, aprobacion: 0 }),
      });
      if (!res.ok) throw new Error('No se pudo rechazar');
      setUsuarios(prev => prev.filter(u => u.id_usuario !== id));
      alert('Usuario rechazado correctamente');
    } catch {
      alert('Error al rechazar usuario');
    }
  };

  if (loading) return <p className="cargando">Cargando solicitudes…</p>;
  if (error) return <p className="error">{error}</p>;

  // Solo mostrar usuarios con rol "4" (aspirante a representante)
 const solicitudes = usuarios.filter(u => u.rol === "aspirante_representante");


  return (
    <div className="personas-container">
      <h2 className="titulo">Solicitudes de Representante de Empresa</h2>
      {solicitudes.length === 0 ? (
        <p>No hay solicitudes pendientes.</p>
      ) : (
        <div className="usuarios-grid">
          {solicitudes.map((usuario, index) => (
            <div key={usuario.id_usuario} className="usuario-card">
              <h3>{usuario.nombre} {usuario.apellido}</h3>
              <p><strong>Correo:</strong> {usuario.correo}</p>
              <p><strong>Estado:</strong> {mostrarEstado(usuario.estado_empleado)}</p>
              <div className="acciones">
                <button
                  className="btn-editar"
                  style={{ background: "#178E5E" }}
                  onClick={() => handleAprobar(usuario.id_usuario)}
                >
                  Aprobar
                </button>
                <button
                  className="btn-toggle"
                  style={{ background: "#c21a1a" }}
                  onClick={() => handleRechazar(usuario.id_usuario)}
                >
                  Rechazar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Solicitudes;
