import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { interval } from 'rxjs';
import { Usuario } from '../../clases/usuario';
import { Paciente } from '../../clases/paciente';
import { AuthService } from '../../servicios/auth.service';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { getDownloadURL, getStorage, ref, uploadBytes } from '@angular/fire/storage';

@Component({
  selector: 'app-form-paciente',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './form-paciente.component.html',
  styleUrl: './form-paciente.component.css'
})
export class FormPacienteComponent {

  paciente!: Paciente;
  Mensaje!:string;
  progreso!: number;
  progresoMensaje="esperando..."; 
  logeando=true;
  contrasena2!:string;
  logueado!:boolean;
  ProgresoDeAncho!:string;
  subscription: any;
  foto1!:File;
  foto2!:File;
  private storage = getStorage();

  clase="progress-bar progress-bar-info progress-bar-striped ";

  constructor(private fb: FormBuilder, private authService: AuthService, private fire:Firestore, private router: Router){
    this.paciente = new Paciente ()
  }


  formRegistro = this.fb.group({
    nombre:['', [Validators.required, Validators.minLength(3)]],
    apellido:['', [Validators.required, Validators.minLength(2)]],
    edad:['', [Validators.required, Validators.min(0), Validators.max(150)]],
    dni: ['', [Validators.required, Validators.min(1000000), Validators.max(100000000)]],
    obraSocial: ['', [Validators.required, Validators.minLength(2)]],
    email:['', [Validators.required, Validators.email]],
    contrasena:['', [Validators.required, Validators.minLength(6), Validators.maxLength(8)]],
    contrasena2:['', [Validators.required, Validators.minLength(6), Validators.maxLength(8)]],
    foto1 : ['', [Validators.required]],
    foto2 : ['', [Validators.required]]
  })

  ngOnInit() {
    sessionStorage.clear();
  }

  onFileSelected(event: any, imageNumber: number) {
    const file: File = event.target.files[0];
    if (imageNumber === 1) {
      this.foto1 = file;
    } else {
      this.foto2 = file;
    }
  }

  async enviar()
  {
    if(this.formRegistro.valid)
    {
      if(this.paciente.pass == this.contrasena2)
      {
        
        const user = this.authService.register(this.paciente.mail, this.paciente.pass);
        this.MoverBarraDeProgreso()
        if(await user)
        {
          await new Promise(resolve => setTimeout(resolve, 2500));
          this.paciente.tipo= "paciente";
        const col= collection(this.fire, 'Usuarios');
        const storageRef = ref(this.storage, `pacientes/${this.foto1.name}`);
        const storageRef2 = ref(this.storage, `pacientes/${this.foto2.name}`);
        const snapshot = await uploadBytes(storageRef, this.foto1);
        const snapshot2 = await uploadBytes(storageRef2, this.foto1);
        const downloadURL = await getDownloadURL(snapshot.ref);
        const downloadURL2 = await getDownloadURL(snapshot2.ref);
        console.log(this.paciente, downloadURL, downloadURL2);
        addDoc(col, {
          email: this.paciente.mail,
          nombre: this.paciente.nombre,
          apellido: this.paciente.apellido,
          tipo: this.paciente.tipo,
          contraseña: this.paciente.pass,
          edad: this.paciente.edad,
          obraSocial: this.paciente.obraSocial,
          foto1: downloadURL,
          foto2: downloadURL2
        });
        sessionStorage.setItem("user",this.paciente.mail);
        sessionStorage.setItem("muestra","true");
        
        this.router.navigateByUrl('/home', { replaceUrl: true });
        } 
        
        else {
			this.MostarMensaje("Usuario ya registrado, por favor utilice otro correo", true);
      this.paciente = new Paciente();
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
