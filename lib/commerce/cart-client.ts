import type { CartSummary } from "@/lib/commerce/cart-types";

export async function cartRequest(method = "GET", body?: object): Promise<CartSummary> {
  const response = await fetch("/api/cart", { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined, cache: "no-store" });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Your bag could not be updated.");
  window.dispatchEvent(new CustomEvent("hs:cart-updated", { detail: result }));
  return result;
}
export async function checkout() {
  const response = await fetch("/api/checkout", { method: "POST" });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Checkout is unavailable.");
  window.location.assign(result.url);
}
