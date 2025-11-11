import { Pipe, PipeTransform } from '@angular/core';
import { Turno } from '../clases/turno';
import { Especialista } from '../clases/especialista';
import { Paciente } from '../clases/paciente';
import { HistoriaClinica } from '../clases/historia-clinica';

@Pipe({
  name: 'filtros',
  standalone: true,
  pure: false 
})
export class FiltrosPipe implements PipeTransform {

  transform(
    turnos: Turno[], 
    filtro: string, 
    especialistas: Especialista[] = [], 
    pacientes: Paciente[] = [], 
    historias: HistoriaClinica[] = []
  ): Turno[] {
    if (!turnos || !filtro || filtro.trim() === '') {
      return turnos;
    }

    filtro = filtro.toLowerCase().trim();

    return turnos.filter(turno => {
      
      if (
        turno.especialidad?.toLowerCase().includes(filtro) ||
        turno.estado?.toLowerCase().includes(filtro) ||
        turno.comentario?.toLowerCase().includes(filtro) ||
        turno.hora?.toString().toLowerCase().includes(filtro) ||
        turno.mes?.toString().toLowerCase().includes(filtro) ||
        turno.dia?.toLowerCase().includes(filtro) ||
        turno.anio?.toLowerCase().includes(filtro) ||
        turno.calificacion?.toLowerCase().includes(filtro)
      ) {
        return true;
      }

      const especialista = especialistas.find(esp => esp.email === turno.especialista);
      if (especialista) {
        const nombreCompleto = `${especialista.nombre} ${especialista.apellido}`.toLowerCase();
        if (nombreCompleto.includes(filtro) || 
            especialista.nombre?.toLowerCase().includes(filtro) ||
            especialista.apellido?.toLowerCase().includes(filtro)) {
          return true;
        }
      }

      const paciente = pacientes.find(pac => pac.email === turno.paciente);
      if (paciente) {
        const nombreCompleto = `${paciente.nombre} ${paciente.apellido}`.toLowerCase();
        if (nombreCompleto.includes(filtro) || 
            paciente.nombre?.toLowerCase().includes(filtro) ||
            paciente.apellido?.toLowerCase().includes(filtro)) {
          return true;
        }
      }

      if (turno.estado === 'finalizado' && turno.id) {
        const historia = historias.find(h => h.turnoId === turno.id);
        
        if (historia) {
          if (
            historia.altura?.toLowerCase().includes(filtro) ||
            historia.peso?.toString().toLowerCase().includes(filtro) ||
            historia.temperatura?.toString().toLowerCase().includes(filtro) ||
            historia.presion?.toString().toLowerCase().includes(filtro)
          ) {
            return true;
          }

          if (historia.dinamicos && historia.dinamicos.length > 0) {
            const coincideDinamico = historia.dinamicos.some(dinamico => 
              dinamico.clave?.toLowerCase().includes(filtro) ||
              dinamico.valor?.toLowerCase().includes(filtro)
            );
            if (coincideDinamico) {
              return true;
            }
          }
        }
      }

      return false;
    });
  }

}
