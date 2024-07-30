export class HistoriaClinica {

    id:string;
    paciente:string;
    especialista:string;
    dinamicos: {clave: string, valor: string}[];
    altura:string;
    peso:number;
    temperatura:string;
    presion:string;
    especialidad:string

    constructor(id:string,paciente:string,especialista:string,dinamicos: {clave: string, valor: string}[],altura:string,peso:number,
        temperatura:string,presion:string,especialidad:string){
        this.id = id;
        this.paciente = paciente;
        this.especialista = especialista;
        this.dinamicos = dinamicos;
        this.altura = altura;
        this.peso = peso;
        this.temperatura = temperatura;
        this.presion = presion;
        this.especialidad = especialidad;
    }
}
