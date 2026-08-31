#!/usr/bin/env bash
# install.sh — install the theme extension into Devin Desktop
#
# Devin Desktop is a VS Code derivative, so it loads the same unpacked
# extension that editors/cursor/ produces. Only the extensions directory
# differs: ~/.devin/extensions (legacy: ~/.windsurf/extensions).
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
EXT_SRC="$(cd "$REPO_DIR/../cursor" && pwd)"
PUBLISHER="jen-the-dev"
NAME="dark-heart-themes-cursor"

log() { printf '%s\n' "$*"; }
err() { printf 'ERROR: %s\n' "$*" >&2; }

usage() {
  cat <<EOF
Usage: $(basename "$0") [--dry-run] [--uninstall]

Copies the generated VS Code/Cursor theme extension into Devin Desktop's
per-user extensions directory.

Options:
  --dry-run     Show actions without changing anything
  --uninstall   Remove the installed extension directory

Environment:
  DEVIN_EXTENSIONS_DIR  Override install target
EOF
}

DRY_RUN=false
UNINSTALL=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run) DRY_RUN=true; shift ;;
    --uninstall) UNINSTALL=true; shift ;;
    -h|--help) usage; exit 0 ;;
    *) err "Unknown option: $1"; usage; exit 1 ;;
  esac
done

if [[ ! -f "$EXT_SRC/package.json" ]]; then
  err "package.json not found in $EXT_SRC. Run: python3 editors/cursor/scripts/zed_to_cursor.py"
  exit 1
fi

VERSION="$(cd "$EXT_SRC" && python3 - <<'PY'
import json
from pathlib import Path
print(json.loads(Path("package.json").read_text())["version"])
PY
)"
EXT_ID="${PUBLISHER}.${NAME}-${VERSION}"

if [[ -n "${DEVIN_EXTENSIONS_DIR:-}" ]]; then
  DEVIN_EXT_DIR="$DEVIN_EXTENSIONS_DIR"
elif [[ -d "$HOME/.devin/extensions" ]]; then
  DEVIN_EXT_DIR="$HOME/.devin/extensions"
elif [[ -d "$HOME/.windsurf/extensions" ]]; then
  DEVIN_EXT_DIR="$HOME/.windsurf/extensions"
else
  DEVIN_EXT_DIR="$HOME/.devin/extensions"
fi
TARGET="${DEVIN_EXT_DIR}/${EXT_ID}"

run() {
  if $DRY_RUN; then
    log "[dry-run] $*"
  else
    eval "$@"
  fi
}

if $UNINSTALL; then
  if [[ -e "$TARGET" || -L "$TARGET" ]]; then
    run "rm -rf '$TARGET'"
    log "Removed $TARGET"
  else
    log "Nothing to uninstall at $TARGET"
  fi
  exit 0
fi

run "mkdir -p '$DEVIN_EXT_DIR'"

if [[ -e "$TARGET" || -L "$TARGET" ]]; then
  run "rm -rf '$TARGET'"
fi

run "mkdir -p '$TARGET'"
if command -v rsync >/dev/null 2>&1; then
  run "rsync -a --delete --exclude '.git' --exclude 'dist' '$EXT_SRC/' '$TARGET/'"
else
  run "cp -R '$EXT_SRC/package.json' '$EXT_SRC/themes' '$TARGET/'"
  if [[ -f "$EXT_SRC/LICENSE" ]]; then
    run "cp -R '$EXT_SRC/LICENSE' '$TARGET/'"
  fi
fi

log "Installed to $TARGET"
log "Reload Devin Desktop, then Cmd/Ctrl+K Cmd/Ctrl+T to pick a theme."
log "Categories appear as: Anime Gothic - ..., Cyberpunk - ... and Mtg - ..."
