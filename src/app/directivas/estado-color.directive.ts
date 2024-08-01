import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appEstadoColor]',
  standalone: true
})
export class EstadoColorDirective implements OnChanges  {

  @Input('appEstadoColor') estado!: string;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges() {
    this.setColor();
  }

  private setColor() {
    let colorClass = '';

    switch (this.estado) {
      case 'finalizado':
        colorClass = 'bg-success text-white'; // Verde para finalizado
        break;
      case 'pendiente':
        colorClass = 'bg-secondary text-white'; // Gris para pendiente
        break;
      case 'cancelado':
        colorClass = 'bg-danger text-white'; // Rojo para cancelado
        break;
      default:
        colorClass = 'bg-light'; // Color por defecto
    }

    this.renderer.setAttribute(this.el.nativeElement, 'class', colorClass);
  }
}
