import { Injectable } from '@angular/core';
import {Auth,signInWithEmailAndPassword,createUserWithEmailAndPassword,signOut} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { sendEmailVerification } from 'firebase/auth';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth:Auth, private router: Router) { }

  user: any = "";
  
  async login(email:any, password: any ) {
		try {
			const user = await signInWithEmailAndPassword(this.auth, email, password);
      this.user = user;
      if(user.user.emailVerified)
        {
          alert("Login Exitoso");
          this.router.navigate(['/perfil']);
          return user;
        }
        else{
          alert("email no chequeado");
          this.router.navigate(['/login']);
          return null;
        }
			
		} catch (e) {
			return null;
		}
	}

	async logout() {
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
