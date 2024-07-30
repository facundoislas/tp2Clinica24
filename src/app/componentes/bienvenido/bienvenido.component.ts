import { Component } from '@angular/core';
import { CabeceraComponent } from "../cabecera/cabecera.component";
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-bienvenido',
  standalone: true,
  imports: [CabeceraComponent, CommonModule, RouterLink],
  templateUrl: './bienvenido.component.html',
  styleUrls: ['./bienvenido.component.css'],
  animations: [
    trigger('slideUp', [
      transition(':enter', [
        style({ transform: 'translateY(100%)' }),
        animate('600ms ease', style({ transform: 'translateY(0%)' })),
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0%)' }),
        animate('600ms ease', style({ transform: 'translateY(-100%)' })),
      ]),
    ])
  ]
})
export class BienvenidoComponent {
  public loading = true;
  user = null;
}
