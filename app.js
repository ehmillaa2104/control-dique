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
    trend: '<path d="M4 17l5-5 4 3 7-8"/><path d="M15 7h5v5"/>', doc: '<path d="M7 3.5h7l4 4V20a.5.5 0 0 1-.5.5h-10.5a.5.5 0 0 1-.5-.5V4a.5.5 0 0 1 .5-.5z"/><path d="M14 3.5V8h4M9 12.5h6M9 16h6"/>',
    wallet: '<path d="M4 7.5h14.5a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5H5.5A1.5 1.5 0 0 1 4 18V6.5A1.5 1.5 0 0 1 5.5 5H16"/><path d="M15.5 13.5h2"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>', gauge: '<path d="M4.5 16a7.5 7.5 0 1 1 15 0"/><path d="M12 16l3.5-4.5"/><circle cx="12" cy="16" r="1.2"/>',
    grid: '<rect x="4" y="4" width="7" height="7" rx="1.2"/><rect x="13" y="4" width="7" height="7" rx="1.2"/><rect x="4" y="13" width="7" height="7" rx="1.2"/><rect x="13" y="13" width="7" height="7" rx="1.2"/>',
    ruler: '<path d="M4 17.5L17.5 4 20 6.5 6.5 20z"/><path d="M8 13.5l1.5 1.5M10.5 11l1.5 1.5M13 8.5l1.5 1.5"/>',
    anchor: '<circle cx="12" cy="5" r="2"/><path d="M12 7v13M5 13a7 7 0 0 0 14 0M8 11h8"/>',
    wrench: '<path d="M14.5 5.5a4 4 0 0 0 4.8 4.8l-9 9a2 2 0 0 1-2.8-2.8l9-9a4 4 0 0 1-2-2z"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/>'
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
    const centros = D.centros.map((c) => Object.assign({}, c, { items: c.lineas.map((id) => byId.get(id)).filter(Boolean) })).sort(byCode);

    // Cronograma: elementos con fecha real; hitos = duración 0
    const crono = D.cronograma.filter((r) => Array.isArray(r.real)).map((r) => Object.assign({}, r, {
      done: /listo/i.test(r.estado || ""), kind: kindOf(r.nombre, r.grupo), hito: r.duracion === 0
    }));
    const hitos = crono.filter((r) => r.hito).sort((a, b) => (a.real[0] < b.real[0] ? -1 : 1));
    const fases = crono.filter((r) => !r.hito && !/sub/.test(r.kind));
    // Etapa actual: la fase que contiene hoy (si hay dos, la que empezó más tarde)
    const inn = fases.filter((o) => o.real[0] <= TODAY && TODAY <= o.real[1]).sort((a, b) => (a.real[0] < b.real[0] ? 1 : -1));
    const cur = inn[0] || fases.filter((o) => o.real[0] > TODAY).sort((a, b) => (a.real[0] < b.real[0] ? -1 : 1))[0] || fases[fases.length - 1] || null;
    const lastHito = hitos.filter((h) => h.done).pop() || null;
    const nextHito = hitos.find((h) => !h.done) || null;
    // Atraso del proyecto = Diferencia del último hito (fin del proyecto, p. ej. On Hire)
    const finHito = hitos[hitos.length - 1] || null;
    const abiertos = crono.filter((r) => !r.done && r.diferencia > 0).sort((a, b) => b.diferencia - a.diferencia);
    return { D, areas, byId, centros, crono, hitos, fases, cur, lastHito, nextHito, finHito, peorAtraso: abiertos[0] || null };
  }

  const costos = (arr) => ({
    aprobado: sum(arr, (x) => x.aprobado), proyectado: sum(arr, (x) => x.proyectado), po: sum(arr, (x) => x.po),
    incurrido: sum(arr, (x) => x.incurrido), revisado: sum(arr, (x) => x.revisado), solicitado: sum(arr, (x) => x.solicitado)
  });
  // Avance físico = Σ (Estado % × Duración) / Σ Duración (como la columna "Avance" de Monday)
  function avance(trabajos) {
    const act = trabajos.filter((t) => !t.cancelado);
    const con = act.filter((t) => t.duracion > 0);
    const dur = sum(con, (t) => t.duracion);
    return { pct: dur ? sum(con, (t) => t.duracion * t.pct) / dur : 0, n: act.length, conDur: con.length, dur };
  }

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
  const itemName = (o) => (o.kind === "tras" ? o.nombre : KIND_NOMBRE[o.kind] || o.nombre);
  const itemTip = (o) => tipAttr(`<b>${esc(o.nombre)}</b>${rowT("Fecha real", dateRange(o.real))}${rowT("Línea base", dateRange(o.base))}${rowT("Estado", esc(o.estado || "—"))}${rowT("Diferencia", difTxt(o.diferencia, false))}` +
    (o.duracion > 0 && Math.abs(daysBetween(o.real[0], o.real[1]) + 1 - o.duracion) > 1 ? `<div class="tnote alert">En Monday la duración dice ${o.duracion} días, pero la fecha real cubre ${daysBetween(o.real[0], o.real[1]) + 1}.</div>` : ""));

  function timeScale(items) {
    const dates = items.flatMap((o) => o.real.concat(o.base || [])).concat([TODAY]).sort();
    const origin = addDays(parse(dates[0]), -1), span = daysBetween(dates[0], dates[dates.length - 1]) + 3;
    const t = (s) => (parse(s) - origin) / DAY;
    const X = (v) => Math.max(0, Math.min(100, (v / span) * 100));
    return { origin, span, t, xs: (s) => X(t(s)), xe: (s) => X(t(s) + 1), xm: (s) => X(t(s) + 0.5) };
  }

  function ganttHTML(M) {
    const items = M.crono;
    if (!items.length) return '<div class="empty">El tablero Cronograma no tiene fechas.</div>';
    const S = timeScale(items);
    const hoyX = S.xm(TODAY);
    const lanes = [];
    items.forEach((o) => { let L = lanes.find((l) => l.grupo === o.grupo); if (!L) lanes.push((L = { grupo: o.grupo, items: [], hitos: [] })); (o.hito ? L.hitos : L.items).push(o); });
    const lane = (L) => {
      const all = L.items.concat(L.hitos), st = all.map((o) => o.real[0]).sort(), en = all.map((o) => o.real[1]).sort();
      const drawn = [];
      const bars = L.items.slice().sort((a, b) => daysBetween(b.real[0], b.real[1]) - daysBetween(a.real[0], a.real[1])).map((o) => {
        // Una actividad que se monta más de un día sobre otra de la misma fila va como barra fina
        const over = drawn.some((d) => Math.min(S.t(d.real[1]), S.t(o.real[1])) + 1 - Math.max(S.t(d.real[0]), S.t(o.real[0])) > 1);
        drawn.push(o);
        const thin = over || /sub/.test(o.kind), vencido = !o.done && o.real[1] < TODAY;
        const l = S.xs(o.real[0]), w = S.xe(o.real[1]) - l;
        let h = `<i class="bar k-${o.kind.replace("sub ", "")} ${thin ? "thin" : ""} ${vencido ? "over" : ""}" style="left:${l}%;width:${w}%" ${itemTip(o)}>${!thin && w > 8 ? `<b>${esc(itemName(o))}</b>` : ""}</i>`;
        if (o.base && !thin) h += `<i class="base" style="left:${S.xs(o.base[0])}%;width:${S.xe(o.base[1]) - S.xs(o.base[0])}%"></i>`;
        if (o.base && o.diferencia > 0 && o.real[1] > o.base[1]) {
          h += `<i class="atr ${thin ? "thin" : ""}" style="left:${S.xe(o.base[1])}%;width:${S.xe(o.real[1]) - S.xe(o.base[1])}%" ${itemTip(o)}></i><span class="dly" style="left:${S.xe(o.real[1])}%">+${o.diferencia} d</span>`;
        }
        return h;
      }).join("");
      const hs = L.hitos.map((o) => {
        const late = !o.done && (o.diferencia > 0 || o.real[0] < TODAY), x = S.xm(o.real[0]);
        let h = "";
        if (o.base && o.base[0] !== o.real[0]) {
          const bx = S.xm(o.base[0]);
          h += `<i class="hc ${o.diferencia > 0 ? "late" : ""}" style="left:${Math.min(x, bx)}%;width:${Math.abs(x - bx)}%"></i><i class="hg" style="left:${bx}%" ${itemTip(o)}></i>`;
        }
        return h + `<i class="hd ${o.done ? "ok" : late ? "late" : ""}" style="left:${x}%" ${itemTip(o)}></i>`;
      }).join("");
      return `<div class="g-lane"><div class="g-ln"><b>${esc(GRUPO_NOMBRE(L.grupo))}</b><small>${dateRange([st[0], en[en.length - 1]])}</small></div>
        <div class="g-lt">${bars}${hs}<i class="veil" style="left:${hoyX}%"></i><i class="now" style="left:${hoyX}%"></i></div></div>`;
    };
    const ticks = [];
    for (let d = new Date(S.origin); S.t(iso(d)) <= S.span; d = addDays(d, 1)) if (d.getDay() === 1) ticks.push(iso(d));
    const axis = ticks.map((d, i) => `<i class="tk ${i % 2 ? "odd" : ""}" style="left:${S.xs(d)}%"><span>${fmtShort(d)}</span></i>`).join("");
    const mls = M.hitos.map((o) => {
      const late = !o.done && (o.diferencia > 0 || o.real[0] < TODAY), x = S.xm(o.real[0]);
      return `<span class="ml r0 ${x < 8 ? "l" : x > 92 ? "r" : ""} ${late ? "late" : o.done ? "ok" : ""}" style="left:${x}%" ${itemTip(o)}>${esc(o.nombre)} <em>${fmtShort(o.real[0])}${o.diferencia > 0 ? ` · +${o.diferencia} d` : ""}</em></span>`;
    }).join("");
    return `<div class="gantt">
      <div class="g-lane top"><div class="g-ln"></div><div class="g-lt"><span class="g-today" style="left:${hoyX}%">Hoy ${fmtShort(TODAY)}</span></div></div>
      ${lanes.map(lane).join("")}
      <div class="g-lane axis"><div class="g-ln"></div><div class="g-lt">${axis}</div></div>
      <div class="g-lane mls"><div class="g-ln"></div><div class="g-lt">${mls}</div></div>
      <div class="g-foot"><span><i class="lg-bar"></i>Fecha real</span><span><i class="lg-base"></i>Línea base</span><span><i class="lg-late"></i>Atraso</span><span><i class="lg-h ok"></i>Hito cumplido</span><span><i class="lg-h late"></i>Hito atrasado</span></div>
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
    const bands = M.fases.map((o) => `<i class="vb k-${o.kind}" style="left:${S.xs(o.real[0])}%;width:${S.xe(o.real[1]) - S.xs(o.real[0])}%" ${itemTip(o)}></i>`).join("");
    const hs = M.hitos.map((o) => {
      const late = !o.done && (o.diferencia > 0 || o.real[0] < TODAY);
      return `<i class="vh ${o.done ? "ok" : late ? "late" : ""}" style="left:${S.xm(o.real[0])}%" ${itemTip(o)}></i>`;
    }).join("");
    const c = M.cur;
    const dia = c ? daysBetween(c.real[0], TODAY) + 1 : 0, dias = c ? daysBetween(c.real[0], c.real[1]) + 1 : 0;
    const etapa = c ? `<b>${esc(itemName(c))}</b>${dia >= 1 && dia <= dias ? ` · día ${dia} de ${dias}` : ""}` : "—";
    const hitoTxt = (h, prox) => {
      if (!h) return '<b class="muted">—</b>';
      const cuando = h.real[0] === TODAY ? "hoy" : fmtShort(h.real[0]);
      const late = !h.done && (h.diferencia > 0 || h.real[0] < TODAY);
      return `<b>${esc(h.nombre)}</b><span>${cuando}${h.done ? " · cumplido" : ""}${prox && h.diferencia > 0 ? ` · <em class="v-late">+${h.diferencia} d</em>` : prox && late ? ' · <em class="v-late">vencido</em>' : ""}</span>`;
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
  const kpi = (ic, lbl, val, sub, o = {}) => `<div class="card kpi ${o.alert ? "alert" : ""}" ${o.tip ? tipAttr(o.tip) : ""}>${icon(ic)}<div style="min-width:0"><div class="lbl">${lbl}</div><div class="val">${val}</div><div class="sub">${sub}</div></div></div>`;
  const empty = (txt) => `<div class="empty">${txt}</div>`;
  const bar = (p) => `<span class="pbar"><i style="width:${Math.max(0, Math.min(100, p))}%"></i></span>`;
  const mcell = (v) => (v ? moneyK(v) : '<span class="muted">—</span>');
  const chipAprob = (e) => (e ? `<span class="chip ${/aprob/i.test(e) ? "ok" : /descart|rechaz/i.test(e) ? "alert" : /revis/i.test(e) ? "warn" : ""}">${esc(e)}</span>` : '<span class="muted">—</span>');

  function costKpis(C, av, extra = {}) {
    const vsAprob = (v) => (C.aprobado ? `${((v / C.aprobado) * 100).toFixed(0)}% del aprobado` : "sin monto aprobado");
    const pend = extra.pendiente || 0;
    return [
      kpi("check", "Costo aprobado", moneyK(C.aprobado), pend ? `<span class="t-warn">${moneyK(pend)} solicitado sin aprobar</span>` : "aprobado por Dirección",
        { tip: `<b>Costo aprobado</b>${rowT("Aprobado Dirección", money(C.aprobado))}${rowT("Revisado Gerencia", money(C.revisado))}${rowT("Solicitado sin aprobar", money(pend))}` }),
      kpi("trend", "Proyectado", moneyK(C.proyectado), C.aprobado && C.proyectado ? `${C.proyectado >= C.aprobado ? "+" : ""}${((C.proyectado / C.aprobado - 1) * 100).toFixed(1)}% vs aprobado` : "costo final esperado",
        { alert: C.aprobado > 0 && C.proyectado > C.aprobado * 1.05 }),
      kpi("doc", "Órdenes de compra (PO)", moneyK(C.po), C.po ? vsAprob(C.po) : "sin órdenes de compra"),
      kpi("wallet", "Incurrido", moneyK(C.incurrido), C.po ? `${((C.incurrido / C.po) * 100).toFixed(0)}% de las PO` : C.incurrido ? vsAprob(C.incurrido) : "sin costo incurrido"),
      ...(extra.extraKpis || []),
      kpi("gauge", "Avance físico", pct(av.pct), av.n && !av.conDur ? `<span class="t-warn">0 de ${av.n} trabajos con duración</span>` : `${av.conDur} de ${av.n} trabajos con duración`,
        { tip: `<b>Avance físico</b><div class="tnote">Σ (Estado % × Duración) / Σ Duración, como la columna "Avance" de Monday.</div>${rowT("Trabajos", av.n)}${rowT("Con duración", av.conDur)}${rowT("Días totales", av.dur)}` })
    ].join("");
  }

  function atrasoKpi(M) {
    const f = M.finHito, p = M.peorAtraso;
    const d = f ? f.diferencia || 0 : 0;
    const val = Math.abs(d) < 0.5 ? "0 días" : d > 0 ? days1(d) : "-" + days1(-d);
    const sub = (f ? `${esc(f.nombre)} ${fmtShort(f.real[0])}${f.base ? ` · plan ${fmtShort(f.base[0])}` : ""}` : "sin hito final") +
      (p ? `<br><span class="t-alert">Mayor atraso: ${esc(p.nombre)} +${p.diferencia} d</span>` : "");
    return kpi("clock", "Atraso del cronograma", val, sub, {
      alert: d >= 2,
      tip: `<b>Atraso del cronograma</b><div class="tnote">Fecha real contra línea base (columna Diferencia del tablero Cronograma) en el último hito del proyecto.</div>` +
        M.crono.filter((r) => r.diferencia).map((r) => rowT(esc(r.nombre.split("*")[0].trim()), (r.diferencia > 0 ? "+" : "") + r.diferencia + " d")).join("")
    });
  }

  // Centros de costo, desplegables por grupo y por centro (con sus trabajos de P1, P2 y P3)
  function centrosCard(M) {
    const cols = (c, cls = "") => `<span class="n ${cls}">${mcell(c.aprobado)}</span><span class="n ${cls}">${mcell(c.proyectado)}</span><span class="n ${cls}">${mcell(c.po)}</span><span class="n ${cls}">${mcell(c.incurrido)}</span>`;
    const grupos = [];
    M.centros.forEach((c) => { let g = grupos.find((x) => x.nombre === c.grupo); if (!g) grupos.push((g = { nombre: c.grupo, items: [] })); g.items.push(c); });
    const estadoCC = (c) => `<span class="chip ${/aprob/i.test(c.estado) ? "ok" : /revis/i.test(c.estado) ? "warn" : ""}">${esc(c.estado || "Pendiente")}</span>`;
    const linea = (t) => `<div class="cc-line"><span class="nm">${esc(t.nombre)}<small>${esc(t.areaNombre)}${t.aprobacion ? " · " + esc(t.aprobacion) : ""}${t.solicitado && !t.aprobado ? ` · solicitado ${moneyK(t.solicitado)}` : ""}</small></span>${cols(t)}<span class="st"></span></div>`;
    const body = grupos.map((g) => {
      const G = costos(g.items);
      const rows = g.items.map((c) => {
        const sol = sum(c.items.filter((t) => !t.aprobado), (t) => t.solicitado);
        return `<details class="cc"><summary><span class="nm">${esc(c.nombre)}<small>${plural(c.items.length, "trabajo", "trabajos")}${sol ? ` · <span class="t-warn">${moneyK(sol)} solicitado</span>` : ""}</small></span>${cols(c)}<span class="st">${estadoCC(c)}</span></summary>
          <div class="cc-lines">${c.items.length ? c.items.map(linea).join("") : '<div class="empty sm">Sin trabajos conectados en P1, P2 ni P3.</div>'}</div></details>`;
      }).join("");
      return `<details class="cc-g"><summary><span class="nm">Grupo ${esc(g.nombre)}<small>${plural(g.items.length, "centro", "centros")} de costo</small></span>${cols(G, "b")}<span class="st"></span></summary>${rows}</details>`;
    }).join("");
    const T = costos(M.centros);
    return card("Centros de costo", `<div class="cc-table">
        <div class="cc-head"><span class="nm">Centro de costo</span><span class="n">Aprobado</span><span class="n">Proyectado</span><span class="n">PO</span><span class="n">Incurrido</span><span class="st">Estado</span></div>
        ${body}
        <div class="cc-total"><span class="nm">Total</span>${cols(T, "b")}<span class="st"></span></div>
      </div>`, { cls: "wide", right: "clic en un grupo o centro para desplegar" });
  }

  function cambiosCard(M) {
    const C = M.D.cambios.slice(0, 6);
    const chip = (e) => `<span class="chip ${/aprob/i.test(e) ? "ok" : /rechaz/i.test(e) ? "alert" : /solic/i.test(e) ? "warn" : ""}">${esc(e || "Sin estado")}</span>`;
    const cambios = C.length ? C.map((c) => `<div class="li"><div><b>${esc(c.nombre)}</b><small>${[c.tipo, c.costo ? moneyK(c.costo) : "", c.dias ? "+" + days1(c.dias) : "", c.creado ? fmtShort(c.creado) : ""].filter(Boolean).map(esc).join(" · ")}</small></div>${chip(c.estado)}</div>`).join("")
      : empty("Sin cambios ni imprevistos registrados en Monday.");
    // Última actividad: lo que se actualizó más recientemente en los tableros
    const recientes = M.areas.flatMap((a) => a.trabajos.map((t) => ({ n: t.nombre, b: a.nombre, f: t.actualizado })))
      .concat(M.D.cronograma.map((r) => ({ n: r.nombre.split("*")[0].trim(), b: "Cronograma", f: r.actualizado })))
      .filter((x) => x.f).sort((a, b) => (a.f < b.f ? 1 : a.f > b.f ? -1 : 0)).slice(0, 6);
    const act = recientes.map((x) => `<div class="li"><div><b>${esc(x.n)}</b><small>${esc(x.b)}</small></div><span class="muted sm nw">${fmtShort(x.f)}</span></div>`).join("");
    return card("Cambios recientes", `<div class="list">${cambios}</div><div class="sub-h">Última actividad en Monday</div><div class="list">${act || empty("Sin actividad.")}</div>`,
      { right: plural(M.D.cambios.length, "cambio o imprevisto", "cambios o imprevistos") });
  }

  function areaCards(M) {
    return `<div class="areas">${M.areas.map((a) => {
      const C = costos(a.act), av = avance(a.trabajos);
      const pend = sum(a.act.filter((t) => !t.aprobado), (t) => t.solicitado), sinCC = a.act.filter((t) => !t.cc.length).length;
      const est = {};
      a.act.forEach((t) => (est[t.estado || "—"] = (est[t.estado || "—"] || 0) + 1));
      return `<a class="card area" href="#${a.id}">
        <div class="area-h">${icon(AREA_ICON[a.id] || "grid")}<b>${esc(a.nombre)}</b><small>${esc(a.tablero)}</small></div>
        <div class="area-av"><span class="big">${pct(av.pct, 0)}</span>${bar(av.pct)}<small>avance · ${plural(av.n, "trabajo", "trabajos")}${av.n && !av.conDur ? " sin duración" : ""}</small></div>
        <div class="area-c"><div><small>Aprobado</small><b>${moneyK(C.aprobado)}</b></div><div><small>Proyectado</small><b>${moneyK(C.proyectado)}</b></div><div><small>PO</small><b>${moneyK(C.po)}</b></div><div><small>Incurrido</small><b>${moneyK(C.incurrido)}</b></div></div>
        <div class="area-f">${Object.entries(est).map(([e, n]) => `<span class="chip">${esc(e)} · ${n}</span>`).join("")}${pend ? `<span class="chip warn">${moneyK(pend)} sin aprobar</span>` : ""}${sinCC ? `<span class="chip alert">${sinCC} sin centro de costo</span>` : ""}</div>
      </a>`;
    }).join("")}</div>`;
  }

  // =========================================================
  // Vistas
  // =========================================================
  function viewResumen(M) {
    const all = M.areas.flatMap((a) => a.trabajos);
    const C = costos(M.centros);
    const pend = sum(all.filter((t) => !t.cancelado && !t.aprobado), (t) => t.solicitado);
    return `<div class="kpis k6">${costKpis(C, avance(all), { pendiente: pend, extraKpis: [atrasoKpi(M)] })}</div>
      <div class="row-b">${centrosCard(M)}${cambiosCard(M)}</div>
      <h2 class="sec">Resumen por área</h2>${areaCards(M)}`;
  }

  function gruposHTML(M, a, q) {
    const ql = (q || "").trim().toLowerCase();
    const grupos = [];
    a.trabajos.filter((t) => !ql || (t.nombre + " " + t.grupo + " " + t.fase).toLowerCase().includes(ql)).forEach((t) => {
      let g = grupos.find((x) => x.nombre === t.grupo); if (!g) grupos.push((g = { nombre: t.grupo, items: [] })); g.items.push(t);
    });
    const ccName = (ids) => ids.map((id) => (M.centros.find((c) => c.id === id) || {}).nombre || "?").join(", ");
    const row = (t) => `<tr class="${t.cancelado ? "cancel" : ""}"><td><b>${esc(t.nombre)}</b><small>${t.cc.length ? esc(ccName(t.cc)) : '<span class="t-alert">sin centro de costo</span>'}</small></td>
      <td>${esc(t.fase || "—")}</td><td class="nw">${t.cancelado ? '<span class="chip">Cancelado</span>' : `${bar(t.pct)} ${t.pct}%`}</td><td class="n">${t.duracion || '<span class="muted">—</span>'}</td>
      <td>${chipAprob(t.aprobacion)}</td><td class="n">${mcell(t.solicitado)}</td><td class="n">${mcell(t.aprobado)}</td><td class="n">${mcell(t.proyectado)}</td><td class="n">${mcell(t.po)}</td><td class="n">${mcell(t.incurrido)}</td>
      <td class="nw">${t.fin ? fmtShort(t.fin) : '<span class="muted">—</span>'}</td></tr>`;
    if (!grupos.length) return empty("Ningún trabajo coincide con la búsqueda.");
    return grupos.map((g) => {
      const G = costos(g.items.filter((t) => !t.cancelado)), gav = avance(g.items);
      return `<details class="grp" ${grupos.length <= 4 || ql ? "open" : ""}><summary><b>${esc(g.nombre)}</b><span>${plural(g.items.length, "trabajo", "trabajos")} · avance ${pct(gav.pct, 0)} · aprobado ${moneyK(G.aprobado)}${G.solicitado && !G.aprobado ? ` · solicitado ${moneyK(G.solicitado)}` : ""}</span></summary>
        <div class="scroll"><table class="tbl"><thead><tr><th>Trabajo</th><th>Fase</th><th>Estado</th><th class="n">Duración</th><th>Aprobación</th><th class="n">Solicitado</th><th class="n">Aprobado</th><th class="n">Proyectado</th><th class="n">PO</th><th class="n">Incurrido</th><th>Fin</th></tr></thead>
        <tbody>${g.items.map(row).join("")}</tbody></table></div></details>`;
    }).join("");
  }

  function viewArea(M, a, q) {
    const C = costos(a.act), av = avance(a.trabajos);
    const pend = sum(a.act.filter((t) => !t.aprobado), (t) => t.solicitado);
    const est = {};
    a.act.forEach((t) => (est[t.estado || "—"] = (est[t.estado || "—"] || 0) + 1));
    return `<div class="kpis k5">${costKpis(C, av, { pendiente: pend })}</div>
      ${card(`Trabajos · ${esc(a.tablero)}`, `<div class="toolbar"><label class="search">${icon("search")}<input id="q" type="search" placeholder="Buscar trabajo…" value="${esc(q || "")}" aria-label="Buscar trabajo"></label>
        <span class="muted sm">${plural(a.trabajos.length, "trabajo", "trabajos")} · ${Object.entries(est).map(([e, n]) => `${esc(e)}: ${n}`).join(" · ")}</span></div><div id="grupos">${gruposHTML(M, a, q)}</div>`, { cls: "wide", right: "agrupados como en Monday" })}`;
  }

  function viewCrono(M) {
    const rows = M.D.cronograma.map((r) => {
      const late = r.diferencia > 0;
      return `<tr><td><b>${esc(r.nombre)}</b><small>${esc(GRUPO_NOMBRE(r.grupo))}${r.duracion === 0 ? " · hito" : ""}</small></td><td>${esc(r.estado || "—")}</td>
        <td class="nw">${dateRange(r.real)}</td><td class="nw">${dateRange(r.base)}</td>
        <td class="n ${late ? "t-alert b" : ""}">${r.diferencia == null ? "—" : (r.diferencia > 0 ? "+" : "") + r.diferencia + " d"}</td>
        <td class="n">${r.duracion == null ? "—" : r.duracion}</td></tr>`;
    }).join("");
    return `${card("Cronograma · fecha real contra línea base", ganttHTML(M), { cls: "wide dark", right: "tablero Cronograma de Monday" })}
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
