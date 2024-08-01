import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { trigger, transition, style, animate, query, group } from '@angular/animations';
import { CabeceraComponent } from "./componentes/cabecera/cabecera.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CabeceraComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [
    trigger('routeAnimations', [
      transition('BienvenidoPage <=> LoginPage', [
        style({ opacity: 0 }),
        animate('600ms', style({ opacity: 1 }))
      ]),
      transition('RegistroPage <=> UsuariosPage', [
        style({ transform: 'translateX(-100%)' }),
        animate('600ms', style({ transform: 'translateX(0)' }))
      ]),
      transition('PerfilPage <=> TurnosPage', [
        style({ transform: 'translateY(-100%)' }),
        animate('600ms', style({ transform: 'translateY(0)' }))
      ]),
      transition('CrearTurnoPage <=> HistorialPage', [
        style({ opacity: 0, transform: 'scale(0.5)' }),
        animate('600ms', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition('PacientesPage <=> EstadisticasPage', [
        style({ opacity: 0, transform: 'rotate(-360deg)' }),
        animate('600ms', style({ opacity: 1, transform: 'rotate(0)' }))
      ]),
      transition('* <=> ErrorPage', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('600ms', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition('* <=> *', [
        query(':enter, :leave', style({ position: 'fixed', width: '100%' })),
        group([
          query(':enter', [
            style({ transform: 'translateX(100%)' }),
            animate('600ms ease-out', style({ transform: 'translateX(0%)' }))
          ]),
          query(':leave', [
            style({ transform: 'translateX(0%)' }),
            animate('600ms ease-out', style({ transform: 'translateX(-100%)' }))
          ])
        ])
      ])
    ])
  ]
})
export class AppComponent {
  title = 'tpclinica2024';

   prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
