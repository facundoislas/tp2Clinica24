# 📊 Módulo de Estadísticas

## 🎯 Descripción
Este módulo agrupa toda la funcionalidad relacionada con estadísticas de la clínica, implementando **Lazy Loading** para optimizar el rendimiento de la aplicación.

## 🏗️ Arquitectura

### Componentes Incluidos

| Componente | Descripción | Ruta |
|------------|-------------|------|
| `EstadisticasComponent` | Componente principal que orquesta las estadísticas | `/estadisticas` |
| `LogIngresosComponent` | Muestra el log de ingresos de usuarios | Hijo de EstadisticasComponent |
| `TurnosEspecialidadComponent` | Gráfico de turnos por especialidad | Hijo de EstadisticasComponent |
| `TurnosPorMedicoComponent` | Gráfico de turnos por médico | Hijo de EstadisticasComponent |
| `TurnosPorMedicoFinalizadosComponent` | Gráfico de turnos finalizados por médico | Hijo de EstadisticasComponent |

### Módulos Importados

- `CommonModule` - Directivas básicas de Angular
- `FormsModule` - Para formularios y ngModel
- `NgxChartsModule` - Librería de gráficos
- `CabeceraComponent` (standalone) - Componente de cabecera
- `FormatoFechaPipe` (standalone) - Pipe para formatear fechas

## ⚡ Lazy Loading

El módulo se carga de forma diferida (lazy loading) mediante:

```typescript
{
  path: 'estadisticas',
  loadChildren: () => import('./modulos/estadisticas/estadisticas.module')
    .then(m => m.EstadisticasModule),
  canActivate: [authGuard]
}
```

### Beneficios del Lazy Loading

1. **Reducción del bundle inicial**: El código de estadísticas no se carga hasta que se accede
2. **Mejora del tiempo de carga**: La aplicación inicia más rápido
3. **Optimización de recursos**: Solo se descarga cuando el usuario lo necesita
4. **Mejor experiencia de usuario**: Tiempos de respuesta más rápidos en la carga inicial

## 🔒 Seguridad

El módulo está protegido con `authGuard`, lo que significa que solo usuarios autenticados con rol de **administrador** pueden acceder.

## 📦 Estructura de Archivos

```
src/app/modulos/estadisticas/
├── estadisticas.module.ts          # Módulo principal
├── estadisticas-routing.module.ts  # Configuración de rutas
└── README.md                       # Este archivo
```

## 🚀 Uso

### Navegación
Para acceder al módulo desde el código:

```typescript
this.router.navigate(['/estadisticas']);
```

### Desde el template
```html
<a routerLink="/estadisticas">Estadísticas</a>
```

## 🔄 Migración

Este módulo fue migrado de **Standalone Components** a **NgModule** para:
- Demostrar el uso de módulos tradicionales en Angular
- Implementar lazy loading de forma eficiente
- Agrupar componentes relacionados

### Componentes Convertidos

Los siguientes componentes fueron convertidos de `standalone: true` a componentes declarables:

- ✅ EstadisticasComponent
- ✅ LogIngresosComponent
- ✅ TurnosEspecialidadComponent
- ✅ TurnosPorMedicoComponent
- ✅ TurnosPorMedicoFinalizadosComponent

## 📊 Gráficos

El módulo utiliza **NGX-Charts** (@swimlane/ngx-charts) para la visualización de datos:

- Gráficos de pie/torta
- Gráficos de barras
- Colores personalizados
- Animaciones fluidas

## 🛠️ Mantenimiento

Para agregar nuevos componentes al módulo:

1. Crear el componente sin `standalone: true`
2. Agregarlo a `declarations` en `estadisticas.module.ts`
3. Si tiene una ruta propia, agregarla en `estadisticas-routing.module.ts`

---

**Fecha de creación**: Noviembre 2025  
**Versión**: 1.0.0  
**Desarrollado para**: Clínica Buena Salud

