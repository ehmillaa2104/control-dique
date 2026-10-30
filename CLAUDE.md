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
  3. **No se ponen enlaces a las revisiones anteriores en el dashboard** (el usuario pidió quitarlos para no confundir); siguen accesibles por su ruta, p. ej. `rev2/`.
- **Pruebas** (`pruebas/`, p. ej. el cronograma 3D) van aparte: nunca tocan las revisiones.
- Al cambiar `app.js` o `styles.css`, subir el `?v=` en `index.html`. Si no, el navegador muestra la versión vieja.

## Datos de Monday (lo más importante)

Espacio **GESTIÓN DE DIQUES**, carpeta **KELLY TRADER**. Se leen sus 8 tableros (el PROGRAMA DE DIQUES de la flota se quitó del dashboard y de la lectura el 20 oct, a pedido del usuario):

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
   query ($ids: [ID!]) { boards(ids: $ids) { id name columns { id title type } items_page(limit: 500) { cursor items { id name created_at updated_at group { id title } column_values { id type text ... on MirrorValue { display_value } ... on FormulaValue { display_value } ... on BoardRelationValue { linked_item_ids } } subitems { id name created_at updated_at column_values { id type text ... on FormulaValue { display_value } } updates(limit: 1) { created_at text_body } } } } } }
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

**Revisar qué actualizaron los equipos** (27 oct): leer **todo**, columnas y también los mensajes (updates, "globitos") de **todos los tableros**, de los trabajos y de sus subelementos (el tablero "Subelementos de P3. Técnico", 18432105448, tiene sus propios mensajes). Ahí dejan la información más importante. Contar solo lo de **esta semana** (o entre ayer y hoy, si así lo pide): un mensaje escrito hoy que relata fechas pasadas (p. ej. la bitácora de limpieza de tanques del 3–8 oct cargada el 26 oct) se deja de lado.

## Actualización automática (GitHub Actions)

- `.github/workflows/actualizar-monday.yml` corre alrededor de las 07:00, 12:00 y 16:00 de Colombia en los servidores de GitHub, con 3 intentos por hora objetivo porque GitHub atrasa o se salta corridas programadas: `monday/leer_monday.py` lee Monday con el secreto `MONDAY_TOKEN`, corre `generar.py --recortar` y, si no hay errores y `monday.js` cambió, sube `?v=` y publica. Si hay errores, la corrida falla y no publica (GitHub avisa por correo).
- **La consulta y la lista de tableros están en dos lugares: arriba en este archivo y en `monday/leer_monday.py`.** Si se cambia una, se cambia la otra en el mismo commit; si no, la automática sigue leyendo la consulta vieja.
- Los cambios de diseño (`app.js`, `styles.css`, `registro.js`, `notas.js`) no la afectan: solo toca `monday.js`, `monday/historial.json`, `monday/crudo/kelly.json` y el `?v=` de `index.html` y `semana.html`.

## Reglas de cálculo acordadas

- **Avance físico** = Σ (Estado % × Duración) / Σ Duración de P1, P2 y P3, igual que la columna "Avance" de Monday. Se pondera por duración porque no todos los trabajos tienen costo. **Un trabajo planificado es el que tiene una Fase** (Pre-dique, Dique, Post-dique…) y debería tener Duración. En las pestañas de área solo se muestran los trabajos con fase; los "No Aplica" no se ven. **Un trabajo con Duración es un trabajo planificado para ejecutarse.** No se muestra como falta de datos: se informa cuántos de los planificados están en ejecución (25–75 %) y cuántos finalizaron (100 %).
- **Trabajos con subelementos** (desde el 27 oct, el **Astillero** de P3 desglosa la cotización en partidas con Peso (%), Avance, Última medición, Monto ref. y Avance ponderado): su avance = **Σ Avance ponderado / Σ Peso** de las partidas no canceladas, en vez de su Estado (que en Monday sigue en 0 %). En la pestaña Técnico las partidas van en un desplegable debajo del trabajo, con la primera línea de su último mensaje. Columnas en `SUBELEMENTOS` de `generar.py`.
- **Costos en tres etapas** (desde el 16 oct), columnas de cada trabajo de P1, P2 y P3 y sus sumas en el tablero CC:
  - **Preliminar** = lo que solicita el equipo: "$ Preliminar" (`numeric_mm6vjdrd`; en CC `formula_mm867352`). Color **azul**. **Desde el 20 oct no se muestra en el resumen** (tarjetas, áreas, centros de costo, fases): el usuario dijo que ya no importa. Sigue en las tablas de trabajos de cada área.
  - **En revisión** = lo que está en revisión por la Dirección de Operaciones: "$ En Revisión" (`numeric_mm78kpas`; en CC `formula_mm7d91f2`). Color **ámbar**.
  - **Aprobado** = lo aprobado hasta la fecha: "$ Aprobado" (`numeric_mm78s0hd`; en CC `formula_mm7dehmt`). Color **verde**.
  - **Descartado** (Estado Aprobación = "Descartado"): se pidió pero no se aprobó. **Se queda en el preliminar** (no se borra su monto) y se muestra aparte en gris.
  - Lo que queda del preliminar sin estar en revisión, aprobado ni descartado es lo **sin enviar** a revisión. La etapa de cada trabajo sale de sus montos (aprobado > en revisión > preliminar); `generar.py` avisa si no coincide con "Estado Aprobación".
- **Estado ante Dirección**: si un centro de costo tiene Estado Aprobación = "Revisar", se muestra "En espera de revisión para el presupuesto final" (24 oct; antes "Dirección solicitó cambios"). Si Monday no lo tiene, sale la nota de **`notas.js`**, que se edita a mano y se borra cuando el dato ya esté en Monday.
- **Participación del equipo** (tablero "Participación del Equipo"). **Oculta por ahora** a pedido del usuario (16 oct): se sigue leyendo y verificando, pero el dashboard no la muestra; se vuelve a mostrar con `MOSTRAR_PARTICIPACION = true` en `app.js`. un elemento por equipo (Ingeniería, Cubierta, Técnico, Seguridad, Contabilidad). % de cumplimiento = puntos / máximo (reunión: asistió = 1 punto; actualización: directa = 2, indirecta = 1, no actualizó = 0). **El máximo es igual para todos los equipos:** una columna cuenta para todos en cuanto algún equipo la tiene cargada; al equipo que no la tiene cargada se le cuenta 0 ("s/c", sin cargar) y se avisa. La fórmula "% Cumplimiento" de Monday no cuenta las casillas vacías, así que solo coincide con los equipos que tienen todo cargado. La tabla de participación del resumen muestra todos los equipos del tablero (también Seguridad y Contabilidad). **Semáforo**: Alto ≥ 75 % verde, Medio ≥ 50 % amarillo, Bajo < 50 % rojo. El total del equipo es la suma de puntos sobre la suma de máximos. Las semanas se leen por el título de la columna (Kick Off, Reunión Sn, Act. Sn), así que una semana nueva entra sola.
- **Incurrido del resumen gerencial** = total de "$ Incurrido" del tablero **Contabilidad Kelly Trader** (18431381932, antes "POs Kelly Trader"): todos los documentos contables, estén o no enlazados. Lo que no tiene centro de costo ni trabajo se muestra aparte en el detalle; por área y por centro de costo solo cuenta lo enlazado (pedido del usuario, 15 oct).
- **Costos** (aprobado, proyectado, PO; incurrido por centro y por área): salen del tablero **CC. Centros de Costo**. Cada centro debe sumar sus líneas de P1, P2 y P3. Los **gastos generales** son los centros de costo, con sus mismos nombres.
- **Cronograma:** una fila por elemento, agrupadas por fase, con dos vistas que se eligen arriba del gráfico: **Plan vs real** (línea base en gris; fecha real en rojo si va atrasada y en verde si va en plazo o adelantada) y **Estado** (verde = Listo, amarillo = En curso, gris = sin hacer). Las barras usan la **Fecha Real** y la **Línea Base** se muestra como referencia. El atraso es la columna **Diferencia**. Los hitos son los elementos con duración 0.
- **Entrega de información semanal** (cuadro "Esta semana", **todos los departamentos**: Ingeniería, Cubierta, Técnico, Seguridad y Contabilidad): de la **última semana cuya fecha ya pasó** (la fecha va en el título de la columna) en el tablero Participación del Equipo, columna "Act. Sn" (o "Entrega Sn"): **Completa** (verde), **Parcial** (ámbar) o **Pendiente** (rojo; si no está cargado o hay duda, cuenta como que no presentó la información). **Solo cuentan las opciones nuevas** (Completa / Parcial); las de antes ("actualización directa / indirecta") se muestran como Pendiente (pedido del usuario, 22 oct). El % de participación (oculto) sigue usando las de antes.
- **Esta semana** (resumen): lo hecho (trabajos que avanzaron contra la lectura de hace 7 días), lo que está en curso (25–75 %) y lo próximo (hitos y fases; los hitos vencidos sin marcar en rojo). El avance de cada lectura se guarda en `monday/historial.json` (una entrada por día, desde el 14 oct); `generar.py` lo actualiza solo.
- **Tiempo y avance se muestran separados**, porque el tiempo puede pasar sin que suba el avance. El buque de la cabecera marca hoy en el cronograma; el avance va aparte.

## Diseño

- Paleta corporativa blanco y negro. El rojo solo para alertas (atrasos, vencidos, datos faltantes). Tienen color propio: las fases del cronograma, el semáforo de participación y las **etapas del costo** (preliminar azul, en revisión ámbar, aprobado verde, también en la barra apilada de cada monto).
- **Orden del resumen** (22 oct): tarjetas → Resumen por área → Cumplimiento (entrega de información semanal) → Esta semana en el dique (registro semanal; arriba del avance desde el 27 oct) → Avance de la semana (lo hecho y en curso; antes "Cambios de la semana") junto a **Puntos de atención** (hitos y fases pendientes, antes "Lo próximo") → Centros de costo e Imprevistos → Avance por fase.
- **PO y Pagado del resumen** (30 oct): mientras Monday no los traiga, salen de `notas.js` → `montos` (totales dados por el usuario; solo en el resumen, no por área). Si Monday trae el dato, Monday manda y se borra de `notas.js`. PO sale de `$ PO Total`; Pagado no tiene columna de monto en Monday: al crearla hay que conectarla en `generar.py`.
- **Indicadores del resumen** (20 oct): 3 + 3 de costos (en revisión, aprobado, proyectado / PO, incurrido, pagado) y el **avance físico como reloj** al lado, ocupando las dos filas. El **atraso del cronograma** va en la cabecera, junto a los hitos. Sin barras apiladas de colores.
- Poca información a la vista. El detalle va en desplegables y tooltips. No mostrar "última actividad en Monday" ni la tarjeta de participación por equipo a la derecha del resumen: el usuario pidió quitarlas (la participación va en el indicador del equipo y en su propia tabla, abajo del resumen por área).
- **Fases** (Pre-dique, Dique, Post-dique): salen de la columna "Fase" de P1, P2 y P3. El resumen tiene la tabla "Avance por fase" y cada pestaña de área tiene un selector de fase que filtra los indicadores y la lista.
- **Pruebas antes de publicar:** si el usuario pide probar antes de actualizar, trabajar en una rama (no `main`). En otra rama, el hook guarda solo en local y no publica; para publicar, se pasa la rama a `main`.
- Debe verse bien en celular.

## Indicador de días perdidos por lluvias

- Reemplaza al indicador "En revisión" (pedido del usuario, 27 oct). Suma la columna **Días** del tablero **Cambios/Imprevistos** en los registros cuyo Tipo de Impacto o nombre diga lluvia, clima o mal tiempo (desde el 29 oct el Tipo del registro de lluvia dice solo "Tiempo"); el detalle lista cada registro con su fecha y estado. La fecha es la del registro en Monday, salvo que `notas.js` → `fechaImprevisto` diga cuándo ocurrió (la lluvia fue el 24 oct aunque se registró el 27; 27 oct).

## Imprevistos (tablero Cambios/Imprevistos)

- En el resumen, cada imprevisto es un enlace a su área (la del trabajo enlazado en "Actividad Relacionada"): `#<area>/imp-<id>` abre la pestaña del área, despliega ese imprevisto y lo deja a la vista (27 oct).
- Cada pestaña de área tiene el cuadro "Imprevistos · <área>" (debajo de los indicadores), un desplegable por imprevisto con: fecha en que ocurrió y de registro, tipo de impacto, costo, días, estado, fecha de aprobación, centro de costo y trabajo relacionado (fase y avance). La descripción no se muestra (el repositorio es público).

## Registro semanal (fotos, videos y avance en sitio)

- Pestaña **"Registro semanal"** (al lado del Resumen gerencial) y recuadro **"Esta semana en el dique"** en el resumen. Datos en `registro.js`, se edita a mano; archivos en `registro/sN/`.
- Cada semana: el usuario manda fotos, videos y el reporte del superintendente. Las fotos se reducen a 1600 px sin metadatos (más una miniatura `-min.jpg` de 480 px); los videos van tal cual.
- Semanas de **sábado a viernes**. "Esta semana en el dique" (resumen) muestra siempre la **semana actual** (la que contiene hoy) con lo que haya: si aún no hay fotos dice "Sin fotos de esta semana todavía"; si la semana no está cargada en `registro.js`, sale vacía con sus fechas. El avance de la semana se arma con los mensajes del equipo en Monday de esa semana (27 oct).
- Cada semana empieza con la zona **"Temas importantes"**: una o dos líneas cortas escritas a mano (p. ej. "Presupuesto aprobado: US$ 1.08 M · 27 oct", "1 día perdido por lluvia · 24 oct"). Sin recuadros automáticos ni repetir lo que ya está en otra zona (pedido del usuario, 27 oct: "no redundes, hay mucho ruido"). El usuario puede pedir "pon esto como tema importante".
- **Lo más reciente primero** dentro de cada semana (pedido del usuario, 30 oct): las fotos por fecha descendente y, en el avance, zonas y comentarios con lo último arriba ("Temas importantes" sigue de primera). Lo nuevo se agrega arriba en `registro.js`, no al final; el orden en pantalla es el del archivo.
- La pestaña Registro muestra **una sección desplegable por semana**: abierta la actual, cerradas las anteriores (27 oct).
- En pantalla la semana se muestra solo con fechas ("Semana · 17 oct – 23 oct"), sin número. No mostrar "Renovación de acero" (pedido del usuario, 23 oct). No poner nombres de personas (el repositorio es público).

## Versión liviana del registro (semana.html)

- `semana.html` (+ `semana.js`, `semana.css`): solo el registro semanal, para enviar a media semana. Lee `registro.js` y `monday.js` (solo para el día de dique); no toca el dashboard.
- Arriba la semana actual abierta; las anteriores cerradas debajo. `semana.html?s=N` abre la semana N.
- Botón **"Descargar PDF"**: usa la impresión del navegador ("Guardar como PDF") con diseño A4 (fondo blanco, fotos en 4 columnas, sin semanas cerradas).
- Sin enlace al dashboard (pedido del usuario, 27 oct). Enlace para enviar: `https://ehmillaa2104.github.io/control-dique/semana.html`.

## Publicación

- GitHub: `github.com/ehmillaa2104/control-dique`, rama `main`.
- GitHub Pages: `https://ehmillaa2104.github.io/control-dique/` se actualiza solo 1 o 2 minutos después de cada push. El archivo `.nojekyll` es necesario: sin él una compilación falló sin dar error.
- Para verlo en local: el servidor `dique` de `.claude/launch.json` (`python -m http.server 8791`).
