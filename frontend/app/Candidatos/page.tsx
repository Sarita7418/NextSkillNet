'use client';
import './page.css';
import React, { useState, useEffect } from 'react';
import Header from '../components/organism/Header';
import Footer from '../components/organism/Footer';
import SearchFilters from '../components/organism/SearchFilters';
import CandidateCard from '../components/molecules/CandidateCard';
import StatsCards from '../components/organism/StatsCards';
import LoadingSpinner from '../components/atoms/LoadingSpinner';
import ExportButtons from '../components/molecules/ExportButtons';
import { AISearchSection } from '../components/organism/AISearchSection';
// Tipos de datos
interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: number;
  skills: string[];
  location: string;
  salary: number;
  availability: 'immediate' | 'two-weeks' | 'one-month';
  education: string;
  profileImage?: string;
  resumeUrl?: string;
  createdAt: Date;
}

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

// <-- MODIFICADO: Se añaden las props para la selección
interface CandidateGridProps {
  candidates: Candidate[];
  sortBy: 'name' | 'experience' | 'salary' | 'date';
  sortOrder: 'asc' | 'desc';
  onSortChange: (newSortBy: CandidateGridProps['sortBy'], newSortOrder: CandidateGridProps['sortOrder']) => void;
  totalCount: number;
  selectedCandidateId: string | null;
  onSelectCandidate: (id: string) => void;
}

// Definición del componente CandidateGrid
const CandidateGrid: React.FC<CandidateGridProps> = ({
  candidates,
  sortBy,
  sortOrder,
  onSortChange,
  totalCount,
  selectedCandidateId, // <-- MODIFICADO: Recibe la prop
  onSelectCandidate,   // <-- MODIFICADO: Recibe la prop
}) => {
  if (!candidates || candidates.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-xl text-gray-600">No se encontraron candidatos que coincidan con los filtros.</p>
        {totalCount > 0 && <p className="text-sm text-gray-500">Intenta ajustar tus criterios de búsqueda.</p>}
      </div>
    );
  }

  return (
    
    <div className="candidate-grid-container">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        {/* ... (código de la cabecera de la grilla sin cambios) ... */}
        <div className="flex items-center gap-4">
            <p className="text-sm text-gray-600">
              Mostrando {candidates.length} de {totalCount} candidatos.
            </p>
            <ExportButtons candidates={candidates} isLoading={false} />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="sortBy" className="text-sm font-medium text-gray-700">Ordenar por:</label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as CandidateGridProps['sortBy'], sortOrder)}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-white"
            >
              <option value="date">Fecha de Creación</option>
              <option value="name">Nombre</option>
              <option value="experience">Experiencia</option>
              <option value="salary">Salario</option>
            </select>
            <select
              id="sortOrder"
              value={sortOrder}
              onChange={(e) => onSortChange(sortBy, e.target.value as CandidateGridProps['sortOrder'])}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-white"
            >
              <option value="desc">Descendente</option>
              <option value="asc">Ascendente</option>
            </select>
          </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidates.map((candidate) => (
          // <-- MODIFICADO: Se pasan las props isSelected y onSelect a cada CandidateCard
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            isSelected={candidate.id === selectedCandidateId}
            onSelect={onSelectCandidate}
          />
        ))}
      </div>
    </div>
  );
}

const Candidatos = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    position: '',
    minExperience: 0,
    maxExperience: 20,
    skills: [],
    location: '',
    minSalary: 0,
    maxSalary: 100000,
    availability: '',
    education: ''
  });
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'name' | 'experience' | 'salary' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null); // <-- AÑADIDO: Estado para la selección

  // Hook para cargar los datos desde la API de Laravel al montar el componente
  useEffect(() => {
    const fetchCandidates = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:8000/candidatos');
            if (!response.ok) {
                throw new Error('Error al cargar los datos desde el servidor.');
            }
            const data: any[] = await response.json(); // Usamos any[] temporalmente
            
            const formattedData: Candidate[] = data.map(c => ({
              ...c,
              // Aseguramos que los campos que pueden ser nulos tengan un valor por defecto
              phone: c.phone || 'N/A',
              salary: c.salary || 0,
              availability: c.availability || 'not-specified',
              skills: Array.isArray(c.skills) ? c.skills : (c.skills ? c.skills.split(', ') : []),
              createdAt: new Date(c.createdAt) 
            }));

            setCandidates(formattedData);
            setFilteredCandidates(formattedData);
        } catch (error) {
            console.error("Error fetching candidates:", error);
        } finally {
            setLoading(false);
        }
    };

    fetchCandidates();
  }, []);

  // Función para aplicar filtros y ordenamiento
  const applyFiltersAndSort = (newFilters: FilterOptions, newSortBy: typeof sortBy = sortBy, newSortOrder: typeof sortOrder = sortOrder) => {
    // ... (esta función no necesita cambios)
    setLoading(true);
    setFilters(newFilters);
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);

    let filtered = [...candidates].filter(candidate => {
      const searchTermLower = newFilters.searchTerm.toLowerCase();
      const matchesSearch = !searchTermLower ||
                            candidate.name.toLowerCase().includes(searchTermLower) ||
                            (candidate.email && candidate.email.toLowerCase().includes(searchTermLower)) ||
                            (candidate.position && candidate.position.toLowerCase().includes(searchTermLower)) ||
                            candidate.skills.some(skill => skill.toLowerCase().includes(searchTermLower));
      
      const matchesPosition = !newFilters.position || (candidate.position && candidate.position.toLowerCase().includes(newFilters.position.toLowerCase()));
      const matchesExperience = candidate.experience >= newFilters.minExperience && candidate.experience <= newFilters.maxExperience;
      const matchesSkills = newFilters.skills.length === 0 || newFilters.skills.every(filterSkill => candidate.skills.some(cSkill => cSkill.toLowerCase().includes(filterSkill.toLowerCase())));
      const matchesLocation = !newFilters.location || (candidate.location && candidate.location.toLowerCase().includes(newFilters.location.toLowerCase()));
      const matchesSalary = candidate.salary >= newFilters.minSalary && candidate.salary <= newFilters.maxSalary;
      const matchesAvailability = !newFilters.availability || candidate.availability === newFilters.availability;
      const matchesEducation = !newFilters.education || (candidate.education && candidate.education.toLowerCase().includes(newFilters.education.toLowerCase()));

      return matchesSearch && matchesPosition && matchesExperience && matchesSkills && 
             matchesLocation && matchesSalary && matchesAvailability && matchesEducation;
    });

    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (newSortBy) {
        case 'name': aValue = a.name; bValue = b.name; break;
        case 'experience': aValue = a.experience; bValue = b.experience; break;
        case 'salary': aValue = a.salary; bValue = b.salary; break;
        case 'date': aValue = a.createdAt.getTime(); bValue = b.createdAt.getTime(); break;
        default: return 0;
      }
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return newSortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        return newSortOrder === 'asc' ? Number(aValue) - Number(bValue) : Number(bValue) - Number(aValue);
      }
    });
    
    setTimeout(() => {
        setFilteredCandidates(filtered);
        setLoading(false);
    }, 300);
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    applyFiltersAndSort(newFilters, sortBy, sortOrder);
  }

  const handleSortChange = (newSortBy: typeof sortBy, newSortOrder: typeof sortOrder) => {
    applyFiltersAndSort(filters, newSortBy, newSortOrder);
  };

  // <-- AÑADIDO: Función para manejar el clic en una tarjeta
  const handleSelectCandidate = (candidateId: string) => {
    setSelectedCandidateId(prevId => (prevId === candidateId ? null : candidateId));
  };

  const clearFilters = () => {
    const emptyFilters: FilterOptions = {
        searchTerm: '', position: '', minExperience: 0, maxExperience: 20,
        skills: [], location: '', minSalary: 0, maxSalary: 100000,
        availability: '', education: ''
    };
    applyFiltersAndSort(emptyFilters, 'date', 'desc');
  };

  useEffect(() => {
    if (candidates.length > 0) {
      applyFiltersAndSort(filters, sortBy, sortOrder);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidates]);


  return (
    <div className="candidatos-page bg-gray-50 min-h-screen flex flex-col">
      <Header />
      
      <main className="candidatos-main flex-grow">
        <div className="page-header bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 shadow-md">
            {/* ... (código del header sin cambios) ... */}
            <div className="container mx-auto px-4">
              <h1 className="text-4xl font-bold tracking-tight">Gestión de Candidatos</h1>
              <p className="mt-2 text-lg opacity-90">
                Encuentra y gestiona los mejores talentos para tu organización.
              </p>
            </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <StatsCards 
            totalCandidates={candidates.length}
            filteredCount={filteredCandidates.length}
            newThisWeek={candidates.filter(c => {
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return c.createdAt > weekAgo;
            }).length}
          />

          <div className="content-layout mt-8 lg:flex lg:gap-8">
            <aside className="filters-sidebar lg:w-1/4 mb-8 lg:mb-0">
              <div >
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Filtros de Búsqueda</h2>
                <SearchFilters
                  filters={filters}
                  onFiltersChange={handleFilterChange}
                  onClearFilters={clearFilters}
                  loading={loading}
                />
              </div>
            </aside>

            <div className="candidates-content lg:w-3/4">
              {loading ? (
                <div className="loading-container flex flex-col items-center justify-center h-64">
                  <LoadingSpinner />
                  <p className="mt-4 text-gray-600">Cargando candidatos...</p>
                </div>
              ) : (
                // <-- MODIFICADO: Se pasan las nuevas props a CandidateGrid
                <CandidateGrid
                  candidates={filteredCandidates}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSortChange={handleSortChange}
                  totalCount={candidates.length}
                  selectedCandidateId={selectedCandidateId}
                  onSelectCandidate={handleSelectCandidate}
                />
              )}
            </div>
          </div>
        </div>
        
     {/* AÑADIR LA NUEVA SECCIÓN DEBAJO DEL LAYOUT PRINCIPAL */}
        <div className="container mt-8">
           <AISearchSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Candidatos;