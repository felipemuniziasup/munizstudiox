/* Sitemap simples (/ apenas) usando public/data/site.json quando existir */
const fs = require("fs-extra");

async function run() {
  let base = "https://munizstudiox.com.br";
  const siteJson = "public/data/site.json";
  if (await fs.pathExists(siteJson)) {
    try {
      const s = JSON.parse(await fs.readFile(siteJson, "utf8"));
      if (s.baseUrl) base = s.baseUrl.replace(/\/+$/, "");
    } catch {}
  }

  const lastmod = new Date().toISOString();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${base}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

  await fs.writeFile("public/sitemap.xml", xml.trim() + "\n");
  console.log("✅ sitemap.xml atualizado");
}

run();
