import { Routes } from '@angular/router';
import { BienvenidoComponent } from './componentes/bienvenido/bienvenido.component';
import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { ErrorComponent } from './componentes/error/error.component';
import { UsuariosComponent } from './componentes/usuarios/usuarios.component';

export const routes: Routes = [

    {path:'', component: BienvenidoComponent},
    {path:'bienvenido', component: BienvenidoComponent},
    {path:'login', component: LoginComponent},
    {path:'registro', component: RegistroComponent},
    {path:'usuarios', component: UsuariosComponent},


    {path:'**', component:ErrorComponent}

];
