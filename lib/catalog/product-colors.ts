import type { CatalogProduct, CatalogVariant } from "./products";

export function colorProductsFor<T extends CatalogProduct>(product: T, catalog: T[]): T[] {
  if (!product.colorGroup) return [product];
  const siblings = catalog.filter((item) => item.colorGroup === product.colorGroup);
  return [...new Map([...siblings, product].map((item) => [item.id, item])).values()];
}

export function selectedProductOption(product: CatalogProduct, query?: string | string[]): CatalogVariant {
  // A URL may only select an option belonging to the current product.
  return product.variants?.find((item) => typeof query === "string" && item.wooId !== null && String(item.wooId) === query)
    || product.variants?.find((item) => item.purchasable)
    || product.variants?.[0]
    || { id: product.id, wooId: null, color: product.color, label: product.color, price: product.price, images: product.images, stockStatus: product.stockStatus, purchasable: false, attributes: [] };
}

export function productOptionHref(product: CatalogProduct, option = selectedProductOption(product)) {
  const path = `/products/${encodeURIComponent(product.slug)}`;
  return product.commerce?.type === "variable" && option.wooId !== null
    ? `${path}?variant=${option.wooId}` : path;
}

// Preview-only relationships. Each entry still owns its own slug, gallery and ID.
export const demoColorGroups: Record<string, string> = {
  "catalog-01": "demo-modal", "catalog-05": "demo-modal", "catalog-08": "demo-modal",
  "catalog-02": "demo-satin", "catalog-06": "demo-satin",
  "catalog-03": "demo-chiffon", "catalog-09": "demo-chiffon",
};
