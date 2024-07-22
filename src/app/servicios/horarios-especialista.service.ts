import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { HorariosEspecialista } from '../clases/horarios-especialista';

@Injectable({
  providedIn: 'root'
})
export class HorariosEspecialistaService {

  constructor(private firestore : Firestore) { }
  getHorarioEspecialistas(): Observable<HorariosEspecialista[]>{
    let col = collection(this.firestore, 'horarioEspecialistas');
    return collectionData(col, { idField: 'id'}) as Observable<HorariosEspecialista[]>;
  }
  cargarHorarioEspecialistas(horarioEsp:HorariosEspecialista){
    let col = collection(this.firestore, 'horarioEspecialistas');
    addDoc(col, Object.assign({}, horarioEsp));
  }
  updateHorarioEspecialistas(horarioEsp:HorariosEspecialista){
    let col = collection(this.firestore, 'horarioEspecialistas');
    const documento = doc(col, horarioEsp.id);
    updateDoc(documento, {
      lunInicio: horarioEsp.lunInicio,
      lunFin: horarioEsp.lunFin,
      marInicio: horarioEsp.marInicio,
      marFin: horarioEsp.marFin,
      mierInicio: horarioEsp.mierInicio,
      mierFin: horarioEsp.mierFin,
      jueInicio: horarioEsp.jueInicio,
      jueFin: horarioEsp.jueFin,
      vierInicio: horarioEsp.vierInicio,
      vierFin: horarioEsp.vierFin,
      sabInicio: horarioEsp.sabInicio,
      sabFin: horarioEsp.sabFin,
      estados: horarioEsp.estados,
      especialidadesPorDia: horarioEsp.especialidadesPorDia,
    });
  }
}
