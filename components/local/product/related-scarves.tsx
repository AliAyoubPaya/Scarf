import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CollectionProduct } from "@/lib/catalog/collections";
import { CatalogProductCard } from "@/components/local/catalog-product-card";
import { SiteContainer } from "@/components/local/site-container";

export function RelatedScarves({ products }: { products: CollectionProduct[] }) {
  return <section aria-labelledby="related-scarves" className="border-t border-[#e6e0d6] py-12 sm:py-16"><SiteContainer width="full"><div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="text-[0.65rem] uppercase tracking-[0.2em] text-brand-gold-ink">A little more to love</p><h2 id="related-scarves" className="mt-2 font-heading text-3xl font-light tracking-tight sm:text-4xl">Find your next favourite.</h2></div><Link href="/collections/all" className="inline-flex min-h-11 items-center gap-2 text-xs text-brand-gold-ink underline underline-offset-4">Explore the collection<ArrowUpRight className="size-4" /></Link></div><div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">{products.map((product) => <CatalogProductCard key={product.id} product={product} />)}</div></SiteContainer></section>;
}
