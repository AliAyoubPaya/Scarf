import "server-only";
import { database } from "@/lib/db/mongodb";
import { wooBaseUrl } from "@/lib/commerce/config";
import { normalizeProduct, type WooProduct, type WooVariation } from "@/lib/commerce/normalize-product";
import type { CollectionProduct } from "@/lib/catalog/collections";

export type StoredProduct = {
  _id: number;
  catalog: CollectionProduct | null;
  lastCatalog?: CollectionProduct;
  fetchedAt: Date;
  syncStatus?: "active" | "deletion-pending" | "removed";
  deletionRequestedAt?: Date;
  removedAt?: Date;
};
async function wooRead(path: string) {
  const key = process.env.WOOCOMMERCE_CONSUMER_KEY;
  const secret = process.env.WOOCOMMERCE_CONSUMER_SECRET;
  if (!key || !secret) throw new Error("WooCommerce sync credentials are missing.");
  try {
    return await fetch(`${wooBaseUrl()}/wp-json/wc/v3/${path}`, { headers: { Authorization: `Basic ${Buffer.from(`${key}:${secret}`).toString("base64")}` }, cache: "no-store", redirect: "error", signal: AbortSignal.timeout(15000) });
  } catch {
    throw new Error("WooCommerce request failed.");
  }
}
export async function syncProduct(id: number) {
  const fetchedAt = new Date();
  const response = await wooRead(`products/${id}`);
  const collection = (await database()).collection<StoredProduct>("products");
  if (response.status === 404) {
    try {
      const result = await collection.updateOne(
        { _id: id, $or: [{ fetchedAt: { $lte: fetchedAt } }, { fetchedAt: { $exists: false } }] },
        [{ $set: { fetchedAt, syncStatus: "deletion-pending", deletionRequestedAt: { $ifNull: ["$deletionRequestedAt", fetchedAt] } } }],
      );
      return { id, published: result.matchedCount === 1, deletionPending: result.modifiedCount === 1 };
    } catch {
      throw new Error("MongoDB deletion request write failed.");
    }
  }
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
  const catalog = normalizeProduct(product, variations);
  try {
    // Atomic snapshot replacement. An earlier/slower fetch cannot overwrite a newer sync.
    await collection.updateOne({ _id: id }, [{ $replaceWith: { $cond: [{ $lte: [{ $ifNull: ["$fetchedAt", new Date(0)] }, fetchedAt] }, { $literal: { _id: id, catalog, ...(catalog ? { lastCatalog: catalog } : {}), fetchedAt, syncStatus: "active" } }, "$$ROOT"] } }], { upsert: true });
  } catch {
    throw new Error("MongoDB snapshot write failed.");
  }
  return { id, published: catalog !== null };
}

export async function approveProductRemoval(id: number) {
  const removedAt = new Date();
  try {
    const result = await (await database()).collection<StoredProduct>("products").updateOne(
      { _id: id, syncStatus: "deletion-pending" },
      [{ $set: { lastCatalog: { $ifNull: ["$catalog", "$lastCatalog"] }, catalog: null, syncStatus: "removed", removedAt, fetchedAt: removedAt } }],
    );
    return { id, removed: result.modifiedCount === 1 };
  } catch {
    throw new Error("MongoDB removal approval failed.");
  }
}
export async function syncPage(page: number) {
  const currency = await wooRead("settings/general/woocommerce_currency");
  if (!currency.ok) throw new Error(`WooCommerce currency read failed (HTTP ${currency.status}).`);
  if ((await currency.json()).value !== "PKR") throw new Error("This storefront requires the WooCommerce currency to be PKR.");
  const response = await wooRead(`products?per_page=10&page=${page}&orderby=id&order=asc`);
  if (!response.ok) throw new Error(`WooCommerce catalog sync failed (HTTP ${response.status}).`);
  const products = await response.json() as WooProduct[];
  const results = [];
  for (const product of products) results.push(await syncProduct(product.id));
  return { results, nextPage: page < Number(response.headers.get("X-WP-TotalPages") || 1) ? page + 1 : null };
}
