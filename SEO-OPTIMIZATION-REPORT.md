# Informe de Optimización SEO — Arias & Asociados
**Angular 16 + SSR + Dokploy**  
Fecha: 2026-06-26

---

## Puntuación SEO Actual: 4/10

| Categoría | Puntuación | Estado |
|-----------|-----------|--------|
| SSR / Rendimiento | 0/10 | ❌ CSR puro |
| Meta Tags | 5/10 | ⚠️ Parcial |
| Datos Estructurados | 3/10 | ⚠️ Solo home |
| Imágenes | 4/10 | ⚠️ 48+ alt vacíos |
| Rutas / Lazy Load | 7/10 | ✓ Mayoría lazy |
| Sitemap / Robots | 5/10 | ⚠️ Blog bloqueado |
| URLs Canónicas | 2/10 | ❌ Solo estática |
| Core Web Vitals | 6/10 | ⚠️ CSR afecta LCP |
| Indexabilidad | 3/10 | ❌ Blog bloqueado |
| Internacionalización | 8/10 | ✓ ngx-translate OK |

---

## Problemas Críticos

### 1. Sin SSR — App es 100% Client-Side Rendered
Google necesita ejecutar JavaScript para ver el contenido. Crawl lento, penalización en rankings.

### 2. Blog bloqueado en robots.txt
```
# Estado actual (robots.txt) — INCORRECTO
Disallow: /blog/
Disallow: /entrada/
Disallow: /blog-details/
```
Todo el contenido del blog es invisible para Google.

### 3. Meta tags faltantes en páginas clave
| Componente | Title | Meta Description | Estado |
|------------|-------|-----------------|--------|
| home | ✓ | ✓ | OK |
| servicios | ✓ | ✓ | OK |
| asuto-contable | ✓ | ✓ | OK |
| asuto-juridico | ✓ | ✓ | OK |
| asuto-tributario | ✓ | ✓ | OK |
| revisoria-fiscal | ✓ | ✓ | OK |
| certificados | ✓ | ✓ | OK |
| **blog** | ❌ | ❌ | FALTA |
| **detalle-blog** | ❌ | ❌ | FALTA |
| **contacto** | ❌ | ❌ | FALTA |
| **entrada** | ❌ | ❌ | FALTA |

### 4. 48+ atributos alt="" vacíos
Logo del header, banners, iconos descriptivos sin alt text.

### 5. URLs canónicas estáticas
Solo existe una canonical URL global (`/home`). Cada página necesita su propia URL canónica dinámica.

---

## Plan de Implementación SSR con Angular Universal

### Paso 1 — Instalar dependencias SSR

```bash
ng add @nguniversal/express-engine
```

Esto genera automáticamente:
- `src/main.server.ts`
- `src/app/app.server.module.ts`
- `src/server.ts`
- Actualiza `angular.json` con builder de servidor
- Agrega scripts npm necesarios

### Paso 2 — Scripts npm resultantes

```json
{
  "scripts": {
    "dev:ssr": "ng run arias2024:serve-ssr",
    "serve:ssr": "node dist/arias2024/server/main.js",
    "build:ssr": "ng build && ng run arias2024:server",
    "prerender": "ng run arias2024:prerender"
  }
}
```

### Paso 3 — app.server.module.ts (verificar)

```typescript
import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { AppModule } from './app.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
```

### Paso 4 — Agregar TransferState para HTTP

```typescript
// app.module.ts — modificar imports
import { BrowserTransferStateModule } from '@angular/platform-browser';
import { TransferHttpCacheModule } from '@nguniversal/common';

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'arias-app' }),
    BrowserTransferStateModule,
    TransferHttpCacheModule,
    // ... resto de imports
  ]
})
```

### Paso 5 — Prevenir errores browser-only en SSR

```typescript
// En componentes con jQuery/slick carousels:
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';

constructor(
  @Inject(PLATFORM_ID) private platformId: Object
) {}

ngAfterViewInit() {
  if (isPlatformBrowser(this.platformId)) {
    // Código jQuery aquí — solo se ejecuta en browser
    ($('.slick-slider') as any).slick({...});
  }
}
```

> **IMPORTANTE:** Todo código que use `window`, `document`, `localStorage`, o jQuery DEBE estar envuelto en `isPlatformBrowser()`.

---

## Correcciones SEO Sin SSR (Prioridad Alta)

### Fix 1 — robots.txt

```
# robots.txt corregido
User-agent: *
Disallow: /admin/
Disallow: /confidential/
Disallow: /temp/
Allow: /blog/
Allow: /blog-details/
Allow: /assets/js/
Allow: /assets/images/
Sitemap: https://ariasyasociados.co/sitemap.xml
```

### Fix 2 — Meta tags en blog.component.ts

```typescript
import { Title, Meta } from '@angular/platform-browser';

constructor(
  private titleService: Title,
  private metaService: Meta
) {}

ngOnInit() {
  this.titleService.setTitle('Blog | Noticias Contables y Jurídicas — Arias & Asociados');
  this.metaService.updateTag({
    name: 'description',
    content: 'Artículos sobre asesoría contable, tributaria y jurídica. Mantente informado con Arias & Asociados.'
  });
  this.metaService.updateTag({ property: 'og:title', content: 'Blog — Arias & Asociados' });
  this.metaService.updateTag({ property: 'og:url', content: 'https://ariasyasociados.co/blog' });
}
```

### Fix 3 — Meta tags dinámicos en detalle-blog.component.ts

```typescript
// Cuando carga el post del API:
loadPost(id: string) {
  this.blogService.getPost(id).subscribe(post => {
    this.post = post;
    this.titleService.setTitle(`${post.title} — Arias & Asociados`);
    this.metaService.updateTag({ name: 'description', content: post.excerpt });
    this.metaService.updateTag({ property: 'og:title', content: post.title });
    this.metaService.updateTag({ property: 'og:description', content: post.excerpt });
    this.metaService.updateTag({ property: 'og:url', content: `https://ariasyasociados.co/blog-details/${id}` });
    this.metaService.updateTag({ property: 'og:image', content: post.image });
    this.setCanonical(`https://ariasyasociados.co/blog-details/${id}`);
    this.setBlogSchema(post);
  });
}
```

### Fix 4 — URLs canónicas dinámicas

```typescript
// Crear servicio: src/app/services/seo.service.ts
import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(
    @Inject(DOCUMENT) private doc: Document,
    private meta: Meta,
    private title: Title
  ) {}

  setCanonical(url: string) {
    let link = this.doc.querySelector("link[rel='canonical']");
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  setPage(config: { title: string; description: string; url: string; image?: string }) {
    this.title.setTitle(config.title);
    this.meta.updateTag({ name: 'description', content: config.description });
    this.meta.updateTag({ property: 'og:title', content: config.title });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:url', content: config.url });
    if (config.image) this.meta.updateTag({ property: 'og:image', content: config.image });
    this.setCanonical(config.url);
  }
}
```

### Fix 5 — Schema.org dinámico para posts

```typescript
// En detalle-blog.component.ts
setBlogSchema(post: any) {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "datePublished": post.created_at,
    "dateModified": post.updated_at,
    "author": {
      "@type": "Organization",
      "name": "Arias & Asociados"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Arias & Asociados",
      "logo": {
        "@type": "ImageObject",
        "url": "https://ariasyasociados.co/assets/images/logo/logo.png"
      }
    },
    "image": post.image,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://ariasyasociados.co/blog-details/${post.id}`
    }
  });
  document.head.appendChild(script);
}
```

### Fix 6 — Alt texts críticos

```html
<!-- header.component.html — logo -->
<img src="assets/images/logo/logo.png" alt="Arias & Asociados — Asesoría Contable y Jurídica">

<!-- home.component.html — banner -->
<img src="assets/images/banners/banner.jpg" alt="Servicios de Asesoría Contable y Jurídica en Colombia">
```

---

## Despliegue en Dokploy

### Arquitectura recomendada

```
Dokploy
  └── Servicio: arias-web
        ├── Tipo: Docker (Node.js)
        ├── Build: ng build:ssr → dist/arias2024/
        └── Runtime: node dist/arias2024/server/main.js
```

### Dockerfile

```dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build:ssr

# Stage 2: Runtime
FROM node:18-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/dist/arias2024 ./dist/arias2024
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 4000
CMD ["node", "dist/arias2024/server/main.js"]
```

### Variables de entorno en Dokploy

```env
NODE_ENV=production
PORT=4000
```

### Configurar puerto en server.ts

```typescript
// src/server.ts — verificar que respeta PORT env
const PORT = process.env['PORT'] || 4000;
app.listen(PORT, () => {
  console.log(`Node Express server listening on http://localhost:${PORT}`);
});
```

### Dokploy — configuración del servicio

1. **Tipo:** Docker Compose o App directa con Dockerfile
2. **Puerto interno:** 4000
3. **Puerto externo:** 443 (Traefik/Nginx reverse proxy)
4. **Health check:** GET `/` → HTTP 200
5. **Dominio:** ariasyasociados.co (configurar en Dokploy → Domains)
6. **SSL:** Let's Encrypt automático en Dokploy

### docker-compose.yml para Dokploy

```yaml
version: '3.8'
services:
  arias-web:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=production
      - PORT=4000
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:4000/"]
      interval: 30s
      timeout: 10s
      retries: 3
```

---

## Pre-rendering para páginas estáticas (opcional pero recomendado)

Angular Universal permite pre-renderizar rutas estáticas en build time:

```json
// angular.json — agregar sección prerender
"prerender": {
  "builder": "@nguniversal/builders:prerender",
  "options": {
    "routes": [
      "/home",
      "/servicios",
      "/servicios-contables",
      "/servicios-juridicos",
      "/servicios-tributarios",
      "/revisoria-fiscal",
      "/contacto",
      "/blog"
    ]
  }
}
```

Ventaja: estas rutas se sirven como HTML estático desde Dokploy/Nginx → carga instantánea.

---

## Orden de implementación recomendado

### Semana 1 — Sin SSR (impacto inmediato)
- [ ] Fix robots.txt — desbloquear blog
- [ ] Agregar Title/Meta a blog, detalle-blog, contacto
- [ ] Fix 48+ alt texts vacíos
- [ ] Implementar SeoService con canonicals dinámicos
- [ ] Actualizar sitemap.xml con rutas del blog

### Semana 2-3 — SSR
- [ ] `ng add @nguniversal/express-engine`
- [ ] Envolver todo código jQuery con `isPlatformBrowser()`
- [ ] Probar localmente con `npm run dev:ssr`
- [ ] Crear Dockerfile
- [ ] Desplegar en Dokploy

### Semana 4 — Optimización avanzada
- [ ] Agregar schema.org BlogPosting en detalle-blog
- [ ] Implementar pre-rendering para rutas estáticas
- [ ] Optimizar Core Web Vitals (LCP, CLS, FID)
- [ ] Configurar Google Search Console con nuevo sitemap

---

## Puntuación SEO esperada después de implementación

| Fase | Puntuación Estimada |
|------|-------------------|
| Actual | 4/10 |
| Después Semana 1 (fixes sin SSR) | 6/10 |
| Después SSR completo | 8/10 |
| Después pre-rendering + schema dinámico | 9/10 |
