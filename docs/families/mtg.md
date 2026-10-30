# Magic: The Gathering family

25 themes for color identities, guilds, and shards.

- **Source:** `sources/zed/mtg/*.json`
- **Cursor labels:** `Mtg - …`
- **Generator:** Original `zed-mtg-themes/scripts/generate_mtg_themes.py` (historical; edit JSON directly now)

## Palette direction

The palettes follow the named mana identities rather than assigning one blended hue to an entire faction. White uses ivory and restrained gold; blue uses clear blues; black uses ink and charcoal; red uses crimson and flame; green uses forest and verdant greens. Neutral text remains readable against dark backgrounds.

Guild palettes show both colors. Shards and wedges distribute all three across syntax and interface accents. Black is expressed mainly through dark surfaces and neutral ash highlights, rather than making every black-aligned faction purple. Chrome Mox uses a metallic neutral foundation with five-color gemstone accents.

These hexadecimal colors are editorial interpretations, not official Wizards brand specifications. Identity references: [Ravnica](https://magic.wizards.com/en/story/ravnica-plane) and [Exploring Wedges](https://magic.wizards.com/en/news/feature/exploring-wedges-2014-08-27).

After editing canonical JSON, regenerate the Cursor themes with `python3 editors/cursor/scripts/zed_to_cursor.py` and rebuild the browser catalog with `node scripts/build-gallery.mjs` so downloads and previews agree.
