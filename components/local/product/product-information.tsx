"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, LockKeyhole, Minus, Plus, Share2, ShoppingBag } from "lucide-react";
import type { CollectionProduct } from "@/lib/catalog/collections";
import type { CatalogVariant } from "@/lib/catalog/products";
import { ProductColorLinks } from "@/components/local/product/product-color-links";
import { productOptionHref } from "@/lib/catalog/product-colors";
import { productStory } from "@/lib/catalog/product-details";
import { cartRequest, checkout } from "@/lib/commerce/cart-client";

type Props = { product: CollectionProduct; variant: CatalogVariant; colors: CollectionProduct[]; ready: boolean };
export function ProductInformation({ product, variant, colors, ready }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [pending, setPending] = useState<"bag" | "checkout" | null>(null);
  const busy = useRef(false);
  const confirmedSelection = useRef<string | null>(null);
  const [notice, setNotice] = useState("");
  const [added, setAdded] = useState(false);
  const soldOut = variant.stockStatus === "sold-out";
  const canBuy = ready && product.commerce?.synced && variant.purchasable && !soldOut;
  const price = "Rs. " + variant.price.toLocaleString("en-PK");

  async function purchase(buyNow = false) {
    if (!canBuy || busy.current) return;
    busy.current = true;
    setPending(buyNow ? "checkout" : "bag"); setNotice(""); setAdded(false);
    try {
      const selection = `${variant.id}:${quantity}`;
      // Retrying a failed checkout handoff must not add the same quantity again.
      if (!buyNow || confirmedSelection.current !== selection) {
        await cartRequest("POST", { slug: product.slug, variantId: variant.id, quantity });
        confirmedSelection.current = selection;
      }
      setAdded(true);
      setNotice(quantity + " × " + variant.label + " added to your bag.");
      if (buyNow) await checkout();
    } catch (error) { setNotice(error instanceof Error ? error.message : "Please check your bag before trying again."); }
    finally { busy.current = false; setPending(null); }
  }
  async function share() {
    try {
      if (navigator.share) await navigator.share({ title: product.name, url: window.location.href });
      else { await navigator.clipboard.writeText(window.location.href); setNotice("Product link copied."); }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) setNotice("Copy the page address from your browser to share this scarf.");
    }
  }

  return <div className="min-w-0 md:pt-4 lg:sticky lg:top-36 lg:self-start [&_button]:disabled:cursor-not-allowed [&_button]:disabled:opacity-45">
    <div className="flex items-center justify-between gap-3">
      <p className="text-[0.65rem] uppercase tracking-[0.2em] text-brand-gold-ink">HS by Saman / {product.fabric}</p>
      <button type="button" aria-label="Share this scarf" onClick={share} className="flex size-11 shrink-0 items-center justify-center rounded-full border border-brand-gold-line hover:bg-brand-gold-soft"><Share2 className="size-4" strokeWidth={1.5} /></button>
    </div>
    <h1 className="mt-3 max-w-lg font-heading text-[2.15rem] font-light leading-[1.12] tracking-[-0.035em] sm:text-4xl lg:text-[2.8rem]">{product.name}</h1>
    <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2" aria-live="polite">
      <p className="font-heading text-2xl">{price}</p>
      <span className="flex items-center gap-2 text-xs text-[#71695d]"><span className="size-1.5 rounded-full bg-current" />{soldOut ? "Sold out in this shade" : !product.commerce?.synced ? "Preview collection" : !variant.purchasable ? "Currently unavailable" : variant.backorder ? "Available on backorder" : "In stock"}</span>
    </div>
    <p className="mt-5 text-sm leading-7 text-[#71695d]">{productStory(product)}</p>
    <ProductColorLinks product={product} products={colors} disabled={!!pending} />
    {(product.variants?.length || 0) > 1 ? <nav aria-label="Product options" className="mb-6">
      <p className="text-xs text-[#71695d]">Size / option <span className="ml-2 text-[#302a23]">{variant.label}</span></p>
      <div className="mt-3 flex flex-wrap gap-2 [&_a]:flex [&_a]:min-h-11 [&_a]:min-w-11 [&_a]:items-center [&_a]:justify-center [&_a]:rounded [&_a]:border [&_a]:px-3 [&_a]:text-xs">
        {product.variants?.map((option) => <Link key={option.id} href={productOptionHref(product, option)} scroll={false} aria-current={option.id === variant.id ? "true" : undefined} aria-disabled={!!pending || undefined} onNavigate={(event) => { if (pending) event.preventDefault(); }} className={option.id === variant.id ? "border-brand-gold-ink bg-brand-gold-soft" : "border-[#ded6c8] hover:border-brand-gold-ink"}>{option.label}{option.stockStatus === "sold-out" ? " · Sold out" : ""}</Link>)}
      </div>
    </nav> : null}
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-[#71695d]">Quantity</span>
      <div className="flex h-11 items-center rounded border border-[#ded6c8] [&_button]:flex [&_button]:size-11 [&_button]:items-center [&_button]:justify-center">
        <button type="button" aria-label="Decrease quantity" disabled={quantity === 1 || !!pending} onClick={() => setQuantity((n) => Math.max(1, n - 1))}><Minus className="size-3" /></button>
        <output aria-live="polite" aria-label="Quantity" className="w-10 text-center text-sm tabular-nums">{quantity}</output>
        <button type="button" aria-label="Increase quantity" disabled={quantity === 99 || !!pending} onClick={() => setQuantity((n) => Math.min(99, n + 1))}><Plus className="size-3" /></button>
      </div>
    </div>
    <button type="button" disabled={!canBuy || !!pending} onClick={() => purchase()} className="mt-4 flex min-h-14 w-full items-center justify-center gap-3 rounded bg-brand-gold-ink px-4 font-heading text-sm tracking-wide text-white hover:bg-[#604c22]"><ShoppingBag className="size-4" />{pending === "bag" ? "Adding to bag…" : soldOut ? "Sold out" : "Add to bag"}</button>
    <button type="button" disabled={!canBuy || !!pending} onClick={() => purchase(true)} className="mt-3 flex min-h-12 w-full items-center justify-center gap-3 rounded border border-brand-gold-line px-4 text-sm hover:bg-brand-gold-soft">{pending === "checkout" ? "Opening checkout…" : "Buy now"}<ArrowRight className="size-4" /></button>
    <p className="mt-3 text-center text-xs leading-5 text-[#82796a]">{ready && product.commerce?.synced ? "Secure checkout on our WooCommerce store. Delivery and taxes are confirmed at checkout." : "Online shopping is being connected. Explore colours now; checkout will be available once the store is ready."}</p>
    <div aria-live="polite" className="mt-3 text-sm leading-6 text-brand-gold-ink">{notice}{added ? <Link href="/cart" className="ml-2 underline underline-offset-4">View your bag</Link> : null}</div>
    <div className="mt-5 flex items-center gap-3 rounded-lg bg-[#f3efe6] p-4 text-xs leading-5"><LockKeyhole className="size-5 shrink-0 text-brand-gold-ink" strokeWidth={1.3} /><p>Need a little help with your choice?<br /><Link href="/pages/contact" className="text-brand-gold-ink underline underline-offset-4">Talk to the HS by Saman team</Link></p></div>
    <div className="mt-6 divide-y divide-[#e6e0d6] border-y border-[#e6e0d6] [&_summary]:flex [&_summary]:min-h-14 [&_summary]:cursor-pointer [&_summary]:list-none [&_summary]:items-center [&_summary]:justify-between [&_summary]:gap-3 [&_summary]:font-heading [&_summary]:text-sm [&_summary::-webkit-details-marker]:hidden [&_summary_svg]:size-4 [&_details[open]_summary_svg]:rotate-180 [&_details>div]:pb-5 [&_details>div]:text-sm [&_details>div]:leading-6 [&_details>div]:text-[#71695d]">
      <details open><summary>The finer details<ChevronDown /></summary><div><dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 [&_dd]:text-right"><dt>Fabric collection</dt><dd>{product.fabric}</dd><dt>Shade / option</dt><dd>{variant.label}</dd><dt>Product reference</dt><dd>HS-{product.source.externalId}</dd></dl><p className="mt-4 text-xs leading-5">Please confirm exact composition and dimensions with our team. Colours can appear different in photographs and on different screens.</p></div></details>
      <details><summary>Care for your scarf<ChevronDown /></summary><div>Always follow the care label supplied with your scarf. Ask our team for fabric-specific washing and ironing instructions before cleaning.</div></details>
      <details><summary>Delivery &amp; exchanges<ChevronDown /></summary><div>Shipping options and charges are calculated in WooCommerce checkout. For exchange eligibility and delivery estimates, <Link href="/pages/contact" className="text-brand-gold-ink underline underline-offset-4">talk to our team</Link> before ordering.</div></details>
    </div>
    <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-brand-gold-line bg-[#fbfaf8]/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md md:hidden"><div className="min-w-0"><p className="truncate text-xs text-[#71695d]">{variant.label}</p><p className="mt-1 font-heading text-sm">{price}</p></div><button type="button" disabled={!canBuy || !!pending} onClick={() => purchase()} className="min-h-11 shrink-0 rounded bg-brand-gold-ink px-5 font-heading text-xs text-white">{pending ? "Please wait…" : soldOut ? "Sold out" : "Add to bag"}</button></div>
  </div>;
}
