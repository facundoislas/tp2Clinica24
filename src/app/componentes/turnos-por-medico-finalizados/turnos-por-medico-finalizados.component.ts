import { Component } from '@angular/core';
import { TurnosService } from '../../servicios/turnos.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { AlertServiceService } from '../../servicios/alert-service.service';

@Component({
  selector: 'app-turnos-por-medico-finalizados',
  templateUrl: './turnos-por-medico-finalizados.component.html',
  styleUrl: './turnos-por-medico-finalizados.component.css'
})
export class TurnosPorMedicoFinalizadosComponent {

  data: any[] = [];
  turnosCompletos: any[] = [];
  startDate: string = '';
  endDate: string = '';
  yAxisTicks: number[] = [];
  cargando: boolean = true; // Estado de carga
  
  // Stats
  totalTurnos: number = 0;
  promedioDiario: number = 0;
  diaConMasTurnos: string = '';
  maxTurnos: number = 0;
  diaConMenosTurnos: string = '';
  minTurnos: number = 0;
  
  colorScheme: any = {
    domain: ['#667eea', '#764ba2']
  };

  constructor(
    private turnosServ: TurnosService,
    private alertService: AlertServiceService
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando = true; // Iniciar carga
    this.turnosServ.getTurnosDB().subscribe(turnos => {
      this.turnosCompletos = turnos;
      this.procesarTurnosPorDia(turnos);
      this.cargando = false; // Finalizar carga
    });
  }

  procesarTurnosPorDia(turnos: any[]): void {
    // Agrupar turnos por fecha
    const turnosPorFecha: Record<string, number> = {};
    
    turnos.forEach((turno) => {
      // Convertir fecha del turno a formato "DD/MM/YYYY"
      const fechaKey = `${turno.dia}/${this.obtenerNumeroMes(turno.mes)}/${turno.anio}`;
      
      if (turnosPorFecha[fechaKey]) {
        turnosPorFecha[fechaKey]++;
      } else {
        turnosPorFecha[fechaKey] = 1;
      }
    });
    
    // Ordenar por fecha
    const fechasOrdenadas = Object.keys(turnosPorFecha).sort((a, b) => {
      const [diaA, mesA, anioA] = a.split('/').map(Number);
      const [diaB, mesB, anioB] = b.split('/').map(Number);
      const fechaA = new Date(anioA, mesA - 1, diaA);
      const fechaB = new Date(anioB, mesB - 1, diaB);
      return fechaA.getTime() - fechaB.getTime();
    });
    
    // Convertir a formato para el gráfico
    this.data = fechasOrdenadas.map(fecha => ({
      name: fecha,
      value: turnosPorFecha[fecha]
    }));
    
    // Calcular estadísticas y ticks del eje Y
    this.calcularEstadisticas();
    this.calcularYAxisTicks();
  }

  aplicarFiltros(): void {
    if (!this.startDate || !this.endDate) {
      this.procesarTurnosPorDia(this.turnosCompletos);
      return;
    }

    const fechaInicio = new Date(this.startDate);
    fechaInicio.setHours(0, 0, 0, 0);
    
    const fechaFin = new Date(this.endDate);
    fechaFin.setHours(23, 59, 59, 999);

    if (fechaInicio > fechaFin) {
      this.alertService.showSuccessAlert1('La fecha de inicio no puede ser mayor a la fecha de fin.', 'Error en fechas', 'warning');
      return;
    }

    // Filtrar turnos por rango de fechas
    const turnosFiltrados = this.turnosCompletos.filter((turno) => {
      const fechaTurno = this.convertirFechaTurnoADate(turno.anio, turno.mes, turno.dia);
      fechaTurno.setHours(0, 0, 0, 0);
      
      return fechaTurno >= fechaInicio && fechaTurno <= fechaFin;
    });

    this.procesarTurnosPorDia(turnosFiltrados);

    if (this.data.length === 0) {
      this.alertService.showSuccessAlert1('No se encontraron turnos en el rango de fechas seleccionado.', 'Sin resultados', 'info');
    }
  }

  limpiarFiltros(): void {
    this.startDate = '';
    this.endDate = '';
    this.procesarTurnosPorDia(this.turnosCompletos);
  }

  convertirFechaTurnoADate(anio: string, mes: string, dia: string): Date {
    const meses: Record<string, number> = {
      'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3, 
      'mayo': 4, 'junio': 5, 'julio': 6, 'agosto': 7, 
      'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11
    };
    
    const mesNormalizado = mes.toLowerCase().trim();
    const mesNumero = meses[mesNormalizado];
    
    if (mesNumero === undefined) {
      return new Date(0);
    }
    
    const diaNum = parseInt(dia);
    const anioNum = parseInt(anio);
    
    if (isNaN(diaNum) || isNaN(anioNum)) {
      return new Date(0);
    }
    
    return new Date(anioNum, mesNumero, diaNum);
  }

  obtenerNumeroMes(mes: string): string {
    const meses: Record<string, string> = {
      'enero': '01', 'febrero': '02', 'marzo': '03', 'abril': '04',
      'mayo': '05', 'junio': '06', 'julio': '07', 'agosto': '08',
      'septiembre': '09', 'octubre': '10', 'noviembre': '11', 'diciembre': '12'
    };
    return meses[mes.toLowerCase()] || '01';
  }

  calcularEstadisticas(): void {
    if (this.data.length === 0) {
      this.totalTurnos = 0;
      this.promedioDiario = 0;
      this.diaConMasTurnos = '-';
      this.maxTurnos = 0;
      this.diaConMenosTurnos = '-';
      this.minTurnos = 0;
      return;
    }

    // Total de turnos
    this.totalTurnos = this.data.reduce((sum, item) => sum + item.value, 0);
    
    // Promedio diario
    this.promedioDiario = Math.round(this.totalTurnos / this.data.length);
    
    // Día con más turnos
    const diaMax = this.data.reduce((max, item) => item.value > max.value ? item : max, this.data[0]);
    this.diaConMasTurnos = diaMax.name;
    this.maxTurnos = diaMax.value;
    
    // Día con menos turnos
    const diaMin = this.data.reduce((min, item) => item.value < min.value ? item : min, this.data[0]);
    this.diaConMenosTurnos = diaMin.name;
    this.minTurnos = diaMin.value;
  }

  // Función para formatear el eje Y con números enteros
  formatoEntero = (value: number): string => {
    return Math.round(value).toString();
  }

  // Calcular ticks del eje Y para evitar duplicados
  calcularYAxisTicks(): void {
    if (this.data.length === 0) {
      this.yAxisTicks = [0, 1, 2, 3];
      return;
    }

    const maxValue = Math.max(...this.data.map(d => d.value));
    const ticks: number[] = [];
    
    // Generar ticks de 0 hasta el valor máximo
    for (let i = 0; i <= maxValue; i++) {
      ticks.push(i);
    }
    
    this.yAxisTicks = ticks;
  }

  private async svgToImage(svgElement: SVGElement): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        
        const img = new Image();
        
        img.onload = () => {
          canvas.width = svgElement.clientWidth || 1100;
          canvas.height = svgElement.clientHeight || 350;
          
          if (ctx) {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
          }
          
          URL.revokeObjectURL(url);
          resolve(canvas.toDataURL('image/png'));
        };
        
        img.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error('Error al cargar la imagen SVG'));
        };
        
        img.src = url;
      } catch (error) {
        reject(error);
      }
    });
  }

  async descargarPDF(): Promise<void> {
    const doc = new jsPDF('landscape', 'mm', 'a4');
    
    try {
      // Cargar el logo
      const logo = new Image();
      logo.src = 'assets/imagenes/logo2.png';
      
      await new Promise((resolve) => {
        logo.onload = resolve;
      });
      
      // Agregar logo (superior izquierda)
      doc.addImage(logo, 'PNG', 10, 10, 30, 30);
      
      // Agregar título
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('CLÍNICA BUENA SALUD', 148, 20, { align: 'center' });
      
      doc.setFontSize(16);
      doc.text('Informe de Turnos por Día', 148, 30, { align: 'center' });
      
      // Fecha de emisión
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const fechaEmision = new Date().toLocaleDateString('es-ES');
      doc.text(`Fecha de emisión: ${fechaEmision}`, 148, 38, { align: 'center' });
      
      // Información del filtro si está aplicado
      if (this.startDate && this.endDate) {
        doc.setFontSize(9);
        doc.text(`Período: ${this.startDate} al ${this.endDate}`, 148, 44, { align: 'center' });
      }
      
      // Esperar a que el gráfico se renderice
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Buscar el SVG del gráfico
      const svgElement = document.querySelector('.grafico-wrapper svg') as SVGElement;
      
      if (svgElement) {
        console.log('SVG encontrado, convirtiendo a imagen...');
        const imgData = await this.svgToImage(svgElement);
        
        const imgWidth = 260;
        const imgHeight = 80;
        
        // Agregar gráfico al PDF
        doc.addImage(imgData, 'PNG', 20, 55, imgWidth, imgHeight);
        
        
      } else {
        console.error('No se encontró el elemento SVG del gráfico');
        this.alertService.showSuccessAlert1('No se pudo capturar el gráfico. Asegúrate de que el gráfico esté visible.', 'Error', 'error');
      }
      
    
      
      // Guardar el PDF
      const nombreArchivo = `Turnos_por_Dia_${fechaEmision.replace(/\//g, '-')}.pdf`;
      doc.save(nombreArchivo);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      this.alertService.showSuccessAlert1('Hubo un error al generar el PDF. Por favor, inténtalo de nuevo.', 'Error', 'error');
    }
  }

}
