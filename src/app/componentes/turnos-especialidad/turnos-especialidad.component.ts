import { Component, NgZone } from '@angular/core';
import { TurnosService } from '../../servicios/turnos.service';
import { Especialidad } from '../../clases/especialidad';
import { Especialista } from '../../clases/especialista';
import { Turno } from '../../clases/turno';
import { FirebaseService } from '../../servicios/firebase.service';
import { EspecialidadesService } from '../../servicios/especialidades.service';
import { CommonModule, NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxChartsModule, ScaleType, Color } from '@swimlane/ngx-charts';






@Component({
  selector: 'app-turnos-especialidad',
  standalone: true,
  imports: [NgStyle, CommonModule, FormsModule,NgxChartsModule],
  templateUrl: './turnos-especialidad.component.html',
  styleUrl: './turnos-especialidad.component.css'
})
export class TurnosEspecialidadComponent {
    
    pieChartLabels: string[] = [];
    pieChartData: number[] = [];
    data: any[] = [];
    colorScheme: Color = { 
      domain: ['#2600ff', '#ff0000', '#fbff00', '#787c7d', '#a2c7eb'], 
      group: ScaleType.Ordinal, 
      selectable: true, 
      name: 'Customer Usage', 
  };

  
    constructor(private turnosService: TurnosService,private ngZone: NgZone) {    
    }
    ngOnInit(): void {
      this.turnosService.getTurnosPorEspecialidad().subscribe(data => {
        console.log("datos", data);
        // Verifica y filtra datos inválidos
        const validData = data
          .filter(item => item.especialidad && item.count !== undefined && item.count !== null)
          .map(item => ({
            name: item.especialidad,
            value: item.count
          }));
  
        // Usa setTimeout para permitir que los datos se carguen
        this.ngZone.runOutsideAngular(() => {
          setTimeout(() => {
            this.ngZone.run(() => {
              this.data = validData;
              console.log("data for chart", this.data);
            });
          }, 1000); // Puedes ajustar el tiempo de retraso según sea necesario
        });
      });
    }
}
