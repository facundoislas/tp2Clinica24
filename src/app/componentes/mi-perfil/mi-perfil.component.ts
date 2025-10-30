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
import { LogoComponent } from '../logo/logo.component';
import { AlertServiceService } from '../../servicios/alert-service.service';


@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CabeceraComponent, CommonModule, FormsModule,MatSelectModule, MatFormFieldModule, RouterLink, LogoComponent],
  templateUrl: './mi-perfil.component.html',
  styleUrls: [ './mi-perfil.component.css']
})

export class MiPerfilComponent {
  loading = true;
  mostrar = false;
  email!:any;
  userData!: any;
  porTipo: any[] = [];
  dias=[{dia:"Lunes", ini: "", fin: ""},{dia:"Martes", ini: "", fin: ""},{dia:"Miercoles", ini: "", fin: ""},
    {dia:"Jueves", ini: "", fin: ""},{dia:"Viernes", ini: "", fin: ""},{dia:"Sabado", ini: "", fin: ""}];;
  horasDefault=[8,9,10,11,12,13,14,15,16,17,18,19];
  disponibilidades = ["Habilitado","Habilitado","Habilitado","Habilitado","Habilitado","Habilitado"];
  horarios = ["8:00","9:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00"];
  horariosSabado = ["8:00","9:00","10:00","11:00","12:00","13:00","14:00"];
  horariosEspecialista!:HorariosEspecialista;
  especialidadesPorDia:string[] = [];
  
  // Variables para el modal de duraciones
  mostrarModalDuraciones: boolean = false;
  duracionesTemporal: number[] = [];

  // Método para obtener los horarios según el día
  getHorariosPorDia(dia: string): string[] {
    if (dia === "Sabado") {
      return this.horariosSabado;
    }
    return this.horarios;
  }

  seccion:string = 'menu';
  tipoUsuarioARegistrar:string = '';

  constructor(private firebaseService: FirebaseService, private horarioEspService: HorariosEspecialistaService, private alert: AlertServiceService) { }

  ngOnInit(): void {
    console.log("=== MI-PERFIL COMPONENT INIT ===");
    this.email = sessionStorage.getItem('user');
    console.log("Email desde sessionStorage:", this.email);
    
    // Intentar obtener los datos del usuario desde sessionStorage primero
    const userDataString = sessionStorage.getItem('userData');
    console.log("userData string desde sessionStorage:", userDataString);
    
    if (userDataString) {
      try {
        this.userData = JSON.parse(userDataString);
        console.log("✅ Datos cargados desde sessionStorage:", this.userData);
        console.log("Tipo de usuario:", this.userData.tipo);
        console.log("Nombre completo:", this.userData.nombre, this.userData.apellido);
        this.loading = false;
        this.loadSpecialistData();
      } catch (error) {
        console.error("❌ Error al parsear userData desde sessionStorage:", error);
        this.loadFromFirebase();
      }
    } else {
      console.log("⚠️ No hay userData en sessionStorage, cargando desde Firebase...");
      this.loadFromFirebase();
    }
  }

  async loadFromFirebase() {
    // Si no hay datos en sessionStorage, cargarlos desde Firebase
    await this.searchUser();
    console.log("Datos cargados desde Firebase:", this.userData);
    this.loading = false;
    this.loadSpecialistData();
    
    this.firebaseService.getUsuariosPorTipo("especialista").subscribe((usuarios: any[]) => {
      this.porTipo = usuarios;
      console.log(this.porTipo); 
    });
  }

  loadSpecialistData() {
    if (this.userData && this.userData.tipo === 'especialista') {
      this.horarioEspService.getHorarioEspecialistas().subscribe(horario => {
        horario.forEach(hora => {
          console.log("aca",hora);
          if (this.userData.email == hora.email) {
            console.log("entre");
            this.horariosEspecialista = hora;
            this.disponibilidades = this.horariosEspecialista.estados;
            // Inicializar especialidadesPorDia si viene vacío o undefined
            if (this.horariosEspecialista.especialidadesPorDia && this.horariosEspecialista.especialidadesPorDia.length > 0) {
              // Convertir objetos a strings si es necesario
              this.especialidadesPorDia = this.horariosEspecialista.especialidadesPorDia.map((esp: any) => {
                // Si es un objeto, extraer la propiedad especialidad
                if (typeof esp === 'object' && esp !== null && esp.especialidad) {
                  return esp.especialidad;
                }
                // Si ya es un string, devolverlo tal cual
                return esp || "";
              });
            } else {
              // Inicializar con array vacío de 6 elementos (uno por cada día)
              this.especialidadesPorDia = ["", "", "", "", "", ""];
            }
            console.log("Especialidades cargadas:", this.especialidadesPorDia);
            this.cargarHorarios(hora);
          }
        });
      });
    }
  }

  async searchUser() {
    console.log("Buscando usuario en Firebase para perfil con email:", this.email);
    this.userData = await this.firebaseService.getUsuarioEmail(this.email);
    if (this.userData) {
      console.log("✅ Usuario encontrado en Firebase para perfil:", this.userData);
      // Guardar en sessionStorage si no estaba
      if (!sessionStorage.getItem('userData')) {
        sessionStorage.setItem('userData', JSON.stringify(this.userData));
      }
    } else {
      console.error("❌ No se encontró usuario en Firebase para perfil");
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

  cambiarHorario(dia:string,tipo:string, event: any){
    const selectedValue = event.value;

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

  cambiarEspecialidad(dia:string,event: any){
    // Extraer el valor seleccionado, asegurándose de que sea un string
    let selectedValue = event.value;
    
    // Si por alguna razón viene como objeto, extraer solo el string
    if (typeof selectedValue === 'object' && selectedValue !== null && selectedValue.especialidad) {
      selectedValue = selectedValue.especialidad;
    }
    
    console.log("Especialidad seleccionada para", dia, ":", selectedValue);
    
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
    
    console.log("Array actualizado:", this.especialidadesPorDia);
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
    
    // Actualizar especialidades por día, asegurándose de que sean strings
    this.horariosEspecialista.especialidadesPorDia = this.especialidadesPorDia.map((esp: any) => {
      // Si es un objeto, extraer el string
      if (typeof esp === 'object' && esp !== null && esp.especialidad) {
        return esp.especialidad;
      }
      // Si ya es string, devolverlo tal cual
      return esp || "";
    });
    
    console.log("Horarios a guardar:", this.horariosEspecialista);
  }

  cerrarModulo(){
    this.actualizarHorarioEspecialista();
    this.horarioEspService.updateHorarioEspecialistas(this.horariosEspecialista);
    this.alert.showSuccessAlert1("", "Se han guardado tus horarios", "success");
    this.mostrar = false;
  }

  // Métodos para el modal de duraciones
  abrirModalDuraciones() {
    // Inicializar el array temporal con las duraciones actuales o 30 por defecto
    this.duracionesTemporal = [];
    if (this.userData && this.userData.especialidad) {
      this.userData.especialidad.forEach((esp: any) => {
        this.duracionesTemporal.push(esp.duracion || 30);
      });
    }
    this.mostrarModalDuraciones = true;
  }

  cerrarModalDuraciones() {
    this.mostrarModalDuraciones = false;
    this.duracionesTemporal = [];
  }

  async guardarDuraciones() {
    try {
      // Validar que todas las duraciones sean >= 30
      const todasValidas = this.duracionesTemporal.every(duracion => duracion >= 30);
      
      if (!todasValidas) {
        this.alert.showSuccessAlert1("", "La duración mínima de un turno es de 30 minutos", "warning");
        return;
      }

      // Actualizar el array de especialidades con las nuevas duraciones
      const especialidadesActualizadas = this.userData.especialidad.map((esp: any, index: number) => {
        return {
          especialidad: esp.especialidad,
          duracion: this.duracionesTemporal[index] || 30
        };
      });

      // Actualizar en Firebase
      await this.firebaseService.actualizarEspecialidadesConDuracion(this.userData.email, especialidadesActualizadas);
      
      // Actualizar userData local
      this.userData.especialidad = especialidadesActualizadas;
      
      // Actualizar sessionStorage
      sessionStorage.setItem('userData', JSON.stringify(this.userData));
      
      this.alert.showSuccessAlert1("", "Duraciones de turnos guardadas correctamente", "success");
      this.cerrarModalDuraciones();
      
    } catch (error) {
      console.error("Error al guardar duraciones:", error);
      this.alert.showSuccessAlert1("", "Error al guardar las duraciones", "error");
    }
  }

  
}
