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
    updown: '<path d="M12 4v16M8 8l4-4 4 4M8 16l4 4 4-4"/>',
    users: '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14.2c2.8.4 5 2.8 5 5.8"/>',
    wallet: '<path d="M4 7h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a1 1 0 0 1-1-1z"/><path d="M4 7l11-3v3M16 13.5h2"/>'
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

    // Desembolsos: pagos efectivos (caja). La tabla es opcional; si no viene, se muestra "Sin datos".
    const hasPaid = Array.isArray(raw.desembolsos);
    const pagos = (raw.desembolsos || []).map((d, i) => {
      if (!d || !areaIds.has(d.area)) { warn.push(`Desembolso ${i + 1}: el área "${d && d.area}" no existe; se omite.`); return null; }
      if (!isDate(d.fecha) || !(typeof d.monto === "number" && d.monto >= 0)) { warn.push(`Desembolso ${i + 1}: fecha o monto inválido; se omite.`); return null; }
      if (d.fecha > P.corte) { warn.push(`Desembolso ${i + 1}: fecha posterior al corte; se ignora.`); return null; }
      if (d.ot && !byId.has(d.ot)) warn.push(`Desembolso ${i + 1}: la OT "${d.ot}" no existe; se asigna solo al área.`);
      return Object.assign({}, d, { t: dn(d.fecha) + 1 });
    }).filter(Boolean);

    // Participación del equipo: asistencia a reuniones + actualización de la plataforma
    const cfg = { pesoReuniones: 0.5, umbrales: [60, 80] };
    const pc = P.participacion || {};
    if (pc.pesoReuniones != null) {
      if (typeof pc.pesoReuniones === "number" && pc.pesoReuniones >= 0 && pc.pesoReuniones <= 1) cfg.pesoReuniones = pc.pesoReuniones;
      else warn.push("proyecto.participacion.pesoReuniones debe estar entre 0 y 1: se usa 0.5.");
    }
    if (pc.umbrales != null) {
      const u = pc.umbrales;
      if (Array.isArray(u) && u.length === 2 && u[0] > 0 && u[0] < u[1] && u[1] <= 100) cfg.umbrales = u.slice();
      else warn.push("proyecto.participacion.umbrales debe ser [rojo_hasta, verde_desde], p. ej. [60, 80]: se usa [60, 80].");
    }
    const people = new Map();
    (raw.equipo || []).forEach((e, i) => {
      if (!e || !e.id || !e.nombre) return warn.push(`Equipo fila ${i + 1}: falta id o nombre; se omite.`);
      if (people.has(e.id)) return warn.push(`Equipo "${e.id}": id duplicado; se omite.`);
      let area = e.area == null || e.area === "" ? null : e.area;
      if (area != null && !areaIds.has(area)) { warn.push(`Equipo "${e.nombre}": el área "${area}" no existe; solo cuenta en el resumen general.`); area = null; }
      people.set(e.id, Object.assign({}, e, { area }));
    });
    const reuniones = [];
    (raw.reuniones || []).forEach((r, i) => {
      const tag = `Reunión ${i + 1}${r && r.nombre ? " (" + r.nombre + ")" : ""}`;
      if (!r || !isDate(r.fecha) || !Array.isArray(r.convocados)) return warn.push(`${tag}: falta la fecha o la lista de convocados; se omite.`);
      if (r.fecha > P.corte) return warn.push(`${tag}: fecha posterior al corte; se ignora.`);
      const conv = [...new Set(r.convocados)].filter((id) => {
        if (!people.has(id)) { warn.push(`${tag}: "${id}" no está en el equipo; se ignora.`); return false; }
        return true;
      });
      const asis = [...new Set(r.asistentes || [])].filter((id) => {
        if (!conv.includes(id)) { warn.push(`${tag}: "${id}" figura como asistente pero no estaba convocado; se ignora.`); return false; }
        return true;
      });
      reuniones.push({ fecha: r.fecha, nombre: r.nombre || "Reunión", t: dn(r.fecha) + 1, conv, asis: new Set(asis) });
    });
    const actualizaciones = [];
    (raw.actualizaciones || []).forEach((r, i) => {
      const [f, id, esp, hec] = Array.isArray(r) ? r : [r.fecha, r.persona, r.esperadas, r.realizadas];
      const tag = `Actualización fila ${i + 1}`;
      if (!people.has(id)) return warn.push(`${tag}: "${id}" no está en el equipo; se ignora.`);
      if (!isDate(f) || f > P.corte) return warn.push(`${tag} (${id}): fecha inválida o posterior al corte; se ignora.`);
      if (!(Number.isFinite(esp) && esp > 0 && Number.isFinite(hec) && hec >= 0)) return warn.push(`${tag} (${id}): esperadas debe ser mayor que 0 y realizadas no negativa; se ignora.`);
      if (hec > esp) warn.push(`${tag} (${id}): hay más actualizaciones realizadas que esperadas; se cuenta como 100 %.`);
      actualizaciones.push({ t: dn(f) + 1, id, esp, hec: Math.min(hec, esp) });
    });
    const team = { cfg, people, reuniones, actualizaciones, has: people.size > 0 && (reuniones.length > 0 || actualizaciones.length > 0) };

    return { P, start, dn, N, AT, corte: P.corte, areas, ots, hasCost, hasPaid, pagos, team, hitos, riesgos, adicionales, acciones, warn };
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

  function compute(M, ots, pagos = []) {
    if (!ots.length) return { empty: true, ots: [], rows: [], bac: 0, n: 0, nDone: 0, nLate: 0, pReal: 0, paid: 0 };
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

    // Costo incurrido acumulado en cada fecha de corte, y desembolsos acumulados por fecha de pago
    const costPts = M.hasCost ? [{ t: 0, v: 0 }].concat(ts.map((t) => ({ t, v: ots.reduce((s, o) => s + (realAt(o, t).c || 0), 0) }))) : null;
    const paidPts = [{ t: 0, v: 0 }];
    let paid = 0;
    pagos.slice().sort((a, b) => a.t - b.t).forEach((p) => {
      paid += p.monto;
      const last = paidPts[paidPts.length - 1];
      if (last.t === p.t) last.v = paid; else paidPts.push({ t: p.t, v: paid });
    });

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
        // días que la OT lleva detrás de su propio programa lineal
        delay: r.p >= 100 ? 0 : Math.max(0, Math.min(AT, o.i0 + o.dur) - (o.i0 + (r.p / 100) * o.dur)),
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
      ots, rows, bac, pv, ev, ac: M.hasCost ? ac : null, plan, real, PD, H, costPts, paidPts, paid,
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
  // Participación del equipo
  //   reuniones  = asistencias / convocatorias
  //   plataforma = actualizaciones realizadas / esperadas
  //   total      = promedio ponderado (por defecto 50 / 50)
  // =========================================================
  function participacion(M, ids, desde = -Infinity, hasta = Infinity) {
    const set = new Set(ids);
    let conv = 0, asis = 0, esp = 0, hec = 0;
    M.team.reuniones.forEach((r) => {
      if (r.t < desde || r.t > hasta) return;
      r.conv.forEach((id) => { if (set.has(id)) { conv++; if (r.asis.has(id)) asis++; } });
    });
    M.team.actualizaciones.forEach((a) => {
      if (a.t < desde || a.t > hasta || !set.has(a.id)) return;
      esp += a.esp; hec += a.hec;
    });
    const reun = conv ? (asis / conv) * 100 : null;
    const plat = esp ? (hec / esp) * 100 : null;
    const w = M.team.cfg.pesoReuniones;
    const total = reun != null && plat != null ? reun * w + plat * (1 - w) : reun != null ? reun : plat;
    return { reuniones: reun, plataforma: plat, total, conv, asis, esp, hec };
  }
  // Participación de un grupo, con la tendencia de los últimos 7 días contra los 7 anteriores
  function partOf(M, ids) {
    if (!M.team.has || !ids.length) return null;
    const p = participacion(M, ids);
    if (p.total == null) return null;
    const cur = participacion(M, ids, M.AT - 6, M.AT), prev = participacion(M, ids, M.AT - 13, M.AT - 7);
    p.tendencia = cur.total != null && prev.total != null ? cur.total - prev.total : null;
    return p;
  }
  const teamIds = (M, area) => [...M.team.people.values()].filter((e) => area == null || e.area === area).map((e) => e.id);

  // Color continuo rojo → amarillo → verde (tono HSL) según los umbrales [rojo_hasta, verde_desde]
  function partHue(v, u) {
    const [u1, u2] = u;
    const stops = [[u1 - 20, 2], [u1, 28], [(u1 + u2) / 2, 46], [u2, 100], [Math.min(100, u2 + 12), 135]];
    if (v <= stops[0][0]) return stops[0][1];
    for (let i = 1; i < stops.length; i++) {
      if (v <= stops[i][0]) {
        const [x0, h0] = stops[i - 1], [x1, h1] = stops[i];
        return Math.round(h0 + ((v - x0) / (x1 - x0)) * (h1 - h0));
      }
    }
    return stops[stops.length - 1][1];
  }
  const partLevel = (v, u) => (v < u[0] ? "Baja" : v < u[1] ? "Media" : "Alta");

  // =========================================================
  // Estados y semáforos (blanco y negro + rojo solo para alertas)
  // =========================================================
  function delaySt(d) {
    if (Math.abs(d) < 0.5) return { cls: "", ic: "check", txt: "En plazo", val: "En plazo" };
    if (d < 0) return { cls: "", ic: "up", txt: "Adelanto", val: days1(-d) };
    return { cls: d >= 2 ? "t-alert" : "", ic: "alert", txt: "Atraso", val: days1(d) };
  }

  const DOT = {
    ok: '<svg class="ic" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8.5" fill="var(--ink)" stroke="none"/><path d="M6 10.4l2.6 2.5L14 7.6" fill="none" stroke="var(--inv)" stroke-width="2"/></svg>',
    curso: '<svg class="ic" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7.5" fill="none" stroke="var(--ink)" stroke-width="2"/><path d="M10 2.5a7.5 7.5 0 0 1 0 15z" fill="var(--ink)" stroke="none"/></svg>',
    pend: '<svg class="ic" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7.5" fill="none" stroke="var(--ink-3)" stroke-width="2"/></svg>',
    late: '<svg class="ic" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8.5" fill="var(--alert)" stroke="none"/><path d="M10 5.5v5.5M10 14v.01" fill="none" stroke="#fff" stroke-width="2.2"/></svg>'
  };
  // =========================================================
  // Componentes · Rev. 1 (vista ejecutiva)
  // =========================================================
  const tipAttr = (html) => `data-tip="${esc(html)}"`;
  const card = (title, body, o = {}) =>
    `<section class="card ${o.cls || ""}"><div class="card-h"><span>${title}</span>${o.right ? `<small>${o.right}</small>` : ""}</div>${body}${o.foot ? `<div class="card-f">${o.foot}</div>` : ""}</section>`;
  const kpi = (ic, lbl, val, sub, alert) =>
    `<div class="card kpi ${alert ? "alert" : ""}">${icon(ic)}<div style="min-width:0"><div class="lbl">${lbl}</div><div class="val">${val}</div><div class="sub">${sub}</div></div></div>`;
  const empty = (txt) => `<div class="empty">${txt}</div>`;
  const areaTag = (V, id) => (V.isArea ? "" : " · " + esc(V.areaName(id)));

  // Desvarada proyectada = fin de trabajos proyectado + la holgura planificada entre fin de trabajos y desvarada
  function desvaradaProj(V) {
    const s = V.s, M = V.M;
    if (!s.projEnd) return null;
    return addDays(s.projEnd, Math.max(1, M.N - s.PD + 1));
  }
  const needUpOf = (s) => (s.ratePlan > 0 && s.rateNeed != null ? (s.rateNeed / s.ratePlan - 1) * 100 : null);
  const extrasOf = (V) => V.adicionales.reduce((a, x) => a + x.monto, 0);

  function kpisHTML(V) {
    const s = V.s, M = V.M;
    const d = delaySt(s.delay);
    const fin = V.isArea
      ? `Fin ${fmtShort(s.projEnd)} · plan ${fmtShort(s.planEnd)}`
      : `Desvarada ${fmtShort(desvaradaProj(V))} · plan ${fmtShort(M.P.salidaPlan)}`;
    const up = needUpOf(s);
    const ritmo = up == null ? "plan finalizado" : Math.abs(up) < 0.5 ? "ritmo según plan" : `ritmo req. ${sgn(up, (x) => x.toFixed(0) + "%")}`;
    const inc = s.ac == null
      ? kpi("dollar", "Incurrido", '<span class="t-muted">Sin datos</span>', "No se informan costos")
      : kpi("dollar", "Incurrido", moneyK(s.ac), `${s.pv ? pct((s.ac / s.pv) * 100, 0) : "—"} del plan · CPI ${s.cpi == null ? "—" : s.cpi.toFixed(2)}`, s.cpi != null && s.cpi < 0.9);
    const des = !M.hasPaid
      ? kpi("wallet", "Desembolsado", '<span class="t-muted">Sin datos</span>', "No se informan pagos")
      : kpi("wallet", "Desembolsado", moneyK(s.paid), s.ac ? `${pct((s.paid / s.ac) * 100, 0)} de lo incurrido · por pagar ${moneyK(Math.max(0, s.ac - s.paid)).replace(CUR + " ", "")}` : "Pagado a la fecha");
    return [
      kpi("hourglass", d.txt === "Adelanto" ? "Adelanto" : "Atraso", d.val, fin, d.cls === "t-alert"),
      kpi("gauge", "Avance físico", pct(s.pReal), `Plan ${pct(s.pPlan)} · ${ritmo}`),
      kpi("target", "Costo plan", moneyK(s.pv), `A la fecha · de ${moneyK(s.bac)}`),
      inc,
      des,
      partKpi(V)
    ].join("");
  }

  function partTip(p, titulo) {
    const row = (k, v) => `<div class="row"><span>${k}</span><span>${v}</span></div>`;
    return `<b>${esc(titulo)}</b>` +
      row("Reuniones", p.reuniones == null ? "—" : `${pct(p.reuniones, 0)} (${p.asis} de ${p.conv})`) +
      row("Plataforma", p.plataforma == null ? "—" : `${pct(p.plataforma, 0)} (${p.hec} de ${p.esp})`) +
      (p.tendencia != null ? row("Últimos 7 días", sgn(p.tendencia, (x) => x.toFixed(0)) + " pp") : "");
  }
  // Chip de participación: punto de color + porcentaje + nivel (el color nunca va solo)
  function partChip(p, M, titulo) {
    if (!p) return '<span class="t-muted">—</span>';
    return `<span class="pchip" style="--pc-h:${partHue(p.total, M.team.cfg.umbrales)}" ${tipAttr(partTip(p, titulo))}><i></i>${pct(p.total, 0)}<small>${partLevel(p.total, M.team.cfg.umbrales)}</small></span>`;
  }
  function partKpi(V) {
    const p = V.part, M = V.M;
    if (!p) return kpi("users", "Participación", '<span class="t-muted">Sin datos</span>', "No se informan reuniones ni actualizaciones");
    const u = M.team.cfg.umbrales;
    const tr = p.tendencia == null ? "" : Math.abs(p.tendencia) < 0.5 ? " · estable en 7 días"
      : ` · ${p.tendencia > 0 ? "▲" : "▼"} ${Math.abs(p.tendencia).toFixed(0)} pp en 7 días`;
    return `<div class="card kpi part" style="--pc-h:${partHue(p.total, u)}" ${tipAttr(partTip(p, "Participación del equipo"))}>${icon("users")}
      <div style="min-width:0;flex:1"><div class="lbl">Participación</div>
        <div class="val"><span class="pc-txt">${pct(p.total, 0)}</span> <span class="pc-lvl">${partLevel(p.total, u)}</span></div>
        <div class="pmeter" aria-hidden="true"><i style="width:${Math.min(100, p.total)}%"></i></div>
        <div class="sub">Reuniones ${p.reuniones == null ? "—" : pct(p.reuniones, 0)} · Plataforma ${p.plataforma == null ? "—" : pct(p.plataforma, 0)}${tr}</div></div></div>`;
  }
  // Detalle por persona, de menor a mayor participación
  function teamCard(V) {
    const M = V.M;
    if (!M.team.has) return "";
    const ids = V.isArea ? teamIds(M, V.area.id) : teamIds(M, null);
    const rows = ids.map((id) => ({ e: M.team.people.get(id), p: participacion(M, [id]) })).filter((r) => r.p.total != null)
      .sort((a, b) => a.p.total - b.p.total);
    if (!rows.length) return card("Participación del equipo", empty("Sin registros de participación para esta área."));
    const max = V.isArea ? 99 : 6;
    const u = M.team.cfg.umbrales;
    const cell = (v) => (v == null ? '<span class="t-muted">—</span>' : pct(v, 0));
    const body = `<div class="tbl-scroll"><table><thead><tr><th>Persona</th>${V.isArea ? "" : "<th>Área</th>"}<th class="num">Reuniones</th><th class="num">Plataforma</th><th>Participación</th></tr></thead><tbody>
      ${rows.slice(0, max).map(({ e, p }) => `<tr><td class="name"><b>${esc(e.nombre)}</b></td>${V.isArea ? "" : `<td class="small">${esc(e.area ? V.areaName(e.area) : "General")}</td>`}
        <td class="num">${cell(p.reuniones)}<small class="t-muted"> ${p.conv ? p.asis + "/" + p.conv : ""}</small></td>
        <td class="num">${cell(p.plataforma)}<small class="t-muted"> ${p.esp ? p.hec + "/" + p.esp : ""}</small></td>
        <td><div class="pbar" style="--pc-h:${partHue(p.total, u)}" ${tipAttr(partTip(p, e.nombre))}><div class="pmeter"><i style="width:${Math.min(100, p.total)}%"></i></div>
          <span class="pc-txt strong">${pct(p.total, 0)}</span><small>${partLevel(p.total, u)}</small></div></td></tr>`).join("")}
      </tbody></table></div>`;
    return card("Participación del equipo" + (V.isArea ? " · " + esc(V.area.nombre) : ""), body, {
      right: V.isArea ? "de menor a mayor" : `las ${Math.min(max, rows.length)} más bajas de ${rows.length}`,
      foot: `Participación = ${Math.round(M.team.cfg.pesoReuniones * 100)} % asistencia a reuniones + ${Math.round((1 - M.team.cfg.pesoReuniones) * 100)} % actualización de la plataforma. Rojo bajo ${u[0]} %, amarillo hasta ${u[1]} %, verde desde ${u[1]} %.`
    });
  }

  function costCard(V) {
    const s = V.s, M = V.M;
    const extra = extrasOf(V);
    const fin = (s.eac != null ? s.eac : s.bac) + extra;
    const over = ((fin - s.bac) / s.bac) * 100;
    return card("Costo acumulado · plan, incurrido y desembolsado", `<div class="card-b" style="padding-bottom:6px">
        <div class="legend">
          <span><i class="sw-dash"></i>Costo plan</span>
          ${M.hasCost ? '<span><i class="sw-line"></i>Incurrido</span>' : ""}
          ${M.hasPaid ? '<span><i class="sw-paid"></i>Desembolsado</span>' : ""}
          <span><i class="sw-dot"></i>Presupuesto</span>
        </div>
        <div class="chart" id="ccurve" role="img" aria-label="Costo acumulado planificado, incurrido y desembolsado"></div>
      </div>
      <div class="stats3">
        <div><div class="t">Presupuesto</div><div class="n">${moneyK(s.bac)}</div><div class="small t-muted">${plural(s.n, "orden", "órdenes")} de trabajo</div></div>
        <div><div class="t">Adicionales</div><div class="n">${extra ? "+ " + moneyK(extra) : "—"}</div><div class="small t-muted">${extra ? pct((extra / s.bac) * 100) + " del presupuesto" : "sin adicionales"}</div></div>
        <div><div class="t">${s.eac != null ? "Costo final estimado" : "Presupuesto + adicionales"}</div>
          <div class="n ${over > 5 ? "t-alert" : ""}">${moneyK(fin)}</div>
          <div class="small ${over > 5 ? "t-alert" : "t-muted"}">${sgn(over, (x) => pct(x))} vs presupuesto</div></div>
      </div>`, { cls: "wide", right: s.eac != null ? "costo final = presupuesto / CPI + adicionales" : "" });
  }

  // Atención: acciones vencidas, riesgos altos y acciones que vencen en los próximos 2 días
  function attentionCard(V) {
    const M = V.M, today = M.dn(M.corte);
    const open = V.acciones.filter((a) => !/cerrad/i.test(a.estado || "")).map((a) => Object.assign({}, a, { dd: M.dn(a.fecha) - today }));
    const late = open.filter((a) => a.dd < 0).sort((a, b) => a.dd - b.dd).slice(0, 3);
    const risks = V.riesgos.filter((r) => r.lv.k === "muy-alto" || r.lv.k === "alto")
      .sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, 3);
    const soon = open.filter((a) => a.dd >= 0 && a.dd <= 2).sort((a, b) => a.dd - b.dd);
    const when = (dd) => (dd === 0 ? "Hoy" : dd === 1 ? "Mañana" : `En ${dd} días`);
    const items = [];
    late.forEach((a) => items.push(`<div class="li">${icon("alert", "ic t-alert")}<div class="main"><b>${esc(a.accion)}</b>
      <small>Acción · ${esc(a.resp || "Sin responsable")}${areaTag(V, a.area)}</small></div>
      <div class="side strong t-alert">Vencida<small>${fmtShort(a.fecha)}</small></div></div>`));
    risks.forEach((r) => items.push(`<div class="li"><i class="sq" style="background:${r.lv.color}"></i><div class="main"><b>${esc(r.desc)}</b>
      <small>Riesgo · ${esc(r.resp || r.categoria || "")}${areaTag(V, r.area)}</small></div>
      <div class="side"><span class="strong ${r.lv.k === "muy-alto" ? "t-alert" : ""}">${r.lv.label}</span>${r.score ? `<small class="pxi">P×I ${r.score}</small>` : ""}</div></div>`));
    soon.forEach((a) => items.push(`<div class="li">${icon("flag", "ic")}<div class="main"><b>${esc(a.accion)}</b>
      <small>Acción · ${esc(a.resp || "Sin responsable")}${areaTag(V, a.area)}</small></div>
      <div class="side strong ${a.dd === 0 ? "t-alert" : ""}">${fmtShort(a.fecha)}<small class="${a.dd === 0 ? "t-alert" : "t-muted"}">${when(a.dd)}</small></div></div>`));
    const max = 6;
    const body = items.length
      ? `<div class="list">${items.slice(0, max).join("")}</div>`
      : empty("Sin alertas: no hay riesgos altos ni acciones por vencer.");
    return card("Atención", body, {
      right: "riesgos altos y acciones por vencer",
      foot: `${plural(V.riesgos.length, "riesgo", "riesgos")} y ${plural(open.length, "acción abierta", "acciones abiertas")} en total.`
    });
  }

  function bullet(real, plan) {
    return `<div class="bcell" ${tipAttr(`<b>Avance</b><div class="row"><span>Real</span><span>${pct(real, 0)}</span></div><div class="row"><span>Planificado</span><span>${pct(plan, 0)}</span></div>`)}>
      <div class="bullet"><div class="f" style="width:${Math.min(100, real)}%"></div><div class="m" style="left:${Math.min(100, plan)}%"></div></div>
      <span class="lb">${pct(real, 0)} / ${pct(plan, 0)}</span></div>`;
  }
  const delayCell = (d) => { const st = delaySt(d); return `<span class="st ${st.cls}">${st.ic ? icon(st.ic, "ic sm") : ""}${st.val}</span>`; };
  const moneyCell = (v) => (v == null ? '<span class="t-muted">—</span>' : moneyK(v));

  // Resumen: una fila por área · Vista de área: solo las órdenes atrasadas
  function tableCard(V) {
    const M = V.M, c = M.hasCost, p = M.hasPaid, t = M.team.has, s = V.s;
    if (!V.isArea) {
      const head = `<tr><th></th><th>Área</th><th>Avance real / plan</th><th>Atraso</th><th class="num">Costo plan</th>${c ? '<th class="num">Incurrido</th>' : ""}${p ? '<th class="num">Desembolsado</th>' : ""}${t ? "<th>Participación</th>" : ""}<th></th></tr>`;
      const span = 6 + (c ? 1 : 0) + (p ? 1 : 0) + (t ? 1 : 0);
      const rows = V.areaStats.map(({ a, s: as }) => {
        const go = `class="go" data-go="${esc(a.id)}" tabindex="0" aria-label="Ver detalle de ${esc(a.nombre)}"`;
        if (as.empty) return `<tr ${go}><td>${icon(a.icono, "ic")}</td><td class="name"><b>${esc(a.nombre)}</b><small>Sin órdenes de trabajo</small></td><td colspan="${span - 3}" class="t-muted small">Sin datos cargados</td><td class="go-arrow">${icon("chevron", "ic sm")}</td></tr>`;
        return `<tr ${go}><td>${icon(a.icono, "ic")}</td>
          <td class="name"><b>${esc(a.nombre)}</b><small>${plural(as.nLate, "orden atrasada", "órdenes atrasadas")} de ${as.n}</small></td>
          <td>${bullet(as.pReal, as.pPlan)}</td><td class="nw">${delayCell(as.delay)}</td>
          <td class="num">${moneyK(as.pv)}</td>${c ? `<td class="num">${moneyCell(as.ac)}</td>` : ""}${p ? `<td class="num">${moneyK(as.paid)}</td>` : ""}
          ${t ? `<td class="nw">${partChip(partOf(M, teamIds(M, a.id)), M, "Participación · " + a.nombre)}</td>` : ""}
          <td class="go-arrow">${icon("chevron", "ic sm")}</td></tr>`;
      }).join("");
      const total = `<tr class="total"><td></td><td>TOTAL DIQUE</td><td>${pct(s.pReal)} / ${pct(s.pPlan)}</td><td class="nw">${delaySt(s.delay).val}</td>
        <td class="num">${moneyK(s.pv)}</td>${c ? `<td class="num">${moneyK(s.ac)}</td>` : ""}${p ? `<td class="num">${moneyK(s.paid)}</td>` : ""}${t ? `<td class="nw">${V.part ? pct(V.part.total, 0) : "—"}</td>` : ""}<td></td></tr>`;
      return card("Por área", `<div class="tbl-scroll"><table><thead>${head}</thead><tbody>${rows}${total}</tbody></table></div>`,
        { right: "clic en un área para ver el detalle" });
    }
    const late = s.rows.filter((r) => r.estado === "atrasada").sort((a, b) => b.delay - a.delay);
    const head = `<tr><th>OT</th><th>Trabajo</th><th>Avance real / plan</th><th>Atraso</th><th class="num">Costo plan</th>${c ? '<th class="num">Incurrido</th>' : ""}</tr>`;
    const rows = late.map((r) => `<tr><td class="code">${esc(r.o.id)}</td>
      <td class="name"><b>${esc(r.o.nombre)}</b><small>${esc(r.o.ejecuta || "")} · fin ${fmtShort(r.o.fin)}</small></td>
      <td>${bullet(r.real, r.plan)}</td><td class="nw">${delayCell(r.delay)}</td>
      <td class="num">${moneyK(r.pv)}</td>${c ? `<td class="num">${moneyCell(r.ac)}</td>` : ""}</tr>`).join("");
    const body = late.length
      ? `<div class="tbl-scroll"><table><thead>${head}</thead><tbody>${rows}</tbody></table></div>`
      : empty("Ninguna orden de trabajo atrasada.");
    return card("Órdenes atrasadas · " + esc(V.area.nombre), body, {
      right: `${late.length} de ${s.n}`,
      foot: "Atraso de cada orden = días que lleva detrás de su propio programa. El listado completo está en la Rev. 0."
    });
  }

  function hitoInfo(h, M) {
    if (h.fechaReal) return { dot: DOT.ok, txt: "Completado", cls: "" };
    if (h.fechaPlan < M.corte) return { dot: DOT.late, txt: h.avance > 0 ? `Vencido · ${h.avance}%` : "Vencido", cls: "t-alert" };
    if (h.avance > 0) return { dot: DOT.curso, txt: `En curso · ${h.avance}%`, cls: "" };
    return { dot: DOT.pend, txt: "No iniciado", cls: "t-muted" };
  }
  function hitosCard(V) {
    const M = V.M, today = M.dn(M.corte);
    const pool = V.isArea ? V.hitos : V.hitos.filter((h) => h.clave);
    const list = pool.filter((h) => !h.fechaReal).sort((a, b) => a.fechaPlan.localeCompare(b.fechaPlan)).slice(0, 4);
    const last = pool.filter((h) => h.fechaReal).sort((a, b) => a.fechaReal.localeCompare(b.fechaReal)).pop();
    const body = list.length ? `<div class="list">${list.map((h) => {
      const i = hitoInfo(h, M);
      const dd = M.dn(h.fechaPlan) - today;
      const rel = dd < 0 ? `hace ${plural(-dd, "día", "días")}` : dd === 0 ? "hoy" : `en ${plural(dd, "día", "días")}`;
      return `<div class="li">${i.dot}<div class="main"><b>${esc(h.nombre)}</b><small class="${i.cls}">${i.txt}${areaTag(V, h.area)}</small></div>
        <div class="side strong">${fmtShort(h.fechaPlan)}<small class="${dd < 0 ? "t-alert" : "t-muted"}">${rel}</small></div></div>`;
    }).join("")}</div>` : empty("Todos los hitos están completados.");
    return card("Próximos hitos", body, { foot: last ? `Último completado: ${esc(last.nombre)} (${fmtShort(last.fechaReal)}).` : "" });
  }

  // =========================================================
  // Curva de costo acumulado (SVG)
  // =========================================================
  function niceTicks(max, n = 5) {
    const raw = max / n, mag = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / mag;
    const step = (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * mag;
    const out = [];
    for (let i = 0; i * step <= max + step * 0.999; i++) out.push(i * step);
    return out;
  }
  const fmtAxis = (v) => (v === 0 ? "0" : v >= 1e6 ? (v / 1e6).toFixed(2).replace(/\.?0+$/, "") + " M" : Math.round(v / 1e3) + " k");

  function drawCost(el, V) {
    const s = V.s, M = V.M;
    el.innerHTML = "";
    const W = Math.max(280, el.clientWidth), Hh = Math.max(210, el.clientHeight);
    const X = Math.max(M.N, s.H);
    const ticks = niceTicks(Math.max(s.bac, s.eac || 0) * 1.03);
    const ymax = ticks[ticks.length - 1];
    const side = W >= 480; // en pantallas chicas las cifras al corte ya están en los indicadores
    const m = { l: 50, r: side ? 104 : 14, t: 18, b: 28 };
    const x = (t) => m.l + ((W - m.l - m.r) * t) / X;
    const y = (v) => m.t + (Hh - m.t - m.b) * (1 - v / ymax);
    const dateOfT = (t) => addDays(M.start, Math.max(0, t - 1));
    const planAt = (t) => (s.plan[Math.min(t, s.plan.length - 1)] / 100) * s.bac;
    const lastAt = (pts, t) => { let r = null; for (const p of pts) { if (p.t <= t) r = p; else break; } return r; };
    const toPath = (pts) => pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join("");

    let g = "";
    ticks.forEach((v) => {
      g += `<line class="grid-l" x1="${m.l}" x2="${W - m.r}" y1="${y(v)}" y2="${y(v)}"/>`;
      g += `<text class="ax" x="${m.l - 6}" y="${y(v) + 4}" text-anchor="end">${fmtAxis(v)}</text>`;
    });
    const step = W < 560 ? 14 : 7;
    for (let t = 1; t <= X; t += step) {
      if (Math.abs(M.N - t) < step * 0.6) continue;
      g += `<text class="ax" x="${x(t)}" y="${Hh - 8}" text-anchor="middle">${fmtShort(dateOfT(t))}</text>`;
    }
    g += `<text class="ax" x="${x(M.N)}" y="${Hh - 8}" text-anchor="middle">${fmtShort(M.P.salidaPlan)}</text>`;

    const planPts = [];
    for (let t = 0; t <= X; t++) planPts.push([x(t), y(planAt(t))]);
    const AT = Math.min(M.AT, X);
    const ax = x(AT);

    // Desembolsado: escalones (los pagos son discretos), hasta la fecha de corte
    let paidSvg = "";
    if (M.hasPaid) {
      const pts = [[x(0), y(0)]];
      let prev = 0;
      s.paidPts.slice(1).forEach((p) => { pts.push([x(p.t), y(prev)], [x(p.t), y(p.v)]); prev = p.v; });
      pts.push([ax, y(prev)]);
      const area = pts.concat([[ax, y(0)], [x(0), y(0)]]);
      paidSvg = `<polygon points="${area.map((p) => p.join(",")).join(" ")}" fill="var(--paid-fill)"/>
        <path d="${toPath(pts)}" fill="none" stroke="var(--paid-line)" stroke-width="2"/>`;
    }
    const incSvg = M.hasCost ? `<path d="${toPath(s.costPts.map((p) => [x(p.t), y(p.v)]))}" fill="none" stroke="var(--real)" stroke-width="2.5" stroke-linejoin="round"/>` : "";

    // Etiquetas al corte (a la derecha del gráfico), separadas para que no se monten
    const labels = [{ k: "Costo plan", v: planAt(AT) }];
    if (M.hasCost) labels.push({ k: "Incurrido", v: lastAt(s.costPts, AT).v });
    if (M.hasPaid) labels.push({ k: "Desembolsado", v: s.paid });
    labels.forEach((l) => (l.y = y(l.v)));
    labels.sort((a, b) => a.y - b.y);
    for (let i = 1; i < labels.length; i++) if (labels[i].y - labels[i - 1].y < 28) labels[i].y = labels[i - 1].y + 28;
    const over = labels.length ? labels[labels.length - 1].y - (Hh - m.b - 12) : 0;
    if (over > 0) labels.forEach((l) => (l.y -= over));
    const lx = W - m.r + 12;
    const labSvg = !side ? "" : labels.map((l) => `<line x1="${ax + 5}" x2="${lx - 4}" y1="${y(l.v)}" y2="${l.y}" stroke="var(--border)"/>
      <text x="${lx}" y="${l.y - 3}" class="ax">${l.k}</text>
      <text x="${lx}" y="${l.y + 11}" font-size="12.5" font-weight="700" fill="var(--ink)">${moneyK(l.v).replace(CUR + " ", "")}</text>`).join("");

    el.innerHTML = `<svg width="${W}" height="${Hh}" viewBox="0 0 ${W} ${Hh}">
      ${g}
      <line x1="${m.l}" x2="${W - m.r}" y1="${y(s.bac)}" y2="${y(s.bac)}" stroke="var(--ink-3)" stroke-dasharray="1 3"/>
      <text class="ax" x="${m.l + 4}" y="${y(s.bac) - 5}">Presupuesto ${moneyK(s.bac)}</text>
      ${paidSvg}
      <line x1="${ax}" x2="${ax}" y1="${m.t}" y2="${Hh - m.b}" stroke="var(--ink-2)" stroke-dasharray="3 3"/>
      <text class="ax" x="${ax}" y="${m.t - 6}" text-anchor="middle">Corte · día ${M.AT}</text>
      <path d="${toPath(planPts)}" fill="none" stroke="var(--plan)" stroke-width="2" stroke-dasharray="6 4"/>
      ${incSvg}
      ${M.hasCost ? `<circle cx="${ax}" cy="${y(lastAt(s.costPts, AT).v)}" r="4.5" fill="var(--real)" stroke="var(--surface)" stroke-width="2"/>` : ""}
      ${labSvg}
      <g class="hv" style="display:none"><line class="hv-l" y1="${m.t}" y2="${Hh - m.b}" stroke="var(--ink-2)"/></g>
      <rect class="hv-hit" x="${m.l}" y="${m.t}" width="${W - m.l - m.r}" height="${Hh - m.t - m.b}" fill="transparent"/>
    </svg>`;

    const svg = el.querySelector("svg");
    const hv = svg.querySelector(".hv"), hl = svg.querySelector(".hv-l"), hit = svg.querySelector(".hv-hit");
    hit.addEventListener("mousemove", (e) => {
      const rect = svg.getBoundingClientRect();
      const t = Math.max(0, Math.min(X, Math.round(((e.clientX - rect.left - m.l) / (W - m.l - m.r)) * X)));
      hv.style.display = "";
      hl.setAttribute("x1", x(t)); hl.setAttribute("x2", x(t));
      const past = t <= AT;
      const inc = M.hasCost && past ? lastAt(s.costPts, t) : null;
      const paid = M.hasPaid && past ? lastAt(s.paidPts, t) : null;
      showTip(`<b>${t === 0 ? "Entrada a dique" : fmtDate(dateOfT(t)) + " · día " + t}</b>
        <div class="row"><span>Costo plan</span><span>${moneyK(planAt(t))}</span></div>
        ${M.hasCost ? `<div class="row"><span>Incurrido</span><span>${inc ? moneyK(inc.v) : "—"}</span></div>` : ""}
        ${M.hasPaid ? `<div class="row"><span>Desembolsado</span><span>${paid ? moneyK(paid.v) : "—"}</span></div>` : ""}`, e.clientX, e.clientY);
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
        part: partOf(M, teamIds(M, area.id)),
        s: compute(M, M.ots.filter((o) => o.area === area.id), M.pagos.filter(f)),
        hitos: M.hitos.filter(f), riesgos: M.riesgos.filter(f), adicionales: M.adicionales.filter(f), acciones: M.acciones.filter(f)
      });
    }
    return Object.assign(base, {
      key: "resumen", isArea: false,
      part: partOf(M, teamIds(M, null)),
      s: compute(M, M.ots, M.pagos),
      areaStats: M.areas.map((a) => ({ a, s: compute(M, M.ots.filter((o) => o.area === a.id), M.pagos.filter((p) => p.area === a.id)) })),
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
    $("hero-title").textContent = V.isArea ? "Área de " + V.area.nombre : "Proyecto de dique";
    $("hero-sub").textContent = [M.P.buque, V.isArea ? V.area.descripcion : [M.P.tipo, M.P.dique].filter(Boolean).join(" · ")].filter(Boolean).join(" · ");
    $("upd-date").textContent = fmtDate(M.corte);
    $("upd-day").textContent = `Día ${Math.min(M.AT, M.N)} de ${M.N} · desvarada ${fmtShort(M.P.salidaPlan)}`;
    document.title = (V.isArea ? V.area.nombre + " · " : "") + "Control de Dique · Rev. 1";
    $("foot-src").textContent = M.P.fuente || (fuente ? "Fuente: " + fuente : "Datos de ejemplo");
    $("rev-link").href = "../rev0/index.html" + location.search + "#" + encodeURIComponent(V.key);

    const notice = M.warn.length
      ? `<details class="notice"><summary>${plural(M.warn.length, "observación", "observaciones")} en los datos de entrada</summary><ul>${M.warn.map((w) => `<li>${esc(w)}</li>`).join("")}</ul></details>`
      : "";
    app.innerHTML = V.s.empty
      ? `${notice}${card("Desempeño", empty(`${V.isArea ? "Esta área" : "El proyecto"} aún no tiene órdenes de trabajo. Al cargarlas aparecerán aquí el avance y los costos.`))}
        <div class="row-b">${attentionCard(V)}${hitosCard(V)}</div>`
      : `${notice}
        <div class="kpis">${kpisHTML(V)}</div>
        <div class="row-b">${costCard(V)}${attentionCard(V)}</div>
        <div class="row-b">${tableCard(V)}${hitosCard(V)}</div>
        ${teamCard(V)}`;
    if (!V.s.empty) { const el = $("ccurve"); drawCost(el, V); watchChart(el); }
  }

  // Respaldo: un navegador en segundo plano no avisa los cambios de tamaño; al volver a mostrarse se ajusta
  document.addEventListener("visibilitychange", () => {
    const el = $("ccurve");
    if (!document.hidden && VIEW && el && Math.abs(el.clientWidth - (+el.firstElementChild?.getAttribute("width") || 0)) > 2) drawCost(el, VIEW);
  });

  // Redibuja el gráfico cuando cambia el ancho de su tarjeta (ventana, rotación, pantalla completa)
  let chartObs = null, chartTimer = 0;
  function watchChart(el) {
    if (!("ResizeObserver" in window)) return;
    if (chartObs) chartObs.disconnect();
    let w = el.clientWidth;
    chartObs = new ResizeObserver(() => {
      if (Math.abs(el.clientWidth - w) < 2) return;
      clearTimeout(chartTimer);
      chartTimer = setTimeout(() => { w = el.clientWidth; if (VIEW && !VIEW.s.empty && el.isConnected) drawCost(el, VIEW); }, 80);
    });
    chartObs.observe(el);
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
    const pick = (s, part) => s.empty ? { vacio: true, ordenes: 0 } : ({
      bac: s.bac, pv: s.pv, ev: s.ev, ac: s.ac, sv: s.sv, cv: s.cv, spi: s.spi, cpi: s.cpi, eac: s.eac,
      avancePlan: s.pPlan, avanceReal: s.pReal, atrasoDias: s.delay, finProyectado: iso(s.projEnd),
      desembolsado: MODEL.hasPaid ? s.paid : null,
      participacion: part ? { total: part.total, reuniones: part.reuniones, plataforma: part.plataforma, tendencia7d: part.tendencia } : null,
      porPagar: MODEL.hasPaid && s.ac != null ? s.ac - s.paid : null,
      ordenes: s.n, terminadas: s.nDone, atrasadas: s.nLate
    });
    const out = { corte: MODEL.corte, conCostos: MODEL.hasCost, conDesembolsos: MODEL.hasPaid, total: pick(compute(MODEL, MODEL.ots, MODEL.pagos), partOf(MODEL, teamIds(MODEL, null))), areas: {} };
    MODEL.areas.forEach((a) => { out.areas[a.id] = pick(compute(MODEL, MODEL.ots.filter((o) => o.area === a.id), MODEL.pagos.filter((p) => p.area === a.id)), partOf(MODEL, teamIds(MODEL, a.id))); });
    return out;
  }
  window.Dique = { cargar, cargarDesdeUrl, indicadores, version: "1.1", revision: 1 };

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
