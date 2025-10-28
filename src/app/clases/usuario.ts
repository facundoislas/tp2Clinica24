export class Usuario {
    id? : string;
    nombre!: string;
    apellido!: string;
    edad!: number;
    dni!: string;
    email!: string;
    img_1!: string | undefined;
    foto1?: string; // URL de la primera imagen en Firebase Storage
    foto2?: string; // URL de la segunda imagen en Firebase Storage (solo para pacientes)
    pass!:string;
    
}
