// app/components/organism/OnetSearch.tsx
'use client';
import React, { useState } from 'react';
import SearchInput from '../molecules/SearchInput';
import Button from '../atoms/Button';
import './OnetSearch.css';

interface OnetSearchProps {
  onSearch: (cargo: string) => void;
  isLoading: boolean;
}

const OnetSearch: React.FC<OnetSearchProps> = ({ onSearch, isLoading }) => {
  const [cargo, setCargo] = useState('');

  const handleSearch = () => {
    if (!cargo.trim() || isLoading) return;
    onSearch(cargo);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="onet-search-section">
      <h2 className="onet-title">Búsqueda por Perfil Ideal (O*NET)</h2>
      <p className="onet-subtitle">Escribe un cargo profesional (ej. "Software Developer") y la IA buscará a tus candidatos más compatibles según un perfil estándar de la industria.</p>

      <div className="onet-controls">
        <SearchInput
          placeholder="Escribe el cargo a buscar..."
          value={cargo}
          onChange={setCargo}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <Button
          onClick={handleSearch}
          disabled={isLoading || !cargo.trim()}
          className="onet-search-button"
        >
          {isLoading ? 'Analizando...' : 'Buscar Similitud'}
        </Button>
      </div>
    </div>
  );
};

export default OnetSearch;