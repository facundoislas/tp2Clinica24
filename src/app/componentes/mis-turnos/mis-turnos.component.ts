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
import { ResaltarDirective } from '../../directivas/resaltar.directive';

declare var window: any;

@Component({
  selector: 'app-mis-turnos',
  standalone: true,
  imports: [CabeceraComponent, LogoComponent, CommonModule, FormsModule, ReactiveFormsModule, FiltrosPipe, EstadoColorDirective, ResaltarDirective],
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
  dinamicos: {clave: string, valor: string}[] = [];
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
        
        // Ordenar turnos por fecha (del más nuevo al más viejo)
        this.ordenarTurnosPorFecha();
      }
      
      this.data.getHistoriaDB().subscribe(historias=>{
        // Filtrar solo las historias clínicas relacionadas con los turnos del usuario
        const turnosIds = this.turnos.map(turno => turno.id);
        this.historiaPrevia = historias.filter(historia => 
          turnosIds.includes(historia.turnoId)
        );
        console.log("Historias filtradas del usuario:", this.historiaPrevia);
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
        this.fechaAux = tur.dia + " " + tur.mes + " " + tur.anio + " " + tur.hora + "Hs." 
        this.especialidad = tur.especialidad;
        this.buscarEspecialista(tur.especialista);
        this.buscarPaciente(tur.paciente);
        this.estado = tur.estado;
        this.comentario = tur.comentario;
        this.resenia = tur.resenia || ""; // Cargar la reseña desde el turno
        this.calificacion = tur.calificacion;
      }
    });
  }

  agregarValorDinamico(valor:string){
    if(valor == 'sumar' && this.cantidadDatos < 3){
      this.cantidadDatos++;
      // Solo clave y valor
      this.dinamicos.push({clave: "", valor: ""});
    }
    else if(valor == 'restar' && this.cantidadDatos > 0){
      this.cantidadDatos--;
      this.dinamicos.splice(-1);
    }
  }

  calificar(estrellas:number){
    this.estrellas = estrellas;
    console.log("Estrellas seleccionadas:", this.estrellas);
  }

 

  abrirPopUp(razon:string){
    this.popUpRazon = razon;
    
    // Si es el modal de calificar
    if (razon === 'calificar') {
      if (this.turnoElegido.calificacion !== '') {
        // Cargar datos existentes
        const match = this.turnoElegido.calificacion.match(/^(\d+) estrella[s]?: (.+)/);
        if (match) {
          this.estrellas = parseInt(match[1]);
          this.calificacion = match[2];
          console.log("Calificación existente cargada - Estrellas:", this.estrellas, "Comentario:", this.calificacion);
        } else {
          // Si no tiene el formato, asumir que es solo texto sin estrellas
          this.calificacion = this.turnoElegido.calificacion;
          this.estrellas = 0;
        }
      } else {
        // Si no hay calificación, resetear valores
        this.estrellas = 0;
        this.calificacion = "";
        console.log("Modal de calificación abierto - sin calificación previa");
      }
    }
    
    // Si es el modal de encuesta
    if (razon === 'encuesta') {
      if (this.turnoElegido.encuesta && this.turnoElegido.encuesta !== '') {
        try {
          // Intentar parsear las respuestas guardadas en formato JSON
          const respuestas = JSON.parse(this.turnoElegido.encuesta);
          this.preguntas[0] = respuestas.pregunta1 || "";
          this.preguntas[1] = respuestas.pregunta2 || "";
          this.preguntas[2] = respuestas.pregunta3 || "";
          console.log("Encuesta existente cargada:", this.preguntas);
        } catch (error) {
          // Si falla el parse, intentar con formato antiguo (string separado por comas)
          const respuestasArray = this.turnoElegido.encuesta.split(', ');
          if (respuestasArray.length === 3) {
            this.preguntas = respuestasArray;
          }
        }
      } else {
        // Si no hay encuesta, resetear valores
        this.preguntas = ["","",""];
        console.log("Modal de encuesta abierto - sin encuesta previa");
      }
    }
    
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
    // Resetear solo las estrellas temporales si era el modal de calificar
    if (this.popUpRazon === 'calificar') {
      this.estrellas = 0;
    }
    this.mensajeError = "";
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
      
      console.log("El turno elegido",this.turnoElegido, this.historiaPrevia)
      
      // Obtener la fecha del turno
      const fechaTurno = this.obtenerFechaTurno();
      
      // Buscar historia clínica por turnoId (relación 1 a 1)
      const historiaDelTurno = this.historiaPrevia.find(historia => 
        historia.turnoId === this.turnoElegido.id
      );
      
      if(historiaDelTurno){
        // Actualizar historia existente para este turno
        historiaDelTurno.especialista = this.turnoElegido.especialista;
        historiaDelTurno.dinamicos = this.dinamicos;
        historiaDelTurno.altura = this.altura;
        historiaDelTurno.peso = this.peso;
        historiaDelTurno.temperatura = this.temperatura.toString();
        historiaDelTurno.presion = this.presion.toString();
        historiaDelTurno.especialidad = this.turnoElegido.especialidad;
        historiaDelTurno.fechaAtencion = fechaTurno;
        historiaDelTurno.turnoId = this.turnoElegido.id;
        this.data.updateHistoria(historiaDelTurno);
      } else {
        // Crear nueva historia clínica con el ID del turno
        this.data.cargarHistoriasBD(new HistoriaClinica(
          "", 
          this.turnoElegido.paciente, 
          this.turnoElegido.especialista, 
          this.dinamicos, 
          this.altura,
          this.peso, 
          this.temperatura.toString(), 
          this.presion.toString(), 
          this.turnoElegido.especialidad, 
          fechaTurno, 
          this.turnoElegido.id
        ));
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
    this.estrellas = 0;
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
    else if(this.estrellas == 0){
      this.mensajeError = "Seleccione una calificación con estrellas";
    }
    else{
      // Guardar en formato "5 estrellas: comentario"
      const estrellasTexto = this.estrellas === 1 ? "estrella" : "estrellas";
      this.turnoElegido.calificacion = `${this.estrellas} ${estrellasTexto}: ${this.calificacion}`;
      this.data.updateTurnos(this.turnoElegido);
      
      // NO limpiar comentario y resenia para que el botón "Ver reseña" siga visible
      // Solo limpiar los campos temporales de calificación
      this.estrellas = 0;
      this.mensajeError = "";
      
      this.cerrarPopUp();
    }
  }
  llenarEncuesta(){
      // Validar que todas las preguntas estén respondidas
      if(this.preguntas[0] === "" || this.preguntas[1] === "" || this.preguntas[2] === ""){
        this.mensajeError = "Por favor complete todas las preguntas de la encuesta";
        return;
      }
      
      // Guardar las respuestas como un array en formato JSON string
      const respuestasArray = {
        pregunta1: this.preguntas[0],
        pregunta2: this.preguntas[1],
        pregunta3: this.preguntas[2]
      };
      
      this.turnoElegido.encuesta = JSON.stringify(respuestasArray);
      this.data.updateTurnos(this.turnoElegido);
      
      // Limpiar solo las preguntas
      this.preguntas = ["","",""];
      this.mensajeError = "";
      
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

  ordenarTurnosPorFecha() {
    this.turnos.sort((a, b) => {
      // Convertir mes de texto a número
      const mesA = this.convertirMesANumero(a.mes);
      const mesB = this.convertirMesANumero(b.mes);
      
      // Crear fechas completas para comparar
      const fechaA = new Date(
        parseInt(a.anio),
        mesA - 1,
        parseInt(a.dia),
        parseInt(a.hora.split(':')[0]),
        parseInt(a.hora.split(':')[1])
      );
      
      const fechaB = new Date(
        parseInt(b.anio),
        mesB - 1,
        parseInt(b.dia),
        parseInt(b.hora.split(':')[0]),
        parseInt(b.hora.split(':')[1])
      );
      
      // Ordenar de más nuevo a más viejo (descendente)
      return fechaB.getTime() - fechaA.getTime();
    });
  }

  obtenerFechaTurno(): Date {
    const mesNumero = this.convertirMesANumero(this.turnoElegido.mes);
    const dia = parseInt(this.turnoElegido.dia);
    const anio = parseInt(this.turnoElegido.anio);
    
    // Crear fecha (mes - 1 porque los meses en JavaScript van de 0 a 11)
    const fecha = new Date(anio, mesNumero - 1, dia);
    return fecha;
  }

  obtenerHistoriaDelTurno(turnoId: string): HistoriaClinica | undefined {
    return this.historiaPrevia.find(historia => historia.turnoId === turnoId);
  }

  convertirMesANumero(mes: string): number {
    const meses: {[key: string]: number} = {
      "Enero": 1,
      "Febrero": 2,
      "Marzo": 3,
      "Abril": 4,
      "Mayo": 5,
      "Junio": 6,
      "Julio": 7,
      "Agosto": 8,
      "Septiembre": 9,
      "Octubre": 10,
      "Noviembre": 11,
      "Diciembre": 12
    };
    return meses[mes] || 1;
  }

}
