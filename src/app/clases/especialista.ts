import { Especialidad } from "./especialidad";
import { Usuario } from "./usuario";

export class Especialista extends Usuario {
    especialidad!: Especialidad[];
    duracionTurno!:number;
    disponibilidad:any[]=[];
    tipo = 'especialista'
    aprobado = false;
}
