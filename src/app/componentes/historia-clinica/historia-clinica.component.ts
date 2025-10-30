import { Component, Input, SimpleChanges } from '@angular/core';
import { Paciente } from '../../clases/paciente';
import { HistoriaClinica } from '../../clases/historia-clinica';
import { FirebaseService } from '../../servicios/firebase.service';
import { TurnosService } from '../../servicios/turnos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-historia-clinica',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historia-clinica.component.html',
  styleUrls: ['./historia-clinica.component.css']
})
export class HistoriaClinicaComponent {

  usuario: any
  mail = sessionStorage.getItem('user');;
  paciente:Paciente = new Paciente();
  historias:any[] = [];
  pacientes:Paciente[] = [];
  especialistas: any[] = [];
  @Input() emailPaciente!: string;
  
  constructor(private firebaseService:FirebaseService,private historiaService:TurnosService){}

  async ngOnInit(): Promise<void> {
    console.log(this.mail);
    await this.cargarUsuario();
    await this.cargarEspecialistas();

    if(this.usuario && this.usuario.tipo == "paciente"){
      this.paciente = this.usuario;
    }

    console.log("email paciente",this.emailPaciente)
    if(!this.emailPaciente){
      this.cargarPacientes();
      console.log("historias",this.historias)
    } else {
      this.cargarPaciente2()
    }
  } 

  async cargarUsuario() {
    const email = sessionStorage.getItem('user');
    this.usuario =  await this.firebaseService.getUsuarioEmail(email);
    console.log("usuario", this.usuario);
  }

  cargarEspecialistas(): Promise<void> {
    return new Promise((resolve) => {
      this.firebaseService.getUsuariosPorTipo("especialista").subscribe((usuarios: any[]) => {
        this.especialistas = usuarios;
        console.log("Especialistas cargados:", this.especialistas);
        resolve();
      });
    });
  }

  getNombreEspecialista(emailEspecialista: string): string {
    if (!emailEspecialista) {
      return 'Email no disponible';
    }
    
    const especialista = this.especialistas.find(e => e.email === emailEspecialista);
    if (especialista) {
      return `${especialista.nombre} ${especialista.apellido}`;
    }
    
    // Si no se encuentra, devolver el email como fallback
    console.warn(`Especialista no encontrado para email: ${emailEspecialista}`);
    return emailEspecialista;
  }

  cargarPacientes(){
    this.historias = [];
    this.firebaseService.getUsuariosPorTipo("paciente").subscribe((usuarios: any[]) => {
      this.pacientes = usuarios;
      console.log(this.pacientes);
      this.pacientes.forEach(paciente => {
        if(this.mail == paciente.email){
          this.paciente = paciente;
        }
      });
      this.historiaService.getHistoriaDB().subscribe(historias => {
        this.historias = [];
        historias.forEach(historia=>{
          if(historia.paciente === this.paciente.email){
            this.historias.push(historia);
          }
        });
        // Ordenar por fecha más reciente primero
        this.ordenarHistoriasPorFecha();
      });
  });}

  cargarPaciente2() {
    this.historias = [];
    this.firebaseService.getUsuariosPorTipo("paciente").subscribe((usuarios: any[]) => {
      this.pacientes = usuarios;
      console.log(this.pacientes);
      this.pacientes.forEach(paciente => {
        if(this.emailPaciente == paciente.email){
          this.paciente = paciente;
        }
      });
      this.historiaService.getHistoriaDB().subscribe(historias => {
        this.historias = [];
        historias.forEach(historia=>{
          if(historia.paciente === this.paciente.email){
            this.historias.push(historia);
          }
        });
        // Ordenar por fecha más reciente primero
        this.ordenarHistoriasPorFecha();
      });
    });
  }

  ordenarHistoriasPorFecha() {
    // Ordenar por ID u otro criterio si no hay fecha
    this.historias.sort((a: any, b: any) => {
      // Mantener el orden de inserción (último primero)
      return 0;
    });
  }
}
