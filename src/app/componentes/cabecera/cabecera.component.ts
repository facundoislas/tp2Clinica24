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
    
    this.authSubscription = this.auth.isAuthenticated$.subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
    });
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.email = sessionStorage.getItem('user')

    setTimeout(()=>{
    },2500);
        // Forzar la detección de cambios si es necesario
        this.isAuthenticated = !!sessionStorage.getItem('user');
        console.log("entre ", this.isAuthenticated)
        this.searchUser();
        console.log(this.email)
      }
    });
  }

  async searchUser() {
    console.log("entre aca")
    this.usuario = await this.firebaseService.getUsuarioEmail(this.email);

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
        this.router.navigate(['/bienvenida']);
        localStorage.clear();
      })
      .catch((err) => {});
    }, 1000);
  }
  
   
}
