import { Component } from '@angular/core';
import { UsuariosServiceService } from '../../servicios/usuarios-service.service';
import { Usuario } from '../../clases/usuario';
import { CommonModule } from '@angular/common';
import { object } from '@angular/fire/database';
import { MisPipesPipe } from '../../pipes/mis-pipes.pipe';

@Component({
  selector: 'app-tabla-usuarios',
  standalone: true,
  imports: [CommonModule, MisPipesPipe],
  templateUrl: './tabla-usuarios.component.html',
  styleUrl: './tabla-usuarios.component.css'
})
export class TablaUsuariosComponent {

  public usuarios: any[] = [];

  constructor( private userService: UsuariosServiceService){
    
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
