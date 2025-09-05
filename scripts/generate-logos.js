// scripts/generate-logos.js
// Gera logos e favicons a partir de um PNG mestre (transparente).

const sharp = require("sharp");
const fs = require("fs-extra");
const path = require("path");

/**
 * CONFIGURE AQUI:
 * Coloque seu PNG mestre (transparente, bem grande) nesse caminho.
 * Sugestão: public/assets/brand/logo-master.png
 */
const MASTER = path.resolve("public/assets/brand/logo-master.png");

// Saídas
const OUT_DIR = path.resolve("public/assets/icons");
const files = {
  // tamanhos quadrados usuais (em px)
  squares: [1024, 512, 192, 180, 152, 128, 64, 32, 16],
  // imagem social (Open Graph / WhatsApp / LinkedIn)
  og: { w: 1200, h: 630, file: "og-image.png" },
};

(async () => {
  try {
    if (!fs.existsSync(MASTER)) {
      console.error(`❌ Arquivo mestre não encontrado:\n${MASTER}`);
      console.error(
        "Crie a pasta public/assets/brand e salve seu logo como logo-master.png"
      );
      process.exit(1);
    }

    await fs.ensureDir(OUT_DIR);

    // Gera quadrados com “contain” e fundo transparente
    for (const size of files.squares) {
      const out = path.join(OUT_DIR, `logo-${size}.png`);
      await sharp(MASTER)
        .resize({
          width: size,
          height: size,
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 }, // mantém alpha
        })
        .png({ compressionLevel: 9 })
        .toFile(out);
      console.log(`✅ ${path.relative(process.cwd(), out)}`);
    }

    // Gera uma cópia “principal” em alta (bom pra hero/seções)
    const main = path.join(OUT_DIR, "logo-2048.png");
    await sharp(MASTER)
      .resize({ width: 2048, fit: "inside", withoutEnlargement: true })
      .png({ compressionLevel: 9 })
      .toFile(main);
    console.log(`✅ ${path.relative(process.cwd(), main)}`);

    // Gera OG 1200x630 com background escuro (para redes)
    const ogOut = path.join(OUT_DIR, files.og.file);
    const ogBg = { r: 7, g: 8, b: 10, alpha: 1 }; // #07080A
    const logoBuffer = await sharp(MASTER)
      .resize({ height: Math.round(files.og.h * 0.6), fit: "inside" })
      .png()
      .toBuffer();

    const composite = await sharp({
      create: {
        width: files.og.w,
        height: files.og.h,
        channels: 4,
        background: ogBg,
      },
    })
      .png()
      .composite([
        {
          input: logoBuffer,
          gravity: "center", // centraliza logo
        },
      ])
      .toFile(ogOut);
    console.log(`✅ ${path.relative(process.cwd(), ogOut)}`);

    console.log("\n🎉 Pronto! Logos geradas em public/assets/icons/");
    console.log("   Substitua referências no HTML/manifest se quiser usar os PNGs.");
  } catch (err) {
    console.error("Erro ao gerar logos:", err);
    process.exit(1);
  }
})();
