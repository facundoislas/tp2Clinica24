import { Component, Input, SimpleChanges } from '@angular/core';
import { Paciente } from '../../clases/paciente';
import { HistoriaClinica } from '../../clases/historia-clinica';
import { FirebaseService } from '../../servicios/firebase.service';
import { TurnosService } from '../../servicios/turnos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import { MisPipesPipe } from '../../pipes/mis-pipes.pipe';
import { AlertServiceService } from '../../servicios/alert-service.service';

@Component({
  selector: 'app-historia-clinica',
  standalone: true,
  imports: [CommonModule, FormsModule, MisPipesPipe],
  templateUrl: './historia-clinica.component.html',
  styleUrls: ['./historia-clinica.component.css']
})
export class HistoriaClinicaComponent {

  usuario: any
  mail = sessionStorage.getItem('user');;
  paciente:Paciente = new Paciente();
  historias:any[] = [];
  pacientes:Paciente[] = [];
  especialistas: any[] = [];
  especialidades: string[] = [];
  especialidadSeleccionada: string = 'todas';
  cargando: boolean = true; // Estado de carga
  @Input() emailPaciente!: string;
  
  constructor(
    private firebaseService:FirebaseService,
    private historiaService:TurnosService,
    private alertService: AlertServiceService
  ){}

  async ngOnInit(): Promise<void> {
    this.cargando = true; // Iniciar carga
    console.log(this.mail);
    await this.cargarUsuario();
    await this.cargarEspecialistas();

    if(this.usuario && this.usuario.tipo == "paciente"){
        this.paciente = this.usuario;
      }

    console.log("email paciente",this.emailPaciente)
    if(!this.emailPaciente){
    this.cargarPacientes();
      console.log("historias",this.historias)
    } else {
      this.cargarPaciente2()
    }
    this.cargando = false; // Finalizar carga
  } 

  async cargarUsuario() {
    const email = sessionStorage.getItem('user');
    this.usuario =  await this.firebaseService.getUsuarioEmail(email);
    console.log("usuario", this.usuario);
 }

  cargarEspecialistas(): Promise<void> {
    return new Promise((resolve) => {
      this.firebaseService.getUsuariosPorTipo("especialista").subscribe((usuarios: any[]) => {
        this.especialistas = usuarios;
        console.log("Especialistas cargados:", this.especialistas);
        resolve();
      });
    });
  }

  getNombreEspecialista(emailEspecialista: string): string {
    if (!emailEspecialista) {
      return 'Email no disponible';
    }
    
    const especialista = this.especialistas.find(e => e.email === emailEspecialista);
    if (especialista) {
      return `${especialista.nombre} ${especialista.apellido}`;
    }
    
    // Si no se encuentra, devolver el email como fallback
    console.warn(`Especialista no encontrado para email: ${emailEspecialista}`);
    return emailEspecialista;
  }

  cargarPacientes(){
    this.historias = [];
    this.firebaseService.getUsuariosPorTipo("paciente").subscribe((usuarios: any[]) => {
      this.pacientes = usuarios;
      console.log(this.pacientes);
      this.pacientes.forEach(paciente => {
        if(this.mail == paciente.email){
          this.paciente = paciente;
        }
      });
      this.historiaService.getHistoriaDB().subscribe(historias => {
        this.historias = [];
        historias.forEach(historia=>{
          if(historia.paciente === this.paciente.email){
            this.historias.push(historia);
          }
        });
        // Ordenar por fecha más reciente primero
        this.ordenarHistoriasPorFecha();
        // Obtener especialidades únicas
        this.obtenerEspecialidadesUnicas();
      });
  });}

  cargarPaciente2() {
      this.historias = [];
      this.firebaseService.getUsuariosPorTipo("paciente").subscribe((usuarios: any[]) => {
        this.pacientes = usuarios;
        console.log(this.pacientes);
        this.pacientes.forEach(paciente => {
          if(this.emailPaciente == paciente.email){
            this.paciente = paciente;
          }
        });
        this.historiaService.getHistoriaDB().subscribe(historias => {
        this.historias = [];
          historias.forEach(historia=>{
            if(historia.paciente === this.paciente.email){
              this.historias.push(historia);
            }
        });
        // Ordenar por fecha más reciente primero
        this.ordenarHistoriasPorFecha();
        // Obtener especialidades únicas
        this.obtenerEspecialidadesUnicas();
        });
    });
  }

  ordenarHistoriasPorFecha() {
    this.historias.sort((a: any, b: any) => {
      // Ordenar por fecha de atención (más reciente primero)
      const fechaA = a.fechaAtencion ? this.convertirADate(a.fechaAtencion).getTime() : 0;
      const fechaB = b.fechaAtencion ? this.convertirADate(b.fechaAtencion).getTime() : 0;
      return fechaB - fechaA;
    });
  }

  convertirADate(fecha: any): Date {
    if (fecha instanceof Date) {
      return fecha;
    }
    if (fecha && fecha.seconds) {
      // Timestamp de Firebase
      return new Date(fecha.seconds * 1000);
    }
    if (typeof fecha === 'string') {
      return new Date(fecha);
    }
    return new Date();
  }

  formatearFecha(fecha: any): string {
    if (!fecha) return 'Fecha no disponible';
    
    try {
      const date = this.convertirADate(fecha);
      const dia = String(date.getDate()).padStart(2, '0');
      const mes = String(date.getMonth() + 1).padStart(2, '0');
      const anio = date.getFullYear();
      return `${dia}/${mes}/${anio}`;
    } catch (error) {
      return 'Fecha no disponible';
    }
  }

  obtenerEspecialidadesUnicas() {
    const especialidadesSet = new Set<string>();
    this.historias.forEach(historia => {
      if (historia.especialidad) {
        especialidadesSet.add(historia.especialidad);
      }
    });
    this.especialidades = Array.from(especialidadesSet).sort();
  }

  get historiasFiltradas(): any[] {
    if (this.especialidadSeleccionada === 'todas') {
      return this.historias;
    }
    return this.historias.filter(h => h.especialidad === this.especialidadSeleccionada);
  }

  generarPDF() {
    const doc = new jsPDF();
    const historiasParaPDF = this.historiasFiltradas;

    if (historiasParaPDF.length === 0) {
      this.alertService.showSuccessAlert1('No hay historias clínicas para descargar con el filtro seleccionado.', 'Sin datos', 'info');
      return;
    }

    // Configuración
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPos = margin;

    // HEADER - Logo y título
    // Logo de la clínica (imagen)
    const logoImg = new Image();
    logoImg.src = 'assets/imagenes/logo2.png';
    
    // Agregar logo en la esquina superior izquierda
    try {
      doc.addImage(logoImg, 'PNG', margin, yPos, 30, 30);
    } catch (error) {
      console.log('No se pudo cargar el logo');
    }

    // Nombre de la clínica (a la derecha del logo)
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(20, 184, 166); // Color turquesa
    doc.text('CLINICA BUENA SALUD', pageWidth / 2, yPos + 15, { align: 'center' });
    yPos += 35;

    // Línea decorativa
    doc.setDrawColor(20, 184, 166);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 15;

    // Título del informe con nombre del paciente
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(`HISTORIA CLÍNICA DE ${this.paciente.nombre.toUpperCase()} ${this.paciente.apellido.toUpperCase()}`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 8;

    // Fecha de emisión
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    const fechaEmision = new Date().toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    doc.text(`Fecha de emisión: ${fechaEmision}`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 15;

    // Información del paciente
    doc.setFillColor(240, 248, 255);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 25, 'F');
    yPos += 8;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Datos del Paciente:', margin + 5, yPos);
    yPos += 7;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Nombre: ${this.paciente.nombre} ${this.paciente.apellido}`, margin + 5, yPos);
    yPos += 5;
    doc.text(`DNI: ${this.paciente.dni} | Edad: ${this.paciente.edad} años`, margin + 5, yPos);
    if (this.paciente.obraSocial) {
      yPos += 5;
      doc.text(`Obra Social: ${this.paciente.obraSocial}`, margin + 5, yPos);
    }
    yPos += 10;

    // Filtro aplicado
    if (this.especialidadSeleccionada !== 'todas') {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(20, 184, 166);
      doc.text(`Filtrado por especialidad: ${this.especialidadSeleccionada}`, margin, yPos);
      yPos += 8;
    }

    // Historias clínicas
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(`Total de consultas: ${historiasParaPDF.length}`, margin, yPos);
    yPos += 10;

    // Iterar sobre las historias
    historiasParaPDF.forEach((historia, index) => {
      // Verificar si necesitamos una nueva página
      if (yPos > pageHeight - 60) {
        doc.addPage();
        yPos = margin;
      }

      // Encabezado de la historia
      doc.setFillColor(20, 184, 166);
      doc.rect(margin, yPos, pageWidth - 2 * margin, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(`Consulta #${historiasParaPDF.length - index}`, margin + 3, yPos + 6);
      yPos += 12;

      // Información de la consulta
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      
      const fecha = this.formatearFecha(historia.fechaAtencion);
      const especialista = this.getNombreEspecialista(historia.especialista);
      
      doc.text(`Fecha: ${fecha}`, margin + 3, yPos);
      yPos += 5;
      doc.text(`Especialidad: ${historia.especialidad}`, margin + 3, yPos);
      yPos += 5;
      doc.text(`Especialista: ${especialista}`, margin + 3, yPos);
      yPos += 8;

      // Datos vitales
      doc.setFont('helvetica', 'bold');
      doc.text('Datos Vitales:', margin + 3, yPos);
      yPos += 5;
      doc.setFont('helvetica', 'normal');
      
      const datosVitales = `Altura: ${historia.altura} cm | Peso: ${historia.peso} kg | Presión: ${historia.presion} | Temperatura: ${historia.temperatura}°C`;
      const lines = doc.splitTextToSize(datosVitales, pageWidth - 2 * margin - 10);
      doc.text(lines, margin + 5, yPos);
      yPos += lines.length * 5;

      // Datos dinámicos
      if (historia.dinamicos && historia.dinamicos.length > 0) {
        yPos += 3;
        doc.setFont('helvetica', 'bold');
        doc.text('Datos Adicionales:', margin + 3, yPos);
        yPos += 5;
        doc.setFont('helvetica', 'normal');
        
        historia.dinamicos.forEach((dinamico: any) => {
          if (yPos > pageHeight - 40) {
            doc.addPage();
            yPos = margin;
          }
          doc.text(`${dinamico.clave}: ${dinamico.valor}`, margin + 5, yPos);
          yPos += 5;
        });
      }

      yPos += 5;
      // Línea separadora
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.3);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 8;
    });

    
    // Descargar
    const nombreArchivo = this.especialidadSeleccionada === 'todas'
      ? `historia_clinica_${this.paciente.nombre}_${this.paciente.apellido}.pdf`
      : `historia_clinica_${this.paciente.nombre}_${this.paciente.apellido}_${this.especialidadSeleccionada}.pdf`;
    
    doc.save(nombreArchivo.toLowerCase().replace(/\s/g, '_'));
}
}
