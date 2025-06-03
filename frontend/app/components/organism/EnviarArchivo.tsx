'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // ✅ Importar router
import SubirArchivo from '../molecules/SubirArchivo';
import './EnviarArchivo.css';

const EnviarArchivo: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [tipoDocumento, setTipoDocumento] = useState("1");
  const [formatoDocumento, setFormatoDocumento] = useState("2");

  const router = useRouter(); // ✅ Hook para redirección

  const handleUpload = async () => {
    const id_persona = localStorage.getItem("id_persona");

    if (!id_persona) {
      alert("Usuario no autenticado. Inicia sesión para continuar.");
      router.push('/Login'); // ✅ Redirigir al login
      return;
    }

    if (!file) {
      alert('Por favor selecciona un archivo antes de subir.');
      return;
    }

    const formData = new FormData();
    formData.append("cv", file);
    formData.append("id_persona", id_persona);
    formData.append("id_tipoDocumento", tipoDocumento);
    formData.append("id_formatoDocumento", formatoDocumento);

    try {
      const response = await fetch("http://localhost:8000/subir-curriculum", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error al subir");

      alert("📄 Documento subido correctamente ✅");
      console.log("Ruta del archivo:", data.path);
      setFile(null);
    } catch (err: any) {
      alert(`❌ Error al subir el archivo: ${err.message}`);
      console.error("Error al subir:", err);
    }
  };

  return (
    <div className="uploader-container">
      <h2 className="uploader-title">Subir Documento</h2>

      <label className="dropdown-label">Tipo de documento</label>
      <select
        className="dropdown"
        value={tipoDocumento}
        onChange={(e) => setTipoDocumento(e.target.value)}
      >
        <option value="1">Currículum</option>
        <option value="2">Carta de presentación</option>
        <option value="3">Certificación</option>
      </select>

      <label className="dropdown-label">Formato del archivo</label>
      <select
        className="dropdown"
        value={formatoDocumento}
        onChange={(e) => setFormatoDocumento(e.target.value)}
      >
        <option value="1">DOCX</option>
        <option value="2">PDF</option>
        <option value="3">Imagen</option>
      </select>

      <SubirArchivo 
        label="Selecciona tu archivo" 
        onChange={(e) => setFile(e.target.files?.[0] || null)} 
      />

      <button className="upload-button" onClick={handleUpload}>
        Subir
      </button>
    </div>
  );
};

export default EnviarArchivo;
