# Mapeo Monday → Dashboard (Kelly Trader)

Revisado el 2026-10-08 en Monday, espacio **GESTIÓN DE DIQUES**, carpeta **KELLY TRADER**.

## Tableros

| Tablero | ID | Elementos | Qué aporta al dashboard |
|---|---|---|---|
| Cronograma | 18431008651 | 15 | Fechas del proyecto, fases, hitos y atraso |
| P1. Ingeniería | 18431019817 | 142 | Órdenes de trabajo del área Ingeniería |
| P2. Cubierta | 18432105237 | 19 | Órdenes de trabajo del área Cubierta |
| P3. Técnico | 18432105438 | 10 | Órdenes de trabajo del área Técnico |
| CC. Centros de Costo | 18431746322 | 20 | Totales por centro de costo (revisado, aprobado, PO, incurrido, proyectado) |
| POs Kelly Trader | 18431381932 | **0** | Incurrido y pagos (desembolsado) |
| Cambios/Imprevistos | 18431380804 | **0** | Adicionales (costo y días) |

## De qué columna sale cada dato

### `proyecto` y `hitos` ← Cronograma

| Dato del dashboard | Elemento / columna en Monday | ID columna |
|---|---|---|
| Fases (pre-dique, dique, post) | Grupo: Plan · Pre-Dique · Dique · Post Dique · Cierre | grupo |
| Entrada a dique | Elemento "DIQUE (Ejecución)" → inicio de **Linea Base** | `timerange_mm7yfj5p` |
| Salida plan | Elemento "Salida del astillero" → **Linea Base** | `timerange_mm7yfj5p` |
| Fechas reales / proyectadas | **Fecha Real** | `timerange_mm78kjs` |
| Atraso (días) por fase | **Diferencia** = fin real − fin línea base | `formula_mm7ygv4s` |
| Estado de cada fase | **Estado** (En curso, Listo, Retrasado, No Iniciado) | `color_mm6v6vf2` |
| Hitos | Elementos de duración 0: Off hire, Aprobación de presupuesto, Entrada al muelle, Salida del astillero, On hire | `numeric_mm6zgcqw` = 0 |
| Hito cumplido | Estado = Listo → `fechaReal` = Fecha Real | `color_mm6v6vf2` |

### `ordenes` y `avances` ← P1 / P2 / P3

Las tres tablas usan las mismas columnas. Algunas cambian de ID según el tablero:

| Dato del dashboard | Columna Monday | P1 Ingeniería | P2 Cubierta | P3 Técnico |
|---|---|---|---|---|
| `nombre` | Trabajo | `name` | `name` | `name` |
| `area` | Tablero (P1/P2/P3) | — | — | — |
| `fase` | Fase | `color_mm6wsp0z` | `color_mm6wsp0z` | `color_mm6wsp0z` |
| `ejecuta` | Proveedor | `dropdown_mm70s99n` | `dropdown_mm70s99n` | `dropdown_mm70s99n` |
| Responsable (equipo) | Responsable | `multiple_person_mm781bx8` | `multiple_person_mm781bx8` | `multiple_person_mm781bx8` |
| `bac` (costo plan) | **$ Aprobado Dirección** (si está vacío: $ Revisado Gerencia y después $ Solicitado) | `numeric_mm78s0hd` | `numeric_mm78s0hd` | `numeric_mm78s0hd` |
| Costo proyectado (EAC) | $ Proyectado | `numeric_mm7y9v4k` | `numeric_mm7yw4b3` | `numeric_mm7y6h6f` |
| `fin` | Fecha Fin | `date_mm7yv15j` | `date_mm7ya280` | `date_mm7yw7ca` |
| Duración (peso del avance) | Duración (días) | `numeric_mm7yw5hx` | `numeric_mm7y9sbv` | `numeric_mm7v7xt9` |
| `inicio` | **No existe**: se calcula como Fecha Fin − Duración | — | — | — |
| `pct` de avance | Estado (0 · 25 · 50 · 75 · 100 % · Cancelado) | `color_mm7yb2cs` | `color_mm7y4j97` | `color_mm7vv5nh` |
| Aprobación | Estado Aprobación | `color_mm6v621m` | `color_mm6v621m` | `color_mm6v621m` |
| Centro de costo | Centro de Costo (conexión) | `board_relation_mm7am925` | `board_relation_mm7am925` | `board_relation_mm7am925` |
| Fecha de actualización (participación) | Última actualización | `pulse_updated_mm7g2q1g` | `pulse_updated_mm7ga065` | `pulse_updated_mm7ge32a` |

El avance del área se calcula igual que la fórmula **Avance** de Monday: el % de cada trabajo ponderado por su duración.

### `incurrido` y `desembolsos` ← POs Kelly Trader

| Dato del dashboard | Columna Monday | ID columna |
|---|---|---|
| Incurrido | $ Incurrido | `numeric_mm322fqy` |
| Comprometido (PO) | $ PO Total | `numeric_mm2pfpzs` |
| Saldo | $ Saldo | `numeric_mm39rhnj` |
| Fecha | Fecha Orden de Compra | `date_mm2ptpmb` |
| Área | Area | `dropdown_mm334y96` |
| Desembolsado | Estatus de Pago (Pagado, Parcialmente Pagado, Anticipo) | `color_mm32ajy1` |
| Trabajo al que pertenece | Conectar tableros (P1/P2/P3) | `board_relation_mm7y2fcq` |

### `adicionales` ← Cambios/Imprevistos

| Dato del dashboard | Columna Monday | ID columna |
|---|---|---|
| `desc` | Name + Descripción del Imprevisto/Cambio | `name`, `long_text_mkzb6776` |
| `monto` | Costo | `numeric_mm268zat` |
| Días de impacto | Días | `numeric_mm2epnk4` |
| `estado` | Estado (Solicitado, Aprobado, Rechazado, Pospuesto) | `color_mm2e3n8w` |
| `area` | Actividad Relacionada (P1/P2/P3) | `board_relation_mm2ebzc8` |

## Lo que falta o está incompleto

1. **P1 Ingeniería y P3 Técnico están vacíos.** Ninguna de sus 152 líneas tiene montos, responsable, Fecha Fin ni Duración. Todas están en 0 % y P1 tiene la Fase en "No Aplica".
2. **P2 Cubierta solo tiene montos solicitados:** 15 líneas suman ≈ US$ 134 k en "$ Solicitado". Ninguna está revisada ni aprobada, y ninguna tiene Fecha Fin ni Duración.
3. **Los tableros POs y Cambios/Imprevistos no tienen elementos:** sin ellos no hay incurrido, desembolsado ni adicionales.
4. **Monto pagado:** POs solo tiene el *estado* de pago, no el *monto* pagado. Para "desembolsado" con pagos parciales hace falta una columna "$ Pagado" con la fecha de pago.
5. **Historial del avance:** Monday guarda solo el % actual. Para la curva plan vs real hay que guardar una foto diaria del avance (se puede automatizar).
6. **Fecha de inicio:** P1/P2/P3 no tienen inicio. Se puede calcular con Fecha Fin − Duración o agregar una columna de cronograma.
7. **Sin fuente en Monday:**
   - riesgos;
   - reuniones (asistencia);
   - acciones.

   Para participación también se pueden usar las actualizaciones de Monday (fecha de "Última actualización" por responsable).
8. **Inconsistencias:**
   - Cronograma: "Trabajos adicionales de dique" tiene Duración 38 con un rango de 6 días.
   - Avance % del Cronograma está vacío.
   - POs y Cambios conservan textos del Roxana Trader. Por ejemplo, el grupo de Cambios se llama "DIQUE ROXANA".
   - "Estatus PO" tiene etiquetas duplicadas: Abiert / Abierta / Abierto.
   - "Estatus de Pago" tiene etiquetas con JSON roto.
