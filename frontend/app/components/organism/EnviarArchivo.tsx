"use client";

import React, { useState, useEffect, useCallback } from "react";
import DocumentoCard from "../molecules/DocumentoCard";
import "./EnviarArchivo.css";
import UploadDocument from "../molecules/UploadDocument";

interface DocumentoSubido {
  id: number;
  nombre: string;
  tipoDocumento: string;
  formato: "PDF" | "DOCX" | "Imagen" | "Otro";
  url: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const SubirDocumento: React.FC = () => {
  const [personaId, setPersonaId] = useState<number | null>(null); // Inicializar como null
  const [tipoDocumento, setTipoDocumento] = useState<number>(1);
  const [documentosSubidos, setDocumentosSubidos] = useState<DocumentoSubido[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedPersonaId = localStorage.getItem("id_persona");
    if (storedPersonaId) {
      setPersonaId(parseInt(storedPersonaId, 10));
    }
  }, []);

  const fetchDocuments = useCallback(async () => {
    if (!personaId) {
      return; // No hacer la petición si personaId no está definido
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/documentos/${personaId}`, {
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        setError(`Error al cargar documentos: ${errorText}`);
        setDocumentosSubidos([]);
        return;
      }

      const data = await response.json();

      if (!data.documentos || !Array.isArray(data.documentos)) {
        setDocumentosSubidos([]);
        return;
      }

      const adaptados: DocumentoSubido[] = data.documentos.map((doc: any) => {
        const ext = doc.recurso.split(".").pop()?.toLowerCase() ?? "";
        let formato: DocumentoSubido["formato"] = "Otro";
        if (ext === "pdf") formato = "PDF";
        else if (["doc", "docx"].includes(ext)) formato = "DOCX";
        else if (["jpg", "jpeg", "png"].includes(ext)) formato = "Imagen";

        return {
          id: Number(doc.id_documento),
          nombre: doc.recurso.split("/").pop() || "Documento",
          tipoDocumento: `Tipo ${doc.id_tipoDocumento}`,
          formato,
          url: doc.recurso,
        };
      });

      setDocumentosSubidos(adaptados);
    } catch (err) {
      setError("Error de conexión: " + (err instanceof Error ? err.message : "desconocido"));
      setDocumentosSubidos([]);
    } finally {
      setLoading(false);
    }
  }, [personaId]);

  useEffect(() => {
    if (personaId) {
      fetchDocuments();
    }
  }, [fetchDocuments, personaId]);

  const handleViewDocument = (url: string) => {
    const fullUrl = url.startsWith("http")
      ? url
      : `${API_BASE_URL}/storage/${url}`;
    window.open(fullUrl, "_blank");
  };

  const handleDeleteDocument = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este documento?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/documentos/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      if (res.ok) {
        alert("Documento eliminado correctamente");
        setDocumentosSubidos((prev) => prev.filter((doc) => doc.id !== id));
      } else {
        const data = await res.json();
        alert("Error al eliminar documento: " + (data.message || "Error desconocido"));
      }
    } catch (err) {
      console.error("Error al eliminar documento:", err);
      alert("Error de conexión al eliminar documento");
    }
  };

  return (
    <div className="subir-documento-container">
      <h1 className="main-title">Gestión de Documentos</h1>
      <p className="subtitle">Sube tus documentos importantes y gestiona los ya existentes.</p>

      <section className="upload-section">
        <h2 className="section-title">Subir Nuevo Documento</h2>

        <div className="form-group">
          <label htmlFor="tipoDocumentoSelect" className="form-label">
            Tipo de documento
          </label>
          <select
            id="tipoDocumentoSelect"
            className="form-select"
            value={tipoDocumento}
            onChange={(e) => setTipoDocumento(Number(e.target.value))}
          >
            <option value={1}>Currículum</option>
            <option value={2}>Carta de presentación</option>
            <option value={3}>Certificación</option>
            <option value={4}>Otro</option>
          </select>
        </div>

        <div
          className="upload-button-wrapper"
          style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}
        >
          <UploadDocument
            userId={personaId ? personaId : 0} // Usar personaId dinámico
            tipoDocumentoId={tipoDocumento}
            onUploadSuccess={fetchDocuments}
          />
        </div>
      </section>

      <section className="uploaded-docs-section">
        <h2 className="section-title">Mis Documentos Subidos</h2>

        {loading && <p>Cargando documentos...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && documentosSubidos.length === 0 && (
          <p className="no-docs-message">Aún no has subido ningún documento.</p>
        )}

        {!loading && !error && documentosSubidos.length > 0 && (
          <div className="documentos-list-grid">
            {documentosSubidos.map((doc) => (
              <DocumentoCard
                key={doc.id}
                id={doc.id.toString()}
                nombre={doc.nombre}
                tipoDocumento={doc.tipoDocumento}
                formato={doc.formato}
                documentoUrl={doc.url}
                onView={() => handleViewDocument(doc.url)}
                onDownload={() => handleViewDocument(doc.url)}
                onDelete={() => handleDeleteDocument(doc.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default SubirDocumento;