import { BestSellersGrid } from "@/components/local/best-sellers-grid";
import { HeroBanner } from "@/components/local/hero-banner";
import { ProductTabs } from "@/components/local/product-tabs";
import { ShopTheLook } from "@/components/local/shop-the-look";
import { SocialReviews } from "@/components/local/social-reviews";
import { SiteHeader } from "@/components/local/site-header";
import { SiteFooter } from "@/components/local/site-footer";
import { NewsletterSection } from "@/components/local/newsletter-section";
import { getHomepageCatalog } from "@/lib/catalog/get-homepage-catalog";
import { socialReviews } from "@/lib/social-reviews";

export const dynamic = "force-dynamic";

export default async function Home() {
  const catalog = await getHomepageCatalog();
  const bestSellers = catalog.products
    .filter((product) => product.tabs.includes("best-sellers"))
    .slice(0, 8);
  const shopTheLookProducts = catalog.products
    .filter((product) => product.images.length > 0)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#fbfaf8]">
      <SiteHeader />
      <main aria-label="Storefront content">
        <HeroBanner />
        <ProductTabs tabs={catalog.tabs} products={catalog.products} />
        <BestSellersGrid products={bestSellers} />
        {shopTheLookProducts.length ? (
          <ShopTheLook products={shopTheLookProducts} />
        ) : null}
        <SocialReviews reviews={socialReviews} />
        <NewsletterSection />
      </main>
      <SiteFooter />
    </div>
  );
}
