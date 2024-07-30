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
  historias:HistoriaClinica[] = [];
  pacientes:Paciente[] = [];
  @Input() emailPaciente!: string;
  
  constructor(private firebaseService:FirebaseService,private historiaService:TurnosService){}

  ngOnInit(): void {
   
    console.log(this.mail);
    this.cargarUsuario();

    setTimeout(()=>{
      if(this.usuario.tipo == "paciente"){
        this.paciente = this.usuario;
      }
    },5500);
    console.log("email paciente",this.emailPaciente)
    if(!this.emailPaciente){
    this.cargarPacientes();
    console.log("historias",this.historias)}
    else
      {this.cargarPaciente2()}
  } 

  async cargarUsuario() {
    const email = sessionStorage.getItem('user');
    this.usuario =  await this.firebaseService.getUsuarioEmail(email);
    console.log("usuario", this.usuario);
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
        historias.forEach(historia=>{
          if(historia.paciente === this.paciente.email){
            this.historias.push(historia);
          }
        })
        
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
          historias.forEach(historia=>{
            if(historia.paciente === this.paciente.email){
              this.historias.push(historia);
            }
          })
          
        });
    });
    
}
}
