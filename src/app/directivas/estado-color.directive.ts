import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appEstadoColor]',
  standalone: true
})
export class EstadoColorDirective implements OnChanges  {

  @Input('appEstadoColor') estado!: string;
  private currentClasses: string[] = [];

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges() {
    this.setColor();
  }

  private setColor() {
    // Remover clases anteriores de estado
    this.currentClasses.forEach(cls => {
      this.renderer.removeClass(this.el.nativeElement, cls);
    });
    this.currentClasses = [];

    // Aplicar nuevas clases según el estado
    switch (this.estado) {
      case 'finalizado':
        this.addClasses(['estado-finalizado']);
        break;
      case 'pendiente':
        this.addClasses(['estado-pendiente']);
        break;
      case 'cancelado':
        this.addClasses(['estado-cancelado']);
        break;
      case 'rechazado':
        this.addClasses(['estado-rechazado']);
        break;
      case 'aceptado':
        this.addClasses(['estado-aceptado']);
        break;
      default:
        this.addClasses(['estado-default']);
    }
  }

  private addClasses(classes: string[]) {
    classes.forEach(cls => {
      this.renderer.addClass(this.el.nativeElement, cls);
      this.currentClasses.push(cls);
    });
  }
}
