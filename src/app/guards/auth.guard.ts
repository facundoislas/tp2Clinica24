import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';
import { AlertServiceService } from '../servicios/alert-service.service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const alert =inject(AlertServiceService);
  const router = inject(Router);
  if(auth.isAdmin()){
    return true;}
  else
    {
      alert.showSuccessAlert1("No eres un admin", "no ok", "error")
      router.navigateByUrl('/login');
    return false;
  }
};


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
};
