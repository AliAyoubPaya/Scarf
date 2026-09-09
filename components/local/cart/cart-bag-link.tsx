"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { cartRequest } from "@/lib/commerce/cart-client";
import type { CartSummary } from "@/lib/commerce/cart-types";

export function CartBagLink({ className }: { className: string }) {
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    let active = true;
    const update = (event: Event) => { if (active) setCount((event as CustomEvent<CartSummary>).detail.count); };
    const refresh = () => { cartRequest().then((cart) => { if (active) setCount(cart.count); }).catch(() => { if (active) setCount(null); }); };
    window.addEventListener("hs:cart-updated", update);
    window.addEventListener("focus", refresh);
    refresh();
    return () => { active = false; window.removeEventListener("hs:cart-updated", update); window.removeEventListener("focus", refresh); };
  }, []);
  return <Link href="/cart" className={className + " relative"} aria-label={count === null ? "Shopping bag" : `Shopping bag, ${count} items`}><ShoppingBag aria-hidden="true" className="size-[1.18rem]" strokeWidth={1.4} />{count !== null ? <span className="absolute right-0.5 top-1.5 flex min-w-[1.05rem] items-center justify-center rounded-full bg-brand-gold-ink px-1 font-paragraph text-[0.58rem] leading-[1.05rem] text-white">{count}</span> : null}</Link>;
}
