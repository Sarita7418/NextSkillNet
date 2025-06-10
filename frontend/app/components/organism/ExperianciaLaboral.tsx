// src/components/pages/ExperienciaLaboral.tsx
'use client';

import React, { useState, useEffect } from 'react';
import './ExperienciaLaboral.css';

interface Experiencia {
  id: string;
  puesto: string;
  empresa: string;
  ubicacion: string;
  fechaInicio: string;
  fechaFin: string;
  descripcion: string;
}

const ExperienciaLaboral: React.FC = () => {
  const [experiencias, setExperiencias] = useState<Experiencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<{ id_usuario: number } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingExperiencia, setEditingExperiencia] = useState<Experiencia | null>(null);
  const [newExperiencia, setNewExperiencia] = useState<Omit<Experiencia, 'id'>>({
    puesto: '',
    empresa: '',
    ubicacion: '',
    fechaInicio: '',
    fechaFin: '',
    descripcion: '',
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const u = localStorage.getItem('usuario');
      const storedExperiencias = localStorage.getItem('experiencias_laborales');
      if (u) {
        try {
          const userParsed = JSON.parse(u);
          setUsuario(userParsed);
          console.log('Usuario cargado en ExperienciaLaboral:', userParsed);
        } catch (error) {
          console.error('Error parseando usuario desde localStorage:', error);
        }
      }
      if (storedExperiencias) {
        try {
          setExperiencias(JSON.parse(storedExperiencias));
          setLoading(false);
        } catch (error) {
          console.error('Error parseando experiencias desde localStorage:', error);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (!usuario?.id_usuario) return;

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    setLoading(true);
    setError(null);

    fetch(`${API_URL}/usuario/${usuario.id_usuario}/experiencias-laborales`, {
      credentials: 'include',
      headers: { Accept: 'application/json' },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error al cargar experiencias: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const nuevasExperiencias = data.map((exp: any) => ({
          id: exp.id.toString(),
          puesto: exp.puesto || '',
          empresa: exp.empresa || '',
          ubicacion: exp.ubicacion || '',
          fechaInicio: exp.fechaInicio || '',
          fechaFin: exp.fechaFin || '',
          descripcion: exp.descripcion || '',
        }));
        setExperiencias(nuevasExperiencias);
        localStorage.setItem('experiencias_laborales', JSON.stringify(nuevasExperiencias));
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [usuario?.id_usuario]);

  // Sincronización localStorage entre pestañas
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'experiencias_laborales' && e.newValue) {
        try {
          const nuevas = JSON.parse(e.newValue);
          setExperiencias(nuevas);
        } catch (e) {
          console.error('Error al sincronizar localStorage:', e);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewExperiencia((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddExperiencia = () => {
    setEditingId(null);
    setEditingExperiencia(null);
    setNewExperiencia({ puesto: '', empresa: '', ubicacion: '', fechaInicio: '', fechaFin: '', descripcion: '' });
    setShowModal(true);
  };

  const handleEditExperiencia = (id: string) => {
    setEditingId(id);
    const expToEdit = experiencias.find((exp) => exp.id === id) || null;
    setEditingExperiencia(expToEdit);
    if (expToEdit) {
      setNewExperiencia({
        puesto: expToEdit.puesto,
        empresa: expToEdit.empresa,
        ubicacion: expToEdit.ubicacion,
        fechaInicio: expToEdit.fechaInicio,
        fechaFin: expToEdit.fechaFin,
        descripcion: expToEdit.descripcion,
      });
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setEditingExperiencia(null);
  };

  const handleSaveExperiencia = () => {
    if (!usuario?.id_usuario) {
      alert('Usuario no autenticado.');
      return;
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId
      ? `${API_URL}/usuario/${usuario.id_usuario}/experiencias-laborales/${editingId}`
      : `${API_URL}/usuario/${usuario?.id_usuario}/experiencias-laborales`;

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(newExperiencia),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(err.message || `Error al guardar experiencia: ${response.status}`);
          });
        }
        return response.json();
      })
      .then((data) => {
        let nuevas: Experiencia[];
        if (editingId) {
          nuevas = experiencias.map((exp) =>
            exp.id === editingId ? { ...exp, ...newExperiencia } : exp
          );
          setExperiencias(nuevas);
          alert('Experiencia laboral actualizada correctamente.');
        } else {
          const nuevaExpConId = { ...newExperiencia, id: data.experiencia.id.toString() };
          nuevas = [...experiencias, nuevaExpConId];
          setExperiencias(nuevas);
          alert('Experiencia laboral añadida correctamente.');
        }
        localStorage.setItem('experiencias_laborales', JSON.stringify(nuevas));
        handleCloseModal();
      })
      .catch((error) => {
        alert(error.message);
        console.error('Error al guardar/actualizar experiencia:', error);
      });
  };

  const handleDeleteExperiencia = (id: string) => {
    if (!usuario?.id_usuario) {
      alert('Usuario no autenticado.');
      return;
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    fetch(`${API_URL}/usuario/${usuario.id_usuario}/experiencias-laborales/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(err.message || `Error al eliminar experiencia: ${response.status}`);
          });
        }
        return response.json();
      })
      .then(() => {
        const nuevas = experiencias.filter((exp) => exp.id !== id);
        setExperiencias(nuevas);
        alert('Experiencia eliminada correctamente.');
        localStorage.setItem('experiencias_laborales', JSON.stringify(nuevas));
      })
      .catch((error) => {
        alert(error.message);
        console.error('Error al eliminar experiencia:', error);
      });
  };

  return (
    <div className="experiencia-laboral-container">
      <h1 className="experiencia-titulo">Mi Experiencia Laboral</h1>
      <p className="experiencia-subtitulo">Muestra tus logros y recorrido profesional.</p>

      <button className="btn-agregar-experiencia" onClick={handleAddExperiencia}>
        <span className="icon-plus">+</span> Añadir Nueva Experiencia
      </button>

      {showModal && (
        <ExperienciaLaboralFormModal
          experiencia={editingExperiencia}
          onSave={handleSaveExperiencia}
          onClose={handleCloseModal}
          formData={newExperiencia}
          onChange={handleInputChange}
        />
      )}

      <div className="experiencia-lista">
        {loading && <p>Cargando experiencias...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && !error && experiencias.length === 0 && (
          <p className="no-experiencias">Aún no has añadido experiencias. ¡Hazlo ahora!</p>
        )}
        {experiencias.map((exp) => (
          <div key={exp.id} className="experiencia-card">
            <div className="card-header">
              <h3 className="card-puesto">{exp.puesto}</h3>
              <div className="card-actions">
                <button
                  className="btn-accion btn-editar"
                  onClick={() => handleEditExperiencia(exp.id)}
                  title="Editar Experiencia"
                >
                  ✏️
                </button>
                <button
                  className="btn-accion btn-eliminar"
                  onClick={() => handleDeleteExperiencia(exp.id)}
                  title="Eliminar Experiencia"
                >
                  🗑️
                </button>
              </div>
            </div>
            <p className="card-empresa">{exp.empresa}</p>
            <p className="card-ubicacion">{exp.ubicacion}</p>
            <p className="card-fechas">{exp.fechaInicio} - {exp.fechaFin || 'Actualidad'}</p>
            <div className="card-descripcion">
              <h4>Descripción:</h4>
              <p>{exp.descripcion}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface ModalProps {
  experiencia: Experiencia | null;
  formData: Omit<Experiencia, 'id'>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSave: () => void;
  onClose: () => void;
}

const ExperienciaLaboralFormModal: React.FC<ModalProps> = ({
  experiencia,
  formData,
  onChange,
  onSave,
  onClose,
}) => {
  const [trabajaActualmente, setTrabajaActualmente] = React.useState(formData.fechaFin === '');

  const handleActualmenteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setTrabajaActualmente(checked);
    if (checked) {
      onChange({
        target: {
          name: 'fechaFin',
          value: '',
        },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{experiencia ? 'Editar Experiencia Laboral' : 'Añadir Experiencia Laboral'}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave();
          }}
        >
          <label>
            Puesto:
            <input
              type="text"
              name="puesto"
              value={formData.puesto}
              onChange={onChange}
              required
              autoFocus
            />
          </label>

          <label>
            Empresa:
            <input type="text" name="empresa" value={formData.empresa} onChange={onChange} required />
          </label>

          <label>
            Ubicación:
            <input
              type="text"
              name="ubicacion"
              value={formData.ubicacion}
              onChange={onChange}
              required
            />
          </label>

          <label>
            Fecha Inicio:
            <input
              type="date"
              name="fechaInicio"
              value={formData.fechaInicio}
              onChange={onChange}
              required
            />
          </label>

          <label>
            Fecha Fin:
            <input
              type="date"
              name="fechaFin"
              value={trabajaActualmente ? '' : formData.fechaFin}
              onChange={onChange}
              disabled={trabajaActualmente}
              required={!trabajaActualmente}
            />
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={trabajaActualmente}
              onChange={handleActualmenteChange}
            />
            Actualmente trabajo aquí
          </label>

          <label>
            Descripción:
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={onChange}
              rows={4}
              required
            />
          </label>

          <div className="modal-buttons">
            <button type="submit" className="btn-guardar">
              Guardar
            </button>
            <button type="button" className="btn-cancelar" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExperienciaLaboral;
