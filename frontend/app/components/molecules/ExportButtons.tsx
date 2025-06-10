// app/components/molecules/ExportButtons.tsx
'use client';

import React from 'react';
import { exportToExcel, exportToPDF } from '../utils/exportUtils'; // Importamos desde nuestro nuevo archivo
import type { Candidate } from '@/app/types';

interface ExportButtonsProps {
  candidates: Candidate[];
  isLoading?: boolean;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ candidates, isLoading = false }) => {
  
  // La lógica ahora está encapsulada en las funciones de utilidad
  const handleExcelExport = () => {
    if (candidates.length === 0) return alert('No hay candidatos para exportar');
    exportToExcel(candidates);
  };

  const handlePDFExport = () => {
    if (candidates.length === 0) return alert('No hay candidatos para exportar');
    exportToPDF(candidates);
  };

  return (
    <div className="export-buttons-container flex gap-3">
      <button
        onClick={handleExcelExport}
        disabled={isLoading || candidates.length === 0}
        className="export-btn export-btn-excel"
        title="Exportar a Excel"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H3a1 1 0 01-1-1V3zm2 1v12h12V7.414L12.586 4H4zm8 0v3h3l-3-3z" /></svg>
        Excel
      </button>
      
      <button
        onClick={handlePDFExport}
        disabled={isLoading || candidates.length === 0}
        className="export-btn export-btn-pdf"
        title="Exportar a PDF"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v4.586A1 1 0 0115.414 9.5L11.5 13.414a1 1 0 01-1.414 0L6.586 9.5A1 1 0 016 8.586V4zm6 9.5a.5.5 0 00.5.5h2a.5.5 0 000-1h-2a.5.5 0 00-.5.5z" clipRule="evenodd" /></svg>
        PDF
      </button>
    </div>
  );
};

export default ExportButtons;