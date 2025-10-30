import { Component, EventEmitter, Output } from '@angular/core';
import { FirebaseService } from '../../servicios/firebase.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExcelExportService } from '../../servicios/excel-export.service';

@Component({
  selector: 'app-tabla-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tabla-usuarios.component.html',
  styleUrls: [ './tabla-usuarios.component.css']
})
export class TablaUsuariosComponent {

  
  public usuarios: any[] = [];
  public usuariosFiltrados: any[] = [];
  public filtroActivo: string = 'todos'; // 'todos', 'paciente', 'especialista', 'admin'
  @Output() pacienteSeleccionado = new EventEmitter<string>();

  constructor( private userService: FirebaseService, private excelExportService: ExcelExportService){
    
  }

  traer()
  {

    this.userService.getUsuarios().subscribe(usuarios => {
      this.usuarios = usuarios;
      this.aplicarFiltro();
      console.log(this.usuarios)
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
      alert('Error al exportar los datos a Excel. Por favor, intente nuevamente.');
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

}
