#!/usr/bin/env bash
# Guarda una versión en GitHub cada vez que Claude termina un turno:
# si hay cambios en el proyecto, hace commit, trae lo que otros hayan subido y hace push.
# Si una subida anterior falló, la reintenta aunque no haya cambios nuevos.
# Funciona igual en cualquier PC: se ubica en la carpeta del proyecto a partir de este archivo.

cd "$(dirname "$0")/../.." || exit 0
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || exit 0

quien=$(git config user.name 2>/dev/null)
msg=""
if [ -n "$(git status --porcelain)" ]; then
  git add -A 2>/dev/null
  n=$(git diff --cached --name-only | wc -l | tr -d ' ')
  files=$(git diff --cached --name-only | head -4 | paste -sd ',' - | sed 's/,/, /g')
  [ "$n" -gt 4 ] && files="$files y $((n - 4)) más"
  git commit -q \
    -m "Versión automática $(date '+%Y-%m-%d %H:%M') · $n archivo(s)${quien:+ · $quien}" \
    -m "Cambios: $files" \
    -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>" || exit 0
  msg="Versión guardada en GitHub ($n archivo(s))."
fi

# Trae lo que haya subido otra persona antes de subir lo propio (evita pisarse)
if ! GIT_TERMINAL_PROMPT=0 timeout 60 git pull -q --rebase --autostash origin main 2>/dev/null; then
  git rebase --abort 2>/dev/null
  echo '{"systemMessage": "Hay cambios de otra persona que chocan con los tuyos en los mismos archivos. Tu versión quedó guardada en local; pídele a Claude que resuelva el conflicto con: git pull --rebase origin main"}'
  exit 0
fi

# ¿Hay commits locales que GitHub todavía no tiene?
pending=$(git rev-list --count @{u}..HEAD 2>/dev/null || echo 1)
[ "$pending" = "0" ] && { [ -n "$msg" ] && echo "{\"systemMessage\": \"$msg\"}"; exit 0; }

if GIT_TERMINAL_PROMPT=0 timeout 90 git push -q origin HEAD 2>/dev/null; then
  echo "{\"systemMessage\": \"${msg:-Versiones pendientes subidas a GitHub.}\"}"
else
  echo "{\"systemMessage\": \"Versión guardada en local, pero no se pudo subir a GitHub. Se reintentará al terminar el próximo turno.\"}"
fi
