import { Component } from '@angular/core';
import { CabeceraComponent } from "../cabecera/cabecera.component";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Turno } from '../../clases/turno';
import { Especialista } from '../../clases/especialista';
import { HorariosEspecialista } from '../../clases/horarios-especialista';
import { HorariosEspecialistaService } from '../../servicios/horarios-especialista.service';
import { Router } from '@angular/router';
import { EspecialidadesService } from '../../servicios/especialidades.service';
import { FirebaseService } from '../../servicios/firebase.service';
import { TurnosService } from '../../servicios/turnos.service';

@Component({
  selector: 'app-crear-turno',
  standalone: true,
  imports: [CabeceraComponent, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './crear-turno.component.html',
  styleUrls: [ './crear-turno.component.css']
})
export class CrearTurnoComponent {
  
  hoy:Date = new Date();
  now:Date = new Date();
  dia:string = this.now.getDate().toString();
  mesNumero:number = this.now.getMonth();
  mes:string = this.mesNumeroToString(this.mesNumero-1);
  anio:string = this.now.getFullYear().toString();
  hora:number = this.now.getHours();
  diaString:string = this.diaSemanaString(this.now.getDay());
  restarDia = false;
  sumarDia = true;
  public loading = true;
  usuario!: any;
  noHayDatos = "";

  // HORARIOS
  horarios:string[] = ["8:00","8:30","9:00","9:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30",
    "16:00","16:30","17:00","17:30","18:00","18:30"];
  horariosDisponibles:string[] = [];
  horariosDisponiblesOtroFormato:string[] = [];

  // DOM
  etapa = "especialidad";

  // TURNOS
  turnos:Turno[] = [];

  // Especialidades
  especialidades:any ;
  especialidadElegida: any;
  especialistas:Especialista[] = [];
  especialistaElegido!:Especialista;
  especialistaElegidoStr = "";
  diaElegido = "";
  horarioElegido = "";
  especialistasPorEspecialidad:Especialista[] = [];

  // HORARIOS
  horariosEspecialistas:HorariosEspecialista[] = [];

  constructor(private turnosData:TurnosService,private horariosEspecialistaService: HorariosEspecialistaService, private especialidadesService: EspecialidadesService, private firebaseData:FirebaseService, private router: Router){}
  
  ngOnInit(): void {
   
    this.especialidadesService.getEspecialidades().subscribe(esp => {
      
      this.especialidades = esp;
      this.ordernarListaEspecialidades();
      this.firebaseData.getUsuariosPorTipo("especialista").subscribe((usuarios: any[]) => {
        this.especialistas = usuarios;
      
    });
      
    this.horariosEspecialistaService.getHorarioEspecialistas().subscribe(horario => {
      this.horariosEspecialistas = horario;
      console.log(this.horariosEspecialistas);

    });
    this.turnosData.getTurnosDB().subscribe(turnos => {
      this.turnos = turnos;
    });
    setTimeout(()=>{
      this.loading = false;

  },2500);
  this.cargarUsuario();
  });
}



async cargarUsuario() {
  const email = sessionStorage.getItem('user');
  this.usuario =  await this.firebaseData.getUsuarioEmail(email);
  console.log("usuario", this.usuario);
}

  elegirEspecialidad(especialidadElegida:string){
    let indice = -1;
    this.especialidadElegida = especialidadElegida;
    this.especialistas.forEach((esp, index) => {
      console.log(esp)
      esp.especialidad.forEach((especialidad)=>{
        if(especialidad.especialidad == especialidadElegida){
          indice = index;
          this.especialistasPorEspecialidad.push(esp);
        }
      })
    });
   
    this.volver("especialista");
  }


  elegirHorario(horario:string){
    this.horarioElegido = this.volverCambiarFormato(horario);
    this.diaElegido = this.horarioElegido + " Hrs. " + this.diaString + " " + this.dia + " de " + this.mes;
    this.volver("confirmar");
  }

  confirmar(){
    this.turnosData.cargarTurnosBD(new Turno("",this.usuario.email, this.especialistaElegido.email,this.especialidadElegida,
    this.dia,this.mes,this.anio,this.horarioElegido,"pendiente","","",""));
    this.volver("fin");
  }

  elegirEspecialista(nombre:string, apellido:string){
    let indice = -1;
    
    this.especialistas.forEach((esp, index) => {
      if(esp.nombre == nombre && esp.apellido == apellido){
        indice = index;
        this.especialidades = esp.especialidad;
      }
    });
    this.especialistaElegido = this.especialistas[indice];
    this.especialistaElegidoStr = this.especialistaElegido.nombre + " " + this.especialistaElegido.apellido;
    this.cambiarHorariosPorEspecialista();
    this.volver('horario');
  }
  cambiarHorariosPorEspecialista() {
    let indiceIni = 0;
    let indiceFin = 0;
  
    if (this.diaString == "Sabado") {
      indiceFin = 12;
    } else {
      indiceFin = this.horarios.length;
    }
  
   this.horariosEspecialistas.forEach(horarioEspecialista =>{
    if(horarioEspecialista.email == this.especialistaElegido.email){
      this.horarios.forEach((horarios,index) => {
        console.log(horarioEspecialista.especialidadesPorDia[0]);
        console.log(this.especialidadElegida );
        switch(this.diaString){
          case "Lunes":
            if(horarios == horarioEspecialista.lunInicio && this.especialidadElegida == horarioEspecialista.especialidadesPorDia[0]){
              indiceIni = index;
            }
            if(horarios == horarioEspecialista.lunFin && this.especialidadElegida == horarioEspecialista.especialidadesPorDia[0]){
              indiceFin = index;
            }
            if(horarioEspecialista.estados[0] == "Inhabilitado" || this.especialidadElegida != horarioEspecialista.especialidadesPorDia[0]){
              indiceIni = 0;
              indiceFin = 0;
            }
            break;
          case "Martes":
            if(horarios == horarioEspecialista.marInicio && this.especialidadElegida == horarioEspecialista.especialidadesPorDia[1]){
              indiceIni = index;
            }
            if(horarios == horarioEspecialista.marFin && this.especialidadElegida == horarioEspecialista.especialidadesPorDia[1]){
              indiceFin = index;
            }
            if(horarioEspecialista.estados[1] == "Inhabilitado" || this.especialidadElegida != horarioEspecialista.especialidadesPorDia[1]){
              indiceIni = 0;
              indiceFin = 0;
            }
            break;
          case "Miercoles":
            if(horarios == horarioEspecialista.mierInicio && this.especialidadElegida == horarioEspecialista.especialidadesPorDia[2]){
              indiceIni = index;
            }
            if(horarios == horarioEspecialista.mierFin && this.especialidadElegida == horarioEspecialista.especialidadesPorDia[2]){
              indiceFin = index;
            }
            if(horarioEspecialista.estados[2] == "Inhabilitado" ||  this.especialidadElegida != horarioEspecialista.especialidadesPorDia[2]){
              indiceIni = 0;
              indiceFin = 0;
            }
            break;
          case "Jueves":
            if(horarios == horarioEspecialista.jueInicio && this.especialidadElegida == horarioEspecialista.especialidadesPorDia[3] ){
              indiceIni = index;
            }
            if(horarios == horarioEspecialista.jueFin  && this.especialidadElegida == horarioEspecialista.especialidadesPorDia[3] ){
              indiceFin = index;
            }
            if(horarioEspecialista.estados[3] == "Inhabilitado"  ||  this.especialidadElegida != horarioEspecialista.especialidadesPorDia[3] ){
              indiceIni = 0;
              indiceFin = 0;
            }
            break;
          case "Viernes":
            if(horarios == horarioEspecialista.vierInicio  && this.especialidadElegida == horarioEspecialista.especialidadesPorDia[4] ){
              indiceIni = index;
            }
            if(horarios == horarioEspecialista.vierFin  && this.especialidadElegida == horarioEspecialista.especialidadesPorDia[4] ){
              indiceFin = index;
            }
            if(horarioEspecialista.estados[4] == "Inhabilitado"  || this.especialidadElegida != horarioEspecialista.especialidadesPorDia[4] ){
              indiceIni = 0;
              indiceFin = 0;
            }
            break;
          case "Sabado":
            if(horarios == horarioEspecialista.sabInicio  && this.especialidadElegida == horarioEspecialista.especialidadesPorDia[5] ){
              indiceIni = index;
            }
            if(horarios == horarioEspecialista.sabFin  && this.especialidadElegida == horarioEspecialista.especialidadesPorDia[5] ){
              indiceFin = index;
            }
            if(horarioEspecialista.estados[5] == "Inhabilitado"  ||  this.especialidadElegida == horarioEspecialista.especialidadesPorDia[5] ){
              indiceIni = 0;
              indiceFin = 0;
            }
            break;
          }
        });
      }
    });
  
    let listAux = [...this.horarios];
    this.horariosDisponibles = listAux.splice(indiceIni, indiceFin - indiceIni);
    console.log(this.horariosDisponibles);
    console.log(this.horarios);
    if (this.horariosDisponibles.length === 0) {
      this.noHayDatos = "No hay turnos disponibles para el día seleccionado";
    } else {
      this.noHayDatos = "";
    }
    this.sacarHorariosNoDisponibles();
    this.cambiarFormato();
  }
  

  volverCambiarFormato(hora:string){
    let horaAux = hora.split(" ");
    let horaAux2 = horaAux[1].split(":");
    let horaNumber = Number(horaAux2[0]);
    if(horaAux[2] == "PM"){
      horaNumber += 12;
    }
    return horaNumber + ":" + horaAux2[1]; 
  }

  cambiarFormato(){
    this.horariosDisponiblesOtroFormato = [];
    this.mesNumero+=1;
    this.horariosDisponibles.forEach(horario => {
      this.horariosDisponiblesOtroFormato.push(this.anio+'-'+this.mesNumero +'-'+this.dia+' '+this.cambiarHoraAmPm(horario));
    });
  }

  cambiarHoraAmPm(hora:string){
    let strAux = hora.split(":");
    let horaAux = strAux[0];
    let minAux = strAux[1];
    if(Number(strAux[0]) > 12){
      horaAux = String(Number(strAux[0])-12);
      return horaAux + ":" + minAux + " PM";
    }
    return horaAux + ":" + minAux + " AM";
  }

  sacarHorariosNoDisponibles(){
    let indices:any = [];
    let listAux = [...this.horariosDisponibles];
    this.turnos.forEach(turno => {
      this.horariosDisponibles.forEach((horarios,index) => {
        if(turno.especialista == this.especialistaElegido.email && turno.dia == this.dia && turno.hora == horarios){
          indices.push(index);
        }
      });
    })
    indices.forEach((i: number) => {
      listAux.splice(i,1);
      this.horariosDisponibles = listAux;
    });
  }

  volver(lugar:string){
    if(lugar == "home"){
      this.router.navigateByUrl("");
    }
    else if(lugar == "especialidad"){
      this.etapa = "especialidad";
    }
    else if(lugar == "especialista"){
      this.etapa = "especialista";
    }
    else if(lugar == "horario"){
      this.etapa = "horario";
    }
    else if(lugar == "confirmar"){
      this.etapa = "confirmar";
    }
    else if (lugar == "fin"){
      this.etapa = "fin";
    }
    else{
      this.router.navigateByUrl("/login/mis-turnos");
    }
  }

  ordernarListaEspecialidades(){
    this.especialidades.sort((one: number, two: number) => (one < two ? -1 : 1));
  }

  cambiarDia(cuando: string) {
    console.log("La función cambiarDia se está ejecutando.");
    let sePuede = false;
    this.now = new Date();
    if (cuando == "antes") {
      if (this.limitarFecha("restar")) {
        sePuede = true;
        // Resta un día a la fecha actual
        this.now.setDate(this.now.getDate() - 1);
  
        // Si el día resultante es domingo, resta un día adicional
        if (this.now.getDay() == 0) {
          this.now.setDate(this.now.getDate() - 1);
        }
      }
    } else {
      if (this.limitarFecha("sumar")) {
        sePuede = true;
        // Suma un día a la fecha actual
        this.now.setDate(this.now.getDate() + 1);
  
        // Si el día resultante es domingo, suma un día adicional
        if (this.now.getDay() == 0) {
          this.now.setDate(this.now.getDate() + 1);
        }
      }
    }
  
    if (sePuede) {
      // Actualiza las variables de fecha y día de la semana
      this.dia = this.now.getDate().toString();
      this.mesNumero = this.now.getMonth();
      this.mes = this.mesNumeroToString(this.mesNumero);
      this.diaString = this.diaSemanaString(this.now.getDay());
      this.anio = this.now.getFullYear().toString();
  console.log(this.dia);
      // Actualiza los horarios disponibles y por especialista
      this.getHorariosDisponibles();
      this.cambiarHorariosPorEspecialista();
    }
  }
  


  limitarFecha(sumarOrestar:string){
    let dia = this.hoy.getDate();
    if(this.hoy.getDate()+15 > 30){
      dia = this.hoy.getDate() - 15; 
    }
    if(sumarOrestar == "restar" && (this.hoy.getDate() == this.now.getDate())){
      this.restarDia = false;
      this.sumarDia = true;
      return false;
    }
    else if(sumarOrestar == "sumar" && (dia == this.now.getDate())){
      this.restarDia = true;
      this.sumarDia = false;
      return false;
    }
    this.restarDia = true;
    this.sumarDia = true;
    return true;
  }

  getHorariosDisponibles(){
    if(this.diaString == "Sabado"){
      this.horariosDisponibles = this.horarios.slice(0,12);
    }
    else{
      this.horariosDisponibles = this.horarios;
    }
  }

  diaSemanaString(numero:number){
    let dia = "";
    switch(numero){
      case 1:
        dia = "Lunes";
        break;
      case 2:
        dia = "Martes";
        break;
      case 3:
        dia = "Miercoles";
        break;
      case 4:
        dia = "Jueves";
        break;
      case 5:
        dia = "Viernes";
        break;
      case 6:
        dia = "Sabado";
        break;
      case 0:
        dia = "Domingo";
        break;
    }
    return dia;
  }

  mesNumeroToString(numero:number){
    numero++;
    let mes = "";
    switch(numero){
      case 1:
        mes = "Enero";
        break;
      case 2:
        mes = "Febrero";
        break;
      case 3:
        mes = "Marzo";
        break;
      case 4:
        mes = "Abril";
        break;
      case 5:
        mes = "Mayo";
        break;
      case 6:
        mes = "Junio";
        break;
      case 7:
        mes = "Julio";
        break;
      case 8:
        mes = "Agosto";
        break;
      case 9:
        mes = "Septiembre";
        break;
      case 10:
        mes = "Octubre";
        break;
      case 11:
        mes = "Noviembre";
        break;
      case 12:
        mes = "Diciembre";
        break;
    }
    return mes;
  }
  sumarRestarDias(cuando: 'antes' | 'despues'): void {
    const multiplicador = cuando === 'antes' ? -1 : 1;
    const cantidadDias = 1 * multiplicador;
  
    const fechaLimite = new Date(this.now);
    fechaLimite.setDate(this.now.getDate() + cantidadDias);
  
    const fechaActual = new Date();
    const quinceDiasDespues = new Date(fechaActual);
    quinceDiasDespues.setDate(fechaActual.getDate() + 15);
  
    // Verificar si la fecha límite cae en domingo
    if (fechaLimite.getDay() === 0) {
      // Si es domingo y estamos restando días, retroceder al día sábado
      if (cuando === 'antes') {
        fechaLimite.setDate(fechaLimite.getDate() - 1); // Restar 2 días para ir al sábado
      } else {
        // Si es domingo y estamos sumando días, avanzar al día lunes
        fechaLimite.setDate(fechaLimite.getDate() + 1);
      }
    }
  
    // Permite avanzar hasta 15 días adelante o retroceder siempre que no se alcance la fecha actual
    if ((cuando === 'despues' && fechaLimite <= quinceDiasDespues) ||
        (cuando === 'antes' && fechaLimite >= fechaActual)) {
      this.now = fechaLimite;
  
      this.dia = this.now.getDate().toString();
      this.mesNumero = this.now.getMonth();
      this.mes = this.mesNumeroToString(this.mesNumero);
      this.anio = this.now.getFullYear().toString();
      this.hora = this.now.getHours();
      this.diaString = this.diaSemanaString(this.now.getDay());
  
      this.getHorariosDisponibles();
      this.cambiarHorariosPorEspecialista();
    } else {
      console.error("No se puede avanzar más allá de los 15 días posteriores a la fecha actual o retroceder desde la fecha actual.");
    }
  }
  
  imgEspecialidad(especialidad:any){
    let imagen;
    switch(especialidad){
      case "Traumatólogo":
        imagen = "../../../assets/especialistas/Traumatólogo.png"
        break;
      case "Cirujano":
        imagen = "../../../assets/especialistas/Cirujano.png"
          break;
      case "Neumólogo":
        imagen = "../../../assets/especialistas/Infectologo.png"
          break;
      case "Dentista":
        imagen = "../../../assets/especialistas/Dentista.png"
        break;
      case "Cardiologo":
        imagen = "../../../assets/especialistas/Cardiologo.png"
        break;
      case "Pediatra":
        imagen = "../../../assets/especialistas/Pediatra.png"
        break;
        case "Ginecolo":
          imagen = "../../../assets/especialistas/Ginecologa.png"
          break;
        default:
          imagen = "../../../assets/especialistas/Generico.png"
          break;
                  
    }
    return imagen;
  }
  

}
