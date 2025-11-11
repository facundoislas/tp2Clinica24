import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'misPipes',
  standalone: true
})
export class MisPipesPipe implements PipeTransform {

  transform(value: any, tipo: string = 'booleano'): string {
    
    switch(tipo) {
      case 'booleano':
        return this.formatearBooleano(value);
      
      case 'dni':
        return this.formatearDni(value);
      
      default:
        return value;
    }
  }

  // Convierte booleano a texto: true → "Habilitado", false → "Deshabilitado"
  private formatearBooleano(value: boolean): string {
    return value ? "Habilitado" : "Deshabilitado";
  }

  // Formatea DNI con puntos: 12345678 → 12.345.678
  private formatearDni(value: any): string {
    if (!value) return '';
    
    // Convertir a string y limpiar caracteres no numéricos
    const dni = value.toString().replace(/\D/g, '');
    
    // Si no tiene números, retornar vacío
    if (dni.length === 0) return '';
    
    // Formatear con puntos cada 3 dígitos desde la derecha
    // Ej: 12345678 → 12.345.678
    return dni.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

}
