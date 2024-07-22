export class HorariosEspecialista {

    id:string;
    email:string;
    lunInicio:string;
    lunFin:string;
    marInicio:string;
    marFin:string;
    mierInicio:string;
    mierFin:string;
    jueInicio:string;
    jueFin:string;
    vierInicio:string;
    vierFin:string;
    sabInicio:string;
    sabFin:string;
    estados:string[];
    especialidadesPorDia:string[];

    constructor(id:string,email:string){
        this.id = id;
        this.email = email;
        this.lunInicio = "8:00";
        this.lunFin = "19:00";
        this.marInicio = "8:00";
        this.marFin = "19:00";
        this.mierInicio = "8:00";
        this.mierFin = "19:00";
        this.jueInicio = "8:00";
        this.jueFin = "19:00";
        this.vierInicio = "8:00";
        this.vierFin = "19:00";
        this.sabInicio = "8:00";
        this.sabFin = "14:00";
        this.estados = ["Habilitado","Habilitado","Habilitado","Habilitado","Habilitado","Habilitado"];
        this.especialidadesPorDia = ["","","","","",""];
    }
}
