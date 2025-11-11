import { Component } from '@angular/core';
import { TurnosService } from '../../servicios/turnos.service';
import { FirebaseService } from '../../servicios/firebase.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { AlertServiceService } from '../../servicios/alert-service.service';

@Component({
  selector: 'app-turnos-por-medico',
  templateUrl: './turnos-por-medico.component.html',
  styleUrl: './turnos-por-medico.component.css'
})
export class TurnosPorMedicoComponent {

  data: any[] = [];
  dataOriginal: any[] = [];
  startDate: string = '';
  endDate: string = '';
  soloFinalizados: boolean = false;
  especialistas: any[] = [];
  turnosCompletos: any[] = [];
  xAxisTicks: number[] = []; // Ticks para el eje X
  cargando: boolean = true; // Estado de carga
  
  colorScheme: any = {
    domain: ['#667eea', '#0dcaf0', '#6f42c1', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6']
  };

  constructor(
    private turnosServ: TurnosService,
    private firebaseService: FirebaseService,
    private alertService: AlertServiceService
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando = true; // Iniciar carga
    // Cargar todos los turnos sin filtro de estado
    this.turnosServ.getTurnosDB().subscribe(turnos => {
      this.turnosCompletos = turnos;
      
      // Cargar especialistas
      this.firebaseService.getUsuariosPorTipo('especialista').subscribe(especialistas => {
        this.especialistas = especialistas;
        
        // Procesar y agrupar todos los turnos
        this.procesarYAgruparTurnos(turnos);
        this.cargando = false; // Finalizar carga
      });
    });
  }

  procesarYAgruparTurnos(turnos: any[]): void {
    // Filtrar por estado según el checkbox
    let turnosFiltradosPorEstado = turnos;
    
    if (this.soloFinalizados) {
      // Solo turnos finalizados
      turnosFiltradosPorEstado = turnos.filter(t => t.estado === 'finalizado');
    } else {
      // Todos excepto cancelados
      turnosFiltradosPorEstado = turnos.filter(t => t.estado !== 'cancelado');
    }
    
    // Crear mapa de emails a nombres completos
    const especialistasMap = new Map(
      this.especialistas.map(e => [e.email, `${e.nombre} ${e.apellido}`])
    );
    
    // Agrupar turnos por especialista
    const turnosPorEspecialista: Record<string, number> = {};
    
    turnosFiltradosPorEstado.forEach((turno) => {
      const nombreCompleto = especialistasMap.get(turno.especialista);
      const clave = nombreCompleto || turno.especialista;
      
      if (turnosPorEspecialista[clave]) {
        turnosPorEspecialista[clave]++;
      } else {
        turnosPorEspecialista[clave] = 1;
      }
    });
    
    // Convertir a formato para el gráfico
    const datosGrafico = Object.entries(turnosPorEspecialista).map(([nombre, count]) => ({
      name: nombre,
      value: count
    }));
    
    this.dataOriginal = datosGrafico;
    this.data = datosGrafico;
    
    // Calcular los ticks del eje X cada vez que cambian los datos
    this.calcularXAxisTicks();
  }

  aplicarFiltros(): void {
    if (!this.startDate || !this.endDate) {
      // Si no hay fechas, mostrar todos los datos
      this.data = [...this.dataOriginal];
      return;
    }

    // Convertir las fechas de string a Date
    const fechaInicio = new Date(this.startDate);
    fechaInicio.setHours(0, 0, 0, 0); // Inicio del día
    
    const fechaFin = new Date(this.endDate);
    fechaFin.setHours(23, 59, 59, 999); // Fin del día (incluye todo el día seleccionado)

    // Validar que la fecha de inicio no sea mayor a la fecha fin
    if (fechaInicio > fechaFin) {
      this.alertService.showSuccessAlert1('La fecha de inicio no puede ser mayor a la fecha de fin.', 'Error en fechas', 'warning');
      return;
    }

    // Filtrar turnos por rango de fechas (TODOS los estados)
    const turnosFiltrados = this.turnosCompletos.filter((turno) => {
      const fechaTurno = this.convertirFechaTurnoADate(turno.anio, turno.mes, turno.dia);
      fechaTurno.setHours(0, 0, 0, 0);
      
      // Incluir la fecha de inicio y la fecha de fin en el rango
      return fechaTurno >= fechaInicio && fechaTurno <= fechaFin;
    });

    // Procesar y agrupar los turnos filtrados
    this.procesarYAgruparTurnos(turnosFiltrados);

    // Mensaje si no hay resultados
    if (this.data.length === 0) {
      this.alertService.showSuccessAlert1('No se encontraron turnos en el rango de fechas seleccionado.', 'Sin resultados', 'info');
    }
  }

  convertirFechaTurnoADate(anio: string, mes: string, dia: string): Date {
    // Mapa de nombres de meses a números (0-11)
    const meses: Record<string, number> = {
      'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3, 
      'mayo': 4, 'junio': 5, 'julio': 6, 'agosto': 7, 
      'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11
    };
    
    const mesNormalizado = mes.toLowerCase().trim();
    const mesNumero = meses[mesNormalizado];
    
    if (mesNumero === undefined) {
      return new Date(0); // Fecha inválida
    }
    
    const diaNum = parseInt(dia);
    const anioNum = parseInt(anio);
    
    if (isNaN(diaNum) || isNaN(anioNum)) {
      return new Date(0); // Fecha inválida
    }
    
    return new Date(anioNum, mesNumero, diaNum);
  }

  limpiarFiltros(): void {
    this.startDate = '';
    this.endDate = '';
    this.soloFinalizados = false;
    this.cargarDatos(); // Recargar datos con el filtro de estado por defecto
  }
  
  cambiarFiltroEstado(): void {
    // Aplicar filtros cuando cambia el checkbox
    if (this.startDate && this.endDate) {
      this.aplicarFiltros();
    } else {
      // Si no hay fechas, recargar con el nuevo filtro de estado
      this.procesarYAgruparTurnos(this.turnosCompletos);
    }
  }

  getTotalTurnos(): number {
    if (!this.data || this.data.length === 0) return 0;
    return this.data.reduce((sum, item) => sum + item.value, 0);
  }

  getPorcentaje(valor: number): string {
    const total = this.getTotalTurnos();
    if (total === 0) return '0.00';
    return ((valor / total) * 100).toFixed(2);
  }

  getColor(index: number): string {
    const colors = this.colorScheme.domain;
    return colors[index % colors.length];
  }

  // Función para formatear el eje X con números enteros
  formatoEntero = (value: number): string => {
    return Math.round(value).toString();
  }

  // Función para formatear nombres completos en el eje Y
  formatearNombre = (value: string): string => {
    return value; // Retorna el nombre completo sin recortar
  }

  // Calcular ticks únicos para el eje X
  calcularXAxisTicks(): void {
    if (!this.data || this.data.length === 0) {
      this.xAxisTicks = [0, 1, 2, 3];
      return;
    }

    // Encontrar el valor máximo
    const maxValue = Math.max(...this.data.map(item => item.value));
    
    // Generar ticks desde 0 hasta el máximo, con saltos apropiados
    const ticks: number[] = [0];
    let step = 1;
    
    // Ajustar el paso según el valor máximo
    if (maxValue > 20) {
      step = Math.ceil(maxValue / 10);
    } else if (maxValue > 10) {
      step = 2;
    }
    
    // Generar los ticks
    for (let i = step; i <= maxValue; i += step) {
      ticks.push(i);
    }
    
    // Asegurar que el máximo valor esté incluido si no está ya
    if (ticks[ticks.length - 1] !== maxValue) {
      ticks.push(maxValue);
    }
    
    this.xAxisTicks = ticks;
  }

  private async svgToImage(svgElement: SVGElement): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Obtener dimensiones del SVG (para gráfico de barras)
        let width = svgElement.clientWidth || 900;
        let height = svgElement.clientHeight || 400;
        
        // Padding para gráfico de barras
        const padding = 50;
        canvas.width = width + padding;
        canvas.height = height + padding;
        
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        
        const img = new Image();
        
        img.onload = () => {
          if (ctx) {
            // Fondo blanco
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Dibujar el gráfico centrado
            ctx.drawImage(img, padding/2, padding/2, width, height);
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
      doc.text('Informe de Turnos por Médico', 148, 30, { align: 'center' });
      
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
      
      if (this.soloFinalizados) {
        doc.text(`Filtro: Solo turnos finalizados`, 148, 50, { align: 'center' });
      } else {
        doc.text(`Filtro: Todos excepto cancelados`, 148, 50, { align: 'center' });
      }
      
      // Esperar a que el gráfico se renderice
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Buscar el SVG del gráfico
      const svgElement = document.querySelector('.grafico-wrapper svg') as SVGElement;
      
      if (svgElement) {
        console.log('SVG encontrado, convirtiendo a imagen...');
        const imgData = await this.svgToImage(svgElement);
        
        // Posición y dimensiones del gráfico de barras - MÁS ANCHO
        const imgWidth = 250;
        const imgHeight = 100;
        const xPos = (297 - imgWidth) / 2; // Centrar horizontalmente en A4 landscape
        const yPos = 50;
        
        // Agregar gráfico al PDF (CENTRADO)
        doc.addImage(imgData, 'PNG', xPos, yPos, imgWidth, imgHeight);
        
        // LEYENDA DEBAJO DEL GRÁFICO
        const yLeyendaInicio = yPos + imgHeight + 10;
        
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('Especialistas', 148, yLeyendaInicio, { align: 'center' });
        
        let yLeyenda = yLeyendaInicio + 10;
        const colors = this.colorScheme.domain;
        
        // Calcular el ancho total para centrar las leyendas
        const xInicioLeyenda = 50;
        
        this.data.forEach((item: any, index: number) => {
          const color = colors[index % colors.length];
          
          // Dibujar cuadrado de color
          doc.setFillColor(color);
          doc.rect(xInicioLeyenda, yLeyenda - 3, 5, 5, 'F');
          
          // Nombre del especialista
          doc.setFontSize(11);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(0, 0, 0);
          doc.text(item.name, xInicioLeyenda + 8, yLeyenda);
          
          // Cantidad de turnos
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10);
          doc.text(`${item.value} turnos`, xInicioLeyenda + 70, yLeyenda);
          
          // Porcentaje
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(12);
          doc.setTextColor(100, 149, 237); // Color azul
          doc.text(`${this.getPorcentaje(item.value)}%`, xInicioLeyenda + 110, yLeyenda);
          
          yLeyenda += 8;
        });
        
        
      } else {
        console.error('No se encontró el elemento SVG del gráfico');
        this.alertService.showSuccessAlert1('No se pudo capturar el gráfico. Asegúrate de que el gráfico esté visible.', 'Error', 'error');
      }
      
     
      
      // Guardar el PDF
      const nombreArchivo = `Turnos_por_Medico_${fechaEmision.replace(/\//g, '-')}.pdf`;
      doc.save(nombreArchivo);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      this.alertService.showSuccessAlert1('Hubo un error al generar el PDF. Por favor, inténtalo de nuevo.', 'Error', 'error');
    }
  }

}
