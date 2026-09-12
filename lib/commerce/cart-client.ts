import type { CartSummary } from "@/lib/commerce/cart-types";

export async function cartRequest(method = "GET", body?: object): Promise<CartSummary> {
  const response = await fetch("/api/cart", { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined, cache: "no-store" });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Your bag could not be updated.");
  window.dispatchEvent(new CustomEvent("hs:cart-updated", { detail: result }));
  return result;
}
export type CheckoutDetails = {
  firstName: string; lastName: string; email: string; phone: string;
  address1: string; address2: string; city: string; state: string; postcode: string;
  country: string; customerNote: string; paymentMethod: string;
};
export async function placeOrder(details: CheckoutDetails) {
  const response = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(details) });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Your order could not be placed.");
  return result as { orderId: number; orderNumber: string; status: string; redirectUrl: string | null };
}
