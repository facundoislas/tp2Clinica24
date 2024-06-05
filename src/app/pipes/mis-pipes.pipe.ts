import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'misPipes',
  standalone: true
})
export class MisPipesPipe implements PipeTransform {

  transform(value: boolean): string {
    return value ? "Habilitado" : "Deshabilitado";
  }

}
