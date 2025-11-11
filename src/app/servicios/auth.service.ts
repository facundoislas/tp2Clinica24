import { Injectable } from '@angular/core';
import {Auth,signInWithEmailAndPassword,createUserWithEmailAndPassword,signOut} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { sendEmailVerification } from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';
import { AlertServiceService } from './alert-service.service';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  constructor(private auth:Auth, private router: Router, private alert: AlertServiceService) {

    // Verificar autenticación desde sessionStorage
    const user = sessionStorage.getItem('user');
    const muestra = sessionStorage.getItem('muestra');
    this.isAuthenticatedSubject.next(!!(user && muestra === 'true'));
   }

  user: any = "";
  
  async login(email:any, password: any ) {
		try {
			const user = await signInWithEmailAndPassword(this.auth, email, password);
      this.user = user;
      if(user.user.emailVerified)
        {
          // NO navegamos aquí, lo hace el componente login
          // Actualizamos el estado de autenticación inmediatamente
          this.isAuthenticatedSubject.next(true);
          return user;
        }
        else{
          this.alert.showSuccessAlert1("","Usuario no validado. Por favor valida tu correo para poder ingresar", "error")
          this.router.navigate(['/login']);
          return { emailNoVerificado: true };
        }
			
		} catch (e) {
			return null;
		}
	}

	async logout() {
    this.isAuthenticatedSubject.next(false);

		return signOut(this.auth);
	}

  async register(email: any, password: any)
  {
    try{
      const user = await createUserWithEmailAndPassword(this.auth, email, password);
      sendEmailVerification(user.user).then(() => {
        this.alert.showSuccessAlert1("","Registracion con Exito, por favor valida tu usuario", "success")
        this.router.navigate(['/login']);
      this.user = user;
      
    })
    return user;
    }
    catch(e)
    {
      return null;
    }
  }

  isAuth(): boolean
  {
    // Verificar si hay usuario en sessionStorage y si está marcado como autenticado
    const user = sessionStorage.getItem('user');
    const muestra = sessionStorage.getItem('muestra');
    
    return !!(user && muestra === 'true');
  }

  isAdmin(): boolean
  {
    // Primero verificar que esté autenticado
    if (!this.isAuth()) {
      return false;
    }
    
    const tipo = sessionStorage.getItem('tipo');
    return tipo === 'admin';
  }

  isEspecialista(): boolean
  {
    if (!this.isAuth()) {
      return false;
    }
    
    const tipo = sessionStorage.getItem('tipo');
    return tipo === 'especialista';
  }

  isPaciente(): boolean
  {
    if (!this.isAuth()) {
      return false;
    }
    
    const tipo = sessionStorage.getItem('tipo');
    return tipo === 'paciente';
  }

  getUserType(): string | null
  {
    if (!this.isAuth()) {
      return null;
    }
    
    return sessionStorage.getItem('tipo');
  }

  
}
