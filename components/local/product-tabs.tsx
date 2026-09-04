"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import type {
  CatalogProduct,
  CatalogTab,
  ProductTabId,
} from "@/lib/catalog/products";

type ProductTabsProps = {
  tabs: CatalogTab[];
  products: CatalogProduct[];
};

function formatPrice(price: number) {
  return `Rs. ${new Intl.NumberFormat("en-PK").format(price)}`;
}

type ProductCardProps = {
  product: CatalogProduct;
  isAdded: boolean;
  onQuickAdd: (product: CatalogProduct) => void;
};

function ProductCard({ product, isAdded, onQuickAdd }: ProductCardProps) {
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const stopPreview = () => {
    setIsPreviewing(false);
    setCurrentImage(0);
  };

  return (
    <article
      className="group min-w-0 snap-start"
      onMouseEnter={() => setIsPreviewing(true)}
      onMouseLeave={stopPreview}
      onFocusCapture={() => setIsPreviewing(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) stopPreview();
      }}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#f3f1ec]">
        <Link
          href={`/products/${product.slug}`}
          className="absolute inset-0 z-10 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#3f4937]"
          aria-label={`View ${product.name}`}
        >
          {product.images.map((image, index) => (
            <Image
              key={image.src}
              src={image.src}
              alt={index === currentImage ? image.alt : ""}
              fill
              sizes="(max-width: 639px) 84vw, (max-width: 1023px) 46vw, 24vw"
              className={`object-cover transition-[opacity,transform] duration-500 ease-out ${
                index === currentImage
                  ? "scale-100 opacity-100"
                  : "scale-[1.015] opacity-0"
              }`}
            />
          ))}
        </Link>

        <div className="pointer-events-none absolute inset-x-3 top-3 z-20 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:hidden sm:inset-x-4 sm:top-4">
          {product.images.map((image, index) => (
            <span
              key={image.src}
              className="h-px flex-1 overflow-hidden bg-white/45 shadow-[0_1px_2px_rgba(0,0,0,0.12)]"
            >
              {isPreviewing && index === currentImage ? (
                <span
                  key={`${product.id}-${currentImage}`}
                  className="block size-full origin-left animate-[catalog-preview-progress_3200ms_linear_forwards] bg-white"
                  onAnimationEnd={() =>
                    setCurrentImage((current) =>
                      current === product.images.length - 1 ? 0 : current + 1,
                    )
                  }
                />
              ) : index < currentImage ? (
                <span className="block size-full bg-white" />
              ) : null}
            </span>
          ))}
        </div>

        {product.stockStatus === "sold-out" ? (
          <span className="absolute right-3 top-3 z-30 bg-white px-3 py-2 font-heading text-[0.66rem] font-medium uppercase tracking-[0.12em] text-[#292823] sm:right-4 sm:top-4">
            Sold out
          </span>
        ) : (
          <button
            type="button"
            onClick={() => onQuickAdd(product)}
            className="absolute inset-x-3 bottom-3 z-30 flex min-h-12 translate-y-0 items-center justify-center bg-white px-5 font-heading text-[0.7rem] font-medium uppercase tracking-[0.13em] text-[#292823] shadow-[0_6px_24px_rgba(35,32,25,0.12)] transition duration-300 hover:bg-[#272620] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3f4937] md:translate-y-[calc(100%+0.75rem)] md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100"
            aria-label={`Quick add ${product.name} to bag`}
          >
            {isAdded ? "Added to bag" : "Quick add"}
          </button>
        )}
      </div>

      <Link
        href={`/products/${product.slug}`}
        className="block pt-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3f4937] sm:pt-[1.1rem] [&_p]:font-paragraph"
      >
        <h3 className="font-heading text-[0.95rem] font-medium leading-snug tracking-[-0.01em] sm:text-base">
          {product.name}
        </h3>
        <p className="mt-1.5 text-sm leading-5 text-[#4d4b45] sm:text-[0.93rem]">
          {product.color} <span aria-hidden="true">|</span>{" "}
          {formatPrice(product.price)}
        </p>
        {product.stockStatus === "sold-out" ? (
          <p className="mt-1 text-sm italic text-[#7a3430]">Sold out</p>
        ) : null}
        <p className="mt-2 text-[0.7rem] font-medium uppercase tracking-[0.1em] text-[#66635c] sm:text-xs">
          {product.colorCount} colors available
        </p>
      </Link>
    </article>
  );
}

export function ProductTabs({ tabs, products }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<ProductTabId>(tabs[0].id);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const quickAddTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (quickAddTimerRef.current) clearTimeout(quickAddTimerRef.current);
    },
    [],
  );

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

  const handleQuickAdd = (product: CatalogProduct) => {
    setAddedProductId(product.id);
    if (quickAddTimerRef.current) clearTimeout(quickAddTimerRef.current);

    window.dispatchEvent(
      new CustomEvent("scarf:quick-add", {
        detail: {
          productId: product.id,
          wooCommerceId: product.source.externalId,
        },
      }),
    );

    quickAddTimerRef.current = setTimeout(() => setAddedProductId(null), 1800);
  };

  return (
    <section
      className="overflow-hidden bg-white px-4 py-16 text-[#26251f] sm:px-7 sm:py-20 lg:px-10 lg:py-24"
      aria-labelledby="signature-scarves-title"
    >
      <div className="mx-auto max-w-[1480px]">
        <header className="text-center">
          <h2
            id="signature-scarves-title"
            className="font-heading text-[0.93rem] font-medium uppercase tracking-[0.12em] sm:text-base"
          >
            Signature Scarves
          </h2>
          <span
            aria-hidden="true"
            className="mx-auto mt-4 block h-0.5 w-8 bg-[#d6d3cc]"
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
                  ? "bg-[#f1f0ed] text-[#24231f]"
                  : "bg-transparent text-[#5e5b53] hover:bg-[#f7f6f3] hover:text-[#24231f]"
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
              <ProductCard
                key={product.id}
                product={product}
                isAdded={addedProductId === product.id}
                onQuickAdd={handleQuickAdd}
              />
            ))}
          </div>

          <button
            type="button"
            aria-label="Show previous products"
            onClick={() => scrollProducts(-1)}
            className="absolute left-2 top-[38%] z-40 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/92 text-[#2d2c27] shadow-[0_5px_24px_rgba(39,37,31,0.12)] backdrop-blur-sm transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3f4937] sm:left-3 sm:size-11"
          >
            <ChevronLeft aria-hidden="true" className="size-4" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            aria-label="Show next products"
            onClick={() => scrollProducts(1)}
            className="absolute right-2 top-[38%] z-40 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/92 text-[#2d2c27] shadow-[0_5px_24px_rgba(39,37,31,0.12)] backdrop-blur-sm transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3f4937] sm:right-3 sm:size-11"
          >
            <ChevronRight aria-hidden="true" className="size-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </section>
  );
}
