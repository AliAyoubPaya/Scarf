"use client";

import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import type { CatalogProduct } from "@/lib/catalog/products";
import { productOptionHref } from "@/lib/catalog/product-colors";
import { swatchFor } from "@/lib/commerce/normalize-product";

export function ProductColorLinks({ product, products, disabled = false }: { product: CatalogProduct; products: CatalogProduct[]; disabled?: boolean }) {
  return <nav aria-label="Product colours" className="my-6 border-y border-[#e6e0d6] py-5">
    <div className="flex items-baseline justify-between gap-4">
      <p className="font-heading text-sm font-medium">Choose a colour</p>
      <p className="text-xs text-[#71695d]">Selected: <span className="font-medium text-[#302a23]">{product.color}</span></p>
    </div>
    <div className="mt-4 flex flex-wrap gap-2 [&_a]:relative [&_a]:inline-flex [&_a]:min-h-10 [&_a]:items-center [&_a]:gap-2 [&_a]:rounded-full [&_a]:border [&_a]:px-2.5 [&_a]:pr-3.5 [&_a]:text-[0.7rem] [&_a]:transition-colors">
      {products.map((item) => {
        const selected = item.id === product.id;
        const hex = swatchFor(item.color);
        const soldOut = item.stockStatus === "sold-out";
        return <Link key={item.id} href={productOptionHref(item)} scroll={false}
          aria-current={selected ? "page" : undefined} aria-disabled={disabled || undefined}
          aria-label={`${item.color}${soldOut ? ", sold out" : ""} — ${item.name}`}
          title={`${item.color}${soldOut ? " — sold out" : ""}`}
          onNavigate={(event) => { if (disabled) event.preventDefault(); }}
          className={selected ? "border-brand-gold-ink bg-brand-gold-soft text-[#302a23]" : "border-[#ded6c8] bg-white text-[#625b51] hover:border-brand-gold-line hover:bg-[#faf7f1]"}>
          <span aria-hidden="true" className="relative block size-6 shrink-0 overflow-hidden rounded-full border border-black/10 bg-[#e6dfd2]" style={{ backgroundColor: hex }}>
            {!hex && item.images[0] ? <Image src={item.images[0].src} alt="" fill sizes="24px" className="object-cover" /> : null}
            {soldOut ? <span className="absolute inset-x-0 top-1/2 h-px -rotate-45 bg-[#302a23]" /> : null}
            {selected ? <span className="absolute inset-0 flex items-center justify-center bg-black/15"><Check className="size-3.5 text-white drop-shadow" strokeWidth={2.25} /></span> : null}
          </span>
          <span>{item.color}</span>
        </Link>;
      })}
    </div>
    <p className="mt-3 text-xs leading-5 text-[#82796a]">{products.length > 1 ? "Select a shade to view its own photos, stock and product page." : "Available in this colour."}</p>
  </nav>;
}
