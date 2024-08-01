import { Component } from '@angular/core';
import { NgxChartsModule, ScaleType, Color } from '@swimlane/ngx-charts';
import { TurnosService } from '../../servicios/turnos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-turnos-por-medico',
  standalone: true,
  imports: [NgxChartsModule, CommonModule,FormsModule],
  templateUrl: './turnos-por-medico.component.html',
  styleUrl: './turnos-por-medico.component.css'
})
export class TurnosPorMedicoComponent {

  data: any[] = [];
  startDate: Date | null = null;
  endDate: Date | null = null;

  constructor(private turnosServ: TurnosService) { }

  ngOnInit(): void {
    this.turnosServ.getTurnosPorEspecialista().subscribe(data => {
      setTimeout(() => { // Introduce un retraso en la actualización de datos
        this.data = data;
      }, 1000); // Retraso de 1 segundo
   });
  }

}
