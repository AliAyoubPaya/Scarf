import { cookies } from "next/headers";
import { commerceReady, wooBaseUrl } from "@/lib/commerce/config";
import { sameOrigin } from "@/lib/commerce/security";
import { CART_COOKIE, CommerceError, storeCart, summarizeCart } from "@/lib/commerce/woo-cart";
import { plainText } from "@/lib/commerce/normalize-product";
import { encodeOrderConfirmationSession, ORDER_CONFIRMATION_COOKIE } from "@/lib/commerce/order-confirmation";

export const runtime = "nodejs";
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "private, no-store" } });
const clean = (value: unknown, maximum: number) => typeof value === "string" ? plainText(value).trim().slice(0, maximum) : "";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const countryPattern = /^[A-Z]{2}$/;
const paymentPattern = /^[a-z0-9_-]{1,80}$/i;

export async function GET() {
  try {
    if (!commerceReady()) return json({ error: "WooCommerce checkout is not connected yet." }, 503);
    return json(summarizeCart(await storeCart()));
  } catch (error) {
    return json({ error: error instanceof CommerceError ? error.message : "Checkout details could not be loaded." }, error instanceof CommerceError ? error.status : 502);
  }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Invalid request origin" }, 403);
  if (!commerceReady()) return json({ error: "WooCommerce checkout is not connected yet." }, 503);
  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > 16000) return json({ error: "Checkout details are too large." }, 413);
  try {
    const summary = summarizeCart(await storeCart());
    if (!summary.items.length || summary.errors.length) return json({ error: "Please review your bag before placing the order." }, 409);
    const body = await request.json();
    const firstName = clean(body.firstName, 80), lastName = clean(body.lastName, 80), email = clean(body.email, 160);
    const phone = clean(body.phone, 40), address1 = clean(body.address1, 180), address2 = clean(body.address2, 180);
    const city = clean(body.city, 100), state = clean(body.state, 100), postcode = clean(body.postcode, 24);
    const country = clean(body.country, 2).toUpperCase(), customerNote = clean(body.customerNote, 500);
    const paymentMethod = clean(body.paymentMethod, 80);
    if (!firstName || !lastName || !emailPattern.test(email) || !phone || !address1 || !city || !state || !postcode || !countryPattern.test(country)) return json({ error: "Complete the required contact and delivery fields." }, 400);
    const jar = await cookies();
    const token = jar.get(CART_COOKIE)?.value;
    if (!token) return json({ error: "Your bag session has expired. Reload your bag and try again." }, 409);
    const address = { first_name: firstName, last_name: lastName, company: "", address_1: address1, address_2: address2, city, state, postcode, country, phone };
    const updatedCart = await storeCart("/update-customer", { billing_address: { ...address, email }, shipping_address: address });
    const checkoutCart = summarizeCart(updatedCart);
    if (checkoutCart.errors.length) return json({ error: checkoutCart.errors[0] }, 409);
    if (checkoutCart.needsPayment && (!paymentPattern.test(paymentMethod) || !checkoutCart.paymentMethods.includes(paymentMethod))) return json({ error: "Choose an available WooCommerce payment method." }, 409);
    const response = await fetch(new URL("/wp-json/wc/store/v1/checkout", wooBaseUrl()), {
      method: "POST",
      headers: { "Content-Type": "application/json", "Cart-Token": token, "Cache-Control": "no-store" },
      body: JSON.stringify({ billing_address: { ...address, email }, shipping_address: address, customer_note: customerNote, create_account: false, payment_method: checkoutCart.needsPayment ? paymentMethod : "", payment_data: [], expected_total: updatedCart.totals.total_price }),
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(20000),
    });
    const result = await response.json();
    if (!response.ok) return json({ error: clean(result.message, 300) || "WooCommerce could not place the order." }, response.status >= 500 ? 502 : 400);
    const orderId = Number(result.order_id);
    const orderKey = clean(result.order_key, 120);
    const orderNumber = clean(String(result.order_number || result.order_id), 80);
    if (!Number.isSafeInteger(orderId) || orderId <= 0 || !/^wc_order_[A-Za-z0-9]+$/.test(orderKey)) throw new Error("WooCommerce returned an invalid order confirmation.");
    jar.set(ORDER_CONFIRMATION_COOKIE, encodeOrderConfirmationSession({ id: orderId, key: orderKey, email, number: orderNumber, paymentMethod, note: customerNote, createdAt: new Date().toISOString() }), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 });
    jar.delete(CART_COOKIE);
    const rawRedirect = clean(result.payment_result?.redirect_url, 2000);
    let redirectUrl: string | null = `/order-confirmation/${orderId}`;
    if (rawRedirect) {
      const target = new URL(rawRedirect, wooBaseUrl());
      if (target.protocol !== "https:") throw new Error("Unsafe payment redirect");
      const wooOrigin = new URL(wooBaseUrl()).origin;
      const isWooReceipt = target.origin === wooOrigin && /\/checkout\/order-received\//.test(target.pathname);
      if (!isWooReceipt) redirectUrl = target.href;
    }
    return json({ orderId, orderNumber, status: clean(result.status, 40), redirectUrl });
  } catch (error) {
    return json({ error: error instanceof CommerceError ? error.message : "Your order could not be placed. Your bag is unchanged; please try again." }, error instanceof CommerceError ? error.status : 502);
  }
}
