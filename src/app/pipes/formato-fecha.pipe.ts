import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatoFecha',
  standalone: true
})
export class FormatoFechaPipe implements PipeTransform {

  transform(value: number): string {
    return new Date(value * 1000).toLocaleString();
  }

}
