/* Gera versões da logo (PNG/WebP) + atualiza manifest */
const fs = require("fs-extra");
const path = require("path");
const sharp = require("sharp");

const SRC = {
  hero: "brand/logo-hero.png",
  flat: "brand/logo-clean-flat.png",
  reflex: "brand/logo-clean-reflex.png",
};
const OUT = "public/assets/logos";

async function ensure() {
  await fs.ensureDir(OUT);
}

async function copyHero() {
  const dst = path.join(OUT, "logo-hero.png");
  await fs.copy(SRC.hero, dst);
  console.log("✔", dst);
}

async function makeVariants(name, src) {
  const bases = [256, 512, 1024];
  // PNG base
  const pngBase = path.join(OUT, `${name}.png`);
  await sharp(src).png({ quality: 92 }).toFile(pngBase);
  console.log("✔", pngBase);

  for (const size of bases) {
    const p = path.join(OUT, `${name}-${size}.png`);
    await sharp(src).resize(size).png({ quality: 92 }).toFile(p);
    console.log("✔", p);

    const w = path.join(OUT, `${name}-${size}.webp`);
    await sharp(src).resize(size).webp({ quality: 88 }).toFile(w);
    console.log("✔", w);
  }
}

async function faviconAndApple() {
  const fav = path.join(OUT, "favicon-512.png");
  const apple = path.join(OUT, "apple-touch-icon.png");

  await sharp(SRC.flat).resize(512).png({ quality: 92 }).toFile(fav);
  console.log("✔", fav);

  await sharp(SRC.flat).resize(180).png({ quality: 92 }).toFile(apple);
  console.log("✔", apple);
}

async function updateManifest() {
  const mfPath = "public/manifest.webmanifest";
  let manifest = {};
  if (await fs.pathExists(mfPath)) {
    try {
      manifest = JSON.parse(await fs.readFile(mfPath, "utf8"));
    } catch {}
  }
  manifest.name = manifest.name || "Muniz Studio X";
  manifest.short_name = manifest.short_name || "MSX";
  manifest.start_url = "/";
  manifest.display = "standalone";
  manifest.background_color = "#0F172A";
  manifest.theme_color = "#0F172A";
  manifest.icons = [
    { src: "/assets/logos/favicon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
    { src: "/assets/logos/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
  ];
  await fs.writeFile(mfPath, JSON.stringify(manifest, null, 2));
  console.log("✎ manifest.webmanifest atualizado com ícones");
}

(async () => {
  await ensure();
  await copyHero();
  await makeVariants("logo-flat", SRC.flat);
  await makeVariants("logo-reflex", SRC.reflex);
  await faviconAndApple();
  await updateManifest();
  console.log("\n✅ Logos geradas em public/assets/logos\n");
})();
