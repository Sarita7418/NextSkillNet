// src/components/pages/Educacion.tsx
'use client';

import React, { useState } from 'react';
import './Educacion.css'; // Importa el archivo CSS
import { FaGraduationCap, FaAward, FaGlobeAmericas, FaPlus, FaEdit, FaTrashAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa'; // Iconos de React Icons

// Definición de las interfaces para los tipos de educación
interface EstudioGeneral {
  id: string;
  institucion: string;
  titulo: string;
  fechaInicio: string;
  fechaFin: string; // Puede ser 'Actualidad'
  descripcion?: string; // Opcional, para cursos o detalles
  tipoEstudio: 'universidad' | 'maestria' | 'doctorado' | 'tecnico';
}

interface LogroAcademico {
  id: string;
  nombre: string;
  institucionOtorgante?: string;
  fecha?: string;
  descripcion?: string;
  tipoLogro: 'premio' | 'publicacion' | 'beca' | 'curso' | 'certificacion' | 'exterior';
}

const Educacion: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'logros'>('general');
  const [expandedCard, setExpandedCard] = useState<string | null>(null); // Para tarjetas expandibles

  // Datos de ejemplo para educación general
  const [estudios, setEstudios] = useState<EstudioGeneral[]>([
    {
      id: 'e1',
      institucion: 'Universidad Mayor de San Andrés (UMSA)',
      titulo: 'Ingeniería de Sistemas',
      fechaInicio: 'Febrero 2015',
      fechaFin: 'Diciembre 2020',
      descripcion: 'Enfoque en desarrollo de software, bases de datos y redes. Proyecto de tesis sobre sistemas de recomendación con inteligencia artificial.',
      tipoEstudio: 'universidad',
    },
    {
      id: 'e2',
      institucion: 'Universidad Politécnica de Madrid (UPM)',
      titulo: 'Máster en Inteligencia Artificial',
      fechaInicio: 'Septiembre 2022',
      fechaFin: 'Julio 2024',
      descripcion: 'Estudios avanzados en aprendizaje automático, procesamiento de lenguaje natural y visión por computadora. Proyecto final sobre redes neuronales generativas.',
      tipoEstudio: 'maestria',
    },
    {
      id: 'e3',
      institucion: 'Instituto Tecnológico Nacional',
      titulo: 'Técnico Superior en Desarrollo Web',
      fechaInicio: 'Enero 2013',
      fechaFin: 'Diciembre 2014',
      descripcion: 'Formación intensiva en HTML, CSS, JavaScript y frameworks front-end.',
      tipoEstudio: 'tecnico',
    },
  ]);

  // Datos de ejemplo para logros académicos
  const [logros, setLogros] = useState<LogroAcademico[]>([
    {
      id: 'l1',
      nombre: 'Beca de Excelencia Académica',
      institucionOtorgante: 'UMSA',
      fecha: '2020',
      descripcion: 'Otorgada por el rendimiento académico sobresaliente en la carrera de Ingeniería de Sistemas.',
      tipoLogro: 'beca',
    },
    {
      id: 'l2',
      nombre: 'Publicación en Conferencia Internacional de IA',
      institucionOtorgante: 'IEEE Xplore',
      fecha: 'Octubre 2023',
      descripcion: 'Artículo sobre "Optimización de Algoritmos de Machine Learning en Entornos Edge".',
      tipoLogro: 'publicacion',
    },
    {
      id: 'l3',
      nombre: 'Certificación Profesional Google Cloud Architect',
      institucionOtorgante: 'Google',
      fecha: 'Marzo 2023',
      descripcion: 'Validación de habilidades en diseño y despliegue de infraestructuras en la nube de Google Cloud.',
      tipoLogro: 'certificacion',
    },
    {
      id: 'l4',
      nombre: 'Intercambio Académico en Alemania',
      institucionOtorgante: 'Universidad de Múnich',
      fecha: 'Enero - Junio 2018',
      descripcion: 'Semestre de intercambio cursando asignaturas de Inteligencia Artificial y Robótica.',
      tipoLogro: 'exterior',
    },
  ]);

  // Iconos dinámicos para los tipos de estudio/logro
  const getStudyIcon = (type: EstudioGeneral['tipoEstudio']) => {
    switch (type) {
      case 'universidad': return <FaGraduationCap size={20} className="icon-study university" />;
      case 'maestria': return <FaGraduationCap size={20} className="icon-study master" />;
      case 'doctorado': return <FaGraduationCap size={20} className="icon-study doctorate" />;
      case 'tecnico': return <FaGraduationCap size={20} className="icon-study technical" />;
      default: return <FaGraduationCap size={20} className="icon-study default" />;
    }
  };

  const getAchievementIcon = (type: LogroAcademico['tipoLogro']) => {
    switch (type) {
      case 'premio': return <FaAward size={20} className="icon-achievement award" />;
      case 'publicacion': return <FaAward size={20} className="icon-achievement publication" />; // Puedes usar un icono de libro si tienes
      case 'beca': return <FaAward size={20} className="icon-achievement scholarship" />;
      case 'curso': return <FaAward size={20} className="icon-achievement course" />;
      case 'certificacion': return <FaAward size={20} className="icon-achievement certification" />;
      case 'exterior': return <FaGlobeAmericas size={20} className="icon-achievement external" />;
      default: return <FaAward size={20} className="icon-achievement default" />;
    }
  };

  // Función para expandir/colapsar tarjeta
  const toggleExpand = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  // Funciones placeholder para acciones (editar, eliminar, añadir)
  const handleAdd = (type: 'estudio' | 'logro') => {
    alert(`Funcionalidad para añadir ${type} (por implementar)`);
  };
  const handleEdit = (id: string, type: 'estudio' | 'logro') => {
    alert(`Funcionalidad para editar ${type} ${id} (por implementar)`);
  };
  const handleDelete = (id: string, type: 'estudio' | 'logro') => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar este ${type}?`)) {
      if (type === 'estudio') {
        setEstudios(estudios.filter(e => e.id !== id));
      } else {
        setLogros(logros.filter(l => l.id !== id));
      }
      alert(`${type} eliminado.`);
    }
  };

  return (
    <div className="educacion-container">
      <h1 className="educacion-titulo">Mi Educación y Logros</h1>
      <p className="educacion-subtitulo">
        Destaca tu formación académica y tus logros más importantes.
      </p>

      {/* Pestañas de navegación */}
      <div className="tabs-container">
        <button 
          className={`tab-button ${activeTab === 'general' ? 'active' : ''}`}
          onClick={() => setActiveTab('general')}
        >
          <FaGraduationCap /> Estudios Generales
        </button>
        <button 
          className={`tab-button ${activeTab === 'logros' ? 'active' : ''}`}
          onClick={() => setActiveTab('logros')}
        >
          <FaAward /> Logros Académicos y Especiales
        </button>
      </div>

      {/* Contenido de la pestaña activa */}
      <div className="tab-content-wrapper">
        {activeTab === 'general' && (
          <div className="tab-content general-education">
            <button className="btn-add-item" onClick={() => handleAdd('estudio')}>
              <FaPlus /> Añadir Estudio
            </button>
            {estudios.length === 0 ? (
              <p className="no-items">Aún no has añadido estudios. ¡Hazlo ahora!</p>
            ) : (
              <div className="education-grid">
                {estudios.map((estudio) => (
                  <div key={estudio.id} className={`education-card ${expandedCard === estudio.id ? 'expanded' : ''}`}>
                    <div className="card-header">
                      {getStudyIcon(estudio.tipoEstudio)}
                      <div className="header-info">
                        <h3 className="card-title">{estudio.titulo}</h3>
                        <p className="card-subtitle">{estudio.institucion}</p>
                      </div>
                      <div className="card-actions">
                        <button className="btn-action btn-edit" onClick={() => handleEdit(estudio.id, 'estudio')} title="Editar"><FaEdit /></button>
                        <button className="btn-action btn-delete" onClick={() => handleDelete(estudio.id, 'estudio')} title="Eliminar"><FaTrashAlt /></button>
                      </div>
                    </div>
                    <p className="card-dates">{estudio.fechaInicio} - {estudio.fechaFin}</p>
                    {estudio.descripcion && (
                      <div className="card-details">
                        {expandedCard === estudio.id && (
                          <p className="card-description">{estudio.descripcion}</p>
                        )}
                        <button className="btn-expand" onClick={() => toggleExpand(estudio.id)}>
                          {expandedCard === estudio.id ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'logros' && (
          <div className="tab-content academic-achievements">
            <button className="btn-add-item" onClick={() => handleAdd('logro')}>
              <FaPlus /> Añadir Logro
            </button>
            {logros.length === 0 ? (
              <p className="no-items">Aún no has añadido logros. ¡Sé el primero!</p>
            ) : (
              <div className="achievement-grid">
                {logros.map((logro) => (
                  <div key={logro.id} className={`achievement-card ${expandedCard === logro.id ? 'expanded' : ''}`}>
                    <div className="card-header">
                      {getAchievementIcon(logro.tipoLogro)}
                      <div className="header-info">
                        <h3 className="card-title">{logro.nombre}</h3>
                        {(logro.institucionOtorgante || logro.fecha) && (
                          <p className="card-subtitle">
                            {logro.institucionOtorgante}{logro.institucionOtorgante && logro.fecha && ' - '}{logro.fecha}
                          </p>
                        )}
                      </div>
                      <div className="card-actions">
                        <button className="btn-action btn-edit" onClick={() => handleEdit(logro.id, 'logro')} title="Editar"><FaEdit /></button>
                        <button className="btn-action btn-delete" onClick={() => handleDelete(logro.id, 'logro')} title="Eliminar"><FaTrashAlt /></button>
                      </div>
                    </div>
                    {logro.descripcion && (
                      <div className="card-details">
                        {expandedCard === logro.id && (
                          <p className="card-description">{logro.descripcion}</p>
                        )}
                        <button className="btn-expand" onClick={() => toggleExpand(logro.id)}>
                          {expandedCard === logro.id ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Educacion;