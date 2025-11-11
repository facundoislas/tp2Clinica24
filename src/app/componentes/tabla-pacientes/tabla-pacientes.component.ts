import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../servicios/firebase.service';
import { TurnosService } from '../../servicios/turnos.service';
import { HistoriaClinica } from '../../clases/historia-clinica';
import { Paciente } from '../../clases/paciente';
import { Turno } from '../../clases/turno';

@Component({
  selector: 'app-tabla-pacientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tabla-pacientes.component.html',
  styleUrls: [ './tabla-pacientes.component.css']
})
export class TablaPacientesComponent {

   
  public usuarios: any[] = [];
  historias: HistoriaClinica[]=[];
  turnos: Turno[] = [];
  mail = sessionStorage.getItem('user');
  listaPacientesEsp: Paciente[] = [];
  pacientesConTurnos: any[] = [];
  cargando: boolean = true; // Estado de carga
  @Output() pacienteSeleccionado = new EventEmitter<string>();

  constructor( private firebaseService: FirebaseService, private turnosService : TurnosService){
    
  }

  traer()
  {
    this.cargando = true; // Iniciar carga
    this.firebaseService.getUsuariosPorTipo('paciente').subscribe(usuarios => {
      this.usuarios = usuarios;
      this.turnosService.getHistoriaDB().subscribe(historias=>{
        this.historias = historias;
        this.turnosService.getTurnosDB().subscribe(turnos => {
          this.turnos = turnos;
          this.traerPacientesEsp();
          this.construirPacientesConTurnos();
          this.cargando = false; // Finalizar carga
        });
      })
      
    })
   
  }

  ngOnInit()
  {
    
    this.traer();
  }



  traerPacientesEsp()
  {
    // Limpiar la lista antes de llenarla
    this.listaPacientesEsp = [];
    
    this.usuarios.forEach(usuario => {
      // Verificar si el paciente tiene al menos una historia con este especialista
      const tieneHistoriaConEspecialista = this.historias.some(historia => 
        historia.paciente === usuario.email && historia.especialista === this.mail
      );
      
      // Solo agregar el paciente una vez si tiene al menos una historia con este especialista
      if (tieneHistoriaConEspecialista && !this.listaPacientesEsp.some(p => p.email === usuario.email)) {
        this.listaPacientesEsp.push(usuario);
      }
    });
    
    console.log("Pacientes únicos del especialista:", this.listaPacientesEsp);
  }

  seleccionarPaciente(email: string) {
    this.pacienteSeleccionado.emit(email);
  }

  construirPacientesConTurnos() {
    this.pacientesConTurnos = [];
    
    this.listaPacientesEsp.forEach(paciente => {
      // Filtrar turnos del paciente con este especialista
      const turnosPaciente = this.turnos.filter(turno => 
        turno.paciente === paciente.email && turno.especialista === this.mail
      );
      
      // Ordenar turnos por fecha (más reciente primero)
      turnosPaciente.sort((a, b) => {
        const fechaA = this.convertirFechaATiempo(a);
        const fechaB = this.convertirFechaATiempo(b);
        return fechaB - fechaA; // Orden descendente (más reciente primero)
      });
      
      // Tomar solo los últimos 3 turnos
      const ultimos3Turnos = turnosPaciente.slice(0, 3);
      
      // Crear objeto con datos del paciente y sus turnos
      this.pacientesConTurnos.push({
        ...paciente,
        ultimos3Turnos: ultimos3Turnos
      });
    });
    
    console.log("Pacientes con sus últimos 3 turnos:", this.pacientesConTurnos);
  }
  
  convertirFechaATiempo(turno: Turno): number {
    // Convertir fecha del turno a timestamp para ordenar
    const meses: { [key: string]: number } = {
      'Enero': 0, 'Febrero': 1, 'Marzo': 2, 'Abril': 3, 'Mayo': 4, 'Junio': 5,
      'Julio': 6, 'Agosto': 7, 'Septiembre': 8, 'Octubre': 9, 'Noviembre': 10, 'Diciembre': 11
    };
    
    const mes = meses[turno.mes];
    const dia = parseInt(turno.dia);
    const anio = parseInt(turno.anio);
    const [hora, minutos] = turno.hora.split(':').map(Number);
    
    return new Date(anio, mes, dia, hora, minutos).getTime();
  }
  
  formatearFechaTurno(turno: Turno): string {
    return `${turno.dia}/${this.obtenerNumeroMes(turno.mes)}/${turno.anio} - ${turno.hora}`;
  }
  
  obtenerNumeroMes(mes: string): string {
    const meses: { [key: string]: string } = {
      'Enero': '01', 'Febrero': '02', 'Marzo': '03', 'Abril': '04', 
      'Mayo': '05', 'Junio': '06', 'Julio': '07', 'Agosto': '08',
      'Septiembre': '09', 'Octubre': '10', 'Noviembre': '11', 'Diciembre': '12'
    };
    return meses[mes] || '01';
  }

}
