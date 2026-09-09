"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState } from "react";

import type { CatalogProduct } from "@/lib/catalog/products";

type ShopTheLookProps = {
  products: CatalogProduct[];
};

const hotspotPositions = [
  { left: "62%", top: "34%" },
  { left: "72%", top: "54%" },
  { left: "52%", top: "72%" },
];

export function ShopTheLook({ products }: ShopTheLookProps) {
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const activeProduct = products[activeProductIndex] ?? products[0];

  if (!activeProduct) return null;

  const selectPreviousProduct = () => {
    setActiveProductIndex((current) =>
      current === 0 ? products.length - 1 : current - 1,
    );
  };

  const selectNextProduct = () => {
    setActiveProductIndex((current) => (current + 1) % products.length);
  };

  return (
    <section
      className="grid overflow-hidden bg-[#f5f5f3] text-[#26251f] lg:min-h-[760px] lg:grid-cols-2 xl:min-h-[820px]"
      aria-labelledby="shop-the-look-title"
    >
      <div className="flex items-center justify-center px-[var(--site-gutter)] py-16 sm:py-20 lg:py-24">
        <div className="w-full max-w-[520px]">
          <header className="text-center">
            <h2
              id="shop-the-look-title"
              className="font-heading text-[0.93rem] font-medium uppercase tracking-[0.12em] sm:text-base"
            >
              Shop the look
            </h2>
            <span
              aria-hidden="true"
              className="mx-auto mt-4 block h-0.5 w-8 bg-brand-gold"
            />
          </header>

          <div className="relative mx-auto mt-12 w-full max-w-[500px]">
            <div
              key={activeProduct.id}
              id="shop-the-look-product"
              className="animate-in fade-in mx-auto w-[calc(100%-5rem)] max-w-[350px] bg-white p-3 duration-300 sm:p-5"
            >
              <Link
                href={`/products/${activeProduct.slug}`}
                className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold-ink"
              >
                <div className="relative aspect-[9/10] overflow-hidden bg-[#f1f0ed]">
                  <Image
                    src={activeProduct.images[0].src}
                    alt={activeProduct.images[0].alt}
                    fill
                    sizes="(max-width: 639px) 72vw, 330px"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.015]"
                  />
                </div>
                <div className="px-2 pb-1 pt-5 text-center [&_p]:font-paragraph">
                  <h3 className="font-heading text-[0.95rem] font-medium leading-snug sm:text-base">
                    {activeProduct.name}
                  </h3>
                  <p className="mt-1 text-[0.78rem] text-[#3e3c37] sm:text-sm">
                    {activeProduct.color} <span aria-hidden="true">|</span> Rs. {activeProduct.price.toLocaleString("en-PK")}
                  </p>
                </div>
              </Link>
            </div>

            <button
              type="button"
              aria-label="Show previous look product"
              onClick={selectPreviousProduct}
              className="absolute left-1 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#292823] shadow-[0_5px_20px_rgba(35,31,25,0.08)] transition hover:bg-brand-gold-ink hover:text-white focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-brand-gold-ink sm:left-3"
            >
              <ChevronLeft aria-hidden="true" className="size-4" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              aria-label="Show next look product"
              onClick={selectNextProduct}
              className="absolute right-1 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#292823] shadow-[0_5px_20px_rgba(35,31,25,0.08)] transition hover:bg-brand-gold-ink hover:text-white focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-brand-gold-ink sm:right-3"
            >
              <ChevronRight aria-hidden="true" className="size-4" strokeWidth={1.5} />
            </button>
          </div>

          <div
            className="mx-auto mt-10 flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2.5"
            role="tablist"
            aria-label="Choose a look product"
          >
            {products.map((product, index) => (
              <button
                key={product.id}
                type="button"
                role="tab"
                aria-selected={index === activeProductIndex}
                aria-controls="shop-the-look-product"
                aria-label={`Show ${product.name}`}
                onClick={() => setActiveProductIndex(index)}
                className="flex size-4 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold-ink"
              >
                <span
                  aria-hidden="true"
                  className={`rounded-full transition-all ${
                    index === activeProductIndex
                      ? "size-1.5 bg-brand-gold-ink"
                      : "size-1 bg-[#bdbab3]"
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="sr-only" aria-live="polite">
            {activeProduct.name} selected
          </p>
        </div>
      </div>

      <div className="relative min-h-[500px] overflow-hidden sm:min-h-[620px] lg:min-h-full">
        <Image
          src="/images/shop-the-look-cocoa-modal.png"
          alt="Woman wearing the Cocoa Cloud Modal Hijab in a warm walnut interior"
          fill
          sizes="(max-width: 1023px) 100vw, 50vw"
          className="object-cover object-[56%_center]"
        />

        {hotspotPositions.slice(0, products.length).map((position, index) => {
          const product = products[index];
          const isActive = index === activeProductIndex;

          return (
            <button
              key={product.id}
              type="button"
              aria-label={`Show ${product.name}`}
              aria-pressed={isActive}
              aria-controls="shop-the-look-product"
              onClick={() => setActiveProductIndex(index)}
              style={position}
              className={`absolute z-10 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 shadow-[0_5px_20px_rgba(31,22,15,0.25)] outline-none transition duration-200 before:absolute before:inset-0 before:rounded-full before:bg-white/35 before:content-[''] hover:scale-110 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#473020] motion-reduce:before:animate-none ${
                isActive
                  ? "scale-105 before:animate-ping"
                  : "before:opacity-0"
              }`}
            >
              <span
                aria-hidden="true"
                className={`relative flex items-center justify-center rounded-full text-[#34261d] transition-all ${
                  isActive ? "size-4 text-brand-gold-ink" : "size-1.5 bg-[#34261d]"
                }`}
              >
                {isActive ? <X className="size-3" strokeWidth={1.6} /> : null}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
