import "server-only";
import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { commerceReady, wooBaseUrl } from "@/lib/commerce/config";
import { money, type CartSummary } from "@/lib/commerce/cart-types";
import { plainText } from "@/lib/commerce/normalize-product";

export const CART_COOKIE = "hs_woo_cart";
type WooCart = {
  items: { key: string; id: number; name: string; quantity: number; images: { src: string }[]; variation: { attribute: string; value: string }[]; quantity_limits: { minimum: number; maximum: number; editable: boolean }; totals: { line_total: string; currency_code: string; currency_minor_unit: number } }[];
  items_count: number; errors: { message: string }[];
  needs_payment: boolean;
  needs_shipping: boolean;
  payment_methods: string[];
  totals: { total_items: string; total_price: string; currency_code: string; currency_minor_unit: number };
};
export class CommerceError extends Error { constructor(message: string, public status = 400) { super(message); } }
export async function storeCart(action = "", body?: object): Promise<WooCart> {
  if (!commerceReady()) throw new CommerceError("Online shopping is not connected yet.", 503);
  const jar = await cookies();
  let token = jar.get(CART_COOKIE)?.value;
  async function call(path: string, data?: object) {
    const endpoint = new URL(`/wp-json/wc/store/v1/cart${path}`, wooBaseUrl());
    // Some managed WordPress hosts cache anonymous REST GETs despite WooCommerce's
    // no-store response. A unique query key prevents users sharing a stale cart token.
    if (!data) endpoint.searchParams.set("hs_request", randomUUID());
    const response = await fetch(endpoint, { method: data ? "POST" : "GET", headers: { "Content-Type": "application/json", "Cache-Control": "no-cache, no-store", Pragma: "no-cache", ...(token ? { "Cart-Token": token } : {}) }, body: data ? JSON.stringify(data) : undefined, cache: "no-store", redirect: "error", signal: AbortSignal.timeout(15000) });
    if (response.status === 401 || response.status === 403) {
      jar.delete(CART_COOKIE);
      throw new CommerceError("Your shopping session expired. Reload your bag before adding again.", 409);
    }
    const result = await response.json();
    if (!response.ok) throw new CommerceError(plainText(result.message || "WooCommerce could not update your bag."), response.status >= 500 ? 502 : 400);
    token = response.headers.get("Cart-Token") || token;
    if (!token) throw new CommerceError("WooCommerce did not return a cart session.", 502);
    jar.set(CART_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 2 });
    return result as WooCart;
  }
  if (!token && body) await call("");
  return call(action, body);
}
export function summarizeCart(cart: WooCart): CartSummary {
  const format = (amount: string) => money(amount, cart.totals.currency_code, cart.totals.currency_minor_unit);
  return {
    ready: true,
    count: cart.items_count,
    subtotal: format(cart.totals.total_items),
    total: format(cart.totals.total_price),
    errors: (cart.errors || []).map((error) => plainText(error.message)),
    needsPayment: Boolean(cart.needs_payment),
    needsShipping: Boolean(cart.needs_shipping),
    paymentMethods: Array.isArray(cart.payment_methods) ? cart.payment_methods.filter((method) => typeof method === "string") : [],
    items: cart.items.map((item) => ({ key: item.key, id: item.id, name: plainText(item.name), quantity: item.quantity, image: item.images[0]?.src || null, options: item.variation.map((option) => `${plainText(option.attribute)}: ${plainText(option.value)}`).join(" · "), total: money(item.totals.line_total, item.totals.currency_code, item.totals.currency_minor_unit), minimum: item.quantity_limits.minimum, maximum: Math.min(99, item.quantity_limits.maximum), editable: item.quantity_limits.editable })),
  };
}
