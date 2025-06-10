// components/molecules/CandidateCard.tsx
'use client';
import React, { useState } from 'react';
import Button from '../atoms/Button';
import Badge from '../atoms/Badge';
import Avatar from '../atoms/Avatar';
import './CandidateCard.css';

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: number;
  skills: string[];
  location: string;
  salary: number;
  availability: 'immediate' | 'two-weeks' | 'one-month';
  education: string;
  profileImage?: string;
  resumeUrl?: string;
  createdAt: Date;
}

interface CandidateCardProps {
  candidate: Candidate;
  isSelected: boolean;
  onSelect: (candidateId: string) => void;
}

const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  isSelected,
  onSelect
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'immediate':
        return 'Inmediata';
      case 'two-weeks':
        return 'Dos semanas';
      case 'one-month':
        return 'Un mes';
      default:
        return 'No especificada';
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'immediate':
        return 'success';
      case 'two-weeks':
        return 'warning';
      case 'one-month':
        return 'info';
      default:
        return 'neutral';
    }
  };

  const formatSalary = (salary: number | null | undefined) => {
  // Si el salario es nulo, indefinido o cero, muestra un texto alternativo
  if (!salary) {
    return 'No especificado'; 
  }
  // Si sí hay un salario, lo formatea correctamente
  return `Bs. ${salary.toLocaleString('es-BO')}`; // Añadimos 'es-BO' para el formato boliviano
};

  const displayedSkills = candidate.skills.slice(0, 3);
  const remainingSkills = candidate.skills.length - 3;

  const handleCardClick = (e: React.MouseEvent) => {
    // No expandir si se hace clic en botones o checkbox
    if ((e.target as HTMLElement).closest('button, input, .card-actions')) {
      return;
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <div 
      className={`candidate-card ${isSelected ? 'selected' : ''} ${isExpanded ? 'expanded' : ''}`}
      onClick={handleCardClick}
    >
      <div className="card-header">
        <div className="card-checkbox-container">
          <input
            type="checkbox"
            className="card-checkbox"
            checked={isSelected}
            onChange={() => onSelect(candidate.id)}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        
        <div className="candidate-info">
          <Avatar
            src={candidate.profileImage}
            name={candidate.name}
            size="medium"
          />
          
          <div className="candidate-details">
            <h3 className="candidate-name">{candidate.name}</h3>
            <p className="candidate-position">{candidate.position}</p>
            <div className="candidate-meta">
              <span className="location">📍 {candidate.location}</span>
              <span className="experience">💼 {candidate.experience} año{candidate.experience !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>

        <div className="card-badges">
          <Badge
            variant={getAvailabilityColor(candidate.availability)}
            size="small"
          >
            {getAvailabilityText(candidate.availability)}
          </Badge>
        </div>
      </div>

      <div className="card-content">
        <div className="skills-section">
          <div className="skills-list">
            {displayedSkills.map((skill, index) => (
              <Badge key={index} variant="outline" size="small">
                {skill}
              </Badge>
            ))}
            {remainingSkills > 0 && (
              <Badge variant="neutral" size="small">
                +{remainingSkills} más
              </Badge>
            )}
          </div>
        </div>

        <div className="salary-info">
          <span className="salary-label">Expectativa salarial:</span>
          <span className="salary-amount">{formatSalary(candidate.salary)}</span>
        </div>

        {isExpanded && (
          <div className="expanded-content">
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <span className="contact-text">{candidate.email}</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📱</span>
                <span className="contact-text">{candidate.phone}</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">🎓</span>
                <span className="contact-text">{candidate.education}</span>
              </div>
            </div>

            {candidate.skills.length > 3 && (
              <div className="all-skills">
                <h4>Todas las habilidades:</h4>
                <div className="skills-grid">
                  {candidate.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" size="small">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="card-actions" onClick={(e) => e.stopPropagation()}>
        <Button
          variant="outline"
          size="small"
          onClick={() => window.open(`mailto:${candidate.email}`)}
        >
          Contactar
        </Button>
        
        <Button
          variant="primary"
          size="small"
          onClick={() => {
            // Aquí iría la lógica para ver el perfil completo
            console.log('Ver perfil:', candidate.id);
          }}
        >
          Ver perfil
        </Button>

        {candidate.resumeUrl && (
          <Button
            variant="secondary"
            size="small"
            onClick={() => window.open(candidate.resumeUrl, '_blank')}
          >
            CV
          </Button>
        )}
      </div>

      <div className="card-footer">
        <span className="registration-date">
          Registrado: {candidate.createdAt.toLocaleDateString()}
        </span>
        <button 
          className="expand-toggle"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
        >
          {isExpanded ? '↑ Menos info' : '↓ Más info'}
        </button>
      </div>
    </div>
  );
};

export default CandidateCard;