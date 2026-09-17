export type CartLine = { key: string; id: number; name: string; quantity: number; image: string | null; options: string; total: string; minimum: number; maximum: number; editable: boolean };
export type CartCoupon = { code: string; discount: string };
export type CartSummary = {
  ready: boolean;
  items: CartLine[];
  count: number;
  coupons: CartCoupon[];
  subtotal: string;
  discount: string;
  hasDiscount: boolean;
  shipping: string;
  tax: string;
  total: string;
  errors: string[];
  needsPayment: boolean;
  needsShipping: boolean;
  paymentMethods: string[];
};
export const emptyCart: CartSummary = {
  ready: false,
  items: [],
  count: 0,
  coupons: [],
  subtotal: "Rs. 0",
  discount: "Rs. 0",
  hasDiscount: false,
  shipping: "Rs. 0",
  tax: "Rs. 0",
  total: "Rs. 0",
  errors: [],
  needsPayment: false,
  needsShipping: false,
  paymentMethods: [],
};
export function money(amount: string, currency: string, decimals: number) { return new Intl.NumberFormat("en-PK", { style: "currency", currency }).format(Number(amount) / 10 ** decimals); }
