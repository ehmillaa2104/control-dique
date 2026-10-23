/*
 * REGISTRO SEMANAL DEL DIQUE: fotos, videos y avance reportado en sitio. Se edita a mano (no viene de Monday).
 *   semanas: una por semana, la más reciente primero. En pantalla se muestran solo las fechas; "semana" sigue la numeración de "Participación del equipo" (5 = 23 oct).
 *     avance: lo que reporta el superintendente, agrupado por zona. Sin nombres de personas (el sitio es público).
 *     medios: fotos y videos en registro/sN/. Foto: archivo grande (máx. 1600 px, sin metadatos) + "-min.jpg" (480 px).
 */
window.DIQUE_REGISTRO = {
  "semanas": [
    {
      "semana": 5,
      "desde": "2026-10-17",
      "hasta": "2026-10-23",
      "fuente": "Reporte del superintendente e informe diario de máquinas, 23 oct",
      "avance": [
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
          { "txt": "Válvulas de agua salada: identificadas y marcadas para mantenimiento, con las 2 de proa (cuarto del Bow Thruster)", "extra": "10 %" },
          { "txt": "Bomba auxiliar de agua fresca de la máquina principal: desmontada para reparar el alojamiento del sello mecánico", "extra": "20 %" },
          { "txt": "Bomba #1 de alimentación de diésel de la máquina principal: desmontada para revisar una leve fuga por el sello", "extra": "20 %" },
          { "txt": "Motor eléctrico del Bow Thruster: desmontado para reemplazar la araña de acople", "extra": "50 %" }
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
        { "tipo": "foto", "archivo": "registro/s5/09-valvulas-agua-salada.jpg", "texto": "Sala de máquinas: válvulas de agua salada marcadas para mantenimiento" },
        { "tipo": "foto", "archivo": "registro/s5/10-bomba-agua-fresca.jpg", "texto": "Bomba auxiliar de agua fresca desmontada (sello mecánico)" },
        { "tipo": "foto", "archivo": "registro/s5/11-bomba-diesel.jpg", "texto": "Bomba #1 de alimentación de diésel desmontada (fuga por el sello)" },
        { "tipo": "foto", "archivo": "registro/s5/12-motor-bow-thruster.jpg", "texto": "Motor eléctrico del Bow Thruster en desmontaje" },
        { "tipo": "foto", "archivo": "registro/s5/13-arana-de-acople.jpg", "texto": "Araña de acople del motor del Bow Thruster, a reemplazar" }
      ]
    }
  ]
};
