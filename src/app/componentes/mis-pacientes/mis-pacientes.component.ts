import { Component } from '@angular/core';
import { CabeceraComponent } from "../cabecera/cabecera.component";
import { TablaPacientesComponent } from "../tabla-pacientes/tabla-pacientes.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HistoriaClinicaComponent } from "../historia-clinica/historia-clinica.component";

@Component({
  selector: 'app-mis-pacientes',
  standalone: true,
  imports: [CabeceraComponent, TablaPacientesComponent, FormsModule, CommonModule, HistoriaClinicaComponent, ],
  templateUrl: './mis-pacientes.component.html',
  styleUrls: [ './mis-pacientes.component.css']
})
export class MisPacientesComponent {

  emailSeleccionado!: string;

  recibirPacienteSeleccionado(email: string) {
    this.emailSeleccionado = email;
  }

}
