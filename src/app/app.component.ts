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
      // Bienvenido <=> Login: Fade cruzado
      transition('BienvenidoPage <=> LoginPage', [
        query(':enter, :leave', [
          style({
            position: 'absolute',
            width: '100%',
            opacity: 1
          })
        ], { optional: true }),
        group([
          query(':enter', [
            style({ opacity: 0 }),
            animate('500ms ease-in-out', style({ opacity: 1 }))
          ], { optional: true }),
          query(':leave', [
            animate('500ms ease-in-out', style({ opacity: 0 }))
          ], { optional: true })
        ])
      ]),
      
      // Login <=> Registro: Deslizamiento desde la derecha
      transition('LoginPage <=> RegistroPage', [
        query(':enter, :leave', [
          style({
            position: 'absolute',
            width: '100%'
          })
        ], { optional: true }),
        group([
          query(':enter', [
            style({ transform: 'translateX(100%)' }),
            animate('500ms ease-out', style({ transform: 'translateX(0)' }))
          ], { optional: true }),
          query(':leave', [
            animate('500ms ease-out', style({ transform: 'translateX(-100%)' }))
          ], { optional: true })
        ])
      ]),
      
      // Bienvenido <=> Registro: Escala con superposición
      transition('BienvenidoPage <=> RegistroPage', [
        query(':enter, :leave', [
          style({
            position: 'absolute',
            width: '100%'
          })
        ], { optional: true }),
        group([
          query(':enter', [
            style({ opacity: 0, transform: 'scale(0.8)' }),
            animate('500ms ease-in-out', style({ opacity: 1, transform: 'scale(1)' }))
          ], { optional: true }),
          query(':leave', [
            animate('500ms ease-in-out', style({ opacity: 0 }))
          ], { optional: true })
        ])
      ]),
      
      // Login => Usuarios: Deslizamiento desde abajo
      transition('LoginPage => UsuariosPage', [
        query(':enter, :leave', [
          style({
            position: 'absolute',
            width: '100%'
          })
        ], { optional: true }),
        group([
          query(':enter', [
            style({ transform: 'translateY(100%)' }),
            animate('500ms ease-out', style({ transform: 'translateY(0)' }))
          ], { optional: true }),
          query(':leave', [
            animate('500ms ease-out', style({ opacity: 0 }))
          ], { optional: true })
        ])
      ]),
      
      // Usuarios => Login: Deslizamiento hacia abajo
      transition('UsuariosPage => LoginPage', [
        query(':enter, :leave', [
          style({
            position: 'absolute',
            width: '100%'
          })
        ], { optional: true }),
        group([
          query(':enter', [
            style({ opacity: 0 }),
            animate('500ms ease-in', style({ opacity: 1 }))
          ], { optional: true }),
          query(':leave', [
            animate('500ms ease-in', style({ transform: 'translateY(100%)' }))
          ], { optional: true })
        ])
      ]),
      
      // Login => Perfil: Zoom in con rotación
      transition('LoginPage => PerfilPage', [
        query(':enter, :leave', [
          style({
            position: 'absolute',
            width: '100%'
          })
        ], { optional: true }),
        group([
          query(':enter', [
            style({ opacity: 0, transform: 'scale(0.5) rotate(-10deg)' }),
            animate('500ms ease-out', style({ opacity: 1, transform: 'scale(1) rotate(0)' }))
          ], { optional: true }),
          query(':leave', [
            animate('500ms ease-out', style({ opacity: 0 }))
          ], { optional: true })
        ])
      ]),
      
      // Perfil => Login: Zoom out
      transition('PerfilPage => LoginPage', [
        query(':enter, :leave', [
          style({
            position: 'absolute',
            width: '100%'
          })
        ], { optional: true }),
        group([
          query(':enter', [
            style({ opacity: 0 }),
            animate('500ms ease-in', style({ opacity: 1 }))
          ], { optional: true }),
          query(':leave', [
            animate('500ms ease-in', style({ opacity: 0, transform: 'scale(0.5)' }))
          ], { optional: true })
        ])
      ]),
      
      // Perfil <=> Turnos: Deslizamiento vertical
      transition('PerfilPage <=> TurnosPage', [
        query(':enter, :leave', [
          style({
            position: 'absolute',
            width: '100%'
          })
        ], { optional: true }),
        group([
          query(':enter', [
            style({ transform: 'translateY(-100%)' }),
            animate('500ms ease-out', style({ transform: 'translateY(0)' }))
          ], { optional: true }),
          query(':leave', [
            animate('500ms ease-out', style({ transform: 'translateY(100%)' }))
          ], { optional: true })
        ])
      ]),
      
      // Turnos <=> CrearTurno: Escala con bounce
      transition('TurnosPage <=> CrearTurnoPage', [
        query(':enter, :leave', [
          style({
            position: 'absolute',
            width: '100%'
          })
        ], { optional: true }),
        group([
          query(':enter', [
            style({ opacity: 0, transform: 'scale(0.3)' }),
            animate('500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)', style({ opacity: 1, transform: 'scale(1)' }))
          ], { optional: true }),
          query(':leave', [
            animate('500ms ease-out', style({ opacity: 0 }))
          ], { optional: true })
        ])
      ]),
      
      // Perfil <=> CrearTurno: Deslizamiento horizontal
      transition('PerfilPage <=> CrearTurnoPage', [
        query(':enter, :leave', [
          style({
            position: 'absolute',
            width: '100%'
          })
        ], { optional: true }),
        group([
          query(':enter', [
            style({ transform: 'translateX(-100%)' }),
            animate('500ms ease-out', style({ transform: 'translateX(0)' }))
          ], { optional: true }),
          query(':leave', [
            animate('500ms ease-out', style({ transform: 'translateX(100%)' }))
          ], { optional: true })
        ])
      ]),
      
      // Perfil <=> Historial: Flip horizontal 3D
      transition('PerfilPage <=> HistorialPage', [
        query(':enter, :leave', [
          style({
            position: 'absolute',
            width: '100%'
          })
        ], { optional: true }),
        group([
          query(':enter', [
            style({ opacity: 0, transform: 'perspective(400px) rotateY(90deg)' }),
            animate('500ms ease-out', style({ opacity: 1, transform: 'perspective(400px) rotateY(0)' }))
          ], { optional: true }),
          query(':leave', [
            animate('500ms ease-out', style({ opacity: 0 }))
          ], { optional: true })
        ])
      ]),
      
      // Turnos <=> Historial: Deslizamiento diagonal
      transition('TurnosPage <=> HistorialPage', [
        query(':enter, :leave', [
          style({
            position: 'absolute',
            width: '100%'
          })
        ], { optional: true }),
        group([
          query(':enter', [
            style({ opacity: 0, transform: 'translate(-50%, -50%) scale(0.8)' }),
            animate('500ms ease-out', style({ opacity: 1, transform: 'translate(0, 0) scale(1)' }))
          ], { optional: true }),
          query(':leave', [
            animate('500ms ease-out', style({ opacity: 0 }))
          ], { optional: true })
        ])
      ]),
      
      // Perfil <=> Pacientes: Rotación con escala
      transition('PerfilPage <=> PacientesPage', [
        query(':enter, :leave', [
          style({
            position: 'absolute',
            width: '100%'
          })
        ], { optional: true }),
        group([
          query(':enter', [
            style({ opacity: 0, transform: 'rotate(-180deg) scale(0.5)' }),
            animate('600ms ease-in-out', style({ opacity: 1, transform: 'rotate(0) scale(1)' }))
          ], { optional: true }),
          query(':leave', [
            animate('600ms ease-in-out', style({ opacity: 0 }))
          ], { optional: true })
        ])
      ]),
      
      // Pacientes <=> Historial: Deslizamiento con bounce
      transition('PacientesPage <=> HistorialPage', [
        query(':enter, :leave', [
          style({
            position: 'absolute',
            width: '100%'
          })
        ], { optional: true }),
        group([
          query(':enter', [
            style({ transform: 'translateX(100%)' }),
            animate('500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)', style({ transform: 'translateX(0)' }))
          ], { optional: true }),
          query(':leave', [
            animate('500ms ease-out', style({ transform: 'translateX(-100%)' }))
          ], { optional: true })
        ])
      ]),
      
      // Usuarios <=> Estadisticas: Flip vertical 3D
      transition('UsuariosPage <=> EstadisticasPage', [
        query(':enter, :leave', [
          style({
            position: 'absolute',
            width: '100%'
          })
        ], { optional: true }),
        group([
          query(':enter', [
            style({ opacity: 0, transform: 'perspective(400px) rotateX(90deg)' }),
            animate('500ms ease-out', style({ opacity: 1, transform: 'perspective(400px) rotateX(0)' }))
          ], { optional: true }),
          query(':leave', [
            animate('500ms ease-out', style({ opacity: 0 }))
          ], { optional: true })
        ])
      ]),
      
      // Perfil <=> Estadisticas: Rotación completa
      transition('PerfilPage <=> EstadisticasPage', [
        query(':enter, :leave', [
          style({
            position: 'absolute',
            width: '100%'
          })
        ], { optional: true }),
        group([
          query(':enter', [
            style({ opacity: 0, transform: 'scale(0.3) rotate(180deg)' }),
            animate('600ms ease-out', style({ opacity: 1, transform: 'scale(1) rotate(0)' }))
          ], { optional: true }),
          query(':leave', [
            animate('600ms ease-out', style({ opacity: 0 }))
          ], { optional: true })
        ])
      ]),
      
      // Estadisticas <=> Pacientes: Deslizamiento vertical
      transition('EstadisticasPage <=> PacientesPage', [
        query(':enter, :leave', [
          style({
            position: 'absolute',
            width: '100%'
          })
        ], { optional: true }),
        group([
          query(':enter', [
            style({ transform: 'translateY(-100%)' }),
            animate('500ms ease-out', style({ transform: 'translateY(0)' }))
          ], { optional: true }),
          query(':leave', [
            animate('500ms ease-out', style({ transform: 'translateY(100%)' }))
          ], { optional: true })
        ])
      ]),
      
      // Cualquier página => ErrorPage: Shake effect
      transition('* => ErrorPage', [
        query(':enter, :leave', [
          style({
            position: 'absolute',
            width: '100%'
          })
        ], { optional: true }),
        query(':enter', [
          style({ opacity: 0, transform: 'translateX(0)' }),
          animate('100ms', style({ transform: 'translateX(-10px)' })),
          animate('100ms', style({ transform: 'translateX(10px)' })),
          animate('100ms', style({ transform: 'translateX(-10px)' })),
          animate('100ms', style({ transform: 'translateX(10px)' })),
          animate('200ms', style({ opacity: 1, transform: 'translateX(0)' }))
        ], { optional: true })
      ]),
      
      // ErrorPage => Cualquier página: Fade out rápido
      transition('ErrorPage => *', [
        query(':enter, :leave', [
          style({
            position: 'absolute',
            width: '100%'
          })
        ], { optional: true }),
        group([
          query(':enter', [
            style({ opacity: 0 }),
            animate('300ms ease-in', style({ opacity: 1 }))
          ], { optional: true }),
          query(':leave', [
            animate('300ms ease-in', style({ opacity: 0 }))
          ], { optional: true })
        ])
      ]),
      
      // Transición por defecto: Deslizamiento horizontal
      transition('* <=> *', [
        query(':enter, :leave', [
          style({
            position: 'absolute',
            width: '100%'
          })
        ], { optional: true }),
        group([
          query(':enter', [
            style({ transform: 'translateX(100%)' }),
            animate('500ms ease-out', style({ transform: 'translateX(0)' }))
          ], { optional: true }),
          query(':leave', [
            animate('500ms ease-out', style({ transform: 'translateX(-100%)' }))
          ], { optional: true })
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
