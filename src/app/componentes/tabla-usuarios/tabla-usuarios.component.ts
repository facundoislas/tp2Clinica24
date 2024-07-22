import { Component } from '@angular/core';
import { FirebaseService } from '../../servicios/firebase.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MisPipesPipe } from "../../pipes/mis-pipes.pipe";

@Component({
  selector: 'app-tabla-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, MisPipesPipe],
  templateUrl: './tabla-usuarios.component.html',
  styleUrl: './tabla-usuarios.component.css'
})
export class TablaUsuariosComponent {

  
  public usuarios: any[] = [];

  constructor( private userService: FirebaseService){
    
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


}
