// Storehouse Fine Arts — the build.
//
// The copy and photographs live in content/*.yml, which Fred edits through
// Pages CMS (see .pages.yml). The page templates are in src/. Eleventy reads
// the one into the other and writes the finished site to _site/, which is what
// GitHub Pages publishes. The CSS, the script and the fonts are copied across
// untouched.

import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import Image from "@11ty/eleventy-img";

const CONTENT = "content";
// Each photograph is made at these widths and the browser picks the one that
// suits the screen: the slideshows show a landscape photograph across most of
// the page, which wants the larger size on a sharp screen.
const PHOTO_WIDTHS = [800, 1600, 2400];

// The site's own five pages, in Fred's order. Structure, not content: changing
// these means changing the design, so they are not in the editor.
const NAV = [
  { href: "/storage", n: "01", label: "Storage" },
  { href: "/transport-and-handling", n: "02", label: "Transport &amp; Handling" },
  { href: "/services", n: "03", label: "Additional Services" },
  { href: "/about", n: "04", label: "About" },
  { href: "/contact", n: "05", label: "Contact" },
];

/* --------------------------------------------------------------- text */

const escapeHtml = (s) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const escapeAttr = (s) => escapeHtml(s).replace(/"/g, "&quot;");

// For prose that ends up in an attribute — a photograph's description or
// caption — with the same typographic quotes as the copy.
const typesetAttr = (s) => escapeAttr(smart(String(s ?? "").trim()));

// Straight quotes typed into the editor become typographic ones, so the copy
// reads the same whoever wrote it: it's → it’s, "word" → “word”.
const smart = (s) =>
  String(s ?? "")
    .replace(/(\w)'(\w)/g, "$1’$2")
    .replace(/(^|[\s([“—–-])'/g, "$1‘")
    .replace(/'/g, "’")
    .replace(/(^|[\s([‘—–-])"/g, "$1“")
    .replace(/"/g, "”");

const typeset = (s) => escapeHtml(smart(String(s ?? "").trim()));

// Paragraphs are separated by a blank line in the editor.
const paragraphs = (s) =>
  String(s ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);

// The text of a section, as the editor holds it, into markup. Kept deliberately
// small so it can be explained in two lines in the editor:
//   - a line starting "- " is a bullet; consecutive bullets make one list
//     (blank lines between them are fine)
//   - a line starting "1. " (any number) is a numbered step, the same way
//   - a short line on its own, directly above its paragraph, is a subheading
//   - anything else is a paragraph; a blank line starts a new one
// In a bullet or step that opens with a few words and a full stop — "Arrival.
// Works are checked in…" — those words are picked out, so a list reads as a
// set of answers at a glance.
const BULLET = /^\s*[-–•]\s+/;
const STEP = /^\s*\d+[.)]\s+/;
const leadIn = (item) => {
  const m = item.match(/^([^.:]{1,60}?[.:])\s+(\S[\s\S]*)$/);
  if (m && m[1].trim().split(/\s+/).length <= 6) {
    return `<span class="lead-in">${typeset(m[1])}</span> ${typeset(m[2])}`;
  }
  return typeset(item);
};
const blocks = (s) => {
  const lines = String(s ?? "").replace(/\r/g, "").split("\n");
  const out = [];
  let para = [];
  let list = null; // { tag, items }
  const flushPara = () => {
    if (!para.length) return;
    const first = para[0].trim();
    if (para.length > 1 && first.split(/\s+/).length <= 6 && first.length <= 60) {
      out.push(`<h4 class="subhead">${typeset(first.replace(/[.:]$/, ""))}</h4>`);
      para = para.slice(1);
    }
    out.push(`<p>${typeset(para.join(" ").replace(/\s+/g, " "))}</p>`);
    para = [];
  };
  const flushList = () => {
    if (!list) return;
    out.push(`<${list.tag}>` + list.items.map((i) => `<li>${leadIn(i)}</li>`).join("") + `</${list.tag}>`);
    list = null;
  };
  for (const raw of lines) {
    const line = raw.trim();
    const kind = BULLET.test(line) ? "ul" : STEP.test(line) ? "ol" : null;
    if (!line) { flushPara(); continue; }
    if (kind) {
      flushPara();
      if (list && list.tag !== kind) flushList();
      if (!list) list = { tag: kind, items: [] };
      list.items.push(line.replace(kind === "ul" ? BULLET : STEP, ""));
      continue;
    }
    // A line that is not part of a list ends any list above it — unless it
    // simply continues the last item (a long bullet wrapped onto two lines).
    if (list && para.length === 0 && raw.startsWith("  ")) { list.items[list.items.length - 1] += " " + line; continue; }
    flushList();
    para.push(line);
  }
  flushPara();
  flushList();
  return out;
};

const mailto = (email, subject) =>
  "mailto:" + email + (subject ? "?subject=" + encodeURIComponent(subject) : "");

/* ------------------------------------------------------------- photos */

// Every photograph named in the content is resized once per build to WebPs at
// PHOTO_WIDTHS (never wider than the original), so a 20MB camera file uploaded
// through the editor is served at a sensible size. A photograph that cannot be found is left out
// (or cannot be read) with a warning rather than stopping the build.
async function processPhotos() {
  const wanted = new Set();
  const collect = (node) => {
    if (typeof node === "string" && node.startsWith("/assets/img/photos/")) wanted.add(node);
    else if (Array.isArray(node)) node.forEach(collect);
    else if (node && typeof node === "object") Object.values(node).forEach(collect);
  };
  for (const file of fs.readdirSync(CONTENT).filter((f) => f.endsWith(".yml"))) {
    collect(yaml.load(fs.readFileSync(path.join(CONTENT, file), "utf8")));
  }
  const map = {};
  for (const ref of wanted) {
    const local = ref.replace(/^\//, "");
    if (!fs.existsSync(local)) {
      console.warn(`[photos] ${ref} is named in the content but is not in the repository — left out`);
      continue;
    }
    try {
      const meta = await Image(local, {
        widths: PHOTO_WIDTHS,
        formats: ["webp"],
        outputDir: "_site/assets/img/photos/",
        urlPath: "/assets/img/photos/",
        sharpWebpOptions: { quality: 80 },
        // The original name, so the files stay recognisable, plus Eleventy's
        // hash of the source, so photo.jpg and photo.png never collide.
        filenameFormat: (id, src, width, format) => `${path.parse(src).name}-${id}-${width}.${format}`,
      });
      const sizes = meta.webp;
      const out = sizes[sizes.length - 1];
      map[ref] = {
        url: out.url, width: out.width, height: out.height,
        srcset: sizes.map((v) => `${v.url} ${v.width}w`).join(", "),
      };
    } catch (err) {
      console.warn(`[photos] ${ref} could not be read as an image (${err.message}) — left out`);
    }
  }
  return map;
}

/* -------------------------------------------------------------- config */

export default function (eleventyConfig) {
  eleventyConfig.addDataExtension("yml", (contents) => yaml.load(contents));
  eleventyConfig.addGlobalData("nav", NAV);
  eleventyConfig.addGlobalData("photos", processPhotos);

  eleventyConfig.addFilter("esc", escapeHtml);
  eleventyConfig.addFilter("attr", typesetAttr);
  eleventyConfig.addFilter("typeset", typeset);
  eleventyConfig.addFilter("paragraphs", paragraphs);
  eleventyConfig.addFilter("blocks", blocks);
  eleventyConfig.addFilter("mailto", (subject, email) => escapeAttr(mailto(email, subject)));
  eleventyConfig.addFilter("lines", (s) => String(s ?? "").trim().split(/\n+/).map((l) => typeset(l)).join("<br>\n          "));
  // "Follow us on Instagram for…" — the word Instagram becomes the link.
  eleventyConfig.addFilter("instagramLink", (s, url) =>
    typeset(s).replace("Instagram", `<a href="${escapeAttr(url)}" rel="noopener">Instagram</a>`));

  for (const p of [
    "assets/css", "assets/js", "assets/fonts", "assets/brand", "assets/img/journey",
    "assets/img/og-1600.webp", "robots.txt", "sitemap.xml",
    "storage-and-handling.html", "exhibition-services.html", "collection-management.html",
  ]) eleventyConfig.addPassthroughCopy({ [p]: p });

  eleventyConfig.addWatchTarget(CONTENT);

  return {
    dir: { input: "src", includes: "_includes", data: "../content", output: "_site" },
    templateFormats: ["njk"],
    htmlTemplateEngine: "njk",
  };
}

// Exported for testing the formatting rules on their own.
export { blocks };
