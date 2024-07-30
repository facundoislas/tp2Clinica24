import { Component } from '@angular/core';
import { CabeceraComponent } from "../cabecera/cabecera.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../servicios/firebase.service';
import { HorariosEspecialista } from '../../clases/horarios-especialista';
import { HorariosEspecialistaService } from '../../servicios/horarios-especialista.service';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CabeceraComponent, CommonModule, FormsModule,MatSelectModule, MatFormFieldModule, RouterLink],
  templateUrl: './mi-perfil.component.html',
  styleUrls: [ './mi-perfil.component.css']
})
export class MiPerfilComponent {

  mostrar = false;

  userData!: any;
  porTipo: any[] = [];
  email = sessionStorage.getItem('user');
  dias=[{dia:"Lunes", ini: "", fin: ""},{dia:"Martes", ini: "", fin: ""},{dia:"Miercoles", ini: "", fin: ""},
    {dia:"Jueves", ini: "", fin: ""},{dia:"Viernes", ini: "", fin: ""},{dia:"Sabado", ini: "", fin: ""}];;
  horasDefault=[8,9,10,11,12,13,14,15,16,17,18,19];
  disponibilidades = ["Habilitado","Habilitado","Habilitado","Habilitado","Habilitado","Habilitado"];
  horarios = ["8:00","9:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00"];
  horariosEspecialista!:HorariosEspecialista;
  especialidadesPorDia:string[] = [];

  seccion:string = 'menu';
  tipoUsuarioARegistrar:string = '';

  constructor(private firebaseService: FirebaseService, private horarioEspService: HorariosEspecialistaService) { }

  ngOnInit(): void {
  this.firebaseService.getUsuariosPorTipo("especialista").subscribe((usuarios: any[]) => {
  this.porTipo = usuarios;
  console.log(this.porTipo); });
    this.searchUser();
    this.horarioEspService.getHorarioEspecialistas().subscribe(horario => {
      horario.forEach(hora => {
        console.log(hora);
        if(this.userData.email == hora.email){
          this.horariosEspecialista = hora;
          this.disponibilidades = this.horariosEspecialista.estados;
          this.especialidadesPorDia = this.horariosEspecialista.especialidadesPorDia;
          this.cargarHorarios(hora);
        }
      });
    });
  }

   async searchUser() {
    if (this.email) {
      console.log("entre aca")
      this.userData = await this.firebaseService.getUsuarioEmail(this.email);
    }
  }

  

  cambiarSeccion(tipo:string)
  {
    this.seccion = 'seleccion';
    this.tipoUsuarioARegistrar = tipo;
  }

  volverMenuSeleccion()
  {
    this.seccion = 'menu';
  }

  abrirMisHorarios(){
    this.mostrar = true;
  }

  cargarHorarios(horario:HorariosEspecialista){
    this.dias[0].ini = horario.lunInicio;
    this.dias[0].fin = horario.lunFin;
    this.dias[1].ini = horario.marInicio;
    this.dias[1].fin = horario.marFin;
    this.dias[2].ini = horario.mierInicio;
    this.dias[2].fin = horario.mierFin;
    this.dias[3].ini = horario.jueInicio;
    this.dias[3].fin = horario.jueFin;
    this.dias[4].ini = horario.vierInicio;
    this.dias[4].fin = horario.vierFin;
    this.dias[5].ini = horario.sabInicio;
    this.dias[5].fin = horario.sabFin;
    
  }

  cambiarEstado(dia:string, estadoAnterior:string){
    
    if(estadoAnterior == "Habilitado"){
      estadoAnterior = "Inhabilitado";
    }
    else{
      estadoAnterior = "Habilitado";
    }
    switch(dia){
      case "Lunes":
        this.horariosEspecialista.estados[0] = estadoAnterior;
        break;
      case "Martes":
        this.horariosEspecialista.estados[1] = estadoAnterior;
        break;
      case "Miercoles":
        this.horariosEspecialista.estados[2] = estadoAnterior;
        break;
      case "Jueves":
        this.horariosEspecialista.estados[3] = estadoAnterior;
        break;
      case "Viernes":
        this.horariosEspecialista.estados[4] = estadoAnterior;
        break;
      case "Sabado":
        this.horariosEspecialista.estados[5] = estadoAnterior;
        break;
    }
    console.log(this.horarios);

  }

  cambiarHorario(dia:string,tipo:string, event: Event){
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    if(tipo == "inicio"){
      switch(dia){
        case "Lunes":
          this.dias[0].ini = selectedValue;
          break;
        case "Martes":
          this.dias[1].ini = selectedValue;
          break;
        case "Miercoles":
          this.dias[2].ini = selectedValue;
          break;
        case "Jueves":
          this.dias[3].ini = selectedValue;
          break;
        case "Viernes":
          this.dias[4].ini = selectedValue;
          break;
        case "Sabado":
          this.dias[5].ini = selectedValue;
          break;
      }
    }
    else{
      switch(dia){
        case "Lunes":
          this.dias[0].fin = selectedValue;
          break;
        case "Martes":
          this.dias[1].fin = selectedValue;
          break;
        case "Miercoles":
          this.dias[2].fin = selectedValue;
          break;
        case "Jueves":
          this.dias[3].fin = selectedValue;
          break;
        case "Viernes":
          this.dias[4].fin = selectedValue;
          break;
        case "Sabado":
          this.dias[5].fin = selectedValue;
          break;
      }
    }
  }

  cambiarEspecialidad(dia:string,event: Event){
    console.log(this.especialidadesPorDia)
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    switch(dia){
      case "Lunes":
        this.especialidadesPorDia[0] = selectedValue;
        break;
      case "Martes":
        this.especialidadesPorDia[1] = selectedValue;
        break;
      case "Miercoles":
        this.especialidadesPorDia[2] = selectedValue;
        break;
      case "Jueves":
        this.especialidadesPorDia[3] = selectedValue;
        break;
      case "Viernes":
        this.especialidadesPorDia[4] = selectedValue;
        break;
      case "Sabado":
        this.especialidadesPorDia[5] = selectedValue;
        break;
    }
  }

  actualizarHorarioEspecialista(){
    this.horariosEspecialista.lunInicio = this.dias[0].ini;
    this.horariosEspecialista.lunFin = this.dias[0].fin;
    this.horariosEspecialista.marInicio = this.dias[1].ini;
    this.horariosEspecialista.marFin = this.dias[1].fin;
    this.horariosEspecialista.mierInicio = this.dias[2].ini;
    this.horariosEspecialista.mierFin = this.dias[2].fin;
    this.horariosEspecialista.jueInicio = this.dias[3].ini;
    this.horariosEspecialista.jueFin = this.dias[3].fin;
    this.horariosEspecialista.vierInicio = this.dias[4].ini;
    this.horariosEspecialista.vierFin = this.dias[4].fin;
    this.horariosEspecialista.sabInicio = this.dias[5].ini;
    this.horariosEspecialista.sabFin = this.dias[5].fin;
  }

  cerrarModulo(){
    this.actualizarHorarioEspecialista();
    this.horarioEspService.updateHorarioEspecialistas(this.horariosEspecialista);
    this.mostrar = false;
  }

  
}
