/*
 * NOTAS DE GESTIÓN: lo que no está (todavía) en Monday y se quiere mostrar en el dashboard.
 * Se edita a mano. Cuando el dato exista en Monday, conviene borrarlo de aquí.
 *   revision["<trabajo>"]: nota de un trabajo en revisión (p. ej. el astillero).
 *   presupuesto.estado: se muestra en "En revisión".
 *     Si en el tablero CC algún centro tiene Estado Aprobación = "Revisar", el dashboard lo muestra igual, sin esta nota.
 */
// 16 oct: se quita la nota "Dirección solicitó cambios" (14 oct). Dirección ya aprobó por trabajo en Monday
// (columna Estado Aprobación = "Aprobado Dirección"), así que el estado sale de Monday.
window.DIQUE_NOTAS = {
  // Notas sobre trabajos en revisión, por nombre del trabajo en Monday. Se muestran en "En revisión",
  // en el centro de costo y junto al trabajo. Se borran cuando el monto deja de estar en revisión.
  "revision": {
    "Astillero": "en revisión de propuesta"
  }
};
