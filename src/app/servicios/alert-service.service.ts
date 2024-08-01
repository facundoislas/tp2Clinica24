import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class AlertServiceService {

  constructor() { }

  showSuccessAlert1(mensaje:string, titulo:string, state:SweetAlertIcon) {
    Swal.fire(titulo, mensaje, state);
  }

  
}
