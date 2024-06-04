import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { interval } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

    
  tipoUser!:string;
  user= { email : '', password : ''};
  Mensaje!:string;
  semuestra!:boolean;
  progreso!: number;
  progresoMensaje="esperando..."; 
  logeando=true;
  logueado!:boolean;
  ProgresoDeAncho!:string;
 

  clase="progress-bar progress-bar-info progress-bar-striped ";
  subscription: any;

  constructor(
    private router: Router,
    public authService : AuthService,
    private firestore: Firestore) {
      
      this.progreso=0;
      this.ProgresoDeAncho="0%";
      const session = sessionStorage.getItem('user');
    

          if(session==null)
          {
          this.logueado=false;
          }
          else{
          this.logueado=true;  
          }
  }

  ngOnInit() {
    sessionStorage.clear();
  }

  async entrar()
  {
    

		const user = this.authService.login(this.user.email, this.user.password);
    this.MoverBarraDeProgreso();
		if (await user) {
      //this.mostrarSpinner = true;
      await new Promise(resolve => setTimeout(resolve, 2500));
      sessionStorage.setItem("user",this.user.email);
      sessionStorage.setItem("muestra","true");
			//this.router.navigateByUrl('/home', { replaceUrl: true });
      //this.guardarLogLogin();
      
      
		} else {
			this.MostarMensaje("Usuario o Clave incorrectos", true);
      this.borrar();
      this.logeando=true;
		} 
  
    //this.mostrarSpinner = false;
  }

  /*guardarLogLogin()
  {
    const col= collection(this.firestore, 'logueos');
    addDoc(col, {email: this.user.email, fecha: Date.now()})
  }*/

  MoverBarraDeProgreso() {

    this.progreso=0;
    this.ProgresoDeAncho="0%";
    
    this.logeando=false;
    this.clase="progress-bar progress-bar-danger progress-bar-striped active";
    this.progresoMensaje="Iniciando comprobacion"; 
    let timer = interval(30);
    this.subscription = timer.subscribe(t => {
      this.progreso=this.progreso+1;
      this.ProgresoDeAncho=this.progreso+15+"%";
      switch (this.progreso) {
        case 15:
        this.clase="progress-bar progress-bar-warning progress-bar-striped active";
        this.progresoMensaje="Verificando Usuario..."; 
          break;
        case 30:
          this.clase="progress-bar progress-bar-Info progress-bar-striped active";
          this.progresoMensaje="Verificando contraseña.."; 
          break;
          case 60:
          this.clase="progress-bar progress-bar-success progress-bar-striped active";
          this.progresoMensaje="Recompilando Info del dispositivo..";
          break;
          case 75:
          this.clase="progress-bar progress-bar-success progress-bar-striped active";
          this.progresoMensaje="Desencriptacion de clave ..";
          break;
          case 85:
          this.clase="progress-bar progress-bar-success progress-bar-striped active";
          this.progresoMensaje="Clave ok, ingresando..";
          break;
          
        case 100:
          console.log("final");
          this.subscription.unsubscribe();
          break;
      }     
    });
    //this.logeando=true;
  }

  borrar()
    {
      this.user.email='';
      this.user.password='';
    }

    admin()
    {
      this.user.email="admin@clinica.com";
        this.user.password="111111";
    }

    usuario()
    {
      this.user.email="especialista1@clinica.com";
        this.user.password="222222";
    }

    paciente()
    {
      this.user.email="paciente1@hotmail.com";
      this.user.password="333333";
    }


    MostarMensaje(mensaje:string,gano:boolean) {
      this.Mensaje = mensaje;
     var x = document.getElementById("snackbar");
     if(gano)
         x!.className = "show Ganador";
     var modelo = this;
     setTimeout(function(){ 
       x!.className = x!.className.replace("show", "");
       //modelo.ocultarVerificar=false;
      }, 3500);
  
  
    }


}
