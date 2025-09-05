/* Converte PNG/JPG para WebP (lado a lado) dentro de public/ */
const fs = require("fs-extra");
const { glob } = require("glob");
const path = require("path");
const sharp = require("sharp");

const roots = ["public/assets/img", "public/assets/images", "public/img", "public/images"];

async function run() {
  for (const root of roots) {
    if (!(await fs.pathExists(root))) continue;

    const files = await glob("**/*.{png,jpg,jpeg}", { cwd: root, nodir: true });
    for (const rel of files) {
      const src = path.join(root, rel);
      const out = src.replace(/\.(png|jpe?g)$/i, ".webp");
      try {
        await sharp(src).webp({ quality: 84 }).toFile(out);
        console.log("✔", out);
      } catch (e) {
        console.warn("×", src, e.message);
      }
    }
  }
  console.log("\n✅ Otimização concluída (WebP gerado ao lado dos originais)\n");
}

run();
