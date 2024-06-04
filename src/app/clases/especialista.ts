import { Usuario } from "./usuario";

export class Especialista extends Usuario {
    especialidad: string[]=[];
    aprobado!: boolean;
    duracionTurno!:number;
    disponibilidad:any[]=[];
}
