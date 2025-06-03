import React, { useState } from 'react';
import './LanguagesSection.css'; // Importa el archivo CSS

// Define la interfaz para los datos de cada idioma
interface Language {
  id: string;
  name: string;
  level: string;
  cefrLevel?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'Native';
  description: string;
  proof: {
    type: string;
    name: string;
    year?: number;
    url?: string;
    image?: string;
  }[];
}

// Datos iniciales de ejemplo
const initialLanguagesData: Language[] = [
  {
    id: 'spanish',
    name: 'Español',
    level: 'Nativo',
    cefrLevel: 'Native',
    description: 'Como hablante nativo, poseo fluidez profesional completa, permitiéndome comunicar eficazmente en todos los contextos, desde conversaciones informales hasta entornos empresariales y académicos formales.',
    proof: [
      { type: 'Experiencia', name: 'Nativo' }
    ],
  },
  {
    id: 'english',
    name: 'Inglés',
    level: 'B2 - Intermedio Alto',
    cefrLevel: 'B2',
    description: 'Alcance el nivel B2 tras completar un programa intensivo en el Centro Boliviano Americano (CBA) en La Paz, Bolivia. Mis estudios se centraron en gramática avanzada, fluidez conversacional y comunicación profesional.',
    proof: [
      {
        type: 'Certificado',
        name: 'Certificado de Finalización - Programa de Inglés Avanzado CBA',
        year: 2022,
        url: 'https://ejemplo.com/certificado_ingles_cba.pdf', // Reemplaza con tu URL real
      },
    ],
  },
  {
    id: 'portuguese',
    name: 'Portugués',
    level: 'A2 - Básico',
    cefrLevel: 'A2',
    description: 'Actualmente estoy expandiendo mis habilidades lingüísticas aprendiendo portugués. He completado los niveles A1 y A2 en el Instituto Cultural Brasil-Bolivia (ICBB), centrándome en habilidades conversacionales básicas y gramática fundamental.',
    proof: [
      {
        type: 'Certificado',
        name: 'Certificado de Finalización - Curso Básico de Portugués ICBB',
        year: 2024,
        url: 'https://ejemplo.com/certificado_portugues_icbb.pdf', // Reemplaza con tu URL real
      },
    ],
  },
];

const LanguagesSection: React.FC = () => {
  const [languages, setLanguages] = useState<Language[]>(initialLanguagesData);
  const [activeLanguageId, setActiveLanguageId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingLanguage, setEditingLanguage] = useState<Language | null>(null);

  const handleCardClick = (id: string) => {
    setActiveLanguageId(activeLanguageId === id ? null : id); // Alternar visibilidad
  };

  const handleAddEditClick = (lang?: Language) => {
    setEditingLanguage(lang || null); // Si se pasa un idioma, es para editar; si no, es para añadir
    setShowModal(true);
  };

  const handleSaveLanguage = (newLanguage: Language) => {
    if (editingLanguage) {
      // Editar idioma existente
      setLanguages(languages.map(lang => lang.id === newLanguage.id ? newLanguage : lang));
    } else {
      // Añadir nuevo idioma
      setLanguages([...languages, { ...newLanguage, id: `lang-${Date.now()}` }]); // ID único
    }
    setShowModal(false);
    setEditingLanguage(null);
  };

  const handleDeleteLanguage = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este idioma?')) {
      setLanguages(languages.filter(lang => lang.id !== id));
      setActiveLanguageId(null); // Cerrar tarjeta si está abierta
    }
  };

  return (
    <section className="languages-section">
      <h2 className="languages-title">Mis Habilidades Lingüísticas</h2>
      <p className="languages-subtitle">
        Una ventana a mi dominio de diferentes idiomas, respaldado por certificaciones y experiencias.
      </p>

      <div className="languages-actions">
        <button className="add-language-btn" onClick={() => handleAddEditClick()}>
          + Añadir Nuevo Idioma
        </button>
      </div>

      <div className="languages-grid">
        {languages.map((lang) => (
          <div
            key={lang.id}
            className={`language-card ${activeLanguageId === lang.id ? 'active' : ''}`}
            onClick={() => handleCardClick(lang.id)}
          >
            <div className="language-card-front">
              <h3>{lang.name}</h3>
              <span className={`level-badge ${lang.cefrLevel?.toLowerCase() || ''}`}>
                {lang.cefrLevel ? `${lang.cefrLevel} - ` : ''}{lang.level}
              </span>
              <div className="card-actions">
                <button className="edit-btn" onClick={(e) => { e.stopPropagation(); handleAddEditClick(lang); }}>
                  Editar
                </button>
                <button className="delete-btn" onClick={(e) => { e.stopPropagation(); handleDeleteLanguage(lang.id); }}>
                  Eliminar
                </button>
              </div>
            </div>
            <div className="language-card-back">
              <h4>Descripción:</h4>
              <p>{lang.description}</p>
              <h4>Comprobantes:</h4>
              <ul className="proof-list">
                {lang.proof.map((p, index) => (
                  <li key={index}>
                    <strong>{p.type}:</strong> {p.name} {p.year && `(${p.year})`}
                    {p.url && (
                      <a href={p.url} target="_blank" rel="noopener noreferrer" className="proof-link">
                        Ver Certificado
                      </a>
                    )}
                    {p.image && (
                      <img src={p.image} alt={`${p.name} - Comprobante`} className="proof-image" />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <LanguageFormModal
          language={editingLanguage}
          onSave={handleSaveLanguage}
          onClose={() => setShowModal(false)}
        />
      )}
    </section>
  );
};

export default LanguagesSection;

// --- Componente Modal para el Formulario (en el mismo archivo o en uno separado) ---

interface LanguageFormModalProps {
  language: Language | null;
  onSave: (language: Language) => void;
  onClose: () => void;
}

const LanguageFormModal: React.FC<LanguageFormModalProps> = ({ language, onSave, onClose }) => {
  const [formData, setFormData] = useState<Language>(
    language || {
      id: '',
      name: '',
      level: '',
      cefrLevel: undefined,
      description: '',
      proof: [],
    }
  );
  const [currentProof, setCurrentProof] = useState({ type: '', name: '', year: '', url: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProofChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentProof({ ...currentProof, [name]: value });
  };

  const handleAddProof = () => {
    if (currentProof.name && currentProof.type) {
      const newProof = {
        type: currentProof.type,
        name: currentProof.name,
        year: currentProof.year ? parseInt(currentProof.year) : undefined,
        url: currentProof.url || undefined,
      };
      setFormData({ ...formData, proof: [...formData.proof, newProof] });
      setCurrentProof({ type: '', name: '', year: '', url: '' }); // Limpiar campos
    }
  };

  const handleRemoveProof = (index: number) => {
    const updatedProof = formData.proof.filter((_, i) => i !== index);
    setFormData({ ...formData, proof: updatedProof });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{language ? 'Editar Idioma' : 'Añadir Nuevo Idioma'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Idioma:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="level">Nivel (ej. "Intermedio Alto"):</label>
            <input
              type="text"
              id="level"
              name="level"
              value={formData.level}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="cefrLevel">Nivel CEFR:</label>
            <select
              id="cefrLevel"
              name="cefrLevel"
              value={formData.cefrLevel || ''}
              onChange={handleChange}
            >
              <option value="">Selecciona un nivel</option>
              <option value="Native">Nativo</option>
              <option value="C2">C2</option>
              <option value="C1">C1</option>
              <option value="B2">B2</option>
              <option value="B1">B1</option>
              <option value="A2">A2</option>
              <option value="A1">A1</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="description">Descripción (breve):</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
            ></textarea>
          </div>

          <div className="form-group proof-section">
            <h4>Añadir Comprobante:</h4>
            <div className="proof-inputs">
              <select name="type" value={currentProof.type} onChange={handleProofChange}>
                <option value="">Tipo</option>
                <option value="Certificado">Certificado</option>
                <option value="Examen">Examen</option>
                <option value="Experiencia">Experiencia</option>
              </select>
              <input
                type="text"
                name="name"
                placeholder="Nombre del comprobante"
                value={currentProof.name}
                onChange={handleProofChange}
              />
              <input
                type="number"
                name="year"
                placeholder="Año"
                value={currentProof.year}
                onChange={handleProofChange}
              />
              <input
                type="url"
                name="url"
                placeholder="URL del certificado (opcional)"
                value={currentProof.url}
                onChange={handleProofChange}
              />
              <button type="button" onClick={handleAddProof} className="add-proof-btn">
                +
              </button>
            </div>
            {formData.proof.length > 0 && (
              <ul className="current-proofs-list">
                {formData.proof.map((p, index) => (
                  <li key={index}>
                    {p.type}: {p.name} ({p.year || 'N/A'})
                    {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer"> (Link)</a>}
                    <button type="button" onClick={() => handleRemoveProof(index)} className="remove-proof-btn">
                      X
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="modal-actions">
            <button type="submit" className="save-btn">Guardar</button>
            <button type="button" onClick={onClose} className="cancel-btn">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};