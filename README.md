# Dark Heart Labs Themes

Unified editor and streaming theme monorepo for Zed, Cursor, Discord, Twitch, and OBS.

**Tech spec:** [docs/TECH_SPEC.md](docs/TECH_SPEC.md)

One repo for **editor**, **streaming**, and **brand** themes — no separate `cursor-themes` or `zed-themes` repos required.

| Family | Themes | Platforms |
|--------|--------|-----------|
| **Cyberpunk / Cinematic** | 32 | Zed, Cursor |
| **Magic: The Gathering** | 25 | Zed, Cursor |
| **Anime Gothic · DHL** | 1 (+ streaming pack) | Zed, Cursor, Discord, Twitch, OBS |

**Canonical source:** Zed JSON in `sources/zed/` → Cursor themes generated via `editors/cursor/scripts/zed_to_cursor.py`.


## Browser theme gallery

[Open the live theme gallery](https://jv-darkheartlabs.github.io/dark-heart-themes/).

Preview all 58 canonical themes without installing an editor extension or streaming pack. The gallery includes family and appearance filters, name search, a sample-code preview, source-color swatches and the original Zed JSON download. Only the preview uses the selected theme; navigation and controls keep their own readable colors. Browser rendering is an approximation of an editor theme.

```bash
node scripts/build-gallery.mjs
node --test scripts/gallery.test.mjs
python3 -m http.server 8893 --bind 127.0.0.1 --directory gallery
```

Open `http://127.0.0.1:8893/`. The generated `gallery/themes.json` is derived from `catalog.json` and `sources/zed/`; edit the canonical theme files rather than the generated catalog. No installer, external service, account or private data is needed for the gallery.

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
./streaming/anime-gothic/scripts/install-vencord-theme.sh
```

## Repo layout

```
dark-heart-themes/
├── catalog.json                 # Master family index
├── sources/zed/                 # Canonical theme JSON (edit here)
│   ├── cyberpunk/               # 32 cinematic themes
│   ├── mtg/                     # 25 MTG themes
│   └── anime-gothic/            # Dark Heart Labs gothic editor theme
├── editors/
│   ├── cursor/                  # Cursor/VS Code extension (generated themes/)
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
