import { Component } from '@angular/core';
import { CabeceraComponent } from "../cabecera/cabecera.component";
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { Firestore } from '@angular/fire/firestore';
import { interval } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirebaseService } from '../../servicios/firebase.service';
import { AlertServiceService } from '../../servicios/alert-service.service';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CabeceraComponent, CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css']
})
export class LoginComponent {

  
  userData!: any;
  tipoUser!:string;
  user= { email : '', password : '', tipo: ''};
  Mensaje!:string;
  semuestra!:boolean;
  progreso!: number;
  progresoMensaje="esperando..."; 
  logeando=true;
  logueado!:boolean;
  ProgresoDeAncho!:string;
  formRegistro!:any;
 

  clase="progress-bar progress-bar-info progress-bar-striped ";
  subscription: any;

  constructor(
    private router: Router,
    public authService : AuthService,
    private firestore: Firestore, private fb: FormBuilder, private firebase: FirebaseService, private alert: AlertServiceService) {
      
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
          this.formRegistro = this.fb.group({
            usuario:['', [Validators.required, Validators.email]],
            pass:['', [Validators.required, Validators.minLength(6), Validators.maxLength(8)]],})
  }

 

  ngOnInit() {
    // Solo limpiar sessionStorage si no estamos autenticados
    const currentUser = sessionStorage.getItem('user');
    if (!currentUser) {
      sessionStorage.clear();
    }
  }

 

  async entrar()
  {
    if(this.formRegistro.valid){
    
    this.MoverBarraDeProgreso();
		const user = await this.authService.login(this.user.email, this.user.password);
    
		if (user && !(user as any).emailNoVerificado) {
      
      // Cargar datos del usuario desde Firebase
      this.userData = await this.firebase.getUsuarioEmail(this.user.email);
      console.log("email",this.userData.email)
      
      // Verificar que los datos se cargaron correctamente
      if(this.userData && this.userData.email) {
        
        // Validación específica para Especialistas
        if(this.userData.tipo === 'especialista') {
          if(!this.userData.aprobado) {
            this.alert.showSuccessAlert1("","Su cuenta aún no ha sido aprobada por un administrador","warning");
            this.borrar();
            this.logeando=true;
            await this.authService.logout();
            return;
          }
        }
        
        // Validación para Pacientes y Especialistas: email verificado (ya se valida en auth.service)
        // Si llegamos aquí, el email ya está verificado
        
        // Guardar TODOS los datos en sessionStorage ANTES de navegar
        sessionStorage.setItem("user",this.user.email);
        sessionStorage.setItem("muestra","true");
        sessionStorage.setItem("tipo",this.userData.tipo);
        sessionStorage.setItem("userData", JSON.stringify(this.userData));
        
        // Notificar al servicio de autenticación que hay datos
        this.authService.isAuthenticatedSubject.next(true);
        
        this.firebase.guardarLogLogin(this.user.email);
        
        console.log("Datos del usuario cargados:", this.userData);
        console.log("Tipo de usuario:", this.userData.tipo);
        
        // Pequeño delay para asegurar que sessionStorage se guardó
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Navegar según el tipo de usuario
        this.navegarSegunTipo();
      } else {
        console.error("No se pudieron cargar los datos del usuario");
        this.alert.showSuccessAlert1("","Error al cargar datos del usuario","error");
        this.borrar();
        this.logeando=true;
      }
      
		} else if (user && (user as any).emailNoVerificado) {
      // El mensaje ya se mostró en auth.service
      this.borrar();
      this.logeando=true;
    } else {
			this.alert.showSuccessAlert1("","Usuario o clave incorrectos","error")
      this.borrar();
      this.logeando=true;
		} 
  }
  }

  async navegarSegunTipo() {
    console.log("=== NAVEGACIÓN SEGÚN TIPO ===");
    console.log("userData completo:", this.userData);
    console.log("sessionStorage user:", sessionStorage.getItem('user'));
    console.log("sessionStorage tipo:", sessionStorage.getItem('tipo'));
    console.log("sessionStorage userData:", sessionStorage.getItem('userData'));
    
    if(this.userData) {
      switch(this.userData.tipo) {
        case 'admin':
          console.log("→ Navegando a usuarios (admin)");
          this.router.navigate(['/perfil']);
          break;
        case 'paciente':
          console.log("→ Navegando a perfil como paciente...");
          console.log("Datos del paciente:", {
            nombre: this.userData.nombre,
            apellido: this.userData.apellido,
            email: this.userData.email,
            tipo: this.userData.tipo
          });
          this.router.navigate(['/perfil']);
          break;
        case 'especialista':
          console.log("→ Navegando a perfil como especialista...");
          console.log("Datos del especialista:", {
            nombre: this.userData.nombre,
            apellido: this.userData.apellido,
            email: this.userData.email,
            tipo: this.userData.tipo,
            especialidades: this.userData.especialidad
          });
          this.router.navigate(['/perfil']);
          break;
        default:
          console.log("→ Tipo desconocido, navegando a bienvenido");
          this.router.navigate(['/bienvenido']);
          break;
      }
    } else {
      console.error("❌ userData es null o undefined");
    }
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
    let timer = interval(70); // Aumentado a 70ms para proceso más largo
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
          case 45:
          this.clase="progress-bar progress-bar-info progress-bar-striped active";
          this.progresoMensaje="Cargando datos del usuario..";
          break;
          case 60:
          this.clase="progress-bar progress-bar-info progress-bar-striped active";
          this.progresoMensaje="Sincronizando información..";
          break;
          case 75:
          this.clase="progress-bar progress-bar-success progress-bar-striped active";
          this.progresoMensaje="Configurando sesión..";
          break;
          case 85:
          this.clase="progress-bar progress-bar-success progress-bar-striped active";
          this.progresoMensaje="Preparando perfil..";
          break;
          case 95:
          this.clase="progress-bar progress-bar-success progress-bar-striped active";
          this.progresoMensaje="Finalizando acceso..";
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

    autoComplete(mail: string, pass: string){

      this.formRegistro.setValue({
        usuario: mail,
        pass: pass
      });
    }

    
   async mostrarFoto(email: string){
      await this.firebase.getUsuarioEmail(email).then(data =>{
        return (data?.["foto1"])
      });   
      
   }
    
   
}
