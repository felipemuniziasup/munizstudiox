/* Build estático: copia /public para /dist e minifica HTML/CSS/JS */
const fs = require("fs-extra");
const { glob } = require("glob");
const path = require("path");
const { minify: minifyHtml } = require("html-minifier-terser");
const csso = require("csso");
const terser = require("terser");

const SRC = "public";
const OUT = "dist";

async function copyAll() {
  await fs.remove(OUT);
  await fs.copy(SRC, OUT);
}

async function minifyCSS() {
  const files = await glob("**/*.css", { cwd: OUT, nodir: true });
  for (const rel of files) {
    const p = path.join(OUT, rel);
    const css = await fs.readFile(p, "utf8");
    const out = csso.minify(css).css;
    await fs.writeFile(p, out);
  }
}

async function minifyJS() {
  const files = await glob("**/*.js", { cwd: OUT, nodir: true });
  for (const rel of files) {
    const p = path.join(OUT, rel);
    const js = await fs.readFile(p, "utf8");
    const { code } = await terser.minify(js, {
      compress: true,
      mangle: true,
      ecma: 2020
    });
    if (code) await fs.writeFile(p, code);
  }
}

async function minifyHTML() {
  const files = await glob("**/*.html", { cwd: OUT, nodir: true });
  for (const rel of files) {
    const p = path.join(OUT, rel);
    const html = await fs.readFile(p, "utf8");
    const out = await minifyHtml(html, {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      useShortDoctype: true,
      minifyCSS: true,
      minifyJS: true
    });
    await fs.writeFile(p, out);
  }
}

(async () => {
  console.log("🚀 Iniciando build...");
  await copyAll();
  await minifyCSS();
  await minifyJS();
  await minifyHTML();
  console.log("✅ Build concluído!");
})();
