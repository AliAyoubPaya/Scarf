import "server-only";

export function catalogIsLive() { return process.env.CATALOG_MODE === "mongodb"; }
export function catalogUsesMongo() { return catalogIsLive() || process.env.CATALOG_MODE === "mongodb-preview"; }
export function wooBaseUrl() {
  const url = new URL(process.env.WOOCOMMERCE_URL || "https://not-configured.invalid");
  if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash || url.hostname.endsWith(".invalid")) throw new Error("WooCommerce URL is not configured.");
  return url.href.replace(/\/$/, "");
}
export function commerceReady() {
  if (process.env.WOO_CHECKOUT_ENABLED !== "true" || !catalogIsLive() || !process.env.MONGODB_URI || !process.env.WOO_CHECKOUT_SECRET) return false;
  try { wooBaseUrl(); return process.env.WOO_CHECKOUT_SECRET.length >= 32; } catch { return false; }
}
