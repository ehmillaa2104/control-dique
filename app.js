/* =========================================================
   Control de Dique · Rev. 3 (datos reales de Monday · Kelly Trader)
   Lee window.DIQUE_MONDAY (monday.js, generado por monday/generar.py).
   Vistas: Resumen gerencial · Ingeniería · Cubierta · Técnico · Cronograma
   ========================================================= */
(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const DAY = 864e5;
  const parse = (s) => new Date(s + "T00:00:00");
  const iso = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const addDays = (d, n) => new Date(d.getTime() + n * DAY);
  const daysBetween = (a, b) => Math.round((parse(b) - parse(a)) / DAY);
  const fmtShort = (s) => parse(s).toLocaleDateString("es-ES", { day: "2-digit", month: "short" });
  const fmtDate = (s) => parse(s).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = (v) => "US$ " + Math.round(v || 0).toLocaleString("en-US");
  const moneyK = (v) => {
    const a = Math.abs(v || 0);
    if (a >= 1e6) return "US$ " + (v / 1e6).toFixed(2) + " M";
    if (a >= 1e3) return "US$ " + (v / 1e3).toFixed(1) + " k";
    return "US$ " + Math.round(v || 0);
  };
  const pct = (v, d = 1) => (v == null ? "—" : v.toFixed(d) + "%");
  const days1 = (v) => v + (Math.abs(v) === 1 ? " día" : " días");
  const plural = (n, s, p) => n + " " + (n === 1 ? s : p);
  const sum = (arr, f) => arr.reduce((a, x) => a + (f(x) || 0), 0);
  const tipAttr = (html) => `data-tip="${esc(html)}"`;
  const rowT = (k, v) => `<div class="row"><span>${k}</span><span>${v}</span></div>`;
  const dateRange = (r) => (r ? (r[0] === r[1] ? fmtShort(r[0]) : `${fmtShort(r[0])} – ${fmtShort(r[1])}`) : "—");
  const difTxt = (d, html = true) => {
    if (d == null || Math.abs(d) < 0.5) return "en plazo";
    if (d > 0) return html ? `<span class="t-alert">${days1(d)} de atraso</span>` : `${days1(d)} de atraso`;
    return `${days1(-d)} de adelanto`;
  };
  const TODAY = iso(new Date());

  const ICONS = {
    check: '<path d="M5 12.5l4.2 4L19 7"/>',
    coin: '<circle cx="12" cy="12" r="8.5"/><path d="M14.8 9.2c-.5-.9-1.6-1.4-2.8-1.4-1.6 0-2.8.8-2.8 2s1.2 1.7 2.8 2 2.8.9 2.8 2.1-1.2 2-2.8 2c-1.3 0-2.4-.6-2.9-1.5M12 6v1.8M12 16.2V18"/>',
    trend: '<path d="M4 17l5-5 4 3 7-8"/><path d="M15 7h5v5"/>', doc: '<path d="M7 3.5h7l4 4V20a.5.5 0 0 1-.5.5h-10.5a.5.5 0 0 1-.5-.5V4a.5.5 0 0 1 .5-.5z"/><path d="M14 3.5V8h4M9 12.5h6M9 16h6"/>',
    cash: '<rect x="3" y="6.5" width="18" height="11" rx="1.5"/><circle cx="12" cy="12" r="2.6"/><path d="M6.5 9.5v5M17.5 9.5v5"/>',
    wallet: '<path d="M4 7.5h14.5a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5H5.5A1.5 1.5 0 0 1 4 18V6.5A1.5 1.5 0 0 1 5.5 5H16"/><path d="M15.5 13.5h2"/>',
    users: '<circle cx="9" cy="8.5" r="3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><circle cx="17" cy="9.5" r="2.4"/><path d="M15.5 14.2a4.6 4.6 0 0 1 5 4.8"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>', gauge: '<path d="M4.5 16a7.5 7.5 0 1 1 15 0"/><path d="M12 16l3.5-4.5"/><circle cx="12" cy="16" r="1.2"/>',
    grid: '<rect x="4" y="4" width="7" height="7" rx="1.2"/><rect x="13" y="4" width="7" height="7" rx="1.2"/><rect x="4" y="13" width="7" height="7" rx="1.2"/><rect x="13" y="13" width="7" height="7" rx="1.2"/>',
    ruler: '<path d="M4 17.5L17.5 4 20 6.5 6.5 20z"/><path d="M8 13.5l1.5 1.5M10.5 11l1.5 1.5M13 8.5l1.5 1.5"/>',
    anchor: '<circle cx="12" cy="5" r="2"/><path d="M12 7v13M5 13a7 7 0 0 0 14 0M8 11h8"/>',
    wrench: '<path d="M14.5 5.5a4 4 0 0 0 4.8 4.8l-9 9a2 2 0 0 1-2.8-2.8l9-9a4 4 0 0 1-2-2z"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/>',
    hourglass: '<path d="M7 3.5h10M7 20.5h10M8 3.5v3a4 4 0 0 0 1.6 3.2L12 11.5l2.4-1.8A4 4 0 0 0 16 6.5v-3M8 20.5v-3a4 4 0 0 1 1.6-3.2L12 12.5l2.4 1.8a4 4 0 0 1 1.6 3.2v3"/>'
  };
  const icon = (n, cls = "ic") => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ""}</svg>`;
  const AREA_ICON = { ingenieria: "ruler", cubierta: "anchor", tecnico: "wrench" };

  // =========================================================
  // Modelo: todo sale de monday.js
  // =========================================================
  function build(D) {
    const areas = D.areas.map((a) => Object.assign({}, a, { act: a.trabajos.filter((t) => !t.cancelado) }));
    const byId = new Map();
    areas.forEach((a) => a.trabajos.forEach((t) => byId.set(t.id, Object.assign({ area: a.id, areaNombre: a.nombre }, t))));
    // Centros ordenados por código (1.1, 1.2 … 2.1.1 …), aunque en Monday estén en otro orden
    const code = (n) => (String(n).match(/^[\d.]+/) || ["999"])[0].split(".").filter(Boolean).map(Number);
    const byCode = (a, b) => { const x = code(a.nombre), y = code(b.nombre); for (let i = 0; i < Math.max(x.length, y.length); i++) { const d = (x[i] || 0) - (y[i] || 0); if (d) return d; } return 0; };
    const centros = D.centros.map((c) => {
      const items = c.lineas.map((id) => byId.get(id)).filter(Boolean);
      // Descartado: preliminar de los trabajos descartados (se pidieron pero no se aprobaron; siguen en el preliminar)
      return Object.assign({}, c, { items, descartado: sum(items.filter((t) => !t.cancelado && t.costo === "descartado"), (t) => t.preliminar) });
    }).sort(byCode);

    // Cronograma: elementos con fecha real; hitos = duración 0
    const crono = D.cronograma.filter((r) => Array.isArray(r.real)).map((r) => Object.assign({}, r, {
      done: /listo/i.test(r.estado || ""), kind: kindOf(r.nombre, r.grupo), hito: r.duracion === 0
    }));
    const hitos = crono.filter((r) => r.hito).sort((a, b) => (a.real[0] < b.real[0] ? -1 : 1));
    const fases = crono.filter((r) => !r.hito && !/sub/.test(r.kind));
    const actividades = crono.filter((r) => !r.hito && /sub/.test(r.kind)); // p. ej. "Trabajos adicionales de dique"
    // Etapa actual: la fase que contiene hoy (si hay dos, la que empezó más tarde)
    const inn = fases.filter((o) => o.real[0] <= TODAY && TODAY <= o.real[1]).sort((a, b) => (a.real[0] < b.real[0] ? 1 : -1));
    const cur = inn[0] || fases.filter((o) => o.real[0] > TODAY).sort((a, b) => (a.real[0] < b.real[0] ? -1 : 1))[0] || fases[fases.length - 1] || null;
    const lastHito = hitos.filter((h) => h.done).pop() || null;
    // Próximo hito: el primero pendiente de la operación del buque (Pre-dique, Dique, Post-dique), p. ej. la entrada al muelle.
    // Los hitos de Planificación (como la aprobación del presupuesto) no se muestran como próximo: su atraso se ve en el cronograma.
    const operativo = (h) => !/^plan/i.test(h.grupo || "");
    const nextHito = hitos.find((h) => !h.done && operativo(h)) || hitos.find((h) => !h.done) || null;
    // Atraso del proyecto = Diferencia del último hito (fin del proyecto, p. ej. On Hire)
    const finHito = hitos[hitos.length - 1] || null;
    const abiertos = crono.filter((r) => !r.done && r.diferencia > 0).sort((a, b) => b.diferencia - a.diferencia);
    // Participación del equipo: oculta por ahora a pedido del usuario (16 oct); se sigue leyendo de Monday. Para mostrarla, poner true.
    const MOSTRAR_PARTICIPACION = false;
    const part = (MOSTRAR_PARTICIPACION && D.participacion) || null;
    return { D, part, areas, byId, centros, crono, hitos, fases, actividades, cur, lastHito, nextHito, finHito, peorAtraso: abiertos[0] || null };
  }

  // Costos en tres etapas (columnas de Monday desde el 16 oct):
  //   Preliminar  = lo que solicita el equipo ("$ Preliminar")
  //   En revisión = lo que está en revisión por la Dirección de Operaciones ("$ En Revisión")
  //   Aprobado    = lo aprobado hasta la fecha ("$ Aprobado")
  // Los descartados se pidieron pero no se aprobaron: siguen en el preliminar y se muestran aparte (gris).
  // Lo que queda del preliminar sin estar en revisión, aprobado ni descartado es lo "sin enviar" a revisión.
  const costos = (arr) => ({
    preliminar: sum(arr, (x) => x.preliminar), enRevision: sum(arr, (x) => x.enRevision), aprobado: sum(arr, (x) => x.aprobado),
    descartado: sum(arr, (x) => ("descartado" in x && !("costo" in x) ? x.descartado : x.costo === "descartado" ? x.preliminar : 0)),
    proyectado: sum(arr, (x) => x.proyectado), po: sum(arr, (x) => x.po), incurrido: sum(arr, (x) => x.incurrido)
  });
  const sinEnviar = (C) => { const v = C.preliminar - C.enRevision - C.aprobado - (C.descartado || 0); return v > 0.5 ? v : 0; };
  const ETAPA = { aprobado: "Aprobado", revision: "En revisión", preliminar: "Preliminar", descartado: "Descartado" };
  const etapaDe = (t) => t.costo || (t.aprobado ? "aprobado" : t.enRevision ? "revision" : t.preliminar ? "preliminar" : "");

  // Monto con el color de su etapa
  const m3 = (v, et) => (v ? `<span class="t-${et}">${moneyK(v)}</span>` : '<span class="muted">—</span>');
  // Notas de gestión sobre trabajos en revisión (notas.js → revision: { "<nombre del trabajo>": "nota" })
  const notaDe = (t) => (((window.DIQUE_NOTAS || {}).revision || {})[t.nombre] || "");
  const notasRevision = (ts) => ts.filter((t) => t.enRevision && notaDe(t)).map((t) => `<span class="nota-rev">${esc(t.nombre)}: ${esc(notaDe(t))}</span>`).join("");
  const notaTxt = (t) => (notaDe(t) ? `<small class="nota-rev">${esc(notaDe(t))}</small>` : "");
  const chipEtapa = (t) => { const e = etapaDe(t); return e ? `<span class="chip et-${e}">${ETAPA[e]}</span>` : '<span class="muted">—</span>'; };
  // Avance físico = Σ (Estado % × Duración) / Σ Duración (como la columna "Avance" de Monday)
  //   Un trabajo con Duración es un trabajo planificado para ejecutarse: de esos se cuenta cuántos están en ejecución y finalizados
  function avance(trabajos) {
    const act = trabajos.filter((t) => !t.cancelado);
    const con = act.filter((t) => t.duracion > 0);
    const dur = sum(con, (t) => t.duracion);
    return {
      pct: dur ? sum(con, (t) => t.duracion * t.pct) / dur : 0, n: act.length, conDur: con.length, dur,
      ejec: con.filter((t) => t.pct > 0 && t.pct < 100).length, fin: con.filter((t) => t.pct >= 100).length,
      sinDur: act.filter((t) => conFase(t) && !(t.duracion > 0) && t.costo !== "descartado").length // con fase pero sin Duración: no cuentan
    };
  }
  const planTxt = (av) => (av.conDur ? `${plural(av.conDur, "trabajo planificado", "trabajos planificados")} · ${av.ejec} en ejecución · ${plural(av.fin, "finalizado", "finalizados")}${av.sinDur ? ` · <span class="t-warn">${av.sinDur} con fase sin duración</span>` : ""}` : '<span class="t-warn">sin trabajos planificados (ninguno tiene duración)</span>');

  // =========================================================
  // Cronograma: filas por grupo de Monday, barras en Fecha Real, Línea Base debajo, atraso en rojo
  // =========================================================
  const GRUPO_NOMBRE = (g) => ({ "plan": "Plan", "pre-dique": "Pre-dique", "dique": "Dique", "post dique": "Post-dique", "post-dique": "Post-dique" }[(g || "").toLowerCase()] || g || "Otros");
  const KIND_NOMBRE = { plan: "Planificación", pre: "Pre-dique", dique: "En dique", post: "Post-dique" };
  function kindOf(nombre, grupo) {
    const g = (grupo || "").toLowerCase(), n = nombre.toLowerCase();
    if (/traslado/.test(n)) return "tras";
    if (/planificaci/.test(n)) return "plan";
    const gk = /pre/.test(g) ? "pre" : /post/.test(g) ? "post" : /dique/.test(g) ? "dique" : /plan/.test(g) ? "plan" : "otra";
    return /ejecuci/.test(n) ? gk : "sub " + gk; // "sub" = actividad dentro de una fase (barra fina)
  }
  const itemName = (o) => (o.kind === "tras" ? o.nombre : KIND_NOMBRE[o.kind] || o.nombre.split("*")[0].trim());
  const itemTip = (o) => tipAttr(`<b>${esc(o.nombre.split("*")[0].trim())}</b>${rowT("Real", dateRange(o.real))}${o.base && dateRange(o.base) !== dateRange(o.real) ? rowT("Base", dateRange(o.base)) : ""}${o.diferencia ? rowT("Diferencia", difTxt(o.diferencia, false)) : ""}` +
    (o.duracion > 0 && Math.abs(daysBetween(o.real[0], o.real[1]) + 1 - o.duracion) > 1 ? `<div class="tnote alert">Duración ${o.duracion} d ≠ fechas ${daysBetween(o.real[0], o.real[1]) + 1} d</div>` : ""));

  function timeScale(items) {
    const dates = items.flatMap((o) => o.real.concat(o.base || [])).concat([TODAY]).sort();
    const origin = addDays(parse(dates[0]), -1), span = daysBetween(dates[0], dates[dates.length - 1]) + 3;
    const t = (s) => (parse(s) - origin) / DAY;
    const X = (v) => Math.max(0, Math.min(100, (v / span) * 100));
    return { origin, span, t, xs: (s) => X(t(s)), xe: (s) => X(t(s) + 1), xm: (s) => X(t(s) + 0.5) };
  }

  // Cronograma de detalle: una fila por elemento, agrupadas por fase, con dos vistas:
  //   · Plan vs real: línea base en gris y fecha real en rojo (atrasado) o verde (en plazo o adelantado)
  //   · Estado: verde = listo, amarillo = en ejecución, gris = sin hacer
  let VISTA_CRONO = "plan";
  try { VISTA_CRONO = localStorage.getItem("dique-vista-crono") || "plan"; } catch (e) {}
  const estadoDe = (o) => (o.done ? "listo" : /curso|ejecuci/i.test(o.estado || "") ? "curso" : "sin");
  function ganttHTML(M) {
    const items = M.crono;
    if (!items.length) return '<div class="empty">El tablero Cronograma no tiene fechas.</div>';
    const S = timeScale(items);
    const hoyX = S.xm(TODAY);
    const grupos = [];
    items.forEach((o) => { let g = grupos.find((x) => x.grupo === o.grupo); if (!g) grupos.push((g = { grupo: o.grupo, items: [] })); g.items.push(o); });
    // Marcas de cada lunes (líneas verticales suaves) y fechas arriba
    const lunes = [];
    for (let d = new Date(S.origin); S.t(iso(d)) <= S.span; d = addDays(d, 1)) if (d.getDay() === 1) lunes.push(iso(d));
    const grid = lunes.map((d) => `<i class="gx-wk" style="left:${S.xs(d)}%"></i>`).join("") + `<i class="gx-now" style="left:${hoyX}%"></i>`;
    const nombre = (o) => o.nombre.split("*")[0].replace(/\s*\(ejecuci[oó]n\)\s*/i, "").trim();
    const fila = (o) => {
      const venc = !o.done && o.real[o.hito ? 0 : 1] < TODAY;
      const dif = o.diferencia ? `<em class="${o.diferencia > 0 ? "late" : "adel"}">${o.diferencia > 0 ? "+" : ""}${o.diferencia} d</em>` : "";
      const estado = o.done ? '<em class="ok">✓</em>' : venc ? '<em class="late">vencido</em>' : "";
      let t = "";
      const real = o.diferencia > 0 ? "rojo" : "verde", est = estadoDe(o);
      if (VISTA_CRONO === "estado") {
        if (o.hito) t += `<i class="gx-hd st-${est}" style="left:${S.xm(o.real[0])}%" ${itemTip(o)}></i>`;
        else { const l = S.xs(o.real[0]); t += `<i class="gx-bar st-${est}" style="left:${l}%;width:${S.xe(o.real[1]) - l}%" ${itemTip(o)}></i>`; }
      } else if (o.hito) {
        const x = S.xm(o.real[0]);
        if (o.base && o.base[0] !== o.real[0]) t += `<i class="gx-hc ${real}" style="left:${Math.min(x, S.xm(o.base[0]))}%;width:${Math.abs(x - S.xm(o.base[0]))}%"></i>`;
        if (o.base) t += `<i class="gx-hd base" style="left:${S.xm(o.base[0])}%"></i>`;
        t += `<i class="gx-hd ${real}" style="left:${x}%" ${itemTip(o)}></i>`;
      } else {
        // Línea base arriba (gris) y fecha real abajo (rojo si va atrasado, verde si va en plazo o adelantado)
        if (o.base) t += `<i class="gx-pb" style="left:${S.xs(o.base[0])}%;width:${S.xe(o.base[1]) - S.xs(o.base[0])}%" ${itemTip(o)}></i>`;
        const l = S.xs(o.real[0]);
        t += `<i class="gx-pr ${real}" style="left:${l}%;width:${S.xe(o.real[1]) - l}%" ${itemTip(o)}></i>`;
      }
      return `<div class="gx-row ${o.hito ? "hito" : ""}"><div class="gx-l"><b>${o.hito ? "◆ " : ""}${esc(nombre(o))}</b><small>${dateRange(o.real)} ${dif} ${estado}</small></div><div class="gx-t">${t}</div></div>`;
    };
    const cab = (g) => {
      const st = g.items.map((o) => o.real[0]).sort()[0], en = g.items.map((o) => o.real[1]).sort().pop();
      const k = (g.items.find((o) => !o.hito && !/sub/.test(o.kind)) || g.items[0]).kind.replace("sub ", "");
      return `<div class="gx-row gx-g"><div class="gx-l"><b><i class="dot k-${k}"></i>${esc(GRUPO_NOMBRE(g.grupo))}</b><small>${dateRange([st, en])}</small></div><div class="gx-t"></div></div>`;
    };
    const ejes = lunes.map((d, i) => `<span class="${i % 2 ? "odd" : ""} ${i % 3 ? "no3" : ""}" style="left:${S.xs(d)}%">${fmtShort(d)}</span>`).join("");
    return `<div class="gx">
      <div class="gx-row gx-ax"><div class="gx-l"></div><div class="gx-t">${ejes}<span class="gx-hoy" style="left:${hoyX}%">Hoy ${fmtShort(TODAY)}</span></div></div>
      <div class="gx-body"><div class="gx-grid">${grid}</div>${grupos.map((g) => cab(g) + g.items.map(fila).join("")).join("")}</div>
      <div class="gx-foot">${VISTA_CRONO === "estado"
        ? '<span><i class="lg st-listo"></i>Listo</span><span><i class="lg st-curso"></i>En ejecución</span><span><i class="lg st-sin"></i>Sin hacer</span><span>◆ hito</span>'
        : '<span><i class="lg gris"></i>Línea base</span><span><i class="lg verde"></i>Real en plazo o adelantado</span><span><i class="lg rojo"></i>Real atrasado</span><span>◆ hito (gris = base)</span>'}</div>
    </div>`;
  }
  // Reparte las etiquetas de hitos en dos filas midiendo su ancho real; si no caben, se ocultan (queda el rombo)
  function layoutMl(root) {
    const ends = [-1e9, -1e9];
    root.querySelectorAll(".ml").forEach((el) => {
      el.classList.remove("r0", "r1", "hide");
      for (let r = 0; r < 2; r++) {
        el.classList.add("r" + r);
        const b = el.getBoundingClientRect();
        if (b.left > ends[r] + 8) { ends[r] = b.right; return; }
        el.classList.remove("r" + r);
      }
      el.classList.add("hide");
    });
  }

  // =========================================================
  // Cabecera: el buque en el cronograma (etapa, último y próximo hito)
  // =========================================================
  const SHIP = `<svg class="vy-boat" viewBox="0 0 120 40" aria-hidden="true">
      <path class="vy-wake" d="M6 34c-8 0-14 1.6-22 1.6M8 37.5c-10 0-19 .8-30 .8"/>
      <rect class="h" x="17" y="1" width="8" height="8" rx="1"/><rect class="fun" x="17" y="3.4" width="8" height="2.6"/>
      <path class="h" d="M12 9h22v12H12z"/><path class="d" d="M9.5 10.5h27v2.6h-27z"/>
      <path class="dl" d="M15 16h2.6M19.6 16h2.6M24.2 16h2.6M28.8 16h2.6"/>
      <path class="h" d="M4 21h106c4 0 6.5 1.6 5.6 4.2L112 34.5c-.6 1.7-2 2.5-4 2.5H12c-3.2 0-5.4-1.6-6.2-4.4z"/>
      <path class="hull-b" d="M8.6 31h105.8L112 34.5c-.6 1.7-2 2.5-4 2.5H12c-1.9 0-3.4-.6-4.4-1.8z"/>
      <path class="dl" d="M38 19.2h66M50 21v-4h4v4M72 21v-4h4v4M94 21v-4h4v4M64 21v-9l8 4"/>
      <path class="hl" d="M107 21v-10"/>
    </svg>`;
  function voyageHTML(M) {
    if (!M.crono.length) return "";
    const S = timeScale(M.crono);
    const hoyX = S.xm(TODAY);
    // Franja de fases en su fecha real (si se traslapan, la que empieza después queda encima) y los hitos
    const bands = M.fases.map((o) => `<i class="vb k-${o.kind}" style="left:${S.xs(o.real[0])}%;width:${S.xe(o.real[1]) - S.xs(o.real[0])}%" ${itemTip(o)}></i>`).join("") +
      M.actividades.map((o) => `<i class="vb act k-${o.kind.replace("sub ", "")} ${o.diferencia > 0 ? "late" : ""}" style="left:${S.xs(o.real[0])}%;width:${S.xe(o.real[1]) - S.xs(o.real[0])}%" ${itemTip(o)}></i>`).join("");
    const hs = M.hitos.map((o) => {
      const late = !o.done && (o.diferencia > 0 || o.real[0] < TODAY);
      return `<i class="vh ${o.done ? "ok" : late ? "late" : ""}" style="left:${S.xm(o.real[0])}%" ${itemTip(o)}></i>`;
    }).join("");
    const c = M.cur;
    const dia = c ? daysBetween(c.real[0], TODAY) + 1 : 0, dias = c ? daysBetween(c.real[0], c.real[1]) + 1 : 0;
    // Si hoy cae dentro de una actividad (p. ej. trabajos adicionales), la etiqueta del buque también la nombra
    const enCurso = M.actividades.filter((o) => o.real[0] <= TODAY && TODAY <= o.real[1]).map((o) => o.nombre.split("*")[0].trim());
    const etapa = c ? `<b>${esc(itemName(c))}</b>${dia >= 1 && dia <= dias ? ` · día ${dia} de ${dias}` : ""}${enCurso.length ? ` · ${esc(enCurso.join(", "))}` : ""}` : "—";
    const hitoTxt = (h, prox) => {
      if (!h) return '<b class="muted">—</b>';
      const cuando = h.real[0] === TODAY ? "hoy" : fmtShort(h.real[0]);
      if (h.done || !prox) return `<b>${esc(h.nombre)}</b><span>${cuando}${h.done ? " · cumplido" : ""}</span>`;
      const vencido = h.real[0] < TODAY ? daysBetween(h.real[0], TODAY) : 0;
      const extra = vencido ? ` · <em class="v-late">vencido hace ${days1(vencido)}</em>` : h.diferencia > 0 ? ` · <em class="v-late">+${h.diferencia} d vs plan</em>` : "";
      return `<b>${esc(h.nombre)}</b><span>${cuando}${extra}</span>`;
    };
    const fin = M.finHito;
    const align = hoyX < 12 ? "l" : hoyX > 88 ? "r" : "";
    return `<div class="vy">
      <div class="vy-track">
        <div class="vy-ship ${align}" data-x="${hoyX}" style="left:${hoyX}%"><div class="vy-tag">${etapa}</div>${SHIP}</div>
        <div class="vy-sea">${bands}${hs}<i class="vy-now" style="left:${hoyX}%"></i></div>
        <div class="vy-ends"><span>${fmtShort(M.crono.map((o) => o.real[0]).sort()[0])}</span><span>${fin ? esc(fin.nombre) + " · " + fmtShort(fin.real[0]) : ""}</span></div>
      </div>
      <div class="vy-info">
        <div class="vi">${icon("check", "ic sm")}<div><small>Último hito</small>${hitoTxt(M.lastHito, false)}</div></div>
        <div class="vi">${icon("calendar", "ic sm")}<div><small>Próximo hito</small>${hitoTxt(M.nextHito, true)}</div></div>
        ${(() => {
          const d = fin ? fin.diferencia || 0 : 0, p = M.peorAtraso;
          const val = Math.abs(d) < 0.5 ? "0 días" : d > 0 ? "+" + days1(d) : "-" + days1(-d);
          return `<div class="vi ${d >= 2 ? "late" : ""}" ${tipAttr((M.crono.filter((r) => r.diferencia > 0).sort((a, b) => b.diferencia - a.diferencia).slice(0, 3).map((r) => rowT(esc(r.nombre.split("*")[0].trim()), "+" + r.diferencia + " d")).join("")) || '<div class="tnote">Sin atrasos</div>')}>${icon("clock", "ic sm")}<div><small>Atraso del cronograma</small><b>${val}${fin ? ` <span>al ${esc(fin.nombre.replace(/\s*\(.*\)\s*$/, ""))}</span>` : ""}</b>${p ? `<span><em class="v-late">${esc(p.nombre)} +${p.diferencia} d</em></span>` : ""}</div></div>`;
        })()}
      </div>
    </div>`;
  }
  let lastShipX = 0;
  function sailShip() {
    const ship = document.querySelector(".vy-ship");
    if (!ship) return;
    const x = +ship.dataset.x;
    ship.style.transition = "none";
    ship.style.left = lastShipX + "%";
    void ship.offsetWidth; // aplica la posición inicial antes de animar
    ship.style.transition = "";
    ship.style.left = x + "%";
    lastShipX = x;
  }

  // =========================================================
  // Componentes
  // =========================================================
  const card = (title, body, o = {}) => `<section class="card ${o.cls || ""}"><div class="card-h"><span>${title}</span>${o.right ? `<small>${o.right}</small>` : ""}</div>${body}</section>`;
  const kpi = (ic, lbl, val, sub, o = {}) => `<div class="card kpi ${o.alert ? "alert" : o.warn ? "warn" : ""} ${o.cls || ""}" ${o.tip ? tipAttr(o.tip) : ""}>${icon(ic)}<div style="min-width:0"><div class="lbl">${lbl}</div><div class="val">${val}</div><div class="sub">${sub}</div></div></div>`;
  const empty = (txt) => `<div class="empty">${txt}</div>`;
  const bar = (p) => `<span class="pbar"><i style="width:${Math.max(0, Math.min(100, p))}%"></i></span>`;
  const mcell = (v) => (v ? moneyK(v) : '<span class="muted">—</span>');

  // Estado del presupuesto ante Dirección. Primero lo que dice Monday (CC con Estado Aprobación "Revisar");
  // si Monday no lo tiene, la nota de gestión de notas.js.
  function estadoDireccion(M) {
    const rev = M.centros.filter((c) => /revis/i.test(c.estado || ""));
    if (rev.length) return { txt: "Dirección solicitó cambios", sub: `${plural(rev.length, "centro de costo", "centros de costo")} en "Revisar"`, fuente: "Monday · tablero CC (Estado Aprobación = Revisar)", centros: rev.map((c) => c.nombre) };
    const n = (window.DIQUE_NOTAS || {}).presupuesto;
    if (n && n.estado) return { txt: n.estado, sub: n.fecha ? fmtShort(n.fecha) : "", detalle: n.detalle || "", fuente: "Nota de gestión (notas.js); aún no está en Monday" };
    return null;
  }


  function costKpis(C, av, extra = {}) {
    const ts = (extra.trabajos || []).filter((t) => !t.cancelado);
    const n = (e) => ts.filter((t) => etapaDe(t) === e).length;
    const E = C.enRevision ? extra.direccion : null;
    return [
      kpi("hourglass", "En revisión", moneyK(C.enRevision), `<span>Dir. de Operaciones</span>${notasRevision(ts)}${E ? `<span class="chip warn">${esc(E.txt)}</span>` : ""}`,
        { cls: "c-rev", tip: C.enRevision ? rowT("Trabajos en revisión", n("revision")) : "" }),
      kpi("check", "Aprobado", moneyK(C.aprobado), "<span>Dir. de Operaciones</span>",
        { cls: "c-apr", tip: C.aprobado ? rowT("Trabajos aprobados", n("aprobado")) : "" }),
      kpi("trend", "Proyectado", moneyK(C.proyectado), "Costo final esperado",
        { alert: C.aprobado > 0 && C.proyectado > C.aprobado * 1.05 }),
      kpi("doc", "Órdenes de compra (PO)", moneyK(C.po), C.po ? "Comprometido" : "Sin información aún"),
      kpi("wallet", "Incurrido", moneyK(C.incurrido), "Facturado", extra.incurrido ? { tip: extra.incurrido.tip } : {}),
      kpi("cash", "Pagado", moneyK(C.pagado || 0), C.pagado ? "Pagado a proveedores" : "Sin información aún"),
      ...(extra.extraKpis || []),
      avanceKpi(av)
    ].join("");
  }

  // Avance físico como un reloj: anillo que se llena con el %
  function avanceKpi(av) {
    const p = Math.max(0, Math.min(100, av.pct || 0)), r = 15.9155; // circunferencia = 100
    const reloj = `<svg class="reloj" viewBox="0 0 36 36" aria-hidden="true"><circle class="r-bg" cx="18" cy="18" r="${r}"/><circle class="r-fg" cx="18" cy="18" r="${r}" stroke-dasharray="${p.toFixed(2)} 100"/></svg>`;
    return `<div class="card kpi k-avance" ${tipAttr(`${rowT("En ejecución", av.ejec)}${rowT("Finalizados", av.fin)}${rowT("Por iniciar", av.conDur - av.ejec - av.fin)}<div class="tnote">Ponderado por duración</div>`)}>
      <div class="reloj-w">${reloj}<b>${pct(av.pct, 0)}</b></div><div style="min-width:0"><div class="lbl">Avance físico</div><div class="sub">${av.conDur ? `<span>${av.ejec} en ejecución</span><span>${av.fin} finalizados de ${av.conDur}</span>` : '<span class="t-warn">sin trabajos planificados</span>'}</div></div></div>`;
  }

  // Centros de costo, desplegables por grupo y por centro (con sus trabajos de P1, P2 y P3)
  function centrosCard(M) {
    const cols = (c, cls = "") => `<span class="n ${cls}">${m3(c.enRevision, "rev")}</span><span class="n ${cls}">${m3(c.aprobado, "apr")}</span><span class="n ${cls}">${mcell(c.proyectado)}</span><span class="n ${cls}">${mcell(c.po)}</span><span class="n ${cls}">${mcell(c.incurrido)}</span>`;
    const grupos = [];
    M.centros.forEach((c) => { let g = grupos.find((x) => x.nombre === c.grupo); if (!g) grupos.push((g = { nombre: c.grupo, items: [] })); g.items.push(c); });
    // Estado del centro según sus montos; si Dirección pidió cambios en Monday ("Revisar"), eso manda
    const estadoCC = (c) => {
      if (/revisar/i.test(c.estado)) return '<span class="chip alert">Cambios solicitados</span>';
      if (!c.preliminar && !c.enRevision && !c.aprobado) return '<span class="muted">—</span>';
      if (c.enRevision) return `<span class="chip et-revision">En revisión</span>`;
      if (c.aprobado && !sinEnviar(c)) return `<span class="chip et-aprobado">Aprobado</span>`;
      return c.aprobado ? `<span class="chip et-aprobado">Aprobado parcial</span>` : `<span class="chip et-preliminar">Preliminar</span>`;
    };
    const linea = (t) => `<div class="cc-line"><span class="nm">${esc(t.nombre)}<small>${esc(t.areaNombre)}</small>${notaTxt(t)}</span>${cols(t)}<span class="st">${chipEtapa(t)}</span></div>`;
    const body = grupos.map((g) => {
      const G = costos(g.items);
      const rows = g.items.map((c) => {
        const nota = c.items.filter((t) => t.enRevision && notaDe(t)).map((t) => notaDe(t))[0];
        // Solo los trabajos planificados (con fase); los "No Aplica" se resumen en una línea si tienen montos
        const plan = c.items.filter(conFase), otros = c.items.filter((t) => !conFase(t)), O = costos(otros);
        const conMonto = O.preliminar || O.enRevision || O.aprobado || O.proyectado || O.po || O.incurrido;
        const resto = otros.length && conMonto ? `<div class="cc-line otros"><span class="nm">${plural(otros.length, "trabajo sin fase", "trabajos sin fase")} (No Aplica)</span>${cols(O)}<span class="st"></span></div>` : "";
        return `<details class="cc"><summary><span class="nm">${esc(c.nombre)}<small>${plural(plan.length, "trabajo planificado", "trabajos planificados")}</small>${nota ? `<small class="nota-rev">${esc(nota)}</small>` : ""}</span>${cols(c)}<span class="st">${estadoCC(c)}</span></summary>
          <div class="cc-lines">${plan.length || resto ? plan.map(linea).join("") + resto : '<div class="empty sm">Sin trabajos planificados en P1, P2 ni P3.</div>'}</div></details>`;
      }).join("");
      return `<details class="cc-g"><summary><span class="nm">Grupo ${esc(g.nombre)}<small>${plural(g.items.length, "centro", "centros")} de costo</small></span>${cols(G, "b")}<span class="st"></span></summary>${rows}</details>`;
    }).join("");
    const T = costos(M.centros);
    return card("Centros de costo", `<div class="cc-table">
        <div class="cc-head"><span class="nm">Centro de costo</span><span class="n t-rev">En revisión</span><span class="n t-apr">Aprobado</span><span class="n">Proyectado</span><span class="n">PO</span><span class="n">Incurrido</span><span class="st">Estado</span></div>
        ${body}
        <div class="cc-total"><span class="nm">Total</span>${cols(T, "b")}<span class="st"></span></div>
      </div>`, { cls: "wide", right: "clic en un grupo o centro para desplegar" });
  }

  // =========================================================
  // Participación del equipo (tablero "Participación del Equipo" de Monday)
  //   % cumplimiento = puntos / máximo de las semanas cargadas · reunión 1 pt · actualización 2 pts (directa 2, indirecta 1)
  //   Semáforo: Alto ≥ 75 % (verde) · Medio ≥ 50 % (amarillo) · Bajo < 50 % (rojo), igual que la fórmula de Monday
  // =========================================================
  const semCls = (n) => (n === "Alto" ? "sem-alto" : n === "Medio" ? "sem-medio" : n === "Bajo" ? "sem-bajo" : "");
  const partDe = (M, areaId) => (M.part ? M.part.equipos.find((e) => e.area === areaId) || null : null);
  function partKpi(M, e, titulo) {
    const P = M.part;
    if (!P) return "";
    const x = e || P.total;
    if (x.pct == null) return kpi("users", titulo, "—", "sin semanas cargadas");
    const det = e ? "" : plural(P.equipos.length, "equipo", "equipos");
    return `<div class="card kpi sem ${semCls(x.nivel)}">
      ${icon("users")}<div style="min-width:0"><div class="lbl">${esc(titulo)}</div><div class="val">${pct(x.pct, 0)} <span class="sem-chip">${esc(x.nivel)}</span></div><div class="sub">${det}</div></div></div>`;
  }
  // Tabla de participación: todos los equipos del tablero (también Seguridad y Contabilidad, que no tienen tablero de área)
  function partTabla(M) {
    const P = M.part;
    if (!P) return "";
    const cum = (x) => `<td><div class="pc-cum"><span class="sbar"><i style="width:${x.pct || 0}%"></i></span><b>${x.pct == null ? "—" : pct(x.pct, 0)}</b><span class="sem-chip">${esc(x.nivel || "—")}</span></div></td>`;
    const fila = (e) => {
      const area = M.areas.find((a) => a.id === e.area);
      return `<tr class="${semCls(e.nivel)}"><td><b>${area ? `<a href="#${area.id}">${esc(e.nombre)}</a>` : esc(e.nombre)}</b></td>${cum(e)}</tr>`;
    };
    const T = P.total;
    return card("Participación del equipo", `<table class="tbl mini part"><tbody>${P.equipos.map(fila).join("")}</tbody>
      <tfoot><tr class="${semCls(T.nivel)}"><td><b>Equipo completo</b></td>${cum(T)}</tr></tfoot></table>`);
  }

  // Esta semana: lo hecho (avance desde hace 7 días, según monday/historial.json), lo que está en curso y lo próximo (14 días)
  function semanaCard(M) {
    const H = M.D.historial || [];
    const hace7 = iso(addDays(parse(TODAY), -7)), en14 = iso(addDays(parse(TODAY), 14));
    const ref = H.filter((h) => h.fecha <= hace7).pop() || H[0] || null;
    const ts = [...M.byId.values()].filter((t) => !t.cancelado && conFase(t) && t.costo !== "descartado");
    const linea = (t, der, cls = "") => `<li class="${cls}" ${tipAttr(`<b>${esc(t.nombre)}</b>${rowT(esc(t.areaNombre), esc(t.fase))}${t.duracion ? rowT("Duración", t.duracion + " d") : ""}`)}>${icon(AREA_ICON[t.area] || "grid", "ic sm")}<span class="sem-nm">${esc(t.nombre)}</span><b>${der}</b></li>`;
    const mas = (n) => (n > 0 ? `<li class="sem-mas">y ${n} más</li>` : "");
    const MAX = 6;
    // Lo hecho
    let hecho = "", hechoN = 0, avTxt = "";
    if (ref) {
      const antes = (t) => (t.id in ref.pct ? ref.pct[t.id] : 0);
      const sub = ts.filter((t) => t.pct > antes(t)).sort((a, b) => (b.pct >= 100) - (a.pct >= 100) || (b.duracion || 0) - (a.duracion || 0));
      hechoN = sub.length;
      hecho = sub.slice(0, MAX).map((t) => linea(t, t.pct >= 100 ? '<span class="t-apr">✓ 100 %</span>' : `${antes(t)} → ${t.pct} %`, t.pct >= 100 ? "fin" : "")).join("") + mas(sub.length - MAX);
      const avHoy = avance(M.areas.flatMap((a) => a.trabajos)).pct;
      if (ref.avance != null) avTxt = `Avance ${pct(ref.avance)} → <b>${pct(avHoy)}</b>${avHoy - ref.avance >= 0.05 ? ` <span class="t-apr">+${(avHoy - ref.avance).toFixed(1)} pts</span>` : ' <span class="muted">sin cambio</span>'}`;
    }
    // En curso: los que pesan más en el avance (más días) primero
    const curso = ts.filter((t) => t.pct > 0 && t.pct < 100).sort((a, b) => (b.duracion || 0) - (a.duracion || 0));
    // Lo próximo: hitos y fases de los próximos 14 días; los hitos ya vencidos sin marcar van primero, en rojo
    const prox = M.crono.filter((r) => !r.done && r.real[0] <= en14 && (r.hito || r.real[0] > TODAY))
      .sort((a, b) => (a.real[0] < b.real[0] ? -1 : 1));
    // Si en 14 días no viene ningún hito, se muestra igual el siguiente (p. ej. la salida del astillero)
    if (!prox.some((r) => r.hito && r.real[0] >= TODAY)) { const sig = M.hitos.find((h) => !h.done && h.real[0] > en14); if (sig) prox.push(sig); }
    const fx = (r) => {
      const venc = r.hito && r.real[0] < TODAY;
      return `<li class="${venc ? "venc" : ""}" ${itemTip(r)}>${icon(venc ? "clock" : "calendar", "ic sm")}<span class="sem-nm">${esc(r.nombre.split("*")[0].trim())}</span><b class="${venc ? "t-alert" : ""}">${venc ? "vencido " : ""}${fmtShort(r.real[0])}</b></li>`;
    };
    const faseAct = M.cur && FASES.find((f) => f.id === M.cur.kind);
    const porIniciar = faseAct ? ts.filter((t) => faseId(t) === faseAct.id && t.pct === 0).length : 0;
    const proximo = prox.map(fx).join("") + (porIniciar ? `<li class="sem-mas">${plural(porIniciar, "trabajo", "trabajos")} de ${faseAct.nombre} por iniciar</li>` : "");
    const col = (titulo, sub, cuerpo, vacio) => `<div class="sem-col"><div class="sem-h"><b>${titulo}</b><small>${sub}</small></div><ul>${cuerpo || `<li class="sem-vacio">${vacio}</li>`}</ul></div>`;
    const cambios = card("Cambios de la semana", `<div class="sem sem-2">
      ${col("Lo hecho", ref ? `desde el ${fmtShort(ref.fecha)} · ${plural(hechoN, "trabajo avanzó", "trabajos avanzaron")}` : "sin lecturas anteriores", hecho, "Ningún trabajo avanzó en estos días.")}
      ${col("En curso", plural(curso.length, "trabajo", "trabajos") + " entre 25 y 75 %", curso.slice(0, MAX).map((t) => linea(t, `${t.pct} %`)).join("") + mas(curso.length - MAX), "Nada en ejecución.")}
    </div>`, { right: avTxt });
    const atencion = card("Puntos de atención", `<div class="sem sem-1">${col("", "hitos y fases", proximo, "Sin puntos pendientes.")}</div>`);
    return `<div class="row-b row-sem">${cambios}${atencion}</div>`;
  }

  function cambiosCard(M) {
    const C = M.D.cambios.slice(0, 6);
    const chip = (e) => `<span class="chip ${/aprob/i.test(e) ? "ok" : /rechaz/i.test(e) ? "alert" : /solic/i.test(e) ? "warn" : ""}">${esc(e || "Sin estado")}</span>`;
    const cambios = C.length ? C.map((c) => `<div class="li"><div><b>${esc(c.nombre)}</b><small>${[c.tipo, c.costo ? moneyK(c.costo) : "", c.dias ? "+" + days1(c.dias) : "", c.creado ? fmtShort(c.creado) : ""].filter(Boolean).map(esc).join(" · ")}</small></div>${chip(c.estado)}</div>`).join("")
      : empty("Sin cambios ni imprevistos registrados en Monday.");
    return card("Cambios recientes", `<div class="list">${cambios}</div>`,
      { right: plural(M.D.cambios.length, "cambio o imprevisto", "cambios o imprevistos") });
  }

  // Entrega de información semanal de todos los departamentos (tablero Participación del Equipo, columnas "Act. Sn"):
  // la última semana cuya fecha ya pasó; si un departamento no la tiene cargada, cuenta como Pendiente (no presentó)
  const ENTREGA = { 2: ["Completa", "ok"], 1: ["Parcial", "warn"], 0: ["Pendiente", "alert"] };
  const MESES = { jan: 0, ene: 0, feb: 1, mar: 2, apr: 3, abr: 3, may: 4, jun: 5, jul: 6, aug: 7, ago: 7, sep: 8, set: 8, oct: 9, nov: 10, dec: 11, dic: 11 };
  const fechaSemana = (f) => { const m = String(f || "").match(/(\d{1,2})\s*([a-záé]{3})/i); if (!m || !(m[2].toLowerCase() in MESES)) return null; return iso(new Date(+TODAY.slice(0, 4), MESES[m[2].toLowerCase()], +m[1])); };
  function entregaHTML(M) {
    const P = M.D.participacion;
    if (!P || !P.equipos.length) return "";
    const conAct = P.semanas.filter((s) => s.act || fechaSemana(s.fecha));
    const pasadas = conAct.filter((s) => { const f = fechaSemana(s.fecha); return f ? f <= TODAY : s.act; });
    const ult = pasadas[pasadas.length - 1];
    if (!ult) return "";
    // Solo cuentan las opciones nuevas del tablero (Completa / Parcial); lo demás (incluidas las de antes:
    // "actualización directa / indirecta") o sin cargar queda como Pendiente (pedido del usuario, 22 oct)
    const est = (e, s) => { const d = e.semanas.find((x) => x.semana === s.semana) || {}; const t = (d.act || "").toLowerCase(); return ENTREGA[t.startsWith("complet") ? 2 : t.startsWith("parcial") ? 1 : 0]; };
    const nom = (s) => `Semana ${s.semana.slice(1)}${s.fecha ? " · " + esc(s.fecha) : ""}`;
    const items = P.equipos.map((e) => {
      const [txt, cls] = est(e, ult);
      const tip = `<b>${esc(e.nombre)}</b>${pasadas.map((s) => rowT(nom(s), esc(est(e, s)[0]))).join("")}`;
      return `<span class="ent-i" ${tipAttr(tip)}><b>${esc(e.nombre)}</b><span class="chip ${cls}">${txt}</span></span>`;
    }).join("");
    return card("Cumplimiento · entrega de información semanal", `<div class="sem-ent"><div class="ent-l">${items}</div></div>`, { cls: "wide", right: `${nom(ult)} · sin cargar = pendiente` });
  }

  function areaCards(M) {
    return `<div class="areas">${M.areas.map((a) => {
      const C = costos(a.act), av = avance(a.trabajos);
      const sinCC = a.act.filter((t) => !t.cc.length).length;
      return `<a class="card area" href="#${a.id}">
        <div class="area-h">${icon(AREA_ICON[a.id] || "grid")}<b>${esc(a.nombre)}</b><small>${esc(a.tablero)}</small></div>
        <div class="area-av"><span class="big">${pct(av.pct, 0)}</span>${bar(av.pct)}<small>avance · ${planTxt(av)}</small></div>
        <div class="area-c"><div><small>En revisión</small><b class="t-rev">${moneyK(C.enRevision)}</b></div><div><small>Aprobado</small><b class="t-apr">${moneyK(C.aprobado)}</b></div><div><small>Proyectado</small><b>${moneyK(C.proyectado)}</b></div><div><small>PO</small><b>${moneyK(C.po)}</b></div><div><small>Incurrido</small><b>${moneyK(C.incurrido)}</b></div></div>
        ${sinCC ? `<div class="area-f"><span class="chip alert">${sinCC} sin centro de costo</span></div>` : ""}
      </a>`;
    }).join("")}</div>`;
  }

  // =========================================================
  // Vistas
  // =========================================================
  function viewResumen(M) {
    const all = M.areas.flatMap((a) => a.trabajos);
    // Montos de los centros de costo (preliminar, en revisión, aprobado, proyectado y PO)
    const C = costos(M.centros);
    const P = M.D.pos;
    // Incurrido = total de "$ Incurrido" del tablero Contabilidad Kelly Trader (todos los documentos contables,
    // estén o no enlazados a un trabajo o centro de costo). Lo enlazado es lo que llega al tablero CC y a las áreas.
    const enl = P.filter((p) => p.cc.length || p.trabajos.length), sinEnl = P.filter((p) => !p.cc.length && !p.trabajos.length);
    const incSin = sum(sinEnl, (p) => p.incurrido);
    C.incurrido = sum(P, (p) => p.incurrido);
    const incurrido = {
      tip: `${rowT("Enlazado a trabajos", moneyK(sum(enl, (p) => p.incurrido)))}${incSin ? rowT("Sin enlazar", moneyK(incSin)) : ""}`
    };
    return `<div class="kpis ${M.part ? "k8" : "k7"}">${costKpis(C, avance(all), { incurrido, direccion: estadoDireccion(M), trabajos: all })}${partKpi(M, null, "Participación del equipo")}</div>
      <h2 class="sec">Resumen por área</h2>${areaCards(M)}
      ${entregaHTML(M)}
      ${semanaCard(M)}
      <div class="row-b">${centrosCard(M)}<div class="stack">${cambiosCard(M)}</div></div>
      ${M.part ? `<div class="row-2">${fasesCard(M)}${partTabla(M)}</div>` : fasesCard(M, false)}`;
  }

  // Trabajos planificados: los que tienen una fase (Pre-dique, Dique, Post-dique…); "No Aplica" o sin fase no se muestran
  const conFase = (t) => !!t.fase && !/no aplica/i.test(t.fase);
  // Fases de ejecución: la columna "Fase" de P1, P2 y P3; las fechas salen del tablero Cronograma
  const FASES = [{ id: "pre", nombre: "Pre-dique" }, { id: "dique", nombre: "Dique" }, { id: "post", nombre: "Post-dique" }];
  const faseId = (t) => (!conFase(t) ? null : /pre/i.test(t.fase) ? "pre" : /pos/i.test(t.fase) ? "post" : /dique/i.test(t.fase) ? "dique" : null);
  const enFase = (f) => (t) => f === "todas" ? conFase(t) : faseId(t) === f;
  let FASE = "todas";
  try { FASE = localStorage.getItem("dique-fase") || "todas"; } catch (e) {}
  if (FASE !== "todas" && !FASES.some((f) => f.id === FASE)) FASE = "todas";
  const faseSel = (trabajos) => `<div class="seg" role="group" aria-label="Fase">${[{ id: "todas", nombre: "Todas" }].concat(FASES).map((f) =>
    `<button type="button" data-fase="${f.id}" aria-pressed="${FASE === f.id}">${f.id !== "todas" ? `<i class="dot k-${f.id}"></i>` : ""}${f.nombre}<small>${trabajos.filter(enFase(f.id)).length}</small></button>`).join("")}</div>`;

  // Avance y montos por fase (Pre-dique, Dique, Post-dique) con las fechas de la fase en el Cronograma
  function fasesCard(M, grande) {
    const all = M.areas.flatMap((a) => a.trabajos);
    const barra = (v, cls = "") => `<div class="mini-av ${cls}"><span class="pbar"><i style="width:${Math.max(0, Math.min(100, v))}%"></i></span><b>${pct(v, 0)}</b></div>`;
    // Los mismos montos que en el resto del dashboard, para poder comparar las fases
    const montos = (C) => `<span class="fs-m">${[["En revisión", m3(C.enRevision, "rev")], ["Aprobado", m3(C.aprobado, "apr")],
      ["Proyectado", mcell(C.proyectado)], ["PO", mcell(C.po)], ["Incurrido", mcell(C.incurrido)]].map(([k, v]) => `<span><small>${k}</small><b>${v}</b></span>`).join("")}</span>`;
    const datos = (av) => `${plural(av.conDur, "planificado", "planificados")} · ${av.ejec} en ejecución · ${plural(av.fin, "finalizado", "finalizados")}${av.sinDur ? ` · <span class="t-warn">${av.sinDur} sin duración</span>` : ""}`;
    // Trabajos de la fase por área: primero los que están en ejecución, luego los finalizados y al final los por iniciar
    const orden = (t) => (t.pct > 0 && t.pct < 100 ? 0 : t.pct >= 100 ? 1 : 2);
    const lista = (ts) => M.areas.map((a) => {
      const xs = ts.filter((t) => t.area === a.id).sort((x, y) => orden(x) - orden(y) || (y.duracion || 0) - (x.duracion || 0));
      if (!xs.length) return "";
      const av = avance(xs);
      return `<div class="fs-area"><div class="fs-ah">${icon(AREA_ICON[a.id] || "grid", "ic sm")}<b>${esc(a.nombre)}</b><small>${datos(av)}</small>${barra(av.pct, "sm")}</div>
        <div class="scroll"><table class="tbl fs-tbl"><thead><tr><th>Trabajo</th><th>Estado</th><th class="n">Duración</th><th class="n t-rev">En revisión</th><th class="n t-apr">Aprobado</th><th>Costo</th><th>Fin</th></tr></thead><tbody>${xs.map((t) =>
          `<tr class="${t.cancelado ? "cancel" : ""}"><td><b>${esc(t.nombre)}</b><small>${esc(t.grupo)}</small>${notaTxt(t)}</td><td class="nw">${t.cancelado ? '<span class="chip">Cancelado</span>' : `${bar(t.pct)} ${t.pct}%`}</td>
            <td class="n">${t.duracion > 0 ? t.duracion + " d" : '<span class="t-warn">sin duración</span>'}</td><td class="n">${m3(t.enRevision, "rev")}</td><td class="n">${m3(t.aprobado, "apr")}</td><td>${chipEtapa(t)}</td><td class="nw">${t.fin ? fmtShort(t.fin) : '<span class="muted">—</span>'}</td></tr>`).join("")}</tbody></table></div></div>`;
    }).join("");
    const conArea = all.map((t) => Object.assign({ area: (M.areas.find((a) => a.trabajos.includes(t)) || {}).id }, t));
    const fila = (f) => {
      const ts = conArea.filter(enFase(f.id)), av = avance(ts), C = costos(ts.filter((t) => !t.cancelado));
      const cr = M.fases.find((o) => o.kind === f.id), actual = M.cur && cr && M.cur.kind === f.id;
      const fechas = cr ? dateRange(cr.real) + (cr.diferencia > 0 ? ` · <span class="t-alert">+${cr.diferencia} d</span>` : "") : "";
      const tipM = `${rowT("En revisión", moneyK(C.enRevision))}${rowT("Aprobado", moneyK(C.aprobado))}${rowT("Incurrido", moneyK(C.incurrido))}`;
      return `<details class="fs k-${f.id} ${actual ? "cur" : ""}"><summary class="fs-row" ${tipAttr(tipM)}>
          <span class="fs-nm"><b><i class="dot k-${f.id}"></i>${f.nombre}${actual ? '<em class="chip">etapa actual</em>' : ""}</b><small>${fechas}</small></span>
          <span class="fs-dt">${datos(av)}</span>
          ${barra(av.pct)}</summary>
        <div class="fs-body">${lista(ts) || empty("Sin trabajos en esta fase.")}</div></details>`;
    };
    const tav = avance(all.filter(conFase)), TC = costos(all.filter((t) => !t.cancelado && conFase(t)));
    const total = `<div class="fs-row fs-tot"><span class="fs-nm"><b>Total planificado</b></span><span class="fs-dt">${datos(tav)}</span>${barra(tav.pct)}</div>`;
    return card("Avance por fase", `<div class="fs-list ${grande ? "grande" : ""}">${FASES.map(fila).join("")}${total}</div>`,
      Object.assign({ right: "clic en una fase para ver sus trabajos" }, grande ? { cls: "wide" } : {}));
  }
  function gruposHTML(M, a, q) {
    const ql = (q || "").trim().toLowerCase();
    const grupos = [];
    a.trabajos.filter(enFase(FASE)).filter((t) => !ql || (t.nombre + " " + t.grupo + " " + t.fase).toLowerCase().includes(ql)).forEach((t) => {
      let g = grupos.find((x) => x.nombre === t.grupo); if (!g) grupos.push((g = { nombre: t.grupo, items: [] })); g.items.push(t);
    });
    const ccName = (ids) => ids.map((id) => (M.centros.find((c) => c.id === id) || {}).nombre || "?").join(", ");
    const row = (t) => `<tr class="${t.cancelado ? "cancel" : ""}"><td><b>${esc(t.nombre)}</b><small>${t.cc.length ? esc(ccName(t.cc)) : '<span class="t-alert">sin centro de costo</span>'}</small>${notaTxt(t)}</td>
      <td>${esc(t.fase || "—")}</td><td class="nw">${t.cancelado ? '<span class="chip">Cancelado</span>' : `${bar(t.pct)} ${t.pct}%`}</td><td class="n">${t.duracion || '<span class="muted">—</span>'}</td>
      <td>${chipEtapa(t)}</td><td class="n">${m3(t.preliminar, "pre")}</td><td class="n">${m3(t.enRevision, "rev")}</td><td class="n">${m3(t.aprobado, "apr")}</td><td class="n">${mcell(t.proyectado)}</td><td class="n">${mcell(t.po)}</td><td class="n">${mcell(t.incurrido)}</td>
      <td class="nw">${t.fin ? fmtShort(t.fin) : '<span class="muted">—</span>'}</td></tr>`;
    if (!grupos.length) return empty(ql ? "Ningún trabajo coincide con la búsqueda." : "No hay trabajos planificados en esta fase.");
    return grupos.map((g) => {
      const G = costos(g.items.filter((t) => !t.cancelado)), gav = avance(g.items);
      return `<details class="grp" ${grupos.length <= 4 || ql ? "open" : ""}><summary><b>${esc(g.nombre)}</b><span>${plural(g.items.length, "trabajo", "trabajos")} · avance ${pct(gav.pct, 0)} · <span class="t-pre">preliminar ${moneyK(G.preliminar)}</span>${G.enRevision ? ` · <span class="t-rev">en revisión ${moneyK(G.enRevision)}</span>` : ""} · <span class="t-apr">aprobado ${moneyK(G.aprobado)}</span></span></summary>
        <div class="scroll"><table class="tbl"><thead><tr><th>Trabajo</th><th>Fase</th><th>Estado</th><th class="n">Duración</th><th>Costo</th><th class="n t-pre">Preliminar</th><th class="n t-rev">En revisión</th><th class="n t-apr">Aprobado</th><th class="n">Proyectado</th><th class="n">PO</th><th class="n">Incurrido</th><th>Fin</th></tr></thead>
        <tbody>${g.items.map(row).join("")}</tbody></table></div></details>`;
    }).join("");
  }

  function viewArea(M, a, q) {
    // Con una fase elegida, los indicadores son solo de esa fase; con "Todas", de todo el tablero
    const ts = FASE === "todas" ? a.trabajos : a.trabajos.filter(enFase(FASE)), act = ts.filter((t) => !t.cancelado);
    const C = costos(act), av = avance(ts);
    const est = {}, plan = a.trabajos.filter(enFase(FASE)), ocultos = a.trabajos.length - a.trabajos.filter(conFase).length;
    plan.filter((t) => !t.cancelado).forEach((t) => (est[t.estado || "—"] = (est[t.estado || "—"] || 0) + 1));
    const sinDur = plan.filter((t) => !t.cancelado && !(t.duracion > 0) && t.costo !== "descartado").length;
    const pa = partDe(M, a.id);
    const fNom = (FASES.find((f) => f.id === FASE) || {}).nombre;
    return `<div class="fase-bar">${faseSel(a.trabajos)}<small>${FASE === "todas" ? "Indicadores de todo el tablero · lista de trabajos con fase" : `Indicadores y lista solo de <b>${fNom}</b>`}</small></div>
      <div class="kpis ${pa ? "k8" : "k7"}">${costKpis(C, av, { direccion: estadoDireccion(M), trabajos: a.trabajos })}${pa ? partKpi(M, pa, "Participación · " + a.nombre) : ""}</div>
      ${card(`Trabajos · ${esc(a.tablero)}${FASE !== "todas" ? ` · ${(FASES.find((f) => f.id === FASE) || {}).nombre}` : ""}`, `<div class="toolbar"><label class="search">${icon("search")}<input id="q" type="search" placeholder="Buscar trabajo…" value="${esc(q || "")}" aria-label="Buscar trabajo"></label>
        <span class="muted sm">${plural(plan.length, FASE === "todas" ? "trabajo con fase" : "trabajo", FASE === "todas" ? "trabajos con fase" : "trabajos")} · ${Object.entries(est).map(([e, n]) => `${esc(e)}: ${n}`).join(" · ")}${ocultos && FASE === "todas" ? ` · ${ocultos === 1 ? "no se muestra 1 trabajo" : `no se muestran ${ocultos} trabajos`} sin fase (No Aplica)` : ""}${sinDur ? ` · <span class="t-warn">${sinDur} sin duración: no cuentan en el avance</span>` : ""}</span></div><div id="grupos">${gruposHTML(M, a, q)}</div>`, { cls: "wide", right: "agrupados como en Monday" })}`;
  }

  function viewCrono(M) {
    const rows = M.D.cronograma.map((r) => {
      const late = r.diferencia > 0;
      return `<tr><td><b>${esc(r.nombre)}</b><small>${esc(GRUPO_NOMBRE(r.grupo))}${r.duracion === 0 ? " · hito" : ""}</small></td><td>${esc(r.estado || "—")}</td>
        <td class="nw">${dateRange(r.real)}</td><td class="nw">${dateRange(r.base)}</td>
        <td class="n ${late ? "t-alert b" : ""}">${r.diferencia == null ? "—" : (r.diferencia > 0 ? "+" : "") + r.diferencia + " d"}</td>
        <td class="n">${r.duracion == null ? "—" : r.duracion}</td></tr>`;
    }).join("");
    const sel = `<div class="seg dark" role="group" aria-label="Vista">${[["plan", "Plan vs real"], ["estado", "Estado"]].map(([id, n]) => `<button type="button" data-vista="${id}" aria-pressed="${VISTA_CRONO === id}">${n}</button>`).join("")}</div>`;
    return `${card("Cronograma", `<div class="gx-bar-top">${sel}</div>` + ganttHTML(M), { cls: "wide dark", right: "tablero Cronograma de Monday" })}
      ${card("Elementos del cronograma", `<div class="scroll"><table class="tbl"><thead><tr><th>Elemento</th><th>Estado</th><th>Fecha real</th><th>Línea base</th><th class="n">Diferencia</th><th class="n">Duración</th></tr></thead><tbody>${rows}</tbody></table></div>`, { cls: "wide" })}`;
  }

  // =========================================================
  // Render
  // =========================================================
  const app = $("app");
  let MODEL = null, VIEW = "resumen";
  const QUERY = {};
  const tabs = (M) => [{ id: "resumen", nombre: "Resumen gerencial", icono: "grid" }]
    .concat(M.areas.map((a) => ({ id: a.id, nombre: a.nombre, icono: AREA_ICON[a.id] || "grid", badge: pct(avance(a.trabajos).pct, 0) })))
    .concat([{ id: "cronograma", nombre: "Cronograma", icono: "calendar" }]);

  function render() {
    if (!MODEL) return;
    const M = MODEL;
    const key = decodeURIComponent(location.hash.slice(1)) || "resumen";
    const area = M.areas.find((a) => a.id === key);
    VIEW = area ? key : key === "cronograma" ? "cronograma" : "resumen";
    $("tabs").innerHTML = tabs(M).map((t) => `<a class="tab" href="#${t.id}" ${t.id === VIEW ? 'aria-current="page"' : ""}>${icon(t.icono)}${esc(t.nombre)}${t.badge ? `<span class="badge">${t.badge}</span>` : ""}</a>`).join("");
    $("hero-title").textContent = area ? "Área de " + area.nombre : VIEW === "cronograma" ? "Cronograma" : "Resumen gerencial";
    $("hero-sub").textContent = `M/V ${M.D.proyecto} · datos de Monday leídos el ${fmtDate(M.D.extraido)}`;
    $("upd-date").textContent = fmtDate(TODAY);
    document.title = (area ? area.nombre : VIEW === "cronograma" ? "Cronograma" : "Resumen") + " · Control de Dique · Rev. 3";
    $("voyage").innerHTML = voyageHTML(M);
    sailShip();
    app.innerHTML = area ? viewArea(M, area, QUERY[area.id]) : VIEW === "cronograma" ? viewCrono(M) : viewResumen(M);
    app.querySelectorAll(".gantt").forEach(layoutMl);
  }

  // Búsqueda dentro de un área sin perder el foco del campo
  app.addEventListener("input", (e) => {
    if (e.target.id !== "q") return;
    QUERY[VIEW] = e.target.value;
    const area = MODEL.areas.find((a) => a.id === VIEW);
    if (area) $("grupos").innerHTML = gruposHTML(MODEL, area, QUERY[VIEW]);
  });
  app.addEventListener("click", (e) => {
    const v = e.target.closest("[data-vista]");
    if (v) { VISTA_CRONO = v.dataset.vista; try { localStorage.setItem("dique-vista-crono", VISTA_CRONO); } catch (err) {} const y = scrollY; render(); scrollTo({ top: y }); return; }
    const b = e.target.closest("[data-fase]");
    if (!b) return;
    FASE = b.dataset.fase;
    try { localStorage.setItem("dique-fase", FASE); } catch (err) {}
    const y = scrollY; render(); scrollTo({ top: y });
  });
  addEventListener("hashchange", () => { render(); window.scrollTo({ top: 0 }); });
  let rt, lastW = innerWidth;
  addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { if (innerWidth !== lastW) { lastW = innerWidth; render(); } }, 150); });

  // Tooltip
  const tip = $("tip");
  document.addEventListener("mousemove", (e) => {
    const t = e.target.closest && e.target.closest("[data-tip]");
    if (!t) { if (!tip.hidden) tip.hidden = true; return; }
    tip.innerHTML = t.getAttribute("data-tip");
    tip.hidden = false;
    const r = tip.getBoundingClientRect();
    let left = e.clientX + 14, top = e.clientY + 14;
    if (left + r.width > innerWidth - 8) left = e.clientX - r.width - 14;
    if (top + r.height > innerHeight - 8) top = e.clientY - r.height - 14;
    tip.style.left = Math.max(8, left) + "px";
    tip.style.top = Math.max(8, top) + "px";
  });
  document.addEventListener("scroll", () => (tip.hidden = true), { passive: true });

  // Carga
  try {
    if (!window.DIQUE_MONDAY || !Array.isArray(window.DIQUE_MONDAY.areas)) throw new Error("Falta monday.js o está en un formato anterior (se genera con python monday/generar.py).");
    MODEL = build(window.DIQUE_MONDAY);
    const errs = (window.DIQUE_MONDAY.observaciones || []).filter((o) => o.nivel === "error");
    if (errs.length) app.insertAdjacentHTML("beforebegin", `<div class="notice">Los datos de Monday tienen ${errs.length} error(es). <a href="verificar.html">Ver la verificación</a></div>`);
    render();
  } catch (err) {
    app.innerHTML = `<div class="notice">No se pudo cargar el dashboard: ${esc(err.message)}</div>`;
    console.error(err);
  }
  window.Dique = { modelo: () => MODEL, revision: 3 };
})();
