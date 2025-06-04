// src/components/molecules/DocumentoCard.tsx
import React from 'react';
import { FaFilePdf, FaFileWord, FaImage, FaEye, FaDownload, FaTrashAlt } from 'react-icons/fa';
import './DocumentoCard.css'; // Estilos para este componente

interface DocumentoCardProps {
  id: string;
  nombre: string;
  tipoDocumento: string; // Ej: "Currículum", "Certificación"
  formato: "PDF" | "DOCX" | "Imagen" | string; // Ej: "PDF", "DOCX", "JPG"
  // Opcional: url del documento para descargar/ver
  documentoUrl?: string; 
  onView?: (id: string) => void;
  onDownload?: (id: string, url?: string) => void;
  onDelete?: (id: string) => void;
}

const DocumentoCard: React.FC<DocumentoCardProps> = ({
  id,
  nombre,
  tipoDocumento,
  formato,
  documentoUrl,
  onView,
  onDownload,
  onDelete,
}) => {
  // Función para obtener el icono según el formato
  const getFormatIcon = (format: string) => {
    switch (format.toLowerCase()) {
      case 'pdf': return <FaFilePdf className="icon-pdf" />;
      case 'docx': return <FaFileWord className="icon-docx" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return <FaImage className="icon-image" />;
      default: return <FaFilePdf className="icon-default" />; // Icono por defecto
    }
  };

  return (
    <div className="documento-card">
      <div className="card-icon-info">
        {getFormatIcon(formato)}
        <div className="card-text-info">
          <p className="card-nombre">{nombre}</p>
          <p className="card-details">{tipoDocumento} ({formato})</p>
        </div>
      </div>
      <div className="card-actions">
        {onView && (
          <button className="btn-card-action btn-view" onClick={() => onView(id)} title="Ver Documento">
            <FaEye />
          </button>
        )}
        {onDownload && documentoUrl && (
          <a href={documentoUrl} target="_blank" rel="noopener noreferrer" className="btn-card-action btn-download" title="Descargar Documento">
            <FaDownload />
          </a>
        )}
        {onDelete && (
          <button className="btn-card-action btn-delete" onClick={() => onDelete(id)} title="Eliminar Documento">
            <FaTrashAlt />
          </button>
        )}
      </div>
    </div>
  );
};

export default DocumentoCard;