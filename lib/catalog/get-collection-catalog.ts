import "server-only";

import { featuredProducts } from "@/lib/catalog/products";
import { collections, type CollectionProduct, type Fabric } from "@/lib/catalog/collections";
import { database } from "@/lib/db/mongodb";
import { catalogIsLive, catalogUsesMongo } from "@/lib/commerce/config";
import type { StoredProduct } from "@/lib/commerce/sync";
import { colorProductsFor, demoColorGroups } from "@/lib/catalog/product-colors";

// Explicit taxonomy for the local, non-purchasable preview only.
// Live reads are MongoDB-only; WooCommerce reads belong to the sync worker.
const taxonomy: Record<string, { fabric: Fabric; shade: string }> = {
  "catalog-01": { fabric: "Modal", shade: "Green" },
  "catalog-02": { fabric: "Silk & satin", shade: "Pink" },
  "catalog-03": { fabric: "Chiffon", shade: "Ivory" },
  "catalog-04": { fabric: "Jersey", shade: "Blue" },
  "catalog-05": { fabric: "Modal", shade: "Green" },
  "catalog-06": { fabric: "Silk & satin", shade: "Pink" },
  "catalog-07": { fabric: "Silk & satin", shade: "Printed" },
  "catalog-08": { fabric: "Modal", shade: "Brown" },
  "catalog-09": { fabric: "Chiffon", shade: "Black" },
  "catalog-10": { fabric: "Georgette", shade: "Printed" },
};

export async function getCatalogProducts(): Promise<CollectionProduct[]> {
  if (catalogUsesMongo()) {
    const rows = await (await database()).collection<StoredProduct>(catalogIsLive() ? "products" : "demo_products").find({ catalog: { $ne: null } }, { projection: { _id: 0, catalog: 1 } }).sort({ _id: -1 }).toArray();
    const catalog = rows.flatMap((row) => row.catalog ? [row.catalog] : []);
    return catalog.map((product) => ({ ...product, colorCount: colorProductsFor(product, catalog).length }));
  }
  const demo = featuredProducts.map((product) => ({ ...product, ...taxonomy[product.id] }));
  const catalog: CollectionProduct[] = demo.map((product) => ({
    ...product, colorGroup: demoColorGroups[product.id],
    commerce: { synced: false, purchasable: false, type: "simple" },
    variants: [{ id: `demo-${product.id}`, wooId: null, color: product.color, label: product.color, price: product.price, images: product.images, stockStatus: product.stockStatus, purchasable: false, attributes: [] }],
  }));
  return catalog.map((product) => ({ ...product, colorCount: colorProductsFor(product, catalog).length }));
}

export async function getCollectionCatalog(slug: string) {
  const collection = collections.find((entry) => entry.slug === slug);
  if (!collection) return null;
  const products = await getCatalogProducts();
  return { collection, products: products.filter((product) => !collection.empty && (!collection.fabric || product.fabric === collection.fabric) && (!collection.tab || product.tabs.includes(collection.tab))) };
}
