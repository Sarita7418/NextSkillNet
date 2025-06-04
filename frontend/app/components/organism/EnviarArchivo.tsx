// src/components/pages/SubirDocumento.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import FileInput from '../molecules/SubirArchivo'; // Importa el nuevo FileInput
import DocumentoCard from '../molecules/DocumentoCard'; // Importa el nuevo DocumentoCard
import './EnviarArchivo.css'; // Estilos para el componente principal

// Interfaz para un documento subido (simulado)
interface DocumentoSubido {
  id: string;
  nombre: string;
  tipoDocumento: string; // Ej: "Currículum"
  formato: "PDF" | "DOCX" | "Imagen" | string; // Ej: "PDF"
  url: string; // URL simulada para descarga/vista
}

const SubirDocumento: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [tipoDocumento, setTipoDocumento] = useState("1"); // Por defecto Currículum
  const [formatoDocumento, setFormatoDocumento] = useState("2"); // Por defecto PDF

  // Estado para la lista de documentos que ya están "subidos"
  const [documentosSubidos, setDocumentosSubidos] = useState<DocumentoSubido[]>([
    // Datos de ejemplo para simular documentos ya subidos
    { id: 'doc1', nombre: 'Mi_Curriculum_2024.pdf', tipoDocumento: 'Currículum', formato: 'PDF', url: '/docs/cv.pdf' },
    { id: 'doc2', nombre: 'Carta_Presentacion_EmpresaX.docx', tipoDocumento: 'Carta de Presentación', formato: 'DOCX', url: '/docs/carta.docx' },
    { id: 'doc3', nombre: 'Certificado_Ingles.png', tipoDocumento: 'Certificación', formato: 'Imagen', url: '/docs/certificado.png' },
  ]);

  const router = useRouter();

  const handleFileUpload = async () => {
    const id_persona = localStorage.getItem("id_persona");

    if (!id_persona) {
      alert("Usuario no autenticado. Inicia sesión para continuar.");
      router.push('/Login');
      return;
    }

    if (!selectedFile) {
      alert('Por favor, selecciona un archivo antes de subir.');
      return;
    }

    // Preparar formData para la API
    const formData = new FormData();
    formData.append("cv", selectedFile);
    formData.append("id_persona", id_persona);
    formData.append("id_tipoDocumento", tipoDocumento);
    formData.append("id_formatoDocumento", formatoDocumento);

    try {
      // Simulación de la llamada a la API
      // Reemplaza esta parte con tu fetch real
      console.log("Simulando subida de archivo:", selectedFile.name);
      console.log("Tipo de documento:", tipoDocumento);
      console.log("Formato de documento:", formatoDocumento);

      // Simular una respuesta exitosa del servidor
      const simulatedResponse = await new Promise((resolve) => setTimeout(() => {
        resolve({
          ok: true,
          json: () => Promise.resolve({ 
            message: "Archivo subido correctamente", 
            path: `/uploads/${selectedFile.name}`,
            // Datos que tu API real debería devolver
            id: `doc-${Date.now()}`, 
            nombre: selectedFile.name,
            tipoDocumento: (document.getElementById('tipoDocumentoSelect') as HTMLSelectElement)?.options[(document.getElementById('tipoDocumentoSelect') as HTMLSelectElement)?.selectedIndex].text || 'Desconocido',
            formato: (document.getElementById('formatoDocumentoSelect') as HTMLSelectElement)?.options[(document.getElementById('formatoDocumentoSelect') as HTMLSelectElement)?.selectedIndex].text || 'Desconocido',
            url: `/uploads/${selectedFile.name}` // URL de simulación
          })
        });
      }, 1500)); // Simula un retraso de 1.5 segundos

      // Después de la simulación, procesar la respuesta
      const response = simulatedResponse as Response; // Casteamos para TypeScript
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Error al subir el archivo.");

      alert("📄 Documento subido correctamente ✅");
      console.log("Ruta del archivo:", data.path);
      
      // Añadir el nuevo documento a la lista de documentos subidos
      setDocumentosSubidos(prevDocs => [...prevDocs, {
        id: data.id,
        nombre: data.nombre,
        tipoDocumento: data.tipoDocumento,
        formato: data.formato.toUpperCase(), // Asegurar que sea MAYÚSCULAS
        url: data.url
      }]);

      setSelectedFile(null); // Limpiar el archivo seleccionado del input
      // Opcional: resetear los dropdowns a sus valores por defecto si lo deseas
      // setTipoDocumento("1");
      // setFormatoDocumento("2");

    } catch (err: any) {
      alert(`❌ Error al subir el archivo: ${err.message}`);
      console.error("Error al subir:", err);
    }
  };

  // Funciones para las acciones de DocumentoCard
  const handleViewDocument = (id: string) => {
    const doc = documentosSubidos.find(d => d.id === id);
    if (doc && doc.url) {
      alert(`Simulando vista del documento: ${doc.nombre}. URL: ${doc.url}`);
      // Aquí abrirías el documento en un modal o en una nueva pestaña
      window.open(doc.url, '_blank');
    } else {
      alert("URL del documento no disponible para ver.");
    }
  };

  const handleDeleteDocument = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este documento?')) {
      setDocumentosSubidos(documentosSubidos.filter(doc => doc.id !== id));
      alert('Documento eliminado correctamente.');
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

        <button className="btn-upload" onClick={handleFileUpload}>
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
                key={doc.id}
                id={doc.id}
                nombre={doc.nombre}
                tipoDocumento={doc.tipoDocumento}
                formato={doc.formato}
                documentoUrl={doc.url}
                onView={handleViewDocument}
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