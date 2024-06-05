import { Usuario } from "./usuario";

export class Especialista extends Usuario {
    especialidad!: string;
    duracionTurno!:number;
    disponibilidad:any[]=[];
}
