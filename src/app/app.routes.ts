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


export const routes: Routes = [

    {path:'', component: BienvenidoComponent},
    {path:'bienvenido', component: BienvenidoComponent},
    {path:'login', component: LoginComponent},
    {path:'registro', component: RegistroComponent},
    {path:'usuarios', component: UsuariosComponent},
    {path:'perfil', component: MiPerfilComponent},
    {path:'turnos', component: MisTurnosComponent},
    {path:'crearTurno', component: CrearTurnoComponent},
    {path:'historial', component: HistoriaClinicaComponent},
    {path:'pacientes', component: MisPacientesComponent},
    {path:'estadisticas', component: EstadisticasComponent},
    {path:'**', component:ErrorComponent}

];
