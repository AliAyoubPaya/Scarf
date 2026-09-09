import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getCatalogProducts } from "@/lib/catalog/get-collection-catalog";
import { productStory, relatedProducts } from "@/lib/catalog/product-details";
import { SiteHeader } from "@/components/local/site-header";
import { SiteFooter } from "@/components/local/site-footer";
import { SiteContainer } from "@/components/local/site-container";
import { ProductDetails } from "@/components/local/product/product-details";
import { commerceReady } from "@/lib/commerce/config";
import { colorProductsFor, selectedProductOption } from "@/lib/catalog/product-colors";
import { RelatedScarves } from "@/components/local/product/related-scarves";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const selected = (await getCatalogProducts()).find((item) => item.slug === slug);
  return { title: `${selected?.name ?? "Product not found"} — HS by Saman`, description: selected ? productStory(selected) : undefined, alternates: selected ? { canonical: `/products/${encodeURIComponent(selected.slug)}` } : undefined };
}
export default async function ProductPage({ params, searchParams }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const catalog = await getCatalogProducts();
  const product = catalog.find((item) => item.slug === slug);
  if (!product) notFound();
  const variant = selectedProductOption(product, (await searchParams).variant);
  return (
    <div className="min-h-screen bg-[#fbfaf8] pb-20 text-[#302a23] md:pb-0">
      <SiteHeader />
      <main className="[&_button]:cursor-pointer [&_button]:font-heading [&_a]:focus-visible:outline-2 [&_a]:focus-visible:outline-offset-4 [&_a]:focus-visible:outline-brand-gold-ink [&_button]:focus-visible:outline-2 [&_button]:focus-visible:outline-offset-4 [&_button]:focus-visible:outline-brand-gold-ink [&_summary]:focus-visible:outline-2 [&_summary]:focus-visible:outline-brand-gold-ink">
        <SiteContainer>
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 py-5 text-[0.65rem] text-[#82796a] sm:py-7">
            <Link href="/">Home</Link><ChevronRight aria-hidden="true" className="size-3" />
            <Link href="/collections/all">Scarves &amp; hijabs</Link><ChevronRight aria-hidden="true" className="size-3" />
            <span aria-current="page" className="text-[#302a23]">{product.name}</span>
          </nav>
          <ProductDetails key={`${product.id}:${variant.id}`} product={product} colors={colorProductsFor(product, catalog)} variant={variant} ready={commerceReady()} />
        </SiteContainer>
        <RelatedScarves products={relatedProducts(product, catalog)} />
      </main>
      <SiteFooter />
    </div>
  );
}
