#!/usr/bin/env bash
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
FAMILY_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
THEMES="${HOME}/Library/Application Support/Vencord/themes/Anime-Gothic-DHL"
mkdir -p "${THEMES}/assets"
cp "${FAMILY_ROOT}/discord/Anime-Gothic-DHL.theme.css" "${THEMES}/"
rm -rf "${THEMES}/assets/anime-gothic-pack"
cp -R "${REPO_ROOT}/assets/anime-gothic-pack" "${THEMES}/assets/"
echo "Installed to: ${THEMES}"
echo "Enable in Discord → Settings → Vencord → Themes"
