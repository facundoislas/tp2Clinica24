import { Component, ViewChild } from '@angular/core';
import { TablaUsuariosComponent } from "../tabla-usuarios/tabla-usuarios.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CabeceraComponent } from "../cabecera/cabecera.component";
import { FormAdminComponent } from "../form-admin/form-admin.component";
import { FormPacienteComponent } from "../form-paciente/form-paciente.component";
import { FormEspecialistaComponent } from "../form-especialista/form-especialista.component";
import { HistoriaClinicaComponent } from "../historia-clinica/historia-clinica.component";

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [TablaUsuariosComponent, FormsModule, CommonModule, CabeceraComponent, FormAdminComponent, FormPacienteComponent, FormEspecialistaComponent, HistoriaClinicaComponent],
  templateUrl: './usuarios.component.html',
  styleUrls: [ './usuarios.component.css']
})
export class UsuariosComponent {

  @ViewChild(TablaUsuariosComponent) tablaUsuarios!: TablaUsuariosComponent;

  emailSeleccionado!: string;
  seccion:string = 'menu';
  tipoUsuarioARegistrar:string = '';

  mostrarSelectorTipo() {
    this.seccion = 'selector';
  }

  seleccionarTipoUsuario(tipo: string) {
    this.tipoUsuarioARegistrar = tipo;
    this.seccion = 'formulario';
  }

  volverMenuSeleccion() {
    this.seccion = 'menu';
    this.tipoUsuarioARegistrar = '';
  }

  volverSelector() {
    this.seccion = 'selector';
    this.tipoUsuarioARegistrar = '';
  }

  recibirPacienteSeleccionado(email: string) {
    this.emailSeleccionado = email;
  }

  exportarExcel() {
    if (this.tablaUsuarios) {
      this.tablaUsuarios.exportToExcel();
    }
  }
  
}
