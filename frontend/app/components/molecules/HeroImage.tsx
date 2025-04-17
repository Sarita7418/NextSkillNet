// src/components/molecules/HeroImage.tsx
import React from 'react';
import './HeroImage.css';

const HeroImage: React.FC = () => {
  return (
    <div className="hero-container">
      <img className="hero-image" src="/hero.svg" alt="Banner principal" />
      <div className="hero-overlay">
        <h1>Bienvenido a SkillNet</h1>
        <p>Conectamos talento con oportunidades, impulsamos tu futuro.</p>
      </div>
    </div>
  );
};

export default HeroImage;
