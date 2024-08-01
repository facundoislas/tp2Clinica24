import { Injectable } from '@angular/core';
import { map, Observable, Subject, switchMap } from 'rxjs';
import { HistoriaClinica } from '../clases/historia-clinica';
import { addDoc, collection, collectionData, doc, Firestore, query, updateDoc, where } from '@angular/fire/firestore';
import { Turno } from '../clases/turno';
import { Especialista } from '../clases/especialista';

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

    getTurnosPorEspecialidad(): Observable<{ especialidad: string, count: number }[]> {
      return new Observable(observer => {
        this.getTurnosDB().subscribe(turnos => {
          const especialidades = turnos.reduce((acc, turno) => {
            acc[turno.especialidad] = (acc[turno.especialidad] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
  
          const result = Object.keys(especialidades).map(key => ({
            especialidad: key,
            count: especialidades[key]
          }));
  
          observer.next(result);
          observer.complete();
        });
      });
    }

    getEspecialistas(): Observable<Especialista[]> {
      const col = collection(this.firestore, 'Usuarios');
      const q = query(col, where('tipo', '==', 'especialista'));
  
      return collectionData(q, { idField: 'id' }) as Observable<Especialista[]>;
    }

    getTurnosDB2(startDate?: Date, endDate?: Date): Observable<Turno[]> {
      let col = collection(this.firestore, 'turnos');
      let q = query(col);
  
      if (startDate && endDate) {
        q = query(col, where('fecha', '>=', startDate), where('fecha', '<=', endDate));
      }
  
      return collectionData(q, { idField: 'id' }) as Observable<Turno[]>;
    }
  
  
    getTurnosPorEspecialista(startDate?: Date, endDate?: Date): Observable<any[]> {
      return this.getTurnosDB2(startDate, endDate).pipe(
        switchMap(turnos => {
          return this.getEspecialistas().pipe(
            map(especialistas => {
              const especialistasMap = new Map(
                especialistas.map(e => [e.email, `${e.nombre} ${e.apellido}`])
              );
  
              const turnosPorEspecialista = turnos.reduce((acc, turno) => {
                const nombreCompletoEspecialista = especialistasMap.get(turno.especialista);
                if (nombreCompletoEspecialista) {
                  acc[nombreCompletoEspecialista] = (acc[nombreCompletoEspecialista] || 0) + 1;
                }
                return acc;
              }, {} as Record<string, number>);
  
              return Object.entries(turnosPorEspecialista).map(([nombre, count]) => ({ name: nombre, value: count }));
            })
          );
        })
      );
    }

    getTurnosFinalizados(): Observable<Turno[]> {
      let col = collection(this.firestore, 'turnos');
      let q = query(col);

        q = query(col, where('estado', '==', 'finalizado'));
      
  
      return collectionData(q, { idField: 'id' }) as Observable<Turno[]>;
    }

    getTurnosPorEspecialistaFinalizados(startDate?: Date, endDate?: Date): Observable<any[]> {
      return this.getTurnosFinalizados().pipe(
        switchMap(turnos => {
          return this.getEspecialistas().pipe(
            map(especialistas => {
              const especialistasMap = new Map(
                especialistas.map(e => [e.email, `${e.nombre} ${e.apellido}`])
              );
  
              const turnosPorEspecialista = turnos.reduce((acc, turno) => {
                const nombreCompletoEspecialista = especialistasMap.get(turno.especialista);
                if (nombreCompletoEspecialista) {
                  acc[nombreCompletoEspecialista] = (acc[nombreCompletoEspecialista] || 0) + 1;
                }
                return acc;
              }, {} as Record<string, number>);
  
              return Object.entries(turnosPorEspecialista).map(([nombre, count]) => ({ name: nombre, value: count }));
            })
          );
        })
      );
    }
  
}
