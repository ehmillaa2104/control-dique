# Dashboard de dique: datos, cálculos e integración

## Revisiones

| Revisión | Archivo | Para quién |
|---|---|---|
| **Rev. 2 · cronograma y avance** | `index.html` | La Rev. 1 más una barra de cronograma en la cabecera con el buque navegando según el avance. El avance se pondera por **duración**, como en Monday |
| **Rev. 1 · vista ejecutiva** (congelada) | `rev1/index.html` | Gerencia y pantalla de sala: plazo, avance, costo plan, incurrido, desembolsado y participación del equipo. Avance ponderado por costo |
| **Rev. 0 · vista completa** (congelada) | `rev0/index.html` | Control de proyecto: valor ganado, todas las OT, riesgos, adicionales y acciones |

Las tres leen **el mismo `data.js`**. La Rev. 2 calcula el avance por duración, así que su % puede diferir un poco del de la Rev. 0 y la Rev. 1, que lo calculan por costo.

## 1. Qué datos necesita

El dashboard recibe **13 tablas planas**. Cada una puede salir directamente de una planilla, de una
base de datos o de la herramienta de gestión. Solo 4 son obligatorias para los indicadores.

| Tabla | Obligatoria | Para qué sirve |
|---|---|---|
| `proyecto` | Sí | Fechas del dique y datos del buque |
| `cronograma` | No | Fases del viaje (pre-dique, traslados, dique, post-dique). Lo usa la barra de la Rev. 2 |
| `areas` | Sí | Ingeniería, Cubierta, Técnico (se pueden agregar más) |
| `ordenes` | Sí | La base de todos los cálculos |
| `avances` | Sí | Avance real y costo de cada OT en cada fecha de corte |
| `hitos` | No | Tarjeta de hitos |
| `riesgos` | No | Tarjeta de riesgos |
| `adicionales` | No | Trabajos fuera del presupuesto original |
| `desembolsos` | No | Pagos efectivos (caja). Lo usa la Rev. 1 |
| `equipo` | No | Personas del equipo y su área. Base de la participación |
| `reuniones` | No | Reuniones con convocados y asistentes |
| `actualizaciones` | No | Actualizaciones de la plataforma esperadas y realizadas por persona |
| `acciones` | No | Próximas acciones |

### proyecto
| Campo | Ejemplo | Nota |
|---|---|---|
| `entrada` | `"2026-09-14"` | Día de entrada a dique. Obligatorio |
| `salidaPlan` | `"2026-10-25"` | Desvarada planificada. Obligatorio |
| `corte` | `"2026-10-02"` | Fecha de los datos. Si falta, se usa la fecha de hoy |
| `buque`, `tipo`, `eslora`, `dique` | | Solo se muestran en el encabezado |
| `moneda` | `"US$"` | Opcional |
| `fuente` | `"Sistema X · 02-10 08:00"` | Opcional. Se muestra en el pie de página |
| `pesoAvance` | `"duracion"` | Rev. 2. Cómo se pondera el avance físico: `"duracion"` (por defecto, como Monday) o `"costo"` |

### cronograma (una fila por fase · tablero "Cronograma" de Monday)
```json
{ "fase": "dique", "nombre": "En dique", "lugar": "Cartagena, Colombia", "inicio": "2026-09-14", "fin": "2026-10-25", "inicioReal": "2026-09-14", "finReal": null }
```
- `fase`: `pre`, `ida`, `dique`, `regreso`, `post` (también `plan` y `cierre`). Tiene que haber una fase `dique`.
- `inicio` / `fin`: línea base. `inicioReal` / `finReal`: fechas reales (opcionales).
- Si la tabla no viene, la barra muestra solo la estadía en dique (`entrada` a `salidaPlan`).
- **Si existe `monday.js`**, la barra usa el tablero Cronograma real de Monday en vez de esta tabla (ver [MAPEO-MONDAY.md](MAPEO-MONDAY.md)).

**Cómo se dibuja la barra:** cada fase tiene su color y un ancho proporcional a sus días (las fases cortas tienen un ancho mínimo para que se lean). Lo ya recorrido se ve lleno y lo que falta, tenue. **El buque marca hoy** (tiempo). Su etiqueta dice la fase y si va en plazo según la columna Diferencia de Monday. **El avance de los trabajos va aparte**, real contra plan: si pasan los días y el avance no sube, la diferencia se ve. Los rombos son los hitos: blanco = cumplido, rojo = vencido.

### areas
`{ "id": "cubierta", "nombre": "Cubierta", "icono": "anchor", "descripcion": "..." }`
Íconos disponibles: `ruler`, `anchor`, `wrench`, `gauge`, `ship`, `clipboard`.

### ordenes (una fila por OT)
| Campo | Ejemplo | Nota |
|---|---|---|
| `id` | `"CUB-03"` | Único |
| `area` | `"cubierta"` | Debe existir en `areas` |
| `nombre` | `"Renovación de acero bodega 3"` | |
| `ejecuta` | `"Astillero"` | Opcional |
| `bac` | `340000` | Presupuesto aprobado. **Opcional en la Rev. 2**: no todos los trabajos tienen costo. Sin monto, cuenta en el avance y en costos vale 0 |
| `inicio`, `fin` | `"2026-09-20"`, `"2026-10-09"` | Programa base. El % planificado se calcula solo |
| `duracion` | `12` | Opcional. "Duración (días)" de Monday: es el **peso** de la OT en el avance (Rev. 2). Si falta, se usan los días entre inicio y fin |

### avances (una fila por OT y fecha de corte)
`[fecha, id_ot, % avance real acumulado, costo real acumulado]`

```json
["2026-10-02", "CUB-03", 45, 128000]
```

- Basta con registrar las OT que cambiaron. Si una OT no tiene fila ese día, se usa su último valor.
- El **costo puede ser `null`**. Si no se informa ningún costo, el dashboard oculta CPI, CV, EAC y la columna de costo, y el resto sigue funcionando.
- El avance real debe medirse con un criterio objetivo: toneladas, m², unidades instaladas o hitos ponderados.

### desembolsos (una fila por pago)
```json
{ "fecha": "2026-10-02", "area": "cubierta", "monto": 174200, "concepto": "Estado de pago N.º 2 · Astillero" }
```
- `ot` es opcional, por si el pago corresponde a una OT específica.
- Si la tabla no existe, el desembolsado se muestra como "Sin datos". Si existe pero está vacía, se muestra US$ 0.

**Los tres valores de costo de la Rev. 1:**

| Valor | Qué es | De dónde sale |
|---|---|---|
| **Costo plan** | Lo que se debería haber gastado a la fecha según el programa | Presupuesto de cada OT repartido entre su inicio y su fin |
| **Incurrido** | Lo que ya se consumió: horas, materiales y servicios, se haya pagado o no | Columna de costo de `avances` |
| **Desembolsado** | Lo que efectivamente salió de caja | Tabla `desembolsos` |

La diferencia entre incurrido y desembolsado es lo **por pagar** (deuda devengada con astillero y contratistas).

### Participación del equipo (equipo, reuniones, actualizaciones)
```json
{ "id": "cub-jefe", "nombre": "Jefe de cubierta", "area": "cubierta" }
{ "fecha": "2026-10-02", "nombre": "Coordinación diaria", "convocados": ["cub-jefe", "tec-jefe"], "asistentes": ["cub-jefe"] }
["2026-10-02", "cub-jefe", 2, 1]
```
- **equipo**: una fila por persona. `area` puede quedar vacía: esa persona solo cuenta en el resumen general.
- **reuniones**: una fila por reunión, con la lista de convocados y de asistentes (por `id`).
- **actualizaciones**: `[fecha, id_persona, esperadas, realizadas]`. Lo habitual es que la herramienta lo genere sola: en cada corte, cuántas OT tenía que actualizar la persona y cuántas actualizó a tiempo.

**Cálculo**
- Reuniones = asistencias / convocatorias
- Plataforma = actualizaciones realizadas / esperadas
- **Participación = 50 % reuniones + 50 % plataforma**

**Color:** rojo bajo 60 %, amarillo de 60 % a 80 %, verde desde 80 %, con matices continuos entre medio. Junto al color siempre se escribe el nivel (Baja, Media o Alta). La flecha compara los últimos 7 días con los 7 anteriores.

Los pesos y los umbrales se ajustan en `proyecto`:
```json
"participacion": { "pesoReuniones": 0.5, "umbrales": [60, 80] }
```

### hitos, riesgos, adicionales, acciones
```json
{ "area": "tecnico", "nombre": "Montaje de eje y hélice", "fechaPlan": "2026-10-15", "fechaReal": null, "avance": 0, "clave": true }
{ "area": "tecnico", "desc": "Repuestos del MP en aduana", "categoria": "Suministro", "prob": 4, "impacto": 5, "resp": "Abastecimiento" }
{ "area": "cubierta", "desc": "Acero adicional en doble fondo", "monto": 58000, "estado": "Aprobado" }
{ "area": "cubierta", "accion": "Segundo turno de soldadura", "resp": "Astillero", "fecha": "2026-10-03", "estado": "Abierta" }
```
- **Hitos**: `clave: true` hace que aparezca en el resumen general. Con `fechaReal` queda completado.
- **Riesgos**: el nivel se calcula como P × I: 1–4 Bajo · 5–9 Medio · 10–16 Alto · 20–25 Muy alto.
- **Acciones**: las que tienen `estado: "Cerrada"` no se muestran.

El ejemplo completo está en [datos-ejemplo.json](datos-ejemplo.json). Es el mismo contenido de `data.js`.

## 2. Cómo conectarlo con la herramienta

Hay tres opciones, de la más simple a la más integrada:

1. **Reemplazar `data.js`.** La herramienta genera el archivo con este formato: `window.DIQUE_DATA = { ... };`
2. **Publicar un JSON.** Se abre el dashboard con `index.html?datos=https://servidor/dique.json`.
   El JSON tiene que estar en el mismo servidor, o permitir CORS si está en otro.
3. **Desde JavaScript**, si el dashboard se incrusta en otra aplicación:
   ```js
   Dique.cargar(objeto);          // devuelve { ok, observaciones }
   Dique.cargarDesdeUrl(url);     // lo mismo, leyendo un JSON
   Dique.indicadores();           // devuelve los indicadores calculados (total y por área)
   ```

**Validación.** Si llegan datos con problemas (OT duplicada, área inexistente, avance mayor que 100 %,
avance que retrocede, fechas fuera de rango), el dashboard no se cae. Omite la fila y muestra un aviso
desplegable con cada observación. Si falta algo esencial, como las fechas del proyecto, muestra el error.

## 3. Fórmulas

| Indicador | Fórmula |
|---|---|
| % planificado de una OT | días transcurridos desde su inicio / duración (lineal entre inicio y fin) |
| PV (valor planificado) | Σ presupuesto × % planificado |
| EV (valor ganado) | Σ presupuesto × % real |
| AC (costo real) | Σ costo real acumulado |
| % avance físico (Rev. 2) | Σ (% real × duración) / Σ duración, igual que la fórmula "Avance" de P1, P2 y P3 en Monday |
| % avance físico (Rev. 0 y 1) | EV / presupuesto total |
| SV / CV | EV − PV / EV − AC |
| SPI / CPI | EV / PV / EV / AC |
| EAC | presupuesto / CPI |
| **Atraso (plazo ganado)** | días transcurridos − día en que el plan alcanzaba el avance real de hoy |
| Fin / desvarada proyectada | fin planificado + atraso actual |
| Ritmo requerido | avance que falta / días que quedan del plan, comparado con el ritmo planificado |
| Desembolsado | Σ pagos con fecha ≤ corte |
| Por pagar | incurrido − desembolsado |
| Costo final estimado (Rev. 1) | presupuesto / CPI + adicionales |
| Atraso de una OT (Rev. 1) | días que lleva detrás de su propio programa lineal |

Semáforo: SPI y CPI ≥ 0,98 bien · 0,90–0,98 leve · < 0,90 en rojo. Atraso ≥ 2 días en rojo.
Una OT se marca atrasada si su avance real está más de 5 puntos bajo el planificado.

## 4. ¿Vale la pena la curva S en proyectos cortos y sin costos?

**Sí, y no depende de los costos.** La curva S mide avance físico ponderado: cada OT pesa según su
presupuesto, que existe desde la cotización. Para EV, SPI y atraso no se necesita el costo real.
El costo real solo alimenta CPI, CV y EAC. Si no se lleva, el dashboard simplemente los oculta.

Lo que cambia en un proyecto corto (~40 días):

- **Hay que medir en días, no en semanas.** Con cortes semanales la curva tendría 5 o 6 puntos y el atraso se detectaría tarde. Lo recomendable son cortes diarios o cada 2 días.
- **El SPI pierde utilidad al final.** Converge a 1,00 al terminar aunque haya atraso. Por eso el indicador principal es el **atraso en días (plazo ganado)**, que no tiene ese problema y se lee directo: "vamos 3 días atrasados, desvaramos el 28 en vez del 25".
- **El "ritmo requerido" es la alerta temprana.** Si para cumplir hay que avanzar un 25 % más rápido que lo planificado, la decisión (segundo turno, más cuadrillas) hay que tomarla ahora, no la última semana.

Si en algún momento no se puede medir el avance físico por OT, la alternativa mínima es la tabla
de hitos con fechas plan y real. Se pierde la anticipación que da la curva.
