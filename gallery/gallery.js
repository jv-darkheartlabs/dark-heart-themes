/* Static theme previews. No installers, accounts, uploads or persistent storage. */
(() => {
  "use strict";
  const byId = (id) => document.getElementById(id);
  const validHex = (value) => typeof value === "string" && /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(value);
  const color = (value, fallback) => validHex(value) ? value : fallback;
  const state = { themes: [], families: [], selected: null, search: "", family: "all", appearance: "all", language: "typescript" };
  const elements = {
    search: byId("theme-search"), cards: byId("theme-cards"), select: byId("theme-select"),
    status: byId("gallery-status"), preview: byId("preview"), editor: byId("editor-preview"),
    palette: byId("palette"), code: byId("code-preview"), name: byId("preview-name"),
  };
  const snippets = {
    typescript: [
      [["// A small palette, ready for the next idea.", "comment"]],
      [["type", "keyword"], [" Theme", "type"], [" = { name: ", "punctuation"], ["string", "type"], ["; colors: ", "punctuation"], ["string", "type"], ["[] };", "punctuation"]],
      [],
      [["export function", "keyword"], [" previewTheme", "function"], ["(theme: ", "punctuation"], ["Theme", "type"], [") {", "punctuation"]],
      [["  const", "keyword"], [" swatches", "variable"], [" = theme.colors.", "punctuation"], ["map", "function"], ["((color, index) => ({", "punctuation"]],
      [["    id", "property"], [": ", "punctuation"], ["index", "variable"], [",", "punctuation"]],
      [["    color", "property"], [",", "punctuation"]],
      [["    selected", "property"], [": index === ", "punctuation"], ["0", "number"], [",", "punctuation"]],
      [["  }));", "punctuation"]],
      [],
      [["  return", "keyword"], [" {", "punctuation"]],
      [["    name", "property"], [": theme.name,", "punctuation"]],
      [["    swatches", "property"], [",", "punctuation"]],
      [["    ready", "property"], [": ", "punctuation"], ["true", "boolean"], [",", "punctuation"]],
      [["  };", "punctuation"]],
      [["}", "punctuation"]],
      [],
      [["// Original theme colors. Your workspace, your mood.", "comment"]],
    ],
    python: [
      [["# A small palette, ready for the next idea.", "comment"]],
      [["from", "keyword"], [" dataclasses ", "variable"], ["import", "keyword"], [" dataclass", "type"]],
      [],
      [["@dataclass", "function"]],
      [["class", "keyword"], [" Theme", "type"], [":", "punctuation"]],
      [["    name", "property"], [": ", "punctuation"], ["str", "type"]],
      [["    colors", "property"], [": ", "punctuation"], ["list", "type"], ["[", "punctuation"], ["str", "type"], ["]", "punctuation"]],
      [],
      [["def", "keyword"], [" preview_theme", "function"], ["(theme: ", "punctuation"], ["Theme", "type"], ["):", "punctuation"]],
      [["    return", "keyword"], [" {", "punctuation"]],
      [["        \"name\"", "string"], [": theme.name,", "punctuation"]],
      [["        \"swatches\"", "string"], [": [", "punctuation"]],
      [["            {", "punctuation"], ["\"color\"", "string"], [": color, ", "punctuation"], ["\"selected\"", "string"], [": index == ", "punctuation"], ["0", "number"], ["}", "punctuation"]],
      [["            for", "keyword"], [" index, color ", "variable"], ["in", "keyword"], [" enumerate(theme.colors)", "function"]],
      [["        ],", "punctuation"]],
      [["        \"ready\"", "string"], [": ", "punctuation"], ["True", "boolean"], [",", "punctuation"]],
      [["    }", "punctuation"]],
      [["# Original theme colors. Your workspace, your mood.", "comment"]],
    ],
  };

  function familyLabel(id) {
    return state.families.find((family) => family.id === id)?.label || id;
  }
  function matches() {
    const query = state.search.trim().toLocaleLowerCase();
    return state.themes.filter((theme) =>
      (state.family === "all" || theme.family === state.family) &&
      (state.appearance === "all" || theme.appearance === state.appearance) &&
      (!query || theme.name.toLocaleLowerCase().includes(query)));
  }
  function node(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }
  function tokenColor(style, scope, fallback) {
    return color(style.syntax?.[scope]?.color, fallback);
  }
  function renderCode(theme) {
    const foreground = color(theme.style["editor.foreground"], color(theme.style.text, "#e8e0ec"));
    elements.code.replaceChildren();
    snippets[state.language].forEach((parts, index) => {
      const line = node("span", "code-line");
      const number = node("span", "line-number", String(index + 1).padStart(2, " "));
      number.setAttribute("aria-hidden", "true");
      line.append(number);
      if (!parts.length) line.append(document.createTextNode(" "));
      parts.forEach(([text, scope]) => {
        const span = node("span", null, text);
        const style = theme.style.syntax?.[scope] || {};
        span.style.color = tokenColor(theme.style, scope, foreground);
        if (style.font_style === "italic") span.style.fontStyle = "italic";
        if (Number.isInteger(style.font_weight) && style.font_weight >= 100 && style.font_weight <= 900) span.style.fontWeight = String(style.font_weight);
        line.append(span);
      });
      elements.code.append(line);
    });
    const filename = state.language === "python" ? "preview.py" : "preview.ts";
    byId("editor-file-tab").textContent = filename;
    byId("editor-active-file").textContent = filename;
    byId("editor-language-label").textContent = (state.language === "python" ? "Python" : "TypeScript") + " · UTF-8";
  }
  function renderPalette(theme) {
    const style = theme.style;
    const tokens = [
      ["Editor background", style["editor.background"] ?? style.background],
      ["Editor text", style["editor.foreground"] ?? style.text ?? style.foreground],
      ["Accent", style["text.accent"]],
      ["Keyword", style.syntax?.keyword?.color],
      ["String", style.syntax?.string?.color],
      ["Comment", style.syntax?.comment?.color],
      ["Function", style.syntax?.function?.color],
      ["Number", style.syntax?.number?.color],
      ["Panel", style["panel.background"] ?? style["surface.background"]],
    ];
    elements.palette.replaceChildren();
    tokens.filter(([, value]) => validHex(value)).forEach(([label, value]) => {
      const item = node("div", "palette-item");
      const chip = node("span", "palette-chip");
      chip.setAttribute("aria-hidden", "true");
      const paint = node("span");
      paint.style.backgroundColor = value;
      chip.append(paint);
      item.append(chip, node("dt", null, label), node("dd", null, value.toUpperCase()));
      elements.palette.append(item);
    });
  }
  function renderPreview(theme) {
    const style = theme.style;
    const background = color(style["editor.background"], color(style.background, "#100020"));
    const foreground = color(style["editor.foreground"], color(style.text, color(style.foreground, "#e8e0ec")));
    const mappings = {
      "--ed-bg": background,
      "--ed-fg": foreground,
      "--ed-surface": color(style["panel.background"], color(style["surface.background"], background)),
      "--ed-title": color(style["title_bar.background"], background),
      "--ed-status": color(style["status_bar.background"], background),
      "--ed-border": color(style.border, foreground),
      "--ed-muted": color(style["editor.line_number"], color(style["text.muted"], foreground)),
      "--ed-active": color(style["tab.active_background"], color(style["element.background"], background)),
      "--ed-accent": color(style["editor.active_line_number"], color(style["text.accent"], foreground)),
    };
    Object.entries(mappings).forEach(([key, value]) => elements.editor.style.setProperty(key, value));
    elements.editor.style.colorScheme = theme.appearance === "light" ? "light" : "dark";
    elements.name.textContent = theme.name;
    byId("preview-family").textContent = familyLabel(theme.family);
    byId("preview-appearance").textContent = theme.appearance;
    byId("editor-theme-label").textContent = theme.name;
    byId("editor-status-name").textContent = theme.name;
    const safeSource = typeof theme.sourceUrl === "string" && theme.sourceUrl.startsWith("https://github.com/jv-darkheartlabs/dark-heart-themes/");
    byId("source-link").href = safeSource ? theme.sourceUrl : "https://github.com/jv-darkheartlabs/dark-heart-themes";
    byId("download-theme").textContent = "Download Zed JSON";
    byId("download-status").textContent = "";
    renderCode(theme);
    renderPalette(theme);
  }
  function selectTheme(id, reveal = false) {
    const theme = state.themes.find((item) => item.id === id);
    if (!theme) return;
    state.selected = theme;
    elements.select.value = theme.id;
    elements.cards.querySelectorAll(".theme-card").forEach((card) => {
      const selected = card.dataset.themeId === id;
      card.setAttribute("aria-pressed", String(selected));
      card.querySelector(".theme-card-selected").textContent = selected ? "Selected" : "";
    });
    renderPreview(theme);
    elements.status.textContent = `${matches().length} matching themes. Previewing ${theme.name}.`;
    if (reveal && window.matchMedia("(max-width: 850px)").matches) {
      elements.name.focus({ preventScroll: true });
      elements.preview.scrollIntoView({ block: "start" });
    }
  }
  function renderCards(themes) {
    elements.cards.replaceChildren();
    themes.forEach((theme) => {
      const card = node("button", "theme-card");
      card.type = "button";
      card.dataset.themeId = theme.id;
      card.setAttribute("aria-label", `Preview ${theme.name}`);
      card.setAttribute("aria-pressed", String(theme.id === state.selected?.id));
      const mini = node("span", "theme-mini");
      mini.setAttribute("aria-hidden", "true");
      const background = color(theme.style["editor.background"], color(theme.style.background, "#100020"));
      const foreground = color(theme.style["editor.foreground"], color(theme.style.text, "#e8e0ec"));
      mini.style.backgroundColor = background;
      ["keyword", "string", "function", "comment"].forEach((scope) => {
        const bar = node("span");
        bar.style.backgroundColor = tokenColor(theme.style, scope, foreground);
        mini.append(bar);
      });
      const metadata = node("span", "theme-card-meta");
      metadata.append(node("span", null, theme.appearance === "light" ? "Light" : "Dark"), node("span", "theme-card-selected", theme.id === state.selected?.id ? "Selected" : ""));
      card.append(mini, node("span", "theme-card-name", theme.name), metadata);
      card.addEventListener("click", () => selectTheme(theme.id, true));
      elements.cards.append(card);
    });
  }
  function applyFilters() {
    const filtered = matches();
    byId("match-count").textContent = `${filtered.length} / ${state.themes.length}`;
    byId("no-results").hidden = Boolean(filtered.length);
    elements.cards.hidden = !filtered.length;
    elements.select.replaceChildren();
    filtered.forEach((theme) => {
      const option = node("option", null, theme.name);
      option.value = theme.id;
      elements.select.append(option);
    });
    elements.select.disabled = !filtered.length;
    if (!filtered.length) {
      const option = node("option", null, "No matching themes");
      option.value = "";
      elements.select.append(option);
      elements.status.textContent = `No matching themes. The preview still shows ${state.selected?.name || "the selected theme"}.`;
    } else {
      if (!filtered.some((theme) => theme.id === state.selected?.id)) state.selected = filtered[0];
      renderPreview(state.selected);
      elements.select.value = state.selected.id;
      elements.status.textContent = `${filtered.length} matching themes. Previewing ${state.selected.name}.`;
    }
    renderCards(filtered);
  }
  function clearFilters() {
    state.search = "";
    state.family = "all";
    state.appearance = "all";
    elements.search.value = "";
    document.querySelector('input[name="family"][value="all"]').checked = true;
    document.querySelector('input[name="appearance"][value="all"]').checked = true;
    applyFilters();
  }
  function downloadTheme() {
    const theme = state.selected;
    if (!theme) return;
    const blob = new Blob([JSON.stringify(theme.sourceDocument, null, 2) + "\n"], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const originalName = typeof theme.sourcePath === "string" ? theme.sourcePath.split("/").pop() : "";
    link.download = /^[a-z0-9._-]+\.json$/i.test(originalName) ? originalName : `${theme.id}.json`;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    byId("download-status").textContent = `Download started: ${theme.name}. No theme has been installed.`;
  }
  function attachEvents() {
    elements.search.addEventListener("input", () => { state.search = elements.search.value.slice(0, 120); applyFilters(); });
    document.querySelectorAll('input[name="family"], input[name="appearance"]').forEach((input) => input.addEventListener("change", () => { state[input.name] = input.value; applyFilters(); }));
    document.querySelectorAll('input[name="language"]').forEach((input) => input.addEventListener("change", () => { state.language = input.value; renderCode(state.selected); }));
    elements.select.addEventListener("change", () => selectTheme(elements.select.value));
    byId("clear-filters").addEventListener("click", clearFilters);
    byId("download-theme").addEventListener("click", downloadTheme);
  }
  async function initialize() {
    try {
      const response = await fetch("./themes.json", { credentials: "omit" });
      if (!response.ok) throw new Error("Theme data could not be loaded.");
      const data = await response.json();
      if (!Array.isArray(data.themes) || !data.themes.length || !Array.isArray(data.families)) throw new Error("The theme catalog is empty or unavailable.");
      state.themes = data.themes.filter((theme) => theme && typeof theme.id === "string" && typeof theme.name === "string" && theme.style && theme.sourceDocument).sort((a, b) => a.name.localeCompare(b.name));
      state.families = data.families;
      if (!state.themes.length) throw new Error("The theme catalog is empty or unavailable.");
      state.selected = state.themes.find((theme) => theme.id === "anime-gothic-dhl") || state.themes.find((theme) => theme.family === "anime-gothic") || state.themes[0];
      byId("total-themes").textContent = String(state.themes.length);
      attachEvents();
      applyFilters();
      document.querySelectorAll('.filter-panel input, .filter-panel button').forEach((control) => { control.disabled = false; });
      byId("gallery-workspace").hidden = false;
    } catch (error) {
      elements.status.textContent = "The theme catalog could not be loaded. Please reload the page, or use the Repository link to explore the source files.";
      elements.status.classList.add("error-message");
      console.error("Theme gallery failed to load:", error instanceof Error ? error.message : "Unknown error");
    }
  }
  initialize();
})();
