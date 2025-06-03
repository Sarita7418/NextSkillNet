// src/components/molecules/FileInput.tsx
'use client';

import React, { useState } from 'react';
import { FaFileUpload } from 'react-icons/fa'; // Icono de subir archivo
import './SubirArchivo.css'; // Estilos para este componente

interface FileInputProps {
  onFileChange: (file: File | null) => void;
  acceptedFileTypes?: string; // Por ejemplo: ".pdf,.docx,image/*"
  labelText?: string; // Texto adicional si se desea junto al icono
}

const FileInput: React.FC<FileInputProps> = ({ onFileChange, acceptedFileTypes = ".pdf,.docx,image/*", labelText }) => {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleInternalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFileName(file ? file.name : null);
    onFileChange(file); // Pasar el archivo al componente padre
  };

  return (
    <div className="file-input-wrapper">
      <label htmlFor="custom-file-upload" className="file-input-label">
        <FaFileUpload className="file-upload-icon" />
        <span className="file-input-text">
          {labelText || "Haz clic o arrastra un archivo aquí"}
        </span>
        <span className="file-name-display">
          {fileName ? fileName : "Ningún archivo seleccionado"}
        </span>
        <input
          id="custom-file-upload"
          type="file"
          accept={acceptedFileTypes}
          onChange={handleInternalFileChange}
          className="hidden-file-input"
        />
      </label>
    </div>
  );
};

export default FileInput;