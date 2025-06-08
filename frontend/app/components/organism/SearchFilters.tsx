// app/components/organism/SearchFilters.tsx
'use client';

// MODIFICADO: Se importa useState y useEffect desde React
import React, { useState, useEffect } from 'react';
import SearchInput from '../molecules/SearchInput';
import FilterSelect from '../molecules/FilterSelect';
import RangeSlider from '../molecules/RangeSlider';
import SkillsSelector from '../molecules/SkillsSelector';
import Button from '../atoms/Button';
import './SearchFilters.css';

interface FilterOptions {
  searchTerm: string;
  position: string;
  minExperience: number;
  maxExperience: number;
  skills: string[];
  location: string;
  minSalary: number;
  maxSalary: number;
  availability: string;
  education: string;
}

interface SearchFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
  loading?: boolean;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  loading = false,
}) => {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);
  
  // AÑADIDO: Estado para saber si el componente ya está montado en el cliente
  const [isMounted, setIsMounted] = useState(false);

  // AÑADIDO: Este efecto se ejecuta solo en el cliente, después del primer renderizado
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Listas de opciones para los selectores (sin cambios)
  const positionOptions = [ { value: '', label: 'Todas las posiciones' }, { value: 'frontend', label: 'Desarrollador Frontend' }, { value: 'backend', label: 'Desarrollador Backend' }, { value: 'fullstack', label: 'Desarrollador Fullstack' }, { value: 'designer', label: 'UI/UX Designer' }, { value: 'ux researcher', label: 'UX Researcher' }, { value: 'devops', label: 'DevOps Engineer' }, { value: 'qa', label: 'QA Engineer' }, { value: 'mobile', label: 'Mobile Developer' }, { value: 'data scientist', label: 'Data Scientist' }, { value: 'ai/ml engineer', label: 'AI/ML Engineer' }, { value: 'product manager', label: 'Product Manager' }, { value: 'scrum master', label: 'Scrum Master' }, { value: 'cybersecurity', label: 'Cybersecurity Specialist' }, { value: 'business analyst', label: 'Business Analyst' }, { value: 'database administrator', label: 'Database Administrator' }, { value: 'cloud architect', label: 'Cloud Architect' }, { value: 'game developer', label: 'Game Developer' }, { value: 'blockchain developer', label: 'Blockchain Developer' }, { value: 'technical writer', label: 'Technical Writer' }, { value: 'network engineer', label: 'Network Engineer' }, { value: 'seo specialist', label: 'SEO Specialist' }, { value: 'digital marketing', label: 'Digital Marketing Specialist' }, { value: 'systems administrator', label: 'Systems Administrator' } ];
  const locationOptions = [ { value: '', label: 'Todas las ubicaciones' }, { value: 'la paz', label: 'La Paz' }, { value: 'cochabamba', label: 'Cochabamba' }, { value: 'santa cruz', label: 'Santa Cruz' }, { value: 'sucre', label: 'Sucre' }, { value: 'remoto', label: 'Remoto' } ];
  const availabilityOptions = [ { value: '', label: 'Cualquier disponibilidad' }, { value: 'immediate', label: 'Inmediata' }, { value: 'two-weeks', label: 'Dos semanas' }, { value: 'one-month', label: 'Un mes' } ];
  const educationOptions = [ { value: '', label: 'Cualquier educación' }, { value: 'técnico', label: 'Técnico Superior' }, { value: 'licenciatura', label: 'Licenciatura' }, { value: 'ingeniería', label: 'Ingeniería' }, { value: 'maestría', label: 'Maestría' }, { value: 'mba', label: 'MBA' }, { value: 'especialización', label: 'Especialización' }, { value: 'certificación', label: 'Certificación' }, { value: 'diseño', label: 'Diseño' }, { value: 'psicología', label: 'Psicología' }, { value: 'marketing', label: 'Marketing' }, { value: 'comunicación', label: 'Comunicación Social' } ];
  const availableSkills = [ 'React', 'Vue.js', 'Angular', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'SASS', 'Node.js', 'Express', 'Python', 'Django', 'FastAPI', 'Java', 'Spring Boot', 'C#', '.NET', 'PHP', 'Laravel', 'Ruby', 'Go', 'Rust', 'Solidity', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Oracle', 'SQLite', 'Docker', 'Kubernetes', 'Jenkins', 'CI/CD', 'Terraform', 'AWS', 'Azure', 'Google Cloud', 'Microservices', 'Serverless', 'React Native', 'Flutter', 'iOS', 'Android', 'Unity', 'Firebase', 'TensorFlow', 'PyTorch', 'Machine Learning', 'Deep Learning', 'Computer Vision', 'NLP', 'Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Blender', 'Prototyping', 'Git', 'GitHub', 'GitLab', 'Jira', 'Confluence', 'Scrum', 'Agile', 'Kanban', 'Team Leadership', 'Coaching', 'SEO', 'SEM', 'Google Analytics', 'Social Media', 'Content Marketing', 'Selenium', 'JUnit', 'TestNG', 'Usability Testing', 'Linux', 'Windows Server', 'VMware', 'Networking', 'Monitoring', 'Ethical Hacking', 'CISSP', 'Network Security', 'Penetration Testing', 'Power BI', 'Excel', 'SQL', 'R', 'Pandas', 'Analytics', 'Web3', 'Ethereum', 'Smart Contracts', 'DeFi', 'Blockchain', 'Cisco', 'CCNA', 'Routing', 'Switching', 'Kafka' ];

  // Funciones de manejo de eventos (sin cambios)
  const updateFilter = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    const emptyFilters: FilterOptions = {
      searchTerm: '', position: '', minExperience: 0, maxExperience: 20,
      skills: [], location: '', minSalary: 0, maxSalary: 100000,
      availability: '', education: ''
    };
    setLocalFilters(emptyFilters);
    onClearFilters();
  };
  
  const hasActiveFilters = Object.entries(localFilters).some(([key, value]) => {
    if (key === 'minExperience' && value !== 0) return true;
    if (key === 'maxExperience' && value !== 20) return true;
    if (key === 'minSalary' && value !== 0) return true;
    if (key === 'maxSalary' && value !== 100000) return true;
    if (Array.isArray(value)) return value.length > 0;
    return value !== '';
  });

  return (
    <div className="search-filters">
      <div className="filters-header">
        <h3 className="filters-title">Filtros de búsqueda</h3>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="small"
            onClick={handleClearFilters}
            disabled={loading}
          >
            Limpiar
          </Button>
        )}
      </div>

      <div className="filters-content">
        <div className="filter-group">
          <SearchInput
            placeholder="Buscar por nombre, email o posición..."
            value={localFilters.searchTerm}
            onChange={(value) => updateFilter('searchTerm', value)}
            disabled={loading}
          />
        </div>

        <div className="filter-group">
          <FilterSelect
            label="Posición"
            options={positionOptions}
            value={localFilters.position}
            onChange={(value) => updateFilter('position', value)}
            disabled={loading}
          />
        </div>

        <div className="filter-group">
          <FilterSelect
            label="Ubicación"
            options={locationOptions}
            value={localFilters.location}
            onChange={(value) => updateFilter('location', value)}
            disabled={loading}
          />
        </div>

        <div className="filter-group">
          <RangeSlider
            label="Años de experiencia"
            min={0}
            max={20}
            minValue={localFilters.minExperience}
            maxValue={localFilters.maxExperience}
            onChange={(min, max) => {
              updateFilter('minExperience', min);
              updateFilter('maxExperience', max);
            }}
            disabled={loading}
            formatValue={(value) => `${value} año${value !== 1 ? 's' : ''}`}
          />
        </div>

        <div className="filter-group">
          <RangeSlider
            label="Rango salarial (Bs.)"
            min={0}
            max={100000}
            step={1000}
            minValue={localFilters.minSalary}
            maxValue={localFilters.maxSalary}
            onChange={(min, max) => {
              updateFilter('minSalary', min);
              updateFilter('maxSalary', max);
            }}
            disabled={loading}
            // MODIFICADO: Se aplica el formato condicional para evitar el error de hidratación
            formatValue={(value) => {
              if (!isMounted) {
                // Renderiza un formato simple y universal en el servidor y en el primer render del cliente
                return `Bs. ${value}`;
              }
              // Una vez montado en el cliente, usa el formato regional más amigable
              return `Bs. ${value.toLocaleString('es-BO')}`;
            }}
          />
        </div>

        <div className="filter-group">
          <SkillsSelector
            label="Habilidades"
            availableSkills={availableSkills}
            selectedSkills={localFilters.skills}
            onChange={(skills) => updateFilter('skills', skills)}
            disabled={loading}
          />
        </div>

        <div className="filter-group">
          <FilterSelect
            label="Disponibilidad"
            options={availabilityOptions}
            value={localFilters.availability}
            onChange={(value) => updateFilter('availability', value)}
            disabled={loading}
          />
        </div>

        <div className="filter-group">
          <FilterSelect
            label="Educación"
            options={educationOptions}
            value={localFilters.education}
            onChange={(value) => updateFilter('education', value)}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;