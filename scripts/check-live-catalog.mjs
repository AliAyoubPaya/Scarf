const origin = process.argv[2];
const storefrontOnly = process.argv.includes("--storefront-only");
if (!origin || !/^https:\/\/[a-z0-9.-]+\.vercel\.app$/i.test(origin)) {
  console.error("Pass the HTTPS Vercel preview origin as the first argument.");
  process.exit(1);
}

const secret = process.env.CATALOG_SYNC_SECRET;
if (!storefrontOnly && (!secret || secret.length < 32)) {
  console.error("CATALOG_SYNC_SECRET is not configured for this environment.");
  process.exit(1);
}

let syncResult = {};
if (!storefrontOnly) {
const syncResponse = await fetch(`${origin}/api/catalog/sync`, {
  method: "POST",
  headers: {
    "x-catalog-sync-secret": secret,
    "content-type": "application/json",
  },
  body: JSON.stringify({ page: 1 }),
  redirect: "error",
});

syncResult = await syncResponse.json().catch(() => ({}));
if (!syncResponse.ok) {
  console.error(JSON.stringify({
    error: typeof syncResult.error === "string" ? syncResult.error : "Catalog sync failed",
    status: syncResponse.status,
    contentType: syncResponse.headers.get("content-type"),
    server: syncResponse.headers.get("server"),
    bodyKeys: Object.keys(syncResult),
  }));
  process.exit(1);
}
}

const expectedProducts = [
  "Olive Mist Modal Hijab",
  "Cocoa Cloud Modal Hijab",
  "Soft Pearl Chiffon Hijab",
];
const storefrontResponse = await fetch(origin, { redirect: "follow" });
if (!/^https:\/\/[a-z0-9.-]+\.vercel\.app\/?$/i.test(storefrontResponse.url)) {
  console.error("Storefront redirected outside the expected Vercel preview origin.");
  process.exit(1);
}
const storefront = await storefrontResponse.text();
const missing = expectedProducts.filter((name) => !storefront.includes(name));

if (!storefrontResponse.ok || missing.length) {
  console.error(`Storefront verification failed${missing.length ? `; missing ${missing.join(", ")}` : ""}.`);
  process.exit(1);
}

console.log(JSON.stringify({
  synced: !storefrontOnly,
  syncCount: Array.isArray(syncResult.results) ? syncResult.results.length : null,
  nextPage: syncResult.nextPage ?? null,
  storefrontStatus: storefrontResponse.status,
  productsVisible: expectedProducts.length,
}));
