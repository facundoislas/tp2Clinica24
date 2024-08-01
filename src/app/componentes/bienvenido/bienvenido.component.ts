import { Component } from '@angular/core';
import { CabeceraComponent } from "../cabecera/cabecera.component";
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LogoComponent } from "../logo/logo.component";


@Component({
  selector: 'app-bienvenido',
  standalone: true,
  imports: [CabeceraComponent, CommonModule, RouterLink, LogoComponent],
  templateUrl: './bienvenido.component.html',
  styleUrls: ['./bienvenido.component.css'],
  animations: [
  ]
})
export class BienvenidoComponent {

  public loading = true;
  user = null;

  ngOnInit(): void {
    setTimeout(()=>{
      this.loading = false;

  },2500);}
}
