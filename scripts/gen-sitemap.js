// scripts/gen-sitemap.js
import { writeFile } from "fs/promises";

const BASE = "https://munizstudiox.com.br";
const now = new Date().toISOString();

const urls = [
  { loc: `${BASE}/`, changefreq: "weekly", priority: "1.0", lastmod: now }
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join("\n")}
</urlset>
`;

await writeFile("public/sitemap.xml", xml, "utf8");
console.log("✅ sitemap.xml atualizado");
