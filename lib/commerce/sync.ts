import "server-only";
import { database } from "@/lib/db/mongodb";
import { wooBaseUrl } from "@/lib/commerce/config";
import { normalizeProduct, type WooProduct, type WooVariation } from "@/lib/commerce/normalize-product";
import type { CollectionProduct } from "@/lib/catalog/collections";

export type StoredProduct = { _id: number; catalog: CollectionProduct | null; fetchedAt: Date };
async function wooRead(path: string) {
  const key = process.env.WOOCOMMERCE_CONSUMER_KEY;
  const secret = process.env.WOOCOMMERCE_CONSUMER_SECRET;
  if (!key || !secret) throw new Error("WooCommerce sync credentials are missing.");
  return fetch(`${wooBaseUrl()}/wp-json/wc/v3/${path}`, { headers: { Authorization: `Basic ${Buffer.from(`${key}:${secret}`).toString("base64")}` }, cache: "no-store", redirect: "error", signal: AbortSignal.timeout(15000) });
}
export async function syncProduct(id: number) {
  const fetchedAt = new Date();
  const response = await wooRead(`products/${id}`);
  let catalog: CollectionProduct | null = null;
  if (response.status !== 404) {
    if (!response.ok) throw new Error("WooCommerce product sync failed.");
    const product = await response.json() as WooProduct;
    const variations: WooVariation[] = [];
    if (product.type === "variable") {
      for (let page = 1; page <= 10; page++) {
        const result = await wooRead(`products/${id}/variations?per_page=100&page=${page}`);
        if (!result.ok) throw new Error("WooCommerce variation sync failed.");
        const batch = await result.json() as WooVariation[];
        variations.push(...batch);
        if (batch.length < 100) break;
        if (page === 10) throw new Error("Product exceeds the supported variation batch size.");
      }
    }
    catalog = normalizeProduct(product, variations);
  }
  const collection = (await database()).collection<StoredProduct>("products");
  // Atomic snapshot replacement. An earlier/slower fetch cannot overwrite a newer sync.
  await collection.updateOne({ _id: id }, [{ $replaceWith: { $cond: [{ $lte: [{ $ifNull: ["$fetchedAt", new Date(0)] }, fetchedAt] }, { $literal: { _id: id, catalog, fetchedAt } }, "$$ROOT"] } }], { upsert: true });
  return { id, published: catalog !== null };
}
export async function syncPage(page: number) {
  const currency = await wooRead("settings/general/woocommerce_currency");
  if (!currency.ok || (await currency.json()).value !== "PKR") throw new Error("This storefront requires the WooCommerce currency to be PKR.");
  const response = await wooRead(`products?per_page=10&page=${page}&orderby=id&order=asc`);
  if (!response.ok) throw new Error("WooCommerce catalog sync failed.");
  const products = await response.json() as WooProduct[];
  const results = [];
  for (const product of products) results.push(await syncProduct(product.id));
  return { results, nextPage: page < Number(response.headers.get("X-WP-TotalPages") || 1) ? page + 1 : null };
}
