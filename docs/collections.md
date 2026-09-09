# Shop and category pages

Primary route: `/collections/all`. Reusable `/collections/[slug]` renders fabric categories, new-in and occasion collections from one configuration. Existing best-sellers links remain valid, but no best-selling tab or sorting option is added to the new shop UI. Existing homepage tabs are unchanged. Unknown slugs return 404. Sale/accessory collections honestly show an empty state until their catalog entries are available.

Sections/components live in `components/local/shop/`: collection hero/navigation, shop grid/controller, filters, dialog, product quick view and styling-help banner. Shared SiteContainer, gold tokens and the existing product card are reused. Original shadcn files are untouched.

`lib/catalog/get-collection-catalog.ts` is the shared server-only MongoDB/explicit-preview repository. See `docs/commerce-setup.md` for modes, provisioning and WooCommerce sync. No browser product-list requests go to WooCommerce. Production stock, prices and material classifications come from synced snapshots.

Filters use OR within fabric/colour groups and AND across groups. Price bands meet at Rs. 3,000 without overlap. URL query parameters preserve filters/sorting through refresh and browser back/forward. Results, active chips, reset and empty states update locally. All matching MongoDB products are shown; add server-side pagination when the live catalog grows.

Collection image/title links open product pages. The separate Quick view button opens the lightweight dialog; it does not report fake cart success. Product pages contain swatches and the gated WooCommerce cart/checkout actions.

Native dialogs provide modal focus containment and Escape dismissal; body scrolling is restored on close. Filters are a sidebar on desktop and a drawer on smaller screens.

Run filter tests: `node --experimental-strip-types --test tests/collection-filters.test.mjs`. Also run `npm run lint` and `npm run build`.
