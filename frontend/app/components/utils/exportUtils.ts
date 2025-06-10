// app/components/utils/exportUtils.ts

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import type { Candidate } from '@/app/types'; // Asegúrate de que la ruta a tus tipos es correcta

// --- FUNCIONES DE AYUDA PARA FORMATEAR DATOS ---

const availabilityMap: { [key: string]: string } = {
  'immediate': 'Inmediata',
  'two-weeks': 'Dos semanas',
  'one-month': 'Un mes'
};

const formatDate = (date: Date): string => {
  if (!date || isNaN(new Date(date).getTime())) {
    return 'N/A';
  }
  return new Date(date).toLocaleDateString('es-BO', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatSalary = (salary: number | null | undefined): string => {
  if (!salary) return 'No especificado';
  return `Bs. ${salary.toLocaleString('es-BO')}`;
};

// --- FUNCIÓN DE EXPORTACIÓN A PDF MEJORADA ---

export const exportToPDF = (candidates: Candidate[]) => {
  try {
    const doc = new jsPDF({
      orientation: 'landscape', // Hoja horizontal para más espacio
      unit: 'mm',
      format: 'a4'
    });

    // 1. Encabezado del Documento
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(0, 35, 102); // Azul oscuro de tu paleta
    doc.text('Reporte de Candidatos Filtrados', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generado por SkillNet el: ${new Date().toLocaleString('es-BO')}`, doc.internal.pageSize.getWidth() / 2, 28, { align: 'center' });

    // 2. Preparar los Datos para la Tabla
    const head = [['ID', 'Nombre Completo', 'Cargo', 'Experiencia', 'Ubicación', 'Email', 'Disponibilidad']];
    const body = candidates.map(c => [
      c.id,
      c.name,
      c.position,
      `${c.experience} años`,
      c.location,
      c.email,
      availabilityMap[c.availability as keyof typeof availabilityMap] || c.availability
    ]);

    // 3. Crear la Tabla con Estilos Profesionales
    autoTable(doc, {
      head: head,
      body: body,
      startY: 40,
      theme: 'grid', // Estilo de tabla con bordes
      headStyles: {
        fillColor: [0, 35, 102], // Azul oscuro
        textColor: 255,
        fontStyle: 'bold',
        halign: 'center'
      },
      styles: {
        fontSize: 8,
        cellPadding: 2,
        overflow: 'linebreak'
      },
      columnStyles: {
        1: { cellWidth: 50 }, // Nombre
        2: { cellWidth: 40 }, // Cargo
        5: { cellWidth: 50 }, // Email
      }
    });

    // 4. Añadir Número de Página en el Pie
    const pageCount = (doc as any).internal.getNumberOfPages();
    doc.setFontSize(8);
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.getWidth() / 2, 287, { align: 'center' });
    }

    // 5. Descargar el archivo directamente
    doc.save(`Reporte_Candidatos_SkillNet_${new Date().toISOString().split('T')[0]}.pdf`);

  } catch (error) {
    console.error("Error al exportar a PDF:", error);
    alert('Error al exportar a PDF. Por favor, intente nuevamente.');
  }
};


// --- FUNCIÓN DE EXPORTACIÓN A EXCEL MEJORADA ---

export const exportToExcel = (candidates: Candidate[]) => {
  try {
    // Mapeamos los datos con cabeceras amigables y formateo
    const dataToExport = candidates.map(c => ({
      'ID': c.id,
      'Nombre Completo': c.name,
      'Cargo': c.position,
      'Email': c.email,
      'Teléfono': c.phone,
      'Experiencia (años)': c.experience,
      'Ubicación': c.location,
      'Disponibilidad': availabilityMap[c.availability] || c.availability,
      'Educación': c.education,
      'Salario Esperado (Bs)': c.salary, // Exportamos como número
      'Habilidades': c.skills?.join(', ') || 'N/A',
      'Fecha de Registro': formatDate(c.createdAt)
    }));

    // Crear una nueva hoja de cálculo a partir de los datos
    const ws = XLSX.utils.json_to_sheet(dataToExport);

    // Estilo para la cabecera
    const headerStyle = {
      font: { name: 'Calibri', sz: 12, bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "002366" } },
      alignment: { vertical: "center", horizontal: "center" }
    };
    
    // Asignar el estilo a todas las celdas de la primera fila
    const headerRange = XLSX.utils.decode_range(ws['!ref'] as string);
    for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
      if (ws[cellAddress]) {
        ws[cellAddress].s = headerStyle;
      }
    }

    // Ancho de columnas automático
    const colWidths = Object.keys(dataToExport[0]).map(key => {
      const headerWidth = key.length;
      const dataWidths = dataToExport.map(row => String(row[key as keyof typeof row] ?? '').length);
      return { wch: Math.max(headerWidth, ...dataWidths) + 2 };
    });
    ws['!cols'] = colWidths;

    // Crear el libro de trabajo y añadir la hoja
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Candidatos');
    
    // Generar y descargar el archivo
    XLSX.writeFile(wb, `reporte_candidatos_${new Date().toISOString().split('T')[0]}.xlsx`);

  } catch (error) {
    console.error("Error al exportar a Excel:", error);
    alert('Error al exportar a Excel. Por favor, intente nuevamente.');
  }
};