import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';
import { AlertServiceService } from '../servicios/alert-service.service';
import { inject } from '@angular/core';

export const isLoginGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const alert = inject(AlertServiceService);
  const router = inject(Router);
  
  if (auth.isAuth()) {
    return true;
  } else {
    // Mostrar alerta con los parámetros en el orden correcto: mensaje, título, icono
    alert.showSuccessAlert1(
      "Debes iniciar sesión para acceder a esta página", 
      "Acceso Restringido", 
      "warning"
    );
    
    // Guardar la URL a la que intentaba acceder para redirigir después del login
    sessionStorage.setItem('redirectUrl', state.url);
    
    router.navigateByUrl('/login');
    return false;
  }
};
