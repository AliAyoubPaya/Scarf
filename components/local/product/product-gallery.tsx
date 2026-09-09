"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import type { CatalogProduct } from "@/lib/catalog/products";
import { ShopDialog } from "@/components/local/shop/shop-dialog";

export function ProductGallery({ product }: { product: CatalogProduct }) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const move = (step: number) => setIndex((current) => (current + step + product.images.length) % product.images.length);
  const current = product.images[index];
  const controls = <div className="flex items-center justify-between gap-4 [&_button]:flex [&_button]:size-11 [&_button]:items-center [&_button]:justify-center [&_button]:rounded-full [&_button]:bg-white [&_button]:shadow-sm"><button type="button" aria-label="Previous image" onClick={() => move(-1)}><ChevronLeft className="size-4" /></button><span aria-live="polite" className="rounded-full bg-white/95 px-4 py-2 text-xs tabular-nums">{index + 1} / {product.images.length}</span><button type="button" aria-label="Next image" onClick={() => move(1)}><ChevronRight className="size-4" /></button></div>;
  return <div className="min-w-0">
    <div className="relative aspect-[4/5] overflow-hidden rounded-t-[5rem] bg-[#eee9df] sm:rounded-t-[7rem]" onTouchStart={(event) => { touch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }} onTouchEnd={(event) => { if (!touch.current) return; const dx = event.changedTouches[0].clientX - touch.current.x; const dy = event.changedTouches[0].clientY - touch.current.y; if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1); touch.current = null; }}>
      <button type="button" onClick={() => setZoom(true)} aria-label={`Zoom image ${index + 1} of ${product.name}`} className="absolute inset-0 cursor-zoom-in">
        {product.images.map((image, imageIndex) => <Image key={image.src} src={image.src} alt={imageIndex === index ? image.alt : ""} fill loading={imageIndex === 0 ? "eager" : "lazy"} fetchPriority={imageIndex === 0 ? "high" : "auto"} sizes="(min-width: 1440px) 710px, (min-width: 1024px) 52vw, (min-width: 768px) 50vw, 100vw" className={`object-cover transition-opacity duration-300 motion-reduce:transition-none ${imageIndex === index ? "opacity-100" : "opacity-0"}`} />)}
        <span className="absolute right-5 top-7 flex size-10 items-center justify-center rounded-full bg-white/90"><Expand aria-hidden="true" className="size-4" /></span>
      </button>
      <span className="pointer-events-none absolute left-4 top-7 rounded-full bg-white/90 px-3 py-2 text-[0.6rem] uppercase tracking-[0.15em] sm:left-6">A closer look</span>
      <div className="absolute inset-x-4 bottom-4">{controls}</div>
    </div>
    <div className="mt-4 flex items-center gap-3">{product.images.map((image, imageIndex) => <button key={image.src} type="button" onClick={() => setIndex(imageIndex)} aria-label={`Show image ${imageIndex + 1}`} aria-pressed={imageIndex === index} className={`relative aspect-[4/5] w-16 overflow-hidden rounded-sm border-2 p-1 sm:w-20 ${imageIndex === index ? "border-brand-gold-ink" : "border-transparent opacity-65 hover:opacity-100"}`}><Image src={image.src} alt="" fill sizes="80px" className="object-cover" /></button>)}<p className="ml-auto max-w-36 text-right text-xs leading-5 text-[#82796a]">The details make<br />all the difference.</p></div>
    {zoom ? <ShopDialog title="Explore the details" onClose={() => setZoom(false)}><div className="relative h-[65dvh] bg-[#eee9df]"><Image src={current.src} alt={current.alt} fill sizes="800px" className="object-contain" /></div><div className="px-5 py-3">{controls}</div></ShopDialog> : null}
  </div>;
}
