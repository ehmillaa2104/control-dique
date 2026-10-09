"""
Convierte la lectura de Monday (monday/crudo/kelly.json) en ../monday.js, que es lo que usa el dashboard.

    python monday/generar.py            # convierte y revisa
    python monday/generar.py --recortar # además deja en crudo/ solo las columnas que se usan

kelly.json es la respuesta de la API de Monday (GraphQL) para los 7 tableros del Kelly Trader:
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

# Tableros del Kelly Trader y sus columnas (ID de columna en Monday)
TABLEROS = {
    "cronograma": {"id": "18431008651", "col": {
        "estado": "color_mm6v6vf2", "duracion": "numeric_mm6zgcqw", "real": "timerange_mm78kjs",
        "base": "timerange_mm7yfj5p", "diferencia": "formula_mm7ygv4s", "actualizado": "pulse_updated_mm7gn7r8"}},
    "ingenieria": {"id": "18431019817", "nombre": "Ingeniería", "col": {
        "fase": "color_mm6wsp0z", "estado": "color_mm7yb2cs", "duracion": "numeric_mm7yw5hx", "tipo": "color_mm781mjk",
        "aprobacion": "color_mm6v621m", "solicitado": "numeric_mm6vjdrd", "revisado": "numeric_mm78kpas",
        "aprobado": "numeric_mm78s0hd", "proyectado": "numeric_mm7y9v4k", "po": "lookup_mm7yk7y7",
        "incurrido": "lookup_mm7yh3hm", "fin": "date_mm7yv15j", "cc": "board_relation_mm7am925",
        "proveedor": "dropdown_mm70s99n", "actualizado": "pulse_updated_mm7g2q1g"}},
    "cubierta": {"id": "18432105237", "nombre": "Cubierta", "col": {
        "fase": "color_mm6wsp0z", "estado": "color_mm7y4j97", "duracion": "numeric_mm7y9sbv", "tipo": "color_mm781mjk",
        "aprobacion": "color_mm6v621m", "solicitado": "numeric_mm6vjdrd", "revisado": "numeric_mm78kpas",
        "aprobado": "numeric_mm78s0hd", "proyectado": "numeric_mm7yw4b3", "po": "lookup_mm7y2awx",
        "incurrido": "lookup_mm7ybkjg", "fin": "date_mm7ya280", "cc": "board_relation_mm7am925",
        "proveedor": "dropdown_mm70s99n", "actualizado": "pulse_updated_mm7ga065"}},
    "tecnico": {"id": "18432105438", "nombre": "Técnico", "col": {
        "fase": "color_mm6wsp0z", "estado": "color_mm7vv5nh", "duracion": "numeric_mm7v7xt9", "tipo": "color_mm781mjk",
        "aprobacion": "color_mm6v621m", "solicitado": "numeric_mm6vjdrd", "revisado": "numeric_mm78kpas",
        "aprobado": "numeric_mm78s0hd", "proyectado": "numeric_mm7y6h6f", "po": "lookup_mm7ywkfv",
        "incurrido": "lookup_mm7ym614", "fin": "date_mm7yw7ca", "cc": "board_relation_mm7am925",
        "proveedor": "dropdown_mm70s99n", "actualizado": "pulse_updated_mm7ge32a"}},
    "centros": {"id": "18431746322", "col": {
        "estado": "estado_dir", "revisado": "formula_mm7d91f2", "aprobado": "formula_mm7dehmt", "po": "formula_mm7yshcc",
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
}
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


def cronograma(tab):
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
            "solicitado": num(v["solicitado"]), "revisado": num(v["revisado"]), "aprobado": num(v["aprobado"]),
            "proyectado": num(v["proyectado"]), "po": num(v["po"]), "incurrido": num(v["incurrido"]),
            "fin": fecha(v["fin"]), "cc": v["cc"], "actualizado": fecha(v["actualizado"])})
    act = [t for t in trabajos if not t["cancelado"]]
    con = [t for t in act if t["duracion"] and t["duracion"] > 0]
    if act and not con:
        obs.append(("aviso", f'{b["name"]}: ninguno de sus {len(act)} trabajos tiene Duración; el avance no se puede ponderar y se muestra 0 %.'))
    elif len(con) < len(act):
        obs.append(("aviso", f'{b["name"]}: {len(act) - len(con)} de {len(act)} trabajos no tienen Duración y no cuentan en el avance.'))
    sin_cc = [t for t in act if not t["cc"]]
    if sin_cc:
        obs.append(("aviso", f'{b["name"]}: {len(sin_cc)} trabajo(s) sin Centro de Costo: {", ".join(t["nombre"] for t in sin_cc[:4])}{"…" if len(sin_cc) > 4 else ""}.'))
    pend = [t for t in act if t["solicitado"] and not t["aprobado"]]
    if pend:
        obs.append(("info", f'{b["name"]}: {len(pend)} trabajo(s) con monto solicitado aún sin aprobar (US$ {sum(t["solicitado"] for t in pend):,.0f}).'))
    return {"id": key, "nombre": TABLEROS[key]["nombre"], "tablero": b["name"], "trabajos": trabajos}


def centros(tab, areas):
    b, items = tab
    lineas = {t["id"]: t for a in areas for t in a["trabajos"]}
    out = []
    for it, v in items:
        c = {"id": it["id"], "nombre": texto(it["name"]), "grupo": it["group"]["title"], "estado": v["estado"] or "",
             "revisado": num(v["revisado"]) or 0, "aprobado": num(v["aprobado"]) or 0, "po": num(v["po"]) or 0,
             "incurrido": num(v["incurrido"]) or 0, "proyectado": num(v["proyectado"]) or 0,
             "lineas": v["lineas"], "pos": v["pos"]}
        # El CC suma sus líneas de P1/P2/P3: se comprueba con las líneas leídas
        for campo in ("aprobado", "revisado", "proyectado"):
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


def recortar(raw):
    """Deja en el crudo solo las columnas que usa el dashboard (sin personas, descripciones ni archivos)."""
    usadas = {t["id"]: set(t["col"].values()) for t in TABLEROS.values()}
    for b in raw["boards"]:
        keep = usadas.get(b["id"], set())
        for it in b["items_page"]["items"]:
            it["column_values"] = [c for c in it["column_values"] if c["id"] in keep]
    return raw


def main():
    raw, tab = leer()
    if "--recortar" in sys.argv:
        CRUDO.write_text(json.dumps(recortar(raw), ensure_ascii=False, indent=1), encoding="utf-8")
    crono = cronograma(tab["cronograma"])
    areas = [area(k, tab[k]) for k in AREAS]
    datos = {
        "proyecto": "Kelly Trader", "fuente": "Monday · GESTIÓN DE DIQUES / KELLY TRADER",
        "extraido": raw.get("extraido") or date.today().isoformat(),
        "cronograma": crono, "areas": areas, "centros": centros(tab["centros"], areas),
        "pos": pos(tab["pos"]), "cambios": cambios(tab["cambios"]),
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
    datos["observaciones"] = [{"nivel": n, "texto": t} for n, t in obs]

    SALIDA.write_text(
        "/*\n * DATOS REALES de Monday · espacio \"GESTIÓN DE DIQUES\" · carpeta \"KELLY TRADER\".\n"
        " * NO EDITAR A MANO: se genera con  python monday/generar.py  a partir de monday/crudo/kelly.json.\n */\n"
        f"window.DIQUE_MONDAY = {json.dumps(datos, ensure_ascii=False, indent=1)};\n", encoding="utf-8")

    n = {k: len(datos[k]) for k in ("cronograma", "centros", "pos", "cambios")}
    print(f"monday.js generado · cronograma {n['cronograma']} · trabajos {tot['lineas']} · centros de costo {n['centros']} · POs {n['pos']} · cambios {n['cambios']}")
    for nivel, txt in obs:
        print(f"  [{nivel}] {txt}")
    errores = [o for o in obs if o[0] == "error"]
    if errores:
        print(f"{len(errores)} error(es): revisar antes de publicar.")
        sys.exit(1)
    print("Sin errores.")


if __name__ == "__main__":
    main()
