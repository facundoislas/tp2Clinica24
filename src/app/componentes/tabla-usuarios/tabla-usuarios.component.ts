import { Component, EventEmitter, Output } from '@angular/core';
import { FirebaseService } from '../../servicios/firebase.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MisPipesPipe } from "../../pipes/mis-pipes.pipe";
import { ExcelExportService } from '../../servicios/excel-export.service';

@Component({
  selector: 'app-tabla-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, MisPipesPipe],
  templateUrl: './tabla-usuarios.component.html',
  styleUrls: [ './tabla-usuarios.component.css']
})
export class TablaUsuariosComponent {

  
  public usuarios: any[] = [];
  @Output() pacienteSeleccionado = new EventEmitter<string>();

  constructor( private userService: FirebaseService, private excelExportService: ExcelExportService){
    
  }

  traer()
  {

    this.userService.getUsuarios().subscribe(usuarios => {
      this.usuarios = usuarios;
      console.log(this.usuarios)
    })
    
  }

  ngOnInit()
  {
    this.traer();
  }

  habilitarEspecialista(usuario: any){
    this.userService.updateUsuario(usuario.id, true)
    .then(()=>{
      usuario.aprobado = true;
      console.log("se actualizo");
    })
    .catch(error => console.error("error actualizando el usuario"));

  }

  deshabilitarEspecialista(usuario: any){

    this.userService.updateUsuario(usuario.id, false)
    .then(()=>{
      usuario.aprobado = false;
    })
    .catch(error => console.error("error actualizando el usuario"));
    
  }

  seleccionarPaciente(email: string) {
    this.pacienteSeleccionado.emit(email);
  }


  exportToExcel(): void {
    this.excelExportService.exportAsExcelFile(this.usuarios, 'usuarios');
  }

  getEspecialidades(user:any): string {
    if (user.especialidad && user.especialidad.length > 0) {
      return user.especialidad.map((esp:any) => esp.especialidad).join(', ');
    }
    return '';
  }

}
