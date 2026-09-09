import { createHmac, randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { sameOrigin } from "@/lib/commerce/security";
import { commerceReady, wooBaseUrl } from "@/lib/commerce/config";
import { CART_COOKIE, CommerceError, storeCart } from "@/lib/commerce/woo-cart";

export const runtime = "nodejs";
export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Invalid request origin" }, { status: 403 });
  if (!commerceReady()) return Response.json({ error: "WooCommerce checkout is not connected yet." }, { status: 503 });
  try {
    const cart = await storeCart();
    if (!cart.items.length || cart.errors?.length) return Response.json({ error: "Please review your bag before checkout." }, { status: 409 });
    const payload = JSON.stringify({ issuedAt: Math.floor(Date.now() / 1000), nonce: randomUUID(), cartToken: (await cookies()).get(CART_COOKIE)?.value });
    const signature = createHmac("sha256", process.env.WOO_CHECKOUT_SECRET!).update(payload).digest("hex");
    const response = await fetch(`${wooBaseUrl()}/wp-json/hs-store/v1/checkout-session`, { method: "POST", headers: { "Content-Type": "application/json", "X-HS-Signature": signature }, body: payload, redirect: "error", cache: "no-store", signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error("Checkout bridge failed");
    const { url } = await response.json();
    const target = new URL(url);
    if (target.origin !== new URL(wooBaseUrl()).origin || target.protocol !== "https:" || !/^[a-f0-9]{64}$/.test(target.searchParams.get("hs_checkout") || "")) throw new Error("Invalid checkout destination");
    return Response.json({ url: target.href }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) { return Response.json({ error: error instanceof CommerceError ? error.message : "Checkout could not be opened. Your bag is unchanged; please try again." }, { status: 502 }); }
}
