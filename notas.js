/*
 * NOTAS DE GESTIÓN: lo que no está (todavía) en Monday y se quiere mostrar en el dashboard.
 * Se edita a mano. Cuando el dato exista en Monday, conviene borrarlo de aquí.
 *   revision["<trabajo>"]: nota de un trabajo en revisión (p. ej. el astillero).
 *   presupuesto.estado: se muestra en "En revisión".
 *     Si en el tablero CC algún centro tiene Estado Aprobación = "Revisar", el dashboard lo muestra igual, sin esta nota.
 *   entrega["S5"]: estado de la entrega de información semanal de una semana ("Completa" / "Parcial" / "Pendiente"), cuando
 *     todavía no está cargado en el tablero Participación del Equipo. Un texto vale para todos; un objeto, por equipo.
 *     La última semana con nota es la que muestra el indicador.
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
    "13455695886": "2026-11-16",  // Paro por Independencia de Cartagena: ocurre el 16 nov, se registró el 3 nov (aún no cuenta)
    "13508287294": "2026-11-06",  // Medio día perdido por lluvia: ocurrió el viernes 6 nov, se registró el 9 nov
    "13508325126": "2026-11-07",  // Día perdido por lluvia: ocurrió el sábado 7 nov, se registró el 9 nov
    "13508891609": "2026-11-12",  // Medio día por jornada corta (hasta 11:30): ocurre el jueves 12, se registró el 9 nov
    "13508936157": "2026-11-13"   // Día por cierre del astillero: ocurre el viernes 13, se registró el 9 nov
  },
  // 23 oct: todos los departamentos entregaron la información de la Semana 5 (indicación del usuario).
  // En Monday la columna "Act. S5" aún no tiene la opción "Completa"; borrar esta nota cuando se cargue allí.
  // 4 nov: Ingeniería, Cubierta y Seguridad en Pendiente (indicación del usuario); Técnico y Contabilidad siguen en Completa.
  // 6 nov: Ingeniería pasa a Completa, subió su informe del 6 nov a Monday (indicación del usuario).
  // 7 nov: Ingeniería sigue en Completa (subió también su informe del 7 nov) y Contabilidad pasa a Pendiente (indicación del usuario).
  // 9 nov: Semana 8, Ingeniería en Completa (subió su informe del 9 nov; indicación del usuario). Los demás, sin cargar = Pendiente.
  // 9 nov (después): Semana 8 con todos en Completa menos Cubierta y Contabilidad, en Pendiente (indicación del usuario).
  // 9 nov (más tarde): Cubierta también pasa a Completa en la Semana 8; solo Contabilidad queda en Pendiente (indicación del usuario).
  "entrega": {
    "S5": "Completa",
    "S7": { "Ingeniería": "Completa", "Cubierta": "Pendiente", "Seguridad": "Pendiente", "Técnico": "Completa", "Contabilidad": "Pendiente" },
    "S8": { "Ingeniería": "Completa", "Cubierta": "Completa", "Seguridad": "Completa", "Técnico": "Completa", "Contabilidad": "Pendiente" }
  }
};
