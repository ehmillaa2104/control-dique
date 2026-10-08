# Control de Dique

Dashboard para controlar un proyecto de mantenimiento en dique seco de un buque. Muestra avance, plazo, costos, riesgos y participación del equipo, con vistas por área: Ingeniería, Cubierta y Técnico.

> Todos los datos del repositorio son **de ejemplo** (buque M/V Austral Trader ficticio).

## Ver en línea (GitHub Pages)

Se actualiza solo cada vez que se sube una versión a `main`:

- Dashboard Rev. 1: https://ehmillaa2104.github.io/control-dique/
- Rev. 0: https://ehmillaa2104.github.io/control-dique/rev0/
- Cronograma 3D: https://ehmillaa2104.github.io/control-dique/pruebas/viaje-3d/

## Contenido

| Carpeta / archivo | Qué es |
|---|---|
| `index.html` | **Rev. 1 · vista ejecutiva**: atraso, avance, costo plan, incurrido, desembolsado y participación del equipo |
| `rev0/` | **Rev. 0 · vista completa** (base congelada): valor ganado, todas las órdenes de trabajo, riesgos, adicionales y acciones |
| `pruebas/viaje-3d/` | Prueba 3D: el viaje del buque de Panamá al dique en Cartagena y de vuelta, con la información del proyecto |
| `pruebas/barco-3d/` | Primera prueba 3D: el barco avanza por una ruta según el avance |
| `data.js`, `datos-ejemplo.json` | Datos de ejemplo. Todas las vistas leen los mismos datos |
| `DATOS-REQUERIDOS.md` | Datos que necesita el dashboard, fórmulas y cómo conectarlo con otra herramienta |

## Cómo abrirlo

Hace falta un servidor local, porque el navegador bloquea parte del contenido si se abre el archivo con doble clic. En la carpeta del proyecto:

```bash
python -m http.server 8791
```

Después se abre en el navegador:

- Rev. 1: http://localhost:8791/
- Rev. 0: http://localhost:8791/rev0/
- Prueba 3D: http://localhost:8791/pruebas/viaje-3d/

Las pruebas 3D necesitan conexión a internet para cargar la librería Three.js.

## Versiones

Cada vez que Claude termina un trabajo en este proyecto, los cambios se guardan como una versión (commit) y se suben a este repositorio. El historial completo está en la pestaña **Commits** de GitHub, y desde ahí se puede volver a cualquier versión anterior.

## Datos reales

Para usar datos reales se reemplaza `data.js` con el mismo formato, o se abre `index.html?datos=URL_DEL_JSON`. El detalle está en [DATOS-REQUERIDOS.md](DATOS-REQUERIDOS.md).
