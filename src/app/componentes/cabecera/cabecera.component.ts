import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-cabecera',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cabecera.component.html',
  styleUrl: './cabecera.component.css'
})
export class CabeceraComponent {

  logueado!:boolean;
  nombre!:string;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService
    ) 
    {
     }
verificarSesion()
{
  const session = sessionStorage.getItem('user');

        
      if(session==null)
      {
      return false;
      }
      else{
        this.nombre= session;
      return true;  
      }
}

cerrarSesion(){

this.auth.logout();
sessionStorage.clear();
this.logueado=false;
this.router.navigate(['/login']);
console.log("Se cierra sesion");
}

ngOnInit() {
}

}
