export type CartLine = { key: string; id: number; name: string; quantity: number; image: string | null; options: string; total: string; minimum: number; maximum: number; editable: boolean };
export type CartSummary = { ready: boolean; items: CartLine[]; count: number; subtotal: string; total: string; errors: string[] };
export const emptyCart: CartSummary = { ready: false, items: [], count: 0, subtotal: "Rs. 0", total: "Rs. 0", errors: [] };
export function money(amount: string, currency: string, decimals: number) { return new Intl.NumberFormat("en-PK", { style: "currency", currency }).format(Number(amount) / 10 ** decimals); }
