/*
 * Versión liviana para enviar a media semana: solo el registro semanal (registro.js).
 *   semana.html          → la semana actual abierta (o la más reciente cargada); las anteriores, cerradas debajo
 *   semana.html?s=5      → abre la semana 5 (número de "semana" en registro.js)
 * Usa los datos de Monday solo para el día de dique en la cabecera.
 */
(function () {
  "use strict";
  const DAY = 864e5;
  const parse = (s) => new Date(s + "T00:00:00");
  const iso = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const MES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const fmtShort = (s) => { const d = parse(s); return `${d.getDate()} ${MES[d.getMonth()]}`; };
  const fmtDate = (s) => { const d = parse(s); return `${d.getDate()} ${MES[d.getMonth()]} ${d.getFullYear()}`; };
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const TODAY = iso(new Date());
  const R = window.DIQUE_REGISTRO || { semanas: [] }, D = window.DIQUE_MONDAY || {};
  const app = document.getElementById("lt-app");

  // Semana: la pedida en ?s=N, si no la que contiene hoy, si no la más reciente
  const pedida = +new URLSearchParams(location.search).get("s");
  const w = (pedida && R.semanas.find((x) => x.semana === pedida)) || R.semanas.find((x) => x.desde <= TODAY && TODAY <= x.hasta) || R.semanas[0];
  if (!w) { app.innerHTML = '<p class="lt-vacio">Todavía no hay semanas registradas.</p>'; return; }

  // Etapa del dique a la fecha de corte (hoy, o el fin de la semana si ya pasó)
  const corte = w.hasta < TODAY ? w.hasta : TODAY;
  const fases = (D.cronograma || []).filter((r) => Array.isArray(r.real) && r.duracion > 0 && /ejecuci|traslado|planifica/i.test(r.nombre));
  const f = fases.filter((r) => r.real[0] <= corte && corte <= r.real[1]).sort((a, b) => (a.real[0] < b.real[0] ? 1 : -1))[0];
  const nomFase = (r) => (/^dique/i.test(r.nombre) ? "En dique" : /pre-dique/i.test(r.nombre) ? "Pre-dique" : /post/i.test(r.nombre) ? "Post-dique" : r.nombre.replace(/\s*\(ejecuci[oó]n\)/i, ""));
  const etapa = f ? `${nomFase(f)} · día ${Math.round((parse(corte) - parse(f.real[0])) / DAY) + 1} de ${Math.round((parse(f.real[1]) - parse(f.real[0])) / DAY) + 1}` : "";

  document.getElementById("lt-titulo").textContent = `Semana · ${fmtShort(w.desde)} – ${fmtShort(w.hasta)}`;
  document.getElementById("lt-sub").textContent = ["M/V Kelly Trader", etapa, `al ${fmtDate(corte)}`].filter(Boolean).join(" · ");
  document.title = `Registro semanal · ${fmtShort(w.desde)} – ${fmtShort(w.hasta)} · Kelly Trader`;

  const minDe = (m) => (m.tipo === "foto" ? m.archivo.replace(/\.jpg$/i, "-min.jpg") : m.archivo);
  const play = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"/></svg>';
  const MEDIOS = []; // todas las fotos y videos, en el orden de la página (las recorre el visor)
  const medio = (m) => { const i = MEDIOS.push(m) - 1; return `<button type="button" class="reg-m" data-medio="${i}" aria-label="${esc(m.texto)}">${m.tipo === "video"
    ? `<video src="${esc(m.archivo)}#t=1" preload="metadata" muted playsinline></video><span class="reg-play">${play}</span>`
    : `<img src="${esc(minDe(m))}" alt="${esc(m.texto)}" loading="lazy">`}<span class="reg-cap">${esc(m.texto)}</span></button>`; };
  const cuenta = (x) => { const v = (x.medios || []).filter((m) => m.tipo === "video").length, n = (x.medios || []).length - v; return n || v ? `${n} ${n === 1 ? "foto" : "fotos"}${v ? ` y ${v} ${v === 1 ? "video" : "videos"}` : ""}` : "sin fotos"; };
  const semana = (x) => {
    const ms = x.medios || [];
    const zonas = (x.avance || []).map((g) => `<div class="reg-zona${/importante/i.test(g.zona) ? " lt-imp" : ""}"><b>${esc(g.zona)}</b><ul>${g.items.map((it) => `<li>${esc(it.txt)}${it.extra ? ` · <strong>${esc(it.extra)}</strong>` : ""}</li>`).join("")}</ul></div>`).join("");
    const fotos = ms.map((m, i) => (m.grupo && (i === 0 || ms[i - 1].grupo !== m.grupo) ? `<b class="reg-gh">${esc(m.grupo)}</b>` : "") + medio(m)).join("");
    return `<div class="reg-av lt-av">${zonas || '<p class="muted">Todavía no hay registro de esta semana.</p>'}${x.fuente ? `<p class="muted sm">Fuente: ${esc(x.fuente)}</p>` : ""}</div>
      ${ms.length ? `<div class="lt-fh">Fotos y videos</div><div class="reg-grid">${fotos}</div>` : ""}`;
  };
  // La semana elegida arriba y abierta; las demás (más recientes primero) cerradas
  const orden = [w, ...R.semanas.filter((x) => x !== w)];
  app.innerHTML = orden.map((x, k) => `<details class="card lt-sem" ${k === 0 ? "open" : ""}><summary class="card-h"><span>Semana · ${fmtShort(x.desde)} – ${fmtShort(x.hasta)}${x === w && w.desde <= TODAY && TODAY <= w.hasta ? ' <em class="reg-hoy">esta semana</em>' : ""}</span><small>${cuenta(x)}</small></summary>${semana(x)}</details>`).join("");

  // Descargar en PDF: se usa la impresión del navegador ("Guardar como PDF"). Sale lo que está abierto:
  // la semana actual y las anteriores que se hayan desplegado. Las fotos van en miniatura.
  document.getElementById("lt-pdf").addEventListener("click", () => {
    const t = document.title;
    document.title = `Registro semanal Kelly Trader ${fmtShort(w.desde)} - ${fmtShort(w.hasta)}`;
    app.querySelectorAll("img[loading=lazy]").forEach((i) => (i.loading = "eager"));
    setTimeout(() => { window.print(); document.title = t; }, 300);
  });

  // Visor de fotos y videos
  const lb = document.createElement("div");
  lb.className = "lb"; lb.hidden = true;
  lb.innerHTML = '<button type="button" class="lb-x" aria-label="Cerrar">×</button><button type="button" class="lb-p" aria-label="Anterior">‹</button><figure class="lb-f"></figure><button type="button" class="lb-n" aria-label="Siguiente">›</button>';
  document.body.appendChild(lb);
  let I = 0;
  const show = (i) => {
    I = (i + MEDIOS.length) % MEDIOS.length;
    const m = MEDIOS[I];
    lb.querySelector(".lb-f").innerHTML = (m.tipo === "video" ? `<video src="${esc(m.archivo)}" controls autoplay playsinline></video>` : `<img src="${esc(m.archivo)}" alt="${esc(m.texto)}">`) +
      `<figcaption>${esc(m.texto)}<small>${I + 1} de ${MEDIOS.length}</small></figcaption>`;
    lb.hidden = false; document.body.style.overflow = "hidden";
  };
  const close = () => { lb.hidden = true; lb.querySelector(".lb-f").innerHTML = ""; document.body.style.overflow = ""; };
  app.addEventListener("click", (e) => { const b = e.target.closest("[data-medio]"); if (b) show(+b.dataset.medio); });
  lb.addEventListener("click", (e) => {
    if (e.target.closest(".lb-p")) return show(I - 1);
    if (e.target.closest(".lb-n")) return show(I + 1);
    if (e.target.closest(".lb-x") || e.target === lb) close();
  });
  document.addEventListener("keydown", (e) => { if (lb.hidden) return; if (e.key === "Escape") close(); else if (e.key === "ArrowLeft") show(I - 1); else if (e.key === "ArrowRight") show(I + 1); });
})();
