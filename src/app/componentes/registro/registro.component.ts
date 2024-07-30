import { Component } from '@angular/core';
import { CabeceraComponent } from "../cabecera/cabecera.component";
import { FormPacienteComponent } from "../form-paciente/form-paciente.component";
import { FormEspecialistaComponent } from "../form-especialista/form-especialista.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CabeceraComponent, FormPacienteComponent, FormEspecialistaComponent, FormsModule, CommonModule],
  templateUrl: './registro.component.html',
  styleUrls: [ './registro.component.css']
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
