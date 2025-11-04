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



}
