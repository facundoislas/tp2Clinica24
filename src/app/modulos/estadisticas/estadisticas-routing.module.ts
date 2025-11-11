import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EstadisticasComponent } from '../../componentes/estadisticas/estadisticas.component';
import { EstadisticasDashboardComponent } from '../../componentes/estadisticas/estadisticas-dashboard/estadisticas-dashboard.component';
import { LogIngresosComponent } from '../../componentes/log-ingresos/log-ingresos.component';
import { TurnosEspecialidadComponent } from '../../componentes/turnos-especialidad/turnos-especialidad.component';
import { TurnosPorMedicoComponent } from '../../componentes/turnos-por-medico/turnos-por-medico.component';
import { TurnosPorMedicoFinalizadosComponent } from '../../componentes/turnos-por-medico-finalizados/turnos-por-medico-finalizados.component';

const routes: Routes = [
  {
    path: '',
    component: EstadisticasComponent,
    children: [
      { path: '', component: EstadisticasDashboardComponent },
      { path: 'log-ingresos', component: LogIngresosComponent },
      { path: 'turnos-especialidad', component: TurnosEspecialidadComponent },
      { path: 'turnos-por-medico', component: TurnosPorMedicoComponent },
      { path: 'turnos-por-dia', component: TurnosPorMedicoFinalizadosComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstadisticasRoutingModule { }


