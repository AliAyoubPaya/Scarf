export type ProductTabId = "new-in" | "best-sellers" | "occasion";

export type CatalogTab = {
  id: ProductTabId;
  label: string;
};

export type CatalogProduct = {
  /** Explicit sibling-product family, never inferred from fabric or title. */
  colorGroup?: string;
  variants?: CatalogVariant[];
  commerce?: { synced: boolean; purchasable: boolean; type: "simple" | "variable" };
  id: string;
  source: {
    provider: "woocommerce";
    externalId: number;
  };
  slug: string;
  name: string;
  description?: string;
  shortDescription?: string;
  color: string;
  price: number;
  currency: "PKR";
  images: {
    src: string;
    alt: string;
  }[];
  stockStatus: "in-stock" | "sold-out";
  colorCount: number;
  tabs: ProductTabId[];
};

export type CatalogVariant = {
  backorder?: boolean;
  id: string;
  wooId: number | null;
  color: string;
  label: string;
  swatch?: string;
  price: number;
  images: CatalogProduct["images"];
  stockStatus: CatalogProduct["stockStatus"];
  purchasable: boolean;
  attributes: { name: string; option: string }[];
};

export const catalogTabs: CatalogTab[] = [
  { id: "new-in", label: "New in" },
  { id: "best-sellers", label: "Best sellers" },
  { id: "occasion", label: "Occasion" },
];
