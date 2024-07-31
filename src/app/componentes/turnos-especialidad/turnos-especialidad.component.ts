import { Component } from '@angular/core';
import { TurnosService } from '../../servicios/turnos.service';
import { Especialidad } from '../../clases/especialidad';
import { Especialista } from '../../clases/especialista';
import { Turno } from '../../clases/turno';
import { FirebaseService } from '../../servicios/firebase.service';
import { EspecialidadesService } from '../../servicios/especialidades.service';
import { CommonModule, NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-turnos-especialidad',
  standalone: true,
  imports: [NgStyle, CommonModule, FormsModule],
  templateUrl: './turnos-especialidad.component.html',
  styleUrl: './turnos-especialidad.component.css'
})
export class TurnosEspecialidadComponent {
  especialidades: { nombre: string, porcentaje: number, color: string }[] = [];

  constructor(private turnoService: TurnosService, private especialidadesServ: EspecialidadesService) {}

  ngOnInit(): void {
    
    
    this.especialidadesServ.getEspecialidades().subscribe(especialidades => {
      this.turnoService.getTurnosDB().subscribe(turnos => {
        const especialidadTurnos = especialidades.map(especialidad => {
          const turnosPorEspecialidad = turnos.filter(turno => turno.especialidad === especialidad.especialidad);
          return {
            nombre: especialidad.especialidad,
            porcentaje: (turnosPorEspecialidad.length / turnos.length) * 100,
            color: this.getRandomColor(),  // Puedes usar una función para generar colores aleatorios
            
          };         

        });
        
        setTimeout(()=>{
        },3500);
        this.especialidades = especialidadTurnos;
        console.log(especialidadTurnos);
      });
    });
  }

  private getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
