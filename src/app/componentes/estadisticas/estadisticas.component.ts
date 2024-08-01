import { Component } from '@angular/core';
import { CabeceraComponent } from "../cabecera/cabecera.component";
import { LogIngresosComponent } from "../log-ingresos/log-ingresos.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TurnosEspecialidadComponent } from "../turnos-especialidad/turnos-especialidad.component";
import { TurnosPorMedicoComponent } from "../turnos-por-medico/turnos-por-medico.component";
import { TurnosPorMedicoFinalizadosComponent } from "../turnos-por-medico-finalizados/turnos-por-medico-finalizados.component";

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CabeceraComponent, LogIngresosComponent, CommonModule, FormsModule, TurnosEspecialidadComponent, TurnosPorMedicoComponent, TurnosPorMedicoFinalizadosComponent],
  templateUrl: './estadisticas.component.html',
  styleUrls: [ './estadisticas.component.css']
})
export class EstadisticasComponent {

  showTableLog: boolean = false;
  showTableEst: boolean = false;
  showTableEstMed: boolean = false;
  showTableEstMedFin: boolean = false;
  constructor()
  {}

  toggleTable(): void {
    this.showTableLog = !this.showTableLog;
  }

  toggleTable2(): void {
    this.showTableEst = !this.showTableEst;
  }
  toggleTable3(): void {
    this.showTableEstMed = !this.showTableEstMed;
  }

  toggleTable4(): void {
    this.showTableEstMedFin = !this.showTableEstMedFin;
  }

}
