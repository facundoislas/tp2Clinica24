import { Component } from '@angular/core';
import { NgxChartsModule, ScaleType, Color } from '@swimlane/ngx-charts';
import { TurnosService } from '../../servicios/turnos.service';


@Component({
  selector: 'app-turnos-por-medico-finalizados',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './turnos-por-medico-finalizados.component.html',
  styleUrl: './turnos-por-medico-finalizados.component.css'
})
export class TurnosPorMedicoFinalizadosComponent {

  data: any[] = [];

  constructor(private turnosServ: TurnosService) { }

  ngOnInit(): void {
    this.turnosServ.getTurnosPorEspecialistaFinalizados().subscribe(data => {
      setTimeout(() => { // Introduce un retraso en la actualización de datos
        this.data = data;
      }, 1000); // Retraso de 1 segundo
   });
  }

}
