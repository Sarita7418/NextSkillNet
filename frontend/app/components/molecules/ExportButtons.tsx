// components/molecules/ExportButtons.tsx
import React from 'react';
import { exportToExcel, exportToPDF } from '../utils/exportUtils';

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

interface ExportButtonsProps {
  candidates: Candidate[];
  isLoading?: boolean;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ candidates, isLoading = false }) => {
  const handleExcelExport = () => {
    if (candidates.length === 0) {
      alert('No hay candidatos para exportar');
      return;
    }
    exportToExcel(candidates);
  };

  const handlePDFExport = () => {
    if (candidates.length === 0) {
      alert('No hay candidatos para exportar');
      return;
    }
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
        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4v12h12V7.414L12.586 4H4zm8 0v3h3l-3-3z"/>
        </svg>
        Excel
      </button>
      
      <button
        onClick={handlePDFExport}
        disabled={isLoading || candidates.length === 0}
        className="export-btn export-btn-pdf"
        title="Exportar a PDF"
      >
        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4v12h12V4H4zm6 10H6v-2h4v2zm4-4H6V8h8v2z"/>
        </svg>
        PDF
      </button>
    </div>
  );
  
};
export default ExportButtons;