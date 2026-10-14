# Guía para trabajar el dashboard de dique (Kelly Trader)

Este proyecto es el dashboard de control del dique seco del M/V Kelly Trader. Lee los datos de Monday y se publica solo en internet. Se trabaja con **Claude Code**: se le pide en español lo que se necesita y Claude lo hace, lo verifica y lo guarda en GitHub.

## 1. Qué es cada cosa

| Qué | Dónde |
|---|---|
| Dashboard publicado | https://ehmillaa2104.github.io/control-dique/ |
| Verificación de los datos | https://ehmillaa2104.github.io/control-dique/verificar.html |
| Código y versiones | https://github.com/ehmillaa2104/control-dique |
| Datos | Monday · espacio **GESTIÓN DE DIQUES** · carpeta **KELLY TRADER** |
| Reglas de trabajo para Claude | [CLAUDE.md](CLAUDE.md), que Claude lee solo al abrir el proyecto |
| Qué columna de Monday alimenta cada dato | [MAPEO-MONDAY.md](MAPEO-MONDAY.md) |

## 2. Preparar el equipo (una sola vez)

1. **Accesos** (los da Esteban Millaa, dueño del proyecto):
   - En **GitHub**, invitación como colaborador del repositorio. Llega un correo de GitHub, hay que **aceptarla**.
   - En **Monday**, ser miembro del espacio **GESTIÓN DE DIQUES**, porque es cerrado. Yelko Gomez ya está agregado.
2. **Instalar:**
   - [Git](https://git-scm.com/downloads), con las opciones por defecto.
   - [Python 3](https://www.python.org/downloads/), marcando "Add Python to PATH".
   - [Claude](https://claude.com/download), la app de escritorio con la pestaña Code, o Claude Code en la terminal.
3. **Conectar Monday en Claude:** en Claude, ir a **Configuración → Conectores**, agregar **monday.com** e iniciar sesión con tu cuenta de la empresa.
4. **Bajar el proyecto:** abrir Claude Code en una carpeta de trabajo y pedirle:
   > Clona https://github.com/ehmillaa2104/control-dique y ábrelo.

   La primera vez que suba algo a GitHub, Git va a pedir que inicies sesión en GitHub en el navegador.

## 3. El trabajo de todos los días

Abrir el proyecto en Claude Code y pedirle lo que se necesite. Por ejemplo:

- **"Actualiza los datos de Monday y revisa el dashboard."** Claude:
  1. lee los 7 tableros;
  2. convierte los datos;
  3. comprueba que la verificación dé 0 errores;
  4. revisa el dashboard;
  5. te dice qué cambió en Monday y qué datos faltan.
- **"Muéstrame el dashboard."** Lo abre en el navegador.
- **"Agrega … / cambia … en el resumen gerencial."** Hace el cambio, lo prueba y lo publica.
- **"Haz una revisión nueva con …"** Congela la actual en `revN/` y arma la nueva.

Al terminar cada pedido, Claude guarda la versión en GitHub y la página publicada se actualiza sola en 1 o 2 minutos. El historial completo queda en GitHub (**Commits**) y se puede volver a cualquier versión.

## 4. Cosas a saber

- **Los datos no se actualizan solos.** Se actualizan cada vez que se le pide a Claude que lea Monday. La fecha de la última lectura aparece arriba en el dashboard ("datos de Monday leídos el …").
- **Avance físico** = Σ (Estado % × Duración) / Σ Duración de P1, P2 y P3. Si los trabajos no tienen la **Duración** cargada en Monday, no cuentan.
- **Costos:** salen del tablero CC. Centros de Costo, que suma lo aprobado en P1, P2 y P3.
- **Dos personas trabajan el mismo proyecto.** Antes de subir, el guardado automático trae lo que haya subido el otro. Si los dos cambian el mismo archivo a la vez, Claude avisa y lo resuelve cuando se le pide.
- **El repositorio es público.** Cualquiera con el enlace ve montos y nombres de trabajos. Por eso no se guardan nombres de personas, descripciones ni archivos. Si se prefiere privado, GitHub Pages necesita una cuenta paga, o se puede publicar en otro servicio.
- **Si algo se ve viejo** en el navegador, recargar con **Ctrl + F5**.

## 5. Pendiente en Monday al 14 oct 2026

- **Presupuesto preliminar:** US$ 1,09 M, revisado por Gerencia. Dirección solicitó cambios y no hay nada aprobado. Eso se muestra con la nota de `notas.js`; cuando Dirección marque los centros de costo como "Revisar" o "Aprobado" en Monday, conviene borrar la nota.
- **Cronograma con un hueco del 17 al 22 nov:** el hueco cae justo donde quedó la línea base de "Trabajos adicionales de dique". Probablemente su fecha real debería ser 16–22 nov.
- "Aprobación de presupuesto" está vencido desde el 09 oct y sigue En curso.
- En "Trabajos adicionales de dique" se movió la línea base (16–22 nov) en vez de la fecha real (16–22 oct). Además dice Duración 38 días, pero las fechas cubren 7.
- 189 de 195 trabajos no tienen Duración, así que el avance total todavía no es representativo.
- Hay US$ 1,10 M solicitados sin aprobar y no hay nada aprobado.
- La orden de compra "tf" está vacía; parece de prueba.
- "Caja menuda para capitán" (Cubierta) no tiene Centro de Costo.
