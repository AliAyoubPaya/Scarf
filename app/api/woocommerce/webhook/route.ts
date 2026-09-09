import { verifyWebhook } from "@/lib/commerce/security";
import { syncProduct } from "@/lib/commerce/sync";

export const runtime = "nodejs";
export async function POST(request: Request) {
  const raw = await request.text();
  if (Buffer.byteLength(raw) > 2_000_000) return Response.json({ error: "Payload too large" }, { status: 413 });
  if (!verifyWebhook(raw, request.headers.get("x-wc-webhook-signature") || "", process.env.WOOCOMMERCE_WEBHOOK_SECRET || "")) return Response.json({ error: "Invalid signature" }, { status: 401 });
  try {
    // WooCommerce sends an initial form-encoded webhook ping on activation.
    if (new URLSearchParams(raw).has("webhook_id")) return Response.json({ received: true });
    const topic = request.headers.get("x-wc-webhook-topic");
    if (!["product.created", "product.updated", "product.deleted", "product.restored"].includes(topic || "")) return Response.json({ error: "Unsupported topic" }, { status: 400 });
    const payload = JSON.parse(raw);
    const id = payload.parent_id || payload.id;
    if (!Number.isSafeInteger(id) || id < 1) return Response.json({ error: "Invalid product" }, { status: 400 });
    // Missing Woo products are marked deletion-pending. Their snapshots stay
    // visible until an authenticated admin explicitly approves removal.
    return Response.json(await syncProduct(id));
  } catch { return Response.json({ error: "Sync failed; delivery can be retried." }, { status: 503 }); }
}
