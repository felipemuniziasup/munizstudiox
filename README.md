# 🌐 Muniz Studio X — Starter v1 (Criativo com “Luz”)

Starter pensado para **sites elegantes, modernos e objetivos**.  
Independente de clientes, serve como **base premium** para landing pages rápidas, otimizadas e com workflow de estúdio criativo.

- ✅ **Infra:** HTML estático leve + dados em JSON (`/data`)  
- ✅ **Deploy:** GitHub → Cloudflare Pages (produção + preview automático)  
- ✅ **Performance:** lazy load, SVG placeholders, estrutura limpa  
- ✅ **Conversão:** CTA central no WhatsApp  
- ✅ **SEO pronto:** title/description, OG, canonical, robots/sitemap  

---

## 🚀 Fluxo de Trabalho

- `main` = produção → [https://munizstudiox.com.br](https://munizstudiox.com.br)  
- `dev` = staging (Preview do Cloudflare Pages em cada PR)  
- **Workflow padrão:**  
  1. Trabalhar em branches (ex.: `dev` ou `feature/...`)  
  2. Abrir Pull Request → gera Preview URL automático  
  3. Revisar no PR → só então **merge para produção (`main`)**

### Atalhos no VS Code
- **Ctrl+Shift+B** → preview local (`npm run dev`)  
- **Run Task → Preview Cloud** → commit/push para `dev` e gera Preview URL  
- **Run Task → Abrir PR** → abre PR `dev → main` no GitHub  
- **Run Task → Publicar direto** → ⚠️ (opcional, não recomendado; pula PR)  

---

## 📦 Estrutura

