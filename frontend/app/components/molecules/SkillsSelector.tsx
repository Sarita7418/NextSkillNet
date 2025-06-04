// components/molecules/SkillsSelector.tsx
'use client';
import React, { useState } from 'react';
import Badge from '../atoms/Badge';
import './SkillsSelector.css';

interface SkillsSelectorProps {
  label: string;
  availableSkills: string[];
  selectedSkills: string[];
  onChange: (skills: string[]) => void;
  disabled?: boolean;
  maxSelections?: number;
  className?: string;
}

const SkillsSelector: React.FC<SkillsSelectorProps> = ({
  label,
  availableSkills,
  selectedSkills,
  onChange,
  disabled = false,
  maxSelections,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSkills = availableSkills.filter(skill =>
    skill.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedSkills.includes(skill)
  );

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      onChange(selectedSkills.filter(s => s !== skill));
    } else if (!maxSelections || selectedSkills.length < maxSelections) {
      onChange([...selectedSkills, skill]);
    }
  };

  const removeSkill = (skill: string) => {
    onChange(selectedSkills.filter(s => s !== skill));
  };

  return (
    <div className={`skills-selector ${className}`}>
      <label className="skills-label">{label}</label>
      
      {selectedSkills.length > 0 && (
        <div className="selected-skills">
          {selectedSkills.map(skill => (
            <Badge
              key={skill}
              variant="primary"
              size="small"
              className="skill-badge"
            >
              {skill}
              <button
                type="button"
                className="remove-skill"
                onClick={() => removeSkill(skill)}
                disabled={disabled}
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      )}

      <div className="skills-dropdown">
        <button
          type="button"
          className="dropdown-trigger"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
        >
          <span>
            {selectedSkills.length > 0 
              ? `${selectedSkills.length} habilidad${selectedSkills.length !== 1 ? 'es' : ''} seleccionada${selectedSkills.length !== 1 ? 's' : ''}`
              : 'Seleccionar habilidades'
            }
          </span>
          <svg 
            className={`dropdown-arrow ${isOpen ? 'open' : ''}`}
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <polyline points="6,9 12,15 18,9"/>
          </svg>
        </button>

        {isOpen && (
          <div className="dropdown-content">
            <div className="search-skills">
              <input
                type="text"
                placeholder="Buscar habilidades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="skills-search"
              />
            </div>
            
            <div className="skills-list">
              {filteredSkills.length > 0 ? (
                filteredSkills.map(skill => (
                  <button
                    key={skill}
                    type="button"
                    className="skill-option"
                    onClick={() => toggleSkill(skill)}
                    disabled={disabled || (maxSelections && selectedSkills.length >= maxSelections)}
                  >
                    {skill}
                  </button>
                ))
              ) : (
                <p className="no-skills">No se encontraron habilidades</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsSelector;