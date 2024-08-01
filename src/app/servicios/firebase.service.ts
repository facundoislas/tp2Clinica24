import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, doc, Firestore, getDocs, getFirestore, query, updateDoc, where } from '@angular/fire/firestore';
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

   async getUsuarioEmail(mail: string | null)
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

  getUsuariosPorTipo(tipo: string): Observable<any[]>{
    const col = collection(this.firestore, "Usuarios");

    const q = query(col, where('tipo', '==', tipo));

    return new Observable(observer => {
      getDocs(q).then(snapshot => {
        const usuarios = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        observer.next(usuarios);
        observer.complete();
      }).catch(error => {
        observer.error(error);
      });
    });}


    async guardarLogLogin(email:string) {
      const col = collection(this.firestore, 'login');
      await addDoc(col, { email: email, fecha: new Date() });
    }

    getLogData(): Observable<any[]> {
      const col = collection(this.firestore, 'login');
      return collectionData(col, { idField: 'id' });
    }


    
}
