// src/components/molecules/FeaturesSkillNet.tsx
// src/components/molecules/FeaturesSkillNet.tsx
import React from 'react';
import './FeaturesSkillNet.css';

const FeaturesSkillNet: React.FC = () => {
  return (
    <section className="features-skillnet">
      {/* Columna izquierda: título */}
      <div className="features-left">
        <h2>Algunas de las características más importantes de SkillNet</h2>
      </div>
      
      {/* Columna derecha: tarjetas */}
      <div className="features-right">
        <div className="features-cards">
          <div className="feature-card">
            <h3>Gestión sencilla de convocatorias</h3>
            <img
              src="/icon-gestion.svg"
              alt="Icono gestión de convocatorias"
              className="feature-icon"
            />
            <p>
              Las empresas pueden crear, editar y administrar sus ofertas laborales con filtros, 
              seguimiento de postulantes y visualización clara del proceso.
            </p>
          </div>
          <div className="feature-card">
            <h3>Perfil profesional dinámico</h3>
            <img
              src="/icon-perfil.svg"
              alt="Icono perfil profesional"
              className="feature-icon"
            />
            <p>
              Los usuarios pueden registrar su información, adjuntar currículos y mantener actualizado 
              su perfil para estar siempre visibles a las empresas.
            </p>
          </div>
          <div className="feature-card">
            <h3>Plataforma intuitiva y accesible</h3>
            <img
              src="/icon-pintuitiva.svg"
              alt="Icono plataforma intuitiva"
              className="feature-icon"
            />
            <p>
              SkillNet está diseñada con una interfaz clara y moderna, para garantizar una experiencia de 
              usuario adecuada desde cualquier lugar.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSkillNet;
