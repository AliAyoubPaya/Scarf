import Link from "next/link";

import { CatalogProductCard } from "@/components/local/catalog-product-card";
import { SiteContainer } from "@/components/local/site-container";
import type { CatalogProduct } from "@/lib/catalog/products";

type BestSellersGridProps = {
  products: CatalogProduct[];
};

export function BestSellersGrid({ products }: BestSellersGridProps) {
  return (
    <section
      className="bg-[#fbfaf8] py-16 text-[#26251f] sm:py-20 lg:py-24"
      aria-labelledby="best-sellers-title"
    >
      <SiteContainer>
        <header className="text-center">
          <h2
            id="best-sellers-title"
            className="font-heading text-[0.93rem] font-medium uppercase tracking-[0.12em] sm:text-base"
          >
            Best Sellers
          </h2>
          <span
            aria-hidden="true"
            className="mx-auto mt-4 block h-0.5 w-8 bg-[#d6d3cc]"
          />
        </header>

        <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-9 sm:mt-12 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-11 lg:grid-cols-4 lg:gap-x-5 lg:gap-y-12">
          {products.map((product) => (
            <CatalogProductCard
              key={product.id}
              product={product}
              compact
              imageSizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 25vw"
            />
          ))}
        </div>

        <div className="mt-12 flex justify-center sm:mt-14">
          <Link
            href="/collections/best-sellers"
            className="inline-flex min-h-11 items-center justify-center border border-[#383731] px-7 font-heading text-[0.68rem] font-medium uppercase tracking-[0.14em] text-[#292823] transition-colors hover:bg-[#272620] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3f4937]"
          >
            View all
          </Link>
        </div>
      </SiteContainer>
    </section>
  );
}
