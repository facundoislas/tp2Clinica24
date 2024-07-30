import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HistoriaClinica } from '../clases/historia-clinica';
import { addDoc, collection, collectionData, doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { Turno } from '../clases/turno';

@Injectable({
  providedIn: 'root'
})
export class TurnosService {
  historias$ : Subject<HistoriaClinica[]>;
  historias!:HistoriaClinica[];
  
  constructor(private firestore: Firestore) {
    this.historias$ = new Subject();

    this.getHistoriaDB().subscribe(historia => {
      this.historias = historia;
      this.historias$.next(historia);
    });
 }
  getTurnosDB(): Observable<Turno[]>{
    let col = collection(this.firestore, 'turnos');
    return collectionData(col, { idField: 'id'}) as Observable<Turno[]>;
  }
  cargarTurnosBD(turno:Turno){
    let col = collection(this.firestore, 'turnos');
    addDoc(col, Object.assign({}, turno));
  }
  updateTurnos(turno:Turno){
    let col = collection(this.firestore, 'turnos');
    const documento = doc(col, turno.id);
    updateDoc(documento, {
      estado: turno.estado,
      comentario: turno.comentario,
      calificacion: turno.calificacion,
      encuesta: turno.encuesta,
      fecha: turno.fecha,
      resenia: turno.resenia,
    });
  }

    // HISTORIA CLINICA
    getHistoriaDB(): Observable<HistoriaClinica[]>{
      let col = collection(this.firestore, 'historiaClinica');
      return collectionData(col, { idField: 'id'}) as Observable<HistoriaClinica[]>;
    }
    cargarHistoriasBD(historia:HistoriaClinica){
      let col = collection(this.firestore, 'historiaClinica');
      addDoc(col, Object.assign({}, historia));
    }
    updateHistoria(historia:HistoriaClinica){
      let col = collection(this.firestore, 'historiaClinica');
      const documento = doc(col, historia.id);
      updateDoc(documento, {
        especialista:historia.especialista,
        dinamicos:historia.dinamicos,
        altura:historia.altura,
        peso:historia.peso,
        temperatura:historia.temperatura,
        presion:historia.presion,
        especialidad:historia.especialidad
      });
    }
}
