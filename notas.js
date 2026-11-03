/*
 * NOTAS DE GESTIÓN: lo que no está (todavía) en Monday y se quiere mostrar en el dashboard.
 * Se edita a mano. Cuando el dato exista en Monday, conviene borrarlo de aquí.
 *   revision["<trabajo>"]: nota de un trabajo en revisión (p. ej. el astillero).
 *   presupuesto.estado: se muestra en "En revisión".
 *     Si en el tablero CC algún centro tiene Estado Aprobación = "Revisar", el dashboard lo muestra igual, sin esta nota.
 *   entrega["S5"]: estado de la entrega de información semanal de una semana para todos los departamentos
 *     ("Completa" / "Parcial"), cuando todavía no está cargado en el tablero Participación del Equipo.
 */
// 16 oct: se quita la nota "Dirección solicitó cambios" (14 oct). Dirección ya aprobó por trabajo en Monday
// (columna Estado Aprobación = "Aprobado Dirección"), así que el estado sale de Monday.
window.DIQUE_NOTAS = {
  // Notas sobre trabajos en revisión, por nombre del trabajo en Monday. Se muestran en "En revisión",
  // en el centro de costo y junto al trabajo. Se borran cuando el monto deja de estar en revisión.
  "revision": {
    // 27 oct: el Astillero pasó a Aprobado en Monday (US$ 766,482); se borra su nota de revisión
  },
  // Totales del resumen que Monday todavía no trae (indicación del usuario, 30 oct). Borrar cuando estén en Monday.
  // 3 nov: "pagado" pasa a 192.352,11, el total "Paid In Full" del reporte contable al 31 oct.
  // "po" sigue siendo el del archivo del 30 oct: el reporte del 31 oct ya no trae la hoja de órdenes de compra.
  "montos": {
    "po": 96899,
    "pagado": 192352.11
  },
  // Fecha real de un imprevisto cuando se registró otro día en Monday (id del elemento en Cambios/Imprevistos → AAAA-MM-DD).
  // Borrar cuando Monday tenga una columna con la fecha del evento.
  "fechaImprevisto": {
    "13398896309": "2026-10-24",  // Pérdida de día por lluvia: ocurrió el 24 oct, se registró el 27 oct
    "13455614931": "2026-11-02",  // Pérdida de día por festivo (Todos los Santos): ocurrió el 2 nov, se registró el 3 nov
    "13455695886": "2026-11-16"   // Paro por Independencia de Cartagena: ocurre el 16 nov, se registró el 3 nov (aún no cuenta)
  },
  // 23 oct: todos los departamentos entregaron la información de la Semana 5 (indicación del usuario).
  // En Monday la columna "Act. S5" aún no tiene la opción "Completa"; borrar esta nota cuando se cargue allí.
  "entrega": {
    "S5": "Completa"
  }
};
