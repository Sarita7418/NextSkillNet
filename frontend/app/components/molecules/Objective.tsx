// src/components/molecules/Objective.tsx
import React from 'react';
import './Objective.css';

const Objective: React.FC = () => {
  return (
    <section  id="objective-container"className="objective-container">
      <div className="objective-inner">
        {/* Columna izquierda: imagen */}
        <div className="objective-image-column">
          <img src="/obj.svg" alt="Ilustración Objetivo SkillNet" />
        </div>

        {/* Columna derecha: texto centrado */}
        <div className="objective-text-column">
          <h2>Objetivo</h2>
          <p>
            El objetivo principal de SkillNet es digitalizar y simplificar los 
            procesos tradicionales de selección de personal, permitiendo a las 
            empresas publicar convocatorias, gestionar postulaciones y encontrar 
            candidatos adecuados en menos tiempo.
          </p>
          <p>
            Al mismo tiempo, brindamos a los profesionales una manera sencilla de 
            construir su perfil, postular a vacantes y destacar sus habilidades en 
            un entorno cada vez más competitivo.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Objective;