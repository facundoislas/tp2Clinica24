import { Component } from '@angular/core';
import { Especialista } from '../../clases/especialista';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { interval } from 'rxjs';
import { CommonModule } from '@angular/common';
import { getDownloadURL, getStorage, ref, uploadBytes } from '@angular/fire/storage';
import { AuthService } from '../../servicios/auth.service';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-especialista',
  standalone: true,
  imports: [ CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './form-especialista.component.html',
  styleUrl: './form-especialista.component.css'
})
export class FormEspecialistaComponent {

  
  especialista!: Especialista;
  Mensaje!:string;
  progreso!: number;
  progresoMensaje="esperando..."; 
  logeando=true;
  contrasena2!:string;
  logueado!:boolean;
  ProgresoDeAncho!:string;
  subscription: any;
  foto1!:File;
  private storage = getStorage();

  clase="progress-bar progress-bar-info progress-bar-striped ";

  constructor(private fb: FormBuilder, private authService: AuthService, private fire:Firestore, private router: Router){
    this.especialista = new Especialista ()
  }


  formRegistro = this.fb.group({
    nombre:['', [Validators.required, Validators.minLength(3)]],
    apellido:['', [Validators.required, Validators.minLength(2)]],
    edad:['', [Validators.required, Validators.min(0), Validators.max(150)]],
    dni: ['', [Validators.required, Validators.min(1000000), Validators.max(100000000)]],
    especialidad: ['', [Validators.required, Validators.minLength(2)]],
    email:['', [Validators.required, Validators.email]],
    contrasena:['', [Validators.required, Validators.minLength(6), Validators.maxLength(8)]],
    contrasena2:['', [Validators.required, Validators.minLength(6), Validators.maxLength(8)]],
    foto1 : ['', [Validators.required]],
    
  })

  ngOnInit() {
    sessionStorage.clear();
  }

  onFileSelected(event: any) {
    this.foto1 = event.target.files[0];
    
    }

  async enviar()
  {
    if(this.formRegistro.valid)
    {
      if(this.especialista.pass == this.contrasena2)
      {
        
        const user = this.authService.register(this.especialista.mail, this.especialista.pass);
        this.MoverBarraDeProgreso()
        if(await user)
        {
          await new Promise(resolve => setTimeout(resolve, 2500));
          this.especialista.tipo= "especialista";
        const col= collection(this.fire, 'Usuarios');
        const storageRef = ref(this.storage, `especialistas/${this.foto1.name}`);
        const snapshot = await uploadBytes(storageRef, this.foto1);
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log(this.especialista, downloadURL);
        addDoc(col, {
          email: this.especialista.mail,
          nombre: this.especialista.nombre,
          apellido: this.especialista.apellido,
          tipo: this.especialista.tipo,
          contraseña: this.especialista.pass,
          edad: this.especialista.edad,
          Especialidad: this.especialista.especialidad,
          foto1: downloadURL,
          aprobado: false,
        });
        sessionStorage.setItem("user",this.especialista.mail);
        sessionStorage.setItem("muestra","true");
        
        this.router.navigateByUrl('/home', { replaceUrl: true });
        } 
        
        else {
			this.MostarMensaje("Usuario ya registrado, por favor utilice otro correo", true);
      this.especialista = new Especialista();
      this.contrasena2="";
      this.logeando=true;
    }
       } 
       else
       {
       this.MostarMensaje("Las contraseñas no coinciden, por favor revisarlas", true);
       this.logeando=true;
       }

   
    }
    else
    {
    this.MostarMensaje("Hay datos invalidos en el formulario, por favor revisarlos", true);
    this.logeando=true;
    }
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
    }, 3000);


  }

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
  }


}
