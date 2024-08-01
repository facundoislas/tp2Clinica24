import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';
import { AlertServiceService } from '../servicios/alert-service.service';

import { inject } from '@angular/core';

export const isLoginGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const alert =inject(AlertServiceService);

  const router = inject(Router);
  if(auth.isAuth()){
    return true;}
  else
    {
      alert.showSuccessAlert1("Debes loguearte para ingresar", "", "error")

      router.navigateByUrl('/login');
    return false;
  }
};
