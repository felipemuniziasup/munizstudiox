// scripts/generate-logos.js
const sharp = require("sharp");
const fs = require("fs-extra");
const path = require("path");

const ROOT = process.cwd();
const BRAND_DIR = path.join(ROOT, "brand");
const OUT_DIR = path.join(ROOT, "public", "assets", "logos");
const PUBLIC_DIR = path.join(ROOT, "public");
const MANIFEST = path.join(PUBLIC_DIR, "manifest.webmanifest");

// helpers
const ensure = async (p) => fs.ensureDir(p);
const exists = (p) => fs.pathExists(p);

const sources = {
  hero: path.join(BRAND_DIR, "logo-hero.png"),
  flat: path.join(BRAND_DIR, "logo-clean-flat.png"),
  reflex: path.join(BRAND_DIR, "logo-clean-reflex.png"),
};

const sizes = [256, 512, 1024];

async function saveSharp(input, outPath, ops) {
  await sharp(input).resize(ops).toFile(outPath);
  console.log("✔", path.relative(ROOT, outPath));
}

async function copyIfExists(src, dst) {
  if (await exists(src)) {
    await fs.copy(src, dst);
    console.log("✔", path.relative(ROOT, dst));
  }
}

async function updateManifestWithIcons(baseIconPath) {
  // Atualiza manifest se existir
  if (!(await exists(MANIFEST))) return;

  const json = JSON.parse(await fs.readFile(MANIFEST, "utf8"));
  json.icons = json.icons || [];

  // Ícones comuns do PWA
  const iconsToAdd = [
    { src: "/assets/logos/favicon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    { src: "/assets/logos/apple-touch-icon.png", sizes: "180x180", type: "image/png", purpose: "any" },
  ];

  // Evita duplicar
  const existing = new Set(json.icons.map((i) => i.src));
  for (const icon of iconsToAdd) {
    if (!existing.has(icon.src)) json.icons.push(icon);
  }

  await fs.writeFile(MANIFEST, JSON.stringify(json, null, 2));
  console.log("✎ manifest.webmanifest atualizado com ícones");
}

async function run() {
  await ensure(OUT_DIR);

  // 1) HERO (mantém composição)
  if (await exists(sources.hero)) {
    await copyIfExists(sources.hero, path.join(OUT_DIR, "logo-hero.png"));
  } else {
    console.warn("! brand/logo-hero.png não encontrado (opcional)");
  }

  // 2) FLAT e REFLEX (variações e tamanhos)
  for (const [key, src] of Object.entries({ flat: sources.flat, reflex: sources.reflex })) {
    if (!(await exists(src))) {
      console.warn(`! ${path.relative(ROOT, src)} não encontrado`);
      continue;
    }
    // base sem redimensionar (safe copy)
    await copyIfExists(src, path.join(OUT_DIR, `logo-${key}.png`));

    for (const size of sizes) {
      await saveSharp(src, path.join(OUT_DIR, `logo-${key}-${size}.png`), {
        width: size,
        withoutEnlargement: true,
      });
      await sharp(src)
        .resize({ width: size, withoutEnlargement: true })
        .webp({ quality: 90 })
        .toFile(path.join(OUT_DIR, `logo-${key}-${size}.webp`));
      console.log("✔", path.join("public/assets/logos", `logo-${key}-${size}.webp`));
    }
  }

  // 3) Favicon e Apple Touch (pega flat>reflex>hero como fallback)
  const baseForIcon =
    (await exists(sources.flat)) ? sources.flat :
    (await exists(sources.reflex)) ? sources.reflex :
    (await exists(sources.hero)) ? sources.hero :
    null;

  if (baseForIcon) {
    await saveSharp(baseForIcon, path.join(OUT_DIR, "apple-touch-icon.png"), {
      width: 180, height: 180, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 }
    });
    await saveSharp(baseForIcon, path.join(OUT_DIR, "favicon-512.png"), {
      width: 512, height: 512, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 }
    });
    await updateManifestWithIcons();
  } else {
    console.warn("! Nenhum arquivo base encontrado para ícones (flat/reflex/hero)");
  }

  console.log("\n✅ Logos geradas em public/assets/logos");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
