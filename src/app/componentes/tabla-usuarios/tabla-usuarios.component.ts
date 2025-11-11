import { Component, EventEmitter, Output } from '@angular/core';
import { FirebaseService } from '../../servicios/firebase.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExcelExportService } from '../../servicios/excel-export.service';
import { TurnosService } from '../../servicios/turnos.service';
import { Turno } from '../../clases/turno';
import { MisPipesPipe } from '../../pipes/mis-pipes.pipe';
import { AlertServiceService } from '../../servicios/alert-service.service';

@Component({
  selector: 'app-tabla-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, MisPipesPipe],
  templateUrl: './tabla-usuarios.component.html',
  styleUrls: [ './tabla-usuarios.component.css']
})
export class TablaUsuariosComponent {

  
  public usuarios: any[] = [];
  public usuariosFiltrados: any[] = [];
  public filtroActivo: string = 'todos'; // 'todos', 'paciente', 'especialista', 'admin'
  public turnos: Turno[] = [];
  public especialistas: any[] = [];
  public cargando: boolean = true; // Estado de carga
  @Output() pacienteSeleccionado = new EventEmitter<string>();

  constructor( 
    private userService: FirebaseService, 
    private excelExportService: ExcelExportService,
    private turnosService: TurnosService,
    private alertService: AlertServiceService
  ){
    
  }

  traer()
  {
    this.cargando = true; // Iniciar carga
    this.userService.getUsuarios().subscribe(usuarios => {
      this.usuarios = usuarios;
      this.aplicarFiltro();
      console.log(this.usuarios);
      
      // Cargar turnos
      this.turnosService.getTurnosDB().subscribe(turnos => {
        this.turnos = turnos;
      });
      
      // Cargar especialistas
      this.userService.getUsuariosPorTipo('especialista').subscribe(especialistas => {
        this.especialistas = especialistas;
        this.cargando = false; // Finalizar carga
      });
    })
    
  }

  aplicarFiltro() {
    if (this.filtroActivo === 'todos') {
      this.usuariosFiltrados = this.usuarios;
    } else {
      this.usuariosFiltrados = this.usuarios.filter(user => user.tipo === this.filtroActivo);
    }
  }

  cambiarFiltro(filtro: string) {
    this.filtroActivo = filtro;
    this.aplicarFiltro();
  }

  contarUsuariosPorTipo(tipo: string): number {
    if (!this.usuarios || this.usuarios.length === 0) return 0;
    return this.usuarios.filter(user => user.tipo === tipo).length;
  }

  ngOnInit()
  {
    this.traer();
  }

  habilitarEspecialista(usuario: any){
    this.userService.updateUsuario(usuario.id, true)
    .then(()=>{
      usuario.aprobado = true;
      console.log("se actualizo");
    })
    .catch(error => console.error("error actualizando el usuario"));

  }

  deshabilitarEspecialista(usuario: any){

    this.userService.updateUsuario(usuario.id, false)
    .then(()=>{
      usuario.aprobado = false;
    })
    .catch(error => console.error("error actualizando el usuario"));
    
  }

  seleccionarPaciente(email: string) {
    this.pacienteSeleccionado.emit(email);
  }


  exportToExcel(): void {
    try {
      // Formatear los datos para el Excel con campos relevantes y nombres en español
      const datosFormateados = this.usuarios.map(usuario => {
        const datos: any = {
          'Nombre': usuario.nombre || '',
          'Apellido': usuario.apellido || '',
          'Email': usuario.email || '',
          'DNI': usuario.dni || '',
          'Edad': usuario.edad || '',
          'Tipo': usuario.tipo || '',
        };

        // Agregar campos específicos según el tipo de usuario
        if (usuario.tipo === 'paciente') {
          datos['Obra Social'] = usuario.obraSocial || '';
        }

        if (usuario.tipo === 'especialista') {
          datos['Especialidades'] = this.getEspecialidades(usuario);
          datos['Aprobado'] = usuario.aprobado ? 'Sí' : 'No';
        }

        return datos;
      });

      this.excelExportService.exportAsExcelFile(datosFormateados, 'usuarios_clinica');
      console.log('Excel exportado correctamente');
    } catch (error) {
      console.error('Error al exportar a Excel:', error);
      this.alertService.showSuccessAlert1('Error al exportar los datos a Excel. Por favor, intente nuevamente.', 'Error', 'error');
    }
  }

  getEspecialidades(user:any): string {
    if (!user.especialidad) {
      return '';
    }
    
    // Si es un array
    if (Array.isArray(user.especialidad) && user.especialidad.length > 0) {
      return user.especialidad.map((esp:any) => esp.especialidad || esp).join(', ');
    }
    
    // Si es un string
    if (typeof user.especialidad === 'string') {
      return user.especialidad;
    }
    
    // Si es un objeto
    if (typeof user.especialidad === 'object' && user.especialidad.especialidad) {
      return user.especialidad.especialidad;
    }
    
    return '';
  }

  // Método para descargar los turnos de un paciente específico (solo finalizados y aceptados)
  descargarTurnosPaciente(paciente: any): void {
    try {
      // Filtrar turnos del paciente que estén finalizados o aceptados
      const turnosPaciente = this.turnos.filter(turno => 
        turno.paciente === paciente.email && 
        (turno.estado === 'finalizado' || turno.estado === 'aceptado')
      );
      
      if (turnosPaciente.length === 0) {
        this.alertService.showSuccessAlert1('Este paciente no tiene turnos finalizados o aceptados.', 'Sin turnos', 'info');
        return;
      }

      // Formatear datos para Excel
      const datosFormateados = turnosPaciente.map(turno => {
        // Buscar el especialista
        const especialista = this.especialistas.find(esp => esp.email === turno.especialista);
        const nombreEspecialista = especialista 
          ? `${especialista.nombre} ${especialista.apellido}` 
          : turno.especialista;

        return {
          'Fecha': `${turno.dia}/${this.obtenerNumeroMes(turno.mes)}/${turno.anio}`,
          'Hora': turno.hora,
          'Especialidad': turno.especialidad,
          'Especialista': nombreEspecialista,
          'Estado': turno.estado,
          'Comentario': turno.comentario || 'N/A'
        };
      });

      // Exportar a Excel con el nombre del paciente
      const nombreArchivo = `turnos_${paciente.nombre}_${paciente.apellido}`.toLowerCase().replace(/\s/g, '_');
      this.excelExportService.exportAsExcelFile(datosFormateados, nombreArchivo);
      console.log('Turnos del paciente exportados correctamente');
    } catch (error) {
      console.error('Error al exportar turnos del paciente:', error);
      this.alertService.showSuccessAlert1('Error al exportar los turnos. Por favor, intente nuevamente.', 'Error', 'error');
    }
  }

  obtenerNumeroMes(mes: string): string {
    const meses: { [key: string]: string } = {
      'Enero': '01', 'Febrero': '02', 'Marzo': '03', 'Abril': '04', 
      'Mayo': '05', 'Junio': '06', 'Julio': '07', 'Agosto': '08',
      'Septiembre': '09', 'Octubre': '10', 'Noviembre': '11', 'Diciembre': '12'
    };
    return meses[mes] || '01';
  }

}
