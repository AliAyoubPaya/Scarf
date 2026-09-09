# MongoDB catalog + WooCommerce commerce

## Implemented flow

WooCommerce products and variations → authenticated sync / signed webhooks → MongoDB `products` snapshots → Next.js homepage, collections and product pages. There is no static product fallback.

Selected product option → Next.js `/api/cart` → WooCommerce Store API cart → short-lived checkout handoff → WooCommerce hosted checkout, shipping and payment.

The storefront never calls WooCommerce to list products. MongoDB mode does not fall back to fixtures on errors. Price/stock shown on the site are snapshots; WooCommerce validates current availability and charges when adding and checking out. Only MongoDB-resolved product/variation IDs are accepted, never client-supplied prices.

## Current status

As of 9 September 2026:

- Vercel's existing `scarf` project has a connected MongoDB Atlas resource named `scarf-catalog`, shown as **Free Plan**. `MONGODB_URI` is configured for all environments. Database connectivity and catalog writes were verified through the protected preview flow.
- WooCommerce 11.1.0 is installed at `https://chocolate-goldfish-879617.hostingersite.com`, using PKR. A read-only catalog API credential has been saved as private Vercel secrets for Production and Preview. Development credentials and remaining integration configuration are pending. An older read-only key was already present and was not revoked.
- Product content is owned by WooCommerce and copied into MongoDB by sync. No product rows or demo catalog are shipped in the application source. The live check on 9 September 2026 matched all six published WooCommerce products (five in stock, one sold out) on the MongoDB-backed collection page.
- The local project is linked to the existing Vercel project. A bulk development environment pull was blocked by security review because it exports all development secrets. Do not bypass that restriction; obtain explicit approval before exporting them to ignored `.env.local`.
- The protected preview flow was verified again on 9 September 2026: WooCommerce product IDs 19, 20, 21, 22, 25 and 26 synchronized to MongoDB and all six names rendered on the protected collection page. Git branch `codex/woocommerce-mongo-flow` contains an older pushed revision; the current local changes are intentionally unpushed pending owner approval.
- HS Headless Checkout 0.2.0 is installed and active in WordPress. Its endpoint correctly rejects unsigned requests with HTTP 401. Checkout remains disabled until the owner confirms creation of the persistent checkout secret, matching Vercel configuration and end-to-end staging verification.
- The GitHub pull request still needs to be created from the pushed branch because the available browser session is not signed in to GitHub. The compare URL is `https://github.com/AliAyoubPaya/Scarf/compare/master...codex/woocommerce-mongo-flow?expand=1`.

## MongoDB through Vercel

MongoDB Atlas is available through the [Vercel Marketplace](https://vercel.com/marketplace/mongodbatlas/atlas). The database runs on Atlas, not inside a Vercel function.

1. Sign in to the Vercel account containing the existing Scarf project. Select that project, not a new deployment.
2. Add MongoDB Atlas through Storage / Marketplace and connect it to the project. Review plan, region and billing before confirming; use a free option if available and approved. Otherwise use an existing Atlas cluster. No paid plan has been selected by this implementation.
3. Keep database credentials in Vercel's encrypted environment settings. Set `MONGODB_URI` and `MONGODB_DATABASE=scarf`. Verify the integration's actual generated variable name and map it to `MONGODB_URI` if needed. Do not put the URI into a `NEXT_PUBLIC_*` variable.
4. Configure Atlas database-user permissions for only the `scarf` database and an approved network-access policy. Do not open unrestricted IP access without reviewing it; Vercel egress/networking must be considered.
5. For local verification, put the same development credentials in ignored `.env.local` (never commit or expose them). Node 22+ command:

```text
node --env-file=.env.local scripts/check-mongodb.mjs
```

6. Verify product/collection/homepage reads against MongoDB. Environment changes on Vercel require a deployment to take effect. **Do not push or redeploy until the owner explicitly authorizes it.**

## WooCommerce connection

1. Use HTTPS, WooCommerce 10.7+ and store currency PKR. Configure products as simple or variable; external/grouped/private/hidden products are intentionally excluded. Create explicit variation combinations rather than “Any colour/size” wildcard variations. Each colour must be a separate parent product with its own slug, gallery, price and stock. Sizes may be variations inside that colour product. A size without an image inherits that same-colour parent gallery; products without photos use a labelled placeholder. Multi-colour parents are rejected with an actionable sync error, not silently split into fabricated product IDs.
2. Fill the private values in `.env.example`: URL, REST API credentials, webhook secret, sync secret, and checkout bridge secret. Use different random secrets of at least 32 characters. The REST key needs read access to products, variations and the store's currency setting. Set exact image CDN hostnames in `WOOCOMMERCE_IMAGE_HOSTS` and rebuild.
3. Upload `wordpress/hs-headless-checkout/` as a WordPress plugin and activate it. Open **WooCommerce → Headless checkout**, generate a private secret, and store the same value as `WOO_CHECKOUT_SECRET` in Vercel. A `HS_CHECKOUT_SECRET` constant in private `wp-config.php` remains supported and takes precedence. Do not commit the value. The plugin uses an HMAC-authenticated endpoint, signed request age checks and an expiring single-use transfer handle. No payment data or API credentials are put into the URL.
4. Run a protected initial sync: `POST /api/catalog/sync`, header `x-catalog-sync-secret: <CATALOG_SYNC_SECRET>`, JSON `{ "page": 1 }`. A dedicated header avoids collisions with Vercel deployment authentication. Follow each returned `nextPage` until null. Batches are small to fit serverless limits; individual products with many variations may require a longer worker execution window. For targeted repair use `{ "productId": 123 }`. Repeating a product sync replaces the snapshot safely.
5. Add WooCommerce webhooks for product created/updated/deleted (and restored if configured), pointing to `https://YOUR-STOREFRONT/api/woocommerce/webhook`, using `WOOCOMMERCE_WEBHOOK_SECRET`. Invalid signatures are rejected. Canonical parent data is re-fetched before storing, preventing stale payload replay. Configure parent update delivery for variation-only and stock changes. A Woo deletion marks the Mongo record `deletion-pending` and preserves its catalog snapshot on the website. Removal requires an authenticated admin call to `POST /api/catalog/sync` with `{ "productId": 123, "approveRemoval": true }`; approval archives the last snapshot and removes it from storefront reads without physically deleting the Mongo document.
6. Fabric classification uses category/tag slugs `modal`, `chiffon`, `silk`, `satin`, `jersey`, `georgette`; unmatched products are `Other`. Homepage tab assignment uses `new-in`, `best-sellers`, `occasion` slugs. Extend taxonomy intentionally for the actual store rather than guessing material from names.
7. Set `WOO_CHECKOUT_ENABLED=true` only after the checkout bridge and staging checklist below pass.

## Separate colour products

- Set one `Color` (or `pa_color` / `Colour` / `Shade`) attribute value per WooCommerce parent.
- Give sibling products identical REST `meta_data`: `{ "key": "_hs_color_group", "value": "classic-modal" }`. Group keys accept up to 80 letters, digits, underscores or hyphens. They are normalized to lowercase. Missing/invalid groups show only the current colour; unrelated products are never grouped by fabric.
- Each product keeps its own WooCommerce parent ID and MongoDB document. Swatches are actual Next.js links to sibling slugs, with a distinct canonical URL. A variable product may additionally select its own size with `?variant=<Woo variation ID>`; foreign option IDs are ignored. Back/forward, refresh and opening a colour in a new tab use the same product identity.
- Cart submissions resolve the new product slug and its own option from MongoDB. Colour sibling relationships never substitute a different parent's ID.

## What happens after a WordPress product edit

- The storefront never reads product listings directly from WordPress. A protected sync or verified WooCommerce webhook first re-fetches the canonical WooCommerce product, then atomically replaces that product's MongoDB snapshot. The next uncached storefront request reads the updated snapshot.
- A title, description, short description, price, stock state, category/tag assignment, colour attribute, colour-group metadata, gallery image URL or image alt-text change appears after that product is synchronized.
- Upload a replacement image as new WordPress media and assign its new URL. Replacing the binary behind the same URL can remain stale in browser/CDN image caches.
- A deleted WooCommerce product remains in MongoDB and on the storefront with `deletion-pending` status until an admin explicitly approves its removal. Draft/private/hidden products still stop appearing after sync because those are reversible publishing changes. Approved removals retain `lastCatalog` for audit instead of deleting the MongoDB document. Changing `_hs_color_group` changes which separate colour products appear together as swatches.
- WooCommerce webhooks are not yet registered against production because the new route is only on the preview branch. Until the PR is merged and a stable production deployment exists, run the protected sync manually after WordPress edits. Configure and verify product created/updated/deleted webhooks immediately after production deployment.
- WooCommerce long description is shown on the product page after sync; short description is used when the long description is empty.

## Cart and checkout boundaries

- Woo cart bearer tokens stay in an HttpOnly, same-site cookie. Browser-facing responses contain only the cart summary, not addresses, payment data or API secrets.
- Mutations require same-origin requests. Quantities are bounded and WooCommerce enforces stock/sold-individually rules. Pending UI state prevents double clicks; a failed Buy now handoff can be retried without adding the same selection again. After an uncertain network mutation, refresh the bag before retrying.
- The checkout plugin adopts the existing **guest** Store API session into the browser's WooCommerce cookie. It does not recreate the cart with arbitrary prices or manufacture orders. WooCommerce remains the owner through checkout. Authenticated WordPress sessions cannot be transferred from a client token. If WooCommerce migrates a guest session after login, the headless token may expire; the storefront asks the visitor to refresh.
- Exclude `/wp-json/wc/store/*`, `/wp-json/hs-store/*`, checkout and requests containing `hs_checkout` from WordPress/CDN caching. Redact handoff handles and cookies from analytics/logs. Keep WordPress cron enabled for expired replay-claim cleanup.
- Configure rate limits at Vercel/WAF and WooCommerce for public cart endpoints before launch. These are not bypassed or disabled by the code.

## Required staging acceptance tests

Not possible without the real services; do not treat passing unit tests as proof of a live checkout:

- Atlas connectivity, live MongoDB reads, and no fixture fallback on DB outage.
- Import simple/variable product, edit colour photo/price/stock, delete and restore, retry out-of-order/duplicate webhooks.
- Exact selected variation appears in Woo cart; sold-out and changed prices are handled by Woo.
- Refresh and two separate browsers retain isolated carts. Quantity/remove actions, expired token recovery, network failure and checkout retry do not silently duplicate items.
- Handoff works with guest and existing Woo cookies; rejects expired/reused/tampered handles. Hosted checkout shows the same variations and quantities.
- Test every configured payment method in sandbox, shipping/taxes, declined payment, return/back navigation and completed-order cart clearing. Do not charge a real payment during testing without explicit authorization.
- Desktop and mobile, keyboard colour-link and size-option selection, image reset/zoom, visible errors and no horizontal overflow.

## Local checks

```text
npm run lint
npm run build
node --experimental-strip-types --test tests/*.test.mjs
```

Protocol references: [WooCommerce cart tokens](https://developer.woocommerce.com/docs/apis/store-api/cart-tokens/), [Cart API](https://developer.woocommerce.com/docs/apis/store-api/resources-endpoints/cart/), [REST product variations](https://developer.woocommerce.com/docs/apis/rest-api/v3/product-variations/).
