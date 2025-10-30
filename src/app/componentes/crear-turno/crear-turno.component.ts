import { Component } from '@angular/core';
import { CabeceraComponent } from "../cabecera/cabecera.component";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Turno } from '../../clases/turno';
import { Especialista } from '../../clases/especialista';
import { Paciente } from '../../clases/paciente';
import { HorariosEspecialista } from '../../clases/horarios-especialista';
import { HorariosEspecialistaService } from '../../servicios/horarios-especialista.service';
import { Router } from '@angular/router';
import { EspecialidadesService } from '../../servicios/especialidades.service';
import { FirebaseService } from '../../servicios/firebase.service';
import { TurnosService } from '../../servicios/turnos.service';

interface DiaDisponible {
  fecha: Date;
  diaNombre: string;
  diaNumero: number;
  mesNombre: string;
  disponible: boolean;
}

@Component({
  selector: 'app-crear-turno',
  standalone: true,
  imports: [CabeceraComponent, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './crear-turno.component.html',
  styleUrls: [ './crear-turno.component.css']
})
export class CrearTurnoComponent {
  
  public loading = true;
  usuario!: any;
  noHayDatos = "";

  // DOM
  etapa = "especialidad";

  // TURNOS
  turnos:Turno[] = [];

  // Especialidades
  especialidades:any ;
  especialidadElegida: any;
  especialistas: any[] = [];
  especialistaElegido!: any;
  especialistaElegidoStr = "";
  diaElegido = "";
  horarioElegido = "";
  especialistasPorEspecialidad: any[] = [];
  duracionTurno: number = 30; // Duración por defecto

  // PACIENTES (para admin)
  pacientes: any[] = [];
  pacienteElegido!: any;
  pacienteElegidoStr = "";

  // HORARIOS
  horariosEspecialistas:HorariosEspecialista[] = [];
  horariosDisponiblesDelDia: string[] = [];

  // Días disponibles (15 días)
  diasDisponibles: DiaDisponible[] = [];
  diaSeleccionadoIndex: number = -1;

  constructor(
    private turnosData:TurnosService,
    private horariosEspecialistaService: HorariosEspecialistaService, 
    private especialidadesService: EspecialidadesService, 
    private firebaseData:FirebaseService, 
    private router: Router
  ){}
  
  ngOnInit(): void {
    this.especialidadesService.getEspecialidades().subscribe(esp => {
      this.especialidades = esp;
      this.ordernarListaEspecialidades();
      
      this.firebaseData.getUsuariosPorTipo("especialista").subscribe((usuarios: any[]) => {
        this.especialistas = usuarios;
        console.log("Especialistas cargados:", this.especialistas);
        // Verificar si tienen imágenes
        this.especialistas.forEach((e: any) => {
          console.log(`Especialista ${e.nombre} - Imagen (foto1):`, e.foto1);
        });
      });
      
      // Cargar pacientes para el admin
      this.firebaseData.getUsuariosPorTipo("paciente").subscribe((usuarios: any[]) => {
        this.pacientes = usuarios;
        console.log("Pacientes cargados:", this.pacientes);
        // Verificar si tienen imágenes
        this.pacientes.forEach((p: any) => {
          console.log(`Paciente ${p.nombre} - Imagen (foto1):`, p.foto1, '- Imagen (foto2):', p.foto2);
        });
      });
      
      this.horariosEspecialistaService.getHorarioEspecialistas().subscribe(horario => {
        this.horariosEspecialistas = horario;
      });

      this.turnosData.getTurnosDB().subscribe(turnos => {
        this.turnos = turnos;
      });

      setTimeout(()=>{
        this.loading = false;
      }, 2500);

      this.cargarUsuario();
    });
  }

  async cargarUsuario() {
    const email = sessionStorage.getItem('user');
    this.usuario = await this.firebaseData.getUsuarioEmail(email);
    console.log("usuario", this.usuario);
    
    // Si es admin, empezar con la selección de paciente
    if (this.usuario && this.usuario.tipo === 'admin') {
      this.etapa = "paciente";
    } else {
      // Si es paciente, empezar con la selección de especialista
      this.etapa = "especialista";
    }
  }

  elegirPaciente(paciente: any) {
    this.pacienteElegido = paciente;
    this.pacienteElegidoStr = `${paciente.nombre} ${paciente.apellido}`;
    // Admin sigue el flujo de elegir especialista primero
    this.etapa = "especialista";
  }

  elegirEspecialidad(especialidadElegida:string){
    this.especialidadElegida = especialidadElegida;
    
    // Obtener la duración del turno para la especialidad elegida
    const especialidadDelEspecialista = this.especialistaElegido.especialidad.find(
      (esp: any) => esp.especialidad === this.especialidadElegida
    );
    this.duracionTurno = especialidadDelEspecialista?.duracion || 30;
    
    // Generar los 15 días disponibles
    this.generarDiasDisponibles();
    
    this.volver('horario');
  }

  elegirEspecialista(especialista: any){
    this.especialistaElegido = especialista;
    this.especialistaElegidoStr = this.especialistaElegido.nombre + " " + this.especialistaElegido.apellido;
    
    // Pasar a elegir especialidad del especialista elegido
    this.volver('especialidad');
  }

  generarDiasDisponibles() {
    this.diasDisponibles = [];
    const hoy = new Date();
    
    for (let i = 0; i < 15; i++) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() + i);
      
      // Saltar domingos
      if (fecha.getDay() === 0) {
        continue;
      }

      const diaNombre = this.diaSemanaString(fecha.getDay());
      const disponible = this.esDiaDisponibleParaEspecialista(diaNombre);

      this.diasDisponibles.push({
        fecha: fecha,
        diaNombre: diaNombre,
        diaNumero: fecha.getDate(),
        mesNombre: this.mesNumeroToString(fecha.getMonth()),
        disponible: disponible
      });
    }
  }

  esDiaDisponibleParaEspecialista(diaNombre: string): boolean {
    let disponible = false;
    
    this.horariosEspecialistas.forEach(horarioEspecialista => {
      if(horarioEspecialista.email === this.especialistaElegido.email) {
        const diasMap: {[key: string]: number} = {
          'Lunes': 0,
          'Martes': 1,
          'Miercoles': 2,
          'Jueves': 3,
          'Viernes': 4,
          'Sabado': 5
        };
        
        const diaIndex = diasMap[diaNombre];
        if (diaIndex !== undefined) {
          disponible = horarioEspecialista.estados[diaIndex] === 'Habilitado' &&
                       horarioEspecialista.especialidadesPorDia[diaIndex] === this.especialidadElegida;
        }
      }
    });
    
    return disponible;
  }

  seleccionarDia(index: number) {
    if (!this.diasDisponibles[index].disponible) {
      this.noHayDatos = "El especialista no atiende este día.";
      this.horariosDisponiblesDelDia = [];
      return;
    }

    this.diaSeleccionadoIndex = index;
    this.cargarHorariosDelDia(this.diasDisponibles[index]);
  }

  cargarHorariosDelDia(dia: DiaDisponible) {
    this.noHayDatos = "";
    this.horariosDisponiblesDelDia = [];
    
    // Obtener horarios del especialista para este día
    this.horariosEspecialistas.forEach(horarioEspecialista => {
      if(horarioEspecialista.email === this.especialistaElegido.email) {
        let horaInicio = "";
        let horaFin = "";
        
        switch(dia.diaNombre) {
          case "Lunes":
            horaInicio = horarioEspecialista.lunInicio;
            horaFin = horarioEspecialista.lunFin;
            break;
          case "Martes":
            horaInicio = horarioEspecialista.marInicio;
            horaFin = horarioEspecialista.marFin;
            break;
          case "Miercoles":
            horaInicio = horarioEspecialista.mierInicio;
            horaFin = horarioEspecialista.mierFin;
            break;
          case "Jueves":
            horaInicio = horarioEspecialista.jueInicio;
            horaFin = horarioEspecialista.jueFin;
            break;
          case "Viernes":
            horaInicio = horarioEspecialista.vierInicio;
            horaFin = horarioEspecialista.vierFin;
            break;
          case "Sabado":
            horaInicio = horarioEspecialista.sabInicio;
            horaFin = horarioEspecialista.sabFin;
            break;
        }
        
        // Generar slots según duración del turno
        this.horariosDisponiblesDelDia = this.generarSlotsHorarios(horaInicio, horaFin, this.duracionTurno, dia.fecha);
      }
    });

    if (this.horariosDisponiblesDelDia.length === 0) {
      this.noHayDatos = "No hay horarios disponibles para este día.";
    }
  }

  generarSlotsHorarios(horaInicio: string, horaFin: string, duracionMinutos: number, fecha: Date): string[] {
    const slots: string[] = [];
    
    // Convertir hora inicio y fin a minutos
    const [horaIniH, horaIniM] = horaInicio.split(':').map(Number);
    const [horaFinH, horaFinM] = horaFin.split(':').map(Number);
    
    let minutosActuales = horaIniH * 60 + horaIniM;
    const minutosFin = horaFinH * 60 + horaFinM;
    
    while (minutosActuales + duracionMinutos <= minutosFin) {
      const horas = Math.floor(minutosActuales / 60);
      const minutos = minutosActuales % 60;
      const horarioStr = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
      
      // Verificar si el horario está ocupado
      if (!this.estaHorarioOcupado(horarioStr, fecha)) {
        slots.push(horarioStr);
      }
      
      minutosActuales += duracionMinutos;
    }
    
    return slots;
  }

  estaHorarioOcupado(hora: string, fecha: Date): boolean {
    const diaStr = fecha.getDate().toString();
    const mesStr = this.mesNumeroToString(fecha.getMonth());
    const anioStr = fecha.getFullYear().toString();
    
    return this.turnos.some(turno => 
      turno.especialista === this.especialistaElegido.email &&
      turno.dia === diaStr &&
      turno.mes === mesStr &&
      turno.anio === anioStr &&
      turno.hora === hora
    );
  }

  elegirHorario(horario:string){
    this.horarioElegido = horario;
    const diaSeleccionado = this.diasDisponibles[this.diaSeleccionadoIndex];
    this.diaElegido = `${horario} Hrs. ${diaSeleccionado.diaNombre} ${diaSeleccionado.diaNumero} de ${diaSeleccionado.mesNombre}`;
    this.volver("confirmar");
  }

  confirmar(){
    const diaSeleccionado = this.diasDisponibles[this.diaSeleccionadoIndex];
    const anio = diaSeleccionado.fecha.getFullYear().toString();
    
    // Determinar el email del paciente según si es admin o no
    const emailPaciente = this.usuario.tipo === 'admin' 
      ? this.pacienteElegido.email 
      : this.usuario.email;
    
    this.turnosData.cargarTurnosBD(new Turno(
      "",
      emailPaciente,
      this.especialistaElegido.email,
      this.especialidadElegida,
      diaSeleccionado.diaNumero.toString(),
      diaSeleccionado.mesNombre,
      anio,
      this.horarioElegido,
      "pendiente",
      "",
      "",
      ""
    ));
    
    this.volver("fin");
  }

  cerrarModalConfirmacion() {
    this.volver('horario');
  }

  volver(lugar:string){
    if(lugar == "home"){
      this.router.navigateByUrl("");
    }
    else if(lugar == "paciente"){
      this.etapa = "paciente";
      this.diaSeleccionadoIndex = -1;
      this.horariosDisponiblesDelDia = [];
      this.especialistaElegido = null;
      this.especialidadElegida = null;
    }
    else if(lugar == "especialidad"){
      this.etapa = "especialidad";
      this.diaSeleccionadoIndex = -1;
      this.horariosDisponiblesDelDia = [];
      this.especialidadElegida = null;
    }
    else if(lugar == "especialista"){
      this.etapa = "especialista";
      this.diaSeleccionadoIndex = -1;
      this.horariosDisponiblesDelDia = [];
      this.especialistaElegido = null;
      this.especialidadElegida = null;
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
      this.router.navigateByUrl("/turnos");
    }
  }

  ordernarListaEspecialidades(){
    this.especialidades.sort((one: number, two: number) => (one < two ? -1 : 1));
  }

  onImageError(event: any) {
    // Si la imagen falla al cargar, usar una imagen por defecto
    event.target.src = 'assets/imagenes/paciente.png';
  }

  formatearHora(hora: string): string {
    const [h, m] = hora.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const horas12 = h % 12 || 12;
    return `${horas12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
  }

  formatearFechaBoton(fecha: Date): string {
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${dia}-${mes}-${anio}`;
  }

  diaSemanaString(numero:number){
    const dias = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
    return dias[numero];
  }

  mesNumeroToString(numero:number){
    const meses = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    return meses[numero];
  }
}
