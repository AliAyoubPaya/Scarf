import "server-only";

import { catalogTabs, featuredProducts } from "@/lib/catalog/products";

/**
 * Server-only catalog boundary. Replace the in-memory return with a MongoDB
 * repository query when the WooCommerce sync worker is connected.
 */
export async function getHomepageCatalog() {
  return {
    tabs: catalogTabs,
    products: featuredProducts,
  };
}
