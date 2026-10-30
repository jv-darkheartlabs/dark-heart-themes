import { readdir, readFile, realpath, mkdir, writeFile, lstat } from "node:fs/promises";
import { resolve, relative, basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const HEX = /^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i;

export function validateTheme(theme, source) {
  if (!theme.name || !["dark", "light"].includes(theme.appearance) || !theme.style) {
    throw new Error(`Invalid theme metadata: ${source}`);
  }
  const background = theme.style["editor.background"] ?? theme.style.background;
  const foreground = theme.style["editor.foreground"] ?? theme.style.foreground ?? theme.style.text;
  if (!HEX.test(background) || !HEX.test(foreground)) {
    throw new Error(`Missing or invalid editor colors: ${source}`);
  }
  for (const [key, value] of Object.entries(theme.style)) {
    if (typeof value === "string" && !HEX.test(value)) {
      throw new Error(`Non-color style value at ${key}: ${source}`);
    }
  }
  for (const token of Object.values(theme.style.syntax ?? {})) {
    if (token.color !== undefined && !HEX.test(token.color)) {
      throw new Error(`Invalid syntax color: ${source}`);
    }
  }
}

export async function readGalleryData(repoRoot = ROOT) {
  const catalog = JSON.parse(await readFile(resolve(repoRoot, "catalog.json"), "utf8"));
  const canonicalRoot = await realpath(resolve(repoRoot, "sources/zed"));
  const families = [];
  const themes = [];
  const ids = new Set();

  for (const [id, family] of Object.entries(catalog.families)) {
    const directory = await realpath(resolve(repoRoot, family.canonical));
    const within = relative(canonicalRoot, directory);
    if (within.startsWith("..") || within.startsWith("/")) throw new Error("Theme source outside canonical directory");
    families.push({ id, label: family.label, description: family.description });
    const files = (await readdir(directory)).filter((file) => file.endsWith(".json")).sort();
    let familyCount = 0;
    for (const file of files) {
      const source = resolve(directory, file);
      if (!(await lstat(source)).isFile()) throw new Error(`Theme must be a regular file: ${file}`);
      const document = JSON.parse(await readFile(source, "utf8"));
      if (!Array.isArray(document.themes) || !document.themes.length) throw new Error(`Empty source: ${file}`);
      for (const [index, theme] of document.themes.entries()) {
        validateTheme(theme, file);
        const themeId = basename(file, ".json") + (document.themes.length > 1 ? `-${index + 1}` : "");
        if (ids.has(themeId)) throw new Error(`Duplicate theme id: ${themeId}`);
        ids.add(themeId);
        const sourcePath = relative(repoRoot, source).replaceAll("\\", "/");
        themes.push({
          id: themeId,
          name: theme.name,
          family: id,
          appearance: theme.appearance,
          sourcePath,
          sourceUrl: `${catalog.repository}/blob/main/${sourcePath.split("/").map(encodeURIComponent).join("/")}`,
          style: theme.style,
          sourceDocument: document,
        });
        familyCount += 1;
      }
    }
    if (familyCount !== family.themeCount) {
      throw new Error(`Catalog count mismatch for ${id}: expected ${family.themeCount}, found ${familyCount}`);
    }
  }
  return { families, themes };
}

export async function buildGallery(repoRoot = ROOT) {
  const data = await readGalleryData(repoRoot);
  const output = resolve(repoRoot, "gallery/themes.json");
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, JSON.stringify(data) + "\n");
  return data;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  buildGallery().then((data) => console.log(`Built gallery data: ${data.themes.length} themes in ${data.families.length} families.`)).catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
