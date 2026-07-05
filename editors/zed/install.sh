#!/usr/bin/env bash
# Install all Zed themes from dark-heart-themes (copy by default — no symlinks).
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SOURCE_ROOT="${REPO_ROOT}/sources/zed"
TARGET="${ZED_THEMES_DIR:-$HOME/.config/zed/themes}"

log() { printf '%s\n' "$*"; }
err() { printf 'ERROR: %s\n' "$*" >&2; }

usage() {
  cat <<EOF
Usage: $(basename "$0") [--dry-run]

Copies every *.json theme from sources/zed/* into ${TARGET}
(cyberpunk, mtg, anime-gothic, and future families).

Environment:
  ZED_THEMES_DIR  Override install target
EOF
}

DRY_RUN=false
while [[ $# -gt 0 ]]; do
  case "$1" in
    -h|--help) usage; exit 0 ;;
    --dry-run) DRY_RUN=true; shift ;;
    *) err "Unknown option: $1"; usage; exit 1 ;;
  esac
done

if [[ ! -d "$SOURCE_ROOT" ]]; then
  err "Missing sources: $SOURCE_ROOT"
  exit 1
fi

mkdir -p "$TARGET"
count=0

while IFS= read -r -d '' file; do
  base="$(basename "$file")"
  dest="${TARGET}/${base}"
  if $DRY_RUN; then
    log "would copy: $file -> $dest"
  else
    cp -f "$file" "$dest"
    log "installed: $base"
  fi
  count=$((count + 1))
done < <(find "$SOURCE_ROOT" -mindepth 2 -maxdepth 2 -name '*.json' -print0)

log "Done — ${count} theme(s) in ${TARGET}"
log "Restart Zed → Command Palette → theme selector"
