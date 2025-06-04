// src/components/pages/ExperienciaLaboral.tsx
'use client'; // Necesario para Next.js si usas hooks de cliente como useState

import React, { useState } from 'react';
import './ExperienciaLaboral.css'; // Importa el archivo CSS

// Definición de la interfaz para una experiencia laboral
interface Experiencia {
  id: string;
  puesto: string;
  empresa: string;
  ubicacion: string;
  fechaInicio: string;
  fechaFin: string; // Puede ser 'Actualidad'
  descripcion: string;
}

const ExperienciaLaboral: React.FC = () => {
  // Estado para almacenar las experiencias laborales
  // Usaremos datos de ejemplo por ahora
  const [experiencias, setExperiencias] = useState<Experiencia[]>([
    {
      id: '1',
      puesto: 'Desarrollador Full Stack',
      empresa: 'Tech Solutions Corp.',
      ubicacion: 'La Paz, Bolivia',
      fechaInicio: 'Enero 2022',
      fechaFin: 'Actualidad',
      descripcion: 'Desarrollo y mantenimiento de aplicaciones web utilizando React, Node.js y MongoDB. Colaboración en el diseño de arquitecturas escalables y la implementación de APIs RESTful. Participación en el ciclo de vida completo del desarrollo de software, desde la conceptualización hasta el despliegue.',
    },
    {
      id: '2',
      puesto: 'Ingeniero de Software Junior',
      empresa: 'Innovatech Labs',
      ubicacion: 'Cochabamba, Bolivia',
      fechaInicio: 'Julio 2020',
      fechaFin: 'Diciembre 2021',
      descripcion: 'Desarrollo de módulos para sistemas de gestión empresarial en Python y Django. Apoyo en la migración de bases de datos y optimización de consultas SQL. Pruebas unitarias y de integración para asegurar la calidad del software.',
    },
    {
      id: '3',
      puesto: 'Practicante de Desarrollo Web',
      empresa: 'Global Digital Agency',
      ubicacion: 'Santa Cruz, Bolivia',
      fechaInicio: 'Marzo 2019',
      fechaFin: 'Junio 2020',
      descripcion: 'Asistencia en la creación de interfaces de usuario con HTML, CSS y JavaScript. Colaboración en proyectos de WordPress y optimización SEO básica. Aprendizaje de metodologías ágiles de desarrollo.',
    },
  ]);

  // Funciones placeholder para añadir/editar/eliminar
  const handleAddExperiencia = () => {
    alert('Funcionalidad para añadir experiencia (por implementar)');
    // Aquí podrías abrir un modal o un formulario
  };

  const handleEditExperiencia = (id: string) => {
    alert(`Funcionalidad para editar experiencia ${id} (por implementar)`);
    // Aquí podrías cargar los datos de la experiencia en un formulario
  };

  const handleDeleteExperiencia = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta experiencia?')) {
      setExperiencias(experiencias.filter(exp => exp.id !== id));
      alert('Experiencia eliminada.');
    }
  };

  return (
    <div className="experiencia-laboral-container">
      <h1 className="experiencia-titulo">Mi Experiencia Laboral</h1>
      <p className="experiencia-subtitulo">
        Muestra tus logros y recorrido profesional.
      </p>

      <button className="btn-agregar-experiencia" onClick={handleAddExperiencia}>
        <span className="icon-plus">+</span> Añadir Nueva Experiencia
      </button>

      <div className="experiencia-lista">
        {experiencias.length === 0 ? (
          <p className="no-experiencias">Aún no has añadido experiencias. ¡Hazlo ahora!</p>
        ) : (
          experiencias.map((exp) => (
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
              <p className="card-fechas">{exp.fechaInicio} - {exp.fechaFin}</p>
              <div className="card-descripcion">
                <h4>Descripción:</h4>
                <p>{exp.descripcion}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExperienciaLaboral;