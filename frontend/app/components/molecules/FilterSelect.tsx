// components/molecules/FilterSelect.tsx
'use client';
import React from 'react';
import './FilterSelect.css';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

const FilterSelect: React.FC<FilterSelectProps> = ({
  label,
  options,
  value,
  onChange,
  disabled = false,
  className = ''
}) => {
  return (
    <div className={`filter-select ${className}`}>
      <label className="filter-label">{label}</label>
      <div className="select-wrapper">
        <select
          className="select-field"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="select-arrow">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6,9 12,15 18,9"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default FilterSelect;