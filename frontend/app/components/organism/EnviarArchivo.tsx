// src/components/pages/SubirDocumento.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FileInput from '../molecules/SubirArchivo'; // Importa el FileInput
import DocumentoCard from '../molecules/DocumentoCard'; // Importa el DocumentoCard
import './EnviarArchivo.css'; // Estilos para el componente principal

// Interfaz para un documento subido
interface Documento {
  id?: string; // O number si tu backend usa números
  nombre: string;
  url: string;
  estado: string;
  tipoDocumento?: string;
  formato?: string;
}

const SubirDocumento: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [tipoDocumento, setTipoDocumento] = useState<string>("1"); // Inicializar como string
  const [formatoDocumento, setFormatoDocumento] = useState("2"); // Por defecto PDF
  const [documentosSubidos, setDocumentosSubidos] = useState<Documento[]>([]);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedDocumentos = localStorage.getItem('documentosSubidos');
    if (storedDocumentos) {
      setDocumentosSubidos(JSON.parse(storedDocumentos));
    }
  }, []);

  const handleFileUploadCloudinary = async () => {
    if (!selectedFile) {
      alert('Por favor, selecciona un archivo antes de subir.');
      return;
    }

    // const personaId = localStorage.getItem("id_persona");
    // if (!personaId) {
    //   alert("Usuario no autenticado.");
    //   return;
    // }

    setUploading(true);

    try {
      // Preparamos formData para Cloudinary
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("upload_preset", "archivos"); // Reemplaza con tu upload preset
      formData.append("cloud_name", "dhgrcrs94"); // Reemplaza con tu cloud name

      // Llamamos a Cloudinary
      const res = await fetch("https://api.cloudinary.com/v1_1/dhgrcrs94/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.secure_url) {
        const nuevoDocumento: Documento = {
          nombre: selectedFile.name,
          url: data.secure_url, // Usamos la URL de Cloudinary
          estado: "En revisión",
          tipoDocumento: (document.getElementById('tipoDocumentoSelect') as HTMLSelectElement)?.options[(document.getElementById('tipoDocumentoSelect') as HTMLSelectElement)?.selectedIndex].text || 'Desconocido',
          formato: (document.getElementById('formatoDocumentoSelect') as HTMLSelectElement)?.options[(document.getElementById('formatoDocumentoSelect') as HTMLSelectElement)?.selectedIndex].text || 'Desconocido',
        };

        const updatedDocumentos = [...documentosSubidos, nuevoDocumento];
        setDocumentosSubidos(updatedDocumentos);
        localStorage.setItem('documentosSubidos', JSON.stringify(updatedDocumentos));
        alert("Archivo subido correctamente a Cloudinary.");
      } else {
        alert("Error al subir archivo a Cloudinary.");
        console.error("Cloudinary error:", data);
      }
    } catch (error) {
      alert("Error al subir el archivo.");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  // Funciones para las acciones de DocumentoCard
  const handleViewDocument = (url: string) => {
    window.open(url, '_blank');
  };

  const handleDeleteDocument = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este documento?')) {
      const updatedDocumentos = documentosSubidos.filter(doc => doc.id !== id);
      setDocumentosSubidos(updatedDocumentos);
      localStorage.setItem('documentosSubidos', JSON.stringify(updatedDocumentos));
      alert('Documento eliminado correctamente (simulado en frontend).');
      // Aquí también enviarías una solicitud a tu API para eliminar el documento del servidor
    }
  };

  return (
    <div className="subir-documento-container">
      <h1 className="main-title">Gestión de Documentos</h1>
      <p className="subtitle">Sube tus documentos importantes y gestiona los ya existentes.</p>

      {/* Sección de Subida de Nuevo Documento */}
      <div className="upload-section">
        <h2 className="section-title">Subir Nuevo Documento</h2>

        <div className="form-group">
          <label htmlFor="tipoDocumentoSelect" className="form-label">Tipo de documento</label>
          <select
            id="tipoDocumentoSelect"
            className="form-select"
            value={tipoDocumento}
            onChange={(e) => setTipoDocumento(e.target.value)}
          >
            <option value="1">Currículum</option>
            <option value="2">Carta de presentación</option>
            <option value="3">Certificación</option>
            <option value="4">Otro</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="formatoDocumentoSelect" className="form-label">Formato del archivo</label>
          <select
            id="formatoDocumentoSelect"
            className="form-select"
            value={formatoDocumento}
            onChange={(e) => setFormatoDocumento(e.target.value)}
          >
            <option value="1">DOCX</option>
            <option value="2">PDF</option>
            <option value="3">JPG</option>
            <option value="4">PNG</option>
          </select>
        </div>

        <FileInput
          onFileChange={setSelectedFile}
          acceptedFileTypes=".pdf,.docx,.jpg,.jpeg,.png"
          labelText="Arrastra tu archivo aquí o haz clic para seleccionar"
        />

        <button className="btn-upload" onClick={handleFileUploadCloudinary}>
          Subir Documento
        </button>
      </div>

      {/* Sección de Documentos Subidos */}
      <div className="uploaded-docs-section">
        <h2 className="section-title">Mis Documentos Subidos</h2>
        {documentosSubidos.length === 0 ? (
          <p className="no-docs-message">Aún no has subido ningún documento.</p>
        ) : (
          <div className="documentos-list-grid">
            {documentosSubidos.map(doc => (
              <DocumentoCard
                key={doc.id || doc.url}
                id={doc.id || doc.url}
                nombre={doc.nombre}
                tipoDocumento={doc.tipoDocumento || 'Desconocido'}
                formato={doc.formato || 'Desconocido'}
                documentoUrl={doc.url}
                onView={() => handleViewDocument(doc.url)}
                onDownload={() => { /* La descarga se hace directamente con el 'a href' */ }}
                onDelete={handleDeleteDocument}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubirDocumento;