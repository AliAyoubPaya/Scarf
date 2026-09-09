import { equalSecret } from "@/lib/commerce/security";
import { syncPage, syncProduct } from "@/lib/commerce/sync";

export const runtime = "nodejs";
export const maxDuration = 300;
export async function POST(request: Request) {
  const configuredSecret = process.env.CATALOG_SYNC_SECRET || "";
  if (configuredSecret.length < 32 || !equalSecret(request.headers.get("x-catalog-sync-secret") || "", configuredSecret)) return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    if (body.productId !== undefined) {
      if (!Number.isSafeInteger(body.productId) || body.productId < 1) return Response.json({ error: "Invalid product ID" }, { status: 400 });
      return Response.json(await syncProduct(body.productId));
    }
    const page = body.page ?? 1;
    if (!Number.isSafeInteger(page) || page < 1 || page > 10000) return Response.json({ error: "Invalid page" }, { status: 400 });
    return Response.json(await syncPage(page));
  } catch { return Response.json({ error: "Sync failed. Check the server configuration and WooCommerce connection, then retry this batch." }, { status: 502 }); }
}
