import { Component } from '@angular/core';
import { FirebaseService } from '../../servicios/firebase.service';
import { ExcelExportService } from '../../servicios/excel-export.service';

@Component({
  selector: 'app-log-ingresos',
  templateUrl: './log-ingresos.component.html',
  styleUrls: [ './log-ingresos.component.css']
})
export class LogIngresosComponent {

  logs: any[] = [];
  logsOrdenados: any[] = [];
  cargando: boolean = true; // Estado de carga
  
  // Paginación
  paginaActual: number = 1;
  itemsPorPagina: number = 15;
  totalPaginas: number = 0;

  constructor(private logService: FirebaseService, private excelExportService: ExcelExportService) {}

  ngOnInit(): void {
    this.cargando = true; // Iniciar carga
    this.logService.getLogData().subscribe(data => {
      this.logs = data;
      this.ordenarPorFecha();
      this.calcularTotalPaginas();
      this.cargando = false; // Finalizar carga
    });
  }

  ordenarPorFecha(): void {
    // Ordenar de mayor a menor (más reciente primero)
    this.logsOrdenados = [...this.logs].sort((a, b) => {
      const fechaA = a.fecha?.seconds || 0;
      const fechaB = b.fecha?.seconds || 0;
      return fechaB - fechaA; // Descendente (más reciente primero)
    });
  }

  calcularTotalPaginas(): void {
    this.totalPaginas = Math.ceil(this.logsOrdenados.length / this.itemsPorPagina);
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

  get paginasArray(): (number | string)[] {
    const maxPaginasVisibles = 10;
    const paginas: (number | string)[] = [];
    
    if (this.totalPaginas <= maxPaginasVisibles) {
      // Si hay 10 o menos páginas, mostrar todas
      return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
    }
    
    // Si hay más de 10 páginas
    const mitad = Math.floor(maxPaginasVisibles / 2);
    let inicio = Math.max(1, this.paginaActual - mitad);
    let fin = Math.min(this.totalPaginas, inicio + maxPaginasVisibles - 1);
    
    // Ajustar inicio si estamos cerca del final
    if (fin === this.totalPaginas) {
      inicio = Math.max(1, fin - maxPaginasVisibles + 1);
    }
    
    // Agregar primera página si no está en el rango
    if (inicio > 1) {
      paginas.push(1);
      if (inicio > 2) {
        paginas.push('...');
      }
    }
    
    // Agregar páginas del rango
    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }
    
    // Agregar última página si no está en el rango
    if (fin < this.totalPaginas) {
      if (fin < this.totalPaginas - 1) {
        paginas.push('...');
      }
      paginas.push(this.totalPaginas);
    }
    
    return paginas;
  }

  esPuntosSuspensivos(valor: number | string): boolean {
    return valor === '...';
  }

  exportToExcel(): void {
    // Formatear los datos para Excel
    const datosFormateados = this.logsOrdenados.map((log, index) => {
      return {
        '#': index + 1,
        'Email': log.email,
        'Fecha y Hora': this.formatearFechaParaExcel(log.fecha.seconds)
      };
    });
    
    // Exportar los logs formateados
    this.excelExportService.exportAsExcelFile(datosFormateados, 'login');
  }

  private formatearFechaParaExcel(seconds: number): string {
    const fecha = new Date(seconds * 1000);
    
    // Obtener componentes de la fecha
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    
    // Obtener horas en formato 12 horas
    let horas = fecha.getHours();
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    const segundos = fecha.getSeconds().toString().padStart(2, '0');
    
    // Determinar AM o PM
    const ampm = horas >= 12 ? 'PM' : 'AM';
    
    // Convertir a formato 12 horas
    horas = horas % 12;
    horas = horas ? horas : 12; // Si es 0, mostrar 12
    const horasStr = horas.toString().padStart(2, '0');
    
    // Formato: DD/MM/YYYY, HH:MM:SS AM/PM
    return `${dia}/${mes}/${anio}, ${horasStr}:${minutos}:${segundos} ${ampm}`;
  }
  
}
