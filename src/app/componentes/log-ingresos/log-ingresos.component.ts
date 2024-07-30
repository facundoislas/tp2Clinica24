import { Component } from '@angular/core';
import { FirebaseService } from '../../servicios/firebase.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormatoFechaPipe } from "../../pipes/formato-fecha.pipe";

@Component({
  selector: 'app-log-ingresos',
  standalone: true,
  imports: [CommonModule, FormsModule, FormatoFechaPipe],
  templateUrl: './log-ingresos.component.html',
  styleUrls: [ './log-ingresos.component.css']
})
export class LogIngresosComponent {

  logs: any[] = [];

  constructor(private logService: FirebaseService) {}

  ngOnInit(): void {
    this.logService.getLogData().subscribe(data => {
      this.logs = data;
    });
  }


  

}
