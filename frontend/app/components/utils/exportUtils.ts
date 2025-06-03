// utils/exportUtils.ts
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

// Mapeo de disponibilidad para mostrar en español
const availabilityMap = {
  'immediate': 'Inmediato',
  'two-weeks': 'Dos semanas',
  'one-month': 'Un mes'
};

// Función para formatear fecha
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

// Función para formatear salario
const formatSalary = (salary: number): string => {
  return `Bs. ${salary.toLocaleString('es-ES')}`;
};

// Exportar a Excel
export const exportToExcel = (candidates: Candidate[]): void => {
  try {
    // Preparar datos para Excel
    const excelData = candidates.map((candidate, index) => ({
      'N°': index + 1,
      'Nombre': candidate.name,
      'Email': candidate.email,
      'Teléfono': candidate.phone,
      'Posición': candidate.position,
      'Experiencia (años)': candidate.experience,
      'Habilidades': candidate.skills.join(', '),
      'Ubicación': candidate.location,
      'Salario': formatSalary(candidate.salary),
      'Disponibilidad': availabilityMap[candidate.availability],
      'Educación': candidate.education,
      'Fecha de Registro': formatDate(candidate.createdAt)
    }));

    // Crear CSV (compatible con Excel)
    const csvHeaders = Object.keys(excelData[0]).join(',');
    const csvRows = excelData.map(row => 
      Object.values(row).map(value => 
        typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value
      ).join(',')
    );
    
    const csvContent = [csvHeaders, ...csvRows].join('\n');
    
    // Añadir BOM para caracteres especiales en Excel
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { 
      type: 'text/csv;charset=utf-8;' 
    });
    
    // Crear enlace de descarga
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `candidatos_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('Excel exportado exitosamente');
  } catch (error) {
    console.error('Error al exportar a Excel:', error);
    alert('Error al exportar a Excel. Por favor, intenta nuevamente.');
  }
};

// Exportar a PDF
export const exportToPDF = (candidates: Candidate[]): void => {
  try {
    // Crear contenido HTML para el PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Lista de Candidatos</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            font-size: 12px;
            line-height: 1.4;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
          }
          .header h1 {
            color: #2563eb;
            margin: 0;
            font-size: 24px;
          }
          .header p {
            margin: 5px 0 0 0;
            color: #666;
          }
          .stats {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .candidate {
            border: 1px solid #ddd;
            border-radius: 8px;
            margin-bottom: 15px;
            padding: 15px;
            background-color: #fff;
            page-break-inside: avoid;
          }
          .candidate-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 10px;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
          }
          .candidate-name {
            font-size: 16px;
            font-weight: bold;
            color: #1f2937;
            margin: 0;
          }
          .candidate-position {
            color: #2563eb;
            font-weight: 600;
            margin: 2px 0;
          }
          .candidate-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-top: 10px;
          }
          .detail-item {
            margin-bottom: 5px;
          }
          .detail-label {
            font-weight: bold;
            color: #374151;
          }
          .detail-value {
            color: #6b7280;
          }
          .skills {
            background-color: #f3f4f6;
            padding: 8px;
            border-radius: 4px;
            margin-top: 8px;
          }
          .skills-title {
            font-weight: bold;
            margin-bottom: 5px;
            color: #374151;
          }
          .skills-list {
            color: #6b7280;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            color: #9ca3af;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
          }
          @media print {
            body { margin: 10px; }
            .candidate { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Lista de Candidatos</h1>
          <p>Reporte generado el ${new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
        </div>
        
        <div class="stats">
          <strong>Total de candidatos: ${candidates.length}</strong>
          <span>Filtrados y exportados</span>
        </div>

        ${candidates.map((candidate, index) => `
          <div class="candidate">
            <div class="candidate-header">
              <div>
                <h3 class="candidate-name">${candidate.name}</h3>
                <div class="candidate-position">${candidate.position}</div>
              </div>
              <div style="text-align: right;">
                <strong>${formatSalary(candidate.salary)}</strong>
              </div>
            </div>
            
            <div class="candidate-details">
              <div>
                <div class="detail-item">
                  <span class="detail-label">Email:</span>
                  <span class="detail-value">${candidate.email}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Teléfono:</span>
                  <span class="detail-value">${candidate.phone}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Ubicación:</span>
                  <span class="detail-value">${candidate.location}</span>
                </div>
              </div>
              
              <div>
                <div class="detail-item">
                  <span class="detail-label">Experiencia:</span>
                  <span class="detail-value">${candidate.experience} años</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Disponibilidad:</span>
                  <span class="detail-value">${availabilityMap[candidate.availability]}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Educación:</span>
                  <span class="detail-value">${candidate.education}</span>
                </div>
              </div>
            </div>
            
            <div class="skills">
              <div class="skills-title">Habilidades:</div>
              <div class="skills-list">${candidate.skills.join(' • ')}</div>
            </div>
          </div>
        `).join('')}
        
        <div class="footer">
          <p>Sistema de Gestión de Candidatos - Reporte generado automáticamente</p>
        </div>
      </body>
      </html>
    `;

    // Crear blob y enlace de descarga
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Crear ventana para imprimir/guardar como PDF
    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          // Limpiar URL después de un tiempo
          setTimeout(() => {
            URL.revokeObjectURL(url);
          }, 1000);
        }, 500);
      };
    } else {
      // Fallback: descargar archivo HTML
      const link = document.createElement('a');
      link.href = url;
      link.download = `candidatos_${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert('Se ha descargado un archivo HTML. Ábrelo en tu navegador y usa Ctrl+P para guardar como PDF.');
    }
    
    console.log('PDF exportado exitosamente');
  } catch (error) {
    console.error('Error al exportar a PDF:', error);
    alert('Error al exportar a PDF. Por favor, intenta nuevamente.');
  }
};