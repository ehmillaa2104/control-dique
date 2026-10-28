"""
Lee los 8 tableros del Kelly Trader desde la API de Monday y los guarda en monday/crudo/kelly.json.

Es lo mismo que hace Claude con el conector de Monday (consulta del CLAUDE.md), pero sin Claude:
lo usa la actualización automática de GitHub Actions (.github/workflows/actualizar-monday.yml).

    MONDAY_TOKEN=... python monday/leer_monday.py

El token es un secreto del repositorio (Settings → Secrets and variables → Actions → MONDAY_TOKEN).
Nunca se escribe en un archivo: el repositorio es público.
Si se cambia la consulta o la lista de tableros en el CLAUDE.md, se cambia también aquí.
"""
import json
import os
import sys
import time
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path

CRUDO = Path(__file__).resolve().parent / "crudo" / "kelly.json"
TABLEROS = ["18431008651", "18431019817", "18432105237", "18432105438",
            "18431746322", "18431381932", "18431380804", "18435454602"]
CONSULTA = """query ($ids: [ID!]) { boards(ids: $ids) { id name columns { id title type } items_page(limit: 500) { cursor items { id name created_at updated_at group { id title } column_values { id type text ... on MirrorValue { display_value } ... on FormulaValue { display_value } ... on BoardRelationValue { linked_item_ids } } subitems { id name created_at updated_at column_values { id type text ... on FormulaValue { display_value } } updates(limit: 1) { created_at text_body } } } } } }"""
BOGOTA = timezone(timedelta(hours=-5))


def consultar(token):
    cuerpo = json.dumps({"query": CONSULTA, "variables": {"ids": TABLEROS}}).encode()
    for intento in range(3):
        req = urllib.request.Request("https://api.monday.com/v2", data=cuerpo, headers={
            "Authorization": token, "Content-Type": "application/json", "API-Version": "2025-04"})
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                resp = json.load(r)
        except Exception as e:  # red o 5xx: reintenta
            err = str(e)
        else:
            if not resp.get("errors"):
                return resp["data"]["boards"]
            err = json.dumps(resp["errors"], ensure_ascii=False)[:500]
        print(f"Intento {intento + 1}: {err}", file=sys.stderr)
        time.sleep(20)
    sys.exit("No se pudo leer Monday.")


def main():
    token = os.environ.get("MONDAY_TOKEN")
    if not token:
        sys.exit("Falta MONDAY_TOKEN.")
    boards = consultar(token)
    if len(boards) != len(TABLEROS):
        sys.exit(f"Monday devolvió {len(boards)} tableros de {len(TABLEROS)}.")
    for b in boards:
        if b["items_page"].get("cursor"):
            sys.exit(f"El tablero {b['name']} tiene más de 500 elementos: falta paginar.")
    # Conserva las demás claves del crudo; "extraido" va primero
    ant = json.loads(CRUDO.read_text(encoding="utf-8")) if CRUDO.exists() else {}
    crudo = {"extraido": datetime.now(BOGOTA).date().isoformat(),
             **{k: v for k, v in ant.items() if k not in ("extraido", "boards")}, "boards": boards}
    CRUDO.write_text(json.dumps(crudo, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"Leídos {len(boards)} tableros · {sum(len(b['items_page']['items']) for b in boards)} elementos")


if __name__ == "__main__":
    main()
