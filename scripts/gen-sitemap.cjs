// scripts/gen-sitemap.cjs
const { writeFile } = require("fs/promises");
const path = require("path");

const BASE_URL = "https://munizstudiox.com.br";

async function generateSitemap() {
  const urls = [
    { loc: `${BASE_URL}/`, priority: 1.0 },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  const outPath = path.join(__dirname, "../public/sitemap.xml");
  await writeFile(outPath, xml, "utf8");
  console.log("✅ sitemap.xml atualizado");
}

generateSitemap().catch((err) => {
  console.error("❌ Erro ao gerar sitemap:", err);
  process.exit(1);
});
