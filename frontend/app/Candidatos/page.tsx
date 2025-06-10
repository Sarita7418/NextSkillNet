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
import KnnSearch from '../components/organism/KnnSearch';
import OnetSearch from '../components/organism/OnetSearch';
import UserProfileSection from '../components/organism/UserProfileSection';
// Tipos de datos
import type { Candidate } from '../types'; // Importando el tipo centralizado

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
  onViewProfile: (id: string) => void; // <-- AÑADE ESTA LÍNEA
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
  onViewProfile,
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
            onViewProfile={onViewProfile}
          />
        ))}
      </div>
    </div>
  );
}

const Candidatos = () => {
  const [viewingProfileId, setViewingProfileId] = useState<string | null>(null);
  const handleCloseProfile = () => {
    setViewingProfileId(null);
};
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
  const [knnSelectedSkills, setKnnSelectedSkills] = useState<string[]>([]);
  const [knnResults, setKnnResults] = useState<Candidate[]>([]);
  const [knnLoading, setKnnLoading] = useState(false);
  const [opcionesFiltro, setOpcionesFiltro] = useState<{ habilidades: string[] }>({ habilidades: [] }); 
  const [onetResults, setOnetResults] = useState<any[]>([]); // Usamos 'any' por ahora
  const [onetLoading, setOnetLoading] = useState(false);
  // Hook para cargar los datos desde la API de Laravel al montar el componente
  // Move handleOnetSearch to component scope
  const handleOnetSearch = async (cargo: string) => {
    if (!cargo.trim()) return;
    setOnetLoading(true);
    setOnetResults([]);
    try {
        const response = await fetch('http://127.0.0.1:8000/candidatos/recomendacion-onet', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ cargo: cargo }),
        });
        if (!response.ok) throw new Error('Error en la respuesta del servidor O*NET');
        
        const data = await response.json();
        // Mapeamos los resultados para asegurarnos que la fecha sea un objeto Date
        const formattedResults = data.recomendaciones.map((res: any) => ({
            ...res.candidato,
            score: res.score, // Guardamos el puntaje de similitud
            createdAt: new Date(res.candidato.createdAt),
        }));
        setOnetResults(formattedResults);

    } catch (error) {
        console.error("Error al obtener recomendaciones O*NET:", error);
    } finally {
        setOnetLoading(false);
    }
  };

  useEffect(() => {
    const handleKnnSearch = async () => {
    if (knnSelectedSkills.length === 0) return;
    setKnnLoading(true);
    setKnnResults([]);
    try {
        const response = await fetch('http://127.0.0.1:8000/candidatos/recomendacion-knn', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ habilidades: knnSelectedSkills }),
        });
        if (!response.ok) throw new Error('Error en la respuesta del servidor k-NN');

        const data = await response.json();
        // Mapeamos los resultados para asegurarnos que la fecha sea un objeto Date
        const formattedResults = data.recomendaciones.map((c: any) => ({
            ...c,
            createdAt: new Date(c.createdAt),
        }));
        setKnnResults(formattedResults);

    } catch (error) {
        console.error("Error al obtener recomendaciones k-NN:", error);
    } finally {
        setKnnLoading(false);
    }
};
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        // Hacemos las dos llamadas a la API en paralelo para más eficiencia
        const [candidatosRes, opcionesRes] = await Promise.all([
          fetch('http://127.0.0.1:8000/candidatos'),
          fetch('http://127.0.0.1:8000/filtros/opciones')
        ]);

        if (!candidatosRes.ok || !opcionesRes.ok) {
            throw new Error('Error al cargar los datos iniciales.');
        }

        const candidatosData = await candidatosRes.json();
        const opcionesData = await opcionesRes.json();

        const formattedCandidates: Candidate[] = candidatosData.map((c: any) => ({
          ...c,
          createdAt: new Date(c.createdAt),
          skills: Array.isArray(c.skills) ? c.skills : (c.skills ? c.skills.split(', ') : [])
        }));

        setCandidates(formattedCandidates);
        setFilteredCandidates(formattedCandidates);
        setOpcionesFiltro(opcionesData); // Guardamos las opciones de filtros

      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
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
const handleKnnSearch = async () => {
    if (knnSelectedSkills.length === 0) return;
    setKnnLoading(true);
    setKnnResults([]);
    try {
        const response = await fetch('http://127.0.0.1:8000/candidatos/recomendacion-knn', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ habilidades: knnSelectedSkills }),
        });
        if (!response.ok) throw new Error('Error en la respuesta del servidor k-NN');

        const data = await response.json();
        const formattedResults = data.recomendaciones.map((c: any) => ({
            ...c,
            createdAt: new Date(c.createdAt),
        }));
        setKnnResults(formattedResults);

    } catch (error) {
        console.error("Error al obtener recomendaciones k-NN:", error);
    } finally {
        setKnnLoading(false);
    }
};

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
                  onViewProfile={setViewingProfileId} // Placeholder
                />
              )}
            </div>
          </div>
        </div>
        {/* AÑADIDO: Renderizado condicional del modal de perfil */}
  {viewingProfileId && (
    <UserProfileSection 
      candidateId={viewingProfileId} 
      onClose={handleCloseProfile} 
    />
  )}
     {/* AÑADIR LA NUEVA SECCIÓN DEBAJO DEL LAYOUT PRINCIPAL */}
        <div className="container mt-8">
        <OnetSearch
    onSearch={handleOnetSearch}
    isLoading={onetLoading}

    
  />
  
  {/* --- SECCIÓN PARA MOSTRAR RESULTADOS O*NET --- */}
  {onetLoading && <div className="knn-results-container flex justify-center py-8"><LoadingSpinner /></div>}
  {onetResults.length > 0 && (
      <div className="knn-results-container">
          <h3 className="knn-results-title">Recomendaciones por Perfil Ideal (O*NET)</h3>
          <div className="grid">
              {onetResults.map((result) => (
                  <div key={`onet-${result.id}`} className="relative">
                      <CandidateCard
                          candidate={result}
                          onSelect={handleSelectCandidate}
                          isSelected={result.id === selectedCandidateId}
                          onViewProfile={setViewingProfileId} 
                      />
                      {/* Mostramos el puntaje de similitud */}
                      <div className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                          Score: {result.score.toFixed(2)}
                      </div>
                  </div>
              ))}
          </div>
      </div>
  )}

  <hr className="my-12 border-t-2 border-gray-200" />
  
  {/* --- SECCIÓN DE BÚSQUEDA CON IA GENERATIVA (GEMINI) --- */}
  <AISearchSection onViewProfile={setViewingProfileId} />
    </div>
  </main>
  <Footer />
</div>
);
};

export default Candidatos;