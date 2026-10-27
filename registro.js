/*
 * REGISTRO SEMANAL DEL DIQUE: fotos, videos y avance reportado en sitio. Se edita a mano (no viene de Monday).
 *   semanas: una por semana, la más reciente primero. En pantalla se muestran solo las fechas; "semana" sigue la numeración de "Participación del equipo" (5 = 23 oct).
 *     avance: lo que reporta el superintendente, agrupado por zona. Sin nombres de personas (el sitio es público).
 *     medios: fotos y videos en registro/sN/. Foto: archivo grande (máx. 1600 px, sin metadatos) + "-min.jpg" (480 px).
 */
window.DIQUE_REGISTRO = {
  "semanas": [
    {
      "semana": 6,
      "desde": "2026-10-24",
      "hasta": "2026-10-30",
      "fuente": "Mensajes del equipo en Monday, 26 y 27 oct",
      "avance": [
        { "zona": "Tanques de carga", "items": [
          { "txt": "1P, 1S, 2S, 3S, 5P y 5S: andamios armados", "extra": "corte de acero en curso" },
          { "txt": "2P: andamios en armado", "extra": "corte desde el 28 oct" },
          { "txt": "3P: inicia el armado de andamios" },
          { "txt": "4P y 4S: no llevan acero (confirmado en campo)" }
        ] },
        { "zona": "Seguridad", "items": [
          { "txt": "Bote salvavidas: se busca proveedor para asegurarlo al davit y reparar el casco" },
          { "txt": "Speed Log: en cotización, faltan proveedores con repuestos" }
        ] }
      ],
      "medios": []
    },
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
        { "tipo": "foto", "archivo": "registro/s5/13-arana-de-acople.jpg", "texto": "Araña de acople" }
      ]
    }
  ]
};
