import { Component } from '@angular/core';
import { TablaUsuariosComponent } from "../tabla-usuarios/tabla-usuarios.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CabeceraComponent } from "../cabecera/cabecera.component";
import { FormAdminComponent } from "../form-admin/form-admin.component";
import { HistoriaClinicaComponent } from "../historia-clinica/historia-clinica.component";

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [TablaUsuariosComponent, FormsModule, CommonModule, CabeceraComponent, FormAdminComponent, HistoriaClinicaComponent],
  templateUrl: './usuarios.component.html',
  styleUrls: [ './usuarios.component.css']
})
export class UsuariosComponent {

  emailSeleccionado!: string;

  seccion:string = 'menu';
  tipoUsuarioARegistrar:string = '';

  cambiarSeccion(tipo:string)
  {
    this.seccion = 'seleccion';
    this.tipoUsuarioARegistrar = tipo;
  }

  volverMenuSeleccion()
{
  this.seccion = 'menu';
}
recibirPacienteSeleccionado(email: string) {
  this.emailSeleccionado = email;
}
  
}
