"use client";

import Image from "next/image";
import Link from "next/link";
import type { CatalogProduct } from "@/lib/catalog/products";
import { productOptionHref } from "@/lib/catalog/product-colors";
import { swatchFor } from "@/lib/commerce/normalize-product";

export function ProductColorLinks({ product, products, disabled = false }: { product: CatalogProduct; products: CatalogProduct[]; disabled?: boolean }) {
  return <nav aria-label="Product colours" className="my-6 border-y border-[#e6e0d6] py-5">
    <p className="text-xs text-[#71695d]">Colour <span className="ml-2 font-medium text-[#302a23]">{product.color}</span></p>
    <div className="mt-3 flex flex-wrap gap-2 [&_a]:relative [&_a]:flex [&_a]:size-11 [&_a]:items-center [&_a]:justify-center [&_a]:rounded-full [&_a]:border [&_a]:p-1 [&_a]:transition-colors">
      {products.map((item) => {
        const selected = item.id === product.id;
        const hex = swatchFor(item.color);
        const soldOut = item.stockStatus === "sold-out";
        return <Link key={item.id} href={productOptionHref(item)} scroll={false}
          aria-current={selected ? "page" : undefined} aria-disabled={disabled || undefined}
          aria-label={`${item.color}${soldOut ? ", sold out" : ""} — ${item.name}`}
          title={`${item.color}${soldOut ? " — sold out" : ""}`}
          onNavigate={(event) => { if (disabled) event.preventDefault(); }}
          className={selected ? "border-brand-gold-ink" : "border-transparent hover:border-brand-gold-line"}>
          <span aria-hidden="true" className="relative block size-full overflow-hidden rounded-full border border-black/10 bg-[#e6dfd2]" style={{ backgroundColor: hex }}>
            {!hex && item.images[0] ? <Image src={item.images[0].src} alt="" fill sizes="34px" className="object-cover" /> : null}
            {soldOut ? <span className="absolute inset-x-0 top-1/2 h-px -rotate-45 bg-[#302a23]" /> : null}
          </span>
        </Link>;
      })}
    </div>
    <p className="mt-2 text-xs leading-5 text-[#82796a]">{products.length > 1 ? "Explore each colour’s photos and availability." : "Available in this colour."}</p>
  </nav>;
}
