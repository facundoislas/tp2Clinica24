import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';
import { AlertServiceService } from '../servicios/alert-service.service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const alert = inject(AlertServiceService);
  const router = inject(Router);
  
  // Primero verificar si está autenticado
  if (!auth.isAuth()) {
    alert.showSuccessAlert1(
      "Debes iniciar sesión para acceder a esta página", 
      "Acceso Denegado", 
      "warning"
    );
    router.navigateByUrl('/login');
    return false;
  }
  
  // Luego verificar si es administrador
  if (auth.isAdmin()) {
    return true;
  } else {
    const userType = auth.getUserType();
    alert.showSuccessAlert1(
      `No tienes permisos para acceder a esta página.`, 
      "Acceso Denegado", 
      "error"
    );
    
    // Redirigir según el tipo de usuario
    if (auth.isPaciente() || auth.isEspecialista()) {
      router.navigateByUrl('/perfil');
    } else {
      router.navigateByUrl('/bienvenido');
    }
    
    return false;
  }
};

/*
export const isLoginGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const alert =inject(AlertServiceService);

  const router = inject(Router);
  if(auth.isAuth()){
    return true;}
  else
    {
      alert.showSuccessAlert1("Debes loguearte para ingresar", "no ok", "error")

      router.navigateByUrl('/login');
    return false;
  }
};*/
