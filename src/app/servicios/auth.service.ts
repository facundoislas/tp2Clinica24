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

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  constructor(private auth:Auth, private router: Router, private alert: AlertServiceService) {

    const userEmail = sessionStorage.getItem('userEmail');
    this.isAuthenticatedSubject.next(!!userEmail);
   }

  user: any = "";
  
  async login(email:any, password: any ) {
		try {
			const user = await signInWithEmailAndPassword(this.auth, email, password);
      this.user = user;
      if(user.user.emailVerified)
        {
          setTimeout(()=>{
           
          },2500);
          this.router.navigate(['/perfil']);
          this.isAuthenticatedSubject.next(true);

          return user;
        }
        else{
          this.alert.showSuccessAlert1("","El email no se encuentra validado", "error")
          this.router.navigate(['/login']);
          return null;
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
        alert('Registration successful! Please check your email for verification.');
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

  isAuth()
  {
    return this.user;
  }

  
}
