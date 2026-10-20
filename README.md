# ESTÉTICA GUION — Demo premium de estética y cosmética

Demo web de nivel premium para un centro de estética y cosmética ficticio.
**React + TypeScript + Vite · Tailwind CSS · Framer Motion · Lucide · React Router.**

> ⚠️ **Sitio de demostración.** Marca, precios, productos, tratamientos,
> testimonios y datos de contacto son **ficticios**. No se realizan ventas,
> cobros ni reservas reales.

## ✨ Qué incluye

- **Portada premium**: hero editorial animado, carrusel con flechas/indicadores/
  gestos táctiles/reproducción opcional, destacados, tratamientos, testimonios
  ficticios, FAQ y CTA.
- **Tienda funcional**: 12 productos en JSON, categorías, búsqueda (ignora
  acentos), ordenación, filtro de stock, fichas con ingredientes/modo de uso.
- **Carrito demo**: lateral deslizable, cantidades, eliminar, subtotal, envío
  ficticio (gratis ≥ 60 €), confirmación simulada y persistencia local.
- **Tratamientos**: faciales y corporales con filtro por zona, acordeón de
  detalles y enlaces de reserva (demo).
- **Favoritos, contacto validado, 5 páginas legales DEMO, 404, SEO básico.**
- **Panel `/admin`** con login demo (`admin` / `admin`), CRUD de productos,
  categorías, tratamientos, textos e imágenes, búsqueda, validación,
  previsualización y restablecimiento de datos ejemplo.
- **Animaciones** con respeto a `prefers-reduced-motion`, focos visibles,
  skip-link, estados de carga, skeletons y vacíos.

## 🚀 Comandos

```bash
npm install   # instalar dependencias
npm run dev   # arrancar en local (http://localhost:5173)
npm run build # typecheck + build de producción → dist/
npm run preview # previsualizar la build
npm run lint  # ESLint
npm run test  # Vitest (30 pruebas)
```

## 🏗️ Arquitectura

```
src/
├── data/          # JSON: site, categories, products, treatments, testimonials,
│                  #        faq, slides, legal, image-licenses
├── lib/           # Lógica pura y testeada (cart, catalog, validation,
│                  #        storage, format, adminForms) + tipos
├── context/       # StoreContext (datos+overrides), CartContext,
│                  #        FavoritesContext
├── components/    # Header, Footer, Carousel, ProductCard, CartDrawer,
│                  #        LazyImage, Reveal, Toast, EmptyState, SectionHeading
├── pages/         # Home, Shop, Product, Treatments, Favorites, Contact,
│                  #        Legal, NotFound
├── pages/admin/   # Tabs del panel (productos, tratamientos, categorías,
│                  #        textos, imágenes)
└── test/          # setup + 6 suites de pruebas
```

- **Datos base** en `src/data/*.json`. El panel guarda *overrides* en
  `localStorage` (`eg:store:v1`) fusionados con la base (`mergeStore`).
- **Carrito** en `eg:cart:v1`, **favoritos** en `eg:favorites:v1`.
- Imágenes fotográficas en `public/images/` (Unsplash, licencia verificada y
  registrada en `image-licenses.json`); ilustraciones de producto generadas por
  `scripts/gen-product-images.mjs` como obra original del proyecto.

## ⚙️ Variables de entorno

Copia `.env.example` a `.env` si lo necesitas:

| Variable | Uso |
| --- | --- |
| `VITE_SITE_URL` | URL pública (canonical, sitemap) |
| `VITE_ENABLE_DEMO_ADMIN` | Activa el login demo en **producción** (`"true"`). En dev está activo por defecto. |

**Seguridad:** el login `admin/admin` es una barrera cosmética de demo, no
autenticación. En producción está desactivado por defecto. Nunca subas secretos
al frontend (solo se exponen variables `VITE_*`).

## 🧪 Limitaciones de la demo

- Sin backend: todo vive en `localStorage` de **cada navegador**; no hay
  sincronización entre usuarios ni dispositivos, ni base de datos compartida.
- Sin pagos ni envíos reales; el checkout es una confirmación simulada.
- Los textos legales son borradores marcados como DEMO: **revisión profesional
  obligatoria** antes de cualquier uso real.
- Fotografías: licencia Unsplash verificada; autores «no determinados» (la API
  exige clave) registrados honestamente en `image-licenses.json`.

## ☁️ Despliegue en Vercel

Configuración preparada (`vercel.json` con rewrites SPA):

1. En [vercel.com](https://vercel.com), **Add New → Project → Import** el
   repositorio `migueljosa7-svg/estetica-sl`.
2. Framework: **Vite** (detectado automáticamente).
3. Build Command: `npm run build` · Output: `dist` · Install: `npm install`.
4. (Opcional) Variable `VITE_SITE_URL` con tu dominio.
5. Deploy: cada push a `main` redespliega automáticamente.

> Nota: `vercel.json` redirige todas las rutas a `index.html` para que
> React Router funcione en producción.
