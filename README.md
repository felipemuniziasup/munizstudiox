# Muniz Studio X — Starter v1 (Criativo com “Luz”)

**Independente** dos projetos dos clientes. Pensado após a análise do *Mellofit* e *Nando Importados*: mantemos a pegada estática, reforçamos SEO (title/OG/robots/sitemap), conversão (CTA WA), performance (lazy) e organização (dados em `/data`).

## Estrutura
```
muniz-studio-x-starter-v1/
  public/
    index.html
    favicon.svg
    robots.txt
    sitemap.xml
    manifest.webmanifest
    sw.js
    assets/
      img/placeholder-1.svg ... 3
      icons/whatsapp.svg
  data/
    site.json           # telefone/instagram/e-mail/local — muda aqui q o site reflete
    portfolio.json      # lista de cards do portfólio
    testimonials.json   # depoimentos
  scripts/
    build.js            # placeholder (estático)
    optimize-images.js  # placeholder (otimização futura)
  .vscode/
    tasks.json          # Ctrl+Shift+B roda server dev
  .gitignore
  package.json          # npm run dev
  README.md
```

## Como rodar local (VS Code)
```bash
npm i -D http-server
npm run dev
# abre http://localhost:5173
```

## Como publicar no Cloudflare Pages (sem build)
1. Suba no **GitHub** (GitHub Desktop → Add Local Repo → Commit → Publish).
2. Cloudflare → **Pages** → *Create a project* → **Connect to Git**.
3. **Build**: Framework **None** · Build command: *(vazio)* · Output dir: **public**
4. Deploy → recebe URL `.pages.dev`. Depois conecte seu domínio.

## O que editar primeiro
- **/data/site.json** → `"phoneInternational": "55SEUNUMERO"`, `"instagram": "seuuser"`, `"email": "contato@seudominio.com"`
- **/data/portfolio.json** → troque os placeholders pelos seus cases (imagens em `/public/assets/img/`)
- **/data/testimonials.json** → depoimentos reais
- **/public/index.html** → revise textos (hero/planos) e, se quiser, fixe o número de WA direto nos hrefs

> O site busca dados do `/data/*.json` e injeta no HTML (CTA de WhatsApp, grid de portfólio e depoimentos).

## Boas práticas (observadas nos seus projetos e aplicadas aqui)
- WhatsApp como **canal central** (CTA flutuante + seções).
- HTML estático leve, ideal para **Cloudflare Pages**.
- **SEO**: title/description, OG, canonical, robots/sitemap.
- **Performance**: `loading="lazy"`; imagens SVG placeholder para você substituir por WebP.
- **Organização**: dados separados em `/data` (fácil de atualizar).

## Próximos passos (30/60/90 versão site)
- **30**: preencher dados, subir 3 cases, conectar domínio, GA4/Pixel.
- **60**: página de case individual (se precisar), banners sazonais, relatórios básicos.
- **90**: PWA (ativar `sw.js`), APK (WebView) e protótipo SaaS.


---

## Setup rápido — VS Code, GitHub e Cloudflare Pages

### 1) VS Code
- Instale as extensões recomendadas (Prettier e Tailwind CSS IntelliSense).
- **Ctrl+Shift+B** roda o servidor: `npm run dev` → http://localhost:5173

### 2) Git + GitHub
```bash
git init
git add .
git commit -m "chore: inicia starter criativo (Tailwind + Cloudflare Pages)"
git branch -M main
git remote add origin https://github.com/SEUUSER/muniz-studio-x.git
git push -u origin main
```
Ou use **GitHub Desktop** (Add local repo → Commit → Publish).

### 3) Cloudflare Pages (produção e previews)
1. Cloudflare → **Pages** → *Create a project* → **Connect to Git**.
2. Escolha o repositório.
3. Build:
   - Framework: **None**
   - Build command: *(vazio)*
   - Output dir: **public**
4. Deploy. A URL `*.pages.dev` estará ativa.
5. **Previews**: habilite para _Pull Requests_ (cada PR gera uma URL de preview).
6. **Custom Domain**: Pages → *Custom domains* → conecte `seu-dominio.com`.
7. **Headers**: já incluí `public/_headers` com segurança básica.
8. **404**: já incluí `public/404.html` para fallback.

### 4) Fluxo recomendado
- `main` = produção; `dev` = staging (opcional).
- Crie feature branches → abra **Pull Request** → preview da Pages → revise e **merge**.
- A Actions roda **check de links** nos PRs (arquivo `.github/workflows/link-check.yml`).

### 5) Onde editar conteúdo
- **/data/site.json** → telefone (DDI+DDD+Nº), instagram, e-mail.
- **/data/portfolio.json** → cards do portfólio (troque as imagens em `/public/assets/img/` por WebP/SVG).
- **/data/testimonials.json** → depoimentos.
- **/public/index.html** → textos, seções, esquema visual.

© 2025 Muniz Studio X
