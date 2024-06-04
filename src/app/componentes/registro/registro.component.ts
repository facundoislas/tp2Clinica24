import { Component } from '@angular/core';
import { FormPacienteComponent } from "../form-paciente/form-paciente.component";
import { FormEspecialistaComponent } from "../form-especialista/form-especialista.component";
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-registro',
    standalone: true,
    templateUrl: './registro.component.html',
    styleUrl: './registro.component.css',
    imports: [FormPacienteComponent, FormEspecialistaComponent, CommonModule]
})
export class RegistroComponent {

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

}
