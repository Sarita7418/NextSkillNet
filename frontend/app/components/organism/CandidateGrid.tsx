// components/organism/CandidateGrid.tsx
'use client';
import React, { useState } from 'react';
import CandidateCard from '../molecules/CandidateCard';
import SortControls from '../molecules/SortControls';
import Pagination from '../molecules/Pagination';
import EmptyState from '../molecules/EmptyState';
import './CandidateGrid.css';

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

interface CandidateGridProps {
  candidates: Candidate[];
  sortBy: 'name' | 'experience' | 'salary' | 'date';
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: 'name' | 'experience' | 'salary' | 'date', sortOrder: 'asc' | 'desc') => void;
  totalCount: number;
}

const CandidateGrid: React.FC<CandidateGridProps> = ({
  candidates,
  sortBy,
  sortOrder,
  onSortChange,
  totalCount
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);

  // Calcular paginación
  const totalPages = Math.ceil(candidates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCandidates = candidates.slice(startIndex, endIndex);

  const handleCandidateSelect = (candidateId: string) => {
    setSelectedCandidates(prev => 
      prev.includes(candidateId)
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCandidates.length === currentCandidates.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(currentCandidates.map(c => c.id));
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedCandidates([]); // Limpiar selección al cambiar de página
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
    setSelectedCandidates([]);
  };

  if (candidates.length === 0) {
    return (
      <div className="candidate-grid">
        <div className="grid-header">
          <div className="results-info">
            <h2>Candidatos</h2>
            <p>No se encontraron candidatos con los filtros aplicados</p>
          </div>
        </div>
        <EmptyState
          title="No hay candidatos disponibles"
          description="Intenta ajustar los filtros de búsqueda para encontrar más candidatos."
          actionText="Limpiar filtros"
          onAction={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="candidate-grid">
      <div className="grid-header">
        <div className="results-info">
          <h2>Candidatos</h2>
          <p>
            Mostrando {startIndex + 1}-{Math.min(endIndex, candidates.length)} de {candidates.length} candidato{candidates.length !== 1 ? 's' : ''}
            {totalCount !== candidates.length && (
              <span className="filtered-note"> (filtrado de {totalCount} total)</span>
            )}
          </p>
        </div>

        <div className="grid-controls">
          <SortControls
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={onSortChange}
          />
          
          {selectedCandidates.length > 0 && (
            <div className="bulk-actions">
              <span className="selected-count">
                {selectedCandidates.length} seleccionado{selectedCandidates.length !== 1 ? 's' : ''}
              </span>
              <button className="bulk-action-btn export-btn">
                Exportar
              </button>
              <button className="bulk-action-btn contact-btn">
                Contactar
              </button>
            </div>
          )}
        </div>
      </div>

      {currentCandidates.length > 8 && (
        <div className="select-all-row">
          <label className="select-all-checkbox">
            <input
              type="checkbox"
              checked={selectedCandidates.length === currentCandidates.length && currentCandidates.length > 0}
              onChange={handleSelectAll}
            />
            <span className="checkmark"></span>
            Seleccionar todos en esta página
          </label>
        </div>
      )}

      <div className="candidates-grid">
        {currentCandidates.map((candidate) => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            isSelected={selectedCandidates.includes(candidate.id)}
            onSelect={handleCandidateSelect}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="grid-footer">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={candidates.length}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default CandidateGrid;