"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useRef, useState } from "react";

import { CatalogProductCard } from "@/components/local/catalog-product-card";
import { SiteContainer } from "@/components/local/site-container";

import type {
  CatalogProduct,
  CatalogTab,
  ProductTabId,
} from "@/lib/catalog/products";

type ProductTabsProps = {
  tabs: CatalogTab[];
  products: CatalogProduct[];
};

export function ProductTabs({ tabs, products }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<ProductTabId>(tabs[0].id);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const visibleProducts = useMemo(
    () => products.filter((product) => product.tabs.includes(activeTab)),
    [activeTab, products],
  );

  const selectTab = (tabId: ProductTabId) => {
    setActiveTab(tabId);
    scrollerRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  };

  const moveTabFocus = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
  ) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (currentIndex + direction + tabs.length) % tabs.length;
    const nextTab = tabs[nextIndex];

    selectTab(nextTab.id);
    document.getElementById(`catalog-tab-${nextTab.id}`)?.focus();
  };

  const scrollProducts = (direction: -1 | 1) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    scroller.scrollBy({
      left: scroller.clientWidth * 0.82 * direction,
      behavior: "smooth",
    });
  };

  return (
    <section
      className="overflow-hidden bg-white py-16 text-[#26251f] sm:py-20 lg:py-24"
      aria-labelledby="signature-scarves-title"
    >
      <SiteContainer width="full">
        <header className="text-center">
          <h2
            id="signature-scarves-title"
            className="font-heading text-[0.93rem] font-medium uppercase tracking-[0.12em] sm:text-base"
          >
            Signature Scarves
          </h2>
          <span
            aria-hidden="true"
            className="mx-auto mt-4 block h-0.5 w-8 bg-brand-gold"
          />
        </header>

        <div
          className="mt-10 flex items-center justify-center gap-1 sm:mt-12 sm:gap-2 [&_button]:min-h-11 [&_button]:whitespace-nowrap [&_button]:rounded-full [&_button]:px-3 [&_button]:font-heading [&_button]:text-[0.7rem] [&_button]:font-medium [&_button]:uppercase [&_button]:tracking-[0.12em] [&_button]:transition-colors sm:[&_button]:px-5 sm:[&_button]:text-xs"
          role="tablist"
          aria-label="Shop scarves by collection"
        >
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              id={`catalog-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls="catalog-products-panel"
              tabIndex={activeTab === tab.id ? 0 : -1}
              className={
                activeTab === tab.id
                  ? "bg-brand-gold-soft text-brand-gold-ink ring-1 ring-inset ring-brand-gold-line"
                  : "bg-transparent text-[#5e5b53] hover:bg-brand-gold-soft hover:text-brand-gold-ink"
              }
              onClick={() => selectTab(tab.id)}
              onKeyDown={(event) => moveTabFocus(event, index)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          id="catalog-products-panel"
          role="tabpanel"
          aria-labelledby={`catalog-tab-${activeTab}`}
          className="relative mt-10 sm:mt-12"
        >
          <div
            ref={scrollerRef}
            className="grid snap-x snap-mandatory auto-cols-[84%] grid-flow-col gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] sm:auto-cols-[46%] sm:gap-5 lg:auto-cols-[calc((100%-4.5rem)/4)] lg:gap-6 [&::-webkit-scrollbar]:hidden"
          >
            {visibleProducts.map((product) => (
              <div key={product.id} className="snap-start">
                <CatalogProductCard
                  product={product}
                  imageSizes="(max-width: 639px) 84vw, (max-width: 1023px) 46vw, 24vw"
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            aria-label="Show previous products"
            onClick={() => scrollProducts(-1)}
            className="absolute left-2 top-[38%] z-40 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/92 text-[#2d2c27] shadow-[0_5px_24px_rgba(39,37,31,0.12)] backdrop-blur-sm transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold-ink sm:left-3 sm:size-11"
          >
            <ChevronLeft aria-hidden="true" className="size-4" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            aria-label="Show next products"
            onClick={() => scrollProducts(1)}
            className="absolute right-2 top-[38%] z-40 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/92 text-[#2d2c27] shadow-[0_5px_24px_rgba(39,37,31,0.12)] backdrop-blur-sm transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold-ink sm:right-3 sm:size-11"
          >
            <ChevronRight aria-hidden="true" className="size-4" strokeWidth={1.5} />
          </button>
        </div>
      </SiteContainer>
    </section>
  );
}
