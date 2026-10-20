"""
Convierte la lectura de Monday (monday/crudo/kelly.json) en ../monday.js, que es lo que usa el dashboard.

    python monday/generar.py            # convierte y revisa
    python monday/generar.py --recortar # además deja en crudo/ solo las columnas que se usan

kelly.json es la respuesta de la API de Monday (GraphQL) para los 8 tableros del Kelly Trader
y el tablero PROGRAMA DE DIQUES de la flota:
    boards(ids: [...]) { id name items_page(limit: 500) { cursor items { id name created_at updated_at
      group { id title } column_values { id type text ... on MirrorValue { display_value }
      ... on FormulaValue { display_value } ... on BoardRelationValue { linked_item_ids } } } } }

Pasos: lee el crudo, interpreta cada columna según TABLEROS (si en Monday cambia una columna, se cambia aquí),
revisa que sea coherente y escribe ../monday.js. No se conecta a Monday y siempre da el mismo resultado
para los mismos datos.
"""
import json
import re
import sys
from datetime import date
from pathlib import Path

AQUI = Path(__file__).resolve().parent
CRUDO = AQUI / "crudo" / "kelly.json"
SALIDA = AQUI.parent / "monday.js"
CONOCIDAS = AQUI / "columnas_conocidas.json"  # estructura de los tableros la última vez que se revisó

# Tableros del Kelly Trader y sus columnas (ID de columna en Monday)
# Costos de cada trabajo (desde el 16 oct): "$ Preliminar" = lo que solicita el equipo, "$ En Revisión" = lo que está
# en revisión por la Dirección de Operaciones y "$ Aprobado" = lo aprobado hasta la fecha. El tablero CC suma cada uno.
TABLEROS = {
    "cronograma": {"id": "18431008651", "col": {
        "estado": "color_mm6v6vf2", "duracion": "numeric_mm6zgcqw", "real": "timerange_mm78kjs",
        "base": "timerange_mm7yfj5p", "diferencia": "formula_mm7ygv4s", "actualizado": "pulse_updated_mm7gn7r8"}},
    "ingenieria": {"id": "18431019817", "nombre": "Ingeniería", "col": {
        "fase": "color_mm6wsp0z", "estado": "color_mm7yb2cs", "duracion": "numeric_mm7yw5hx", "tipo": "color_mm781mjk",
        "aprobacion": "color_mm6v621m", "preliminar": "numeric_mm6vjdrd", "enRevision": "numeric_mm78kpas",
        "aprobado": "numeric_mm78s0hd", "proyectado": "numeric_mm7y9v4k", "po": "lookup_mm7yk7y7",
        "incurrido": "lookup_mm7yh3hm", "fin": "date_mm7yv15j", "cc": "board_relation_mm7am925",
        "proveedor": "dropdown_mm70s99n", "actualizado": "pulse_updated_mm7g2q1g"}},
    "cubierta": {"id": "18432105237", "nombre": "Cubierta", "col": {
        "fase": "color_mm6wsp0z", "estado": "color_mm7y4j97", "duracion": "numeric_mm7y9sbv", "tipo": "color_mm781mjk",
        "aprobacion": "color_mm6v621m", "preliminar": "numeric_mm6vjdrd", "enRevision": "numeric_mm78kpas",
        "aprobado": "numeric_mm78s0hd", "proyectado": "numeric_mm7yw4b3", "po": "lookup_mm7y2awx",
        "incurrido": "lookup_mm7ybkjg", "fin": "date_mm7ya280", "cc": "board_relation_mm7am925",
        "proveedor": "dropdown_mm70s99n", "actualizado": "pulse_updated_mm7ga065"}},
    "tecnico": {"id": "18432105438", "nombre": "Técnico", "col": {
        "fase": "color_mm6wsp0z", "estado": "color_mm7vv5nh", "duracion": "numeric_mm7v7xt9", "tipo": "color_mm781mjk",
        "aprobacion": "color_mm6v621m", "preliminar": "numeric_mm6vjdrd", "enRevision": "numeric_mm78kpas",
        "aprobado": "numeric_mm78s0hd", "proyectado": "numeric_mm7y6h6f", "po": "lookup_mm7ywkfv",
        "incurrido": "lookup_mm7ym614", "fin": "date_mm7yw7ca", "cc": "board_relation_mm7am925",
        "proveedor": "dropdown_mm70s99n", "actualizado": "pulse_updated_mm7ge32a"}},
    "centros": {"id": "18431746322", "col": {
        "estado": "estado_dir", "preliminar": "formula_mm867352", "enRevision": "formula_mm7d91f2", "aprobado": "formula_mm7dehmt", "po": "formula_mm7yshcc",
        "incurrido": "formula_mm7yyr9q", "proyectado": "formula_mm7ydqr4", "lineas": "board_relation_mm7a4ck0",
        "pos": "board_relation_mm7yxa9r"}},
    "pos": {"id": "18431381932", "col": {
        "area": "dropdown_mm334y96", "proveedor": "text_mm2p9mx7", "po": "numeric_mm2pfpzs", "incurrido": "numeric_mm322fqy",
        "saldo": "numeric_mm39rhnj", "fecha": "date_mm2ptpmb", "estatus": "dropdown_mm328rrg", "pago": "color_mm32ajy1",
        "cc": "board_relation_mm7yq0et", "trabajos": "board_relation_mm7y2fcq", "actualizado": "pulse_updated_mm3j8vr0"}},
    "cambios": {"id": "18431380804", "col": {
        "creado": "pulse_log_mm2ebjby", "actividades": "board_relation_mm2ebzc8", "tipo": "dropdown_mkzbgqr7",
        "costo": "numeric_mm268zat", "dias": "numeric_mm2epnk4", "estado": "color_mm2e3n8w", "aprobado": "date_mkzbjkxq",
        "cc": "dropdown_mm2ns80c"}},
    # Participación del Equipo: un elemento por equipo. Las columnas de cada semana (Kick Off, Reunión Sn, Act. Sn)
    # se toman por su título, así que una semana nueva entra sola. Aquí van solo las columnas fijas.
    "participacion": {"id": "18435454602", "col": {
        "puntos": "formula_mm84qsjp", "cumplimiento": "formula_mm84c488", "nivel": "formula_mm84jbkq"}},
    # PROGRAMA DE DIQUES: próximos diques de la flota (fuera de la carpeta KELLY TRADER). Las Observaciones no se leen:
    # son texto libre y el repositorio es público.
    "programa": {"id": "18431022776", "col": {
        "estado": "color_mm7e7wfd", "mandatorio": "date_mm78x2pe", "real": "date_mm766e7z", "diferencia": "formula_mm78vqa2",
        "lugar": "color_mm765t5s", "tipo": "color_mm7666ab", "anterior": "numeric_mm766312", "estimado": "numeric_mm76thhf"}},
}
EQUIPO_AREA = {"ingeniería": "ingenieria", "ingenieria": "ingenieria", "cubierta": "cubierta", "técnico": "tecnico", "tecnico": "tecnico"}  # Seguridad y Contabilidad no tienen tablero de área
PTS_ACT = {"2": 2, "1": 1, "0": 0}  # "2 - Actualización directa", "1 - Actualización indirecta", "0 - No actualizó"


def pts_entrega(t):
    """Entrega de información semanal: Completa = 2, Parcial = 1, Pendiente = 0.
    También acepta las opciones de antes ("2 - Actualización directa", "1 - … indirecta", "0 - No actualizó")."""
    t = (t or "").strip()
    if t[:1] in PTS_ACT:
        return PTS_ACT[t[:1]]
    n = t.lower()
    return 2 if n.startswith("complet") else 1 if n.startswith("parcial") else 0 if n.startswith("pendiente") else None


def columnas_semana(board):
    """Columnas de reunión y de actualización por semana, según su título en Monday."""
    sem = {}
    for c in board.get("columns", []):
        t = c["title"].strip()
        m = re.match(r"(?i)kick\s*off", t)
        r = re.match(r"(?i)reuni[oó]n\s+(S\d+)", t)
        a = re.match(r"(?i)(?:act\.?|entrega(?:\s+de\s+informaci[oó]n)?)\s+(S\d+)", t)
        f = re.search(r"\(([^)]+)\)", t)
        if f and (m or r or a):
            sem.setdefault("S1" if m else (r or a).group(1).upper(), {"semana": "S1" if m else (r or a).group(1).upper()})["fecha"] = f.group(1).strip()
        if m:
            sem.setdefault("S1", {"semana": "S1", "titulo": t})["reunion"] = c["id"]
        elif r:
            sem.setdefault(r.group(1).upper(), {"semana": r.group(1).upper()})["reunion"] = c["id"]
        elif a:
            sem.setdefault(a.group(1).upper(), {"semana": a.group(1).upper()})["act"] = c["id"]
    return [sem[k] for k in sorted(sem, key=lambda x: int(x[1:]))]
AREAS = ("ingenieria", "cubierta", "tecnico")
PCT = {"0%": 0, "25%": 25, "50%": 50, "75%": 75, "100%": 100}
obs = []  # (nivel, texto): error | aviso | info


def valor(c):
    """Valor de una columna tal como lo muestra Monday."""
    if c is None:
        return None
    if c.get("type") in ("mirror", "formula"):
        return c.get("display_value")
    if c.get("type") == "board_relation":
        return c.get("linked_item_ids") or []
    return c.get("text")


def num(v):
    if v in (None, "", "null"):
        return None
    try:
        x = float(str(v).replace(",", ""))
        return int(x) if x.is_integer() else round(x, 2)
    except ValueError:
        return None


def rango(v):
    m = re.fullmatch(r"\s*(\d{4}-\d{2}-\d{2})\s*-\s*(\d{4}-\d{2}-\d{2})\s*", str(v or ""))
    return [m.group(1), m.group(2)] if m else None


def fecha(v):
    m = re.match(r"\s*(\d{4}-\d{2}-\d{2})", str(v or ""))
    return m.group(1) if m else None


def dias(a, b):
    return (date.fromisoformat(b) - date.fromisoformat(a)).days


def texto(v):
    return re.sub(r"\s+", " ", v).strip() if isinstance(v, str) else ""


def leer():
    raw = json.loads(CRUDO.read_text(encoding="utf-8"))
    por_id = {b["id"]: b for b in raw["boards"]}
    out = {}
    for k, t in TABLEROS.items():
        b = por_id.get(t["id"])
        if not b:
            obs.append(("error", f"Falta el tablero {k} ({t['id']}) en la lectura."))
            out[k] = []
            continue
        if b["items_page"].get("cursor"):
            obs.append(("error", f"{b['name']}: la lectura quedó incompleta (hay más páginas)."))
        items = []
        for it in b["items_page"]["items"]:
            cv = {c["id"]: c for c in it["column_values"]}
            faltan = [cid for cid in t["col"].values() if cid not in cv]
            if faltan:
                obs.append(("error", f"{b['name']}: no existe la columna {', '.join(faltan)} (¿la cambiaron en Monday?)."))
            items.append((it, {n: valor(cv.get(cid)) for n, cid in t["col"].items()}))
        out[k] = (b, items)
    return raw, out


def cronograma(tab, hoy):
    b, items = tab
    filas = []
    for it, v in items:
        nombre = texto(it["name"])
        real, base, dif, dur = rango(v["real"]), rango(v["base"]), num(v["diferencia"]), num(v["duracion"])
        filas.append({"id": it["id"], "grupo": it["group"]["title"], "nombre": nombre, "estado": v["estado"] or "",
                      "duracion": dur, "base": base, "real": real, "diferencia": dif, "actualizado": fecha(v["actualizado"])})
        if not real:
            obs.append(("info", f'Cronograma · "{nombre}": sin Fecha Real; no se dibuja.'))
            continue
        if base and dif is not None and dias(base[1], real[1]) != dif:
            obs.append(("error", f'Cronograma · "{nombre}": Diferencia en Monday = {dif}, recalculada = {dias(base[1], real[1])}.'))
        if dur not in (None, 0) and abs(dias(real[0], real[1]) + 1 - dur) > 1:
            obs.append(("aviso", f'Cronograma · "{nombre}": Duración = {dur} días, pero la Fecha Real cubre {dias(real[0], real[1]) + 1}.'))
        if not base:
            obs.append(("aviso", f'Cronograma · "{nombre}": sin Línea Base; no se puede medir el atraso.'))
        if base and dif is not None and dif <= -14:
            obs.append(("aviso", f'Cronograma · "{nombre}": la Línea Base termina {-dif} días después de la Fecha Real; revisar si la línea base o la fecha real están bien cargadas.'))
        if dur == 0 and real[0] < hoy and not re.search(r"listo", v["estado"] or "", re.I):
            obs.append(("aviso", f'Cronograma · hito "{nombre}": su fecha ({real[0]}) ya pasó y sigue "{v["estado"] or "sin estado"}"; actualizar la fecha o marcarlo Listo.'))
    # Huecos: días entre el inicio y el fin del proyecto sin ninguna actividad cargada
    tramos = sorted((f["real"][0], f["real"][1]) for f in filas if f["real"] and f["duracion"] != 0)
    hitos = {f["real"][0] for f in filas if f["real"] and f["duracion"] == 0}
    hasta = None
    for ini, fin in tramos:
        if hasta and dias(hasta, ini) > 2:
            desde = (date.fromisoformat(hasta).toordinal() + 1)
            obs.append(("aviso", f'Cronograma: entre {date.fromordinal(desde).isoformat()} y {date.fromordinal(date.fromisoformat(ini).toordinal() - 1).isoformat()} no hay ninguna actividad cargada (hueco de {dias(hasta, ini) - 1} días).'))
        hasta = fin if not hasta or fin > hasta else hasta
    return filas


def area(key, tab):
    b, items = tab
    trabajos = []
    for it, v in items:
        est = v["estado"] or ""
        pct = PCT.get(est)
        if pct is None and est != "Cancelado":
            obs.append(("aviso", f'{b["name"]} · "{texto(it["name"])}": Estado "{est}" no es un porcentaje; cuenta como 0 %.'))
        trabajos.append({
            "id": it["id"], "nombre": texto(it["name"]), "grupo": it["group"]["title"], "fase": v["fase"] or "",
            "estado": est, "pct": pct or 0, "cancelado": est == "Cancelado", "duracion": num(v["duracion"]),
            "tipo": v["tipo"] or "", "aprobacion": v["aprobacion"] or "", "proveedor": v["proveedor"] or "",
            "preliminar": num(v["preliminar"]), "enRevision": num(v["enRevision"]), "aprobado": num(v["aprobado"]),
            "proyectado": num(v["proyectado"]), "po": num(v["po"]), "incurrido": num(v["incurrido"]),
            "fin": fecha(v["fin"]), "cc": v["cc"], "actualizado": fecha(v["actualizado"])})
        t = trabajos[-1]
        t["costo"] = costo_estado(t)
    act = [t for t in trabajos if not t["cancelado"]]
    revisar_costos(b["name"], act)
    con = [t for t in act if t["duracion"] and t["duracion"] > 0]
    # Un trabajo con Duración es un trabajo planificado para ejecutarse
    if act and not con:
        obs.append(("aviso", f'{b["name"]}: ningún trabajo planificado (ninguno tiene Duración); el avance se muestra 0 %.'))
    elif con:
        ejec = sum(1 for t in con if 0 < t["pct"] < 100)
        fin = sum(1 for t in con if t["pct"] >= 100)
        obs.append(("info", f'{b["name"]}: {len(con)} trabajo(s) planificado(s) · {ejec} en ejecución · {fin} finalizado(s) · {len(con) - ejec - fin} por iniciar.'))
    # Un trabajo con fase (Pre-dique, Dique, Post-dique…) está planificado: debería tener Duración para contar en el avance
    con_fase = [t for t in act if t["fase"] and not re.search(r"no aplica", t["fase"], re.I)]
    sin_dur = [t for t in con_fase if not (t["duracion"] and t["duracion"] > 0) and t["costo"] != "descartado"]
    if sin_dur:
        obs.append(("aviso", f'{b["name"]}: {len(sin_dur)} trabajo(s) con fase pero sin Duración; no cuentan en el avance: {", ".join(t["nombre"] for t in sin_dur[:5])}{"…" if len(sin_dur) > 5 else ""}.'))
    sin_fase_dur = [t for t in act if t not in con_fase and t["duracion"] and t["duracion"] > 0]
    if sin_fase_dur:
        obs.append(("aviso", f'{b["name"]}: {len(sin_fase_dur)} trabajo(s) con Duración pero sin fase (No Aplica): {", ".join(t["nombre"] for t in sin_fase_dur[:5])}.'))
    sin_cc = [t for t in act if not t["cc"]]
    if sin_cc:
        obs.append(("aviso", f'{b["name"]}: {len(sin_cc)} trabajo(s) sin Centro de Costo: {", ".join(t["nombre"] for t in sin_cc[:4])}{"…" if len(sin_cc) > 4 else ""}.'))
    por = {k: [t for t in act if t["costo"] == k] for k in ("preliminar", "revision", "aprobado")}
    obs.append(("info", f'{b["name"]}: preliminar US$ {sum(t["preliminar"] or 0 for t in act):,.0f} · en revisión US$ {sum(t["enRevision"] or 0 for t in act):,.0f} ({len(por["revision"])}) · aprobado US$ {sum(t["aprobado"] or 0 for t in act):,.0f} ({len(por["aprobado"])}) · sin enviar a revisión {len(por["preliminar"])}.'))
    return {"id": key, "nombre": TABLEROS[key]["nombre"], "tablero": b["name"], "trabajos": trabajos}


HISTORIAL = AQUI / "historial.json"  # avance de cada lectura (una por día) para ver qué se hizo en la semana


def historial(datos):
    """Guarda el avance de esta lectura (el % de cada trabajo y el total) y devuelve el historial completo.
    Una entrada por día: si hay varias lecturas el mismo día, queda la última."""
    h = json.loads(HISTORIAL.read_text(encoding="utf-8")) if HISTORIAL.exists() else []
    tot = datos["avance"]["total"]
    hoy = {"fecha": datos["extraido"], "avance": round(tot["avanceDias"] / tot["duracion"] * 100, 2) if tot["duracion"] else None,
           "pct": {t["id"]: t["pct"] for a in datos["areas"] for t in a["trabajos"] if not t["cancelado"]}}
    h = [x for x in h if x["fecha"] != hoy["fecha"]] + [hoy]
    h.sort(key=lambda x: x["fecha"])
    HISTORIAL.write_text(json.dumps(h, ensure_ascii=False), encoding="utf-8")
    return h


def revisar_fases(crono, areas, hoy):
    """Avisa si un trabajo tiene avance en una fase que según el Cronograma todavía no empieza (p. ej. Dique antes de entrar al dique)."""
    inicio = {}
    for r in crono:
        n = r["nombre"].lower()
        if "ejecuci" in n and r["real"]:
            k = "pre" if "pre" in n else "post" if "post" in n else "dique" if "dique" in n else None
            if k:
                inicio[k] = r["real"][0]
    for a in areas:
        for t in a["trabajos"]:
            f = (t["fase"] or "").lower()
            k = "pre" if "pre" in f else "post" if "pos" in f else "dique" if "dique" in f else None
            if k in inicio and t["pct"] > 0 and not t["cancelado"] and inicio[k] > hoy:
                obs.append(("aviso", f'{a["tablero"]} · "{t["nombre"]}": tiene avance ({t["estado"]}) en {t["fase"]}, que según el Cronograma empieza el {inicio[k]}; revisar la fase.'))


def costo_estado(t):
    """En qué etapa está el costo del trabajo, según sus montos: aprobado, en revisión o solo preliminar (o descartado)."""
    if re.search(r"descart", t["aprobacion"] or "", re.I):
        return "descartado"
    if t["aprobado"]:
        return "aprobado"
    if t["enRevision"]:
        return "revision"
    if t["preliminar"]:
        return "preliminar"
    return ""


def revisar_costos(tablero, act):
    """Avisa cuando el Estado Aprobación no coincide con los montos o cuando lo aprobado difiere del preliminar."""
    desc = [t for t in act if t["costo"] == "descartado" and t["preliminar"]]
    if desc:
        # Se pidieron pero no se aprobaron: se quedan en el preliminar (pedido del usuario, 16 oct)
        obs.append(("info", f'{tablero}: {len(desc)} trabajo(s) descartado(s), en el preliminar por US$ {sum(t["preliminar"] for t in desc):,.0f} (se pidieron, no se aprobaron): {", ".join(t["nombre"] for t in desc)}.'))
    for t in act:
        e, nom = (t["aprobacion"] or "").lower(), t["nombre"]
        if t["costo"] == "aprobado" and "aprob" not in e:
            obs.append(("aviso", f'{tablero} · "{nom}": tiene $ Aprobado pero Estado Aprobación = "{t["aprobacion"] or "vacío"}".'))
        elif t["costo"] == "revision" and "revis" not in e:
            obs.append(("aviso", f'{tablero} · "{nom}": tiene $ En Revisión pero Estado Aprobación = "{t["aprobacion"] or "vacío"}".'))
        elif "aprob" in e and not t["aprobado"] and t["preliminar"]:
            obs.append(("aviso", f'{tablero} · "{nom}": Estado Aprobación = "{t["aprobacion"]}" pero no tiene $ Aprobado.'))
        if t["aprobado"] and t["enRevision"]:
            obs.append(("aviso", f'{tablero} · "{nom}": tiene $ Aprobado y $ En Revisión a la vez.'))
        if t["aprobado"] and t["preliminar"] and abs(t["aprobado"] - t["preliminar"]) > 0.5:
            obs.append(("info", f'{tablero} · "{nom}": aprobado US$ {t["aprobado"]:,.0f} distinto del preliminar US$ {t["preliminar"]:,.0f}.'))


def centros(tab, areas):
    b, items = tab
    lineas = {t["id"]: t for a in areas for t in a["trabajos"]}
    out = []
    for it, v in items:
        c = {"id": it["id"], "nombre": texto(it["name"]), "grupo": it["group"]["title"], "estado": v["estado"] or "",
             "preliminar": num(v["preliminar"]) or 0, "enRevision": num(v["enRevision"]) or 0, "aprobado": num(v["aprobado"]) or 0, "po": num(v["po"]) or 0,
             "incurrido": num(v["incurrido"]) or 0, "proyectado": num(v["proyectado"]) or 0,
             "lineas": v["lineas"], "pos": v["pos"]}
        # El CC suma sus líneas de P1/P2/P3: se comprueba con las líneas leídas
        for campo in ("preliminar", "enRevision", "aprobado", "proyectado"):
            s = sum((lineas[i][campo] or 0) for i in c["lineas"] if i in lineas)
            if abs(s - c[campo]) > 0.5:
                obs.append(("error", f'CC "{c["nombre"]}": ${campo} = {c[campo]:,.0f} en Monday, pero sus líneas suman {s:,.0f}.'))
        perdidas = [i for i in c["lineas"] if i not in lineas]
        if perdidas:
            obs.append(("aviso", f'CC "{c["nombre"]}": {len(perdidas)} línea(s) conectada(s) que no están en P1/P2/P3.'))
        out.append(c)
    # Cada trabajo debería estar en el CC que lo declara
    for a in areas:
        for t in a["trabajos"]:
            for cc in t["cc"]:
                cobj = next((c for c in out if c["id"] == cc), None)
                if not cobj:
                    obs.append(("aviso", f'{a["tablero"]} · "{t["nombre"]}": su Centro de Costo no está en el tablero CC.'))
                elif t["id"] not in cobj["lineas"]:
                    obs.append(("aviso", f'{a["tablero"]} · "{t["nombre"]}": dice CC "{cobj["nombre"]}", pero el CC no la tiene conectada.'))
    return out


def pos(tab):
    b, items = tab
    out = []
    for it, v in items:
        out.append({"id": it["id"], "nombre": texto(it["name"]), "area": v["area"] or "", "proveedor": v["proveedor"] or "",
                    "po": num(v["po"]) or 0, "incurrido": num(v["incurrido"]) or 0, "saldo": num(v["saldo"]),
                    "fecha": fecha(v["fecha"]), "estatus": v["estatus"] or "", "pago": v["pago"] or "",
                    "cc": v["cc"], "trabajos": v["trabajos"], "actualizado": fecha(v["actualizado"])})
    if not out:
        obs.append(("aviso", f'{b["name"]}: sin órdenes de compra; PO e Incurrido quedan en 0.'))
    for p in out:
        falta = [n for n, ok in (("monto", p["po"]), ("centro de costo", p["cc"]), ("trabajo enlazado", p["trabajos"])) if not ok]
        if falta:
            obs.append(("aviso", f'{b["name"]} · "{p["nombre"]}": sin {", ".join(falta)}; no suma en los totales.'))
    return out


def cambios(tab):
    b, items = tab
    out = []
    for it, v in items:
        out.append({"id": it["id"], "nombre": texto(it["name"]), "creado": fecha(v["creado"]) or fecha(it.get("created_at")),
                    "tipo": v["tipo"] or "", "costo": num(v["costo"]), "dias": num(v["dias"]), "estado": v["estado"] or "",
                    "aprobado": fecha(v["aprobado"]), "cc": v["cc"] or "", "actividades": v["actividades"],
                    "actualizado": fecha(it.get("updated_at"))})
    if not out:
        obs.append(("info", f'{b["name"]}: sin cambios ni imprevistos registrados.'))
    return sorted(out, key=lambda c: c["creado"] or "", reverse=True)


def programa(tab):
    """Programa de diques de la flota: un elemento por dique (nave), agrupado por año."""
    if not tab:
        return []
    b, items = tab
    out = []
    for it, v in items:
        man, real = fecha(v["mandatorio"]), fecha(v["real"])
        dif = num(v["diferencia"])
        if man and real and dif is not None and dif != dias(man, real):
            obs.append(("error", f'{b["name"]} · {texto(it["name"])}: Diferencia en Monday = {dif}, fecha real − mandatorio = {dias(man, real)}.'))
        if not man and not real:
            obs.append(("aviso", f'{b["name"]} · {texto(it["name"])}: sin fecha mandatoria ni real.'))
        out.append({"id": it["id"], "nave": texto(it["name"]), "anio": it["group"]["title"], "estado": v["estado"] or "",
                    "mandatorio": man, "real": real, "diferencia": dif, "lugar": v["lugar"] or "", "tipo": v["tipo"] or "",
                    "anterior": num(v["anterior"]), "estimado": num(v["estimado"])})
    out.sort(key=lambda d: d["real"] or d["mandatorio"] or "9999")
    obs.append(("info", f'{b["name"]}: {len(out)} diques · estimado total US$ {sum(d["estimado"] or 0 for d in out):,.0f}.'))
    return out


def revisar_columnas(raw):
    """Compara las columnas de cada tablero con las conocidas: nuevas, borradas, renombradas o con otro tipo.
    Si cambia una columna que usa el dashboard, es un aviso fuerte: hay que revisar el mapeo antes de publicar."""
    actual = {b["id"]: {c["id"]: {"title": c["title"], "type": c["type"]} for c in b.get("columns", [])} for b in raw["boards"]}
    if not any(actual.values()):
        obs.append(("aviso", "La lectura no trae las columnas de los tableros; no se pudo revisar si cambiaron (usar la consulta con columns { id title type })."))
        return actual
    conocidas = json.loads(CONOCIDAS.read_text(encoding="utf-8")) if CONOCIDAS.exists() else {}
    nombres = {b["id"]: b["name"] for b in raw["boards"]}
    usadas = {t["id"]: set(t["col"].values()) for t in TABLEROS.values()}
    for bid, cols in actual.items():
        antes = conocidas.get(bid)
        if antes is None:
            continue
        tb = nombres.get(bid, bid)
        for cid, c in cols.items():
            if cid not in antes:
                obs.append(("aviso", f'{tb}: columna nueva "{c["title"]}" ({cid}, {c["type"]}); revisar si el dashboard debe usarla.'))
            elif antes[cid]["title"] != c["title"]:
                nivel = "aviso" if cid in usadas.get(bid, ()) else "info"
                obs.append((nivel, f'{tb}: la columna "{antes[cid]["title"]}" ahora se llama "{c["title"]}" ({cid}){"; la usa el dashboard: revisar que siga significando lo mismo" if nivel == "aviso" else ""}.'))
            elif antes[cid]["type"] != c["type"]:
                obs.append(("aviso", f'{tb}: la columna "{c["title"]}" cambió de tipo {antes[cid]["type"]} → {c["type"]}.'))
        for cid, c in antes.items():
            if cid not in cols:
                nivel = "error" if cid in usadas.get(bid, ()) else "aviso"
                obs.append((nivel, f'{tb}: se borró la columna "{c["title"]}" ({cid}){"; la usa el dashboard" if nivel == "error" else ""}.'))
    return actual


# Campos que se comparan contra la lectura anterior (lo que más interesa revisar: duración, avance, fechas y montos)
CAMPOS_TRABAJO = {"duracion": "Duración", "estado": "Estado", "fase": "Fase", "fin": "Fecha Fin", "preliminar": "$ Preliminar",
                  "enRevision": "$ En Revisión", "aprobado": "$ Aprobado", "proyectado": "$ Proyectado", "po": "$ PO",
                  "incurrido": "$ Incurrido", "aprobacion": "Estado Aprobación", "cc": "Centro de Costo"}
CAMPOS_CRONO = {"estado": "Estado", "real": "Fecha Real", "base": "Línea Base", "diferencia": "Diferencia", "duracion": "Duración"}


def comparar_con_anterior(datos):
    """Lista lo que cambió desde la lectura anterior (la que está hoy en monday.js)."""
    if not SALIDA.exists():
        return []
    txt = SALIDA.read_text(encoding="utf-8")
    m = re.search(r"window\.DIQUE_MONDAY = (\{.*\});\s*$", txt, re.S)
    if not m:
        return []
    ant = json.loads(m.group(1))
    if ant.get("extraido") == datos["extraido"] and ant.get("cambiosLectura") and ant.get("_huella") == datos["_huella"]:
        return ant["cambiosLectura"]  # misma lectura: se conserva la comparación ya hecha
    cambios = []
    fmt = lambda v: "—" if v in (None, "", []) else (" a ".join(v) if isinstance(v, list) and v and isinstance(v[0], str) and re.match(r"\d{4}-", v[0]) else str(v))
    a_crono = {r["id"]: r for r in ant.get("cronograma", [])}
    for r in datos["cronograma"]:
        o = a_crono.get(r["id"])
        if not o:
            cambios.append({"tablero": "Cronograma", "trabajo": r["nombre"], "campo": "nuevo", "antes": "", "ahora": ""})
            continue
        for k, n in CAMPOS_CRONO.items():
            if o.get(k) != r.get(k):
                cambios.append({"tablero": "Cronograma", "trabajo": r["nombre"], "campo": n, "antes": fmt(o.get(k)), "ahora": fmt(r.get(k))})
    a_trab = {t["id"]: t for a in ant.get("areas", []) for t in a["trabajos"]}
    for o in a_trab.values():  # lecturas de antes del 16 oct: "$ Solicitado" y "$ Revisado Gerencia"
        if "preliminar" not in o:
            o["preliminar"], o["enRevision"] = o.get("solicitado"), o.get("revisado")
    cc_nombre = {c["id"]: c["nombre"] for c in datos.get("centros", [])}
    for a in datos["areas"]:
        ids = set()
        for t in a["trabajos"]:
            ids.add(t["id"])
            o = a_trab.get(t["id"])
            if not o:
                cambios.append({"tablero": a["tablero"], "trabajo": t["nombre"], "campo": "nuevo", "antes": "", "ahora": ""})
                continue
            for k, n in CAMPOS_TRABAJO.items():
                if o.get(k) != t.get(k):
                    f2 = (lambda v: ", ".join(cc_nombre.get(i, i) for i in v) or "—") if k == "cc" else fmt
                    cambios.append({"tablero": a["tablero"], "trabajo": t["nombre"], "campo": n, "antes": f2(o.get(k)), "ahora": f2(t.get(k))})
        for o in [x for x in next((y["trabajos"] for y in ant.get("areas", []) if y["id"] == a["id"]), []) if x["id"] not in ids]:
            cambios.append({"tablero": a["tablero"], "trabajo": o["nombre"], "campo": "borrado", "antes": "", "ahora": ""})
    # Participación: cada reunión y actualización por equipo y semana
    a_eq = {e["id"]: e for e in (ant.get("participacion") or {}).get("equipos", [])}
    for e in (datos.get("participacion") or {}).get("equipos", []):
        o = a_eq.get(e["id"])
        if not o:
            continue
        a_sem = {x["semana"]: x for x in o["semanas"]}
        for x in e["semanas"]:
            p = a_sem.get(x["semana"], {})
            for k, n in (("reunion", "Reunión"), ("act", "Actualización")):
                if p.get(k) != x.get(k):
                    cambios.append({"tablero": "Participación del Equipo", "trabajo": e["nombre"], "campo": f'{n} {"Kick Off" if x["semana"] == "S1" else x["semana"]}',
                                    "antes": p.get(k) or "—", "ahora": x.get(k) or "—"})
    return cambios


def participacion(raw):
    """% de cumplimiento por equipo = puntos / máximo, con el MISMO máximo para todos los equipos:
    una columna (reunión 1 pt, actualización 2 pts) cuenta para TODOS en cuanto algún equipo tiene el dato cargado.
    Al equipo que no lo tiene cargado se le cuenta 0 en esa columna (y se avisa a quién le falta)."""
    b = next((x for x in raw["boards"] if x["id"] == TABLEROS["participacion"]["id"]), None)
    if not b:
        obs.append(("aviso", "No está el tablero Participación del Equipo en la lectura."))
        return None
    semanas = columnas_semana(b)
    if not semanas:
        obs.append(("error", "Participación del Equipo: no se encontraron columnas de reunión ni de actualización."))
    col = TABLEROS["participacion"]["col"]
    items = b["items_page"]["items"]
    cvs = [{c["id"]: c for c in it["column_values"]} for it in items]
    txt = lambda cv, cid: (cv.get(cid, {}).get("text") or "").strip() if cid else ""
    ok_r = lambda t: t in ("Asistió", "No asistió")
    ok_a = lambda t: pts_entrega(t) is not None
    # Qué columnas cuentan: las que tienen dato válido en al menos un equipo
    for s_ in semanas:
        for tipo, ok in (("reunion", ok_r), ("act", ok_a)):
            cid = s_.get(tipo)
            if not cid:
                s_["cuenta_" + tipo] = False
                continue
            tienen = [ok(txt(cv, cid)) for cv in cvs]
            s_["cuenta_" + tipo] = any(tienen)
            if any(tienen) and not all(tienen):
                faltan = [texto(it["name"]) for it, t in zip(items, tienen) if not t]
                nombre = ("Kick Off" if s_["semana"] == "S1" else s_["semana"]) + (" · reunión" if tipo == "reunion" else " · actualización")
                obs.append(("aviso", f'Participación · {nombre}: falta cargar {", ".join(faltan)}; cuenta 0 hasta que se cargue.'))
    equipos = []
    for it, cv in zip(items, cvs):
        det, pts, mx, falta = [], 0, 0, 0
        for s_ in semanas:
            r, a = txt(cv, s_.get("reunion")), txt(cv, s_.get("act"))
            pr = (1 if r == "Asistió" else 0) if ok_r(r) else None
            pa = pts_entrega(a)
            if r and pr is None:
                obs.append(("aviso", f'Participación · {it["name"]} · {s_["semana"]}: reunión "{r}" no se reconoce.'))
            if a and pa is None:
                obs.append(("aviso", f'Participación · {it["name"]} · {s_["semana"]}: actualización "{a}" no se reconoce.'))
            fr, fa = s_["cuenta_reunion"] and pr is None, s_["cuenta_act"] and pa is None  # cuenta, pero este equipo no lo tiene cargado
            if s_["cuenta_reunion"]:
                pts += pr or 0; mx += 1
            if s_["cuenta_act"]:
                pts += pa or 0; mx += 2
            falta += fr + fa
            det.append({"semana": s_["semana"], "reunion": r or None, "act": a or None, "pr": pr, "pa": pa, "faltaR": fr, "faltaA": fa})
        pct = round(pts / mx * 100, 1) if mx else None
        nivel = None if pct is None else "Alto" if pct >= 75 else "Medio" if pct >= 50 else "Bajo"
        mon_pct = num(str(valor(cv.get(col["cumplimiento"])) or "").replace("%", ""))
        mon_niv = valor(cv.get(col["nivel"]))
        nombre = texto(it["name"])
        # La fórmula de Monday cuenta solo las casillas cargadas de cada equipo; coincide cuando el equipo no tiene casillas sin cargar
        if pct is not None and (mon_pct is None or abs(mon_pct - pct) > 0.15):
            obs.append(("aviso" if falta else "error", f'Participación · {nombre}: % en Monday = {mon_pct}, en el dashboard = {pct}' + (f" (Monday no cuenta las {falta} casilla(s) sin cargar; el dashboard las cuenta como 0)." if falta else ".")))
        elif nivel and mon_niv and mon_niv != nivel:
            obs.append(("error", f'Participación · {nombre}: nivel en Monday = {mon_niv}, recalculado = {nivel}.'))
        equipos.append({"id": it["id"], "nombre": nombre, "area": EQUIPO_AREA.get(nombre.lower()), "puntos": pts, "maximo": mx,
                        "pct": pct, "nivel": nivel, "sinCargar": falta, "semanas": det})
    tp, tm = sum(e["puntos"] for e in equipos), sum(e["maximo"] for e in equipos)
    tot = round(tp / tm * 100, 1) if tm else None
    cuentan = [("KO" if s_["semana"] == "S1" else s_["semana"]) + (" (reunión y actualización)" if s_["cuenta_reunion"] and s_["cuenta_act"] else " (reunión)" if s_["cuenta_reunion"] else " (actualización)" if s_["cuenta_act"] else "")
               for s_ in semanas if s_["cuenta_reunion"] or s_["cuenta_act"]]
    obs.append(("info", f'Participación del equipo: {tot}% ({tp} de {tm} puntos) · máximo igual para todos: {equipos[0]["maximo"] if equipos else 0} pts · cuentan: {", ".join(cuentan) or "ninguna"}.'))
    return {"total": {"puntos": tp, "maximo": tm, "pct": tot, "nivel": None if tot is None else "Alto" if tot >= 75 else "Medio" if tot >= 50 else "Bajo"},
            "semanas": [{"semana": s_["semana"], "fecha": s_.get("fecha"), "reunion": s_["cuenta_reunion"], "act": s_["cuenta_act"],
                         "conDatos": s_["cuenta_reunion"] or s_["cuenta_act"]} for s_ in semanas],
            "equipos": equipos, "umbrales": {"alto": 75, "medio": 50}}


def recortar(raw):
    """Deja en el crudo solo las columnas que usa el dashboard (sin personas, descripciones ni archivos)."""
    usadas = {t["id"]: set(t["col"].values()) for t in TABLEROS.values()}
    for b in raw["boards"]:
        if b["id"] == TABLEROS["participacion"]["id"]:
            usadas[b["id"]] |= {x for s_ in columnas_semana(b) for x in (s_.get("reunion"), s_.get("act")) if x}
    for b in raw["boards"]:
        keep = usadas.get(b["id"], set())
        for it in b["items_page"]["items"]:
            it["column_values"] = [c for c in it["column_values"] if c["id"] in keep]
    return raw


def main():
    raw, tab = leer()
    columnas = revisar_columnas(raw)
    if "--recortar" in sys.argv:
        CRUDO.write_text(json.dumps(recortar(raw), ensure_ascii=False, indent=1), encoding="utf-8")
    hoy = raw.get("extraido") or date.today().isoformat()
    crono = cronograma(tab["cronograma"], hoy)
    areas = [area(k, tab[k]) for k in AREAS]
    revisar_fases(crono, areas, hoy)
    datos = {
        "proyecto": "Kelly Trader", "fuente": "Monday · GESTIÓN DE DIQUES / KELLY TRADER",
        "extraido": raw.get("extraido") or date.today().isoformat(),
        "cronograma": crono, "areas": areas, "centros": centros(tab["centros"], areas),
        "pos": pos(tab["pos"]), "cambios": cambios(tab["cambios"]), "participacion": participacion(raw),
        "programa": programa(tab["programa"]),
    }
    # Resumen de avance por área (lo usa también la Rev. 2)
    av = {}
    tot = {"lineas": 0, "conDuracion": 0, "duracion": 0, "avanceDias": 0}
    for a in areas:
        act = [t for t in a["trabajos"] if not t["cancelado"]]
        r = {"lineas": len(act), "conDuracion": sum(1 for t in act if t["duracion"] and t["duracion"] > 0),
             "duracion": sum(t["duracion"] for t in act if t["duracion"] and t["duracion"] > 0),
             "avanceDias": sum(t["duracion"] * t["pct"] / 100 for t in act if t["duracion"] and t["duracion"] > 0)}
        av[a["id"]] = r
        for k in tot:
            tot[k] += r[k]
    av["total"] = tot
    datos["avance"] = av
    datos["historial"] = historial(datos)
    import hashlib
    datos["_huella"] = hashlib.sha1(CRUDO.read_bytes()).hexdigest()[:12]
    datos["cambiosLectura"] = comparar_con_anterior(datos)
    if "--aceptar-columnas" in sys.argv or not CONOCIDAS.exists():
        CONOCIDAS.write_text(json.dumps(columnas, ensure_ascii=False, indent=1), encoding="utf-8")
        obs.append(("info", "Estructura de columnas guardada como conocida (monday/columnas_conocidas.json)."))
    datos["observaciones"] = [{"nivel": n, "texto": t} for n, t in obs]

    SALIDA.write_text(
        "/*\n * DATOS REALES de Monday · espacio \"GESTIÓN DE DIQUES\" · carpeta \"KELLY TRADER\".\n"
        " * NO EDITAR A MANO: se genera con  python monday/generar.py  a partir de monday/crudo/kelly.json.\n */\n"
        f"window.DIQUE_MONDAY = {json.dumps(datos, ensure_ascii=False, indent=1)};\n", encoding="utf-8")

    n = {k: len(datos[k]) for k in ("cronograma", "centros", "pos", "cambios")}
    print(f"monday.js generado · cronograma {n['cronograma']} · trabajos {tot['lineas']} · centros de costo {n['centros']} · POs {n['pos']} · cambios {n['cambios']}")
    for nivel, txt in obs:
        print(f"  [{nivel}] {txt}")
    cl = datos["cambiosLectura"]
    print(f"Cambios desde la lectura anterior: {len(cl)}")
    for c in cl[:60]:
        print(f'  · {c["tablero"]} · {c["trabajo"][:60]} · {c["campo"]}' + (f': {c["antes"]} → {c["ahora"]}' if c["campo"] not in ("nuevo", "borrado") else ""))
    if len(cl) > 60:
        print(f"  … y {len(cl) - 60} más (ver verificar.html)")
    errores = [o for o in obs if o[0] == "error"]
    if errores:
        print(f"{len(errores)} error(es): revisar antes de publicar.")
        sys.exit(1)
    print("Sin errores.")


if __name__ == "__main__":
    main()
