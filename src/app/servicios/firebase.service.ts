import { Injectable } from '@angular/core';
import { collection, collectionData, doc, Firestore, getDocs, getFirestore, query, updateDoc, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

updateUsuario(id: string, aprobado: boolean):Promise<any>
   {
    const usuarioDoc = doc(this.firestore,"Usuarios",id)
    return updateDoc(usuarioDoc, {aprobado});
   }

  constructor(private firestore: Firestore) { 

    this.firestore = getFirestore();

  }

  getUsuarios():Observable<any[]>{
    const col = collection(this.firestore, "Usuarios");
    return collectionData(col, {idField: 'id'}) as Observable<any[]>
   }

   async getUsuarioEmail(mail: string)
   {
    try {
      const usersRef = collection(this.firestore, 'Usuarios');
      const q = query(usersRef, where('email', '==', mail));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
      
        return userDoc.data();
      } else {
        console.log('No user found with the provided email.');
        return null;
      }
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  }

  
}
