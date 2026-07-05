# Migration — consolidate into dark-heart-themes

This repo replaces three separate theme repos:

| Old repo | Status | New location |
|----------|--------|--------------|
| [cursor-themes](https://github.com/jv-darkheartlabs/cursor-themes) | **Archive** | `editors/cursor/` |
| [cyberpunk-zed-themes](https://github.com/jv-darkheartlabs/cyberpunk-zed-themes) | **Archive** | `sources/zed/cyberpunk/` |
| [zed-mtg-themes](https://github.com/jv-darkheartlabs/zed-mtg-themes) | **Archive** | `sources/zed/mtg/` |

Local copies under `~/Projects/cursor-themes` and `~/Projects/zed-themes/` can be retired once you confirm installs work from this repo.

## What changed

- **Single canonical source:** all Zed JSON lives in `sources/zed/<family>/`
- **No symlinks:** installers copy files by default (Vencord, Zed, Cursor)
- **Anime Gothic** is a first-class family — editor theme + Discord/Twitch/OBS in `streaming/anime-gothic/`
- **Cursor extension** renamed to `dark-heart-themes-cursor` (v2.0.0)

## Recommended archive steps

1. Push `dark-heart-themes` to GitHub
2. Run `./scripts/install-all.sh` locally and verify Zed + Cursor + Discord
3. On each old repo, add to README top:
   > **Moved:** Themes now live at [dark-heart-themes](https://github.com/jv-darkheartlabs/dark-heart-themes). This repo is archived.
4. GitHub → Settings → Archive repository (don't delete — preserves stars/links)

## Uninstall old installs

```bash
# Old cursor-themes extension
rm -rf ~/.cursor/extensions/jen-the-dev.cursor-themes-*

# Old zed symlinks (if any)
ls ~/.config/zed/themes/cyberpunk-* 2>/dev/null && ./editors/zed/install.sh  # overwrites with copies from monorepo
```

Then reinstall from this repo.

## Archived repos are read-only on GitHub

GitHub blocks pushes to archived repositories. To add the redirect banner to old READMEs:

1. **Settings → General → uncheck "Archive this repository"** (temporarily)
2. Prepend the snippet from `docs/ARCHIVE_README_SNIPPET.md` to each README
3. Push, then re-archive

Or leave them archived — `dark-heart-themes` is the canonical install path either way.
