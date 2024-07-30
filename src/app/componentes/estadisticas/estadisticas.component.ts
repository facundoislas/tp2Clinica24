import { Component } from '@angular/core';
import { CabeceraComponent } from "../cabecera/cabecera.component";
import { LogIngresosComponent } from "../log-ingresos/log-ingresos.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CabeceraComponent, LogIngresosComponent, CommonModule, FormsModule],
  templateUrl: './estadisticas.component.html',
  styleUrls: [ './estadisticas.component.css']
})
export class EstadisticasComponent {

  showTableLog: boolean = false;

  constructor()
  {}

  toggleTable(): void {
    this.showTableLog = !this.showTableLog;
  }

}
