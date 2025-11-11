import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appResaltar]',
  standalone: true
})
export class ResaltarDirective {

  @Input() colorResaltar: string = '#20c997'; // Color por defecto (verde teal)
  @Input() colorOriginal: string = ''; // Color original del elemento
  @Input() escalaResaltar: number = 1.05; // Escala al resaltar (por defecto 1.05 = 5% más grande)
  
  private colorInicial: string = '';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    // Guardar el color de fondo original
    this.colorInicial = this.colorOriginal || this.el.nativeElement.style.backgroundColor || 'transparent';
  }

  @HostListener('mouseenter') onMouseEnter() {
    // Al pasar el mouse, cambiar el color de fondo y agrandar
    this.resaltar(this.colorResaltar, this.escalaResaltar);
  }

  @HostListener('mouseleave') onMouseLeave() {
    // Al salir el mouse, restaurar el color original y tamaño normal
    this.resaltar(this.colorInicial, 1);
  }

  private resaltar(color: string, escala: number) {
    // Aplicar el color de fondo al elemento
    this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', color);
    
    // Aplicar la escala (agrandar/reducir)
    this.renderer.setStyle(this.el.nativeElement, 'transform', `scale(${escala})`);
    
    // Añadir transiciones suaves para color, transform y box-shadow
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease');
    
    // Agregar una sombra cuando está resaltado para dar más énfasis
    if (escala > 1) {
      this.renderer.setStyle(this.el.nativeElement, 'boxShadow', '0 4px 12px rgba(32, 201, 151, 0.3)');
      this.renderer.setStyle(this.el.nativeElement, 'zIndex', '10');
    } else {
      this.renderer.setStyle(this.el.nativeElement, 'boxShadow', 'none');
      this.renderer.setStyle(this.el.nativeElement, 'zIndex', 'auto');
    }
  }

}

