import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, getFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CaptchaService {

  private usuariosRef;

  constructor(private firestore: Firestore) {

    this.firestore = getFirestore();
    this.usuariosRef = collection(this.firestore,"captcha");
  }
  getCaptcha():Observable<any[]>{
    const col = collection(this.firestore, "captcha");
    return collectionData(col, {idField: 'id'}) as Observable<any[]>
   }
}
