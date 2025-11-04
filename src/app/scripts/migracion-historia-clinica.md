# Script de Migración - Agregar turnoId a Historias Clínicas Existentes

## ⚠️ IMPORTANTE
Este script es **OPCIONAL** y solo es necesario si quieres relacionar las historias clínicas antiguas con turnos específicos.

## Opción 1: Dejar como está (Recomendado) ✅

El código ya está preparado para manejar ambos casos:
- **Historias nuevas**: Tienen `turnoId` y se relacionan con un turno específico
- **Historias antiguas**: No tienen `turnoId` pero siguen funcionando normalmente

### ¿Qué pasa con las historias antiguas?
- Se siguen mostrando correctamente en la página de historias clínicas
- Si se actualiza una historia antigua desde un turno, automáticamente se le asigna el `turnoId`
- No se pierden datos ni funcionalidad

## Opción 2: Migrar datos manualmente (Opcional)

Si deseas actualizar las historias antiguas para relacionarlas con turnos específicos:

### Paso 1: Desde la consola de Firebase

1. Ir a Firebase Console → Firestore Database
2. Ir a la colección `historiaClinica`
3. Para cada documento sin `turnoId`:
   - Agregar manualmente el campo `turnoId` con el valor del ID del turno correspondiente

### Paso 2: Script automático (si hay muchos registros)

Puedes ejecutar este código en la consola del navegador desde tu aplicación:

```javascript
// ADVERTENCIA: Ejecutar solo si entiendes lo que hace
// Este código asume que puedes identificar qué turno corresponde a cada historia

const db = firebase.firestore();

async function migrarHistoriasClinicas() {
  const historias = await db.collection('historiaClinica').get();
  const turnos = await db.collection('turnos').get();
  
  let migraciones = 0;
  
  for (const historiaDoc of historias.docs) {
    const historia = historiaDoc.data();
    
    // Si ya tiene turnoId, saltar
    if (historia.turnoId) continue;
    
    // Buscar turno que coincida
    const turnoCorrespondiente = turnos.docs.find(turnoDoc => {
      const turno = turnoDoc.data();
      return turno.paciente === historia.paciente &&
             turno.especialista === historia.especialista &&
             turno.especialidad === historia.especialidad &&
             turno.estado === 'finalizado';
    });
    
    if (turnoCorrespondiente) {
      await db.collection('historiaClinica').doc(historiaDoc.id).update({
        turnoId: turnoCorrespondiente.id
      });
      migraciones++;
      console.log(`Historia ${historiaDoc.id} migrada con turnoId: ${turnoCorrespondiente.id}`);
    } else {
      console.log(`No se encontró turno para historia ${historiaDoc.id}`);
    }
  }
  
  console.log(`Migración completada: ${migraciones} historias actualizadas`);
}

// Ejecutar migración
// migrarHistoriasClinicas();
```

## Opción 3: No hacer nada

Las historias clínicas antiguas seguirán funcionando perfectamente. 
Solo las nuevas historias (creadas después de esta actualización) tendrán `turnoId`.

## Recomendación

**Opción 1** es la más recomendada: dejar que el sistema maneje automáticamente los registros antiguos y nuevos.

El sistema está diseñado con **backward compatibility**, lo que significa que:
- ✅ Las historias antiguas se siguen mostrando
- ✅ Las historias nuevas tienen mejor trazabilidad con `turnoId`
- ✅ Si se actualiza una historia antigua, automáticamente obtiene el `turnoId`
- ✅ No se requiere ninguna acción adicional

