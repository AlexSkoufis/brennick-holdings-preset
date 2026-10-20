# Brennick Holding Company — Family Enterprise Preset

A monumental, editorial homepage for a **fictional** multi-generation family holding company in land, timber, energy and financial holdings. Limestone paper, deep forest and bronze; Cormorant Garamond + Newsreader + IBM Plex Mono, with a hairline survey-plat motif. Five generations unfold on a pinned horizontal timeline.

React 19 · TypeScript · Vite 8 · Tailwind CSS 4 · GSAP 3 (ScrollTrigger, Flip, SplitText) · Lenis · Lucide. No router: one homepage, anchor navigation only.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build into ./dist
npm run images     # rebuild WebP ladders from assets-src/photo (only if photos change)
```

## Sections

| # | Section | Anchor | Composition |
|---|---|---|---|
| 01 | Opening | `#top` | Asymmetric headline and photograph with an "Est." stamp, survey plat motif, three key facts, load choreography |
| 02 | The Passage of Time | `#heritage` | Pinned horizontal chronology with a year index (desktop); vertical sequence elsewhere. Each chapter tags its sources as family records, family archive or public record |
| 03 | Land. Energy. Enterprise. | `#holdings` | Split-screen tab index with a cinematic photo panel; accordion below 1024px |
| 04 | Continuity | `#continuity` | Solid bronze typographic interlude with scroll-driven emphasis |
| 05 | The Enterprise Network | `#enterprise` | Directory of operating companies with GSAP Flip rows |
| 06 | Leadership | `#leadership` | Magazine profile of the owner, focus facts, reading links and a newsroom item |
| 07 | The Next Chapter | `#contact` | Closing statement, magnetic contact button, office details |

## Re-skin

- **Copy & data**: everything is in `src/data/site.ts`: company and offices, opening facts, chapters (any number; the year index follows), holdings, companies, owner profile and closing. Page title and description are in `index.html`.
- **Monogram**: `src/components/Monogram.tsx` (initials in a surveyor's circle) and `public/favicon.svg`.
- **Photos**: drop JPEGs into `assets-src/photo/`, run `npm run images`, and reference them by file name (without extension) as `key` in `site.ts`. Credits live in `src/data/credits.ts` and show in the footer.
- **Colour & type**: tokens in `src/styles/index.css`.
- **Plat motif**: `src/components/PlatLines.tsx` (lot labels and bearings are decorative).

## Imagery

Landscape and archival photographs are public domain, CC0 or CC BY / BY-SA images from Wikimedia Commons; the owner portrait is an Unsplash silhouette. Each is captioned as illustrative and credited in the footer. Keep the credits for any CC BY or BY-SA image you retain.

## Motion and safety

- All animation runs in `useGSAP` / `gsap.matchMedia` scopes and reverts on unmount, gated on `prefers-reduced-motion: no-preference`.
- Text reveals split words only, with no overflow masks. Intro elements hide behind an `intro-pending` class with a 3.2 s failsafe.
- The pinned chronology runs only on large screens (≥1200 × 700 or ≥1024 × 768); otherwise it is a vertical sequence with no scroll trapping. Keyboard focus inside the track scrolls the focused chapter into view.

## QA

`qa/` holds Playwright scripts (layout audit across 15 widths, interaction checks, link check, screenshots). Serve `dist/` on port 4174 (`npx vite preview --port 4174`) and run, for example, `node qa/audit.mjs`. The scripts point at a local Chromium; adjust `exe` for your machine.

## Deploy

Static output in `dist/`. The demo ships with `noindex` (in `index.html`, `vercel.json` and `public/robots.txt`); remove it when the site goes live.

## Demo content

The Brennick family, its history, companies, figures, addresses and email (`.example`) are fictional, and the phone number is a placeholder.
