import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Directive({
  selector: '[appResaltarItemActivo]',
  standalone: true
})
export class ResaltarItemActivoDirective implements OnInit {

  @Input() rutaLink: string = ''; 
  @Input() colorActivo: string = '#20c997'; 
  @Input() colorFondo: string = 'rgba(32, 201, 151, 0.1)'; 

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private router: Router
  ) {}

  ngOnInit() {
    this.verificarRutaActiva(this.router.url);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.verificarRutaActiva(event.url);
      });
  }

  private verificarRutaActiva(urlActual: string) {
    const urlLimpia = urlActual.split('?')[0];
    const rutaLimpia = this.rutaLink.split('?')[0];

    const esActivo = urlLimpia === rutaLimpia;

    if (esActivo) {
      this.aplicarEstiloActivo();
    } else {
      this.quitarEstiloActivo();
    }
  }

  private aplicarEstiloActivo() {
    this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', this.colorFondo);
    
    this.renderer.setStyle(this.el.nativeElement, 'fontWeight', '700');
    
    this.renderer.setStyle(this.el.nativeElement, 'color', this.colorActivo);
    
    this.renderer.setStyle(this.el.nativeElement, 'paddingLeft', '16px');
    
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'all 0.3s ease');
    
    this.renderer.addClass(this.el.nativeElement, 'menu-item-activo');
  }

  private quitarEstiloActivo() {
    this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', 'transparent');
    
    this.renderer.setStyle(this.el.nativeElement, 'borderLeft', 'none');
    
    this.renderer.setStyle(this.el.nativeElement, 'fontWeight', '600');
    
    this.renderer.removeStyle(this.el.nativeElement, 'color');
    
    this.renderer.setStyle(this.el.nativeElement, 'paddingLeft', '12px');
    
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'all 0.3s ease');
    
    this.renderer.removeClass(this.el.nativeElement, 'menu-item-activo');
  }

}

