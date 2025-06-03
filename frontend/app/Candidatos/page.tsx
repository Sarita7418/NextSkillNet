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

// Props para CandidateGrid
interface CandidateGridProps {
  candidates: Candidate[];
  sortBy: 'name' | 'experience' | 'salary' | 'date';
  sortOrder: 'asc' | 'desc';
  onSortChange: (newSortBy: CandidateGridProps['sortBy'], newSortOrder: CandidateGridProps['sortOrder']) => void;
  totalCount: number;
}

// Definición del componente CandidateGrid
const CandidateGrid: React.FC<CandidateGridProps> = ({
  candidates,
  sortBy,
  sortOrder,
  onSortChange,
  totalCount,
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
        <CandidateCard key={candidate.id} candidate={candidate} />
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

  // Simulación de datos ampliada - 25 candidatos profesionales
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mockCandidates: Candidate[] = [
        {
          id: '1',
          name: 'Ana García López',
          email: 'ana.garcia@email.com',
          phone: '+591 70123456',
          position: 'Desarrollador Frontend',
          experience: 3,
          skills: ['React', 'TypeScript', 'CSS', 'Node.js'],
          location: 'La Paz',
          salary: 8000,
          availability: 'immediate',
          education: 'Licenciatura en Sistemas',
          profileImage: 'https://placehold.co/100x100/E0E0E0/757575?text=AG',
          createdAt: new Date('2024-01-15')
        },
        {
          id: '2',
          name: 'Carlos Mendoza Silva',
          email: 'carlos.mendoza@email.com',
          phone: '+591 71234567',
          position: 'Desarrollador Backend',
          experience: 5,
          skills: ['Python', 'Django', 'PostgreSQL', 'Docker'],
          location: 'Cochabamba',
          salary: 12000,
          availability: 'two-weeks',
          education: 'Ingeniería en Sistemas',
          profileImage: 'https://placehold.co/100x100/D1C4E9/4527A0?text=CM',
          createdAt: new Date('2024-01-20')
        },
        {
          id: '3',
          name: 'María Rodriguez Paz',
          email: 'maria.rodriguez@email.com',
          phone: '+591 72345678',
          position: 'UI/UX Designer',
          experience: 2,
          skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping'],
          location: 'Santa Cruz',
          salary: 7000,
          availability: 'one-month',
          education: 'Diseño Gráfico',
          profileImage: 'https://placehold.co/100x100/C8E6C9/2E7D32?text=MR',
          createdAt: new Date('2024-01-25')
        },
        {
          id: '4',
          name: 'Juan Pérez Gómez',
          email: 'juan.perez@email.com',
          phone: '+591 73456789',
          position: 'Desarrollador Fullstack',
          experience: 7,
          skills: ['React', 'Node.js', 'Express', 'MongoDB', 'AWS'],
          location: 'La Paz',
          salary: 15000,
          availability: 'immediate',
          education: 'Maestría en Ingeniería de Software',
          profileImage: 'https://placehold.co/100x100/BBDEFB/0D47A1?text=JP',
          createdAt: new Date('2023-12-10')
        },
        {
          id: '5',
          name: 'Laura Vargas Soliz',
          email: 'laura.vargas@email.com',
          phone: '+591 74567890',
          position: 'QA Engineer',
          experience: 4,
          skills: ['Selenium', 'JUnit', 'TestNG', 'CI/CD'],
          location: 'Cochabamba',
          salary: 9000,
          availability: 'two-weeks',
          education: 'Ingeniería Informática',
          profileImage: 'https://placehold.co/100x100/FFCDD2/B71C1C?text=LV',
          createdAt: new Date('2024-02-01')
        },
        {
          id: '6',
          name: 'Roberto Quispe Mamani',
          email: 'roberto.quispe@email.com',
          phone: '+591 75678901',
          position: 'DevOps Engineer',
          experience: 6,
          skills: ['Kubernetes', 'Docker', 'Jenkins', 'AWS', 'Terraform'],
          location: 'La Paz',
          salary: 14000,
          availability: 'immediate',
          education: 'Ingeniería en Sistemas',
          profileImage: 'https://placehold.co/100x100/FFF3E0/E65100?text=RQ',
          createdAt: new Date('2024-01-30')
        },
        {
          id: '7',
          name: 'Sofía Morales Choque',
          email: 'sofia.morales@email.com',
          phone: '+591 76789012',
          position: 'Data Scientist',
          experience: 4,
          skills: ['Python', 'R', 'Machine Learning', 'SQL', 'Pandas'],
          location: 'Santa Cruz',
          salary: 11000,
          availability: 'two-weeks',
          education: 'Maestría en Estadística',
          profileImage: 'https://placehold.co/100x100/E8F5E8/2E7D32?text=SM',
          createdAt: new Date('2024-02-05')
        },
        {
          id: '8',
          name: 'Diego Fernández Castro',
          email: 'diego.fernandez@email.com',
          phone: '+591 77890123',
          position: 'Mobile Developer',
          experience: 3,
          skills: ['React Native', 'Flutter', 'iOS', 'Android', 'Firebase'],
          location: 'Cochabamba',
          salary: 9500,
          availability: 'one-month',
          education: 'Ingeniería Informática',
          profileImage: 'https://placehold.co/100x100/E3F2FD/1976D2?text=DF',
          createdAt: new Date('2024-01-18')
        },
        {
          id: '9',
          name: 'Patricia Vega Mendoza',
          email: 'patricia.vega@email.com',
          phone: '+591 78901234',
          position: 'Product Manager',
          experience: 8,
          skills: ['Scrum', 'Agile', 'Jira', 'Analytics', 'Strategy'],
          location: 'La Paz',
          salary: 16000,
          availability: 'immediate',
          education: 'MBA en Gestión',
          profileImage: 'https://placehold.co/100x100/FCE4EC/C2185B?text=PV',
          createdAt: new Date('2024-01-12')
        },
        {
          id: '10',
          name: 'Andrés Salinas Rocha',
          email: 'andres.salinas@email.com',
          phone: '+591 79012345',
          position: 'Cybersecurity Specialist',
          experience: 5,
          skills: ['Ethical Hacking', 'CISSP', 'Network Security', 'Penetration Testing'],
          location: 'Santa Cruz',
          salary: 13000,
          availability: 'two-weeks',
          education: 'Especialización en Ciberseguridad',
          profileImage: 'https://placehold.co/100x100/FFEBEE/D32F2F?text=AS',
          createdAt: new Date('2024-01-28')
        },
        {
          id: '11',
          name: 'Valentina Torrez Ayala',
          email: 'valentina.torrez@email.com',
          phone: '+591 70234567',
          position: 'Business Analyst',
          experience: 4,
          skills: ['SQL', 'Power BI', 'Excel', 'Requirements Analysis', 'Process Mapping'],
          location: 'La Paz',
          salary: 8500,
          availability: 'immediate',
          education: 'Ingeniería Industrial',
          profileImage: 'https://placehold.co/100x100/F3E5F5/8E24AA?text=VT',
          createdAt: new Date('2024-02-08')
        },
        {
          id: '12',
          name: 'Miguel Condori Flores',
          email: 'miguel.condori@email.com',
          phone: '+591 71345678',
          position: 'Database Administrator',
          experience: 6,
          skills: ['MySQL', 'PostgreSQL', 'Oracle', 'Performance Tuning', 'Backup & Recovery'],
          location: 'Cochabamba',
          salary: 10500,
          availability: 'one-month',
          education: 'Licenciatura en Informática',
          profileImage: 'https://placehold.co/100x100/E0F2F1/00695C?text=MC',
          createdAt: new Date('2024-01-22')
        },
        {
          id: '13',
          name: 'Gabriela Rios Pantoja',
          email: 'gabriela.rios@email.com',
          phone: '+591 72456789',
          position: 'Frontend Developer',
          experience: 2,
          skills: ['Vue.js', 'JavaScript', 'SASS', 'Webpack', 'Git'],
          location: 'Santa Cruz',
          salary: 7500,
          availability: 'immediate',
          education: 'Técnico Superior en Programación',
          profileImage: 'https://placehold.co/100x100/FFF8E1/F57F17?text=GR',
          createdAt: new Date('2024-02-03')
        },
        {
          id: '14',
          name: 'Fernando Gutierrez Lima',
          email: 'fernando.gutierrez@email.com',
          phone: '+591 73567890',
          position: 'Cloud Architect',
          experience: 9,
          skills: ['AWS', 'Azure', 'Google Cloud', 'Microservices', 'Serverless'],
          location: 'La Paz',
          salary: 18000,
          availability: 'two-weeks',
          education: 'Maestría en Arquitectura de Software',
          profileImage: 'https://placehold.co/100x100/E8EAF6/3F51B5?text=FG',
          createdAt: new Date('2024-01-05')
        },
        {
          id: '15',
          name: 'Carmen Delgado Soto',
          email: 'carmen.delgado@email.com',
          phone: '+591 74678901',
          position: 'Scrum Master',
          experience: 5,
          skills: ['Scrum', 'Kanban', 'Team Leadership', 'Coaching', 'Jira'],
          location: 'Cochabamba',
          salary: 12500,
          availability: 'immediate',
          education: 'Certificación Scrum Master',
          profileImage: 'https://placehold.co/100x100/EFEBE9/5D4037?text=CD',
          createdAt: new Date('2024-01-17')
        },
        {
          id: '16',
          name: 'Ricardo Mamani Cruz',
          email: 'ricardo.mamani@email.com',
          phone: '+591 75789012',
          position: 'Backend Developer',
          experience: 4,
          skills: ['Java', 'Spring Boot', 'Microservices', 'Redis', 'Kafka'],
          location: 'Santa Cruz',
          salary: 10000,
          availability: 'one-month',
          education: 'Ingeniería en Sistemas',
          profileImage: 'https://placehold.co/100x100/E1F5FE/0277BD?text=RM',
          createdAt: new Date('2024-02-12')
        },
        {
          id: '17',
          name: 'Alejandra Paz Herrera',
          email: 'alejandra.paz@email.com',
          phone: '+591 76890123',
          position: 'UX Researcher',
          experience: 3,
          skills: ['User Research', 'Usability Testing', 'Prototyping', 'Analytics', 'Surveys'],
          location: 'La Paz',
          salary: 8800,
          availability: 'two-weeks',
          education: 'Psicología con especialización en UX',
          profileImage: 'https://placehold.co/100x100/F1F8E9/689F38?text=AP',
          createdAt: new Date('2024-01-26')
        },
        {
          id: '18',
          name: 'Javier Medina Quiroga',
          email: 'javier.medina@email.com',
          phone: '+591 77901234',
          position: 'AI/ML Engineer',
          experience: 4,
          skills: ['TensorFlow', 'PyTorch', 'Deep Learning', 'Computer Vision', 'NLP'],
          location: 'Cochabamba',
          salary: 13500,
          availability: 'immediate',
          education: 'Maestría en Inteligencia Artificial',
          profileImage: 'https://placehold.co/100x100/FAFAFA/424242?text=JM',
          createdAt: new Date('2024-02-06')
        },
        {
          id: '19',
          name: 'Natalia Campos Vera',
          email: 'natalia.campos@email.com',
          phone: '+591 78012345',
          position: 'Digital Marketing Specialist',
          experience: 3,
          skills: ['SEO', 'SEM', 'Google Analytics', 'Social Media', 'Content Marketing'],
          location: 'Santa Cruz',
          salary: 7800,
          availability: 'one-month',
          education: 'Marketing Digital',
          profileImage: 'https://placehold.co/100x100/FFE0E6/E91E63?text=NC',
          createdAt: new Date('2024-01-31')
        },
        {
          id: '20',
          name: 'Oscar Jiménez Vargas',
          email: 'oscar.jimenez@email.com',
          phone: '+591 79123456',
          position: 'Systems Administrator',
          experience: 7,
          skills: ['Linux', 'Windows Server', 'VMware', 'Networking', 'Monitoring'],
          location: 'La Paz',
          salary: 11500,
          availability: 'two-weeks',
          education: 'Ingeniería en Redes',
          profileImage: 'https://placehold.co/100x100/E8F5E8/388E3C?text=OJ',
          createdAt: new Date('2024-01-14')
        },
        {
          id: '21',
          name: 'Daniela Rojas Mendez',
          email: 'daniela.rojas@email.com',
          phone: '+591 70345678',
          position: 'Game Developer',
          experience: 2,
          skills: ['Unity', 'C#', 'Blender', '2D/3D Design', 'Mobile Games'],
          location: 'Cochabamba',
          salary: 8200,
          availability: 'immediate',
          education: 'Desarrollo de Videojuegos',
          profileImage: 'https://placehold.co/100x100/FFF3E0/FF9800?text=DR',
          createdAt: new Date('2024-02-09')
        },
        {
          id: '22',
          name: 'Esteban Luna Chávez',
          email: 'esteban.luna@email.com',
          phone: '+591 71456789',
          position: 'Blockchain Developer',
          experience: 3,
          skills: ['Solidity', 'Web3', 'Ethereum', 'Smart Contracts', 'DeFi'],
          location: 'Santa Cruz',
          salary: 12800,
          availability: 'two-weeks',
          education: 'Especialización en Blockchain',
          profileImage: 'https://placehold.co/100x100/E3F2FD/1565C0?text=EL',
          createdAt: new Date('2024-01-21')
        },
        {
          id: '23',
          name: 'Andrea Silva Paredes',
          email: 'andrea.silva@email.com',
          phone: '+591 72567890',
          position: 'Technical Writer',
          experience: 4,
          skills: ['Documentation', 'API Documentation', 'Technical Communication', 'Markdown', 'Git'],
          location: 'La Paz',
          salary: 8000,
          availability: 'one-month',
          education: 'Comunicación Social',
          profileImage: 'https://placehold.co/100x100/F3E5F5/9C27B0?text=AS',
          createdAt: new Date('2024-02-04')
        },
        {
          id: '24',
          name: 'Rodrigo Espinoza Morón',
          email: 'rodrigo.espinoza@email.com',
          phone: '+591 73678901',
          position: 'Network Engineer',
          experience: 6,
          skills: ['Cisco', 'CCNA', 'Routing', 'Switching', 'Network Security'],
          location: 'Cochabamba',
          salary: 10800,
          availability: 'immediate',
          education: 'Ingeniería en Telecomunicaciones',
          profileImage: 'https://placehold.co/100x100/FFEBEE/F44336?text=RE',
          createdAt: new Date('2024-01-19')
        },
        {
          id: '25',
          name: 'Isabella Torres Guzmán',
          email: 'isabella.torres@email.com',
          phone: '+591 74789012',
          position: 'SEO Specialist',
          experience: 3,
          skills: ['SEO', 'Google Search Console', 'Keyword Research', 'Link Building', 'Analytics'],
          location: 'Santa Cruz',
          salary: 7600,
          availability: 'two-weeks',
          education: 'Marketing Digital',
          profileImage: 'https://placehold.co/100x100/E8F5E8/4CAF50?text=IT',
          createdAt: new Date('2024-02-07')
        }
      ];
      setCandidates(mockCandidates);
      setFilteredCandidates(mockCandidates);
      setLoading(false);
    }, 1000);
  }, []);

  // Función para aplicar filtros y ordenamiento
  const applyFiltersAndSort = (newFilters: FilterOptions, newSortBy: typeof sortBy = sortBy, newSortOrder: typeof sortOrder = sortOrder) => {
    setLoading(true);
    setFilters(newFilters);
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);

    let filtered = [...candidates].filter(candidate => {
      const searchTermLower = newFilters.searchTerm.toLowerCase();
      const matchesSearch = !searchTermLower ||
                            candidate.name.toLowerCase().includes(searchTermLower) ||
                            candidate.email.toLowerCase().includes(searchTermLower) ||
                            candidate.position.toLowerCase().includes(searchTermLower) ||
                            candidate.skills.some(skill => skill.toLowerCase().includes(searchTermLower));
      
      const matchesPosition = !newFilters.position || candidate.position.toLowerCase().includes(newFilters.position.toLowerCase());
      
      const matchesExperience = candidate.experience >= newFilters.minExperience && 
                                candidate.experience <= newFilters.maxExperience;
      
      const matchesSkills = newFilters.skills.length === 0 || 
                            newFilters.skills.every(filterSkill =>
                              candidate.skills.some(cSkill => 
                                cSkill.toLowerCase().includes(filterSkill.toLowerCase())
                              )
                            );
      
      const matchesLocation = !newFilters.location || candidate.location.toLowerCase().includes(newFilters.location.toLowerCase());
      
      const matchesSalary = candidate.salary >= newFilters.minSalary && candidate.salary <= newFilters.maxSalary;
      
      const matchesAvailability = !newFilters.availability || candidate.availability === newFilters.availability;
      
      const matchesEducation = !newFilters.education || candidate.education.toLowerCase().includes(newFilters.education.toLowerCase());

      return matchesSearch && matchesPosition && matchesExperience && matchesSkills && 
             matchesLocation && matchesSalary && matchesAvailability && matchesEducation;
    });

    // Aplicar ordenamiento
    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (newSortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'experience':
          aValue = a.experience;
          bValue = b.experience;
          break;
        case 'salary':
          aValue = a.salary;
          bValue = b.salary;
          break;
        case 'date':
          aValue = a.createdAt.getTime();
          bValue = b.createdAt.getTime();
          break;
        default:
          return 0;
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



  
  const clearFilters = () => {
    const emptyFilters: FilterOptions = {
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
    };
    applyFiltersAndSort(emptyFilters, 'date', 'desc');
  };

  // Aplicar filtros y ordenamiento inicial después de cargar los candidatos
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
              <div className="bg-white p-6 rounded-lg shadow-lg">
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
                <CandidateGrid
                  candidates={filteredCandidates}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSortChange={handleSortChange}
                  totalCount={candidates.length}
                />
              )}
            </div>
          </div>
        </div>
        
      </main>

      <Footer />
    </div>
  );
};

export default Candidatos;