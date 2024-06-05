import { Component } from '@angular/core';
import { TablaUsuariosComponent } from "../tabla-usuarios/tabla-usuarios.component";
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-usuarios',
    standalone: true,
    templateUrl: './usuarios.component.html',
    styleUrl: './usuarios.component.css',
    imports: [TablaUsuariosComponent, RouterOutlet]
})
export class UsuariosComponent {

}
