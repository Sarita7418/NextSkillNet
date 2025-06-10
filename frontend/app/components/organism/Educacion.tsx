'use client';

import React, { useState, useEffect } from 'react';
import './Educacion.css';
import {
  FaGraduationCap, FaPlus, FaEdit, FaTrashAlt, FaChevronDown, FaChevronUp, FaTimes
} from 'react-icons/fa';

interface EducacionBackend {
  id: number;
  fechaInicio: string;         // Cadena de fecha ISO
  fechaFin: string | null;
  institucion: string;
  tipoGrado: string;            // ej: 'Universidad', 'Maestría'
  ocupacion: string;
}

interface EstudioGeneral {
  id: string;
  institucion: string;
  titulo: string; // Asumiendo que 'ocupacion' del backend se mapea a 'titulo' en el frontend por consistencia con lo laboral
  fechaInicio: string;
  fechaFin: string;
  tipoEstudio: 'universidad' | 'maestria' | 'doctorado' | 'tecnico' | 'otro'; // Infiriendo tipos basados en el código anterior
  tipoGradoBackend: string; // Para almacenar el tipoGrado original del backend
  fechaInicioRaw: string;
  fechaFinRaw: string | null;
  descripcion?: string; // Añadiendo descripción para el mock data
}

const mapTipoGradoToTipoEstudio = (tipoGrado: string): EstudioGeneral['tipoEstudio'] => {
  switch (tipoGrado.toLowerCase()) {
    case 'universidad': return 'universidad';
    case 'maestría':
    case 'maestria': return 'maestria';
    case 'doctorado': return 'doctorado';
    case 'técnico':
    case 'tecnico': return 'tecnico';
    default: return 'otro';
  }
};

const formatearFecha = (cadenaFecha: string | null) => {
  if (!cadenaFecha) return 'Actualidad';
  const fecha = new Date(cadenaFecha);
  if (isNaN(fecha.getTime())) return 'Fecha inválida';
  return fecha.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
};

const formatearFechaParaInput = (cadenaFecha: string | null) => {
  if (!cadenaFecha) return '';
  const date = new Date(cadenaFecha);
  if (isNaN(date.getTime())) return '';
  return date.toISOString().split('T')[0];
};

const ID_USUARIO = 1; // Cambia por el ID real del usuario logueado o pásalo por props/context

const Educacion: React.FC = () => {
  const [estudios, setEstudios] = useState<EstudioGeneral[]>([
    {
      id: '1',
      institucion: 'Universidad Mayor de San Andrés',
      titulo: 'Ingeniería de Sistemas',
      fechaInicio: 'agosto de 2015',
      fechaFin: 'diciembre de 2020',
      tipoEstudio: 'universidad',
      tipoGradoBackend: 'Universidad',
      fechaInicioRaw: '2015-08-01',
      fechaFinRaw: '2020-12-31',
      descripcion: 'Graduado con honores. Proyectos destacados en desarrollo web y bases de datos.',
    },
    {
      id: '2',
      institucion: 'Instituto Tecnológico de Massachusetts (MIT)',
      titulo: 'Maestría en Ciencia de la Computación',
      fechaInicio: 'septiembre de 2022',
      fechaFin: 'Actualidad',
      tipoEstudio: 'maestria',
      tipoGradoBackend: 'Maestría',
      fechaInicioRaw: '2022-09-01',
      fechaFinRaw: null,
      descripcion: 'Especialización en Inteligencia Artificial y Machine Learning.',
    },
  ]);
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [tarjetaExpandida, setTarjetaExpandida] = useState<string | null>(null);

  // Estado para formulario (agregar/editar)
  const [formularioAbierto, setFormularioAbierto] = useState(false);
  const [modoFormulario, setModoFormulario] = useState<'add' | 'edit'>('add');
  const [datosFormulario, setDatosFormulario] = useState<Omit<EstudioGeneral, 'id' | 'fechaInicio' | 'fechaFin' | 'tipoGradoBackend' | 'fechaInicioRaw' | 'fechaFinRaw' | 'descripcion'>>({
    institucion: '',
    titulo: '',
    tipoEstudio: 'otro',
  });
  const [datosFechasFormulario, setDatosFechasFormulario] = useState<{ fechaInicio: string; fechaFin: string }>({
    fechaInicio: '',
    fechaFin: '',
  });
  const [descripcionFormulario, setDescripcionFormulario] = useState<string>('');
  const [idEdicion, setIdEdicion] = useState<string | null>(null);

  useEffect(() => {
    // Simulación de carga
    setCargando(true);
    setTimeout(() => {
      setCargando(false);
    }, 1000);
  }, []);

  const toggleExpandir = (id: string) => {
    setTarjetaExpandida(tarjetaExpandida === id ? null : id);
  };

  // --- Formulario controlado ---

  const abrirFormularioAgregar = () => {
    setModoFormulario('add');
    setDatosFormulario({
      institucion: '',
      titulo: '',
      tipoEstudio: 'otro',
    });
    setDatosFechasFormulario({
      fechaInicio: '',
      fechaFin: '',
    });
    setDescripcionFormulario('');
    setIdEdicion(null);
    setFormularioAbierto(true);
  };

  const abrirFormularioEditar = (id: string) => {
    const estudio = estudios.find(e => e.id === id);
    if (!estudio) return alert('Estudio no encontrado');

    setModoFormulario('edit');
    setIdEdicion(id);
    setDatosFormulario({
      institucion: estudio.institucion,
      titulo: estudio.titulo,
      tipoEstudio: estudio.tipoEstudio,
    });
    setDatosFechasFormulario({
      fechaInicio: formatearFechaParaInput(estudio.fechaInicioRaw),
      fechaFin: formatearFechaParaInput(estudio.fechaFinRaw),
    });
    setDescripcionFormulario(estudio.descripcion || '');
    setFormularioAbierto(true);
  };

  const manejarCambioFormulario = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDatosFormulario(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const manejarCambioFecha = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDatosFechasFormulario(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const manejarCambioDescripcion = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescripcionFormulario(e.target.value);
  };

  const manejarEnvioFormulario = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!datosFormulario.titulo || !datosFormulario.institucion || !datosFechasFormulario.fechaInicio) {
      return alert('Título, Institución y Fecha de Inicio son obligatorios');
    }

    const nuevoEstudio: EstudioGeneral = {
      id: modoFormulario === 'add' ? Date.now().toString() : idEdicion!,
      institucion: datosFormulario.institucion,
      titulo: datosFormulario.titulo,
      fechaInicio: formatearFecha(datosFechasFormulario.fechaInicio),
      fechaFin: formatearFecha(datosFechasFormulario.fechaFin),
      tipoEstudio: datosFormulario.tipoEstudio,
      tipoGradoBackend: datosFormulario.tipoEstudio.charAt(0).toUpperCase() + datosFormulario.tipoEstudio.slice(1), // Simulación
      fechaInicioRaw: datosFechasFormulario.fechaInicio,
      fechaFinRaw: datosFechasFormulario.fechaFin,
      descripcion: descripcionFormulario,
    };

    if (modoFormulario === 'add') {
      setEstudios(prev => [...prev, nuevoEstudio]);
    } else if (modoFormulario === 'edit' && idEdicion) {
      setEstudios(prev => prev.map(estudio =>
        estudio.id === idEdicion ? nuevoEstudio : estudio
      ));
    }

    setFormularioAbierto(false);
  };

  const manejarEliminar = (id: string) => {
    if (!confirm('¿Seguro que quieres eliminar este estudio?')) return;
    setEstudios(prev => prev.filter(estudio => estudio.id !== id));
  };

  const obtenerIdTipoGrado = (tipoEstudio: EstudioGeneral['tipoEstudio']): number => {
    switch (tipoEstudio) {
      case 'universidad': return 1;
      case 'maestria': return 2;
      case 'doctorado': return 3;
      case 'tecnico': return 4;
      case 'otro': return 5;
      default: return 0;
    }
  };

  return (
    <div className="educacion-container">
      <h1 className="educacion-titulo">Mi Educación</h1>
      {cargando && <p>Cargando datos...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {!cargando && !error && (
        <>
          <button className="btn-add-item" onClick={abrirFormularioAgregar}>
            <FaPlus /> Añadir Estudio
          </button>

          {estudios.length === 0 ? (
            <p className="no-items">No tienes estudios registrados.</p>
          ) : (
            <div className="education-grid">
              {estudios.map(estudio => (
                <div
                  key={estudio.id}
                  className={`education-card ${tarjetaExpandida === estudio.id ? 'expanded' : ''}`}
                >
                  <div className="card-header">
                    <FaGraduationCap
                      size={20}
                      className={`icon-study ${estudio.tipoEstudio}`}
                    />
                    <div className="header-info">
                      <h3 className="card-title">{estudio.titulo}</h3>
                      <p className="card-subtitle">{estudio.institucion}</p>
                    </div>
                    <div className="card-actions">
                      <button
                        className="btn-action btn-edit"
                        onClick={() => abrirFormularioEditar(estudio.id)}
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn-action btn-delete"
                        onClick={() => manejarEliminar(estudio.id)}
                        title="Eliminar"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </div>
                  <p className="card-dates">{estudio.fechaInicio} - {estudio.fechaFin}</p>
                  {estudio.descripcion && (
                    <div className="card-details">
                      {tarjetaExpandida === estudio.id && (
                        <p className="card-description">{estudio.descripcion}</p>
                      )}
                      <button
                        className="btn-expand"
                        onClick={() => toggleExpandir(estudio.id)}
                        aria-label={tarjetaExpandida === estudio.id ? 'Colapsar detalles' : 'Expandir detalles'}
                      >
                        {tarjetaExpandida === estudio.id ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {formularioAbierto && (
            <div className="modal-form">
              <div className="modal-content">
                <h2>{modoFormulario === 'add' ? 'Añadir Estudio' : 'Editar Estudio'}</h2>
                <form onSubmit={manejarEnvioFormulario}>
                  <label>
                    Institución*:
                    <input
                      type="text"
                      name="institucion"
                      value={datosFormulario.institucion || ''}
                      onChange={manejarCambioFormulario}
                      required
                    />
                  </label>
                  <label>
                    Título*:
                    <input
                      type="text"
                      name="titulo"
                      value={datosFormulario.titulo || ''}
                      onChange={manejarCambioFormulario}
                      required
                    />
                  </label>
                  <label>
                    Fecha Inicio*:
                    <input
                      type="date"
                      name="fechaInicio"
                      value={datosFechasFormulario.fechaInicio || ''}
                      onChange={manejarCambioFecha}
                      required
                    />
                  </label>
                  <label>
                    Fecha Fin:
                    <input
                      type="date"
                      name="fechaFin"
                      value={datosFechasFormulario.fechaFin || ''}
                      onChange={manejarCambioFecha}
                    />
                  </label>
                  <label>
                    Tipo de Estudio:
                    <select
                      name="tipoEstudio"
                      value={datosFormulario.tipoEstudio}
                      onChange={manejarCambioFormulario}
                    >
                      <option key="universidad" value="universidad">Universidad</option>
                      <option key="maestria" value="maestria">Maestría</option>
                      <option key="doctorado" value="doctorado">Doctorado</option>
                      <option key="tecnico" value="tecnico">Técnico</option>
                      <option key="otro" value="otro">Otro</option>
                    </select>
                  </label>
                  <label>
                    Descripción:
                    <textarea
                      name="descripcion"
                      value={descripcionFormulario}
                      onChange={manejarCambioDescripcion}
                    />
                  </label>
                  <div className="form-buttons">
                    <button type="submit" disabled={cargando}>
                      {modoFormulario === 'add' ? 'Agregar' : 'Guardar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormularioAbierto(false)}
                      disabled={cargando}
                    >
                      Cancelar <FaTimes />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Educacion;