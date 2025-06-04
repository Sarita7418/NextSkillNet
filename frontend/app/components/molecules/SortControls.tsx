// components/molecules/SortControls.tsx
'use client';
import React from 'react';
import './SortControls.css';

interface SortControlsProps {
  sortBy: 'name' | 'experience' | 'salary' | 'date';
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: 'name' | 'experience' | 'salary' | 'date', sortOrder: 'asc' | 'desc') => void;
  className?: string;
}

const SortControls: React.FC<SortControlsProps> = ({
  sortBy,
  sortOrder,
  onSortChange,
  className = ''
}) => {
  const sortOptions = [
    { value: 'date', label: 'Fecha de registro' },
    { value: 'name', label: 'Nombre' },
    { value: 'experience', label: 'Experiencia' },
    { value: 'salary', label: 'Salario' }
  ];

  const handleSortByChange = (newSortBy: typeof sortBy) => {
    onSortChange(newSortBy, sortOrder);
  };

  const handleSortOrderToggle = () => {
    onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className={`sort-controls ${className}`}>
      <div className="sort-by">
        <label className="sort-label">Ordenar por:</label>
        <select
          className="sort-select"
          value={sortBy}
          onChange={(e) => handleSortByChange(e.target.value as typeof sortBy)}
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        className={`sort-order-btn ${sortOrder}`}
        onClick={handleSortOrderToggle}
        title={sortOrder === 'asc' ? 'Orden ascendente' : 'Orden descendente'}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {sortOrder === 'asc' ? (
            <polyline points="17,11 12,6 7,11"/>
          ) : (
            <polyline points="7,13 12,18 17,13"/>
          )}
        </svg>
      </button>
    </div>
  );
};

export default SortControls;