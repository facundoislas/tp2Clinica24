import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExcelExportService {

  constructor() { }

  exportAsExcelFile(json: any[], excelFileName: string): void {
    // Crear la hoja de trabajo
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    
    // Ajustar el ancho de las columnas automáticamente
    const columnWidths = this.getColumnWidths(json);
    worksheet['!cols'] = columnWidths;
    
    // Crear el libro de trabajo
    const workbook: XLSX.WorkBook = { 
      Sheets: { 'Usuarios': worksheet }, 
      SheetNames: ['Usuarios'] 
    };
    
    // Generar el buffer del Excel
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
    // Guardar el archivo
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private getColumnWidths(json: any[]): any[] {
    if (!json || json.length === 0) return [];
    
    const keys = Object.keys(json[0]);
    const widths: any[] = [];
    
    keys.forEach(key => {
      // Calcular el ancho máximo entre el título de la columna y los valores
      let maxWidth = key.length;
      json.forEach(row => {
        const cellValue = String(row[key] || '');
        if (cellValue.length > maxWidth) {
          maxWidth = cellValue.length;
        }
      });
      // Agregar un poco de padding y limitar el ancho máximo
      widths.push({ wch: Math.min(maxWidth + 2, 50) });
    });
    
    return widths;
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    const fecha = this.formatearFecha();
    saveAs(data, fileName + '_' + fecha + EXCEL_EXTENSION);
  }

  private formatearFecha(): string {
    const ahora = new Date();
    const dia = String(ahora.getDate()).padStart(2, '0');
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const anio = ahora.getFullYear();
    const horas = String(ahora.getHours()).padStart(2, '0');
    const minutos = String(ahora.getMinutes()).padStart(2, '0');
    return `${dia}-${mes}-${anio}_${horas}-${minutos}`;
  }
}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
