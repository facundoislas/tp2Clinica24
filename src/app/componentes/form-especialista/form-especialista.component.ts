import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Especialista } from '../../clases/especialista';
import { getDownloadURL, getStorage, ref, uploadBytes } from '@angular/fire/storage';
import { AuthService } from '../../servicios/auth.service';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { Router, RouterModule } from '@angular/router';
import { interval } from 'rxjs';
import { Captcha2Component } from '../captcha2/captcha2.component';
import { Especialidad } from '../../clases/especialidad';
import Swal from 'sweetalert2';
import { EspecialidadesService } from '../../servicios/especialidades.service';
import { HorariosEspecialista } from '../../clases/horarios-especialista';
import { HorariosEspecialistaService } from '../../servicios/horarios-especialista.service';



@Component({
  selector: 'app-form-especialista',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, Captcha2Component, RouterModule],
  templateUrl: './form-especialista.component.html',
  styleUrls: [ './form-especialista.component.css']
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
  resultado!:boolean;
  especialidades:Especialidad[] = [];
  formRegistro!:any;
  mostrarNuevaEspecialidad: boolean = false;
  nuevaEspecialidad: string = '';

  clase="progress-bar progress-bar-info progress-bar-striped ";

  captchaValidado: boolean = false;


  constructor(private fb: FormBuilder, private authService: AuthService, private fire:Firestore, private router: Router, private serverEsp: EspecialidadesService,private horariosEsp: HorariosEspecialistaService){
    this.especialista = new Especialista ();
    this.formRegistro = this.fb.group({
      nombre:['', [Validators.required, Validators.minLength(3)]],
      apellido:['', [Validators.required, Validators.minLength(2)]],
      edad:['', [Validators.required, Validators.min(0), Validators.max(150)]],
      dni: ['', [Validators.required, Validators.min(1000000), Validators.max(100000000)]],
      especialidad: ['', []],
      email:['', [Validators.required, Validators.email]],
      contrasena:['', [Validators.required, Validators.minLength(6), Validators.maxLength(8)]],
      contrasena2:['', [Validators.required, Validators.minLength(6), Validators.maxLength(8)]],
      foto1 : ['', [Validators.required]],})
  }


 
    
  

  traerEspecialidades()
  {
    this.serverEsp.getEspecialidades().subscribe( (data) => {
      this.especialidades	= data;
      console.log(this.especialidades)
    });
  }

  get especialidad(){
    return this.formRegistro.get('especialidad')?.value;
  }

  ngOnInit() {
    this.traerEspecialidades();
    // Solo limpiar sessionStorage si NO hay un administrador logueado
    const adminLogueado = sessionStorage.getItem("tipo") === "admin";
    if(!adminLogueado) {
      sessionStorage.clear();
    }
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
        
        const user = await this.authService.register(this.especialista.email, this.especialista.pass);
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
          email: this.especialista.email,
          nombre: this.especialista.nombre,
          apellido: this.especialista.apellido,
          tipo: this.especialista.tipo,
          dni: this.especialista.dni,
          contraseña: this.especialista.pass,
          edad: this.especialista.edad,
          especialidad: this.formRegistro.get('especialidad')?.value,
          foto1: downloadURL,
          aprobado: false,
          id: user?.user.uid
        });
        this.cargarHorarioEspecialistas(this.especialista.email);
        
        // Verificar si hay un administrador logueado
        const adminLogueado = sessionStorage.getItem("tipo") === "admin";
        
        if(adminLogueado) {
          // Si es admin logueado, redirigir a usuarios
          this.router.navigateByUrl('/usuarios', { replaceUrl: true });
        } else {
          // Si es registro público, redirigir a login
          sessionStorage.setItem("user",this.especialista.email);
          sessionStorage.setItem("muestra","true");
          this.router.navigateByUrl('/login', { replaceUrl: true });
        }
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

  tomarResultado(resultado:any)
  {
    this.captchaValidado = resultado;
  }
  
  cargarHorarioEspecialistas(mail:string){
    let horarioAux = new HorariosEspecialista("",mail);
    this.horariosEsp.cargarHorarioEspecialistas(horarioAux);
  }

  limpiarFormulario(){
    this.formRegistro.reset();
    this.especialista = new Especialista();
    this.contrasena2 = '';
    this.captchaValidado = false;
    this.foto1 = null as any;
    this.mostrarNuevaEspecialidad = false;
    this.nuevaEspecialidad = '';
  }

  onEspecialidadChange(event: any) {
    const valor = event.target.value;
    if (valor === 'nueva') {
      this.mostrarNuevaEspecialidad = true;
      this.formRegistro.patchValue({ especialidad: '' });
    } else {
      this.mostrarNuevaEspecialidad = false;
    }
  }

  async agregarNuevaEspecialidad() {
    if (this.nuevaEspecialidad.trim()) {
      try {
        const col = collection(this.fire, 'especialidades');
        const nuevaEsp = { especialidad: this.nuevaEspecialidad.trim() };
        
        await addDoc(col, nuevaEsp);
        
        this.especialidades.push(nuevaEsp as Especialidad);
        this.formRegistro.patchValue({ especialidad: this.nuevaEspecialidad.trim() });
        // Solo asignar el string del nombre de la especialidad
        this.especialista.especialidad = [nuevaEsp as Especialidad];
        
        this.cancelarNuevaEspecialidad();
        this.MostarMensaje('Especialidad agregada exitosamente', false);
      } catch (error) {
        console.error('Error al agregar especialidad:', error);
        this.MostarMensaje('Error al agregar la especialidad', true);
      }
    }
  }

  cancelarNuevaEspecialidad() {
    this.mostrarNuevaEspecialidad = false;
    this.nuevaEspecialidad = '';
    this.formRegistro.patchValue({ especialidad: '' });
  }

}
