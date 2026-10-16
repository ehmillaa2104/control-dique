# Control de Dique · instrucciones para Claude

Dashboard de control del dique seco del **M/V Kelly Trader**. Los datos salen de Monday. Responder siempre en español.

## Cómo trabajar

- **Revisar hasta cumplir el objetivo.** Antes de dar algo por terminado, abrirlo en el navegador, probarlo, verificar los datos y corregir. No entregar algo sin haberlo visto funcionando.
- **Órdenes directas se ejecutan.** Si el usuario pide algo concreto, hacerlo primero. Si hay un riesgo real, mencionarlo al final en una línea, no como paso previo.
- **Cada cambio queda guardado en GitHub.** El hook `Stop` de `.claude/settings.json` (`.claude/hooks/auto-version.sh`) hace commit, trae lo nuevo y hace push al terminar cada turno. Para cambios grandes, hacer además un commit con un mensaje descriptivo.

## Revisiones

- **Rev. 3** (raíz: `index.html`, `app.js`, `styles.css`) es la actual y usa datos de Monday.
- **Rev. 0, 1 y 2** (`rev0/`, `rev1/`, `rev2/`) están congeladas: no se modifican. Usan datos de ejemplo (`data.js`).
- Un cambio grande de diseño o de contenido va como **revisión nueva**. Para eso:
  1. Se copia la actual a `revN/` y se ajustan sus rutas (`../`).
  2. La nueva queda en la raíz.
  3. Se agrega el enlace en el pie de página.
- **Pruebas** (`pruebas/`, p. ej. el cronograma 3D) van aparte: nunca tocan las revisiones.
- Al cambiar `app.js` o `styles.css`, subir el `?v=` en `index.html`. Si no, el navegador muestra la versión vieja.

## Datos de Monday (lo más importante)

Espacio **GESTIÓN DE DIQUES**, carpeta **KELLY TRADER**. Hay 8 tableros:

- Cronograma
- P1. Ingeniería
- P2. Cubierta
- P3. Técnico
- CC. Centros de Costo
- POs Kelly Trader
- Cambios/Imprevistos
- Participación del Equipo

IDs y columnas en `MAPEO-MONDAY.md`.

**Antes de cualquier revisión o cambio, volver a leer Monday (datos y columnas).** Los tableros cambian seguido (duraciones, columnas nuevas o renombradas) y no se puede revisar con datos viejos. Siempre informar qué cambió en las **duraciones** y en las **columnas**.

**Para actualizar los datos:**

1. Leer los 8 tableros en **una sola consulta** con la herramienta de API de Monday (`all_monday_api`). Esta consulta trae también las columnas:
   ```graphql
   query ($ids: [ID!]) { boards(ids: $ids) { id name columns { id title type } items_page(limit: 500) { cursor items { id name created_at updated_at group { id title } column_values { id type text ... on MirrorValue { display_value } ... on FormulaValue { display_value } ... on BoardRelationValue { linked_item_ids } } } } } }
   ```
   con `{"ids": ["18431008651","18431019817","18432105237","18432105438","18431746322","18431381932","18431380804","18435454602"]}`.
2. La respuesta es grande y se guarda en un archivo. Copiarla tal cual a `monday/crudo/kelly.json` y agregarle `"extraido": "AAAA-MM-DD"` al inicio.
3. Correr `python monday/generar.py --recortar`. Este paso:
   - deja en el crudo solo las columnas usadas, sin nombres de personas, descripciones ni enlaces a archivos (el repositorio es público);
   - genera `monday.js`;
   - revisa la coherencia de los datos.

   Si termina con errores, no publicar. Además:
   - compara las columnas de cada tablero con `monday/columnas_conocidas.json` y avisa si alguna es nueva, se renombró, cambió de tipo o se borró. Si se borró una columna que usa el dashboard, es un error;
   - lista los **cambios desde la lectura anterior** (duración, estado, fase, fechas, montos y centro de costo). Esa lista se ve en `verificar.html`, sección 6.

   Cuando un cambio de columnas ya se revisó y se ajustó el mapeo, correr `python monday/generar.py --aceptar-columnas` para darlo por conocido.
4. Abrir `verificar.html` y confirmar **0 errores**.
5. Revisar el dashboard en el navegador y contarle al usuario qué cambió en Monday.

Si Monday cambia una columna, se corrige en la tabla `TABLEROS` de `monday/generar.py` y en `verificar.html`.

## Reglas de cálculo acordadas

- **Avance físico** = Σ (Estado % × Duración) / Σ Duración de P1, P2 y P3, igual que la columna "Avance" de Monday. Se pondera por duración porque no todos los trabajos tienen costo. **Un trabajo planificado es el que tiene una Fase** (Pre-dique, Dique, Post-dique…) y debería tener Duración. En las pestañas de área solo se muestran los trabajos con fase; los "No Aplica" no se ven. **Un trabajo con Duración es un trabajo planificado para ejecutarse.** No se muestra como falta de datos: se informa cuántos de los planificados están en ejecución (25–75 %) y cuántos finalizaron (100 %).
- **Presupuesto preliminar**: columna **"$ Preliminar"** del tablero CC (`formula_mm7d91f2`, en el código `revisado`). Es la suma de "$ Revisado Gerencia" de los trabajos. Se muestra en **amarillo** mientras no esté aprobado.
- **Estado ante Dirección**: si un centro de costo tiene Estado Aprobación = "Revisar", se muestra "Dirección solicitó cambios". Si Monday no lo tiene, sale la nota de **`notas.js`**, que se edita a mano y se borra cuando el dato ya esté en Monday.
- **Participación del equipo** (tablero "Participación del Equipo"). **Oculta por ahora** a pedido del usuario (16 oct): se sigue leyendo y verificando, pero el dashboard no la muestra; se vuelve a mostrar con `MOSTRAR_PARTICIPACION = true` en `app.js`. un elemento por equipo (Ingeniería, Cubierta, Técnico, Seguridad, Contabilidad). % de cumplimiento = puntos / máximo (reunión: asistió = 1 punto; actualización: directa = 2, indirecta = 1, no actualizó = 0). **El máximo es igual para todos los equipos:** una columna cuenta para todos en cuanto algún equipo la tiene cargada; al equipo que no la tiene cargada se le cuenta 0 ("s/c", sin cargar) y se avisa. La fórmula "% Cumplimiento" de Monday no cuenta las casillas vacías, así que solo coincide con los equipos que tienen todo cargado. La tabla de participación del resumen muestra todos los equipos del tablero (también Seguridad y Contabilidad). **Semáforo**: Alto ≥ 75 % verde, Medio ≥ 50 % amarillo, Bajo < 50 % rojo. El total del equipo es la suma de puntos sobre la suma de máximos. Las semanas se leen por el título de la columna (Kick Off, Reunión Sn, Act. Sn), así que una semana nueva entra sola.
- **Incurrido del resumen gerencial** = total de "$ Incurrido" del tablero **Contabilidad Kelly Trader** (18431381932, antes "POs Kelly Trader"): todos los documentos contables, estén o no enlazados. Lo que no tiene centro de costo ni trabajo se muestra aparte en el detalle; por área y por centro de costo solo cuenta lo enlazado (pedido del usuario, 15 oct).
- **Costos** (aprobado, proyectado, PO; incurrido por centro y por área): salen del tablero **CC. Centros de Costo**. Cada centro debe sumar sus líneas de P1, P2 y P3. Los **gastos generales** son los centros de costo, con sus mismos nombres.
- **Cronograma:** las barras usan la **Fecha Real** y la **Línea Base** se muestra como referencia. El atraso es la columna **Diferencia**. Los hitos son los elementos con duración 0.
- **Tiempo y avance se muestran separados**, porque el tiempo puede pasar sin que suba el avance. El buque de la cabecera marca hoy en el cronograma; el avance va aparte.

## Diseño

- Paleta corporativa blanco y negro. El rojo solo para alertas (atrasos, vencidos, datos faltantes) y el ámbar para lo pendiente de aprobar. Las fases del cronograma y el semáforo de participación son los únicos lugares con color propio.
- Poca información a la vista. El detalle va en desplegables y tooltips. No mostrar "última actividad en Monday" ni la tarjeta de participación por equipo a la derecha del resumen: el usuario pidió quitarlas (la participación va en el indicador del equipo y en su propia tabla, abajo del resumen por área).
- **Fases** (Pre-dique, Dique, Post-dique): salen de la columna "Fase" de P1, P2 y P3. El resumen tiene la tabla "Avance por fase" y cada pestaña de área tiene un selector de fase que filtra los indicadores y la lista.
- **Pruebas antes de publicar:** si el usuario pide probar antes de actualizar, trabajar en una rama (no `main`). En otra rama, el hook guarda solo en local y no publica; para publicar, se pasa la rama a `main`.
- Debe verse bien en celular.

## Publicación

- GitHub: `github.com/ehmillaa2104/control-dique`, rama `main`.
- GitHub Pages: `https://ehmillaa2104.github.io/control-dique/` se actualiza solo 1 o 2 minutos después de cada push. El archivo `.nojekyll` es necesario: sin él una compilación falló sin dar error.
- Para verlo en local: el servidor `dique` de `.claude/launch.json` (`python -m http.server 8791`).
