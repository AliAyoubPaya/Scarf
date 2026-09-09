"use client";

import { useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Columns2, Grid2X2, Search, SlidersHorizontal, X, SearchX } from "lucide-react";
import { SiteContainer } from "@/components/local/site-container";
import { CatalogProductCard } from "@/components/local/catalog-product-card";
import { CollectionFilters, type FilterChange } from "@/components/local/shop/collection-filters";
import { ShopDialog } from "@/components/local/shop/shop-dialog";
import { ProductQuickView } from "@/components/local/shop/product-quick-view";
import { filterCollectionProducts, parseShopFilters, priceOptions, sortOptions, type Collection, type CollectionProduct } from "@/lib/catalog/collections";

export function CollectionShop({ products, collection }: { products: CollectionProduct[]; collection: Collection }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sidebar, setSidebar] = useState(true);
  const [drawer, setDrawer] = useState(false);
  const [dense, setDense] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<CollectionProduct | null>(null);
  const filters = parseShopFilters(new URLSearchParams(searchParams.toString()));
  const filtered = filterCollectionProducts(products, filters);
  const chips = [
    ...filters.fabrics.map((value) => ({ key: "fabric", value, label: value, multiple: true })),
    ...filters.shades.map((value) => ({ key: "shade", value, label: value, multiple: true })),
    ...(filters.stock ? [{ key: "stock", value: "", label: "In stock", multiple: false }] : []),
    ...(filters.price !== "any" ? [{ key: "price", value: "any", label: priceOptions.find((p) => p.value === filters.price)!.label, multiple: false }] : []),
    ...(filters.query ? [{ key: "q", value: "", label: `Search: ${filters.query}`, multiple: false }] : []),
  ];

  const updateFilter: FilterChange = (key, value, multiple = false) => {
    const params = new URLSearchParams(searchParams.toString());
    if (multiple) {
      const values = params.getAll(key);
      params.delete(key);
      (values.includes(value) ? values.filter((entry) => entry !== value) : [...values, value]).forEach((entry) => params.append(key, entry));
    } else if (!value || value === "any" || value === "featured") params.delete(key);
    else params.set(key, value);
    const query = params.toString();
    window.history.pushState(null, "", `${pathname}${query ? `?${query}` : ""}`);
  };

  const clearFilters = () => {
    const params = new URLSearchParams();
    if (filters.sort !== "featured") params.set("sort", filters.sort);
    window.history.pushState(null, "", `${pathname}${params.size ? `?${params}` : ""}`);
  };

  return (
    <section aria-label="Shop scarves" className="py-8 sm:py-10 lg:pb-16">
      <SiteContainer width="full">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e4ded2] pb-5">
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => setSidebar(!sidebar)} aria-expanded={sidebar} aria-controls="desktop-collection-filters" className="hidden min-h-11 items-center gap-2 text-xs font-medium uppercase tracking-[0.08em] lg:flex"><SlidersHorizontal aria-hidden="true" className="size-4" />{sidebar ? "Hide filters" : "Show filters"}</button>
            <button type="button" onClick={() => setDrawer(true)} aria-haspopup="dialog" className="inline-flex min-h-11 items-center gap-2 rounded-md border border-brand-gold-line px-4 text-xs font-medium lg:hidden"><SlidersHorizontal aria-hidden="true" className="size-4" />Filters{chips.length ? ` (${chips.length})` : ""}</button>
            <p role="status" aria-live="polite" aria-atomic="true" className="text-xs text-[#71695d]">{filtered.length} {filtered.length === 1 ? "scarf" : "scarves"}</p>
          </div>
          <div className="flex min-w-0 flex-1 items-center justify-end gap-3 sm:flex-none">
            <label htmlFor="collection-sort" className="sr-only">Sort products</label>
            <select id="collection-sort" value={filters.sort} onChange={(event) => updateFilter("sort", event.target.value)} className="min-h-11 min-w-0 max-w-[180px] rounded-md border border-[#e4ded2] bg-white px-2 text-xs outline-none focus:ring-2 focus:ring-brand-gold-ink sm:px-3">{sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
            <div role="group" aria-label="Product grid layout" className="hidden items-center border-l border-[#e4ded2] pl-2 sm:flex [&_button]:flex [&_button]:size-11 [&_button]:items-center [&_button]:justify-center [&_button]:rounded-md">
              <button type="button" aria-label="Comfortable grid" aria-pressed={!dense} onClick={() => setDense(false)} className={!dense ? "bg-brand-gold-soft text-brand-gold-ink" : "text-[#8a8376]"}><Columns2 aria-hidden="true" className="size-4" /></button>
              <button type="button" aria-label="Compact grid" aria-pressed={dense} onClick={() => setDense(true)} className={dense ? "bg-brand-gold-soft text-brand-gold-ink" : "text-[#8a8376]"}><Grid2X2 aria-hidden="true" className="size-4" /></button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {chips.length ? <>{chips.map((chip) => <button key={`${chip.key}-${chip.label}`} type="button" onClick={() => updateFilter(chip.key, chip.value, chip.multiple)} aria-label={`Remove ${chip.label} filter`} className="inline-flex min-h-9 max-w-full items-center gap-2 rounded-full border border-brand-gold-line bg-brand-gold-soft px-3 text-xs text-brand-gold-ink"><span className="truncate">{chip.label}</span><X aria-hidden="true" className="size-3 shrink-0" /></button>)}<button type="button" onClick={clearFilters} className="min-h-11 px-2 text-xs text-[#71695d] underline underline-offset-4">Clear all</button></> : <p className="text-sm text-[#71695d]">Find your fabric. Make it your own.</p>}
          </div>
          <form role="search" aria-label="Search this collection" onSubmit={(event) => { event.preventDefault(); updateFilter("q", String(new FormData(event.currentTarget).get("q") ?? "").trim()); }} className="flex w-full shrink-0 items-center rounded-md border border-[#e4ded2] bg-white pl-3 sm:w-60">
            <label htmlFor="collection-search" className="sr-only">Search this collection</label><input key={filters.query} id="collection-search" name="q" type="search" defaultValue={filters.query} maxLength={100} placeholder="Search this collection" className="min-h-11 min-w-0 flex-1 bg-transparent text-base outline-none focus-visible:ring-1 focus-visible:ring-brand-gold-ink sm:text-sm" /><button type="submit" aria-label="Search scarves" className="flex size-11 shrink-0 items-center justify-center text-brand-gold-ink"><Search aria-hidden="true" className="size-4" /></button>
          </form>
        </div>

        <div className={`grid items-start gap-8 ${sidebar ? "lg:grid-cols-[205px_minmax(0,1fr)] lg:gap-9" : "grid-cols-1"}`}>
          <aside id="desktop-collection-filters" aria-label="Filter scarves" className={sidebar ? "hidden lg:block" : "hidden"}><CollectionFilters products={products} filters={filters} onChange={updateFilter} prefix="desktop" /></aside>
          <div className="min-w-0">
            {filtered.length ? <div className={`grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 ${dense ? sidebar ? "md:grid-cols-3 xl:grid-cols-4 min-[120rem]:grid-cols-5 min-[150rem]:grid-cols-6" : "md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 min-[120rem]:grid-cols-6" : "sm:grid-cols-2 2xl:grid-cols-3 min-[120rem]:grid-cols-4"}`}>{filtered.map((product) => <CatalogProductCard key={product.id} product={product} compact imageSizes={!dense ? "(min-width: 1920px) 25vw, (min-width: 1536px) 33vw, 50vw" : sidebar ? "(min-width: 2400px) 17vw, (min-width: 1920px) 20vw, (min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw" : "(min-width: 1920px) 17vw, (min-width: 1536px) 20vw, (min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"} onQuickView={() => setSelectedProduct(product)} />)}</div> : <div className="flex min-h-80 flex-col items-center justify-center rounded-xl border border-dashed border-brand-gold-line bg-white px-5 py-12 text-center"><SearchX aria-hidden="true" className="size-8 text-brand-gold-ink" strokeWidth={1.3} /><h2 className="mt-5 text-2xl font-light">{products.length ? "No scarves found this time." : "A little more to look forward to."}</h2><p className="mt-3 max-w-sm text-sm leading-6 text-[#71695d]">{products.length ? "Try a different shade, fabric or price, or clear your filters to explore the collection again." : "There are no products in this collection yet. In the meantime, explore our available scarves."}</p>{products.length ? <button type="button" onClick={clearFilters} className="mt-6 min-h-11 rounded-full bg-brand-gold-ink px-6 text-sm text-white">Clear filters</button> : <Link href="/collections/all" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-brand-gold-ink px-6 text-sm text-white">Explore all scarves</Link>}</div>}
            {filtered.length ? <p className="mt-10 text-center text-xs text-[#82786a]">You’re viewing all {filtered.length} {filtered.length === 1 ? "scarf" : "scarves"} in this selection.</p> : null}
          </div>
        </div>
      </SiteContainer>
      {drawer ? <ShopDialog title="Filter scarves" onClose={() => setDrawer(false)} drawer><div className="px-5"><CollectionFilters products={products} filters={filters} onChange={updateFilter} prefix="mobile" /></div><div className="sticky bottom-0 flex items-center gap-3 border-t border-[#e4ded2] bg-[#fbfaf8] p-5"><button type="button" onClick={clearFilters} className="min-h-12 px-2 text-sm underline underline-offset-4">Reset</button><button type="button" onClick={() => setDrawer(false)} className="min-h-12 flex-1 rounded-md bg-brand-gold-ink px-3 font-heading text-sm text-white">Show {filtered.length} {filtered.length === 1 ? "scarf" : "scarves"}</button></div></ShopDialog> : null}
      {selectedProduct ? <ProductQuickView key={selectedProduct.id} product={selectedProduct} onClose={() => setSelectedProduct(null)} /> : null}
      <span className="sr-only">Browsing {collection.slug.replaceAll("-", " ")}</span>
    </section>
  );
}
