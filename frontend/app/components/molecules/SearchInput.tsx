// components/molecules/SearchInput.tsx
'use client';
import React from 'react';
import './SearchInput.css';

interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void; // <-- AÑADIDO 1/3
  disabled?: boolean;
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = 'Buscar...',
  value,
  onChange,
  onKeyDown, // <-- AÑADIDO 2/3
  disabled = false,
  className = ''
}) => {
  return (
    <div className={`search-input ${className}`}>
      <div className="search-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
      </div>
      <input
        type="text"
        className="search-field"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown} // <-- AÑADIDO 3/3
        disabled={disabled}
      />
      {value && (
        <button
          type="button"
          className="clear-button"
          onClick={() => onChange('')}
          disabled={disabled}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      )}
    </div>
  );
};

export default SearchInput;