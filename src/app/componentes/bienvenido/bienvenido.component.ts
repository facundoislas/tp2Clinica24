import { Component } from '@angular/core';
import { CabeceraComponent } from "../cabecera/cabecera.component";
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-bienvenido',
  standalone: true,
  imports: [CabeceraComponent, CommonModule, RouterLink],
  templateUrl: './bienvenido.component.html',
  styleUrls: ['./bienvenido.component.css'],
  animations: [
  ]
})
export class BienvenidoComponent {
  imagen1= "./../../../assets/imagenes/login.png";

  public loading = true;
  user = null;
}
