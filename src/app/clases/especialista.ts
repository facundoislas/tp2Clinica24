import { Usuario } from "./usuario";

export class Especialista extends Usuario {
    especialidades!: string;
    duracionTurno!:number;
    disponibilidad:any[]=[];
    tipo = 'especialista'
    aprobado = false;
}
