"""
Convierte lo leído de Monday (carpeta crudo/) en ../monday.js, que es lo que usa el dashboard.

    python monday/generar.py

Pasos:
  1. Lee crudo/cronograma.json, crudo/p1.json, crudo/p2.json y crudo/p3.json tal como los entrega Monday
     (nombre del elemento, grupo y el texto de cada columna).
  2. Interpreta cada columna según COLUMNAS (si en Monday cambia una columna, se cambia aquí).
  3. Revisa que lo interpretado sea coherente y muestra las observaciones.
  4. Escribe ../monday.js.

No se conecta a Monday: los archivos de crudo/ se actualizan leyendo Monday (a pedido o con una tarea
automática con token de la API), y este script siempre produce el mismo resultado para los mismos datos.
"""
import json
import re
import sys
from datetime import date
from pathlib import Path

AQUI = Path(__file__).resolve().parent
CRUDO = AQUI / "crudo"
SALIDA = AQUI.parent / "monday.js"

# Columnas de Monday que se usan (ID de columna -> significado)
COLUMNAS = {
    "cronograma": {
        "estado": "color_mm6v6vf2",      # Estado
        "duracion": "numeric_mm6zgcqw",  # Duración
        "real": "timerange_mm78kjs",     # Fecha Real
        "base": "timerange_mm7yfj5p",    # Linea Base
        "diferencia": "formula_mm7ygv4s",  # Diferencia = DAYS(fin real, fin base)
    },
    # Avance de cada tablero de planificación: Estado (0/25/50/75/100 %) y Duración (días)
    "p1": {"area": "ingenieria", "estado": "color_mm7yb2cs", "duracion": "numeric_mm7yw5hx"},
    "p2": {"area": "cubierta", "estado": "color_mm7y4j97", "duracion": "numeric_mm7y9sbv"},
    "p3": {"area": "tecnico", "estado": "color_mm7vv5nh", "duracion": "numeric_mm7v7xt9"},
}

obs = []  # observaciones de la revisión: (nivel, texto)


def leer(nombre):
    return json.loads((CRUDO / f"{nombre}.json").read_text(encoding="utf-8"))


def rango(txt):
    """'2026-09-22 - 2026-10-09' -> ['2026-09-22', '2026-10-09']"""
    if not txt:
        return None
    m = re.fullmatch(r"\s*(\d{4}-\d{2}-\d{2})\s*-\s*(\d{4}-\d{2}-\d{2})\s*", str(txt))
    return [m.group(1), m.group(2)] if m else None


def numero(txt):
    if txt in (None, "", "null"):
        return None
    try:
        v = float(txt)
        return int(v) if v.is_integer() else v
    except ValueError:
        return None


def dias(a, b):
    return (date.fromisoformat(b) - date.fromisoformat(a)).days


def cronograma():
    raw = leer("cronograma")
    col = COLUMNAS["cronograma"]
    filas = []
    for it in raw["items"]:
        cv = it["column_values"]
        nombre = re.sub(r"\s+", " ", it["name"]).strip()
        real, base = rango(cv.get(col["real"])), rango(cv.get(col["base"]))
        f = {
            "grupo": it.get("group"),
            "nombre": nombre,
            "estado": cv.get(col["estado"]) or "",
            "duracion": numero(cv.get(col["duracion"])),
            "base": base,
            "real": real,
            "diferencia": numero(cv.get(col["diferencia"])),
        }
        # Revisión de cada elemento
        if not real:
            obs.append(("info", f'Cronograma · "{nombre}": sin Fecha Real; no se dibuja.'))
        else:
            if cv.get(col["real"]) and real is None:
                obs.append(("error", f'Cronograma · "{nombre}": no se pudo leer la Fecha Real "{cv.get(col["real"])}".'))
            if base and f["diferencia"] is not None:
                calc = dias(base[1], real[1])
                if calc != f["diferencia"]:
                    obs.append(("error", f'Cronograma · "{nombre}": Diferencia en Monday = {f["diferencia"]}, recalculada = {calc}.'))
            if f["duracion"] not in (None, 0):
                cubre = dias(real[0], real[1]) + 1
                if abs(cubre - f["duracion"]) > 1:
                    obs.append(("aviso", f'Cronograma · "{nombre}": Duración = {f["duracion"]} días, pero la Fecha Real cubre {cubre} días.'))
            if f["duracion"] == 0 and real[0] != real[1]:
                obs.append(("aviso", f'Cronograma · "{nombre}": es un hito (duración 0) pero la Fecha Real va de {real[0]} a {real[1]}.'))
            if not base:
                obs.append(("aviso", f'Cronograma · "{nombre}": sin Línea Base; no se puede medir el atraso.'))
        filas.append(f)
    return raw.get("extraido"), filas


PCT = {"0%": 0, "25%": 25, "50%": 50, "75%": 75, "100%": 100}


def avance():
    total = {"lineas": 0, "conDuracion": 0, "duracion": 0, "avanceDias": 0}
    out = {}
    for tablero in ("p1", "p2", "p3"):
        raw = leer(tablero)
        col = COLUMNAS[tablero]
        r = {"lineas": 0, "conDuracion": 0, "duracion": 0, "avanceDias": 0}
        for it in raw["items"]:
            cv = it["column_values"]
            est = cv.get(col["estado"])
            if est == "Cancelado":
                continue
            r["lineas"] += 1
            p = PCT.get(est)
            if p is None:
                obs.append(("aviso", f'{raw["board"]["name"]} · "{it["name"]}": Estado "{est}" no es un porcentaje; cuenta como 0 %.'))
                p = 0
            d = numero(cv.get(col["duracion"]))
            if d and d > 0:
                r["conDuracion"] += 1
                r["duracion"] += d
                r["avanceDias"] += d * p / 100
        if r["lineas"] and not r["conDuracion"]:
            obs.append(("aviso", f'{raw["board"]["name"]}: ninguno de sus {r["lineas"]} trabajos tiene Duración; el avance no se puede ponderar y se muestra 0 %.'))
        out[col["area"]] = r
        for k in total:
            total[k] += r[k]
    out["total"] = total
    return out


def main():
    extraido, crono = cronograma()
    av = avance()
    datos = {"proyecto": "Kelly Trader", "fuente": "Monday · Cronograma Kelly Trader", "extraido": extraido or date.today().isoformat(),
             "cronograma": crono, "avance": av}
    cuerpo = json.dumps(datos, ensure_ascii=False, indent=2)
    SALIDA.write_text(
        "/*\n * DATOS REALES de Monday · espacio \"GESTIÓN DE DIQUES\" · carpeta \"KELLY TRADER\".\n"
        " * NO EDITAR A MANO: se genera con  python monday/generar.py  a partir de monday/crudo/.\n"
        " *   cronograma: tablero Cronograma (base = Linea Base, real = Fecha Real, diferencia = Diferencia)\n"
        " *   avance: P1, P2 y P3 · avance = Σ (Estado % × Duración) / Σ Duración\n */\n"
        f"window.DIQUE_MONDAY = {cuerpo};\n", encoding="utf-8")

    errores = [o for o in obs if o[0] == "error"]
    print(f"monday.js generado · {len(crono)} elementos del Cronograma · {av['total']['lineas']} trabajos en P1-P3")
    for nivel, txt in obs:
        print(f"  [{nivel}] {txt}")
    if errores:
        print(f"{len(errores)} error(es): revisar antes de publicar.")
        sys.exit(1)
    print("Sin errores.")


if __name__ == "__main__":
    main()
