# Iceland Coffee — cinematic landing page

Next.js 14 · TypeScript · Tailwind 3 · GSAP + ScrollTrigger · Lenis · next/image

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start   # production (use this to judge scroll smoothness)
```

## Your content
- `src/lib/site.ts` — name, domain, address, opening hours, social links (used everywhere).
- `src/lib/data.ts` — menu items/prices and the hero price card.
- `public/images/` — replace placeholders with real photos using the **same filenames** (no code changes):
  `hero-bag`, `hero-cup`, `roast-bag`, `roast-cup`, `iced-coffee`, `espresso`, `latte`, `cinnamon-roll`, `receipt-cup`, `matcha-cake` (all `.webp`).
  `logo-mark.png` is the white logo emblem used by the loader; `src/app/icon.png`, `apple-icon.png`, `opengraph-image.png` are the favicon/share images.

## Structure
- `components/Experience.tsx` — page shell, Lenis (desktop) + ScrollTrigger sync
- `components/scenes/*` and `components/Scenes.tsx` — the 8 scenes · `Footer.tsx` · `Nav.tsx` · `Loader.tsx`
- `components/useScene.ts` — shared motion attributes: `data-speed`, `data-rise`, `data-lines`, `data-words`, `data-type`, `data-wipe`
- Brand blue `#3E7CB8` (from the logo); deep blues in `globals.css` / scenes. Fonts: `src/fonts/*.woff2`.
