// scripts/optimize-images.js
const sharp = require("sharp");
const fs = require("fs-extra");
const path = require("path");

const ROOT = process.cwd();
const IMG_DIR = path.join(ROOT, "public", "assets", "img");

(async () => {
  if (!(await fs.pathExists(IMG_DIR))) {
    console.log("! public/assets/img não existe — nada para otimizar");
    return;
  }
  const files = (await fs.readdir(IMG_DIR))
    .filter(f => /\.(png|jpe?g)$/i.test(f));

  for (const file of files) {
    const src = path.join(IMG_DIR, file);
    const out = path.join(IMG_DIR, file.replace(/\.(png|jpe?g)$/i, ".webp"));

    await sharp(src).webp({ quality: 88 }).toFile(out);
    console.log("✔", path.relative(ROOT, out));
  }

  console.log("\n✅ Otimização concluída (WebP gerado ao lado dos originais)");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
