"use client";

import React, { useEffect, useState } from 'react';
import './Personas.css';

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  rol: number; // ahora es entero
  estado_empleado: number; // ahora es entero
}

// Mapeo para mostrar el nombre del rol
const nombreRol = (rolId: number) => {
  switch (rolId) {
    case 1: return 'Usuario';
    case 2: return 'Representante';
    case 3: return 'Administrador';
    case 4: return 'Aspirante Representante';
    default: return 'Desconocido';
  }
};

// Mapeo para mostrar el estado
const nombreEstado = (estado: number) => {
  return estado === 1 ? 'Activo' : 'Inactivo';
};

function Personas() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/admin/usuarios');
        if (!res.ok) throw new Error('Error en la respuesta del servidor');
        const data = await res.json();
        setUsuarios(data);
      } catch (err) {
        setError('Error al cargar usuarios');
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  const handleToggleEstado = async (id: number, estadoActual: number) => {
    const nuevoEstado = estadoActual === 1 ? 0 : 1;
    try {
      await fetch(`http://127.0.0.1:8000/admin/usuarios/${id}/estado`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado_empleado: nuevoEstado })
      });
      setUsuarios(prev =>
        prev.map(u =>
          u.id === id ? { ...u, estado_empleado: nuevoEstado } : u
        )
      );
    } catch {
      alert('Error al actualizar estado');
    }
  };

  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="personas-container">
      <h2 className="titulo">Usuarios registrados</h2>
      <div className="usuarios-grid">
        {usuarios.map(usuario => (
          <div key={usuario.id} className="usuario-card">
            <h3>{usuario.nombre} {usuario.apellido}</h3>
            <p><strong>Correo:</strong> {usuario.correo}</p>
            <p><strong>Rol:</strong> {nombreRol(usuario.rol)}</p>
            <p><strong>Estado:</strong> {nombreEstado(usuario.estado_empleado)}</p>
            <div className="acciones">
              <button className="btn-editar" onClick={() => alert('Editar usuario')}>
                Editar
              </button>
              <button
                className="btn-toggle"
                onClick={() => handleToggleEstado(usuario.id, usuario.estado_empleado)}
              >
                {usuario.estado_empleado === 1 ? 'Deshabilitar' : 'Habilitar'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Personas;
