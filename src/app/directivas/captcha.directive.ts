import { Directive, EventEmitter, Output, ElementRef, Renderer2, OnInit } from '@angular/core';
import { CaptchaService } from './../servicios/captcha.service'; // Ajusta la ruta según tu proyecto
import { Captcha } from './../clases/captcha'; // Ajusta la ruta según tu proyecto

@Directive({
  selector: '[appCaptcha]',
  standalone: true
})
export class CaptchaDirective implements OnInit {
  @Output() resultadoFinal: EventEmitter<boolean> = new EventEmitter<boolean>();
  captchaSeleccionado: Captcha = new Captcha();
  inputElement: HTMLInputElement;
  imgElement: HTMLImageElement;
  buttonElement: HTMLButtonElement;

  constructor(private el: ElementRef, private renderer: Renderer2, private captchaService: CaptchaService) {
    this.inputElement = this.renderer.createElement('input');
    this.imgElement = this.renderer.createElement('img');
    this.buttonElement = this.renderer.createElement('button');
  }

  ngOnInit(): void {
    this.setupCaptcha();
    this.renderer.appendChild(this.el.nativeElement, this.imgElement);
    this.renderer.appendChild(this.el.nativeElement, this.inputElement);
    this.renderer.appendChild(this.el.nativeElement, this.buttonElement);

    this.renderer.setAttribute(this.inputElement, 'type', 'text');
    this.renderer.setAttribute(this.inputElement, 'class', 'form-control');
    this.renderer.setAttribute(this.imgElement, 'width', '100px');
    this.renderer.setAttribute(this.imgElement, 'height', '50px');
    this.renderer.addClass(this.buttonElement, 'btn-primary');
    this.renderer.listen(this.buttonElement, 'click', () => this.validarCaptcha(this.inputElement.value));

    this.buttonElement.innerText = 'Validar';
  }

  setupCaptcha(): void {
    this.captchaService.getCaptcha().subscribe(captchas => {
      this.captchaSeleccionado = captchas[Math.floor(Math.random() * captchas.length)];
      this.renderer.setAttribute(this.imgElement, 'src', this.captchaSeleccionado.imagen);
    });
  }

  validarCaptcha(resul: string): void {
    if (this.captchaSeleccionado.numero === resul) {
      this.resultadoFinal.emit(true);
      alert('El resultado es ok');
    } else {
      this.resultadoFinal.emit(false);
      alert('El resultado no es ok');
      this.setupCaptcha();
      this.inputElement.value = '';
    }
  }
}