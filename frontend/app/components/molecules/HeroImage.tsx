// src/components/molecules/HeroImage.tsx
import React from 'react';
import './HeroImage.css';

const HeroImage: React.FC = () => {
  return (
    <div className="hero-container">
      <img className="hero-image" src="/hero.svg" alt="Banner principal" />
      <div className="hero-overlay">
        <p>Conectamos talento con oportunidades, impulsamos tu futuro.</p>
        <button onClick={() => {
  document.getElementsByClassName('about-container')[0]?.scrollIntoView({ behavior: 'smooth' });
}}>Conoce a Skillnet</button>
      </div>
    </div>
  );
};

export default HeroImage;
