import "server-only";

import { collections, type CollectionProduct } from "@/lib/catalog/collections";
import { database } from "@/lib/db/mongodb";
import type { StoredProduct } from "@/lib/commerce/sync";
import { colorProductsFor } from "@/lib/catalog/product-colors";

export async function getCatalogProducts(): Promise<CollectionProduct[]> {
  const rows = await (await database()).collection<StoredProduct>("products")
    .find({ catalog: { $ne: null }, syncStatus: { $ne: "removed" } }, { projection: { _id: 0, catalog: 1 } })
    .sort({ _id: -1 })
    .toArray();
  const catalog = rows.flatMap((row) => row.catalog ? [row.catalog] : []);
  return catalog.map((product) => ({ ...product, colorCount: colorProductsFor(product, catalog).length }));
}

export async function getCollectionCatalog(slug: string) {
  const collection = collections.find((entry) => entry.slug === slug);
  if (!collection) return null;
  const products = await getCatalogProducts();
  return { collection, products: products.filter((product) => !collection.empty && (!collection.fabric || product.fabric === collection.fabric) && (!collection.tab || product.tabs.includes(collection.tab))) };
}
