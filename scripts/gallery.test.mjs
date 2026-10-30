import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { readGalleryData, validateTheme } from "./build-gallery.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const data = await readGalleryData(root);

test("catalog includes all canonical themes, with unique ids and exact family totals", () => {
  assert.equal(data.themes.length, 58);
  assert.equal(new Set(data.themes.map((theme) => theme.id)).size, 58);
  assert.deepEqual(Object.fromEntries(data.families.map((family) => [family.id, data.themes.filter((theme) => theme.family === family.id).length])), {
    cyberpunk: 32, mtg: 25, "anime-gothic": 1,
  });
});

test("retired desktop-style themes are absent from sources and editor registrations", async () => {
  const { access } = await import("node:fs/promises");
  const packageData = JSON.parse(await readFile(resolve(root, "editors/cursor/package.json"), "utf8"));
  for (const suffix of ["breeze-dark", "breeze-light", "breeze-glacius", "oxygen", "oxygen-cold"]) {
    const id = `cyberpunk-${suffix}`;
    assert.equal(data.themes.some((theme) => theme.id === id), false);
    await assert.rejects(access(resolve(root, `sources/zed/cyberpunk/${id}.json`)));
    await assert.rejects(access(resolve(root, `editors/cursor/themes/cyberpunk/${id}-color-theme.json`)));
    assert.equal(packageData.contributes.themes.some((theme) => theme.path.includes(`${id}-color-theme.json`)), false);
  }
});

test("preview tokens and downloadable documents preserve every canonical source", async () => {
  for (const theme of data.themes) {
    const source = JSON.parse(await readFile(resolve(root, theme.sourcePath), "utf8"));
    const matching = source.themes.find((entry) => entry.name === theme.name);
    assert.deepEqual(theme.style, matching.style);
    assert.deepEqual(theme.sourceDocument, source);
    assert.ok(theme.sourceUrl.startsWith("https://github.com/jv-darkheartlabs/dark-heart-themes/blob/main/sources/zed/"));
  }
});

test("alpha colors, appearance labels and the DHL default remain faithful to source", () => {
  const gothic = data.themes.find((theme) => theme.id === "anime-gothic-dhl");
  assert.equal(gothic.style["editor.active_line.background"], "#ffffff0a");
  assert.equal(gothic.appearance, "dark");
  assert.equal(data.themes.filter((theme) => theme.appearance === "light").length, 2);
});

test("TRON references retain existing file ids and have distinct source palettes", () => {
  const references = { legacy: "The Grid", security: "Tron", solar: "CLU", viral: "Rinzler", phantom: "End of Line Club" };
  const palettes = new Set();
  for (const [id, reference] of Object.entries(references)) {
    const theme = data.themes.find((entry) => entry.id === `cyberpunk-tron-${id}`);
    assert.ok(theme, `existing id ${id} retained`);
    assert.equal(theme.name, `TRON: Legacy — ${reference}`);
    palettes.add(JSON.stringify([theme.style["editor.background"], theme.style["text.accent"], theme.style.syntax.string.color]));
  }
  assert.equal(palettes.size, 5);
});

test("Blade Runner offers three separately selectable references", () => {
  const expected = {
    "cyberpunk-blade-runner": "Blade Runner (1982) — Los Angeles",
    "cyberpunk-blade-runner-2049-las-vegas": "Blade Runner 2049 — Las Vegas",
    "cyberpunk-blade-runner-2049-joi": "Blade Runner 2049 — Joi",
  };
  for (const [id, name] of Object.entries(expected)) {
    assert.equal(data.themes.find((theme) => theme.id === id)?.name, name);
  }
});

test("Ghost in the Shell adaptations remain separately selectable", () => {
  const anime = data.themes.find((theme) => theme.id === "cyberpunk-ghost-in-the-shell");
  const liveAction = data.themes.find((theme) => theme.id === "cyberpunk-ghost-in-the-shell-2017");
  assert.equal(anime?.name, "Ghost in the Shell (1995) — Rain City");
  assert.equal(liveAction?.name, "Ghost in the Shell (2017) — Neon City");
  assert.notEqual(anime.style.syntax.keyword.color, liveAction.style.syntax.keyword.color);
  assert.notEqual(anime.style.syntax.string.color, liveAction.style.syntax.string.color);
});

test("Westworld separates the dark park from the light host laboratory", () => {
  const park = data.themes.find((theme) => theme.id === "cyberpunk-westworld");
  const lab = data.themes.find((theme) => theme.id === "cyberpunk-westworld-host-laboratory");
  assert.equal(park?.name, "Westworld — Western Park");
  assert.equal(park?.appearance, "dark");
  assert.equal(lab?.name, "Westworld — Host Laboratory");
  assert.equal(lab?.appearance, "light");
});

test("Ex Machina separates the light laboratory from the dark lockdown", () => {
  const lab = data.themes.find((theme) => theme.id === "cyberpunk-ex-machina");
  const lockdown = data.themes.find((theme) => theme.id === "cyberpunk-ex-machina-lockdown");
  assert.equal(lab?.name, "Ex Machina — Ava’s Laboratory");
  assert.equal(lab?.appearance, "light");
  assert.equal(lockdown?.name, "Ex Machina — Lockdown");
  assert.equal(lockdown?.appearance, "dark");
});

test("Hackers references have explicit names and distinct palettes", () => {
  const expected = { "cyberpunk-acid-burn": "Acid Burn", "cyberpunk-gibson": "The Gibson", "cyberpunk-hackers-95": "Hack the Planet" };
  const accents = new Set();
  for (const [id, reference] of Object.entries(expected)) {
    const theme = data.themes.find((entry) => entry.id === id);
    assert.equal(theme?.name, `Hackers (1995) — ${reference}`);
    accents.add(theme.style["text.accent"]);
  }
  assert.equal(accents.size, 3);
});

test("LCARS provides distinct classic and modern references", () => {
  const classic = data.themes.find((theme) => theme.id === "cyberpunk-lcars");
  const modern = data.themes.find((theme) => theme.id === "cyberpunk-lcars-picard");
  assert.equal(classic?.name, "Star Trek: The Next Generation — Classic LCARS");
  assert.equal(modern?.name, "Star Trek: Picard — Modern LCARS");
  assert.notEqual(classic.style.syntax.keyword.color, modern.style.syntax.keyword.color);
  assert.notEqual(classic.style.syntax.string.color, modern.style.syntax.string.color);
});

test("AKIRA separates Kaneda from Neo-Tokyo", () => {
  const kaneda = data.themes.find((theme) => theme.id === "cyberpunk-akira");
  const city = data.themes.find((theme) => theme.id === "cyberpunk-akira-neo-tokyo");
  assert.equal(kaneda?.name, "AKIRA — Kaneda");
  assert.equal(city?.name, "AKIRA — Neo-Tokyo");
  assert.notEqual(kaneda.style["editor.background"], city.style["editor.background"]);
  assert.notEqual(kaneda.style.syntax.keyword.color, city.style.syntax.keyword.color);
});

test("remaining film references keep stable ids and approved names", () => {
  const expected = {
    "cyberpunk-her": "Her — Theodore & Samantha",
    "cyberpunk-minority-report": "Minority Report — Precrime",
    "cyberpunk-lawnmower-man": "The Lawnmower Man — VR",
    "cyberpunk-swordfish-cyber": "Swordfish — Workstation",
    "cyberpunk-wargames": "WarGames — WOPR",
  };
  for (const [id, name] of Object.entries(expected)) {
    assert.equal(data.themes.find((theme) => theme.id === id)?.name, name);
  }
});

test("Pandora references distinguish forest bioluminescence from night blooms", () => {
  const forest = data.themes.find((theme) => theme.id === "cyberpunk-cyberpunk-pandora");
  const bloom = data.themes.find((theme) => theme.id === "cyberpunk-pandora-dark");
  assert.equal(forest?.name, "Avatar: Pandora — Bioluminescent Forest");
  assert.equal(bloom?.name, "Avatar: Pandora — Night Bloom");
  assert.notEqual(forest.style.syntax.keyword.color, bloom.style.syntax.keyword.color);
  assert.notEqual(forest.style["editor.background"], bloom.style["editor.background"]);
});

test("Cyber Noir is explicitly original and removes the inherited green syntax", () => {
  const noir = data.themes.find((theme) => theme.id === "cyberpunk-cyber-noir");
  assert.equal(noir?.name, "Cyber Noir — Original Palette");
  for (const token of Object.values(noir.style.syntax)) {
    assert.notEqual(token.color?.toLowerCase(), "#88cc88");
  }
});

test("Sweet Cyber is explicitly original and removes the inherited green syntax", () => {
  const sweet = data.themes.find((theme) => theme.id === "cyberpunk-sweet-cyber");
  assert.equal(sweet?.name, "Sweet Cyber — Original Palette");
  for (const token of Object.values(sweet.style.syntax)) {
    assert.notEqual(token.color?.toLowerCase(), "#88cc88");
  }
});

test("invalid metadata and CSS-injection-shaped color values are rejected", () => {
  assert.throws(() => validateTheme({ name: "Bad", appearance: "system", style: {} }, "test"));
  assert.throws(() => validateTheme({ name: "Bad", appearance: "dark", style: { background: "url(https://example.invalid)", foreground: "#fff" } }, "test"));
  assert.throws(() => validateTheme({ name: "Bad", appearance: "dark", style: { background: "#000", foreground: "#fff", syntax: { keyword: { color: "red;display:none" } } } }, "test"));
});

test("revised MTG and cinematic editor text and syntax stay readable against their editor backgrounds", () => {
  const luminance = (hex) => {
    const rgb = hex.slice(1).match(/../g).map((channel) => parseInt(channel, 16) / 255)
      .map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
    return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
  };
  for (const theme of data.themes.filter((entry) => entry.family === "mtg" || entry.id.startsWith("cyberpunk-tron-") || entry.id.startsWith("cyberpunk-blade-runner") || entry.id.startsWith("cyberpunk-ghost-in-the-shell") || entry.id.startsWith("cyberpunk-westworld") || entry.id.startsWith("cyberpunk-ex-machina") || entry.id.startsWith("cyberpunk-lcars") || entry.id.startsWith("cyberpunk-akira") || ["cyberpunk-acid-burn", "cyberpunk-gibson", "cyberpunk-hackers-95", "cyberpunk-her", "cyberpunk-minority-report", "cyberpunk-lawnmower-man", "cyberpunk-swordfish-cyber", "cyberpunk-wargames", "cyberpunk-cyberpunk-pandora", "cyberpunk-pandora-dark", "cyberpunk-cyber-noir", "cyberpunk-sweet-cyber", "cyberpunk-synthwave-crimson", "cyberpunk-synthwave-neon"].includes(entry.id))) {
    const background = luminance(theme.style["editor.background"]);
    const foregrounds = { text: theme.style["editor.foreground"], ...Object.fromEntries(
      Object.entries(theme.style.syntax).filter(([, token]) => token.color).map(([scope, token]) => [scope, token.color]),
    ) };
    for (const [scope, hex] of Object.entries(foregrounds)) {
      const foreground = luminance(hex);
      const ratio = (Math.max(background, foreground) + 0.05) / (Math.min(background, foreground) + 0.05);
      assert.ok(ratio >= 4.5, `${theme.name}: ${scope} contrast ${ratio.toFixed(2)}`);
    }
  }
});
