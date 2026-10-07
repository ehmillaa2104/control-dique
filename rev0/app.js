(function () {
  "use strict";

  const DAY = 864e5;
  const $ = (id) => document.getElementById(id);

  // =========================================================
  // Formatos
  // =========================================================
  const parse = (s) => new Date(s + "T00:00:00");
  const isDate = (s) => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(parse(s));
  const iso = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const addDays = (d, n) => new Date(d.getTime() + n * DAY);
  const toD = (d) => (typeof d === "string" ? parse(d) : d);
  const fmtDate = (d) => toD(d).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
  const fmtShort = (d) => toD(d).toLocaleDateString("es-ES", { day: "2-digit", month: "short" });

  let CUR = "US$";
  const money = (v) => (v < 0 ? "- " : "") + CUR + " " + Math.round(Math.abs(v)).toLocaleString("en-US");
  const moneyK = (v) => {
    const a = Math.abs(v), s = v < 0 ? "- " : "";
    if (a >= 1e6) return s + CUR + " " + (a / 1e6).toFixed(2) + " M";
    if (a >= 1e3) return s + CUR + " " + (a / 1e3).toFixed(1) + " k";
    return s + CUR + " " + Math.round(a);
  };
  const pct = (v, d = 1) => v.toFixed(d) + "%";
  // Antepone signo solo si el valor formateado no es cero (evita "+0.0" y "- 0.0")
  const sgn = (v, f) => {
    const txt = f(Math.abs(v));
    if (txt === f(0)) return txt;
    return (v > 0 ? "+ " : "- ") + txt;
  };
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const plural = (n, s, p) => n + " " + (n === 1 ? s : p);
  const days1 = (v) => v.toFixed(1).replace(/\.0$/, "") + (Math.abs(v) === 1 ? " día" : " días");

  // =========================================================
  // Íconos (trazo, heredan currentColor)
  // =========================================================
  const ICONS = {
    ship: '<path d="M3 16l2.2 4h13.6l2.2-4z"/><path d="M5 16v-5h14v5"/><path d="M9 11V6h6v5"/><path d="M12 3v3"/>',
    clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 3h6v3H9z"/><path d="M9 11h6M9 15h4"/>',
    dollar: '<circle cx="12" cy="12" r="9"/><path d="M15 9.2c-.5-.9-1.6-1.4-3-1.4-1.7 0-3 .8-3 2s1.3 1.7 3 2 3 .8 3 2-1.3 2-3 2c-1.4 0-2.5-.5-3-1.4M12 6v12"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    anchor: '<circle cx="12" cy="5" r="2"/><path d="M12 7v14M5 13a7 7 0 0 0 14 0M8 11h8"/>',
    ruler: '<path d="M4 20V4l16 16z"/><path d="M8 16v-4l4 4z"/><path d="M4 8h2M4 12h2"/>',
    wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3.5 17.5a2.1 2.1 0 0 0 3 3l5.8-5.8a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/>',
    grid: '<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/>',
    gauge: '<path d="M4 17a8 8 0 1 1 16 0"/><path d="M12 17l4-5"/><circle cx="12" cy="17" r="1"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    hourglass: '<path d="M7 3h10M7 21h10M8 3c0 5 8 5 8 9s-8 4-8 9M16 3c0 5-8 5-8 9s8 4 8 9"/>',
    plus: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M12 8v8M8 12h8"/>',
    alert: '<path d="M12 3.5l9 16H3z"/><path d="M12 10v4M12 17h.01"/>',
    down: '<path d="M12 4v15M6 13l6 6 6-6"/>',
    up: '<path d="M12 20V5M6 11l6-6 6 6"/>',
    check: '<path d="M5 12l4 4 10-10"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/>',
    chevron: '<path d="M9 6l6 6-6 6"/>',
    flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
    play: '<path d="M7 5l12 7-12 7z"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    expand: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
    updown: '<path d="M12 4v16M8 8l4-4 4 4M8 16l4 4 4-4"/>'
  };
  const icon = (name, cls = "ic") => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ICONS.target}</svg>`;

  // =========================================================
  // Modelo: valida los datos de entrada y los normaliza
  // =========================================================
  const LEVELS = [
    { k: "muy-alto", label: "Muy alto", color: "var(--lv1)", min: 17 },
    { k: "alto", label: "Alto", color: "var(--lv2)", min: 10 },
    { k: "medio", label: "Medio", color: "var(--lv3)", min: 5 },
    { k: "bajo", label: "Bajo", color: "var(--lv4)", min: 1 }
  ];
  const isScore = (v) => Number.isInteger(v) && v >= 1 && v <= 5;

  function build(raw) {
    if (!raw || typeof raw !== "object") throw new Error("No se recibieron datos.");
    const warn = [];
    const P = Object.assign({}, raw.proyecto);
    ["entrada", "salidaPlan"].forEach((k) => {
      if (!isDate(P[k])) throw new Error(`proyecto.${k} falta o no tiene formato AAAA-MM-DD.`);
    });
    if (!isDate(P.corte)) {
      P.corte = iso(new Date());
      warn.push("proyecto.corte no está definido: se usa la fecha de hoy.");
    }
    CUR = P.moneda || "US$";
    const start = parse(P.entrada);
    const dn = (s) => Math.round((parse(s) - start) / DAY);
    const N = dn(P.salidaPlan);
    if (N <= 0) throw new Error("La desvarada planificada debe ser posterior a la entrada a dique.");
    const AT = dn(P.corte) + 1; // días transcurridos al cierre del día de corte
    if (AT < 1) throw new Error("La fecha de corte es anterior a la entrada a dique.");

    const areas = (raw.areas || []).filter((a, i) => {
      if (!a || !a.id || !a.nombre) { warn.push(`Área ${i + 1}: falta id o nombre; se omite.`); return false; }
      return true;
    });
    if (!areas.length) throw new Error("No hay áreas definidas.");
    const areaIds = new Set(areas.map((a) => a.id));

    const ots = [];
    const seen = new Set();
    (raw.ordenes || []).forEach((o, i) => {
      const tag = `OT ${o && o.id ? o.id : "fila " + (i + 1)}`;
      if (!o || !o.id) return warn.push(`${tag}: sin id; se omite.`);
      if (seen.has(o.id)) return warn.push(`${tag}: id duplicado; se omite.`);
      if (!areaIds.has(o.area)) return warn.push(`${tag}: el área "${o.area}" no existe; se omite.`);
      if (!(typeof o.bac === "number" && o.bac > 0)) return warn.push(`${tag}: el presupuesto (bac) debe ser un número mayor que 0; se omite.`);
      if (!isDate(o.inicio) || !isDate(o.fin) || o.fin < o.inicio) return warn.push(`${tag}: fechas de inicio y fin inválidas; se omite.`);
      if (dn(o.inicio) < 0 || dn(o.fin) >= N) warn.push(`${tag}: sus fechas quedan fuera del período en dique.`);
      seen.add(o.id);
      ots.push(Object.assign({}, o, { i0: dn(o.inicio), dur: dn(o.fin) - dn(o.inicio) + 1, hist: [] }));
    });
    const byId = new Map(ots.map((o) => [o.id, o]));

    (raw.avances || []).forEach((r, i) => {
      const [f, id, p, c] = Array.isArray(r) ? r : [r.fecha, r.ot, r.pct, r.costo];
      const tag = `Avance fila ${i + 1}`;
      const o = byId.get(id);
      if (!o) return warn.push(`${tag}: la OT "${id}" no existe; se ignora.`);
      if (!isDate(f)) return warn.push(`${tag} (${id}): fecha inválida; se ignora.`);
      if (f > P.corte) return warn.push(`${tag} (${id}): fecha posterior al corte; se ignora.`);
      if (typeof p !== "number" || p < 0 || p > 100) return warn.push(`${tag} (${id}): el avance debe estar entre 0 y 100; se ignora.`);
      let cost = c;
      if (cost != null && !(typeof cost === "number" && cost >= 0)) {
        warn.push(`${tag} (${id}): costo inválido; se toma como sin dato.`);
        cost = null;
      }
      const t = dn(f) + 1;
      const prev = o.hist.findIndex((h) => h.t === t);
      const h = { t, f, p, c: cost == null ? null : cost };
      if (prev >= 0) o.hist[prev] = h; else o.hist.push(h);
    });
    ots.forEach((o) => {
      o.hist.sort((a, b) => a.t - b.t);
      for (let k = 1; k < o.hist.length; k++) {
        if (o.hist[k].p < o.hist[k - 1].p) warn.push(`OT ${o.id}: el avance baja de ${o.hist[k - 1].p}% a ${o.hist[k].p}% el ${fmtShort(o.hist[k].f)}.`);
      }
    });
    const hasCost = ots.some((o) => o.hist.some((h) => h.c != null));
    if (hasCost) {
      ots.forEach((o) => {
        const l = o.hist[o.hist.length - 1];
        if (l && l.p > 0 && l.c == null) warn.push(`OT ${o.id}: tiene avance pero no tiene costo; su CPI no se calcula.`);
      });
    }

    const inArea = (name) => (x, i) => {
      if (!x || !areaIds.has(x.area)) { warn.push(`${name} ${i + 1}: el área "${x && x.area}" no existe; se omite.`); return false; }
      return true;
    };
    const hitos = (raw.hitos || []).filter(inArea("Hito")).filter((h, i) => {
      if (!h.nombre || !isDate(h.fechaPlan)) { warn.push(`Hito "${h.nombre || i + 1}": falta nombre o fecha planificada; se omite.`); return false; }
      if (h.fechaReal != null && !isDate(h.fechaReal)) { warn.push(`Hito "${h.nombre}": fecha real inválida; se toma como no completado.`); h.fechaReal = null; }
      return true;
    });
    const riesgos = (raw.riesgos || []).filter(inArea("Riesgo")).map((r) => {
      let lv = null, score = null;
      if (isScore(r.prob) && isScore(r.impacto)) {
        score = r.prob * r.impacto;
        lv = LEVELS.find((l) => score >= l.min);
      } else if (r.nivel) {
        lv = LEVELS.find((l) => l.k === r.nivel) || null;
      }
      if (!lv) { warn.push(`Riesgo "${r.desc}": falta probabilidad e impacto (1 a 5); se omite.`); return null; }
      return Object.assign({}, r, { lv, score });
    }).filter(Boolean);
    const adicionales = (raw.adicionales || []).filter(inArea("Adicional")).filter((a) => {
      if (!(typeof a.monto === "number" && a.monto >= 0)) { warn.push(`Adicional "${a.desc}": monto inválido; se omite.`); return false; }
      return true;
    });
    const acciones = (raw.acciones || []).filter(inArea("Acción")).filter((a) => {
      if (!a.accion || !isDate(a.fecha)) { warn.push(`Acción "${a.accion || "?"}": falta descripción o fecha; se omite.`); return false; }
      return true;
    });

    return { P, start, dn, N, AT, corte: P.corte, areas, ots, hasCost, hitos, riesgos, adicionales, acciones, warn };
  }

  // =========================================================
  // Cálculos de desempeño para un conjunto de OT
  // =========================================================
  const planFrac = (o, t) => Math.max(0, Math.min(1, (t - o.i0) / o.dur));
  function realAt(o, t) {
    let p = 0, c = null, f = null;
    for (const h of o.hist) { if (h.t <= t) { p = h.p; c = h.c; f = h.f; } else break; }
    return { p, c, f };
  }
  // Tolerancia de 5 puntos antes de marcar atraso (EPS evita errores de coma flotante: 11/20 = 55.000000000000001)
  const TOL = 5, EPS = 1e-6;
  function estadoOT(plan, real) {
    if (real >= 100) return "terminada";
    if (real === 0) return plan > TOL + EPS ? "atrasada" : "por-iniciar";
    if (real < plan - TOL - EPS) return "atrasada";
    return "en-curso";
  }

  function compute(M, ots) {
    if (!ots.length) return { empty: true, ots: [], rows: [], bac: 0, n: 0, nDone: 0, nLate: 0, pReal: 0 };
    const AT = M.AT;
    const bac = ots.reduce((s, o) => s + o.bac, 0);
    const PD = ots.length ? Math.max(...ots.map((o) => o.i0 + o.dur)) : M.N; // fin del plan (días desde la entrada)
    const H = Math.max(M.N, PD);

    const plan = [];
    for (let t = 0; t <= H; t++) plan.push(bac ? (ots.reduce((s, o) => s + o.bac * planFrac(o, t), 0) / bac) * 100 : 0);

    const ts = [...new Set(ots.flatMap((o) => o.hist.map((h) => h.t)))].sort((a, b) => a - b);
    const real = [{ t: 0, v: 0 }].concat(ts.map((t) => ({
      t, v: bac ? (ots.reduce((s, o) => s + o.bac * realAt(o, t).p, 0) / bac) : 0
    })));

    let pv = 0, ev = 0, ac = 0;
    const rows = ots.map((o) => {
      const pf = planFrac(o, AT) * 100;
      const r = realAt(o, AT);
      const opv = (o.bac * pf) / 100, oev = (o.bac * r.p) / 100;
      pv += opv; ev += oev; ac += r.c || 0;
      return {
        o, plan: pf, real: r.p, pv: opv, ev: oev, ac: r.c,
        spi: opv > 0 ? oev / opv : null,
        cpi: M.hasCost && r.c > 0 ? oev / r.c : null,
        estado: estadoOT(pf, r.p)
      };
    });

    const pPlan = bac ? (pv / bac) * 100 : 0;
    const pReal = bac ? (ev / bac) * 100 : 0;

    // Plazo ganado (Earned Schedule): instante en que el plan alcanzaba el avance real de hoy.
    // Si el plan está plano en ese valor (p. ej. 0 % antes de empezar), cualquier instante del
    // tramo es válido: se toma el corte si cae dentro, para no inventar atraso ni adelanto.
    const E = 1e-9;
    let C = 0;
    while (C < H && plan[C + 1] <= pReal + E) C++; // último día con plan ≤ real
    let ES = C >= H ? H : C + (plan[C + 1] > plan[C] ? (pReal - plan[C]) / (plan[C + 1] - plan[C]) : 0);
    let L = 0;
    while (L < H && plan[L] < pReal - E) L++; // primer día con plan ≥ real
    const Lf = L > 0 && plan[L] > plan[L - 1] ? L - 1 + (pReal - plan[L - 1]) / (plan[L] - plan[L - 1]) : L;
    if (AT >= Lf - E && AT <= ES + E) ES = AT;
    const done = pReal >= 99.95;
    const spiT = AT > 0 ? ES / AT : 1;
    const delay = done ? 0 : AT - ES; // días de atraso (negativo = adelanto)
    // Proyección: el trabajo restante avanza al ritmo del plan y el atraso actual se arrastra.
    // Es coherente con el KPI de atraso: "vamos 3 días atrasados" => "terminamos 3 días tarde".
    const projDur = done ? Math.min(AT, PD) : PD + delay;
    const projEnd = addDays(M.start, Math.max(1, Math.round(projDur)) - 1); // último día de trabajo proyectado
    const planEnd = addDays(M.start, PD - 1);

    const cpi = M.hasCost && ac > 0 ? ev / ac : null;
    return {
      ots, rows, bac, pv, ev, ac: M.hasCost ? ac : null, plan, real, PD, H,
      pPlan, pReal, sv: ev - pv, cv: M.hasCost ? ev - ac : null,
      spi: pv > 0 ? ev / pv : null, cpi, eac: cpi ? bac / cpi : null,
      ES, spiT, delay, projEnd, planEnd,
      // Ritmos para el período que queda hasta el fin del plan (%/día)
      ratePlan: PD > AT ? (100 - pPlan) / (PD - AT) : null,
      rateNeed: PD > AT ? (100 - pReal) / (PD - AT) : null,
      n: ots.length,
      nDone: rows.filter((r) => r.estado === "terminada").length,
      nLate: rows.filter((r) => r.estado === "atrasada").length
    };
  }

  // =========================================================
  // Estados y semáforos (blanco y negro + rojo solo para alertas)
  // =========================================================
  function idxSt(v, kind) {
    if (v == null) return { cls: "t-muted", txt: "Sin datos" };
    if (v >= 0.98) return { cls: "", ic: "check", txt: kind === "spi" ? "En plazo" : "En presupuesto" };
    if (v >= 0.9) return { cls: "", ic: "alert", txt: kind === "spi" ? "Atraso leve" : "Sobrecosto leve" };
    return { cls: "t-alert", ic: "alert", txt: kind === "spi" ? "Atrasado" : "Sobrecosto" };
  }
  function delaySt(d) {
    if (Math.abs(d) < 0.5) return { cls: "", ic: "check", txt: "En plazo", val: "En plazo" };
    if (d < 0) return { cls: "", ic: "up", txt: "Adelanto", val: days1(-d) };
    return { cls: d >= 2 ? "t-alert" : "", ic: "alert", txt: "Atraso", val: days1(d) };
  }
  const stHTML = (s) => `<span class="st ${s.cls}">${s.ic ? icon(s.ic, "ic sm") : ""}${s.txt}</span>`;
  const valCls = (v) => (v == null ? "t-muted" : v < 0.9 ? "t-alert" : "");

  const DOT = {
    ok: '<svg class="ic" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8.5" fill="var(--ink)" stroke="none"/><path d="M6 10.4l2.6 2.5L14 7.6" fill="none" stroke="var(--inv)" stroke-width="2"/></svg>',
    curso: '<svg class="ic" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7.5" fill="none" stroke="var(--ink)" stroke-width="2"/><path d="M10 2.5a7.5 7.5 0 0 1 0 15z" fill="var(--ink)" stroke="none"/></svg>',
    pend: '<svg class="ic" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7.5" fill="none" stroke="var(--ink-3)" stroke-width="2"/></svg>',
    late: '<svg class="ic" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8.5" fill="var(--alert)" stroke="none"/><path d="M10 5.5v5.5M10 14v.01" fill="none" stroke="#fff" stroke-width="2.2"/></svg>'
  };
  const OT_CHIP = {
    "terminada": `<span class="chip">${DOT.ok}Terminada</span>`,
    "en-curso": `<span class="chip">${DOT.curso}En curso</span>`,
    "atrasada": `<span class="chip t-alert">${DOT.late}Atrasada</span>`,
    "por-iniciar": `<span class="chip t-muted">${DOT.pend}Por iniciar</span>`
  };

  // =========================================================
  // Componentes
  // =========================================================
  const tipAttr = (html) => `data-tip="${esc(html)}"`;
  const card = (title, body, o = {}) =>
    `<section class="card ${o.cls || ""}"><div class="card-h"><span>${title}</span>${o.right ? `<small>${o.right}</small>` : ""}</div>${body}${o.foot ? `<div class="card-f">${o.foot}</div>` : ""}</section>`;
  const kpi = (ic, lbl, val, sub, alert) =>
    `<div class="card kpi ${alert ? "alert" : ""}">${icon(ic)}<div style="min-width:0"><div class="lbl">${lbl}</div><div class="val">${val}</div><div class="sub">${sub}</div></div></div>`;
  const empty = (txt) => `<div class="empty">${txt}</div>`;

  // Desvarada proyectada = fin de trabajos proyectado + la holgura planificada entre fin de trabajos y desvarada
  function desvaradaProj(V) {
    const s = V.s, M = V.M;
    if (!s.projEnd) return null;
    return addDays(s.projEnd, Math.max(1, M.N - s.PD + 1));
  }

  function kpisHTML(V) {
    const s = V.s, M = V.M;
    const d = delaySt(s.delay);
    const extra = V.adicionales.reduce((a, x) => a + x.monto, 0);
    const finTxt = V.isArea
      ? (s.projEnd ? `Fin ${fmtShort(s.projEnd)} · plan ${fmtShort(s.planEnd)}` : "Sin avance registrado")
      : (s.projEnd ? `Desvarada proyectada ${fmtShort(desvaradaProj(V))}` : "Sin avance registrado");
    return [
      kpi("gauge", "Avance físico", pct(s.pReal), `Plan ${pct(s.pPlan)} · brecha ${sgn(s.pReal - s.pPlan, (x) => x.toFixed(1))} pp`),
      kpi("calendar", "Plazo en dique", `Día ${Math.min(M.AT, M.N)} de ${M.N}`, M.AT <= M.N ? `${plural(M.N - M.AT, "día", "días")} para la desvarada` : "Plazo cumplido"),
      kpi("hourglass", d.txt === "Adelanto" ? "Adelanto" : "Atraso actual", d.val, finTxt, d.cls === "t-alert"),
      kpi("clipboard", "Órdenes de trabajo", s.n, `${plural(s.nDone, "terminada", "terminadas")} · ${plural(s.nLate, "atrasada", "atrasadas")}`),
      kpi("dollar", "Presupuesto", moneyK(s.bac), extra ? `+ ${moneyK(extra)} en adicionales` : "Sin adicionales")
    ].join("");
  }

  function ring(real, plan) {
    const size = 132, sw = 14, c = size / 2, r = (size - sw) / 2, C = 2 * Math.PI * r;
    const len = (Math.max(0, Math.min(100, real)) / 100) * C;
    const a = (Math.max(0, Math.min(100, plan)) / 100) * 2 * Math.PI - Math.PI / 2;
    const p1 = [c + (r - sw / 2 - 3) * Math.cos(a), c + (r - sw / 2 - 3) * Math.sin(a)];
    const p2 = [c + (r + sw / 2 + 3) * Math.cos(a), c + (r + sw / 2 + 3) * Math.sin(a)];
    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="Avance real ${pct(real)}, planificado ${pct(plan)}" ${tipAttr(`<b>Avance físico</b><div class="row"><span>Real</span><span>${pct(real)}</span></div><div class="row"><span>Planificado</span><span>${pct(plan)}</span></div>`)}>
      <circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="var(--track)" stroke-width="${sw}"/>
      ${len > 0 ? `<circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="var(--real)" stroke-width="${sw}" stroke-linecap="round" stroke-dasharray="${len} ${C}" transform="rotate(-90 ${c} ${c})"/>` : ""}
      <line x1="${p1[0]}" y1="${p1[1]}" x2="${p2[0]}" y2="${p2[1]}" stroke="var(--surface)" stroke-width="6" stroke-linecap="round"/>
      <line x1="${p1[0]}" y1="${p1[1]}" x2="${p2[0]}" y2="${p2[1]}" stroke="var(--plan)" stroke-width="3" stroke-linecap="round"/>
      <text x="${c}" y="${c - 4}" text-anchor="middle" dominant-baseline="central" fill="var(--ink)" font-size="22" font-weight="800">${pct(real)}</text>
      <text x="${c}" y="${c + 17}" text-anchor="middle" fill="var(--ink-3)" font-size="11">plan ${pct(plan)}</text>
    </svg>`;
  }

  function evCard(V) {
    const s = V.s, M = V.M;
    const col = (k, d, v, p) => `<div><div class="k">${k}</div><div class="d">(${d})</div>
      <div class="v">${v == null ? '<span class="t-muted">Sin datos</span>' : money(v)}</div>
      <div class="p">${p == null ? "—" : pct(p, 1)}</div><div class="s">del presupuesto</div></div>`;
    const variation = (lbl, v) => {
      if (v == null) return `<div>${icon("target", "ic t-muted")}<div><div class="t">${lbl}</div><div class="n t-muted">Sin datos de costo</div></div></div>`;
      const neg = v < -0.5;
      return `<div>${icon(neg ? "down" : "up", "ic " + (neg ? "t-alert" : ""))}
        <div><div class="t">${lbl}</div><div class="n ${neg ? "t-alert" : ""}">${sgn(v, money)}</div>
        <div class="q ${neg ? "t-alert" : "t-2"}">${sgn((v / s.bac) * 100, (x) => pct(x, 1))} del presupuesto</div></div></div>`;
    };
    const gap = s.pReal - s.pPlan;
    return card("Valor ganado", `<div class="card-b">
      <div class="ev3">
        ${col("PV", "Valor planificado", s.pv, s.pPlan)}
        ${col("EV", "Valor ganado", s.ev, s.pReal)}
        ${col("AC", "Costo real", s.ac, s.ac == null ? null : (s.ac / s.bac) * 100)}
      </div>
      <div class="var2">
        ${variation("Variación de cronograma (SV)", s.sv)}
        ${variation("Variación de costo (CV)", s.cv)}
      </div>
      <div class="adv">
        ${ring(s.pReal, s.pPlan)}
        <div>
          <h3>Avance físico real</h3>
          <p>Completado al ${fmtShort(M.corte)}</p>
          <p>vs ${pct(s.pPlan)} planificado</p>
          <div class="pp ${gap < -0.05 ? "t-alert" : ""}">${sgn(gap, (x) => x.toFixed(1))} pp</div>
        </div>
      </div>
    </div>`, { right: M.hasCost ? "PV · EV · AC" : "sin control de costos" });
  }

  function curveCard(V) {
    const s = V.s;
    const proj = V.isArea ? s.projEnd : desvaradaProj(V);
    const ref = V.isArea ? s.planEnd : parse(V.M.P.salidaPlan);
    const diff = proj ? Math.round((proj - ref) / DAY) : null;
    const rate = (v) => (v == null ? "—" : v.toFixed(2) + '%<span class="small t-muted"> /día</span>');
    const needUp = s.ratePlan > 0 && s.rateNeed != null ? (s.rateNeed / s.ratePlan - 1) * 100 : null;
    return card("Avance físico · curva S", `
      <div class="card-b" style="padding-bottom:6px">
        <div class="legend">
          <span><i class="sw-dash"></i>Planificado</span>
          <span><i class="sw-line"></i>Real</span>
          <span><i class="sw-hatch"></i>Brecha</span>
        </div>
        <div class="chart" id="scurve" role="img" aria-label="Curva S: avance planificado y real acumulado"></div>
      </div>
      <div class="stats3">
        <div><div class="t">Ritmo planificado</div><div class="n">${rate(s.ratePlan)}</div><div class="small t-muted">para lo que resta</div></div>
        <div><div class="t">Ritmo requerido</div><div class="n ${needUp > 15 ? "t-alert" : ""}">${rate(s.rateNeed)}</div>
          <div class="small ${needUp > 15 ? "t-alert" : "t-muted"}">${needUp == null ? "plan finalizado" : Math.abs(needUp) < 0.5 ? "igual al plan" : sgn(needUp, (x) => x.toFixed(0) + "%") + " vs plan"}</div></div>
        <div><div class="t">${V.isArea ? "Fin proyectado del área" : "Desvarada proyectada"}</div>
          <div class="n ${diff > 0 ? "t-alert" : ""}">${proj ? fmtShort(proj) : "—"}</div>
          <div class="small ${diff > 0 ? "t-alert" : "t-muted"}">${diff == null ? "sin avance" : diff > 0 ? "+" + plural(diff, "día", "días") + " vs plan" : diff < 0 ? plural(-diff, "día", "días") + " antes" : "según plan"}</div></div>
      </div>`, { cls: "wide", right: "ponderado por presupuesto" });
  }

  function indicesCard(V) {
    const s = V.s, M = V.M;
    const d = delaySt(s.delay);
    const row = (ic, nm, sub, f, big, st, cls) => `<div class="idx">${icon(ic)}
      <div><div class="nm">${nm} <span>${sub}</span></div><div class="f">${f}</div></div>
      <div class="r"><div class="big ${cls}">${big}</div>${stHTML(st)}</div></div>`;
    const over = s.eac != null ? ((s.eac - s.bac) / s.bac) * 100 : null;
    return card("Índices de desempeño", `<div class="list" style="display:flex;flex-direction:column">
      ${row("calendar", "SPI", "(cronograma)", "EV / PV", s.spi == null ? "—" : s.spi.toFixed(2), idxSt(s.spi, "spi"), valCls(s.spi))}
      ${row("hourglass", "Atraso", "(plazo ganado)", "Días transcurridos − días que vale el avance", d.val, d, d.cls)}
      ${row("dollar", "CPI", "(costo)", "EV / AC", s.cpi == null ? "—" : s.cpi.toFixed(2), idxSt(s.cpi, "cpi"), valCls(s.cpi))}
      ${row("gauge", "EAC", "(costo final estimado)", "Presupuesto / CPI", s.eac == null ? "—" : moneyK(s.eac),
        over == null ? { cls: "t-muted", txt: "Sin datos" } : { cls: over > 5 ? "t-alert" : "", ic: over > 0.5 ? "alert" : "check", txt: sgn(over, (x) => pct(x)) + " vs presupuesto" },
        over != null && over > 5 ? "t-alert" : "")}
    </div>`, { right: M.hasCost ? "" : "costos no informados" });
  }

  function bullet(real, plan) {
    return `<div class="bcell" ${tipAttr(`<b>Avance</b><div class="row"><span>Real</span><span>${pct(real, 0)}</span></div><div class="row"><span>Planificado</span><span>${pct(plan, 0)}</span></div>`)}>
      <div class="bullet"><div class="f" style="width:${Math.min(100, real)}%"></div><div class="m" style="left:${Math.min(100, plan)}%"></div></div>
      <span class="lb">${pct(real, 0)} / ${pct(plan, 0)}</span></div>`;
  }
  const idxCell = (v) => (v == null ? '<span class="t-muted">—</span>' : `<span class="strong ${valCls(v)}">${v.toFixed(2)}</span>`);

  // Tabla de detalle: misma estructura para áreas (resumen) y para OT (vista de área)
  function detailCard(V) {
    const M = V.M, c = M.hasCost, s = V.s;
    const head = `<tr><th>${V.isArea ? "OT" : ""}</th><th>${V.isArea ? "Trabajo" : "Área"}</th><th>Período</th><th class="num">Presupuesto</th>
      ${c ? '<th class="num">Costo real</th>' : ""}<th>Avance real / plan</th><th class="num">SPI</th>${c ? '<th class="num">CPI</th>' : ""}<th>Estado</th>${V.isArea ? "" : "<th></th>"}</tr>`;
    let rows, count;
    if (V.isArea) {
      count = s.rows.length;
      rows = s.rows.map((r) => `<tr>
        <td class="code">${esc(r.o.id)}</td>
        <td class="name"><b>${esc(r.o.nombre)}</b><small>${esc(r.o.ejecuta || "")}</small></td>
        <td class="nw small">${fmtShort(r.o.inicio)} – ${fmtShort(r.o.fin)}</td>
        <td class="num">${money(r.o.bac)}</td>
        ${c ? `<td class="num">${r.ac == null ? '<span class="t-muted">—</span>' : money(r.ac)}</td>` : ""}
        <td>${bullet(r.real, r.plan)}</td>
        <td class="num">${idxCell(r.spi)}</td>${c ? `<td class="num">${idxCell(r.cpi)}</td>` : ""}
        <td>${OT_CHIP[r.estado]}</td></tr>`).join("");
    } else {
      count = V.areaStats.length;
      rows = V.areaStats.map(({ a, s: as }) => {
        if (as.empty) {
          return `<tr class="go" data-go="${esc(a.id)}" tabindex="0" aria-label="Ver detalle de ${esc(a.nombre)}">
            <td>${icon(a.icono, "ic")}</td><td class="name"><b>${esc(a.nombre)}</b><small>Sin órdenes de trabajo</small></td>
            <td colspan="${c ? 7 : 5}" class="t-muted small">Sin datos cargados</td><td class="go-arrow">${icon("chevron", "ic sm")}</td></tr>`;
        }
        const d = delaySt(as.delay);
        const inicio = as.ots.length ? as.ots.reduce((m, o) => (o.inicio < m ? o.inicio : m), as.ots[0].inicio) : null;
        return `<tr class="go" data-go="${esc(a.id)}" tabindex="0" aria-label="Ver detalle de ${esc(a.nombre)}">
          <td>${icon(a.icono, "ic")}</td>
          <td class="name"><b>${esc(a.nombre)}</b><small>${plural(as.n, "orden", "órdenes")} · ${plural(as.nLate, "atrasada", "atrasadas")}</small></td>
          <td class="nw small">${inicio ? fmtShort(inicio) + " – " + fmtShort(as.planEnd) : "—"}</td>
          <td class="num">${moneyK(as.bac)}</td>${c ? `<td class="num">${moneyK(as.ac)}</td>` : ""}
          <td>${bullet(as.pReal, as.pPlan)}</td>
          <td class="num">${idxCell(as.spi)}</td>${c ? `<td class="num">${idxCell(as.cpi)}</td>` : ""}
          <td>${stHTML({ cls: d.cls, ic: d.ic, txt: d.txt === "En plazo" ? d.txt : d.txt + " " + d.val })}</td>
          <td class="go-arrow">${icon("chevron", "ic sm")}</td></tr>`;
      }).join("");
    }
    const total = `<tr class="total"><td></td><td>TOTAL ${V.isArea ? "ÁREA" : "DIQUE"}</td><td></td>
      <td class="num">${V.isArea ? money(s.bac) : moneyK(s.bac)}</td>${c ? `<td class="num">${V.isArea ? money(s.ac) : moneyK(s.ac)}</td>` : ""}
      <td>${pct(s.pReal)} / ${pct(s.pPlan)}</td><td class="num">${s.spi == null ? "—" : s.spi.toFixed(2)}</td>${c ? `<td class="num">${s.cpi == null ? "—" : s.cpi.toFixed(2)}</td>` : ""}
      <td>${s.nDone}/${s.n} ${s.n === 1 ? "terminada" : "terminadas"}</td>${V.isArea ? "" : "<td></td>"}</tr>`;
    const body = count
      ? `<div class="tbl-scroll"><table><thead>${head}</thead><tbody>${rows}${total}</tbody></table></div>`
      : empty("Sin órdenes de trabajo registradas");
    return card(V.isArea ? "Órdenes de trabajo · " + esc(V.area.nombre) : "Desempeño por área", body, {
      right: V.isArea ? `${plural(s.n, "orden", "órdenes")} · ${plural(s.nLate, "atrasada", "atrasadas")}` : "clic en un área para ver el detalle",
      foot: "Barra = avance real · marca gris = avance planificado a la fecha de corte."
    });
  }

  // --- Hitos ---
  function hitoInfo(h, M) {
    if (h.fechaReal) {
      const late = M.dn(h.fechaReal) - M.dn(h.fechaPlan);
      return { dot: DOT.ok, txt: late > 0 ? `Completado · +${plural(late, "día", "días")}` : "Completado", cls: "" };
    }
    if (h.fechaPlan < M.corte) return { dot: DOT.late, txt: h.avance > 0 ? `Vencido · ${h.avance}%` : "Vencido", cls: "t-alert" };
    if (h.avance > 0) return { dot: DOT.curso, txt: `En curso · ${h.avance}%`, cls: "" };
    return { dot: DOT.pend, txt: "No iniciado", cls: "t-muted" };
  }
  function hitosCard(V) {
    const M = V.M;
    let list = V.hitos.slice().sort((a, b) => a.fechaPlan.localeCompare(b.fechaPlan));
    let foot = "";
    if (!V.isArea) {
      // Resumen: hitos clave, los 2 últimos completados y los 4 siguientes
      const key = list.filter((h) => h.clave);
      const done = key.filter((h) => h.fechaReal), open = key.filter((h) => !h.fechaReal);
      list = done.slice(-2).concat(open.slice(0, 4));
      foot = `Hitos clave. Hay ${plural(V.hitos.length, "hito", "hitos")} en total; el detalle está en cada área.`;
    }
    const body = list.length ? `<div class="list">${list.map((h) => {
      const i = hitoInfo(h, M);
      return `<div class="li">${i.dot}<div class="main"><b>${esc(h.nombre)}</b><small class="${i.cls}">${i.txt}${!V.isArea ? " · " + esc(V.areaName(h.area)) : ""}</small></div>
        <div class="side">${fmtDate(h.fechaPlan)}${h.fechaReal && h.fechaReal !== h.fechaPlan ? `<small class="t-muted">real ${fmtShort(h.fechaReal)}</small>` : ""}</div></div>`;
    }).join("")}</div>` : empty("Sin hitos registrados");
    return card("Hitos principales", body, { foot });
  }

  // --- Riesgos ---
  function risksCard(V) {
    const list = V.riesgos.slice().sort((a, b) => (b.score || 0) - (a.score || 0) || LEVELS.indexOf(a.lv) - LEVELS.indexOf(b.lv));
    const total = list.length;
    if (!total) return card("Riesgos · exposición actual", empty("Sin riesgos registrados"));
    const counts = LEVELS.map((l) => ({ l, n: list.filter((r) => r.lv === l).length }));
    const size = 124, sw = 20, c = size / 2, r = (size - sw) / 2, C = 2 * Math.PI * r;
    const nonZero = counts.filter((x) => x.n);
    const gap = nonZero.length > 1 ? 2.5 : 0;
    let off = 0;
    const segs = nonZero.map((x) => {
      const len = (x.n / total) * C;
      const sg = `<circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="${x.l.color}" stroke-width="${sw}"
        stroke-dasharray="${Math.max(0.1, len - gap)} ${C}" stroke-dashoffset="${-off}" transform="rotate(-90 ${c} ${c})"
        ${tipAttr(`<b>${x.l.label}</b>${plural(x.n, "riesgo", "riesgos")} · ${pct((x.n / total) * 100, 0)}`)}/>`;
      off += len;
      return sg;
    }).join("");
    const donut = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="${total} riesgos por nivel">${segs}
      <text x="${c}" y="${c - 3}" text-anchor="middle" dominant-baseline="central" fill="var(--ink)" font-size="26" font-weight="800">${total}</text>
      <text x="${c}" y="${c + 18}" text-anchor="middle" fill="var(--ink-3)" font-size="10.5">riesgos</text></svg>`;
    const leg = counts.map((x) => `<div><span class="chip"><i class="sq" style="background:${x.l.color}"></i>${x.l.label}</span><b>${x.n}</b></div>`).join("");
    const max = V.isArea ? 99 : 5;
    const items = list.slice(0, max).map((rk) => `<div class="li"><i class="sq" style="background:${rk.lv.color}"></i>
      <div class="main"><b>${esc(rk.desc)}</b><small>${esc(rk.categoria || "")}${rk.resp ? " · " + esc(rk.resp) : ""}${!V.isArea ? " · " + esc(V.areaName(rk.area)) : ""}</small></div>
      <div class="side"><span class="strong ${rk.lv.k === "muy-alto" ? "t-alert" : ""}">${rk.lv.label}</span>${rk.score ? `<small class="pxi">P×I ${rk.prob}×${rk.impacto} = ${rk.score}</small>` : ""}</div></div>`).join("");
    return card("Riesgos · exposición actual", `<div class="risk-top">${donut}<div class="risk-leg">${leg}</div></div><div class="list">${items}</div>`,
      { foot: total > max ? `Se muestran los ${max} de mayor exposición de ${total}.` : "Nivel = probabilidad × impacto (escala 1 a 5)." });
  }

  // --- Adicionales ---
  function extrasCard(V) {
    const list = V.adicionales.slice().sort((a, b) => b.monto - a.monto);
    if (!list.length) return card("Trabajos adicionales", empty("Sin trabajos adicionales"));
    const tot = list.reduce((s, a) => s + a.monto, 0);
    const apr = list.filter((a) => /aprob/i.test(a.estado || "")).reduce((s, a) => s + a.monto, 0);
    const max = V.isArea ? 99 : 5;
    const items = list.slice(0, max).map((a) => {
      const ok = /aprob/i.test(a.estado || "");
      return `<div class="li">${icon(ok ? "check" : "clock", "ic")}<div class="main"><b>${esc(a.desc)}</b>
        <small>${esc(a.estado || "Sin estado")}${!V.isArea ? " · " + esc(V.areaName(a.area)) : ""}</small></div><div class="side strong">${money(a.monto)}</div></div>`;
    }).join("");
    return card("Trabajos adicionales", `<div class="list">${items}</div>
      <table><tbody><tr class="total"><td>TOTAL · ${plural(list.length, "orden", "órdenes")}</td><td class="num">${money(tot)}</td></tr></tbody></table>`, {
      right: V.s.bac ? `+${pct((tot / V.s.bac) * 100)} sobre el presupuesto` : "",
      foot: `Aprobado ${moneyK(apr)} · en revisión ${moneyK(tot - apr)}${list.length > max ? ` · se muestran los ${max} de mayor monto` : ""}. No incluidos en presupuesto ni EAC.`
    });
  }

  // --- Acciones ---
  function actionsCard(V) {
    const M = V.M;
    const open = V.acciones.filter((a) => !/cerrad/i.test(a.estado || "")).sort((a, b) => a.fecha.localeCompare(b.fecha));
    const closed = V.acciones.length - open.length;
    if (!open.length) return card("Próximas acciones clave", empty("Sin acciones abiertas"));
    const max = V.isArea ? 99 : 6;
    const items = open.slice(0, max).map((a) => {
      const dd = M.dn(a.fecha) - M.dn(M.corte);
      const when = dd < 0 ? { t: "Vencida", c: "t-alert" } : dd === 0 ? { t: "Hoy", c: "t-alert" } : dd === 1 ? { t: "Mañana", c: "" } : { t: `En ${dd} días`, c: "t-muted" };
      return `<div class="li">${icon(dd < 0 ? "alert" : "flag", "ic " + (dd < 0 ? "t-alert" : ""))}<div class="main"><b>${esc(a.accion)}</b>
        <small>${esc(a.resp || "Sin responsable")}${!V.isArea ? " · " + esc(V.areaName(a.area)) : ""}</small></div>
        <div class="side strong">${fmtShort(a.fecha)}<small class="${when.c}">${when.t}</small></div></div>`;
    }).join("");
    return card("Próximas acciones clave", `<div class="list">${items}</div>`, {
      right: plural(open.length, "abierta", "abiertas"),
      foot: `${open.length > max ? `Se muestran las ${max} más próximas. ` : ""}${closed ? plural(closed, "acción cerrada", "acciones cerradas") : "Sin acciones cerradas"}.`
    });
  }

  // =========================================================
  // Curva S (SVG)
  // =========================================================
  function drawCurve(el, V) {
    const s = V.s, M = V.M;
    el.innerHTML = "";
    const W = Math.max(280, el.clientWidth), Hh = Math.max(250, el.clientHeight);
    const X = Math.max(M.N, s.H);
    const m = { l: 40, r: 16, t: 18, b: 28 };
    const x = (t) => m.l + ((W - m.l - m.r) * t) / X;
    const y = (v) => m.t + (Hh - m.t - m.b) * (1 - v / 100);
    const dateOfT = (t) => addDays(M.start, Math.max(0, t - 1)); // avance al cierre de ese día
    const planAt = (t) => s.plan[Math.min(t, s.plan.length - 1)];

    let g = "";
    for (let v = 0; v <= 100; v += 20) {
      g += `<line class="grid-l" x1="${m.l}" x2="${W - m.r}" y1="${y(v)}" y2="${y(v)}"/>`;
      g += `<text class="ax" x="${m.l - 6}" y="${y(v) + 4}" text-anchor="end">${v}%</text>`;
    }
    const step = W < 520 ? 14 : 7;
    for (let t = 1; t <= X; t += step) {
      if (Math.abs(M.N - t) < step * 0.6) continue;
      g += `<text class="ax" x="${x(t)}" y="${Hh - 8}" text-anchor="middle">${fmtShort(dateOfT(t))}</text>`;
    }
    g += `<text class="ax" x="${x(M.N)}" y="${Hh - 8}" text-anchor="${x(M.N) > W - 40 ? "end" : "middle"}">${fmtShort(M.P.salidaPlan)}</text>`;

    const planPts = [];
    for (let t = 0; t <= X; t++) planPts.push([x(t), y(planAt(t))]);
    const realPts = s.real.map((p) => [x(p.t), y(p.v)]);
    const toPath = (pts) => pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join("");
    const lastR = s.real[s.real.length - 1];
    const gapPoly = planPts.slice(0, lastR.t + 1).concat(realPts.slice().reverse()).map((p) => p.join(",")).join(" ");

    const ax = x(Math.min(M.AT, X)), nx = x(M.N);
    const lx = x(lastR.t), ly = y(lastR.v);
    const bw = 52;
    const bx = lx + 8 + bw > W - m.r ? lx - 8 - bw : lx + 8;
    const by = Math.max(m.t, ly - 24);
    const nearEnd = Math.abs(nx - ax) < 130;

    el.innerHTML = `<svg width="${W}" height="${Hh}" viewBox="0 0 ${W} ${Hh}">
      <defs><pattern id="hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="5" stroke="var(--hatch)" stroke-width="1.4"/></pattern></defs>
      ${g}
      <polygon points="${gapPoly}" fill="url(#hatch)" opacity=".75"/>
      <line x1="${nx}" x2="${nx}" y1="${m.t}" y2="${Hh - m.b}" stroke="var(--ink-3)" stroke-dasharray="1 3"/>
      ${nearEnd ? "" : `<text class="ax" x="${nx}" y="${m.t - 6}" text-anchor="end">Desvarada</text>`}
      <line x1="${ax}" x2="${ax}" y1="${m.t}" y2="${Hh - m.b}" stroke="var(--ink-2)" stroke-dasharray="3 3"/>
      <text class="ax" x="${ax}" y="${m.t - 6}" text-anchor="middle">Corte · día ${M.AT}</text>
      <path d="${toPath(planPts)}" fill="none" stroke="var(--plan)" stroke-width="2" stroke-dasharray="6 4"/>
      <path d="${toPath(realPts)}" fill="none" stroke="var(--real)" stroke-width="2.5" stroke-linejoin="round"/>
      <circle cx="${lx}" cy="${ly}" r="5" fill="var(--real)" stroke="var(--surface)" stroke-width="2"/>
      <rect x="${bx}" y="${by}" width="${bw}" height="20" rx="4" fill="var(--ink)"/>
      <text x="${bx + bw / 2}" y="${by + 14}" text-anchor="middle" fill="var(--inv)" font-size="12" font-weight="700">${pct(lastR.v)}</text>
      <g class="hv" style="display:none">
        <line class="hv-l" y1="${m.t}" y2="${Hh - m.b}" stroke="var(--ink-2)"/>
        <circle class="hv-p" r="4.5" fill="var(--surface)" stroke="var(--plan)" stroke-width="2"/>
        <circle class="hv-r" r="4.5" fill="var(--real)" stroke="var(--surface)" stroke-width="2"/>
      </g>
      <rect class="hv-hit" x="${m.l}" y="${m.t}" width="${W - m.l - m.r}" height="${Hh - m.t - m.b}" fill="transparent"/>
    </svg>`;

    const svg = el.querySelector("svg");
    const hv = svg.querySelector(".hv"), hl = svg.querySelector(".hv-l"), hp = svg.querySelector(".hv-p"), hr = svg.querySelector(".hv-r");
    const hit = svg.querySelector(".hv-hit");
    hit.addEventListener("mousemove", (e) => {
      const rect = svg.getBoundingClientRect();
      const t = Math.max(0, Math.min(X, Math.round(((e.clientX - rect.left - m.l) / (W - m.l - m.r)) * X)));
      hv.style.display = "";
      hl.setAttribute("x1", x(t)); hl.setAttribute("x2", x(t));
      hp.setAttribute("cx", x(t)); hp.setAttribute("cy", y(planAt(t)));
      let rp = null;
      if (t <= lastR.t) for (const p of s.real) { if (p.t <= t) rp = p; else break; }
      if (rp) { hr.style.display = ""; hr.setAttribute("cx", x(rp.t)); hr.setAttribute("cy", y(rp.v)); } else hr.style.display = "none";
      const gapV = rp ? rp.v - planAt(rp.t) : null;
      showTip(`<b>${t === 0 ? "Entrada a dique" : fmtDate(dateOfT(t)) + " · día " + t}</b>
        <div class="row"><span>Planificado</span><span>${pct(planAt(t))}</span></div>
        ${rp ? `<div class="row"><span>Real${rp.t !== t ? " (al " + fmtShort(dateOfT(rp.t)) + ")" : ""}</span><span>${pct(rp.v)}</span></div>
        <div class="row"><span>Brecha</span><span class="${gapV < -0.05 ? "t-alert" : ""}">${sgn(gapV, (v) => v.toFixed(1))} pp</span></div>` : `<div class="row t-muted"><span>Real</span><span>—</span></div>`}`, e.clientX, e.clientY);
    });
    hit.addEventListener("mouseleave", () => { hv.style.display = "none"; hideTip(); });
  }

  // =========================================================
  // Tooltip
  // =========================================================
  const tip = $("tip");
  function showTip(html, cx, cy) {
    tip.innerHTML = html;
    tip.hidden = false;
    const r = tip.getBoundingClientRect();
    let left = cx + 14, top = cy + 14;
    if (left + r.width > innerWidth - 8) left = cx - r.width - 14;
    if (top + r.height > innerHeight - 8) top = cy - r.height - 14;
    tip.style.left = Math.max(8, left) + "px";
    tip.style.top = Math.max(8, top) + "px";
  }
  function hideTip() { tip.hidden = true; }
  document.addEventListener("mousemove", (e) => {
    if (e.target.closest && e.target.closest(".hv-hit")) return;
    const t = e.target.closest && e.target.closest("[data-tip]");
    if (t) showTip(t.getAttribute("data-tip"), e.clientX, e.clientY);
    else if (!tip.hidden) hideTip();
  });
  document.addEventListener("scroll", hideTip, { passive: true });

  // =========================================================
  // Render
  // =========================================================
  const app = $("app");
  let MODEL = null, VIEW = null;

  function viewFor(M, key) {
    const area = M.areas.find((a) => a.id === key);
    const names = new Map(M.areas.map((a) => [a.id, a.nombre]));
    const base = { M, areaName: (id) => names.get(id) || id };
    if (area) {
      const f = (x) => x.area === area.id;
      return Object.assign(base, {
        key: area.id, isArea: true, area,
        s: compute(M, M.ots.filter((o) => o.area === area.id)),
        hitos: M.hitos.filter(f), riesgos: M.riesgos.filter(f), adicionales: M.adicionales.filter(f), acciones: M.acciones.filter(f)
      });
    }
    return Object.assign(base, {
      key: "resumen", isArea: false,
      s: compute(M, M.ots),
      areaStats: M.areas.map((a) => ({ a, s: compute(M, M.ots.filter((o) => o.area === a.id)) })),
      hitos: M.hitos, riesgos: M.riesgos, adicionales: M.adicionales, acciones: M.acciones
    });
  }

  function renderTabs(M, active) {
    const items = [{ id: "resumen", nombre: "Resumen general", icono: "grid", s: compute(M, M.ots) }]
      .concat(M.areas.map((a) => ({ id: a.id, nombre: a.nombre, icono: a.icono, s: compute(M, M.ots.filter((o) => o.area === a.id)) })));
    $("tabs").innerHTML = items.map((t) => `<a class="tab" href="#${esc(t.id)}" ${t.id === active ? 'aria-current="page"' : ""}>
      ${icon(t.icono)}${esc(t.nombre)}<span class="badge" title="Avance real">${t.s.empty ? "—" : pct(t.s.pReal, 0)}</span></a>`).join("");
  }

  function render() {
    if (!MODEL) return;
    const M = MODEL;
    const key = decodeURIComponent(location.hash.slice(1));
    const V = viewFor(M, key);
    VIEW = V;
    renderTabs(M, V.key);
    $("hero-title").textContent = V.isArea ? "Desempeño del área de " + V.area.nombre : "Desempeño del proyecto de dique";
    $("hero-sub").textContent = [M.P.buque, V.isArea ? V.area.descripcion : [M.P.tipo, M.P.dique].filter(Boolean).join(" · ")].filter(Boolean).join(" · ");
    $("upd-date").textContent = fmtDate(M.corte);
    $("upd-day").textContent = `Día ${Math.min(M.AT, M.N)} de ${M.N} · desvarada ${fmtShort(M.P.salidaPlan)}`;
    document.title = (V.isArea ? V.area.nombre + " · " : "") + "Control de Dique";
    $("foot-src").textContent = M.P.fuente || (fuente ? "Fuente: " + fuente : "Datos de ejemplo");

    const notice = M.warn.length
      ? `<details class="notice"><summary>${plural(M.warn.length, "observación", "observaciones")} en los datos de entrada</summary><ul>${M.warn.map((w) => `<li>${esc(w)}</li>`).join("")}</ul></details>`
      : "";
    const perf = V.s.empty
      ? card("Desempeño", empty(`${V.isArea ? "Esta área" : "El proyecto"} aún no tiene órdenes de trabajo. Al cargarlas aparecerán aquí el valor ganado, la curva S y los índices.`))
      : `<div class="kpis">${kpisHTML(V)}</div>
      <div class="row-a">${evCard(V)}${curveCard(V)}${indicesCard(V)}</div>
      ${detailCard(V)}`;
    app.innerHTML = `${notice}${perf}
      <div class="row-c">${hitosCard(V)}${risksCard(V)}${extrasCard(V)}${actionsCard(V)}</div>`;
    if (!V.s.empty) drawCurve($("scurve"), V);
  }

  function fatal(msg) {
    MODEL = null;
    VIEW = null;
    rotSet(false);
    $("rot").innerHTML = "";
    $("tabs").innerHTML = "";
    app.innerHTML = `<div class="notice fatal"><b class="t-alert">No se pudo cargar el dashboard</b><p>${esc(msg)}</p></div>`;
  }

  app.addEventListener("click", (e) => {
    const r = e.target.closest("[data-go]");
    if (r) location.hash = r.dataset.go;
  });
  app.addEventListener("keydown", (e) => {
    const r = e.target.closest("[data-go]");
    if (r && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); location.hash = r.dataset.go; }
  });
  addEventListener("hashchange", () => {
    render();
    window.scrollTo({ top: 0 });
    if (ROT.on) rotSchedule(); // si el usuario elige una pestaña, la presentación sigue desde ahí
  });

  // =========================================================
  // Presentación automática: rota Resumen → áreas cada N segundos
  //   ?rotar=10  inicia la presentación al abrir (útil para una pantalla en sala)
  // =========================================================
  const ROT_OPTS = [5, 10, 15, 20, 30, 60];
  const ROT = { on: false, secs: 10, timer: null };
  try { const v = +localStorage.getItem("dique.rotar"); if (ROT_OPTS.includes(v)) ROT.secs = v; } catch (e) { /* sin almacenamiento */ }

  // Desplazamiento durante la presentación: quieto arriba, baja suave hasta el final, quieto abajo.
  const SCROLL = { on: !matchMedia("(prefers-reduced-motion: reduce)").matches, raf: 0 };
  try { const v = localStorage.getItem("dique.desplazar"); if (v === "0" || v === "1") SCROLL.on = v === "1"; } catch (e) { /* sin almacenamiento */ }
  function rotScroll() {
    cancelAnimationFrame(SCROLL.raf);
    if (!ROT.on || !SCROLL.on) return;
    const total = ROT.secs * 1000;
    const holdTop = Math.min(2500, total * 0.15);  // tiempo para leer los indicadores
    const holdEnd = Math.min(1500, total * 0.1);   // pausa al final antes de cambiar de vista
    const span = Math.max(1, total - holdTop - holdEnd);
    const t0 = performance.now();
    const step = (now) => {
      const max = document.documentElement.scrollHeight - innerHeight;
      const f = Math.max(0, Math.min(1, (now - t0 - holdTop) / span));
      const eased = (1 - Math.cos(Math.PI * f)) / 2; // arranque y llegada suaves
      if (max > 0) window.scrollTo(0, Math.round(max * eased));
      if (f < 1 && ROT.on) SCROLL.raf = requestAnimationFrame(step);
    };
    SCROLL.raf = requestAnimationFrame(step);
  }
  // Si el usuario desplaza la página por su cuenta, toma el control: se pausa la presentación.
  const userTakesOver = () => { if (ROT.on) rotSet(false); };
  addEventListener("wheel", userTakesOver, { passive: true });
  addEventListener("touchmove", userTakesOver, { passive: true });
  addEventListener("keydown", (e) => {
    if (e.target.closest && e.target.closest("button, select, input, textarea, [data-go]")) return;
    if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(e.key)) userTakesOver();
  });

  function rotSchedule() {
    clearTimeout(ROT.timer);
    const bar = $("rot-progress");
    bar.innerHTML = ROT.on ? `<i style="animation-duration:${ROT.secs}s"></i>` : "";
    if (ROT.on) ROT.timer = setTimeout(rotNext, ROT.secs * 1000);
    rotScroll();
  }
  function rotNext() {
    if (!MODEL) return;
    const order = ["resumen"].concat(MODEL.areas.map((a) => a.id));
    const cur = VIEW ? VIEW.key : "resumen";
    const next = order[(order.indexOf(cur) + 1) % order.length];
    history.replaceState(null, "", "#" + encodeURIComponent(next)); // no llena el historial del navegador
    hideTip();
    render();
    window.scrollTo({ top: 0 });
    rotSchedule();
  }
  function rotSet(on) {
    ROT.on = !!on && !!MODEL;
    renderRot();
    rotSchedule();
  }
  function renderRot() {
    if (!MODEL) { $("rot").innerHTML = ""; return; }
    const list = ROT_OPTS.includes(ROT.secs) ? ROT_OPTS : ROT_OPTS.concat(ROT.secs).sort((x, y) => x - y);
    const opts = list.map((v) => `<option value="${v}" ${v === ROT.secs ? "selected" : ""}>${v} s</option>`).join("");
    const fs = document.fullscreenEnabled
      ? `<button class="btn" type="button" data-rot="fs" title="Pantalla completa" aria-label="Pantalla completa">${icon("expand")}</button>` : "";
    $("rot").innerHTML = `<button class="btn ${ROT.on ? "on" : ""}" type="button" data-rot="toggle" aria-pressed="${ROT.on}"
        title="${ROT.on ? "Pausar la presentación" : "Pasar las vistas automáticamente"}">${icon(ROT.on ? "pause" : "play")}<span class="lbl-txt">${ROT.on ? "Pausar" : "Presentación"}</span></button>
      <select class="sel" data-rot="secs" aria-label="Segundos por vista" title="Segundos por vista">${opts}</select>
      <button class="btn tgl" type="button" data-rot="scroll" aria-pressed="${SCROLL.on}"
        title="${SCROLL.on ? "Desplazamiento activado: cada vista baja hasta el final" : "Desplazamiento desactivado: cada vista queda arriba"}">${icon("updown")}<span class="lbl-txt">Desplazar</span></button>${fs}`;
  }
  $("rot").addEventListener("click", (e) => {
    const b = e.target.closest("[data-rot]");
    if (!b) return;
    if (b.dataset.rot === "toggle") rotSet(!ROT.on);
    if (b.dataset.rot === "scroll") {
      SCROLL.on = !SCROLL.on;
      try { localStorage.setItem("dique.desplazar", SCROLL.on ? "1" : "0"); } catch (err) { /* sin almacenamiento */ }
      renderRot();
      if (ROT.on) { if (SCROLL.on) rotSchedule(); else cancelAnimationFrame(SCROLL.raf); }
    }
    if (b.dataset.rot === "fs") {
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      else document.documentElement.requestFullscreen().catch(() => {});
    }
  });
  $("rot").addEventListener("change", (e) => {
    if (e.target.dataset.rot !== "secs") return;
    ROT.secs = +e.target.value;
    try { localStorage.setItem("dique.rotar", String(ROT.secs)); } catch (err) { /* sin almacenamiento */ }
    rotSchedule();
  });
  let rt, lastW = innerWidth;
  addEventListener("resize", () => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      if (VIEW && innerWidth !== lastW) { lastW = innerWidth; render(); }
    }, 120);
  });

  // =========================================================
  // API pública para conectar la herramienta
  //   Dique.cargar(objeto)       -> carga datos ya en memoria
  //   Dique.cargarDesdeUrl(url)  -> lee un JSON con el mismo formato
  // =========================================================
  function cargar(data) {
    try {
      MODEL = build(data);
      renderRot();
      if (MODEL.warn.length) console.warn("[Dique] Observaciones en los datos:\n- " + MODEL.warn.join("\n- "));
      render();
      return { ok: true, observaciones: MODEL.warn.slice() };
    } catch (err) {
      fatal(err.message);
      return { ok: false, error: err.message };
    }
  }
  async function cargarDesdeUrl(url) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status} al leer ${url}`);
      return cargar(await res.json());
    } catch (err) {
      fatal(`No se pudo leer la fuente de datos: ${err.message}`);
      return { ok: false, error: err.message };
    }
  }
  // Indicadores calculados (total y por área), útiles para exportar o para auditar los cálculos
  function indicadores() {
    if (!MODEL) return null;
    const pick = (s) => s.empty ? { vacio: true, ordenes: 0 } : ({
      bac: s.bac, pv: s.pv, ev: s.ev, ac: s.ac, sv: s.sv, cv: s.cv, spi: s.spi, cpi: s.cpi, eac: s.eac,
      avancePlan: s.pPlan, avanceReal: s.pReal, atrasoDias: s.delay, finProyectado: iso(s.projEnd),
      ordenes: s.n, terminadas: s.nDone, atrasadas: s.nLate
    });
    const out = { corte: MODEL.corte, conCostos: MODEL.hasCost, total: pick(compute(MODEL, MODEL.ots)), areas: {} };
    MODEL.areas.forEach((a) => { out.areas[a.id] = pick(compute(MODEL, MODEL.ots.filter((o) => o.area === a.id))); });
    return out;
  }
  window.Dique = { cargar, cargarDesdeUrl, indicadores, version: "1.0" };

  const params = new URLSearchParams(location.search);
  const fuente = params.get("datos");
  const autoRot = params.has("rotar");
  if (autoRot) { const v = +params.get("rotar"); if (v >= 3 && v <= 600) ROT.secs = Math.round(v); }
  if (params.has("desplazar")) SCROLL.on = params.get("desplazar") !== "0";
  const ready = fuente ? cargarDesdeUrl(fuente)
    : window.DIQUE_DATA ? Promise.resolve(cargar(window.DIQUE_DATA))
    : Promise.resolve(fatal("No hay datos: falta data.js o el parámetro ?datos=URL."));
  ready.then(() => { if (autoRot && MODEL) rotSet(true); });
  // Re-dibuja cuando la fuente termina de cargar (cambia el ancho de los textos)
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => VIEW && render());
})();
