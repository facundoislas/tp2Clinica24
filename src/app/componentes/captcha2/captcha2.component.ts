import { Component, EventEmitter, Output } from '@angular/core';
import { CaptchaService } from '../../servicios/captcha.service';
import { Captcha } from '../../clases/captcha';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertServiceService } from './../../servicios/alert-service.service';


@Component({
  selector: 'app-captcha2',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './captcha2.component.html',
  styleUrls: [ './captcha2.component.css']
})
export class Captcha2Component {

  

  @Output() resultadoFinal: EventEmitter<any>= new EventEmitter<any>();

  resul: boolean = false;
  public resultado!: string;
  public captchas: any[] = [];
  captchaSeleccionado: Captcha;
  constructor(private captcha: CaptchaService, private alert: AlertServiceService){

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
        this.alert.showSuccessAlert1("", "El resultado es correcto", "success");
      }
    else
    {
      this.resul = false;
      this.alert.showSuccessAlert1("", "El resultado es incorrecto", "error");

    this.resultadoFinal.emit(false);
    }
  }



}
