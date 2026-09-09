import { cookies } from "next/headers";
import { getCatalogProducts } from "@/lib/catalog/get-collection-catalog";
import { commerceReady } from "@/lib/commerce/config";
import { emptyCart } from "@/lib/commerce/cart-types";
import { sameOrigin, validQuantity } from "@/lib/commerce/security";
import { CART_COOKIE, CommerceError, storeCart, summarizeCart } from "@/lib/commerce/woo-cart";

export const runtime = "nodejs";
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "private, no-store" } });
function failure(error: unknown) { return json({ error: error instanceof CommerceError ? error.message : "We could not confirm the cart update. Refresh your bag before trying again." }, error instanceof CommerceError ? error.status : 502); }
export async function GET() {
  try {
    if (!commerceReady() || !(await cookies()).has(CART_COOKIE)) return json({ ...emptyCart, ready: commerceReady() });
    return json(summarizeCart(await storeCart()));
  } catch (error) { return failure(error); }
}
export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Invalid request origin" }, 403);
  if (!commerceReady()) return json({ error: "WooCommerce is not connected yet. This catalog is a preview." }, 503);
  try {
    const body = await request.json();
    if (typeof body.slug !== "string" || typeof body.variantId !== "string" || !validQuantity(body.quantity)) return json({ error: "Choose a product option and a quantity between 1 and 99." }, 400);
    const product = (await getCatalogProducts()).find((item) => item.slug === body.slug);
    const variant = product?.variants?.find((item) => item.id === body.variantId);
    if (!product?.commerce?.synced || !variant?.wooId || !variant.purchasable || variant.stockStatus === "sold-out") return json({ error: "This product option is not available. Please refresh and choose another." }, 409);
    // Only server-resolved IDs and quantity go upstream. WooCommerce owns the final price and inventory check.
    return json(summarizeCart(await storeCart("/add-item", { id: variant.wooId, quantity: body.quantity })));
  } catch (error) { return failure(error); }
}
async function modify(request: Request, remove = false) {
  if (!sameOrigin(request)) return json({ error: "Invalid request origin" }, 403);
  try {
    const body = await request.json();
    if (typeof body.key !== "string" || !/^[a-f0-9]{32}$/.test(body.key) || (!remove && !validQuantity(body.quantity))) return json({ error: "Invalid cart item" }, 400);
    if (!(await cookies()).has(CART_COOKIE)) return json({ error: "Your bag session has expired. Reload your bag." }, 409);
    return json(summarizeCart(await storeCart(remove ? "/remove-item" : "/update-item", remove ? { key: body.key } : { key: body.key, quantity: body.quantity })));
  } catch (error) { return failure(error); }
}
export async function PATCH(request: Request) { return modify(request); }
export async function DELETE(request: Request) { return modify(request, true); }
