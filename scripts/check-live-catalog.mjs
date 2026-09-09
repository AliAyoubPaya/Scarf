const origin = process.argv[2];
if (!origin || !/^https:\/\/[a-z0-9.-]+\.vercel\.app$/i.test(origin)) {
  console.error("Pass the HTTPS Vercel preview origin as the first argument.");
  process.exit(1);
}

const secret = process.env.CATALOG_SYNC_SECRET;
if (!secret || secret.length < 32) {
  console.error("CATALOG_SYNC_SECRET is not configured for this environment.");
  process.exit(1);
}

const syncResponse = await fetch(`${origin}/api/catalog/sync`, {
  method: "POST",
  headers: {
    "x-catalog-sync-secret": secret,
    "content-type": "application/json",
  },
  body: JSON.stringify({ page: 1 }),
  redirect: "error",
});

const syncResult = await syncResponse.json().catch(() => ({}));
if (!syncResponse.ok) {
  console.error(`Catalog sync failed with HTTP ${syncResponse.status}.`);
  process.exit(1);
}

const expectedProducts = [
  "Olive Mist Modal Hijab",
  "Cocoa Cloud Modal Hijab",
  "Soft Pearl Chiffon Hijab",
];
const storefrontResponse = await fetch(origin, { redirect: "error" });
const storefront = await storefrontResponse.text();
const missing = expectedProducts.filter((name) => !storefront.includes(name));

if (!storefrontResponse.ok || missing.length) {
  console.error(`Storefront verification failed${missing.length ? `; missing ${missing.join(", ")}` : ""}.`);
  process.exit(1);
}

console.log(JSON.stringify({
  synced: true,
  syncCount: Array.isArray(syncResult.results) ? syncResult.results.length : null,
  nextPage: syncResult.nextPage ?? null,
  storefrontStatus: storefrontResponse.status,
  productsVisible: expectedProducts.length,
}));
