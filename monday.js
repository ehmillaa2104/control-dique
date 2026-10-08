/*
 * DATOS REALES leídos de Monday · espacio "GESTIÓN DE DIQUES" · carpeta "KELLY TRADER".
 * Los usa la barra de cronograma de la cabecera (Rev. 2). Si este archivo no está,
 * la barra usa la tabla "cronograma" de data.js.
 *
 * cronograma: una fila por elemento del tablero "Cronograma" (18431008651)
 *   base = columna "Linea Base"   real = columna "Fecha Real" (real o proyectada)
 *   diferencia = columna "Diferencia" (días: fin real − fin línea base; positivo = atraso)
 * avance: resumen de P1 Ingeniería, P2 Cubierta y P3 Técnico
 *   avance = Σ (Estado % × Duración) / Σ Duración, igual que la columna "Avance" de Monday
 */
window.DIQUE_MONDAY = {
  "proyecto": "Kelly Trader",
  "fuente": "Monday · Cronograma Kelly Trader",
  "extraido": "2026-10-08",
  "cronograma": [
    { "grupo": "Plan", "nombre": "PLANIFICACIÓN", "estado": "En curso", "duracion": 18, "base": ["2026-09-22", "2026-10-02"], "real": ["2026-09-22", "2026-10-09"], "diferencia": 7 },
    { "grupo": "Plan", "nombre": "Off hire", "estado": "Listo", "duracion": 0, "base": ["2026-10-02", "2026-10-02"], "real": ["2026-09-30", "2026-09-30"], "diferencia": -2 },
    { "grupo": "Plan", "nombre": "Traslado a Panamá", "estado": "Listo", "duracion": 4, "base": ["2026-10-02", "2026-10-07"], "real": ["2026-09-30", "2026-10-03"], "diferencia": -4 },
    { "grupo": "Plan", "nombre": "Aprobación de presupuesto", "estado": "En curso", "duracion": 0, "base": ["2026-09-29", "2026-09-29"], "real": ["2026-10-09", "2026-10-09"], "diferencia": 10 },
    { "grupo": "Pre-Dique", "nombre": "PRE-DIQUE (Ejecución)", "estado": "En curso", "duracion": 14, "base": ["2026-10-04", "2026-10-17"], "real": ["2026-10-04", "2026-10-17"], "diferencia": 0 },
    { "grupo": "Pre-Dique", "nombre": "Traslado a Cartagena", "estado": "No Iniciado", "duracion": 3, "base": ["2026-10-17", "2026-10-19"], "real": ["2026-10-17", "2026-10-19"], "diferencia": 0 },
    { "grupo": "Pre-Dique", "nombre": "Entrada al muelle del astillero", "estado": "No Iniciado", "duracion": 0, "base": ["2026-10-19", "2026-10-19"], "real": ["2026-10-19", "2026-10-19"], "diferencia": 0 },
    { "grupo": "Dique", "nombre": "DIQUE (Ejecución)", "estado": "No Iniciado", "duracion": 29, "base": ["2026-10-19", "2026-11-16"], "real": ["2026-10-19", "2026-11-16"], "diferencia": 0 },
    { "grupo": "Dique", "nombre": "Trabajos adicionales de dique * soldadura, tanques de lastre, culminacion de trabajos", "estado": "No Iniciado", "duracion": 38, "base": ["2026-10-16", "2026-10-22"], "real": ["2026-10-16", "2026-10-22"], "diferencia": 0 },
    { "grupo": "Dique", "nombre": "Salida del astillero", "estado": "No Iniciado", "duracion": 0, "base": ["2026-11-23", "2026-11-23"], "real": ["2026-11-23", "2026-11-23"], "diferencia": 0 },
    { "grupo": "Post Dique", "nombre": "Traslado a Panama", "estado": "No Iniciado", "duracion": 3, "base": ["2026-11-23", "2026-11-25"], "real": ["2026-11-23", "2026-11-25"], "diferencia": 0 },
    { "grupo": "Post Dique", "nombre": "POST-DIQUE (Ejecución)", "estado": "No Iniciado", "duracion": 6, "base": ["2026-11-25", "2026-11-30"], "real": ["2026-11-25", "2026-11-30"], "diferencia": 0 },
    { "grupo": "Post Dique", "nombre": "On Hire", "estado": "No Iniciado", "duracion": 0, "base": ["2026-12-01", "2026-12-01"], "real": ["2026-12-01", "2026-12-01"], "diferencia": 0 },
    { "grupo": "Cierre", "nombre": "Revisión de información", "estado": "No Iniciado", "duracion": null, "base": null, "real": null, "diferencia": null },
    { "grupo": "Cierre", "nombre": "Presentación de Informe Final", "estado": "No Iniciado", "duracion": null, "base": null, "real": null, "diferencia": null }
  ],
  "avance": {
    "total":      { "lineas": 171, "conDuracion": 0, "duracion": 0, "avanceDias": 0 },
    "ingenieria": { "lineas": 142, "conDuracion": 0, "duracion": 0, "avanceDias": 0 },
    "cubierta":   { "lineas": 19,  "conDuracion": 0, "duracion": 0, "avanceDias": 0 },
    "tecnico":    { "lineas": 10,  "conDuracion": 0, "duracion": 0, "avanceDias": 0 }
  }
};
