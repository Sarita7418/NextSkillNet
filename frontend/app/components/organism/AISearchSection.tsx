'use client';
import React, { useState } from 'react';
import CandidateCard from '../molecules/CandidateCard';
import LoadingSpinner from '../atoms/LoadingSpinner';
import './AISearchSection.css';
import type { Candidate } from '@/app/types';

// Interfaz para la respuesta de la API de IA
interface AIResult {
  candidato: Candidate;
  puntos_clave: string[];
  resumen_ia: string;
}

// Componente principal para la sección de búsqueda con IA
export const AISearchSection = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<AIResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  // Manejador del envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setError('');
    setResult(null);
    setInfoMessage('');

    try {
      const response = await fetch('http://127.0.0.1:8000/candidatos/busqueda-ia', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Accept': 'application/json' 
        },
        body: JSON.stringify({ prompt }),
      });

      // --- LÓGICA DE MANEJO DE ERRORES CORREGIDA ---
      if (!response.ok) {
        // Intentamos leer el cuerpo de la respuesta de error
        const errorData = await response.json();
        // Usamos el mensaje específico del servidor si existe
        const message = errorData.message || `Error inesperado del servidor. Estado: ${response.status}`;
        // Lo mostramos como un mensaje de información, no como un error crítico
        setInfoMessage(message);
        // Salimos de la función sin lanzar un error para que no caiga en el bloque catch
        setLoading(false);
        return; 
      }
      
      // Si la respuesta es exitosa (200 OK)
      const data: AIResult = await response.json();
      if (data.candidato && data.candidato.createdAt) {
          data.candidato.createdAt = new Date(data.candidato.createdAt);
      }
      setResult(data);

    } catch (err) {
      // El bloque catch ahora solo se activará para errores de red (ej. si el servidor está caído)
      setError('Ocurrió un error de conexión al procesar la solicitud.');
      console.error("Error detallado de conexión:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-search-section">
      <h2 className="ai-title">Búsqueda con Inteligencia Artificial</h2>
      <p className="ai-subtitle">Describe al candidato ideal en pocas palabras (máx. 30) y deja que la IA encuentre la mejor coincidencia.</p>
      
      <form onSubmit={handleSubmit} className="ai-prompt-form">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ej: un desarrollador senior de Python con experiencia en la nube y bases de datos..."
          className="ai-prompt-input"
          maxLength={200}
          disabled={loading}
        />
        <div className="ai-form-footer">
          <span className="char-counter">{prompt.length} / 200</span>
          <button type="submit" className="ai-submit-button" disabled={loading || !prompt.trim()}>
            {loading ? 'Buscando...' : 'Encontrar Candidato'}
          </button>
        </div>
      </form>

      {/* Renderizado condicional de los resultados */}
      {loading && (
        <div className="ai-loading-container">
          <LoadingSpinner />
          <p>Analizando perfiles...</p>
        </div>
      )}

      {/* Muestra errores críticos (rojo) */}
      {error && <p className="ai-error-message">{error}</p>}
      
      {/* Muestra mensajes informativos (ej. "No encontrado" o "Formato incorrecto") */}
      {infoMessage && (
        <div className="ai-result-wrapper">
          <div className="ai-result-summary">
            <h3 className="result-title">Respuesta del Asistente IA</h3>
            <p>{infoMessage}</p>
          </div>
        </div>
      )}

      {/* Muestra el resultado exitoso cuando se encuentra un candidato */}
      {result && (
        <div className="ai-result-wrapper">
          <div className="ai-result-top-row">
            <div className="ai-result-card">
              <h3 className="result-title">Candidato Recomendado</h3>
              <CandidateCard candidate={result.candidato} onSelect={() => {}} isSelected={false} />
            </div>
            <div className="ai-result-reasons">
              <h3 className="result-title">Puntos Clave</h3>
              <ul>
                {result.puntos_clave.map((punto, index) => (
                  <li key={index}>{punto}</li>
                ))}
              </ul>
            </div>
          </div>
          {result.resumen_ia && (
            <div className="ai-result-summary">
              <h3 className="result-title">Resumen del Asistente IA</h3>
              <p>{result.resumen_ia}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};