import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../servicios/firebase.service';
import { RouterLink } from '@angular/router';
import { TurnosService } from '../../servicios/turnos.service';
import { HistoriaClinica } from '../../clases/historia-clinica';
import { Paciente } from '../../clases/paciente';

@Component({
  selector: 'app-tabla-pacientes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './tabla-pacientes.component.html',
  styleUrls: [ './tabla-pacientes.component.css']
})
export class TablaPacientesComponent {

   
  public usuarios: any[] = [];
  historias: HistoriaClinica[]=[];
  mail = sessionStorage.getItem('user');
  listaPacientesEsp: Paciente[] = [];
  @Output() pacienteSeleccionado = new EventEmitter<string>();

  constructor( private firebaseService: FirebaseService, private turnosService : TurnosService){
    
  }

  traer()
  {

    this.firebaseService.getUsuariosPorTipo('paciente').subscribe(usuarios => {
      this.usuarios = usuarios;
      this.turnosService.getHistoriaDB().subscribe(historias=>{
        this.historias = historias;
        this.traerPacientesEsp();
      })
      
    })
   
  }

  ngOnInit()
  {
    
    this.traer();
  }



  traerPacientesEsp()
  {
    this.usuarios.forEach(usuario => {
      const historiasUsuario = this.historias.filter(historia => historia.paciente === usuario.email);
      historiasUsuario.forEach(historia => {
        if (historia.especialista == this.mail) {
            this.listaPacientesEsp.push(usuario)
            };
            });
      
    });
    console.log("aca", this.listaPacientesEsp)
  }

  seleccionarPaciente(email: string) {
    this.pacienteSeleccionado.emit(email);
  }



}
