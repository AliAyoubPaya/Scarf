import type { CatalogProduct, ProductTabId } from "@/lib/catalog/products";

export const fabrics = ["Modal", "Chiffon", "Silk & satin", "Jersey", "Georgette", "Other"] as const;
export type Fabric = (typeof fabrics)[number];
export const shades = [
  { name: "Green", hex: "#99a285" }, { name: "Pink", hex: "#c39e95" },
  { name: "Ivory", hex: "#eee5d3" }, { name: "Blue", hex: "#283047" },
  { name: "Brown", hex: "#896951" }, { name: "Black", hex: "#282724" },
  { name: "Printed", hex: "#b77b61" },
] as const;
export type CollectionProduct = CatalogProduct & { fabric: Fabric; shade: string };
export type Collection = { slug: string; title: string; description: string; fabric?: Fabric; tab?: ProductTabId; shade?: string; empty?: boolean };

export const collections: Collection[] = [
  { slug: "all", title: "Scarves for every story.", description: "Quiet neutrals, expressive prints and beautiful drapes. Find the scarf that feels like you." },
  { slug: "new-in", title: "A fresh perspective.", description: "Meet the newest shades in your everyday rotation.", tab: "new-in" },
  { slug: "modal", title: "Everyday, in modal.", description: "Soft shades and easy drapes for all the moments in between.", fabric: "Modal" },
  { slug: "chiffon", title: "A little chiffon elegance.", description: "Discover light, graceful layers for your own way of styling.", fabric: "Chiffon" },
  { slug: "silk", title: "A touch of occasion.", description: "Explore silk and satin styles in soft tones and expressive prints.", fabric: "Silk & satin" },
  { slug: "jersey", title: "Your everyday companion.", description: "Discover the jersey edit, made for a relaxed look.", fabric: "Jersey" },
  { slug: "georgette", title: "Beautifully expressive.", description: "Add a little personality to your layers with the georgette edit.", fabric: "Georgette" },
  { slug: "occasion", title: "For your special moments.", description: "Discover an elegant finishing touch for the moments you dress up for.", tab: "occasion" },
  { slug: "best-sellers", title: "The community edit.", description: "Explore familiar favourites from our scarf collection.", tab: "best-sellers" },
  { slug: "sale", title: "The sale edit.", description: "Explore available offers when they arrive. No offers are listed at the moment.", empty: true },
  ...["accessories", "hijab-magnets", "undercaps", "gift-sets"].map((slug) => ({ slug, title: slug.split("-").map((word) => word[0].toUpperCase() + word.slice(1)).join(" "), description: "The finishing touches to your scarf wardrobe. This collection is being prepared.", empty: true })),
];

export const collectionLinks = [
  { slug: "all", label: "All scarves" }, { slug: "new-in", label: "New in" },
  { slug: "modal", label: "Modal" }, { slug: "chiffon", label: "Chiffon" },
  { slug: "silk", label: "Silk & satin" }, { slug: "jersey", label: "Jersey" },
  { slug: "georgette", label: "Georgette" },
];

export type ShopFilters = { fabrics: string[]; shades: string[]; stock: boolean; price: string; sort: string; query: string };
export const sortOptions = [{ value: "featured", label: "Featured" }, { value: "price-asc", label: "Price: low to high" }, { value: "price-desc", label: "Price: high to low" }, { value: "name-asc", label: "Name: A–Z" }];
export const priceOptions = [{ value: "any", label: "Any price" }, { value: "under-3000", label: "Under Rs. 3,000" }, { value: "3000-plus", label: "Rs. 3,000 & above" }];

export function parseShopFilters(params: URLSearchParams): ShopFilters {
  return {
    fabrics: [...new Set(params.getAll("fabric"))].filter((value) => fabrics.some((fabric) => fabric === value)),
    shades: [...new Set(params.getAll("shade"))].filter((value) => shades.some((shade) => shade.name === value)),
    stock: params.get("stock") === "1",
    price: priceOptions.some((option) => option.value === params.get("price")) ? params.get("price")! : "any",
    sort: sortOptions.some((option) => option.value === params.get("sort")) ? params.get("sort")! : "featured",
    query: (params.get("q") ?? "").slice(0, 100),
  };
}

export function filterCollectionProducts(products: CollectionProduct[], filters: ShopFilters) {
  const query = filters.query.trim().toLowerCase();
  const result = products.filter((p) =>
    (!filters.fabrics.length || filters.fabrics.includes(p.fabric)) &&
    (!filters.shades.length || filters.shades.includes(p.shade)) &&
    (!filters.stock || p.stockStatus === "in-stock") &&
    (filters.price !== "under-3000" || p.price < 3000) &&
    (filters.price !== "3000-plus" || p.price >= 3000) &&
    (!query || `${p.name} ${p.color} ${p.fabric}`.toLowerCase().includes(query)),
  );
  if (filters.sort === "price-asc") result.sort((a, b) => a.price - b.price);
  if (filters.sort === "price-desc") result.sort((a, b) => b.price - a.price);
  if (filters.sort === "name-asc") result.sort((a, b) => a.name.localeCompare(b.name));
  return result;
}
