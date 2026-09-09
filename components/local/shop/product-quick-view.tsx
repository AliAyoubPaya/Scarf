"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { ShopDialog } from "@/components/local/shop/shop-dialog";
import type { CollectionProduct } from "@/lib/catalog/collections";

export function ProductQuickView({ product, onClose }: { product: CollectionProduct; onClose: () => void }) {
  const [index, setIndex] = useState(0);
  const image = product.images[index];
  return <ShopDialog title="A closer look" onClose={onClose}><div className="grid gap-6 p-5 sm:grid-cols-2 sm:items-center sm:gap-8 sm:p-7"><div className="relative aspect-[4/5] overflow-hidden bg-[#eee8df]"><Image src={image.src} alt={image.alt} fill sizes="(min-width: 640px) 380px, 85vw" className="object-cover" />{product.images.length > 1 ? <div className="absolute inset-x-3 bottom-3 flex items-center justify-between [&_button]:flex [&_button]:size-11 [&_button]:items-center [&_button]:justify-center [&_button]:rounded-full [&_button]:bg-white"><button type="button" aria-label="Previous product image" onClick={() => setIndex((index + product.images.length - 1) % product.images.length)}><ChevronLeft className="size-4" /></button><span className="rounded-full bg-white px-3 py-1 text-xs">{index + 1} / {product.images.length}</span><button type="button" aria-label="Next product image" onClick={() => setIndex((index + 1) % product.images.length)}><ChevronRight className="size-4" /></button></div> : null}</div><div><p className="text-xs uppercase tracking-[0.14em] text-brand-gold-ink">{product.fabric}</p><h3 className="mt-3 text-3xl font-light leading-tight">{product.name}</h3><p className="mt-4 text-lg">Rs. {product.price.toLocaleString("en-PK")}</p><dl className="mt-6 grid grid-cols-2 gap-y-3 border-y border-brand-gold-line py-5 text-sm [&_dt]:text-[#71695d]"><dt>Shade</dt><dd>{product.color}</dd><dt>Availability</dt><dd>{product.stockStatus === "in-stock" ? "In stock" : "Sold out"}</dd></dl><p className="mt-5 text-sm leading-6 text-[#71695d]">Explore the full product details to choose your colour, view its photos and check availability.</p><Link href={`/products/${product.slug}`} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-md bg-brand-gold-ink px-4 font-heading text-sm text-white hover:bg-[#604c22]">Choose your shade<ArrowUpRight aria-hidden="true" className="size-4" /></Link></div></div></ShopDialog>;
}
