import React, { useState } from 'react';
import './ProfessionalSkills.css'; // Archivo CSS específico para habilidades profesionales

// Define la interfaz para los datos de cada habilidad profesional
interface ProfessionalSkill {
  id: string;
  name: string;
  category: string; // Ej: 'Programación', 'Diseño', 'Gestión', 'Software'
  level: string; // Ej: 'Avanzado', 'Intermedio', 'Básico'
  description: string;
  icon?: string; // Ruta a un ícono o emoji
  relatedProjects?: { name: string; url: string }[]; // Proyectos relacionados
}

// Datos iniciales de ejemplo para habilidades profesionales
const initialProfessionalSkillsData: ProfessionalSkill[] = [
  {
    id: 'react',
    name: 'React.js',
    category: 'Desarrollo Frontend',
    level: 'Avanzado',
    description: 'Amplia experiencia en la construcción de interfaces de usuario interactivas y escalables utilizando React y su ecosistema (Hooks, Context API, Redux).',
    icon: '⚛️', // O una ruta a un ícono: '/icons/react.svg'
    relatedProjects: [
      { name: 'Portfolio Personal (este sitio)', url: '#' },
      { name: 'E-commerce App', url: 'https://ejemplo.com/ecom' },
    ],
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'Programación',
    level: 'Avanzado',
    description: 'Dominio de TypeScript para escribir código más robusto, mantenible y con menos errores en aplicaciones de gran escala.',
    icon: 'ʦ',
    relatedProjects: [],
  },
  {
    id: 'nodejs',
    name: 'Node.js & Express',
    category: 'Desarrollo Backend',
    level: 'Intermedio',
    description: 'Creación de APIs RESTful y servicios de backend con Node.js y el framework Express, incluyendo integración con bases de datos SQL y NoSQL.',
    icon: '🟩',
    relatedProjects: [{ name: 'API de Gestión de Usuarios', url: 'https://ejemplo.com/api-docs' }],
  },
  {
    id: 'figma',
    name: 'Figma',
    category: 'Diseño UI/UX',
    level: 'Intermedio',
    description: 'Diseño de prototipos de alta fidelidad, wireframes y flujos de usuario intuitivos. Colaboración en equipos de diseño.',
    icon: '📐',
    relatedProjects: [],
  },
];

const ProfessionalSkills: React.FC = () => {
  const [skills, setSkills] = useState<ProfessionalSkill[]>(initialProfessionalSkillsData);
  const [activeSkillId, setActiveSkillId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingSkill, setEditingSkill] = useState<ProfessionalSkill | null>(null);

  const handleCardClick = (id: string) => {
    setActiveSkillId(activeSkillId === id ? null : id);
  };

  const handleAddEditClick = (skill?: ProfessionalSkill) => {
    setEditingSkill(skill || null);
    setShowModal(true);
  };

  const handleSaveSkill = (newSkill: ProfessionalSkill) => {
    if (editingSkill) {
      setSkills(skills.map((skill) => (skill.id === newSkill.id ? newSkill : skill)));
    } else {
      setSkills([...skills, { ...newSkill, id: `prof-${Date.now()}` }]);
    }
    setShowModal(false);
    setEditingSkill(null);
  };

  const handleDeleteSkill = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta habilidad profesional?')) {
      setSkills(skills.filter((skill) => skill.id !== id));
      setActiveSkillId(null);
    }
  };

  return (
    <section className="professional-skills-section">
      <h3 className="section-title">Habilidades Profesionales</h3>
      <p className="section-subtitle">Mis competencias técnicas y profesionales que me permiten resolver desafíos y contribuir al éxito.</p>

      <div className="skills-actions">
        <button className="add-skill-btn" onClick={() => handleAddEditClick()}>
          + Añadir Habilidad Profesional
        </button>
      </div>

      <div className="skills-grid">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className={`skill-card professional-card ${activeSkillId === skill.id ? 'active' : ''}`}
            onClick={() => handleCardClick(skill.id)}
          >
            <div className="skill-card-front">
              {skill.icon && <span className="skill-icon">{skill.icon}</span>}
              <h4>{skill.name}</h4>
              <span className="skill-category">{skill.category}</span>
              <span className={`level-badge ${skill.level.toLowerCase().replace(/\s/g, '-')}`}>{skill.level}</span>
              <div className="card-actions">
                <button
                  className="edit-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddEditClick(skill);
                  }}
                >
                  Editar
                </button>
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSkill(skill.id);
                  }}
                >
                  Eliminar
                </button>
              </div>
            </div>
            <div className="skill-card-back">
              <h5>Descripción:</h5>
              <p>{skill.description}</p>
              {skill.relatedProjects && skill.relatedProjects.length > 0 && (
                <>
                  <h5>Proyectos Relacionados:</h5>
                  <ul className="project-list">
                    {skill.relatedProjects.map((project, index) => (
                      <li key={index}>
                        <a href={project.url} target="_blank" rel="noopener noreferrer">
                          {project.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <ProfessionalSkillFormModal
          skill={editingSkill}
          onSave={handleSaveSkill}
          onClose={() => setShowModal(false)}
        />
      )}
    </section>
  );
};

export default ProfessionalSkills;

// --- Componente Modal para el Formulario de Habilidades Profesionales ---

interface ProfessionalSkillFormModalProps {
  skill: ProfessionalSkill | null;
  onSave: (skill: ProfessionalSkill) => void;
  onClose: () => void;
}

const ProfessionalSkillFormModal: React.FC<ProfessionalSkillFormModalProps> = ({ skill, onSave, onClose }) => {
  const [formData, setFormData] = useState<ProfessionalSkill>(
    skill || {
      id: '',
      name: '',
      category: '',
      level: '',
      description: '',
      icon: '',
      relatedProjects: [],
    }
  );
  const [currentProject, setCurrentProject] = useState({ name: '', url: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentProject({ ...currentProject, [name]: value });
  };

  const handleAddProject = () => {
    if (currentProject.name && currentProject.url) {
      setFormData({ ...formData, relatedProjects: [...(formData.relatedProjects || []), currentProject] });
      setCurrentProject({ name: '', url: '' });
    }
  };

  const handleRemoveProject = (index: number) => {
    const updatedProjects = (formData.relatedProjects || []).filter((_, i) => i !== index);
    setFormData({ ...formData, relatedProjects: updatedProjects });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{skill ? 'Editar Habilidad' : 'Añadir Nueva Habilidad Profesional'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nombre de la Habilidad:</label>
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
            <label htmlFor="category">Categoría:</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Ej: Desarrollo Frontend, Gestión de Proyectos"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="level">Nivel de Dominio:</label>
            <select id="level" name="level" value={formData.level} onChange={handleChange} required>
              <option value="">Selecciona un nivel</option>
              <option value="Básico">Básico</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
              <option value="Experto">Experto</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="description">Descripción (Detalles de tu experiencia):</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="icon">Ícono (Emoji o URL):</label>
            <input
              type="text"
              id="icon"
              name="icon"
              value={formData.icon || ''}
              onChange={handleChange}
              placeholder="Ej: ⚛️ o /icons/react.svg"
            />
          </div>

          <div className="form-group proof-section"> {/* Usamos la misma clase proof-section para reusar estilos */}
            <h4>Proyectos Relacionados:</h4>
            <div className="proof-inputs"> {/* Reusamos esta clase de estilos */}
              <input
                type="text"
                name="name"
                placeholder="Nombre del proyecto"
                value={currentProject.name}
                onChange={handleProjectChange}
              />
              <input
                type="url"
                name="url"
                placeholder="URL del proyecto"
                value={currentProject.url}
                onChange={handleProjectChange}
              />
              <button type="button" onClick={handleAddProject} className="add-proof-btn">
                +
              </button>
            </div>
            {(formData.relatedProjects && formData.relatedProjects.length > 0) && (
              <ul className="current-proofs-list">
                {formData.relatedProjects.map((p, index) => (
                  <li key={index}>
                    {p.name}
                    {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer"> (Link)</a>}
                    <button type="button" onClick={() => handleRemoveProject(index)} className="remove-proof-btn">
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