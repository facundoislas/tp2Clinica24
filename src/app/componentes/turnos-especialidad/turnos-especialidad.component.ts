import { Component, NgZone } from '@angular/core';
import { TurnosService } from '../../servicios/turnos.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ScaleType, Color } from '@swimlane/ngx-charts';
import { AlertServiceService } from '../../servicios/alert-service.service';

@Component({
  selector: 'app-turnos-especialidad',
  templateUrl: './turnos-especialidad.component.html',
  styleUrl: './turnos-especialidad.component.css'
})
export class TurnosEspecialidadComponent {
    
    pieChartLabels: string[] = [];
    pieChartData: number[] = [];
    data: any[] = [];
    yAxisTicks: number[] = [];
    cargando: boolean = true; // Estado de carga
    colorScheme: Color = { 
      domain: ['#667eea', '#0dcaf0', '#6f42c1', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6'], 
      group: ScaleType.Ordinal, 
      selectable: true, 
      name: 'Especialidades', 
  };

  
    constructor(
      private turnosService: TurnosService, 
      private ngZone: NgZone,
      private alertService: AlertServiceService
    ) {    
    }
    
    ngOnInit(): void {
      this.cargando = true; // Iniciar carga
      this.turnosService.getTurnosPorEspecialidad().subscribe(data => {
        console.log("datos", data);
        // Verifica y filtra datos inválidos
        const validData = data
          .filter(item => item.especialidad && item.count !== undefined && item.count !== null)
          .map(item => ({
            name: item.especialidad,
            value: item.count
          }));
  
        // Usa setTimeout para permitir que los datos se carguen
        this.ngZone.runOutsideAngular(() => {
          setTimeout(() => {
            this.ngZone.run(() => {
              this.data = validData;
              console.log("data for chart", this.data);
              this.calcularYAxisTicks();
              this.cargando = false; // Finalizar carga
            });
          }, 1000);
        });
      });
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
      const colors = this.colorScheme.domain as string[];
      return colors[index % colors.length];
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
            canvas.width = svgElement.clientWidth || 1000;
            canvas.height = svgElement.clientHeight || 500;
            
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
        doc.text('Informe de Turnos por Especialidad', 148, 30, { align: 'center' });
        
        // Fecha de emisión
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const fechaEmision = new Date().toLocaleDateString('es-ES');
        doc.text(`Fecha de emisión: ${fechaEmision}`, 148, 38, { align: 'center' });
        
        // Esperar a que el gráfico se renderice
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Buscar el SVG del gráfico
        const svgElement = document.querySelector('.grafico-wrapper svg') as SVGElement;
        
        if (svgElement) {
          console.log('SVG encontrado, convirtiendo a imagen...');
          const imgData = await this.svgToImage(svgElement);
          
          const imgWidth = 250;
          const imgHeight = 120;
          
          // Agregar gráfico al PDF
          doc.addImage(imgData, 'PNG', 25, 48, imgWidth, imgHeight);
          
          
        } else {
          console.error('No se encontró el elemento SVG del gráfico');
          this.alertService.showSuccessAlert1('No se pudo capturar el gráfico. Asegúrate de que el gráfico esté visible.', 'Error', 'error');
        }
        
        
        // Guardar el PDF
        const nombreArchivo = `Turnos_por_Especialidad_${fechaEmision.replace(/\//g, '-')}.pdf`;
        doc.save(nombreArchivo);
      } catch (error) {
        console.error('Error al generar PDF:', error);
        this.alertService.showSuccessAlert1('Hubo un error al generar el PDF. Por favor, inténtalo de nuevo.', 'Error', 'error');
      }
    }
}
