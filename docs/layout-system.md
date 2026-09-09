# Section widths

Use `SiteContainer` from `components/local/site-container.tsx` for section content. There are exactly two modes:

- `width="full"`: fills the available page width with shared responsive side gutters. Used by the header, mega menu, footer, homepage hero and collection hero/grid/help.
- `width="contained"` (default): centered, capped at `--site-content-max` (90rem / 1440px), using the same gutters. Used by featured products, social videos, newsletter, product details, related products, about/contact content and the bag. These stay readable and avoid oversized imagery on ultrawide displays.

Full-bleed backgrounds and editorial images may sit directly inside a full-width section (the homepage hero and Shop the Look). Put their text inside the appropriate container or use the shared gutter for a split panel.

All page gutter values and the single content maximum are defined in `app/globals.css`. Do not add page-specific `max-width` values or override the container's horizontal padding. Local text measures, dialog limits and individual card sizes are independent of section width.

Collection grids gain columns on wide screens instead of stretching a fixed number of cards. Use rem breakpoints consistently with Tailwind's built-in breakpoints. Responsive image `sizes` must reflect their slot widths when the layout changes.
