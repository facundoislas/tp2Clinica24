import { Component } from '@angular/core';
import { Paciente } from '../../clases/paciente';
import { getDownloadURL, getStorage, ref, uploadBytes } from '@angular/fire/storage';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../servicios/auth.service';
import { addDoc, collection, Firestore, getDocs } from '@angular/fire/firestore';
import { Router, RouterModule } from '@angular/router';
import { interval } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Captcha2Component } from "../captcha2/captcha2.component";

@Component({
  selector: 'app-form-paciente',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, Captcha2Component, RouterModule],
  templateUrl: './form-paciente.component.html',
  styleUrls: [ './form-paciente.component.css']
})
export class FormPacienteComponent {

  resultado!:boolean;

  paciente!: Paciente;
  nuevoPaciente!: Paciente;

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
  formRegistro!:any;

  // Propiedades para obras sociales
  obrasSociales: any[] = [];
  mostrarNuevaObraSocial: boolean = false;
  nuevaObraSocial: string = '';

  clase="progress-bar progress-bar-info progress-bar-striped ";

  constructor(private fb: FormBuilder, private authService: AuthService, private fire:Firestore, private router: Router){
    this.paciente = new Paciente ()
    this.nuevoPaciente = new Paciente ();
    this.formRegistro = this.fb.group({
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
  }


  

  async ngOnInit() {
    // Solo limpiar sessionStorage si NO hay un administrador logueado
    const adminLogueado = sessionStorage.getItem("tipo") === "admin";
    if(!adminLogueado) {
      sessionStorage.clear();
    }
    await this.cargarObrasSociales();
  }

  async cargarObrasSociales() {
    try {
      const col = collection(this.fire, 'obraSocial');
      const snapshot = await getDocs(col);
      this.obrasSociales = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error al cargar obras sociales:', error);
      this.obrasSociales = [
        { nombre: 'OSDE' },
        { nombre: 'Swiss Medical' },
        { nombre: 'Galeno' },
        { nombre: 'Medicus' },
        { nombre: 'IOMA' },
        { nombre: 'PAMI' }
      ];
    }
  }

  onObraSocialChange(event: any) {
    const valor = event.target.value;
    if (valor === 'nueva') {
      this.mostrarNuevaObraSocial = true;
      this.formRegistro.patchValue({ obraSocial: '' });
    } else {
      this.mostrarNuevaObraSocial = false;
    }
  }

  async agregarNuevaObraSocial() {
    if (this.nuevaObraSocial.trim()) {
      try {
        const col = collection(this.fire, 'obraSocial');
        const nuevaObra = { nombre: this.nuevaObraSocial.trim() };
        
        await addDoc(col, nuevaObra);
        
        this.obrasSociales.push(nuevaObra);
        this.formRegistro.patchValue({ obraSocial: this.nuevaObraSocial.trim() });
        this.paciente.obraSocial = this.nuevaObraSocial.trim();
        
        this.cancelarNuevaObraSocial();
        this.mostrarMensaje('Obra social agregada exitosamente');
      } catch (error) {
        console.error('Error al agregar obra social:', error);
        this.mostrarMensaje('Error al agregar la obra social');
      }
    }
  }

  cancelarNuevaObraSocial() {
    this.mostrarNuevaObraSocial = false;
    this.nuevaObraSocial = '';
    this.formRegistro.patchValue({ obraSocial: '' });
  }

  limpiarFormulario() {
    this.formRegistro.reset();
    this.paciente = new Paciente();
    this.contrasena2 = '';
    this.resultado = false;
    this.mostrarNuevaObraSocial = false;
    this.nuevaObraSocial = '';
  }

  mostrarMensaje(mensaje: string) {
    this.Mensaje = mensaje;
    const snackbar = document.getElementById("snackbar");
    if (snackbar) {
      snackbar.className = "show";
      setTimeout(() => {
        snackbar.className = snackbar.className.replace("show", "");
      }, 3000);
    }
  }

  onFileSelected(event: any, imageNumber: number) {
    const file: File = event.target.files[0];
    if (imageNumber === 1) {
      this.foto1 = file;
    } else {
      this.foto2 = file;
    }
  }

  tomarResultado(resultado:boolean)
  {
    this.resultado = resultado;
  }

  async enviar()
  {
    if(this.formRegistro.valid && this.resultado === true)
    {
      if(this.paciente.pass == this.contrasena2)
      {
        const user = await this.authService.register(this.paciente.email, this.paciente.pass);
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
        this.paciente.img_1 = await getDownloadURL(snapshot.ref);
        this.paciente.imagen2 = await getDownloadURL(snapshot2.ref);
        addDoc(col, {
          email: this.paciente.email,
          nombre: this.paciente.nombre,
          apellido: this.paciente.apellido,
          tipo: this.paciente.tipo,
          dni: this.paciente.dni,
          contraseña: this.paciente.pass,
          edad: this.paciente.edad,
          foto1: this.paciente.img_1,
          foto2: this.paciente.imagen2,
          aprobado: true,
          obraSocial: this.paciente.obraSocial,
          id: user?.user.uid
        });
        
        // Verificar si hay un administrador logueado
        const adminLogueado = sessionStorage.getItem("tipo") === "admin";
        
        if(adminLogueado) {
          // Si es admin logueado, redirigir a usuarios
          this.router.navigateByUrl('/usuarios', { replaceUrl: true });
        } else {
          // Si es registro público, redirigir a login
          sessionStorage.setItem("user",this.paciente.email);
          sessionStorage.setItem("muestra","true");
          this.router.navigateByUrl('/login', { replaceUrl: true });
        }
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
