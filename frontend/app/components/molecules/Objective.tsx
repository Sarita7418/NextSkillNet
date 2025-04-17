// src/components/molecules/Objective.tsx
import React from 'react';
import './Objective.css';

const Objective: React.FC = () => {
  return (
    <section className="objective-container">
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
    </section>
  );
};

export default Objective;
