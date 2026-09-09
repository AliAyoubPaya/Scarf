import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { collections } from "@/lib/catalog/collections";
import { getCollectionCatalog } from "@/lib/catalog/get-collection-catalog";
import { SiteHeader } from "@/components/local/site-header";
import { SiteFooter } from "@/components/local/site-footer";
import { CollectionHero } from "@/components/local/shop/collection-hero";
import { CollectionShop } from "@/components/local/shop/collection-shop";
import { CollectionHelp } from "@/components/local/shop/collection-help";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const collection = collections.find((entry) => entry.slug === slug);
  return { title: `${collection?.title ?? "Collection not found"} — HS by Saman`, description: collection?.description };
}

export default async function CollectionPage({ params }: PageProps<"/collections/[slug]">) {
  const catalog = await getCollectionCatalog((await params).slug);
  if (!catalog) notFound();
  return (
    <div className="min-h-screen bg-[#fbfaf8] text-[#302a23]">
      <SiteHeader />
      <main className="[&_button]:cursor-pointer [&_a]:focus-visible:outline-2 [&_a]:focus-visible:outline-offset-4 [&_a]:focus-visible:outline-brand-gold-ink [&_button]:focus-visible:outline-2 [&_button]:focus-visible:outline-offset-4 [&_button]:focus-visible:outline-brand-gold-ink">
        <CollectionHero collection={catalog.collection} />
        <Suspense fallback={<div role="status" className="min-h-96 p-12 text-center">Loading your collection…</div>}>
          <CollectionShop key={catalog.collection.slug} products={catalog.products} collection={catalog.collection} />
        </Suspense>
        <CollectionHelp />
      </main>
      <SiteFooter />
    </div>
  );
}
