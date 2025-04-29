// src/components/molecules/AboutSkillNet.tsx
import React from 'react';
import './AboutSkillNet.css';

const AboutSkillNet: React.FC = () => {
  return (
    <section className="about-container">
      <div className="about-inner">
        {/* Columna izquierda: texto y footer */}
        <div className="about-text-column">
          <h2>¿Quiénes somos?</h2>
          <p>
            SkillNet es una plataforma digital diseñada para transformar y optimizar 
            el proceso de reclutamiento y selección de talento humano. Nuestra misión 
            es conectar empresas con profesionales capacitados a través de un entorno 
            tecnológico.
          </p>
          <p>
            Nacemos como una solución innovadora para hacer más eficiente el proceso 
            de contratación, facilitando el acceso a oportunidades laborales y el 
            reclutamiento de talento con herramientas tecnológicas intuitivas.
          </p>
          <div className="about-text-footer">
            <span className="project-note">© SkillNet project 2025</span>
            <img src="/logo2.svg" alt="Logo SkillNet" className="about-logo" />
          </div>
        </div>

        {/* Columna derecha: imagen */}
        <div className="about-image-column">
          <img src="/Q_somos.svg" alt="Ilustración Quiénes somos" />
        </div>
      </div>
    </section>
  );
};

export default AboutSkillNet;