import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { RouterModule } from '@angular/router';

import { EstadisticasRoutingModule } from './estadisticas-routing.module';
import { EstadisticasComponent } from '../../componentes/estadisticas/estadisticas.component';
import { EstadisticasDashboardComponent } from '../../componentes/estadisticas/estadisticas-dashboard/estadisticas-dashboard.component';
import { LogIngresosComponent } from '../../componentes/log-ingresos/log-ingresos.component';
import { TurnosEspecialidadComponent } from '../../componentes/turnos-especialidad/turnos-especialidad.component';
import { TurnosPorMedicoComponent } from '../../componentes/turnos-por-medico/turnos-por-medico.component';
import { TurnosPorMedicoFinalizadosComponent } from '../../componentes/turnos-por-medico-finalizados/turnos-por-medico-finalizados.component';
import { CabeceraComponent } from '../../componentes/cabecera/cabecera.component';
import { FormatoFechaPipe } from '../../pipes/formato-fecha.pipe';
import { PaginacionPipe } from '../../pipes/paginacion.pipe';

@NgModule({
  declarations: [
    EstadisticasComponent,
    EstadisticasDashboardComponent,
    LogIngresosComponent,
    TurnosEspecialidadComponent,
    TurnosPorMedicoComponent,
    TurnosPorMedicoFinalizadosComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgxChartsModule,
    EstadisticasRoutingModule,
    CabeceraComponent,
    FormatoFechaPipe,
    PaginacionPipe
  ]
})
export class EstadisticasModule { }

