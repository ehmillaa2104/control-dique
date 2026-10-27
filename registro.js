/*
 * REGISTRO SEMANAL DEL DIQUE: fotos, videos y avance reportado en sitio. Se edita a mano (no viene de Monday).
 *   semanas: una por semana, la más reciente primero. En pantalla se muestran solo las fechas; "semana" sigue la numeración de "Participación del equipo" (5 = 23 oct).
 *     avance: lo que reporta el superintendente, agrupado por zona. Sin nombres de personas (el sitio es público).
 *     medios: fotos y videos en registro/sN/. Foto: archivo grande (máx. 1600 px, sin metadatos) + "-min.jpg" (480 px).
 *       "grupo" (opcional): agrupa los medios bajo un subtítulo (p. ej. un tanque), en el orden en que aparecen.
 */
window.DIQUE_REGISTRO = {
  "semanas": [
    {
      "semana": 6,
      "desde": "2026-10-24",
      "hasta": "2026-10-30",
      "fuente": "Reporte del superintendente (27 oct), informe diario de Ingeniería (27 oct) y mensajes del equipo en Monday (26 y 27 oct)",
      "avance": [
        { "zona": "Temas importantes", "items": [
          { "txt": "Presupuesto aprobado: US$ 1.08 M", "extra": "27 oct" },
          { "txt": "1 día perdido por lluvia", "extra": "24 oct" }
        ] },
        { "zona": "Tanques de carga", "items": [
          { "txt": "Alcance de acero cerrado: 8 tanques llevan acero", "extra": "4P y 4S no llevan" },
          { "txt": "1P, 1S, 3S y 5P: corte de acero en ejecución", "extra": "en 1S ya hay una plancha nueva soldada" },
          { "txt": "2S y 5S: andamios armados", "extra": "corte desde la tarde del 27 oct" },
          { "txt": "2P: andamios en armado", "extra": "corte desde el 28 oct" },
          { "txt": "3P: inicia el armado de andamios; acero por marcar" }
        ] },
        { "zona": "Medición de espesores", "items": [
          { "txt": "Lecturas mínimas: 4.6 mm en 1S, 4.7 mm en 2S y 4.9 mm en 1P y 5S" }
        ] },
        { "zona": "Sala de máquinas", "items": [
          { "txt": "Eje de cola: inician los trabajos", "extra": "26 oct" },
          { "txt": "Bomba hidráulica del timón de babor desmontada para cambiar retenedoras" },
          { "txt": "Repetidores del ángulo de timón: instalación en ambas bandas" },
          { "txt": "Botella de aire #1: válvula de seguridad desmontada para pruebas y certificación" },
          { "txt": "Acople Vulkan de la máquina principal inspeccionado: en buen estado" },
          { "txt": "Auxiliar #1: fugas de aceite y combustible corregidas" }
        ] },
        { "zona": "Seguridad", "items": [
          { "txt": "Bote salvavidas: se busca proveedor para asegurarlo al davit y reparar el casco" },
          { "txt": "Speed Log: en cotización, faltan proveedores con repuestos" }
        ] }
      ],
      "medios": [
        { "tipo": "foto", "archivo": "registro/s6/t1s_01_manhole-ifo-1s-permiso.jpg", "texto": "Manhole IFO 1S con permiso de espacio confinado", "grupo": "Tanque 1 estribor · IFO 1S · corte en ejecución" },
        { "tipo": "foto", "archivo": "registro/s6/t1s_02_andamio-lecturas-ventana.jpg", "texto": "Andamio interior en dos niveles; lecturas de 4.6 a 10.0 mm y ventana ya cortada", "grupo": "Tanque 1 estribor · IFO 1S · corte en ejecución" },
        { "tipo": "foto", "archivo": "registro/s6/t1s_03_plancha-nueva-soldada-ref-10.3-11.3.jpg", "texto": "Plancha nueva ya soldada (inserto gris claro)", "grupo": "Tanque 1 estribor · IFO 1S · corte en ejecución" },
        { "tipo": "foto", "archivo": "registro/s6/t2p_01_manhole-mgo-2p-permiso.jpg", "texto": "Manhole MGO 2P con permiso de espacio confinado", "grupo": "Tanque 2 babor · MGO 2P · corte desde el 28 oct" },
        { "tipo": "foto", "archivo": "registro/s6/t2p_02_inserto-anterior-lecturas.jpg", "texto": "Inserto de una reparación anterior; lecturas alrededor de 5.0–8.2 mm", "grupo": "Tanque 2 babor · MGO 2P · corte desde el 28 oct" },
        { "tipo": "foto", "archivo": "registro/s6/t2p_03_insertos-multiples-serpentines.jpg", "texto": "Varios insertos antiguos y serpentines en el piso; lecturas de 5.0 a 9.6 mm", "grupo": "Tanque 2 babor · MGO 2P · corte desde el 28 oct" },
        { "tipo": "foto", "archivo": "registro/s6/t2s_01_manhole-mgo-2s.jpg", "texto": "Manhole MGO 2S", "grupo": "Tanque 2 estribor · MGO 2S · corte desde la tarde del 27 oct" },
        { "tipo": "foto", "archivo": "registro/s6/t2s_02_andamio-tres-niveles.jpg", "texto": "Andamio en tres niveles; lecturas de 4.7 a 10.0 mm", "grupo": "Tanque 2 estribor · MGO 2S · corte desde la tarde del 27 oct" },
        { "tipo": "foto", "archivo": "registro/s6/t3p_01_manhole-ifo-3p-linea-foam.jpg", "texto": "Manhole IFO 3P abierto; la línea de foam pasa al lado", "grupo": "Tanque 3 babor · IFO 3P · armado de andamios" },
        { "tipo": "foto", "archivo": "registro/s6/t3p_02_interior-serpentines-escalera.jpg", "texto": "Interior visto desde el manhole: serpentines de calefacción y escalera", "grupo": "Tanque 3 babor · IFO 3P · armado de andamios" },
        { "tipo": "foto", "archivo": "registro/s6/t3s_01_corte-en-ejecucion-pares-nominal.jpg", "texto": "Corte de acero en ejecución entre refuerzos", "grupo": "Tanque 3 estribor · IFO 3S · corte en ejecución" },
        { "tipo": "foto", "archivo": "registro/s6/t3s_02_ranura-en-cubierta-ventiladores.jpg", "texto": "Ranura abierta en la cubierta principal, con ventiladores", "grupo": "Tanque 3 estribor · IFO 3S · corte en ejecución" },
        { "tipo": "foto", "archivo": "registro/s6/t3s_03_manhole-ifo-3s-permiso.jpg", "texto": "Manhole IFO 3S con permiso de espacio confinado", "grupo": "Tanque 3 estribor · IFO 3S · corte en ejecución" },
        { "tipo": "foto", "archivo": "registro/s6/t5p_01_manhole-ifo-5p.jpg", "texto": "Manhole IFO 5P con permiso de espacio confinado", "grupo": "Tanque 5 babor · IFO 5P · corte en ejecución" },
        { "tipo": "foto", "archivo": "registro/s6/t5p_02_andamio-secciones-retiradas.jpg", "texto": "Andamio con iluminación y ventilación; secciones de forro retiradas", "grupo": "Tanque 5 babor · IFO 5P · corte en ejecución" },
        { "tipo": "foto", "archivo": "registro/s6/t5p_03_andamio-tres-niveles-iluminacion.jpg", "texto": "Andamio en tres niveles con reflectores; lecturas de 7.5 a 9.0 mm", "grupo": "Tanque 5 babor · IFO 5P · corte en ejecución" },
        { "tipo": "foto", "archivo": "registro/s6/t5p_04_zona-alta-abertura-cubierta.jpg", "texto": "Zona alta del tanque (10.0–10.3 mm) y abertura en la cubierta", "grupo": "Tanque 5 babor · IFO 5P · corte en ejecución" },
        { "tipo": "foto", "archivo": "registro/s6/t5s_01_manhole-ifo-5s-permiso.jpg", "texto": "Manhole IFO 5S con permiso de espacio confinado", "grupo": "Tanque 5 estribor · IFO 5S · corte desde la tarde del 27 oct" },
        { "tipo": "foto", "archivo": "registro/s6/t5s_02_andamio-lecturas.jpg", "texto": "Andamio en tres niveles; lecturas de 5.4 a 8.7 mm en la zona alta", "grupo": "Tanque 5 estribor · IFO 5S · corte desde la tarde del 27 oct" },
        { "tipo": "foto", "archivo": "registro/s6/t5s_03_recuadros-marcados-tiza.jpg", "texto": "Recuadros marcados con tiza para renovación; lecturas de 5.0 a 6.9 mm", "grupo": "Tanque 5 estribor · IFO 5S · corte desde la tarde del 27 oct" },
        { "tipo": "foto", "archivo": "registro/s6/t5s_04_area-triangular-minimos.jpg", "texto": "Área triangular marcada con los mínimos del tanque: 4.9–5.3 mm", "grupo": "Tanque 5 estribor · IFO 5S · corte desde la tarde del 27 oct" },
        { "tipo": "foto", "archivo": "registro/s6/maq_01_eje-de-cola.jpg", "texto": "Eje de cola: inicio de los trabajos", "grupo": "Sala de máquinas · Ingeniería, 26 y 27 oct" },
        { "tipo": "foto", "archivo": "registro/s6/maq_02_eje-de-cola-acople.jpg", "texto": "Acople del eje de cola", "grupo": "Sala de máquinas · Ingeniería, 26 y 27 oct" },
        { "tipo": "foto", "archivo": "registro/s6/maq_03_motor-bomba-timon-babor.jpg", "texto": "Motor de la bomba hidráulica del timón de babor, desmontado", "grupo": "Sala de máquinas · Ingeniería, 26 y 27 oct" },
        { "tipo": "foto", "archivo": "registro/s6/maq_04_bomba-timon-babor.jpg", "texto": "Bomba hidráulica del timón de babor, sin retenedoras", "grupo": "Sala de máquinas · Ingeniería, 26 y 27 oct" },
        { "tipo": "foto", "archivo": "registro/s6/maq_05_repetidor-angulo-timon.jpg", "texto": "Repetidor del ángulo de timón", "grupo": "Sala de máquinas · Ingeniería, 26 y 27 oct" },
        { "tipo": "video", "archivo": "registro/s6/maq_video-repetidor-angulo-timon.mp4", "texto": "Repetidor del ángulo de timón funcionando", "grupo": "Sala de máquinas · Ingeniería, 26 y 27 oct" },
        { "tipo": "foto", "archivo": "registro/s6/maq_06_botella-de-aire-1.jpg", "texto": "Botella de aire #1", "grupo": "Sala de máquinas · Ingeniería, 26 y 27 oct" },
        { "tipo": "foto", "archivo": "registro/s6/maq_07_valvula-seguridad-botella.jpg", "texto": "Válvula de seguridad de la botella de aire", "grupo": "Sala de máquinas · Ingeniería, 26 y 27 oct" },
        { "tipo": "foto", "archivo": "registro/s6/maq_08_acople-vulkan.jpg", "texto": "Acople Vulkan de la máquina principal", "grupo": "Sala de máquinas · Ingeniería, 26 y 27 oct" },
        { "tipo": "foto", "archivo": "registro/s6/maq_09_auxiliar-1.jpg", "texto": "Auxiliar #1: fugas corregidas", "grupo": "Sala de máquinas · Ingeniería, 26 y 27 oct" }
      ]
    },
    {
      "semana": 5,
      "desde": "2026-10-17",
      "hasta": "2026-10-23",
      "fuente": "Reporte del superintendente e informe diario de máquinas, 23 oct",
      "avance": [
        { "zona": "Temas importantes", "items": [
          { "txt": "Entrada al muelle del astillero", "extra": "20 oct" }
        ] },
        { "zona": "Casco", "items": [
          { "txt": "Estribor: aceros marcados", "extra": "se empezó a cortar" },
          { "txt": "Babor: acero marcado" }
        ] },
        { "zona": "Tanques de carga", "items": [
          { "txt": "1P, 1S, 5P y 5S: aceros marcados", "extra": "corte iniciado en 5P" },
          { "txt": "2P, 2S, 3P, 3S y Deep Tank: acero en definición" },
          { "txt": "Andamios en armado en todos los tanques de carga" }
        ] },
        { "zona": "Sala de máquinas", "items": [
          { "txt": "Válvulas de agua salada marcadas" },
          { "txt": "Bomba de agua fresca desmontada" },
          { "txt": "Bomba #1 de diésel desmontada" },
          { "txt": "Motor del Bow Thruster desmontado" }
        ] }
      ],
      "medios": [
        { "tipo": "foto", "archivo": "registro/s5/01-buque-en-muelle.jpg", "texto": "Kelly Trader atracado en el muelle del astillero" },
        { "tipo": "foto", "archivo": "registro/s5/02-medicion-espesores.jpg", "texto": "Medición de espesores: lecturas en mm marcadas sobre la plancha" },
        { "tipo": "video", "archivo": "registro/s5/video-1.mp4", "texto": "Recorrido dentro de un tanque: lecturas de espesor y planchas marcadas" },
        { "tipo": "foto", "archivo": "registro/s5/03-plancha-marcada.jpg", "texto": "Plancha del costado marcada para reemplazo, junto a la marca de francobordo" },
        { "tipo": "foto", "archivo": "registro/s5/04-segunda-plancha-marcada.jpg", "texto": "Segunda plancha del costado marcada para reemplazo" },
        { "tipo": "video", "archivo": "registro/s5/video-2.mp4", "texto": "Detalle de acero marcado con sus medidas" },
        { "tipo": "foto", "archivo": "registro/s5/05-plancha-cortada.jpg", "texto": "Plancha cortada: estructura interna expuesta" },
        { "tipo": "foto", "archivo": "registro/s5/06-inspeccion-aberturas.jpg", "texto": "Inspección de las aberturas del costado" },
        { "tipo": "foto", "archivo": "registro/s5/07-corte-desde-andamio.jpg", "texto": "Corte y reemplazo de planchas desde el andamio" },
        { "tipo": "foto", "archivo": "registro/s5/08-refuerzos-internos.jpg", "texto": "Refuerzos internos a la vista durante el reemplazo" },
        { "tipo": "foto", "archivo": "registro/s5/09-valvulas-agua-salada.jpg", "texto": "Válvulas de agua salada" },
        { "tipo": "foto", "archivo": "registro/s5/10-bomba-agua-fresca.jpg", "texto": "Bomba de agua fresca" },
        { "tipo": "foto", "archivo": "registro/s5/11-bomba-diesel.jpg", "texto": "Bomba #1 de diésel" },
        { "tipo": "foto", "archivo": "registro/s5/12-motor-bow-thruster.jpg", "texto": "Motor del Bow Thruster" },
        { "tipo": "foto", "archivo": "registro/s5/13-arana-de-acople.jpg", "texto": "Araña de acople" },
        { "tipo": "foto", "archivo": "registro/s5/t1p_01_manhole-ifo-1p.jpg", "texto": "Manhole del tanque IFO 1P abierto", "grupo": "Tanque 1 babor · IFO 1P" },
        { "tipo": "foto", "archivo": "registro/s5/t1p_02_lecturas-mamparo-ct1p.jpg", "texto": "Mamparo con lecturas de espesor: 5.0–6.1 mm arriba y 9.0–9.2 mm abajo; las flechas marcan la línea de corte", "grupo": "Tanque 1 babor · IFO 1P" },
        { "tipo": "foto", "archivo": "registro/s5/t1p_03_lecturas-forro-costura.jpg", "texto": "Forro: 6.5–8.2 mm sobre la costura y 8.8–9.2 mm debajo", "grupo": "Tanque 1 babor · IFO 1P" },
        { "tipo": "foto", "archivo": "registro/s5/t1p_04_ventanas-cortadas-serpentines.jpg", "texto": "Ventanas ya cortadas en el forro; serpentines de calefacción bajo la zona de corte", "grupo": "Tanque 1 babor · IFO 1P" }
      ]
    }
  ]
};
