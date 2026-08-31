# Dark Heart Labs Themes

Unified editor and streaming theme monorepo for Zed, Cursor, Devin Desktop, Discord, Twitch, and OBS.

**Tech spec:** [docs/TECH_SPEC.md](docs/TECH_SPEC.md)

One repo for **editor**, **streaming**, and **brand** themes — no separate `cursor-themes` or `zed-themes` repos required.

| Family | Themes | Platforms |
|--------|--------|-----------|
| **Cyberpunk / Cinematic** | 30 | Zed, Cursor, Devin Desktop |
| **Magic: The Gathering** | 25 | Zed, Cursor, Devin Desktop |
| **Anime Gothic · DHL** | 1 (+ streaming pack) | Zed, Cursor, Devin Desktop, Discord, Twitch, OBS |

**Canonical source:** Zed JSON in `sources/zed/` → Cursor themes generated via `editors/cursor/scripts/zed_to_cursor.py`.


## Clone note (Git LFS)

Streaming assets under `assets/` are stored with **Git LFS**. After clone:

```bash
git lfs install
git clone https://github.com/jv-darkheartlabs/dark-heart-themes.git
cd dark-heart-themes
git lfs pull
```

## Quick install

```bash
git clone https://github.com/jv-darkheartlabs/dark-heart-themes.git
cd dark-heart-themes

# Everything (copy-based, no symlinks)
./scripts/install-all.sh

# Or per platform:
./editors/zed/install.sh              # ~/.config/zed/themes
./editors/cursor/install.sh             # ~/.cursor/extensions
./editors/devin/install.sh              # ~/.devin/extensions
./streaming/anime-gothic/scripts/install-vencord-theme.sh
```

## Repo layout

```
dark-heart-themes/
├── catalog.json                 # Master family index
├── sources/zed/                 # Canonical theme JSON (edit here)
│   ├── cyberpunk/               # 30 cinematic themes
│   ├── mtg/                     # 25 MTG themes
│   └── anime-gothic/            # Dark Heart Labs gothic editor theme
├── editors/
│   ├── cursor/                  # Cursor/VS Code extension (generated themes/)
│   ├── devin/                   # Devin Desktop installer (reuses cursor extension)
│   └── zed/                     # Zed installer
├── streaming/anime-gothic/      # Discord, Twitch, OBS
├── assets/                      # Streaming art (Anime Gothic Pack copy)
├── shared/palettes/             # Shared color tokens per family
└── docs/                        # Migration + family docs
```

## Editor themes

### Zed
1. `./editors/zed/install.sh`
2. Restart Zed → pick **Cyberpunk - Blade Runner**, **MTG Rakdos Carnival**, or **Anime Gothic Dark Heart Labs**

### Cursor
1. `./editors/cursor/install.sh` (copies extension; default is **not** symlink)
2. Reload → **Cmd+K Cmd+T** → pick a theme

### Devin Desktop
Devin Desktop is a VS Code derivative, so it loads the same extension as Cursor — only the
extensions directory differs (`~/.devin/extensions`, legacy `~/.windsurf/extensions`).

1. `./editors/devin/install.sh` (override the target with `DEVIN_EXTENSIONS_DIR`)
2. Reload → **Cmd/Ctrl+K Cmd/Ctrl+T** → pick a theme

### Regenerate Cursor from Zed sources
```bash
cd editors/cursor && python3 scripts/zed_to_cursor.py
```

## Streaming (Anime Gothic)

| Piece | Path |
|-------|------|
| Vencord Discord | `streaming/anime-gothic/discord/` |
| Twitch chat (7TV) | `streaming/anime-gothic/twitch/chat/` |
| Twitch profile | `streaming/anime-gothic/twitch/profile/` |
| OBS scenes | `streaming/anime-gothic/obs/` |

See `streaming/anime-gothic/discord/INSTALL.md` and `streaming/anime-gothic/obs/SETUP.md`.

## Adding a new family

1. Add `sources/zed/<family>/*.json`
2. Run `python3 editors/cursor/scripts/zed_to_cursor.py`
3. Add entry to `catalog.json`
4. Add `docs/families/<family>.md`
5. `./editors/zed/install.sh` to deploy

## Migrating from old repos

See [docs/MIGRATION.md](docs/MIGRATION.md) — archive `cursor-themes`, `cyberpunk-zed-themes`, and `zed-mtg-themes` after pointing READMEs here.

## License

MIT — editor theme JSON. Anime Gothic Pack art: your licensed streaming assets.

---

**Maintained by:** [Dark Heart Labs](https://darkheartlabs.technology)  
**Author:** Jennifer ([@jv-darkheartlabs](https://github.com/jv-darkheartlabs))  
**Site:** https://darkheartlabs.technology
