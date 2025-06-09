// app/components/organism/KnnSearch.tsx
'use client';
import React from 'react';
import SkillsSelector from '../molecules/SkillsSelector';
import Button from '../atoms/Button';
import './KnnSearch.css';

interface KnnSearchProps {
  availableSkills: string[];
  selectedSkills: string[];
  onSkillsChange: (skills: string[]) => void;
  onSearch: () => void;
  isLoading: boolean;
}

const KnnSearch: React.FC<KnnSearchProps> = ({
  availableSkills,
  selectedSkills,
  onSkillsChange,
  onSearch,
  isLoading,
}) => {
  return (
    <div className="knn-search-section">
      <h2 className="knn-title">Recomendación por Habilidades (k-NN)</h2>
      <p className="knn-subtitle">Selecciona las habilidades clave que buscas y nuestro modelo de Machine Learning encontrará los perfiles más similares.</p>
      
      <div className="knn-controls">
        <SkillsSelector
          label="Seleccionar Habilidades"
          availableSkills={availableSkills}
          selectedSkills={selectedSkills}
          onChange={onSkillsChange}
          disabled={isLoading}
        />
        <Button
          onClick={onSearch}
          disabled={isLoading || selectedSkills.length === 0}
          className="knn-search-button"
        >
          {isLoading ? 'Buscando...' : 'Obtener Recomendaciones'}
        </Button>
      </div>
    </div>
  );
};

export default KnnSearch;