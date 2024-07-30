export class Turno {

    
    id:string;
    paciente:string;
    especialista:string;
    especialidad:string;
    dia:string;
    mes:string;
    anio:string;
    hora:string;
    estado:string;
    comentario:string;
    resenia:string;
    encuesta:string; 
    calificacion:string;
    fecha:string;

    constructor(id:string,paciente:string,especialista:string,especialidad:string,dia:string,mes:string,anio:string,hora:string,
    estado:string,comentario:string,encuesta:string,calificacion:string){
        this.id = id;
        this.paciente = paciente;
        this.especialista = especialista;
        this.especialidad = especialidad;
        this.dia = dia;
        this.mes = mes;
        this.anio = anio;
        this.hora = hora;
        this.estado = estado;
        this.comentario = comentario;
        this.resenia = "";
        this.encuesta = encuesta; 
        this.calificacion = calificacion;
        this.fecha = "";
    }
}
