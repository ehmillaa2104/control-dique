/*
 * REGISTRO SEMANAL DEL DIQUE: fotos, videos y avance reportado en sitio. Se edita a mano (no viene de Monday).
 *   semanas: una por semana, de lunes a sábado (desde el 31 oct), la más reciente primero. Una semana nueva se agrega solo
 *     cuando el usuario pide actualizarla (con fotos); mientras tanto el dashboard sigue mostrando la última cargada. En pantalla se muestran solo las fechas; "semana" sigue la numeración de "Participación del equipo" (5 = 23 oct).
 *     avance: lo que reporta el superintendente, agrupado por zona. Sin nombres de personas (el sitio es público).
 *     medios: fotos y videos en registro/sN/. Foto: archivo grande (máx. 1600 px, sin metadatos) + "-min.jpg" (480 px).
 *       "grupo" (opcional): agrupa los medios bajo un subtítulo (p. ej. un tanque), en el orden en que aparecen.
 *     Orden dentro de cada semana: lo más reciente primero, tanto en avance como en medios. Lo nuevo se agrega arriba, no al final.
 */
window.DIQUE_REGISTRO = {
  "semanas": [
    {
      "semana": 6,
      "desde": "2026-10-26",
      "hasta": "2026-10-31",
      "fuente": "Reporte del superintendente (27 y 30 oct), informes diarios de Ingeniería (27, 28 y 29 oct) y mensajes del equipo en Monday (26 al 30 oct)",
      "avance": [
        { "zona": "Temas importantes", "items": [
          { "txt": "Presupuesto aprobado: US$ 1.08 M", "extra": "27 oct" }
        ] },
        { "zona": "Casco", "items": [
          { "txt": "Caracoleo y lavado 1 a presión", "extra": "30 oct" }
        ] },
        { "zona": "Tanques de carga", "items": [
          { "txt": "Corte de acero reportado: 5S 60 %, 1P y 5P 40 %, 2S 35 %, 1S 25 %, 3S 20 %", "extra": "30 oct" },
          { "txt": "5S: ya se colocan láminas nuevas", "extra": "primer tanque que repone acero" },
          { "txt": "2P y 3P: andamios y mediciones terminados; corte sin iniciar", "extra": "30 oct" },
          { "txt": "El criterio de renovación va marcado sobre la plancha: SALE / NO SALE", "extra": "30 oct" },
          { "txt": "Alcance de acero cerrado: 8 tanques llevan acero", "extra": "4P y 4S no llevan" }
        ] },
        { "zona": "Sala de máquinas", "items": [
          { "txt": "Bombas hidráulicas del timón: estribor con retenedoras nuevas, falta la prueba; babor a la espera de retenedoras", "extra": "29 oct" },
          { "txt": "Indicador de ángulo de timón: cableado nuevo del puente al servomotor e indicador local instalado", "extra": "29 oct" },
          { "txt": "Bomba de sentina del cuarto de máquinas: bomba nueva en su base", "extra": "29 oct" },
          { "txt": "Bomba de sewage desmontada para reparación" },
          { "txt": "Tanque 5 babor: se desarma la succión de la bomba de carga" },
          { "txt": "Bomba #1 de diésel de la máquina principal: sello mecánico y balinera nuevos", "extra": "terminado" },
          { "txt": "Auxiliares: fugas corregidas en el #1 y en el de emergencia; tubería del enfriador cambiada en el #2; polea y base del ventilador nuevas en el de emergencia" },
          { "txt": "Panel de alarma 95-98 %: el contratista cotizó la instalación", "extra": "se espera el costo" },
          { "txt": "Botella de aire #1: válvula de seguridad desmontada para pruebas y certificación", "extra": "terminado" },
          { "txt": "Acoples Vulkan de la máquina principal y del generador de cola inspeccionados: en buen estado" },
          { "txt": "Eje de cola: inician los trabajos", "extra": "26 oct" },
          { "txt": "Bow Thruster: fuga externa de aceite en el núcleo", "extra": "26 oct" }
        ] },
        { "zona": "Medición de espesores", "items": [
          { "txt": "Lecturas mínimas: 4.6 mm en 1S, 4.7 mm en 2S y 4.9 mm en 1P y 5S", "extra": "27 oct" }
        ] },
        { "zona": "Seguridad", "items": [
          { "txt": "Bote salvavidas: se busca proveedor para asegurarlo al davit y reparar el casco", "extra": "26 oct" },
          { "txt": "Speed Log: en cotización, faltan proveedores con repuestos" }
        ] }
      ],
      "medios": [
        { "tipo": "foto", "archivo": "registro/s6/a30_casco_01_lavado-proa.jpg", "texto": "Lavado a presión del casco hacia la proa", "grupo": "Casco · caracoleo y lavado a presión · 30 oct" },
        { "tipo": "foto", "archivo": "registro/s6/a30_casco_02_lavado-costado.jpg", "texto": "Lavado a presión del costado desde el piso, con andamio móvil", "grupo": "Casco · caracoleo y lavado a presión · 30 oct" },
        { "tipo": "foto", "archivo": "registro/s6/a30_casco_03_lavado-detalle.jpg", "texto": "Detalle del lavado en la parte baja del costado", "grupo": "Casco · caracoleo y lavado a presión · 30 oct" },
        { "tipo": "foto", "archivo": "registro/s6/a30_casco_04_manometro-1.jpg", "texto": "Manómetro de una bomba de lavado: cerca de 5000 psi (unos 340 bar)", "grupo": "Casco · caracoleo y lavado a presión · 30 oct" },
        { "tipo": "foto", "archivo": "registro/s6/a30_casco_05_manometro-2.jpg", "texto": "Manómetro de otra bomba de lavado: cerca de 5000 psi (unos 340 bar)", "grupo": "Casco · caracoleo y lavado a presión · 30 oct" },
        { "tipo": "foto", "archivo": "registro/s6/a30_t1p_01_manhole-ifo-1p.jpg", "texto": "Manhole IFO 1P abierto", "grupo": "Tanque 1 babor · IFO 1P · 40 % de corte · 30 oct" },
        { "tipo": "foto", "archivo": "registro/s6/a30_t1p_02_corte-abierto-lecturas.jpg", "texto": "Corte abierto en el forro, con luz del día al fondo; lecturas de 6.3 a 9.9 mm", "grupo": "Tanque 1 babor · IFO 1P · 40 % de corte · 30 oct" },
        { "tipo": "foto", "archivo": "registro/s6/a30_t1p_03_secciones-retiradas.jpg", "texto": "Secciones de forro ya retiradas entre refuerzos, con ventilación forzada", "grupo": "Tanque 1 babor · IFO 1P · 40 % de corte · 30 oct" },
        { "tipo": "foto", "archivo": "registro/s6/a30_t1p_04_andamio-tres-niveles.jpg", "texto": "Andamio en tres niveles con iluminación, ventilador y arnés", "grupo": "Tanque 1 babor · IFO 1P · 40 % de corte · 30 oct" },
        { "tipo": "foto", "archivo": "registro/s6/a30_t1s_01_manhole-ifo-1s.jpg", "texto": "Manhole IFO 1S con permiso de espacio confinado", "grupo": "Tanque 1 estribor · IFO 1S · 25 % de corte · 30 oct" },
        { "tipo": "foto", "archivo": "registro/s6/a30_t1s_02_marca-no-sale.jpg", "texto": "Paño marcado “NO SALE” y recortes de plancha sobre el andamio; lecturas de 4.7 a 9.8 mm", "grupo": "Tanque 1 estribor · IFO 1S · 25 % de corte · 30 oct" },
        { "tipo": "foto", "archivo": "registro/s6/a30_t1s_03_andamio-plataformas.jpg", "texto": "Andamio armado junto al forro; lecturas de 7.2 a 9.2 mm", "grupo": "Tanque 1 estribor · IFO 1S · 25 % de corte · 30 oct" },
        { "tipo": "foto", "archivo": "registro/s6/a30_t1s_04_ventana-cortada.jpg", "texto": "Ventana cortada en el forro con el refuerzo a la vista; lecturas de 7.7 a 9.2 mm", "grupo": "Tanque 1 estribor · IFO 1S · 25 % de corte · 30 oct" },
        { "tipo": "foto", "archivo": "registro/s6/a30_t2s_01_manhole-mgo-2s.jpg", "texto": "Manhole MGO 2S abierto", "grupo": "Tanque 2 estribor · MGO 2S · 35 % de corte · 30 oct" },
        { "tipo": "foto", "archivo": "registro/s6/a30_t2s_02_recortes-sobre-andamio.jpg", "texto": "Recortes de plancha sobre las plataformas; entra luz del día por la abertura", "grupo": "Tanque 2 estribor · MGO 2S · 35 % de corte · 30 oct" },
        { "tipo": "foto", "archivo": "registro/s6/a30_t2s_03_forro-retirado.jpg", "texto": "Tramo de forro ya retirado en la zona alta; lecturas de 6.9 a 8.7 mm", "grupo": "Tanque 2 estribor · MGO 2S · 35 % de corte · 30 oct" },
        { "tipo": "foto", "archivo": "registro/s6/a30_t2s_04_andamio-cuatro-niveles.jpg", "texto": "Andamio en cuatro niveles con los recortes apilados", "grupo": "Tanque 2 estribor · MGO 2S · 35 % de corte · 30 oct" },
        { "tipo": "foto", "archivo": "registro/s6/a30_t2p_01_manhole-mgo-2p.jpg", "texto": "Manhole MGO 2P destapado, con permiso de espacio confinado", "grupo": "Tanque 2 babor · MGO 2P · corte sin iniciar · 30 oct" },
        { "tipo": "foto", "archivo": "registro/s6/a30_t2p_02_marca-sale.jpg", "texto": "Recuadro marcado “SALE”: el criterio de renovación queda escrito sobre la plancha; lecturas de 4.4 a 8.8 mm", "grupo": "Tanque 2 babor · MGO 2P · corte sin iniciar · 30 oct" },
        { "tipo": "foto", "archivo": "registro/s6/a30_t2p_03_marca-no-sale.jpg", "texto": "Al lado, un paño marcado “NO SALE”; lecturas de 5.1 a 9.9 mm", "grupo": "Tanque 2 babor · MGO 2P · corte sin iniciar · 30 oct" },
        { "tipo": "foto", "archivo": "registro/s6/a30_t2p_04_forro-medido.jpg", "texto": "Forro medido de punta a punta y andamio terminado; corte sin iniciar", "grupo": "Tanque 2 babor · MGO 2P · corte sin iniciar · 30 oct" },
        { "tipo": "foto", "archivo": "registro/s6/a30_t3p_01_manhole-ifo-3p.jpg", "texto": "Manhole IFO 3P abierto", "grupo": "Tanque 3 babor · IFO 3P · corte sin iniciar · 30 oct" },
        { "tipo": "foto", "archivo": "registro/s6/a30_t3p_02_entre-refuerzos.jpg", "texto": "Entre refuerzos: escama de óxido desprendida en el fondo", "grupo": "Tanque 3 babor · IFO 3P · corte sin iniciar · 30 oct" },
        { "tipo": "foto", "archivo": "registro/s6/a30_t3p_03_andamio-terminado.jpg", "texto": "Andamio terminado con escalera; serpentines de calefacción en el piso", "grupo": "Tanque 3 babor · IFO 3P · corte sin iniciar · 30 oct" },
        { "tipo": "foto", "archivo": "registro/s6/a30_t3p_04_forro-medido.jpg", "texto": "Forro medido (8.0–9.0 mm); corte sin iniciar", "grupo": "Tanque 3 babor · IFO 3P · corte sin iniciar · 30 oct" },
        { "tipo": "foto", "archivo": "registro/s6/a30_t3s_01_andamio-interior.jpg", "texto": "Andamio interior, con el aire todavía cargado por el corte", "grupo": "Tanque 3 estribor · 20 % de corte · 30 oct" },
        { "tipo": "foto", "archivo": "registro/s6/a30_t3s_02_lecturas-escalera.jpg", "texto": "Escalera del andamio; lecturas de 4.4 a 9.6 mm sobre el forro", "grupo": "Tanque 3 estribor · 20 % de corte · 30 oct" },
        { "tipo": "foto", "archivo": "registro/s6/a30_t3s_03_forro-medido.jpg", "texto": "Forro medido en toda la altura; lecturas de 5.9 a 8.7 mm", "grupo": "Tanque 3 estribor · 20 % de corte · 30 oct" },
        { "tipo": "foto", "archivo": "registro/s6/a30_t5p_01_manhole-ifo-5p.jpg", "texto": "Manhole IFO 5P con permiso de espacio confinado", "grupo": "Tanque 5 babor · IFO 5P · 40 % de corte · 30 oct" },
        { "tipo": "foto", "archivo": "registro/s6/a30_t5p_02_aberturas-zona-alta.jpg", "texto": "Aberturas en el forro; lecturas de 5.7 a 10.3 mm en la zona alta", "grupo": "Tanque 5 babor · IFO 5P · 40 % de corte · 30 oct" },
        { "tipo": "foto", "archivo": "registro/s6/a30_t5p_03_secciones-retiradas.jpg", "texto": "Secciones de forro retiradas entre refuerzos", "grupo": "Tanque 5 babor · IFO 5P · 40 % de corte · 30 oct" },
        { "tipo": "foto", "archivo": "registro/s6/a30_t5p_04_recortes-plataforma.jpg", "texto": "Recortes de plancha sobre la plataforma; lecturas de 7.9 a 10.2 mm", "grupo": "Tanque 5 babor · IFO 5P · 40 % de corte · 30 oct" },
        { "tipo": "foto", "archivo": "registro/s6/a30_t5s_01_manhole-ifo-5s.jpg", "texto": "Manhole IFO 5S con permiso de espacio confinado; equipo de rescate en cubierta", "grupo": "Tanque 5 estribor · IFO 5S · 60 % de corte · 30 oct" },
        { "tipo": "foto", "archivo": "registro/s6/a30_t5s_02_pano-soldado-ventana.jpg", "texto": "Paño ya soldado, con los cordones a la vista, junto a una ventana todavía abierta; lecturas de 7.4 a 9.3 mm", "grupo": "Tanque 5 estribor · IFO 5S · 60 % de corte · 30 oct" },
        { "tipo": "foto", "archivo": "registro/s6/a30_t5s_03_franja-retirada.jpg", "texto": "Franja baja del forro retirada y ventilación forzada en la plataforma; lecturas de 6.7 a 8.1 mm", "grupo": "Tanque 5 estribor · IFO 5S · 60 % de corte · 30 oct" },
        { "tipo": "foto", "archivo": "registro/s6/a30_t5s_04_seccion-cortada.jpg", "texto": "Sección cortada en la parte alta, vista desde el andamio", "grupo": "Tanque 5 estribor · IFO 5S · 60 % de corte · 30 oct" },
        { "tipo": "foto", "archivo": "registro/s6/maq_10_bomba-timon-estribor.jpg", "texto": "Bomba hidráulica del timón de estribor, con retenedoras nuevas", "grupo": "Sala de máquinas · Ingeniería, 28 y 29 oct" },
        { "tipo": "foto", "archivo": "registro/s6/maq_11_bomba-timon-babor-acople.jpg", "texto": "Bomba del timón de babor: acople y retenedora fuera", "grupo": "Sala de máquinas · Ingeniería, 28 y 29 oct" },
        { "tipo": "foto", "archivo": "registro/s6/maq_12_indicador-local-servomotor.jpg", "texto": "Indicador local de ángulo de timón en el cuarto de servomotor", "grupo": "Sala de máquinas · Ingeniería, 28 y 29 oct" },
        { "tipo": "foto", "archivo": "registro/s6/maq_13_indicador-puente.jpg", "texto": "Indicador de ángulo de timón en el puente", "grupo": "Sala de máquinas · Ingeniería, 28 y 29 oct" },
        { "tipo": "foto", "archivo": "registro/s6/maq_14_bomba-sentina-nueva.jpg", "texto": "Bomba de sentina nueva del cuarto de máquinas", "grupo": "Sala de máquinas · Ingeniería, 28 y 29 oct" },
        { "tipo": "foto", "archivo": "registro/s6/maq_15_bomba-sewage.jpg", "texto": "Bomba de sewage desmontada", "grupo": "Sala de máquinas · Ingeniería, 28 y 29 oct" },
        { "tipo": "foto", "archivo": "registro/s6/maq_16_tk5-babor-succion.jpg", "texto": "Succión de la bomba de carga del tanque 5 babor", "grupo": "Sala de máquinas · Ingeniería, 28 y 29 oct" },
        { "tipo": "foto", "archivo": "registro/s6/maq_17_acople-generador-de-cola.jpg", "texto": "Acople flexible del generador de cola", "grupo": "Sala de máquinas · Ingeniería, 28 y 29 oct" },
        { "tipo": "foto", "archivo": "registro/s6/maq_18_bomba-diesel-sello.jpg", "texto": "Bomba #1 de diésel: sello mecánico y balinera nuevos", "grupo": "Sala de máquinas · Ingeniería, 28 y 29 oct" },
        { "tipo": "foto", "archivo": "registro/s6/maq_19_auxiliar-emergencia.jpg", "texto": "Auxiliar de emergencia: fuga de aceite eliminada", "grupo": "Sala de máquinas · Ingeniería, 28 y 29 oct" },
        { "tipo": "foto", "archivo": "registro/s6/maq_20_auxiliar-emergencia-polea.jpg", "texto": "Auxiliar de emergencia: polea y base del ventilador nuevas", "grupo": "Sala de máquinas · Ingeniería, 28 y 29 oct" },
        { "tipo": "foto", "archivo": "registro/s6/maq_21_auxiliar-2-tuberia.jpg", "texto": "Auxiliar #2: tramo de tubería del enfriador cambiado", "grupo": "Sala de máquinas · Ingeniería, 28 y 29 oct" },
        { "tipo": "foto", "archivo": "registro/s6/maq_22_panel-alarma.jpg", "texto": "Panel de alarma 95-98 %", "grupo": "Sala de máquinas · Ingeniería, 28 y 29 oct" },
        { "tipo": "foto", "archivo": "registro/s6/maq_23_bow-thruster-nucleo.jpg", "texto": "Bow Thruster: fuga de aceite en el núcleo", "grupo": "Sala de máquinas · Ingeniería, 28 y 29 oct" },
        { "tipo": "foto", "archivo": "registro/s6/t1s_01_manhole-ifo-1s-permiso.jpg", "texto": "Manhole IFO 1S con permiso de espacio confinado", "grupo": "Tanque 1 estribor · IFO 1S · corte en ejecución · 27 oct" },
        { "tipo": "foto", "archivo": "registro/s6/t1s_02_andamio-lecturas-ventana.jpg", "texto": "Andamio interior en dos niveles; lecturas de 4.6 a 10.0 mm y ventana ya cortada", "grupo": "Tanque 1 estribor · IFO 1S · corte en ejecución · 27 oct" },
        { "tipo": "foto", "archivo": "registro/s6/t1s_03_plancha-nueva-soldada-ref-10.3-11.3.jpg", "texto": "Plancha nueva ya soldada (inserto gris claro)", "grupo": "Tanque 1 estribor · IFO 1S · corte en ejecución · 27 oct" },
        { "tipo": "foto", "archivo": "registro/s6/t2p_01_manhole-mgo-2p-permiso.jpg", "texto": "Manhole MGO 2P con permiso de espacio confinado", "grupo": "Tanque 2 babor · MGO 2P · andamios en armado · 27 oct" },
        { "tipo": "foto", "archivo": "registro/s6/t2p_02_inserto-anterior-lecturas.jpg", "texto": "Inserto de una reparación anterior; lecturas alrededor de 5.0–8.2 mm", "grupo": "Tanque 2 babor · MGO 2P · andamios en armado · 27 oct" },
        { "tipo": "foto", "archivo": "registro/s6/t2p_03_insertos-multiples-serpentines.jpg", "texto": "Varios insertos antiguos y serpentines en el piso; lecturas de 5.0 a 9.6 mm", "grupo": "Tanque 2 babor · MGO 2P · andamios en armado · 27 oct" },
        { "tipo": "foto", "archivo": "registro/s6/t2s_01_manhole-mgo-2s.jpg", "texto": "Manhole MGO 2S", "grupo": "Tanque 2 estribor · MGO 2S · andamios armados · 27 oct" },
        { "tipo": "foto", "archivo": "registro/s6/t2s_02_andamio-tres-niveles.jpg", "texto": "Andamio en tres niveles; lecturas de 4.7 a 10.0 mm", "grupo": "Tanque 2 estribor · MGO 2S · andamios armados · 27 oct" },
        { "tipo": "foto", "archivo": "registro/s6/t3p_01_manhole-ifo-3p-linea-foam.jpg", "texto": "Manhole IFO 3P abierto; la línea de foam pasa al lado", "grupo": "Tanque 3 babor · IFO 3P · armado de andamios · 27 oct" },
        { "tipo": "foto", "archivo": "registro/s6/t3p_02_interior-serpentines-escalera.jpg", "texto": "Interior visto desde el manhole: serpentines de calefacción y escalera", "grupo": "Tanque 3 babor · IFO 3P · armado de andamios · 27 oct" },
        { "tipo": "foto", "archivo": "registro/s6/t3s_01_corte-en-ejecucion-pares-nominal.jpg", "texto": "Corte de acero en ejecución entre refuerzos", "grupo": "Tanque 3 estribor · IFO 3S · corte en ejecución · 27 oct" },
        { "tipo": "foto", "archivo": "registro/s6/t3s_02_ranura-en-cubierta-ventiladores.jpg", "texto": "Ranura abierta en la cubierta principal, con ventiladores", "grupo": "Tanque 3 estribor · IFO 3S · corte en ejecución · 27 oct" },
        { "tipo": "foto", "archivo": "registro/s6/t3s_03_manhole-ifo-3s-permiso.jpg", "texto": "Manhole IFO 3S con permiso de espacio confinado", "grupo": "Tanque 3 estribor · IFO 3S · corte en ejecución · 27 oct" },
        { "tipo": "foto", "archivo": "registro/s6/t5p_01_manhole-ifo-5p.jpg", "texto": "Manhole IFO 5P con permiso de espacio confinado", "grupo": "Tanque 5 babor · IFO 5P · corte en ejecución · 27 oct" },
        { "tipo": "foto", "archivo": "registro/s6/t5p_02_andamio-secciones-retiradas.jpg", "texto": "Andamio con iluminación y ventilación; secciones de forro retiradas", "grupo": "Tanque 5 babor · IFO 5P · corte en ejecución · 27 oct" },
        { "tipo": "foto", "archivo": "registro/s6/t5p_03_andamio-tres-niveles-iluminacion.jpg", "texto": "Andamio en tres niveles con reflectores; lecturas de 7.5 a 9.0 mm", "grupo": "Tanque 5 babor · IFO 5P · corte en ejecución · 27 oct" },
        { "tipo": "foto", "archivo": "registro/s6/t5p_04_zona-alta-abertura-cubierta.jpg", "texto": "Zona alta del tanque (10.0–10.3 mm) y abertura en la cubierta", "grupo": "Tanque 5 babor · IFO 5P · corte en ejecución · 27 oct" },
        { "tipo": "foto", "archivo": "registro/s6/t5s_01_manhole-ifo-5s-permiso.jpg", "texto": "Manhole IFO 5S con permiso de espacio confinado", "grupo": "Tanque 5 estribor · IFO 5S · andamios armados · 27 oct" },
        { "tipo": "foto", "archivo": "registro/s6/t5s_02_andamio-lecturas.jpg", "texto": "Andamio en tres niveles; lecturas de 5.4 a 8.7 mm en la zona alta", "grupo": "Tanque 5 estribor · IFO 5S · andamios armados · 27 oct" },
        { "tipo": "foto", "archivo": "registro/s6/t5s_03_recuadros-marcados-tiza.jpg", "texto": "Recuadros marcados con tiza para renovación; lecturas de 5.0 a 6.9 mm", "grupo": "Tanque 5 estribor · IFO 5S · andamios armados · 27 oct" },
        { "tipo": "foto", "archivo": "registro/s6/t5s_04_area-triangular-minimos.jpg", "texto": "Área triangular marcada con los mínimos del tanque: 4.9–5.3 mm", "grupo": "Tanque 5 estribor · IFO 5S · andamios armados · 27 oct" },
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
      "desde": "2026-10-19",
      "hasta": "2026-10-24",
      "fuente": "Reporte del superintendente e informe diario de máquinas, 23 oct",
      "avance": [
        { "zona": "Temas importantes", "items": [
          { "txt": "1 día perdido por lluvia", "extra": "24 oct" },
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
