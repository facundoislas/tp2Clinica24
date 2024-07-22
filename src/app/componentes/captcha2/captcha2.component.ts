import { Component, EventEmitter, Output } from '@angular/core';
import { CaptchaService } from '../../servicios/captcha.service';
import { Captcha } from '../../clases/captcha';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-captcha2',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './captcha2.component.html',
  styleUrl: './captcha2.component.css'
})
export class Captcha2Component {

  

  @Output() resultadoFinal: EventEmitter<any>= new EventEmitter<any>();

  resul: boolean = false;
  public resultado!: string;
  public captchas: any[] = [];
  captchaSeleccionado: Captcha;
  constructor(private captcha: CaptchaService){

    this.captchaSeleccionado = new Captcha();
  }




  traer()
  {

    this.captcha.getCaptcha().subscribe(capcha => {
      this.captchaSeleccionado = capcha[Math.floor(Math.random() * capcha.length)]
      console.log(this.captchaSeleccionado);
    })
    
  }

  ngOnInit()
  {
    this.traer();
  }

  validarCaptCha(resul: string){
    if(this.captchaSeleccionado.numero === resul)
      {
        this.resul = true;
        this.resultadoFinal.emit(true);
      alert("El resultado es ok");}
    else
    {
      this.resul = false;
    alert("El resultado no es ok");
    this.resultadoFinal.emit(false);
    }
  }



}
