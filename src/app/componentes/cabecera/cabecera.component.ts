import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Usuario } from '../../clases/usuario';
import { AuthService } from '../../servicios/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FirebaseService } from '../../servicios/firebase.service';

@Component({
  selector: 'app-cabecera',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cabecera.component.html',
  styleUrls: ['./cabecera.component.css']
})
export class CabeceraComponent {

  
  @Input() items: { label: string, link: string }[] = [];
  usuario!: any;
  @Input() showButtons : boolean = true;
  @Output() loadingEvent = new EventEmitter<boolean>();
  @Output() userEvent = new EventEmitter<any|null>()
  isAuthenticated: boolean = false;
  private authSubscription!: Subscription;
  private routerSubscription!: Subscription;
  email!:any

  constructor(private router : Router, private auth: AuthService, private firebaseService: FirebaseService) {
  }
  
  ngOnInit(): void {
    // Verificar estado inicial
    this.checkAuthenticationState();
    
    // Suscribirse a cambios de autenticación
    this.authSubscription = this.auth.isAuthenticated$.subscribe(isAuthenticated => {
      console.log("Cambio en estado de autenticación:", isAuthenticated);
      this.isAuthenticated = isAuthenticated;
      if (isAuthenticated) {
        this.loadUserData();
      } else {
        this.usuario = null;
      }
    });
    
    // Verificar en cada cambio de ruta
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log("Navegación detectada, verificando autenticación");
        this.checkAuthenticationState();
      }
    });
  }

  checkAuthenticationState() {
    this.email = sessionStorage.getItem('user');
    this.isAuthenticated = !!this.email;
    
    console.log("Estado de autenticación:", this.isAuthenticated);
    console.log("Email del usuario:", this.email);
    
    if (this.isAuthenticated) {
      this.loadUserData();
    } else {
      this.usuario = null;
    }
  }

  loadUserData() {
    // Intentar cargar desde sessionStorage primero
    const userDataString = sessionStorage.getItem('userData');
    if (userDataString) {
      try {
        this.usuario = JSON.parse(userDataString);
        console.log("✅ Usuario cargado desde sessionStorage en cabecera:", this.usuario);
        console.log("Tipo de usuario en cabecera:", this.usuario?.tipo);
      } catch (error) {
        console.error("Error al parsear userData:", error);
        if (this.email) {
          this.searchUser();
        }
      }
    } else if (this.email) {
      // Si no hay datos en sessionStorage, buscar en Firebase
      console.log("⚠️ No hay userData en sessionStorage, buscando en Firebase");
      this.searchUser();
    }
  }

  async searchUser() {
    console.log("Buscando usuario en Firebase con email:", this.email);
    this.usuario = await this.firebaseService.getUsuarioEmail(this.email);
    if (this.usuario) {
      console.log("✅ Usuario encontrado en Firebase:", this.usuario);
      // Guardar en sessionStorage para futuras referencias
      sessionStorage.setItem('userData', JSON.stringify(this.usuario));
    } else {
      console.error("❌ No se encontró usuario en Firebase");
    }
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  loguot() {
    this.loadingEvent.emit(true);
    setTimeout(() => {
      this.auth
      .logout()
      .then((e) => {
        this.usuario = null;
        this.userEvent.emit(null);
        this.loadingEvent.emit(false);
        this.router.navigate(['/bienvenido']);
        localStorage.clear();
        sessionStorage.clear();
      })
      .catch((err) => {});
    }, 1000);
  }
  
   
}
