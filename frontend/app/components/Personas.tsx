'use client';

import React, { useEffect, useState } from 'react';
import Resumen from './Resumen';
import './Personas.css';

interface Usuario {
  id_usuario: string;        // viene como string
  nombre: string;
  apellido: string;
  correo: string;
  estado_empleado: string;   // "1" o "0"
  rol: string;               // p.ej. "administrador", "postulante", etc.
}

// Mapeo de texto para el rol (ya viene como texto del backend, pero lo capitalizamos)
const mostrarRol = (rol: string) => {
  switch (rol) {
    case 'postulante':
      return 'Postulante';
    case 'administrador':
      return 'Administrador';
    case 'representante':
      return 'Representante';
    case 'aspirante_representante':
      return 'Aspirante a Representante';
    default:
      return 'Desconocido';
  }
};

// Mapeo de estado (string -> texto)
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

function Personas() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

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

  const handleEliminar = async (id: string) => {
    if (!window.confirm('¿Seguro que deseas desactivar este usuario?')) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/admin/eliminar/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('No se pudo desactivar el usuario');
      setUsuarios(prev => prev.filter(u => u.id_usuario !== id));
      alert('Usuario desactivado correctamente.');
    } catch {
      alert('Error al desactivar el usuario');
    }
  };

  const handleEditar = (id: string) => {
    setEditingId(id);
  };

  const handleCancelarEdicion = () => {
    setEditingId(null);
  };

  if (loading) return <p className="cargando">Cargando usuarios…</p>;
  if (error) return <p className="error">{error}</p>;

  // Si editingId NO es null, mostramos el formulario <Resumen> y botón Cancelar
  if (editingId !== null) {
    return (
      <div className="personas-container">
        <h2 className="titulo">Editar usuario</h2>
        <div className="resumen-wrapper">
          {/* Pasamos el userId (string) directamente */}
          <Resumen userId={editingId} />
        </div>
        <button
          className="btn-cancelar"
          onClick={handleCancelarEdicion}
        >
          Cancelar
        </button>
      </div>
    );
  }

  // En caso contrario (editingId===null), mostramos la lista de usuarios
  return (
    <div className="personas-container">
      <h2 className="titulo">Usuarios registrados</h2>
      <div className="usuarios-grid">
        {usuarios.map((usuario, index) => (
          <div key={index + 1} className="usuario-card">
            <h3>
              {usuario.nombre} {usuario.apellido}
            </h3>
            <p><strong>Correo:</strong> {usuario.correo}</p>
            <p><strong>Rol:</strong> {mostrarRol(usuario.rol)}</p>
            <p><strong>Estado:</strong> {mostrarEstado(usuario.estado_empleado)}</p>
            <div className="acciones">
              <button
                className="btn-editar"
                onClick={() => handleEditar(usuario.id_usuario)}
              >
                Editar
              </button>
              <button
                className="btn-toggle"
                onClick={() => handleEliminar(usuario.id_usuario)}
              >
                Desactivar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Personas;
