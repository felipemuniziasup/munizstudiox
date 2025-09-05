// scripts/build.js
// Build do Muniz Studio X:
// - limpa dist
// - copia public -> dist
const fs = require("fs-extra");
const path = require("path");

const ROOT = process.cwd();
const DIST = path.join(ROOT, "dist");
const PUBLIC = path.join(ROOT, "public");

(async () => {
  try {
    console.log("🚀 Iniciando build...");
    await fs.remove(DIST);
    await fs.copy(PUBLIC, DIST);
    const logosDir = path.join(DIST, "assets", "logos");
    const manifest = path.join(DIST, "manifest.webmanifest");

    if (!fs.existsSync(logosDir)) {
      console.warn("⚠️ Logos não encontradas em dist/assets/logos. Rode: npm run logos");
    }
    if (!fs.existsSync(manifest)) {
      console.warn("⚠️ manifest.webmanifest ausente. O script de logos atualiza isso.");
    }
    console.log("✅ Build concluído!");
  } catch (e) {
    console.error("❌ Erro no build:", e);
    process.exit(1);
  }
})();
