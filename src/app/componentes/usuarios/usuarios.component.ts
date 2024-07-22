import { Component } from '@angular/core';
import { TablaUsuariosComponent } from "../tabla-usuarios/tabla-usuarios.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CabeceraComponent } from "../cabecera/cabecera.component";
import { FormAdminComponent } from "../form-admin/form-admin.component";

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [TablaUsuariosComponent, FormsModule, CommonModule, CabeceraComponent, FormAdminComponent],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {

  
  seccion:string = 'menu';
  tipoUsuarioARegistrar:string = '';

  cambiarSeccion(tipo:string)
  {
    this.seccion = 'seleccion';
    this.tipoUsuarioARegistrar = tipo;
  }

  volverMenuSeleccion()
{
  this.seccion = 'menu';
}

  
}
