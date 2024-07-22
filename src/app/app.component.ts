import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CabeceraComponent } from "./componentes/cabecera/cabecera.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, CabeceraComponent]
})
export class AppComponent {
  title = 'tpclinica24';
}
