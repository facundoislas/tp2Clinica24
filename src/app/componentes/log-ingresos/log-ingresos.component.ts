import { Component } from '@angular/core';
import { FirebaseService } from '../../servicios/firebase.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormatoFechaPipe } from "../../pipes/formato-fecha.pipe";
import { ExcelExportService } from '../../servicios/excel-export.service';



@Component({
  selector: 'app-log-ingresos',
  standalone: true,
  imports: [CommonModule, FormsModule, FormatoFechaPipe],
  templateUrl: './log-ingresos.component.html',
  styleUrls: [ './log-ingresos.component.css']
})
export class LogIngresosComponent {

  logs: any[] = [];

  constructor(private logService: FirebaseService, private excelExportService: ExcelExportService) {}

  ngOnInit(): void {
    this.logService.getLogData().subscribe(data => {
      this.logs = data;
    });
  }

  exportToExcel(): void {
    this.excelExportService.exportAsExcelFile(this.logs, 'login');
  }
  
}
