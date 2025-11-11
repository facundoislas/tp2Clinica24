import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paginacion',
  standalone: true,
  pure: false
})
export class PaginacionPipe implements PipeTransform {

  transform(items: any[], paginaActual: number, itemsPorPagina: number): any[] {
    if (!items || items.length === 0) {
      return [];
    }

    const inicio = (paginaActual - 1) * itemsPorPagina;
    const fin = inicio + itemsPorPagina;

    return items.slice(inicio, fin);
  }

}

