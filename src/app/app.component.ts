import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CabeceraComponent } from "./componentes/cabecera/cabecera.component";
import { FooterComponent } from "./componentes/footer/footer.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, CabeceraComponent, FooterComponent]
})
export class AppComponent {
  title = 'tpclinica24';
}
