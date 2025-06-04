// components/organism/StatsCards.tsx
'use client';
import React from 'react';
import './StatsCards.css';

interface StatsCardsProps {
  totalCandidates: number;
  filteredCount: number;
  newThisWeek: number;
}

const StatsCards: React.FC<StatsCardsProps> = ({
  totalCandidates,
  filteredCount,
  newThisWeek
}) => {
  const activeFiltersCount = totalCandidates - filteredCount;
  const newCandidatesPercentage = totalCandidates > 0 
    ? Math.round((newThisWeek / totalCandidates) * 100) 
    : 0;
  
  const filteredPercentage = totalCandidates > 0 
    ? Math.round((filteredCount / totalCandidates) * 100) 
    : 0;

  return (
    <div className="stats-cards">
      <div className="stats-card total-candidates">
        <div className="stats-icon">
          <span className="icon">👥</span>
        </div>
        <div className="stats-content">
          <div className="stats-number">{totalCandidates.toLocaleString()}</div>
          <div className="stats-label">Total de Candidatos</div>
          <div className="stats-description">
            Candidatos registrados en la plataforma
          </div>
        </div>
      </div>

      <div className="stats-card filtered-results">
        <div className="stats-icon">
          <span className="icon">🔍</span>
        </div>
        <div className="stats-content">
          <div className="stats-number">{filteredCount.toLocaleString()}</div>
          <div className="stats-label">Resultados Filtrados</div>
          <div className="stats-description">
            {activeFiltersCount > 0 
              ? `${activeFiltersCount} candidatos filtrados (${filteredPercentage}%)`
              : 'Mostrando todos los candidatos'
            }
          </div>
        </div>
        {activeFiltersCount > 0 && (
          <div className="stats-badge filtered">
            {filteredPercentage}% mostrados
          </div>
        )}
      </div>

      <div className="stats-card new-candidates">
        <div className="stats-icon">
          <span className="icon">✨</span>
        </div>
        <div className="stats-content">
          <div className="stats-number">{newThisWeek.toLocaleString()}</div>
          <div className="stats-label">Nuevos esta Semana</div>
          <div className="stats-description">
            {newThisWeek > 0 
              ? `${newCandidatesPercentage}% del total de candidatos`
              : 'No hay nuevos registros esta semana'
            }
          </div>
        </div>
        {newThisWeek > 0 && (
          <div className="stats-badge new">
            +{newThisWeek} nuevos
          </div>
        )}
      </div>

      <div className="stats-card growth-indicator">
        <div className="stats-icon">
          <span className="icon">📈</span>
        </div>
        <div className="stats-content">
          <div className="stats-number">{newCandidatesPercentage}%</div>
          <div className="stats-label">Crecimiento Semanal</div>
          <div className="stats-description">
            {newCandidatesPercentage > 0
              ? 'Tendencia positiva de registros'
              : 'Sin nuevos registros esta semana'
            }
          </div>
        </div>
        <div className={`stats-trend ${newCandidatesPercentage > 0 ? 'positive' : 'neutral'}`}>
          {newCandidatesPercentage > 0 ? '↗️' : '➡️'}
        </div>
      </div>
    </div>
  );
};

export default StatsCards;