import React from 'react';
import LanguageSkills from './LanguageSkills'; // Importa el nuevo componente de idiomas
import ProfessionalSkills from './ProfessionalSkills'; // Importa el nuevo componente de habilidades profesionales
import './SkillsSection.css'; // Archivo CSS para estilos generales de la sección de habilidades

const SkillsSection: React.FC = () => {
  return (
    <section className="main-skills-section">
      <h2 className="main-skills-title">Mis Habilidades</h2>
      <p className="main-skills-subtitle">
        Una mirada completa a mis competencias, tanto en idiomas como en el ámbito profesional.
      </p>

      <LanguageSkills /> {/* Aquí se renderiza la sección de idiomas */}

      <ProfessionalSkills /> {/* Aquí se renderiza la sección de habilidades profesionales */}
    </section>
  );
};

export default SkillsSection;