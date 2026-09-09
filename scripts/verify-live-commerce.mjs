import { spawnSync } from "node:child_process";

const deployment = process.argv[2];
if (!deployment || !/^https:\/\/[a-z0-9.-]+\.vercel\.app$/i.test(deployment)) {
  console.error("Pass the HTTPS Vercel preview origin as the first argument.");
  process.exit(1);
}

const wooUrl = process.env.WOOCOMMERCE_URL?.replace(/\/$/, "");
if (!wooUrl) {
  console.error("WOOCOMMERCE_URL is not configured.");
  process.exit(1);
}

const response = await fetch(`${wooUrl}/wp-json/wc/store/v1/products?per_page=100`, {
  redirect: "error",
  signal: AbortSignal.timeout(15000),
});
if (!response.ok) {
  console.error(`WooCommerce product read failed (HTTP ${response.status}).`);
  process.exit(1);
}

const products = await response.json();
const command = process.platform === "win32" ? "powershell.exe" : "npx";
const commandArgs = process.platform === "win32"
  ? ["-NoProfile", "-Command", `npx --yes vercel@latest curl /collections/all --deployment '${deployment}' --yes -- --silent --show-error`]
  : ["--yes", "vercel@latest", "curl", "/collections/all", "--deployment", deployment, "--yes", "--", "--silent", "--show-error"];
const storefront = spawnSync(command, commandArgs, { encoding: "utf8" });
if (storefront.status !== 0) {
  console.error("Protected storefront request failed.");
  process.exit(storefront.status ?? 1);
}

const missing = products.filter((product) => !storefront.stdout.includes(product.name));
if (missing.length) {
  console.error(`MongoDB storefront is missing WooCommerce products: ${missing.map((product) => product.id).join(", ")}.`);
  process.exit(1);
}

console.log(JSON.stringify({
  verified: true,
  publishedProducts: products.length,
  inStock: products.filter((product) => product.is_in_stock).length,
  outOfStock: products.filter((product) => !product.is_in_stock).length,
  storefrontProductsMatched: products.length,
}));
