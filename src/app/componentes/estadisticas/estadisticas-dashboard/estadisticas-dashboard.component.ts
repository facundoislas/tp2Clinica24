import { Component } from '@angular/core';

@Component({
  selector: 'app-estadisticas-dashboard',
  templateUrl: './estadisticas-dashboard.component.html',
  styleUrls: ['./estadisticas-dashboard.component.css']
})
export class EstadisticasDashboardComponent {

  estadisticas = [
    {
      titulo: 'Log de Ingresos',
      descripcion: 'Visualiza el historial de accesos al sistema',
      icono: 'fa-sign-in-alt',
      ruta: 'log-ingresos',
      color: '#20c997'
    },
    {
      titulo: 'Turnos por Especialidad',
      descripcion: 'Análisis de turnos agrupados por especialidad médica',
      icono: 'fa-chart-bar',
      ruta: 'turnos-especialidad',
      color: '#0dcaf0'
    },
    {
      titulo: 'Turnos por Médico',
      descripcion: 'Estadísticas de turnos por especialista',
      icono: 'fa-user-md',
      ruta: 'turnos-por-medico',
      color: '#6f42c1'
    },
    {
      titulo: 'Turnos por Día',
      descripcion: 'Visualización de la cantidad de turnos agendados por día',
      icono: 'fa-calendar-day',
      ruta: 'turnos-por-dia',
      color: '#198754'
    }
  ];

}

