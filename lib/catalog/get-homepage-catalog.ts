import "server-only";

import { catalogTabs } from "@/lib/catalog/products";
import { getCatalogProducts } from "@/lib/catalog/get-collection-catalog";

/**
 * Homepage shares the same MongoDB/explicit-preview repository as collection and product pages.
 */
export async function getHomepageCatalog() {
  return {
    tabs: catalogTabs,
    products: await getCatalogProducts(),
  };
}
