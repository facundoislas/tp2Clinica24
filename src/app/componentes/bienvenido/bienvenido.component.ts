import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-bienvenido',
  standalone: true,
  imports: [RouterOutlet,RouterLink],
  templateUrl: './bienvenido.component.html',
  styleUrl: './bienvenido.component.css'
})
export class BienvenidoComponent {

}
