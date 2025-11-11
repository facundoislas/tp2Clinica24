import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Directive({
  selector: '[appResaltarItemActivo]',
  standalone: true
})
export class ResaltarItemActivoDirective implements OnInit {

  @Input() rutaLink: string = ''; // Ruta del link del menú
  @Input() colorActivo: string = '#20c997'; // Color cuando está activo (verde teal)
  @Input() colorFondo: string = 'rgba(32, 201, 151, 0.1)'; // Fondo cuando está activo

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private router: Router
  ) {}

  ngOnInit() {
    // Verificar al inicio si la ruta actual coincide
    this.verificarRutaActiva(this.router.url);

    // Escuchar cambios de navegación
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.verificarRutaActiva(event.url);
      });
  }

  private verificarRutaActiva(urlActual: string) {
    // Normalizar las URLs eliminando parámetros de query
    const urlLimpia = urlActual.split('?')[0];
    const rutaLimpia = this.rutaLink.split('?')[0];

    // Verificar si la URL actual coincide con la ruta del link
    const esActivo = urlLimpia === rutaLimpia;

    if (esActivo) {
      this.aplicarEstiloActivo();
    } else {
      this.quitarEstiloActivo();
    }
  }

  private aplicarEstiloActivo() {
    // Aplicar fondo de color suave
    this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', this.colorFondo);
    
    // Hacer el texto más bold
    this.renderer.setStyle(this.el.nativeElement, 'fontWeight', '700');
    
    // Cambiar color del texto
    this.renderer.setStyle(this.el.nativeElement, 'color', this.colorActivo);
    
    // Agregar padding adicional en el lado izquierdo
    this.renderer.setStyle(this.el.nativeElement, 'paddingLeft', '16px');
    
    // Agregar transición suave
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'all 0.3s ease');
    
    // Agregar un pequeño ícono o marca visual (opcional con ::before mediante clase)
    this.renderer.addClass(this.el.nativeElement, 'menu-item-activo');
  }

  private quitarEstiloActivo() {
    // Quitar el fondo
    this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', 'transparent');
    
    // Quitar el borde izquierdo
    this.renderer.setStyle(this.el.nativeElement, 'borderLeft', 'none');
    
    // Restaurar peso de fuente normal
    this.renderer.setStyle(this.el.nativeElement, 'fontWeight', '600');
    
    // Restaurar color original del texto
    this.renderer.removeStyle(this.el.nativeElement, 'color');
    
    // Restaurar padding original
    this.renderer.setStyle(this.el.nativeElement, 'paddingLeft', '12px');
    
    // Mantener transición
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'all 0.3s ease');
    
    // Quitar la clase
    this.renderer.removeClass(this.el.nativeElement, 'menu-item-activo');
  }

}

