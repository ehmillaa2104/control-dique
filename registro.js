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
      "fuente": "Reporte del superintendente, 23 oct",
      "avance": [
        { "zona": "Casco", "items": [
          { "txt": "Estribor: aceros marcados", "extra": "se empezó a cortar" },
          { "txt": "Babor: acero marcado" }
        ] },
        { "zona": "Tanques de carga", "items": [
          { "txt": "1P, 1S, 5P y 5S: aceros marcados", "extra": "corte iniciado en 5P" },
          { "txt": "2P, 2S, 3P, 3S y Deep Tank: acero en definición" },
          { "txt": "Andamios en armado en todos los tanques de carga" }
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
        { "tipo": "foto", "archivo": "registro/s5/08-refuerzos-internos.jpg", "texto": "Refuerzos internos a la vista durante el reemplazo" }
      ]
    }
  ]
};
