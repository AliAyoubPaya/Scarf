"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, LockKeyhole, Minus, Plus, ShoppingBag as BagIcon, Trash2 } from "lucide-react";
import { cartRequest, checkout } from "@/lib/commerce/cart-client";
import type { CartSummary } from "@/lib/commerce/cart-types";

export function ShoppingBag() {
  const [cart, setCart] = useState<CartSummary | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const busy = useRef(false);
  useEffect(() => { let active = true; cartRequest().then((data) => { if (active) setCart(data); }).catch((error) => { if (active) setError(error.message); }); return () => { active = false; }; }, []);
  async function change(method: string, body?: object) {
    if (busy.current) return;
    busy.current = true; setPending(true); setError("");
    try { setCart(await cartRequest(method, body)); } catch (error) { setError(error instanceof Error ? error.message : "Could not update your bag."); }
    finally { busy.current = false; setPending(false); }
  }
  async function proceed() {
    if (busy.current) return;
    busy.current = true; setPending(true); setError("");
    try { await checkout(); } catch (error) { setError(error instanceof Error ? error.message : "Checkout is unavailable."); }
    finally { busy.current = false; setPending(false); }
  }
  return <div className="pb-20 pt-10 sm:pt-16 [&_button]:cursor-pointer [&_button]:disabled:cursor-not-allowed [&_button]:disabled:opacity-40 [&_button]:focus-visible:outline-2 [&_button]:focus-visible:outline-brand-gold-ink">
    <p className="text-xs uppercase tracking-[0.2em] text-brand-gold-ink">Your considered collection</p>
    <div className="mt-3 flex flex-wrap items-end justify-between gap-4"><h1 className="font-heading text-4xl font-light sm:text-5xl">Your shopping bag<span className="ml-3 text-xl text-[#82796a]">{cart ? `(${cart.count})` : ""}</span></h1><Link href="/collections/all" className="text-sm underline underline-offset-4">Continue exploring</Link></div>
    {error ? <div role="alert" className="mt-6 rounded border border-[#d9b6ad] bg-[#f8efeb] p-4 text-sm leading-6">{error}<button type="button" disabled={pending} onClick={() => change("GET")} className="ml-3 underline">Refresh bag</button></div> : null}
    {!cart && !error ? <p role="status" className="py-20 text-center text-[#71695d]">Loading your bag…</p> : null}
    {cart && !cart.items.length ? <div className="my-10 rounded-2xl border border-brand-gold-line bg-white px-5 py-16 text-center"><BagIcon className="mx-auto size-10 text-brand-gold-ink" strokeWidth={1} /><h2 className="mt-6 font-heading text-2xl font-light">A little space for something lovely.</h2><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#71695d]">{cart.ready ? "Your bag is empty. Explore our scarves and choose the shade that feels like you." : "Our online store is being connected. Explore the collection and preview your favourite colours in the meantime."}</p><Link href="/collections/all" className="mt-7 inline-flex min-h-12 items-center gap-5 rounded bg-brand-gold-ink px-7 text-sm text-white">Explore scarves<ArrowRight className="size-4" /></Link></div> : null}
    {cart?.items.length ? <div className="mt-10 grid gap-10 lg:grid-cols-[1.7fr_1fr]">
      <div className="divide-y divide-brand-gold-line border-y border-brand-gold-line">{cart.items.map((item) => <article key={item.key} className="flex gap-4 py-6 sm:gap-6"><div className="relative aspect-[4/5] w-24 shrink-0 overflow-hidden rounded bg-[#eee8df] sm:w-32">{item.image ? <Image src={item.image} alt={item.name} fill sizes="128px" className="object-cover" /> : <BagIcon className="m-auto mt-10 size-7 text-brand-gold-ink" />}</div><div className="min-w-0 flex-1"><h2 className="font-heading text-base sm:text-lg">{item.name}</h2><p className="mt-2 text-xs leading-5 text-[#71695d]">{item.options}</p><p className="mt-3 text-sm">{item.total}</p><div className="mt-4 flex flex-wrap items-center gap-4"><div className="flex items-center rounded border border-brand-gold-line [&_button]:flex [&_button]:size-10 [&_button]:items-center [&_button]:justify-center"><button type="button" aria-label={`Decrease ${item.name}`} disabled={pending || !item.editable || item.quantity <= item.minimum} onClick={() => change("PATCH", { key: item.key, quantity: item.quantity - 1 })}><Minus className="size-3" /></button><span className="w-7 text-center text-xs">{item.quantity}</span><button type="button" aria-label={`Increase ${item.name}`} disabled={pending || !item.editable || item.quantity >= item.maximum} onClick={() => change("PATCH", { key: item.key, quantity: item.quantity + 1 })}><Plus className="size-3" /></button></div><button type="button" aria-label={`Remove ${item.name}`} disabled={pending} onClick={() => change("DELETE", { key: item.key })} className="flex min-h-10 items-center gap-2 text-xs text-[#71695d]"><Trash2 className="size-3.5" />Remove</button></div></div></article>)}</div>
      <aside className="self-start rounded-xl bg-[#f1ece2] p-6 sm:p-8"><h2 className="font-heading text-2xl font-light">A lovely choice.</h2><dl className="mt-7 grid grid-cols-2 gap-y-4 text-sm [&_dd]:text-right"><dt>Items subtotal</dt><dd>{cart.subtotal}</dd><dt>Current total</dt><dd>{cart.total}</dd></dl><p className="mt-5 border-t border-brand-gold-line pt-4 text-xs leading-6 text-[#71695d]">Final delivery charges, taxes and payment options are calculated on our secure WooCommerce checkout.</p>{cart.errors.map((message) => <p key={message} role="alert" className="mt-3 text-sm text-[#8b4541]">{message}</p>)}<button type="button" onClick={proceed} disabled={pending || !!error || !!cart.errors.length} className="mt-6 flex min-h-13 w-full items-center justify-center gap-3 rounded bg-brand-gold-ink px-4 text-sm text-white">{pending ? "Please wait…" : "Continue to checkout"}<ArrowRight className="size-4" /></button><p className="mt-4 flex items-center justify-center gap-2 text-xs text-[#71695d]"><LockKeyhole className="size-3.5" />Payments handled by WooCommerce</p></aside>
    </div> : null}
  </div>;
}
