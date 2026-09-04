import { HeroBanner } from "@/components/local/hero-banner";
import { ProductTabs } from "@/components/local/product-tabs";
import { SiteHeader } from "@/components/local/site-header";
import { getHomepageCatalog } from "@/lib/catalog/get-homepage-catalog";

export default async function Home() {
  const catalog = await getHomepageCatalog();

  return (
    <div className="min-h-screen bg-[#fbfaf8]">
      <SiteHeader />
      <main aria-label="Storefront content">
        <HeroBanner />
        <ProductTabs tabs={catalog.tabs} products={catalog.products} />
      </main>
    </div>
  );
}
