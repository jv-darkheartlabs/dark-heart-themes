# Discord (Vencord) install

## 1. Install Vencord

https://vencord.dev/download — MacOS installer for your Discord build.

## 2. Install theme (copy — no symlinks)

From repo root:

```bash
./streaming/anime-gothic/scripts/install-vencord-theme.sh
```

Or manually:

```bash
THEMES="$HOME/Library/Application Support/Vencord/themes/Anime-Gothic-DHL"
mkdir -p "$THEMES/assets"
cp streaming/anime-gothic/discord/Anime-Gothic-DHL.theme.css "$THEMES/"
cp -R assets/anime-gothic-pack "$THEMES/assets/"
```

## 3. Enable

Discord → **Settings → Vencord → Themes** → **Anime Gothic · Dark Heart Labs**

## Profile assets

| Asset | Path |
|---|---|
| Banner 960×540 | `assets/profile/discord-banner-960x540.png` |
| Avatar 512×512 | `assets/profile/discord-avatar-512.png` |
