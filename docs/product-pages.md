# Product pages

`/products/[slug]` dynamically renders each catalog scarf, with page metadata and a not-found response for unknown products. Collection image/title links navigate to this page; the separate Quick view button retains the collection modal.

## Components

- `components/local/product/product-gallery.tsx`: reserved-ratio images, thumbnails, looping navigation, touch swipe and accessible native-dialog enlarged view.
- `components/local/product/product-details.tsx`: shared selected-variation state; resets the gallery when the shade changes.
- `components/local/product/product-information.tsx`: image swatch radio controls, variant price/stock, quantity, WooCommerce cart/Buy now actions, sharing, details and mobile purchase bar.
- `components/local/product/related-scarves.tsx`: related catalog products, prioritising the same fabric.

## Data and checkout

The server-only `getCatalogProducts` repository is shared with collections and the homepage. Explicit modes select local preview, MongoDB preview or MongoDB synced products. See `docs/commerce-setup.md` for provisioning, sync and checkout activation. No product listing is fetched from WooCommerce in the browser.

No dimensions, fabric composition, shipping commitments, discounts or customer reviews have been invented. These should come from verified catalog/policy data.

Checkout is not connected to a live store yet. Cart/checkout endpoints and the WordPress session bridge are implemented but gated until configured and tested. Preview products cannot be purchased; there are no fake cart successes. Cards without a quick-view handler link to product details. WooCommerce rechecks prices and stock, and exact real variation IDs are resolved server-side from MongoDB.

## Checks

`npm run lint`

`npm run build`

`node --experimental-strip-types --test tests/*.test.mjs`
