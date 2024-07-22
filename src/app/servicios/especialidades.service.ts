import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, Firestore, getFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class EspecialidadesService {

  constructor(private firestore: Firestore) {

    this.firestore = getFirestore();
   
  }

  getEspecialidades():Observable<any[]>{
    const col = collection(this.firestore, "especialidades");
    return collectionData(col) as Observable<any[]>
   }

   setEspecialidad(especialidad:string){
    const col = collection(this.firestore,"especialidades");
    if(especialidad && especialidad != ''){
      addDoc(col, {
        especialidad: especialidad
      }).catch( (error) => { throw error } );
    }
  }
}
