import { Routes } from '@angular/router';
import { BienvenidoComponent } from './componentes/bienvenido/bienvenido.component';
import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { ErrorComponent } from './componentes/error/error.component';
import { UsuariosComponent } from './componentes/usuarios/usuarios.component';
import { MiPerfilComponent } from './componentes/mi-perfil/mi-perfil.component';
import { MisTurnosComponent } from './componentes/mis-turnos/mis-turnos.component';
import { CrearTurnoComponent } from './componentes/crear-turno/crear-turno.component';
import { HistoriaClinicaComponent } from './componentes/historia-clinica/historia-clinica.component';
import { MisPacientesComponent } from './componentes/mis-pacientes/mis-pacientes.component';
import { EstadisticasComponent } from './componentes/estadisticas/estadisticas.component';
import { TurnosEspecialidadComponent } from './componentes/turnos-especialidad/turnos-especialidad.component';
import { authGuard } from './guards/auth.guard';
import { isLoginGuard } from './guards/is-login.guard';


export const routes: Routes = [

  {path: '', redirectTo: '/bienvenido', pathMatch: 'full'},
  { path: 'bienvenido', component: BienvenidoComponent, data: { animation: 'BienvenidoPage' } },
  { path: 'login', component: LoginComponent, data: { animation: 'LoginPage' } },
  { path: 'registro', loadComponent:()=> import('./componentes/registro/registro.component').then((c) => c.RegistroComponent), data: { animation: 'RegistroPage' } },
  { path: 'usuarios', component: UsuariosComponent, canActivate:[authGuard,isLoginGuard], data: { animation: 'UsuariosPage' } },
  { path: 'perfil', component: MiPerfilComponent, data: { animation: 'PerfilPage' } },
  { path: 'turnos',canActivate:[isLoginGuard], component: MisTurnosComponent, data: { animation: 'TurnosPage' } },
  { path: 'crearTurno',canActivate:[isLoginGuard], component: CrearTurnoComponent, data: { animation: 'CrearTurnoPage' } },
  { path: 'historial',canActivate:[isLoginGuard], component: HistoriaClinicaComponent, data: { animation: 'HistorialPage' } },
  { path: 'pacientes',canActivate:[isLoginGuard], component: MisPacientesComponent, data: { animation: 'PacientesPage' } },
  { path: 'estadisticas',loadComponent:()=> import('./componentes/estadisticas/estadisticas.component').then((c) => c.EstadisticasComponent),canActivate:[authGuard,isLoginGuard], data: { animation: 'EstadisticasPage' } },
  { path: '**', component: ErrorComponent, data: { animation: 'ErrorPage' } }

];
