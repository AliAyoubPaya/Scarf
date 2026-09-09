# HS by Saman branding

`components/local/brand-logo.tsx` is the shared header/footer logo. Intrinsic square dimensions reserve space before loading; `object-contain` preserves proportions. The white-backed artwork blends with the existing light backgrounds using multiply. Use a separate asset before adding dark-background placements.

The user's original JPEG is retained at `public/images/hs-by-saman-logo-original.jpg`. The sharper, AI-restored website version is `public/images/hs-by-saman-logo.png`, created with the built-in image-generation tool. Its final prompt is saved beside it as `hs-by-saman-logo.prompt.txt`. This is a raster restoration, not an exact vector master; use the official SVG/AI artwork if supplied later.

Central palette in `app/globals.css`:

- `brand-gold` (#b49a5a): decorative lines and accents.
- `brand-gold-ink` (#78602b): readable small text, focus indicators, and filled buttons with white text.
- `brand-gold-soft` (#f6f0e2): selected tabs and gentle accent surfaces.
- `brand-gold-line` (#dfd1ae): subtle borders on accent surfaces.

Keep paragraph text neutral. Gold should emphasize hierarchy and interaction, not replace every neutral color. Original shadcn components remain unchanged.
