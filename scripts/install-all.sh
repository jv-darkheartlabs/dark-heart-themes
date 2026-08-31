#!/usr/bin/env bash
set -euo pipefail
REPO="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO"

echo "==> Zed themes"
"$REPO/editors/zed/install.sh"

echo "==> Cursor extension"
"$REPO/editors/cursor/install.sh"

echo "==> Devin Desktop extension"
"$REPO/editors/devin/install.sh"

echo "==> Discord (Vencord) — Anime Gothic"
"$REPO/streaming/anime-gothic/scripts/install-vencord-theme.sh"

echo ""
echo "All copy-based installs complete."
echo "  Zed:     restart → theme picker"
echo "  Cursor:  reload → Cmd+K Cmd+T"
echo "  Devin:   reload → Cmd/Ctrl+K Cmd/Ctrl+T"
echo "  Discord: Vencord → Themes → Anime Gothic · Dark Heart Labs"
echo "  Twitch:  see streaming/anime-gothic/twitch/profile/PROFILE.md"
echo "  OBS:     import streaming/anime-gothic/obs/dark-heart-labs.anime-gothic.json"
