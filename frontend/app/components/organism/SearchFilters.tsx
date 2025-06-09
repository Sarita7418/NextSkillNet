'use client';

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

// MODIFICADO: La interfaz ya no necesita 'educacion' porque será una lista fija
interface OpcionesFiltro {
  posiciones: { value: string; label: string }[];
  ubicaciones: { value: string; label: string }[];
  habilidades: string[];
  disponibilidades: { value: string; label: string }[];
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  loading = false,
}) => {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);
  const [isMounted, setIsMounted] = useState(false);

  // Estado para guardar las opciones que vienen de la API
  const [opciones, setOpciones] = useState<OpcionesFiltro>({
    posiciones: [],
    ubicaciones: [],
    habilidades: [],
    disponibilidades: [],
  });

  // Efecto para cargar las opciones de la API al montar el componente
  useEffect(() => {
    const fetchOpciones = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/filtros/opciones');
        if (!response.ok) throw new Error('Error al cargar opciones');
        const data = await response.json();
        
        // MODIFICADO: Ya no se establece 'educacion' desde la API
        setOpciones({
          posiciones: [{ value: '', label: 'Todas las posiciones' }, ...data.posiciones],
          ubicaciones: [{ value: '', label: 'Todas las ubicaciones' }, ...data.ubicaciones],
          habilidades: data.habilidades,
          disponibilidades: [{ value: '', label: 'Cualquier disponibilidad' }, ...data.disponibilidades],
        });
      } catch (error) {
        console.error("No se pudieron cargar las opciones de filtro:", error);
      }
    };
    fetchOpciones();
  }, []);

  // Sincroniza el estado local si los filtros del padre cambian
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);
  
  // Efecto "Debounce" para aplicar filtros con fluidez
  useEffect(() => {
    if (JSON.stringify(localFilters) === JSON.stringify(filters)) {
      return;
    }
    const handler = setTimeout(() => {
      onFiltersChange(localFilters);
    }, 500);
    return () => clearTimeout(handler);
  }, [localFilters, filters, onFiltersChange]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // RE-AÑADIDO: La lista fija para las opciones de educación
  const educationOptions = [
    { value: '', label: 'Cualquier educación' },
    { value: 'técnico', label: 'Técnico Superior' },
    { value: 'licenciatura', label: 'Licenciatura' },
    { value: 'ingeniería', label: 'Ingeniería' },
    { value: 'maestría', label: 'Maestría' },
    { value: 'mba', label: 'MBA' },
    { value: 'especialización', label: 'Especialización' },
    { value: 'certificación', label: 'Certificación' },
  ];

  const handleClearFilters = () => {
    onClearFilters(); 
  };
  
  const hasActiveFilters = Object.entries(localFilters).some(([key, value]) => {
    if (key === 'minExperience' && value !== 0) return true;
    if (key === 'maxExperience' && value !== 20) return true;
    if (key === 'minSalary' && value !== 0) return true;
    if (key === 'maxSalary' && value !== 100000) return true;
    if (Array.isArray(value)) return value.length > 0;
    return !!value;
  });

  return (
    <div className="search-filters">
      <div className="filters-header">
        <h3 className="filters-title">Filtros de búsqueda</h3>
        {hasActiveFilters && (<Button variant="outline" size="small" onClick={handleClearFilters} disabled={loading}>Limpiar</Button>)}
      </div>

      <div className="filters-content">
        <div className="filter-group">
          <SearchInput
            placeholder="Buscar por nombre, email o posición..."
            value={localFilters.searchTerm}
            onChange={(value) => setLocalFilters(prev => ({ ...prev, searchTerm: value }))}
            disabled={loading}
          />
        </div>

        <div className="filter-group">
          <FilterSelect
            label="Posición"
            options={opciones.posiciones}
            value={localFilters.position}
            onChange={(value) => setLocalFilters(prev => ({ ...prev, position: value }))}
            disabled={loading || opciones.posiciones.length <= 1}
          />
        </div>

        <div className="filter-group">
          <FilterSelect
            label="Ubicación"
            options={opciones.ubicaciones}
            value={localFilters.location}
            onChange={(value) => setLocalFilters(prev => ({ ...prev, location: value }))}
            disabled={loading || opciones.ubicaciones.length <= 1}
          />
        </div>

        <div className="filter-group">
          <RangeSlider
            label="Años de experiencia"
            min={0}
            max={20}
            minValue={localFilters.minExperience}
            maxValue={localFilters.maxExperience}
            onChange={(min, max) => setLocalFilters(prev => ({ ...prev, minExperience: min, maxExperience: max }))}
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
            onChange={(min, max) => setLocalFilters(prev => ({ ...prev, minSalary: min, maxSalary: max }))}
            disabled={loading}
            formatValue={(value) => {
              if (!isMounted) { return `Bs. ${value}`; }
              return `Bs. ${value.toLocaleString('es-BO')}`;
            }}
          />
        </div>

        <div className="filter-group">
          <SkillsSelector
            label="Habilidades"
            availableSkills={opciones.habilidades}
            selectedSkills={localFilters.skills}
            onChange={(skills) => setLocalFilters(prev => ({ ...prev, skills: skills }))}
            disabled={loading || opciones.habilidades.length === 0}
          />
        </div>

        <div className="filter-group">
          <FilterSelect
            label="Disponibilidad"
            options={opciones.disponibilidades}
            value={localFilters.availability}
            onChange={(value) => setLocalFilters(prev => ({ ...prev, availability: value }))}
            disabled={loading || opciones.disponibilidades.length <= 1}
          />
        </div>

        <div className="filter-group">
          <FilterSelect
            label="Educación"
            options={educationOptions} // <-- MODIFICADO: Usa la lista fija
            value={localFilters.education}
            onChange={(value) => setLocalFilters(prev => ({ ...prev, education: value }))}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;