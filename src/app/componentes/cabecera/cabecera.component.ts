import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../../clases/usuario';
import { AuthService } from '../../servicios/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cabecera',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cabecera.component.html',
  styleUrl: './cabecera.component.css'
})
export class CabeceraComponent {

  
  @Input() items: { label: string, link: string }[] = [];
  @Input() usuario : any | null = null;
  @Input() showButtons : boolean = false;
  @Output() loadingEvent = new EventEmitter<boolean>();
  @Output() userEvent = new EventEmitter<any|null>()

  constructor(private router : Router, private auth: AuthService) {
  }
  
  ngOnInit() { }
  loguot() {
    this.loadingEvent.emit(true);
    setTimeout(() => {
      this.auth
      .logout()
      .then((e) => {
        this.usuario = null;
        this.userEvent.emit(null);
        this.loadingEvent.emit(false);
        this.router.navigate(['/bienvenida']);
        localStorage.clear();
      })
      .catch((err) => {});
    }, 1000);
  }

}
