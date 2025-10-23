import { Component, AfterViewInit } from '@angular/core';
import { CabeceraComponent } from '../cabecera/cabecera.component';
import { LogoComponent } from '../logo/logo.component';
import { Turno } from '../../clases/turno';
import { Especialista } from '../../clases/especialista';
import { Especialidad } from '../../clases/especialidad';
import { Paciente } from '../../clases/paciente';
import { HistoriaClinica } from '../../clases/historia-clinica';
import { EspecialidadesService } from '../../servicios/especialidades.service';
import { TurnosService } from '../../servicios/turnos.service';
import { FirebaseService } from '../../servicios/firebase.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FiltrosPipe } from '../../pipes/filtros.pipe';
import { EstadoColorDirective } from '../../directivas/estado-color.directive';

declare var window: any;

@Component({
  selector: 'app-mis-turnos',
  standalone: true,
  imports: [CabeceraComponent, LogoComponent, CommonModule, FormsModule, ReactiveFormsModule, FiltrosPipe,EstadoColorDirective],
  templateUrl: './mis-turnos.component.html',
  styleUrls: [ './mis-turnos.component.css']
})
export class MisTurnosComponent implements AfterViewInit {

  usuario:any = null;
  turnos:Turno[] = [];
  email!: string | null;
  loading = true;
  // turnosFiltrados:Turno[] = [];
  // turnosFiltrados$:Subject<Turno[]>;
  turnoElegido!:Turno;
  fechaAux!:string;
  especialistaNombreCompleto = "";
  pacienteNombreCompleto = "";
  especialista!:Especialista;
  especialidad!:string;
  estado:string = "";  
  comentarioAux = "";
  comentario = "";
  reseniaAux = "";
  resenia = "";
  calificacion = "";
  tipo!: string;

  // Filtro
  especialistas:Especialista[] = [];
  especialidades:Especialidad[] = [];
  pacientes:Paciente[] = [];
  filtro = "";

  // Popup
  formModal: any;
  popUpRazon = "";
  mensajeError = "";
  estrellas:number = 0;

  // historia
  altura:string = "";
  peso:number = 0;
  temperatura:number = 0;
  presion:number = 0;
  dinamicos: {clave: string, valor: string, rango: number, numero: number, eleccion: boolean}[] = [];
  cantidadDatos = 0;
  historiaPrevia: HistoriaClinica[]=[];
  
  // ENCUESTA
  preguntas:string[] = ["","",""];
    
  constructor(private firebaseData:FirebaseService, private data:TurnosService, private especialidadesService: EspecialidadesService ){}

  async ngOnInit(): Promise<void> {
    // Cargar usuario primero y esperar a que termine
    await this.cargarUsuario();

    // this.turnosFiltrados$ = new Subject();
    this.especialidadesService.getEspecialidades().subscribe( (data) => {
      this.especialidades	= data;
    });
       
    // Solo después de que el usuario esté cargado, cargar los turnos
    this.data.getTurnosDB().subscribe(turnos => {
      this.firebaseData.getUsuariosPorTipo("especialista").subscribe((usuarios: any[]) => {
        this.especialistas = usuarios;
        console.log("especialistas", this.especialistas);
      });   
      this.firebaseData.getUsuariosPorTipo("paciente").subscribe((usuarios: any[]) => {
        this.pacientes = usuarios;
        console.log("pacientes", this.pacientes);
      });
            
      this.turnos = [];
      
      // Ahora es seguro acceder a this.usuario
      if(this.usuario) {
        this.tipo = this.usuario.tipo;
        this.email = this.usuario.email;
        
        if(this.usuario.tipo !== "admin"){
          turnos.forEach(turno => {
           
            if(this.tipo === "paciente" && turno.paciente === this.email){
              
              this.turnos.push(turno);
             
            }
            else if(this.usuario.tipo === "especialista" && turno.especialista === this.email){
              this.turnos.push(turno);
            }
            console.log("los turnos son", this.turnos)
          });
        }
        else{
          this.turnos = turnos;
        }
      }
      
      this.data.getHistoriaDB().subscribe(historias=>{
        this.historiaPrevia = historias;
        console.log(historias);
        // Ocultar loading solo cuando todo esté cargado
        this.loading = false;
        // Inicializar el modal después de que el loading termine
        setTimeout(() => {
          this.inicializarModal();
        }, 100);
      })
      
    });
  }

  ngAfterViewInit(): void {
    // Inicializar el modal cuando la vista esté lista
    this.inicializarModal();
  }

  inicializarModal() {
    const modalElement = document.getElementById('cancelarTurno');
    if (modalElement && window.bootstrap && !this.formModal) {
      this.formModal = new window.bootstrap.Modal(modalElement);
    }
  }

  async cargarUsuario() {
    const email = sessionStorage.getItem('user');
    this.usuario =  await this.firebaseData.getUsuarioEmail(email);
    console.log("usuario", this.usuario);
 }

  verTurno(turno:Turno){
    this.turnos.forEach(tur => {
      if(tur.especialista == turno.especialista && tur.dia == turno.dia && tur.mes == turno.mes && tur.anio == turno.anio && tur.hora == turno.hora &&
        tur.especialidad == turno.especialidad){
        this.turnoElegido = tur;
        this.fechaAux = tur.hora + "Hs " + tur.dia + " " + tur.mes + " " + tur.anio;
        this.especialidad = tur.especialidad;
        this.buscarEspecialista(tur.especialista);
        this.buscarPaciente(tur.paciente);
        this.estado = tur.estado;
        this.comentario = tur.comentario;
        this.calificacion = tur.calificacion;
      }
    });
  }

  agregarValorDinamico(valor:string){
    if(valor == 'sumar' && this.cantidadDatos < 3){
      this.cantidadDatos++;
      this.dinamicos.push({clave: "", valor: "", rango: 0, numero:0, eleccion: false});
    }
    else if(valor == 'restar' && this.cantidadDatos > 0){
      this.cantidadDatos--;
      this.dinamicos.splice(-1);
    }
  }

  calificar(estrellas:number){
    this.estrellas = estrellas;
  }

 

  abrirPopUp(razon:string){
    this.popUpRazon = razon;
    // Verificar que el modal esté inicializado
    if (!this.formModal) {
      this.inicializarModal();
    }
    if (this.formModal) {
      this.formModal.show();
    }
  }

  cerrarPopUp(){
    if (this.formModal) {
      this.formModal.hide();
    }
  }

  completarResenia(){
    this.resenia = this.reseniaAux;
    this.cerrarPopUp();
  }

  completarComentario(){
    this.comentario = this.comentarioAux;
    this.cerrarPopUp();
  }

  buscarEspecialista(email:string){
   
    for(let i=0; i<this.especialistas.length; i++)
    {
      if(this.especialistas[i].email == email)
      {
        this.especialista = this.especialistas[i];
        this.especialistaNombreCompleto = this.especialistas[i].nombre + " " + this.especialistas[i].apellido;
      }
    }
    console.log("buscar especialista", this.especialistaNombreCompleto);
  }
 
  buscarPaciente(email:string){
    for(let i=0; i<this.pacientes.length; i++)
      {
        if(this.pacientes[i].email == email)
        {
          this.pacienteNombreCompleto = this.pacientes[i].nombre + " " + this.pacientes[i].apellido;
        }
      }
      console.log("buscar paciente", this.pacienteNombreCompleto);

  }
  

  ordernarListaTurnos(){
    this.turnos.sort((one, two) => {
      if(one.anio < two.anio){
        return 1;
      }
      else if(one.anio == two.anio && this.mesToNumber(one.mes) < this.mesToNumber(two.mes)){
        return 1;
      }
      else if(one.anio == two.anio && one.mes == two.mes && one.dia < two.dia){
        return 1;
      }
      else if(one.anio == two.anio && one.mes == two.mes && one.dia == two.dia && one.hora < two.hora){
        return 1;
      }
      return -1;
    });
  }

  finalizarTurno(){
    if(this.comentarioAux == "" || this.altura == "" || this.peso == 0 || this.temperatura == 0 || this.presion == 0){
      this.mensajeError = "Complete los campos";
    }
    else{
      this.estado = "finalizado";
      this.turnoElegido.estado = "finalizado";
      this.comentario = this.comentarioAux
      this.turnoElegido.comentario = this.comentario;
      let fechar = new Date();
      this.turnoElegido.fecha = fechar.getDate().toString()+'/'+fechar.getMonth().toString()+'/'+fechar.getFullYear().toString();
      this.data.updateTurnos(this.turnoElegido);
      this.comentario == "";
      this.altura == "";
      this.peso == 0;
      this.temperatura == 0;
      this.presion == 0;
      let nuevaHistoria: any = null;
      this.historiaPrevia.forEach(historia=>{
        if(this.turnoElegido.paciente == historia.paciente && this.turnoElegido.especialista == historia.especialista){
          nuevaHistoria = historia;
        }
      })
      console.log("El turno elegido",this.turnoElegido, this.historiaPrevia)
      if(nuevaHistoria !== null && this.turnoElegido.especialidad === nuevaHistoria.especialidad){
        nuevaHistoria.especialista = this.turnoElegido.especialista,
        nuevaHistoria.dinamicos = this.dinamicos,
        nuevaHistoria.altura=this.altura,
        nuevaHistoria.peso=this.peso,
        nuevaHistoria.temperatura=this.temperatura.toString(),
        nuevaHistoria.presion=this.presion.toString(),
        nuevaHistoria.especialidad=this.turnoElegido.especialidad,
        this.data.updateHistoria(nuevaHistoria);
      }else{
        this.data.cargarHistoriasBD(new HistoriaClinica("",this.turnoElegido.paciente,this.turnoElegido.especialista,this.dinamicos,this.altura,
        this.peso,this.temperatura.toString(),this.presion.toString(),this.turnoElegido.especialidad));

      }
      this.limpiarData();
      this.cerrarPopUp();
    }
  }

  modificarTurno(estado:string){
    if(this.comentarioAux == ""){
      this.mensajeError = "Complete el comentario";
    }
    else{
      this.estado = estado;
      this.turnoElegido.estado = estado;
      this.comentario = this.comentarioAux;
      this.turnoElegido.comentario = this.comentario;
      this.turnoElegido.resenia = this.resenia;
      this.data.updateTurnos(this.turnoElegido);
      this.limpiarData();
      this.cerrarPopUp();
    }
  }

  limpiarData(){
    this.comentarioAux = "";
    this.comentario = "";
    this.reseniaAux = "";
    this.resenia = "";
    this.calificacion = "";
  }

  modificarTurnoSinComentario(estado:string){
    this.estado = estado;
    this.turnoElegido.estado = estado;
    this.turnoElegido.comentario = this.comentario;
    this.data.updateTurnos(this.turnoElegido);
    this.limpiarData();
    this.cerrarPopUp();
  }

  calificarTurno(){
    if(this.calificacion == ""){
      this.mensajeError = "Complete el comentario";
    }
    else{
      this.turnoElegido.calificacion = this.calificacion;
      this.data.updateTurnos(this.turnoElegido);
      this.limpiarData();
      this.cerrarPopUp();
    }
  }
  llenarEncuesta(){
      this.turnoElegido.encuesta = `${this.preguntas[0]}, ${this.preguntas[1]}, ${this.preguntas[2]}`;
      this.data.updateTurnos(this.turnoElegido);
      this.limpiarData();
      this.cerrarPopUp();
  }

  resetearMensajeError(){
    this.mensajeError = "";
  }

  mesToNumber(mes:string){
    let numero = -1;
    switch(mes){
      case "Enero":
        numero = 1;
        break;
      case "Febrero":
        numero = 2;
        break;
      case "Marzo":
        numero = 3;
        break;
      case "Abril":
        numero = 4;
        break;
      case "Mayo":
        numero = 5;
        break;
      case "Junio":
        numero = 6;
        break;
      case "Julio":
        numero = 7;
        break;
      case "Agosto":
        numero = 8;
        break;
      case "Septiembre":
        numero = 9;
        break;
      case "Octubre":
        numero = 10;
        break;
      case "Noviembre":
        numero = 11;
        break;
      case "Diciembre":
        numero = 12;
        break;
    }
  }

}
