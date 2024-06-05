import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Usuario } from '../clases/usuario';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { getFirestore, updateDoc } from 'firebase/firestore';


@Injectable({
  providedIn: 'root'
})
export class UsuariosServiceService {
  
  private usuariosRef;
  constructor(private firestore: Firestore) {

    this.firestore = getFirestore();
    this.usuariosRef = collection(this.firestore,"Usuarios");
  }

  getUsuarios():Observable<any[]>{
    const col = collection(this.firestore, "Usuarios");
    return collectionData(col, {idField: 'id'}) as Observable<any[]>
   }

   updateUsuario(id: string, aprobado: boolean):Promise<any>
   {
    const usuarioDoc = doc(this.firestore,"Usuarios",id)
    return updateDoc(usuarioDoc, {aprobado});
   }
}
