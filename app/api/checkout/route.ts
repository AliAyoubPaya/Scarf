import { cookies } from "next/headers";
import { commerceReady, wooBaseUrl } from "@/lib/commerce/config";
import { sameOrigin } from "@/lib/commerce/security";
import { CART_COOKIE, CommerceError, storeCart, summarizeCart } from "@/lib/commerce/woo-cart";
import { plainText } from "@/lib/commerce/normalize-product";

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
    const token = (await cookies()).get(CART_COOKIE)?.value;
    if (!token) return json({ error: "Your bag session has expired. Reload your bag and try again." }, 409);
    const address = { first_name: firstName, last_name: lastName, company: "", address_1: address1, address_2: address2, city, state, postcode, country, phone };
    const checkoutCart = summarizeCart(await storeCart("/update-customer", { billing_address: { ...address, email }, shipping_address: address }));
    if (checkoutCart.errors.length) return json({ error: checkoutCart.errors[0] }, 409);
    if (checkoutCart.needsPayment && (!paymentPattern.test(paymentMethod) || !checkoutCart.paymentMethods.includes(paymentMethod))) return json({ error: "Choose an available WooCommerce payment method." }, 409);
    const response = await fetch(new URL("/wp-json/wc/store/v1/checkout", wooBaseUrl()), {
      method: "POST",
      headers: { "Content-Type": "application/json", "Cart-Token": token, "Cache-Control": "no-store" },
      body: JSON.stringify({ billing_address: { ...address, email }, shipping_address: address, customer_note: customerNote, create_account: false, payment_method: checkoutCart.needsPayment ? paymentMethod : "", payment_data: [] }),
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(20000),
    });
    const result = await response.json();
    if (!response.ok) return json({ error: clean(result.message, 300) || "WooCommerce could not place the order." }, response.status >= 500 ? 502 : 400);
    const rawRedirect = clean(result.payment_result?.redirect_url, 2000);
    let redirectUrl: string | null = null;
    if (rawRedirect) {
      const target = new URL(rawRedirect, wooBaseUrl());
      if (target.protocol !== "https:") throw new Error("Unsafe payment redirect");
      redirectUrl = target.href;
    }
    return json({ orderId: Number(result.order_id), orderNumber: clean(String(result.order_number || result.order_id), 80), status: clean(result.status, 40), redirectUrl });
  } catch (error) {
    return json({ error: error instanceof CommerceError ? error.message : "Your order could not be placed. Your bag is unchanged; please try again." }, error instanceof CommerceError ? error.status : 502);
  }
}
