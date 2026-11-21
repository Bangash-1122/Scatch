# Scatch — Storefront (React 19 + Vite + Three.js)

Interactive luxury-bag storefront with a real-time 3D product studio, Zustand state,
strict TypeScript, Tailwind CSS v4 design tokens and a Vitest suite.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server on `http://localhost:5173` (proxies `/api` to the backend on `:8000`) |
| `npm run build` | Type-checks both projects, then builds a compressed production bundle |
| `npm run typecheck` | `tsc --noEmit` for the app and the build configs |
| `npm run lint` | ESLint (flat config, React hooks rules) |
| `npm test` | Vitest run (jsdom + Testing Library) |
| `npm run test:coverage` | Vitest with V8 coverage |
| `npm run preview` | Serve the production build locally |

## Structure

```
src/
  api/                 # (reserved) typed HTTP helpers
  components/
    3d/                # Three.js surfaces + capability gates
      BagMesh.tsx      #   procedural bag: materials, straps, brass hardware, animation
      ProductViewer.tsx#   interactive viewer (orbit, shadows, sparkles, quality tiers)
      HeroScene.tsx    #   ambient hero scene
      ProductViewerModal.tsx  # full 3D product dialog
      SceneFallback.tsx#   static image fallback (no WebGL / reduced motion)
      lazy.ts          #   code-split entry points + intent prefetch
    ui/                # design-system primitives (Button, Badge, Modal, Spinner, …)
    Header/ Footer/ Layout/
  data/products.ts     # demo catalog used until the API responds
  hooks/               # use3DSupport, useDevicePerformance, useReducedMotion, useInView
  lib/                 # cn(), price formatting, color math
  pages/               # route-level screens
  routes/              # lazy routes + ProtectedRoute
  store/useStore.ts    # Zustand store (persisted: user, cart, products, orders)
  styles/design-tokens.css
```

## 3D system

- **No external model assets required.** `BagMesh` is built from primitives and recolours
  from each product's `bgColor` / `panelColor`, so every catalog item has a 3D preview.
- **Progressive enhancement.** `use3DSupport()` checks WebGL, CPU/GPU tier and
  `prefers-reduced-motion`. Unsupported devices get `SceneFallback` (the product photo).
- **Quality tiers.** High tier enables shadows, environment light formers and 2× DPR;
  medium trims particles and DPR; low never mounts a canvas.
- **Bundle isolation.** Three.js lives in a lazy chunk (`vendor-three`, ~280 kB gzip)
  that downloads only when a 3D surface mounts or the shopper hovers a “3D” button.
- **Scene lifecycle.** Geometries/materials are disposed on unmount; `ContactShadows`
  freezes after the first frame on non-high tiers.

To swap in a photoreal asset later, add `modelUrl` to a product and render a
`useGLTF` model inside `ProductViewer`; the fallback and capability plumbing already
handle the rest.

## Environment

Create `.env.local` when the API is not on the default origin:

```
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

The store falls back to local demo data and offline auth only when the backend is
unreachable. **Note:** the demo seeds a logged-in admin so the dashboard can be
reviewed; remove `DEMO_ADMIN` in `src/store/useStore.ts` before shipping.
